import { ZodError } from 'zod';
import { CurriculumData } from '@/types/curriculum';
import {
  CurriculumDataSchema,
  VersionedCurriculumSchema,
  PersonalInfoSchema,
  ProfessionalObjectiveSchema,
  EducationSchema,
  ExperienceSchema,
  SkillSchema,
  LanguageSchema,
  CourseSchema,
  ProjectSchema,
  AchievementSchema
} from '@/schemas/curriculumSchema';

// Versão atual do schema
const CURRENT_VERSION = 1;

// Chaves do localStorage
export const STORAGE_KEYS = {
  CURRICULUM: 'cvgratis-curriculum',
  CURRICULUM_BACKUP: 'cvgratis-curriculum-backup',
  CURRICULUM_VERSION: 'cvgratis-curriculum-version',
  CURRICULUM_BACKUPS: 'cvgratis-curriculum-backups',
};

// Interface para resultado de validação
export interface ValidationResult {
  isValid: boolean;
  data: CurriculumData | null;
  errors: ValidationError[];
  warnings: string[];
  recoveredFields: string[];
}

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

// Interface para backup
interface CurriculumBackup {
  timestamp: string;
  data: CurriculumData;
  version: number;
}

/**
 * Valida os dados do currículo usando Zod
 * @param data - Dados a serem validados
 * @returns Resultado da validação com dados válidos ou recuperados
 */
export function validateCurriculumData(data: unknown): ValidationResult {
  const result: ValidationResult = {
    isValid: false,
    data: null,
    errors: [],
    warnings: [],
    recoveredFields: [],
  };

  try {
    // Valida o schema completo
    const validatedData = CurriculumDataSchema.parse(data);
    result.isValid = true;
    result.data = validatedData as CurriculumData;

    console.log('✅ Dados do currículo validados com sucesso');
    return result;
  } catch (error) {
    if (error instanceof ZodError) {
      // Extrai os erros de validação
      result.errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        value: err.path.length > 0 ? getNestedValue(data, err.path) : data,
      }));

      console.warn('⚠️ Erros de validação encontrados:', result.errors);

      // Tenta recuperar campos válidos
      const recoveredData = recoverValidFields(data, result);

      if (recoveredData) {
        result.data = recoveredData;
        result.warnings.push('Alguns campos foram recuperados ou resetados para valores padrão');
        console.log('🔧 Dados parcialmente recuperados:', result.recoveredFields);
      }
    } else {
      result.errors.push({
        field: 'unknown',
        message: 'Erro desconhecido durante a validação',
        value: data,
      });
      console.error('❌ Erro desconhecido durante validação:', error);
    }

    return result;
  }
}

/**
 * Tenta recuperar campos válidos de dados corrompidos
 * @param data - Dados corrompidos
 * @param result - Resultado da validação em andamento
 * @returns Dados recuperados ou null se não foi possível recuperar
 */
function recoverValidFields(data: unknown, result: ValidationResult): CurriculumData | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const dataObj = data as Record<string, unknown>;
  const recovered: Partial<CurriculumData> = {};

  // Tenta recuperar cada seção individualmente
  try {
    const personalInfo = PersonalInfoSchema.parse(dataObj.personalInfo);
    recovered.personalInfo = personalInfo;
    result.recoveredFields.push('personalInfo');
  } catch {
    console.warn('❌ Não foi possível recuperar personalInfo');
    recovered.personalInfo = {
      name: '',
      email: '',
      phone: '',
      whatsapp: '',
      address: '',
    };
  }

  try {
    const objective = ProfessionalObjectiveSchema.parse(dataObj.objective);
    recovered.objective = objective;
    result.recoveredFields.push('objective');
  } catch {
    console.warn('❌ Não foi possível recuperar objective');
    recovered.objective = {
      keywords: '',
      description: '',
    };
  }

  // Recupera arrays de forma segura
  recovered.education = recoverArrayField(dataObj.education, EducationSchema, 'education', result);
  recovered.experience = recoverArrayField(dataObj.experience, ExperienceSchema, 'experience', result);
  recovered.skills = recoverArrayField(dataObj.skills, SkillSchema, 'skills', result);
  recovered.languages = recoverArrayField(dataObj.languages, LanguageSchema, 'languages', result);
  recovered.courses = recoverArrayField(dataObj.courses, CourseSchema, 'courses', result);
  recovered.projects = recoverArrayField(dataObj.projects, ProjectSchema, 'projects', result);
  recovered.achievements = recoverArrayField(dataObj.achievements, AchievementSchema, 'achievements', result);

  return recovered as CurriculumData;
}

/**
 * Recupera itens válidos de um array
 */
function recoverArrayField<T>(
  field: unknown,
  schema: { parse: (value: unknown) => T },
  fieldName: string,
  result: ValidationResult
): T[] {
  if (!Array.isArray(field)) {
    return [];
  }

  const recovered: T[] = [];
  let validCount = 0;

  field.forEach((item, index) => {
    try {
      const validItem = schema.parse(item);
      recovered.push(validItem);
      validCount++;
    } catch {
      console.warn(`❌ Item ${index} de ${fieldName} é inválido e será removido`);
    }
  });

  if (validCount > 0) {
    result.recoveredFields.push(`${fieldName} (${validCount}/${field.length} itens)`);
  }

  return recovered;
}

/**
 * Limpa dados corrompidos do localStorage
 * @param storageKey - Chave do localStorage
 * @returns Dados limpos ou null se não houver dados
 */
export function sanitizeStorageData(storageKey: string = STORAGE_KEYS.CURRICULUM): CurriculumData | null {
  try {
    const rawData = localStorage.getItem(storageKey);

    if (!rawData) {
      console.log('ℹ️ Nenhum dado encontrado no localStorage');
      return null;
    }

    // Tenta fazer parse seguro
    const parsedData = safeJsonParse(rawData, null);

    if (!parsedData) {
      console.warn('⚠️ Dados corrompidos detectados - limpando localStorage');
      localStorage.removeItem(storageKey);
      return null;
    }

    // Valida os dados
    const validation = validateCurriculumData(parsedData);

    if (validation.isValid && validation.data) {
      console.log('✅ Dados do localStorage são válidos');
      return validation.data;
    }

    if (validation.data && validation.recoveredFields.length > 0) {
      console.log('🔧 Dados recuperados parcialmente:', validation.recoveredFields);
      // Salva os dados recuperados
      localStorage.setItem(storageKey, JSON.stringify(validation.data));
      return validation.data;
    }

    console.warn('❌ Não foi possível recuperar dados - limpando localStorage');
    localStorage.removeItem(storageKey);
    return null;

  } catch (error) {
    console.error('❌ Erro ao sanitizar dados:', error);
    localStorage.removeItem(storageKey);
    return null;
  }
}

/**
 * Migra dados de versões antigas para a versão atual
 * @param data - Dados a serem migrados
 * @returns Dados migrados
 */
export function migrateOldData(data: unknown): CurriculumData {
  if (!data || typeof data !== 'object') {
    return getDefaultCurriculumData();
  }

  const dataObj = data as Record<string, unknown>;

  // Verifica se há versionamento
  const version = typeof dataObj.version === 'number' ? dataObj.version : 0;

  console.log(`🔄 Migrando dados da versão ${version} para ${CURRENT_VERSION}`);

  // Migração da versão 0 para 1
  if (version === 0) {
    // Adiciona novos campos que podem não existir em versões antigas
    if (dataObj.personalInfo && typeof dataObj.personalInfo === 'object') {
      const personalInfo = dataObj.personalInfo as Record<string, unknown>;

      // Adiciona campos novos com valores padrão se não existirem
      if (!('hasDriverLicense' in personalInfo)) {
        personalInfo.hasDriverLicense = false;
      }
      if (!('driverLicenseCategories' in personalInfo)) {
        personalInfo.driverLicenseCategories = [];
      }
      if (!('isRoundPhoto' in personalInfo)) {
        personalInfo.isRoundPhoto = true;
      }
    }
  }

  // Valida os dados migrados
  const validation = validateCurriculumData(dataObj);

  if (validation.data) {
    return validation.data;
  }

  console.warn('⚠️ Migração falhou - retornando dados padrão');
  return getDefaultCurriculumData();
}

/**
 * Parse seguro de JSON com tratamento de erros
 * @param jsonString - String JSON a ser parseada
 * @param defaultValue - Valor padrão em caso de erro
 * @returns Objeto parseado ou valor padrão
 */
export function safeJsonParse<T = unknown>(
  jsonString: string | null | undefined,
  defaultValue: T | null = null
): T | null {
  if (!jsonString || jsonString === 'undefined' || jsonString === 'null') {
    console.warn('⚠️ safeJsonParse: Valor inválido recebido:', jsonString);
    return defaultValue;
  }

  try {
    const parsed = JSON.parse(jsonString);
    return parsed as T;
  } catch (error) {
    console.error('❌ safeJsonParse: Erro ao fazer parse do JSON:', {
      preview: jsonString.substring(0, 100),
      error: error instanceof Error ? error.message : error,
    });
    return defaultValue;
  }
}

/**
 * Cria um backup dos dados atuais
 * @param data - Dados a serem salvos
 */
export function createBackup(data: CurriculumData): void {
  try {
    const backup: CurriculumBackup = {
      timestamp: new Date().toISOString(),
      data,
      version: CURRENT_VERSION,
    };

    // Salva backup individual
    localStorage.setItem(STORAGE_KEYS.CURRICULUM_BACKUP, JSON.stringify(backup));

    // Mantém histórico dos últimos 3 backups
    const backupsKey = STORAGE_KEYS.CURRICULUM_BACKUPS;
    const existingBackups = safeJsonParse<CurriculumBackup[]>(
      localStorage.getItem(backupsKey),
      []
    ) || [];

    existingBackups.unshift(backup);

    // Mantém apenas os 3 mais recentes
    const limitedBackups = existingBackups.slice(0, 3);

    localStorage.setItem(backupsKey, JSON.stringify(limitedBackups));

    console.log('💾 Backup criado com sucesso:', backup.timestamp);
  } catch (error) {
    console.error('❌ Erro ao criar backup:', error);
  }
}

/**
 * Restaura o backup mais recente
 * @returns Dados do backup ou null se não houver backup
 */
export function restoreLatestBackup(): CurriculumData | null {
  try {
    const backup = safeJsonParse<CurriculumBackup>(
      localStorage.getItem(STORAGE_KEYS.CURRICULUM_BACKUP),
      null
    );

    if (!backup || !backup.data) {
      console.warn('⚠️ Nenhum backup encontrado');
      return null;
    }

    console.log('📥 Restaurando backup de:', backup.timestamp);
    return backup.data;
  } catch (error) {
    console.error('❌ Erro ao restaurar backup:', error);
    return null;
  }
}

/**
 * Lista todos os backups disponíveis
 * @returns Array de backups
 */
export function listBackups(): CurriculumBackup[] {
  try {
    const backups = safeJsonParse<CurriculumBackup[]>(
      localStorage.getItem(STORAGE_KEYS.CURRICULUM_BACKUPS),
      []
    );

    return backups || [];
  } catch (error) {
    console.error('❌ Erro ao listar backups:', error);
    return [];
  }
}

/**
 * Restaura um backup específico
 * @param timestamp - Timestamp do backup a ser restaurado
 * @returns Dados do backup ou null se não encontrado
 */
export function restoreBackup(timestamp: string): CurriculumData | null {
  try {
    const backups = listBackups();
    const backup = backups.find(b => b.timestamp === timestamp);

    if (!backup) {
      console.warn('⚠️ Backup não encontrado:', timestamp);
      return null;
    }

    console.log('📥 Restaurando backup de:', timestamp);
    return backup.data;
  } catch (error) {
    console.error('❌ Erro ao restaurar backup:', error);
    return null;
  }
}

/**
 * Retorna dados padrão do currículo
 */
export function getDefaultCurriculumData(): CurriculumData {
  return {
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      whatsapp: '',
      address: '',
      photo: '',
      isRoundPhoto: true,
      hasDriverLicense: false,
      driverLicenseCategories: [],
    },
    objective: {
      keywords: '',
      description: '',
    },
    education: [],
    experience: [],
    skills: [],
    languages: [],
    courses: [],
    projects: [],
    achievements: [],
  };
}

/**
 * Obtém valor aninhado de um objeto usando path
 */
function getNestedValue(obj: unknown, path: (string | number)[]): unknown {
  let current: any = obj;

  for (const key of path) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[key];
  }

  return current;
}

/**
 * Exporta dados para backup manual (JSON)
 * @param data - Dados a serem exportados
 * @returns String JSON formatada
 */
export function exportDataForBackup(data: CurriculumData): string {
  const backup = {
    version: CURRENT_VERSION,
    timestamp: new Date().toISOString(),
    data,
  };

  return JSON.stringify(backup, null, 2);
}

/**
 * Importa dados de um backup manual
 * @param jsonString - String JSON do backup
 * @returns Dados importados ou null se inválido
 */
export function importDataFromBackup(jsonString: string): CurriculumData | null {
  try {
    const parsed = safeJsonParse<{ version?: number; data: unknown }>(jsonString, null);

    if (!parsed || !parsed.data) {
      console.error('❌ Formato de backup inválido');
      return null;
    }

    // Valida os dados importados
    const validation = validateCurriculumData(parsed.data);

    if (validation.data) {
      console.log('✅ Dados importados com sucesso');
      return validation.data;
    }

    console.error('❌ Dados do backup são inválidos');
    return null;
  } catch (error) {
    console.error('❌ Erro ao importar backup:', error);
    return null;
  }
}

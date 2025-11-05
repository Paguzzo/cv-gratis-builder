/**
 * Utilitário para parsing seguro de JSON
 * Evita erros quando o valor é undefined, null ou string inválida
 */

export function safeParseJson<T = unknown>(jsonString: string | null | undefined, defaultValue: T = {} as T): T {
  // Se o valor é null, undefined ou string vazia, retorna o valor padrão
  if (!jsonString || jsonString === 'undefined' || jsonString === 'null') {
    console.warn('⚠️ safeParseJson: Valor inválido recebido:', jsonString);
    return defaultValue;
  }

  try {
    const parsed = JSON.parse(jsonString);
    return parsed;
  } catch (error) {
    console.error('❌ safeParseJson: Erro ao fazer parse do JSON:', {
      jsonString,
      error: error instanceof Error ? error.message : error
    });
    return defaultValue;
  }
}

/**
 * Versão específica para dados do currículo
 * Garante que sempre retorna uma estrutura válida
 */
export function safeParseCurriculumData(jsonString: string | null | undefined) {
  const defaultCurriculumData = {
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      whatsapp: '',
      address: '',
      photo: '',
      isRoundPhoto: true,
      hasDriverLicense: false,
      driverLicenseCategories: []
    },
    objective: {
      keywords: '',
      description: ''
    },
    experience: [],
    education: [],
    skills: [],
    languages: [],
    courses: [],
    projects: [],
    achievements: []
  };

  return safeParseJson(jsonString, defaultCurriculumData);
}

/**
 * Versão para arrays
 */
export function safeParseJsonArray<T = unknown>(jsonString: string | null | undefined): T[] {
  return safeParseJson(jsonString, [] as T[]);
}

/**
 * Versão para objetos simples
 */
export function safeParseJsonObject<T = Record<string, unknown>>(jsonString: string | null | undefined): T {
  return safeParseJson(jsonString, {} as T);
}
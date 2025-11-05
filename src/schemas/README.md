# Sistema de Validação e Integridade de Dados

## Visão Geral

Este sistema implementa validação robusta de dados usando **Zod** e oferece recuperação automática de dados corrompidos para o CV Grátis Builder.

## Arquitetura

### Componentes Principais

1. **`curriculumSchema.ts`** - Schemas de validação Zod
2. **`dataIntegrity.ts`** - Funções de validação e recuperação
3. **`CurriculumContext.tsx`** - Context com validação integrada
4. **`DataCorruptionAlert.tsx`** - UI para notificação de erros

## Schemas de Validação

### Schema Completo

```typescript
import { CurriculumDataSchema } from '@/schemas/curriculumSchema';

// Valida dados completos do currículo
const result = CurriculumDataSchema.parse(data);
```

### Schemas Parciais por Etapa

Cada etapa do formulário tem seu próprio schema:

```typescript
import {
  PersonalInfoStepSchema,
  ObjectiveStepSchema,
  EducationStepSchema,
  ExperienceStepSchema,
  SkillsStepSchema,
  LanguagesStepSchema,
  CoursesStepSchema,
  ProjectsAchievementsStepSchema
} from '@/schemas/curriculumSchema';

// Validar etapa específica
const stepData = { personalInfo: { name: 'João', email: 'joao@email.com', ... } };
const result = PersonalInfoStepSchema.parse(stepData);
```

### Schemas Individuais

```typescript
import {
  PersonalInfoSchema,
  EducationSchema,
  ExperienceSchema,
  SkillSchema,
  LanguageSchema,
  CourseSchema,
  ProjectSchema,
  AchievementSchema
} from '@/schemas/curriculumSchema';

// Validar item individual
const education = {
  id: 'uuid-here',
  course: 'Engenharia',
  institution: 'UFRJ',
  startDate: '2020-01',
  endDate: '2024-12',
  level: 'superior'
};

const validEducation = EducationSchema.parse(education);
```

## Funções de Integridade

### Validação de Dados

```typescript
import { validateCurriculumData } from '@/utils/dataIntegrity';

const validation = validateCurriculumData(userData);

if (validation.isValid) {
  console.log('Dados válidos:', validation.data);
} else {
  console.log('Erros:', validation.errors);
  console.log('Campos recuperados:', validation.recoveredFields);
  console.log('Dados parciais:', validation.data); // Pode conter dados recuperados
}
```

### Sanitização de Dados

```typescript
import { sanitizeStorageData, STORAGE_KEYS } from '@/utils/dataIntegrity';

// Limpa e valida dados do localStorage
const cleanData = sanitizeStorageData(STORAGE_KEYS.CURRICULUM);

if (cleanData) {
  console.log('Dados limpos e válidos');
} else {
  console.log('Dados corrompidos foram removidos');
}
```

### Migração de Dados

```typescript
import { migrateOldData } from '@/utils/dataIntegrity';

// Migra dados de versões antigas
const oldData = localStorage.getItem('old-curriculum-key');
const migratedData = migrateOldData(JSON.parse(oldData));
```

### Parse Seguro de JSON

```typescript
import { safeJsonParse } from '@/utils/dataIntegrity';

const data = safeJsonParse(jsonString, defaultValue);
// Nunca lança erro, sempre retorna um valor
```

## Sistema de Backup

### Backup Automático

O sistema cria backups automaticamente antes de cada atualização:

```typescript
import { createBackup } from '@/utils/dataIntegrity';

createBackup(curriculumData);
// Cria backup com timestamp no localStorage
```

### Restauração de Backup

```typescript
import { restoreLatestBackup, listBackups, restoreBackup } from '@/utils/dataIntegrity';

// Restaura o backup mais recente
const data = restoreLatestBackup();

// Lista todos os backups disponíveis
const backups = listBackups();
backups.forEach(backup => {
  console.log(backup.timestamp, backup.version);
});

// Restaura backup específico
const specificData = restoreBackup('2024-01-15T10:30:00.000Z');
```

### Exportação e Importação

```typescript
import { exportDataForBackup, importDataFromBackup } from '@/utils/dataIntegrity';

// Exportar para arquivo
const jsonBackup = exportDataForBackup(curriculumData);
const blob = new Blob([jsonBackup], { type: 'application/json' });
// ... criar download

// Importar de arquivo
const importedData = importDataFromBackup(fileContent);
if (importedData) {
  console.log('Dados importados com sucesso');
}
```

## Uso no Context

O `CurriculumContext` já possui validação integrada:

```typescript
import { useCurriculum } from '@/contexts/CurriculumContext';

function MyComponent() {
  const {
    state,
    clearCorruptionWarning,
    restoreFromBackup,
    exportData,
    importData,
    availableBackups
  } = useCurriculum();

  // Verifica se há dados corrompidos
  if (state.dataCorrupted) {
    console.log('Erros:', state.validationErrors);
    console.log('Recuperados:', state.recoveredFields);
  }

  // Restaurar backup
  const handleRestore = () => {
    const success = restoreFromBackup();
    if (success) {
      clearCorruptionWarning();
    }
  };

  // Exportar dados
  const handleExport = () => {
    const json = exportData();
    // criar arquivo para download
  };

  // Importar dados
  const handleImport = (jsonString: string) => {
    const success = importData(jsonString);
    if (success) {
      clearCorruptionWarning();
    }
  };
}
```

## Componente de Alerta

Use o componente `DataCorruptionAlert` para notificar usuários:

```typescript
import { DataCorruptionAlert } from '@/components/DataCorruptionAlert';

function App() {
  return (
    <CurriculumProvider>
      <DataCorruptionAlert />
      {/* resto da aplicação */}
    </CurriculumProvider>
  );
}
```

O componente:
- Mostra alerta fixo no topo quando detecta corrupção
- Lista campos recuperados e erros de validação
- Oferece opções de recuperação:
  - Restaurar backup automático
  - Exportar dados atuais
  - Importar backup manual
  - Resetar dados
  - Continuar com dados atuais

## Tratamento de Erros

### Estrutura de Erro de Validação

```typescript
interface ValidationError {
  field: string;      // Caminho do campo (ex: "personalInfo.email")
  message: string;    // Mensagem de erro
  value?: unknown;    // Valor inválido
}
```

### Exemplo de Tratamento

```typescript
const validation = validateCurriculumData(data);

if (!validation.isValid) {
  validation.errors.forEach(error => {
    console.error(`Campo ${error.field}: ${error.message}`);

    // Mostrar na UI
    toast.error(`Erro em ${error.field}`, {
      description: error.message
    });
  });

  // Usar dados recuperados se disponível
  if (validation.data) {
    console.log('Usando dados parcialmente recuperados');
  }
}
```

## Versionamento de Dados

O sistema suporta versionamento para migração de dados:

```typescript
import { VersionedCurriculumSchema } from '@/schemas/curriculumSchema';

const versionedData = {
  version: 1,
  data: curriculumData,
  lastModified: new Date().toISOString()
};

const validated = VersionedCurriculumSchema.parse(versionedData);
```

### Migração Entre Versões

A função `migrateOldData` detecta automaticamente a versão e aplica migrações necessárias:

```typescript
// Versão 0 → Versão 1: Adiciona novos campos
// - hasDriverLicense
// - driverLicenseCategories
// - isRoundPhoto

const migratedData = migrateOldData(oldVersionData);
```

## Chaves do localStorage

```typescript
export const STORAGE_KEYS = {
  CURRICULUM: 'cvgratis-curriculum',              // Dados principais
  CURRICULUM_BACKUP: 'cvgratis-curriculum-backup', // Backup único
  CURRICULUM_VERSION: 'cvgratis-curriculum-version', // Versão do schema
  CURRICULUM_BACKUPS: 'cvgratis-curriculum-backups', // Histórico (3 últimos)
};
```

## Logs de Desenvolvimento

O sistema possui logs detalhados:

- ✅ Sucesso (verde)
- ⚠️ Aviso (amarelo)
- ❌ Erro (vermelho)
- ℹ️ Informação (azul)
- 🔧 Recuperação (laranja)
- 💾 Backup (roxo)
- 📥 Importação/Restauração (azul)
- 🔄 Migração (ciano)

## Boas Práticas

1. **Sempre valide antes de salvar**
   ```typescript
   const validation = validateCurriculumData(data);
   if (validation.isValid) {
     localStorage.setItem(key, JSON.stringify(data));
   }
   ```

2. **Crie backups antes de operações destrutivas**
   ```typescript
   createBackup(currentData);
   resetCurriculum();
   ```

3. **Use parse seguro para dados externos**
   ```typescript
   const data = safeJsonParse(userInput, defaultValue);
   ```

4. **Trate erros de validação graciosamente**
   ```typescript
   if (!validation.isValid && validation.data) {
     // Use dados recuperados
     // Notifique usuário
   }
   ```

5. **Mantenha backups atualizados**
   ```typescript
   // O sistema faz isso automaticamente no CurriculumContext
   useEffect(() => {
     createBackup(state.data);
     localStorage.setItem(STORAGE_KEYS.CURRICULUM, JSON.stringify(state.data));
   }, [state.data]);
   ```

## Exemplos de Validação

### Validar Email
```typescript
PersonalInfoSchema.parse({ email: 'invalido' }); // ❌ Erro: Email inválido
PersonalInfoSchema.parse({ email: 'valido@email.com' }); // ✅ Sucesso
```

### Validar Experiência
```typescript
ExperienceSchema.parse({
  id: 'uuid',
  position: 'Desenvolvedor',
  company: 'Empresa',
  startDate: '2020-01',
  endDate: '',
  current: false // ❌ Erro: endDate obrigatório quando current = false
});
```

### Validar Nível de Educação
```typescript
EducationSchema.parse({
  level: 'graduacao' // ❌ Erro: deve ser um dos valores permitidos
});

EducationSchema.parse({
  level: 'superior' // ✅ Sucesso
});
```

## Testes

Para testar o sistema de validação:

```typescript
// Simular dados corrompidos
localStorage.setItem('cvgratis-curriculum', '{"invalid": json}');

// Tentar carregar
const sanitized = sanitizeStorageData();
// Deve retornar null e limpar localStorage

// Simular dados parcialmente corrompidos
localStorage.setItem('cvgratis-curriculum', JSON.stringify({
  personalInfo: { name: 'João', email: 'invalido' },
  education: [{ invalid: 'data' }]
}));

const validation = validateCurriculumData(sanitized);
// validation.isValid = false
// validation.errors conterá os erros
// validation.data pode conter campos recuperados
```

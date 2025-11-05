import { z } from 'zod';

// Schema para informações pessoais
export const PersonalInfoSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório').regex(/^[\d\s\-\(\)\+]+$/, 'Telefone inválido'),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  position: z.string().optional(),
  photo: z.string().optional(), // Base64 string
  isRoundPhoto: z.boolean().optional().default(true),
  hasDriverLicense: z.boolean().optional().default(false),
  driverLicenseCategories: z.array(z.string()).optional().default([]),
});

// Schema para objetivo profissional
export const ProfessionalObjectiveSchema = z.object({
  keywords: z.string().max(200, 'Palavras-chave muito longas'),
  description: z.string().max(1000, 'Descrição muito longa'),
});

// Schema para educação
export const EducationSchema = z.object({
  id: z.string().uuid('ID inválido'),
  course: z.string().min(1, 'Nome do curso é obrigatório').max(200, 'Nome do curso muito longo'),
  institution: z.string().min(1, 'Instituição é obrigatória').max(200, 'Nome da instituição muito longo'),
  startDate: z.string().min(1, 'Data de início é obrigatória'),
  endDate: z.string().min(1, 'Data de término é obrigatória'),
  level: z.enum(['fundamental', 'medio', 'tecnico', 'superior', 'pos-graduacao', 'mestrado', 'doutorado'], {
    errorMap: () => ({ message: 'Nível de educação inválido' }),
  }),
});

// Schema para experiência profissional
export const ExperienceSchema = z.object({
  id: z.string().uuid('ID inválido'),
  position: z.string().min(1, 'Cargo é obrigatório').max(200, 'Nome do cargo muito longo'),
  company: z.string().min(1, 'Empresa é obrigatória').max(200, 'Nome da empresa muito longo'),
  startDate: z.string().min(1, 'Data de início é obrigatória'),
  endDate: z.string(),
  current: z.boolean().default(false),
  keywords: z.string().max(200, 'Palavras-chave muito longas'),
  description: z.string().max(2000, 'Descrição muito longa'),
}).refine(
  (data) => data.current || data.endDate.length > 0,
  { message: 'Data de término é obrigatória quando não é emprego atual', path: ['endDate'] }
);

// Schema para habilidades
export const SkillSchema = z.object({
  id: z.string().uuid('ID inválido'),
  name: z.string().min(1, 'Nome da habilidade é obrigatório').max(100, 'Nome da habilidade muito longo'),
  category: z.enum(['technical', 'soft', 'language', 'other'], {
    errorMap: () => ({ message: 'Categoria de habilidade inválida' }),
  }),
});

// Schema para idiomas
export const LanguageSchema = z.object({
  id: z.string().uuid('ID inválido'),
  name: z.string().min(1, 'Nome do idioma é obrigatório').max(50, 'Nome do idioma muito longo'),
  level: z.enum(['basico', 'intermediario', 'avancado', 'fluente', 'nativo'], {
    errorMap: () => ({ message: 'Nível de idioma inválido' }),
  }),
});

// Schema para cursos
export const CourseSchema = z.object({
  id: z.string().uuid('ID inválido'),
  name: z.string().min(1, 'Nome do curso é obrigatório').max(200, 'Nome do curso muito longo'),
  institution: z.string().max(200, 'Nome da instituição muito longo').optional(),
  year: z.string().max(4, 'Ano inválido').optional(),
});

// Schema para projetos
export const ProjectSchema = z.object({
  id: z.string().uuid('ID inválido'),
  name: z.string().min(1, 'Nome do projeto é obrigatório').max(200, 'Nome do projeto muito longo'),
  description: z.string().min(1, 'Descrição é obrigatória').max(1000, 'Descrição muito longa'),
  year: z.string().max(4, 'Ano inválido').optional(),
});

// Schema para conquistas
export const AchievementSchema = z.object({
  id: z.string().uuid('ID inválido'),
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo'),
  description: z.string().min(1, 'Descrição é obrigatória').max(1000, 'Descrição muito longa'),
  year: z.string().max(4, 'Ano inválido').optional(),
});

// Schema completo do currículo
export const CurriculumDataSchema = z.object({
  personalInfo: PersonalInfoSchema,
  objective: ProfessionalObjectiveSchema,
  education: z.array(EducationSchema).default([]),
  experience: z.array(ExperienceSchema).default([]),
  skills: z.array(SkillSchema).default([]),
  languages: z.array(LanguageSchema).default([]),
  courses: z.array(CourseSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  achievements: z.array(AchievementSchema).default([]),
});

// Schemas parciais para validação de cada etapa do formulário
export const PersonalInfoStepSchema = z.object({
  personalInfo: PersonalInfoSchema,
});

export const ObjectiveStepSchema = z.object({
  objective: ProfessionalObjectiveSchema,
});

export const EducationStepSchema = z.object({
  education: z.array(EducationSchema).min(1, 'Adicione pelo menos uma formação'),
});

export const ExperienceStepSchema = z.object({
  experience: z.array(ExperienceSchema),
});

export const SkillsStepSchema = z.object({
  skills: z.array(SkillSchema).min(1, 'Adicione pelo menos uma habilidade'),
});

export const LanguagesStepSchema = z.object({
  languages: z.array(LanguageSchema),
});

export const CoursesStepSchema = z.object({
  courses: z.array(CourseSchema),
});

export const ProjectsAchievementsStepSchema = z.object({
  projects: z.array(ProjectSchema),
  achievements: z.array(AchievementSchema),
});

// Schema com versionamento para migração de dados
export const VersionedCurriculumSchema = z.object({
  version: z.number().default(1),
  data: CurriculumDataSchema,
  lastModified: z.string().datetime().optional(),
});

// Types inferidos dos schemas
export type PersonalInfoInput = z.input<typeof PersonalInfoSchema>;
export type PersonalInfoOutput = z.output<typeof PersonalInfoSchema>;
export type ProfessionalObjectiveInput = z.input<typeof ProfessionalObjectiveSchema>;
export type ProfessionalObjectiveOutput = z.output<typeof ProfessionalObjectiveSchema>;
export type EducationInput = z.input<typeof EducationSchema>;
export type EducationOutput = z.output<typeof EducationSchema>;
export type ExperienceInput = z.input<typeof ExperienceSchema>;
export type ExperienceOutput = z.output<typeof ExperienceSchema>;
export type SkillInput = z.input<typeof SkillSchema>;
export type SkillOutput = z.output<typeof SkillSchema>;
export type LanguageInput = z.input<typeof LanguageSchema>;
export type LanguageOutput = z.output<typeof LanguageSchema>;
export type CourseInput = z.input<typeof CourseSchema>;
export type CourseOutput = z.output<typeof CourseSchema>;
export type ProjectInput = z.input<typeof ProjectSchema>;
export type ProjectOutput = z.output<typeof ProjectSchema>;
export type AchievementInput = z.input<typeof AchievementSchema>;
export type AchievementOutput = z.output<typeof AchievementSchema>;
export type CurriculumDataInput = z.input<typeof CurriculumDataSchema>;
export type CurriculumDataOutput = z.output<typeof CurriculumDataSchema>;
export type VersionedCurriculumInput = z.input<typeof VersionedCurriculumSchema>;
export type VersionedCurriculumOutput = z.output<typeof VersionedCurriculumSchema>;

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  position?: string; // Cargo/Profissão do usuário
  photo?: string; // Base64 string da foto
  isRoundPhoto?: boolean; // Se foto deve ser redonda
  hasDriverLicense?: boolean; // Se possui carteira de motorista
  driverLicenseCategories?: string[]; // Categorias da carteira (A, B, C, D, E)
}

export interface ProfessionalObjective {
  keywords: string;
  description: string;
}

export interface Education {
  id: string;
  course: string;
  institution: string;
  startDate: string;
  endDate: string;
  level: 'fundamental' | 'medio' | 'tecnico' | 'superior' | 'pos-graduacao' | 'mestrado' | 'doutorado';
}

export interface Experience {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  keywords: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'language' | 'other';
}

export interface Language {
  id: string;
  name: string;
  level: 'basico' | 'intermediario' | 'avancado' | 'fluente' | 'nativo';
}

export interface Course {
  id: string;
  name: string;
  institution?: string;
  year?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  year?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  year?: string;
}

export interface CurriculumData {
  personalInfo: PersonalInfo;
  objective: ProfessionalObjective;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  languages: Language[];
  courses: Course[];
  projects: Project[];
  achievements: Achievement[];
}

export type CurriculumStep = 
  | 'personal-info'
  | 'objective' 
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'courses'
  | 'projects-achievements';

export const CURRICULUM_STEPS: { id: CurriculumStep; title: string; }[] = [
  { id: 'personal-info', title: 'Informações Pessoais' },
  { id: 'objective', title: 'Objetivo Profissional' },
  { id: 'experience', title: 'Experiência Profissional' },
  { id: 'education', title: 'Educação' },
  { id: 'skills', title: 'Habilidades' },
  { id: 'languages', title: 'Idiomas' },
  { id: 'courses', title: 'Cursos' },
  { id: 'projects-achievements', title: 'Projetos & Conquistas' },
];
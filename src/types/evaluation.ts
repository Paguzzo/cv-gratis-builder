import { CurriculumData } from './curriculum';

export interface EvaluationCategory {
  name: string;
  score: number; // 0-100
  weight: number; // peso na nota final
  feedback: string;
}

export interface EvaluationCriteria {
  completeness: EvaluationCategory;
  professionalism: EvaluationCategory;
  readability: EvaluationCategory;
  atsOptimization: EvaluationCategory;
}

export interface CurriculumEvaluation {
  overallScore: number; // 0-100
  starRating: number; // 1-5 estrelas
  categories: EvaluationCriteria;
  positivePoints: string[];
  improvements: string[];
  lastEvaluated: Date;
}

export interface EvaluationRule {
  id: string;
  category: keyof EvaluationCriteria;
  weight: number;
  evaluate: (data: CurriculumData) => {
    score: number;
    feedback: string;
    positivePoints?: string[];
    improvements?: string[];
  };
}

// Critérios de avaliação predefinidos
export const EVALUATION_WEIGHTS = {
  completeness: 0.25,     // 25% - Seções preenchidas
  professionalism: 0.25,  // 25% - Qualidade do conteúdo
  readability: 0.25,      // 25% - Formatação e legibilidade
  atsOptimization: 0.25   // 25% - Otimização para ATS
};

export const STAR_RATING_THRESHOLDS = {
  1: 0,   // 0-20
  2: 20,  // 21-40
  3: 40,  // 41-60
  4: 60,  // 61-80
  5: 80   // 81-100
};

export type ImprovementPriority = 'alta' | 'media' | 'baixa';

export interface ImprovementSuggestion {
  id: string;
  title: string;
  description: string;
  category: keyof EvaluationCriteria;
  priority: ImprovementPriority;
  potentialImpact: number; // pontos que pode adicionar
}

export const DEFAULT_EVALUATION: CurriculumEvaluation = {
  overallScore: 0,
  starRating: 1,
  categories: {
    completeness: {
      name: 'Completude',
      score: 0,
      weight: 0.25,
      feedback: 'Avaliação pendente'
    },
    professionalism: {
      name: 'Profissionalismo',
      score: 0,
      weight: 0.25,
      feedback: 'Avaliação pendente'
    },
    readability: {
      name: 'Legibilidade',
      score: 0,
      weight: 0.25,
      feedback: 'Avaliação pendente'
    },
    atsOptimization: {
      name: 'Otimização ATS',
      score: 0,
      weight: 0.25,
      feedback: 'Avaliação pendente'
    }
  },
  positivePoints: [],
  improvements: [],
  lastEvaluated: new Date()
}; 
import { CurriculumData } from '@/types/curriculum';
import { CurriculumEvaluation, EvaluationCriteria, ImprovementSuggestion, EVALUATION_WEIGHTS, STAR_RATING_THRESHOLDS } from '@/types/evaluation';

export class EvaluationService {
  static evaluateCurriculum(data: CurriculumData): CurriculumEvaluation {
    const categories = this.evaluateCategories(data);
    const overallScore = this.calculateOverallScore(categories);
    const starRating = this.calculateStarRating(overallScore);
    const { positivePoints, improvements } = this.generateFeedback(data, categories);

    return {
      overallScore,
      starRating,
      categories,
      positivePoints,
      improvements,
      lastEvaluated: new Date()
    };
  }

  private static evaluateCategories(data: CurriculumData): EvaluationCriteria {
    return {
      completeness: this.evaluateCompleteness(data),
      professionalism: this.evaluateProfessionalism(data),
      readability: this.evaluateReadability(data),
      atsOptimization: this.evaluateATSOptimization(data)
    };
  }

  private static evaluateCompleteness(data: CurriculumData) {
    let score = 0;
    let feedback = '';
    const checks = [];

    // Informações pessoais (25 pontos)
    if (data.personalInfo.name) checks.push('Nome preenchido');
    if (data.personalInfo.email) checks.push('Email preenchido');
    if (data.personalInfo.phone) checks.push('Telefone preenchido');
    if (data.personalInfo.address) checks.push('Endereço preenchido');
    score += (checks.length / 4) * 25;

    // Objetivo profissional (15 pontos)
    if (data.objective?.description && data.objective.description.length > 50) {
      score += 15;
      checks.push('Objetivo bem desenvolvido');
    }

    // Experiência (25 pontos)
    if (data.experience.length > 0) {
      const experienceScore = Math.min(data.experience.length / 3, 1) * 25;
      score += experienceScore;
      checks.push(`${data.experience.length} experiência(s) adicionada(s)`);
    }

    // Educação (15 pontos)
    if (data.education.length > 0) {
      score += 15;
      checks.push('Formação acadêmica incluída');
    }

    // Habilidades (10 pontos)
    if (data.skills.length >= 5) {
      score += 10;
      checks.push(`${data.skills.length} habilidades listadas`);
    }

    // Idiomas (5 pontos)
    if (data.languages.length > 0) {
      score += 5;
      checks.push('Idiomas incluídos');
    }

    // Cursos (5 pontos)
    if (data.courses.length > 0) {
      score += 5;
      checks.push('Cursos complementares adicionados');
    }

    feedback = checks.length > 5 ? 'Currículo bem completo' : 'Algumas seções podem ser expandidas';
    
    return {
      name: 'Completude',
      score: Math.round(score),
      weight: EVALUATION_WEIGHTS.completeness,
      feedback
    };
  }

  private static evaluateProfessionalism(data: CurriculumData) {
    let score = 0;
    let feedback = '';

    // Qualidade do objetivo (30 pontos)
    if (data.objective?.description) {
      const objectiveLength = data.objective.description.length;
      if (objectiveLength > 100 && objectiveLength < 300) {
        score += 30;
      } else if (objectiveLength > 50) {
        score += 20;
      } else {
        score += 10;
      }
    }

    // Descrições de experiência (40 pontos)
    const experienceWithDescription = data.experience.filter(exp => exp.description && exp.description.length > 50);
    score += Math.min(experienceWithDescription.length / data.experience.length, 1) * 40;

    // Dados profissionais (20 pontos)
    if (data.personalInfo.email && data.personalInfo.email.includes('@')) score += 10;
    if (data.personalInfo.phone && data.personalInfo.phone.length >= 10) score += 10;

    // Projetos e conquistas (10 pontos)
    if (data.projects.length > 0 || data.achievements.length > 0) score += 10;

    feedback = score > 80 ? 'Conteúdo muito profissional' : 
               score > 60 ? 'Boa apresentação profissional' : 
               'Pode ser mais profissional';

    return {
      name: 'Profissionalismo',
      score: Math.round(score),
      weight: EVALUATION_WEIGHTS.professionalism,
      feedback
    };
  }

  private static evaluateReadability(data: CurriculumData) {
    let score = 70; // Base score for structure
    let feedback = '';

    // Organização das seções (50 pontos base)
    const sections = [
      data.personalInfo.name,
      data.objective?.description,
      data.experience.length > 0,
      data.education.length > 0,
      data.skills.length > 0
    ].filter(Boolean).length;

    score += (sections / 5) * 30;

    feedback = score > 85 ? 'Excelente organização' :
               score > 70 ? 'Bem organizado' :
               'Organização pode melhorar';

    return {
      name: 'Legibilidade',
      score: Math.round(score),
      weight: EVALUATION_WEIGHTS.readability,
      feedback
    };
  }

  private static evaluateATSOptimization(data: CurriculumData) {
    let score = 0;
    let feedback = '';

    // Palavras-chave nas habilidades (40 pontos)
    const skillKeywords = data.skills.length >= 8 ? 40 : (data.skills.length / 8) * 40;
    score += skillKeywords;

    // Experiência com detalhes (30 pontos)
    const detailedExperience = data.experience.filter(exp => 
      exp.description && exp.description.length > 100
    ).length;
    score += Math.min(detailedExperience / 2, 1) * 30;

    // Formato padrão (30 pontos)
    if (data.personalInfo.name && data.personalInfo.email && data.personalInfo.phone) {
      score += 30;
    }

    feedback = score > 80 ? 'Bem otimizado para ATS' :
               score > 60 ? 'Moderadamente otimizado' :
               'Precisa de otimização ATS';

    return {
      name: 'Otimização ATS',
      score: Math.round(score),
      weight: EVALUATION_WEIGHTS.atsOptimization,
      feedback
    };
  }

  private static calculateOverallScore(categories: EvaluationCriteria): number {
    const weightedScore = Object.values(categories).reduce((total, category) => {
      return total + (category.score * category.weight);
    }, 0);

    return Math.round(weightedScore);
  }

  private static calculateStarRating(score: number): number {
    if (score >= 80) return 5;
    if (score >= 60) return 4;
    if (score >= 40) return 3;
    if (score >= 20) return 2;
    return 1;
  }

  private static generateFeedback(data: CurriculumData, categories: EvaluationCriteria) {
    const positivePoints: string[] = [];
    const improvements: string[] = [];

    // Pontos positivos
    if (categories.completeness.score > 80) {
      positivePoints.push('Currículo muito completo com todas as seções preenchidas');
    }
    if (data.experience.length >= 3) {
      positivePoints.push('Boa experiência profissional demonstrada');
    }
    if (data.skills.length >= 8) {
      positivePoints.push('Lista abrangente de habilidades técnicas');
    }
    if (data.objective?.description && data.objective.description.length > 100) {
      positivePoints.push('Objetivo profissional bem estruturado');
    }

    // Melhorias
    if (categories.completeness.score < 70) {
      improvements.push('Preencher todas as seções do currículo');
    }
    if (data.experience.filter(exp => exp.description).length < data.experience.length) {
      improvements.push('Adicionar descrições detalhadas nas experiências');
    }
    if (data.skills.length < 5) {
      improvements.push('Incluir mais habilidades relevantes para sua área');
    }
    if (!data.objective?.description || data.objective.description.length < 50) {
      improvements.push('Desenvolver melhor o objetivo profissional');
    }
    if (categories.atsOptimization.score < 70) {
      improvements.push('Otimizar para sistemas ATS com mais palavras-chave');
    }

    return { positivePoints, improvements };
  }

  static generateImprovementSuggestions(data: CurriculumData): ImprovementSuggestion[] {
    const suggestions: ImprovementSuggestion[] = [];

    if (data.experience.length < 2) {
      suggestions.push({
        id: 'add-experience',
        title: 'Adicionar mais experiências',
        description: 'Inclua experiências anteriores, estágios ou trabalhos freelance',
        category: 'completeness',
        priority: 'alta',
        potentialImpact: 15
      });
    }

    if (data.skills.length < 8) {
      suggestions.push({
        id: 'add-skills',
        title: 'Expandir lista de habilidades',
        description: 'Adicione habilidades técnicas e comportamentais relevantes',
        category: 'atsOptimization',
        priority: 'alta',
        potentialImpact: 12
      });
    }

    if (!data.objective?.description || data.objective.description.length < 100) {
      suggestions.push({
        id: 'improve-objective',
        title: 'Melhorar objetivo profissional',
        description: 'Desenvolva um objetivo mais detalhado e específico',
        category: 'professionalism',
        priority: 'media',
        potentialImpact: 10
      });
    }

    return suggestions;
  }
} 
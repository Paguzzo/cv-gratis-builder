import { CurriculumData } from '@/types/curriculum';

export interface CheckIssue {
  id: string;
  type: 'error' | 'warning' | 'suggestion';
  category: 'content' | 'grammar' | 'formatting' | 'completeness' | 'system';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  fixable: boolean;
  field?: string;
  currentValue?: string;
  suggestedValue?: string;
}

export interface CheckResult {
  score: number; // 0-100
  issues: CheckIssue[];
  suggestions: string[];
}

export interface CheckProgress {
  step: string;
  progress: number; // 0-100
  description: string;
}

export class CurriculumChecker {
  private static instance: CurriculumChecker;
  
  private constructor() {}
  
  static getInstance(): CurriculumChecker {
    if (!CurriculumChecker.instance) {
      CurriculumChecker.instance = new CurriculumChecker();
    }
    return CurriculumChecker.instance;
  }

  /**
   * Executa verificação completa do currículo com callback de progresso
   */
  async checkCurriculum(
    data: CurriculumData, 
    onProgress?: (progress: CheckProgress) => void
  ): Promise<CheckResult> {
    console.log('🔧 SERVICE: data recebido:', data);
    
    // ✅ VALIDAÇÃO CRÍTICA: Verificar se data não é null/undefined
    if (!data) {
      return {
        score: 50,
        issues: [{
          id: 'no-data',
          type: 'warning',
          category: 'system',
          title: 'Dados do currículo não encontrados',
          description: 'Não foi possível acessar os dados do currículo. Verifique se todas as informações foram preenchidas.',
          severity: 'high',
          fixable: false
        }],
        suggestions: ['Recarregue a página e tente novamente.', 'Verifique se todas as seções do currículo foram preenchidas.']
      };
    }
    
    const issues: CheckIssue[] = [];
    
    try {
      // Etapa 1: Progresso inicial
      onProgress?.({
        step: 'basic',
        progress: 10,
        description: 'Verificando informações obrigatórias...'
      });
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // ===== VERIFICAÇÕES DE INFORMAÇÕES PESSOAIS =====
      
      // Nome completo (verificando tanto fullName quanto name)
      const fullName = data.personalInfo?.fullName?.trim() || data.personalInfo?.name?.trim() || '';
      
      if (!fullName) {
        issues.push({
          id: 'missing-name',
          type: 'error',
          category: 'completeness',
          title: 'Nome obrigatório',
          description: 'O nome completo é obrigatório no currículo.',
          severity: 'high',
          fixable: false,
          field: 'personalInfo.name'
        });
      } else if (fullName.split(' ').length < 2) {
        issues.push({
          id: 'incomplete-name',
          type: 'warning',
          category: 'completeness',
          title: 'Nome incompleto',
          description: 'Recomendamos incluir nome e sobrenome completos para maior profissionalismo.',
          severity: 'medium',
          fixable: false,
          field: 'personalInfo.name'
        });
      }
      
      // Email - verificação de presença e formato
      if (!data.personalInfo?.email?.trim()) {
        issues.push({
          id: 'missing-email',
          type: 'error',
          category: 'completeness',
          title: 'Email obrigatório',
          description: 'O email é essencial para contato profissional.',
          severity: 'high',
          fixable: false,
          field: 'personalInfo.email'
        });
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.personalInfo.email.trim())) {
          issues.push({
            id: 'invalid-email',
            type: 'error',
            category: 'formatting',
            title: 'Email inválido',
            description: 'O formato do email está incorreto. Use o formato: exemplo@dominio.com',
            severity: 'high',
            fixable: false,
            field: 'personalInfo.email'
          });
        }
      }
      
      // Telefone - verificação de presença e formato básico
      if (!data.personalInfo?.phone?.trim()) {
        issues.push({
          id: 'missing-phone',
          type: 'error',
          category: 'completeness',
          title: 'Telefone obrigatório',
          description: 'O telefone é importante para contato direto com recrutadores.',
          severity: 'high',
          fixable: false,
          field: 'personalInfo.phone'
        });
      } else {
        const phoneRegex = /^[()+\-\s\d]{10,}$/;
        if (!phoneRegex.test(data.personalInfo.phone.trim())) {
          issues.push({
            id: 'invalid-phone',
            type: 'warning',
            category: 'formatting',
            title: 'Formato de telefone suspeito',
            description: 'Verifique se o número de telefone está completo e correto.',
            severity: 'medium',
            fixable: false,
            field: 'personalInfo.phone'
          });
        }
      }
      
      // Progresso meio
      onProgress?.({
        step: 'content',
        progress: 50,
        description: 'Verificando experiências profissionais...'
      });
      
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // ===== VERIFICAÇÕES DE EXPERIÊNCIA PROFISSIONAL =====
      
      if (!data.experience || data.experience.length === 0) {
        issues.push({
          id: 'missing-experience',
          type: 'error',
          category: 'completeness',
          title: 'Experiência profissional obrigatória',
          description: 'Pelo menos uma experiência profissional é essencial para um currículo eficaz.',
          severity: 'high',
          fixable: false,
          field: 'experience'
        });
      } else {
        // Verificar qualidade das experiências
        data.experience.forEach((exp, index) => {
          // Cargo vazio
          if (!exp.position?.trim()) {
            issues.push({
              id: `exp-${index}-missing-position`,
              type: 'error',
              category: 'completeness',
              title: `Cargo não informado (Experiência ${index + 1})`,
              description: 'O cargo/função é obrigatório em cada experiência profissional.',
              severity: 'high',
              fixable: false,
              field: `experience[${index}].position`
            });
          }
          
          // Empresa vazia
          if (!exp.company?.trim()) {
            issues.push({
              id: `exp-${index}-missing-company`,
              type: 'error',
              category: 'completeness',
              title: `Empresa não informada (Experiência ${index + 1})`,
              description: 'O nome da empresa é obrigatório em cada experiência profissional.',
              severity: 'high',
              fixable: false,
              field: `experience[${index}].company`
            });
          }
          
          // Descrição muito curta
          if (!exp.description?.trim()) {
            issues.push({
              id: `exp-${index}-missing-description`,
              type: 'warning',
              category: 'content',
              title: `Descrição vazia (Experiência ${index + 1})`,
              description: 'Adicione uma descrição das suas responsabilidades e conquistas.',
              severity: 'medium',
              fixable: false,
              field: `experience[${index}].description`
            });
          } else if (exp.description.trim().length < 50) {
            issues.push({
              id: `exp-${index}-short-description`,
              type: 'suggestion',
              category: 'content',
              title: `Descrição muito curta (Experiência ${index + 1})`,
              description: 'Considere expandir a descrição com mais detalhes sobre suas responsabilidades e resultados.',
              severity: 'low',
              fixable: false,
              field: `experience[${index}].description`
            });
          }
          
          // Verificar consistência de datas
          if (exp.startDate && exp.endDate) {
            const startDate = new Date(exp.startDate);
            const endDate = new Date(exp.endDate);
            
            if (startDate > endDate) {
              issues.push({
                id: `exp-${index}-invalid-dates`,
                type: 'error',
                category: 'formatting',
                title: `Datas inconsistentes (Experiência ${index + 1})`,
                description: 'A data de início não pode ser posterior à data de término.',
                severity: 'high',
                fixable: false,
                field: `experience[${index}].dates`
              });
            }
            
            // Verificar se a experiência é muito longa (mais de 20 anos)
            const diffYears = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
            if (diffYears > 20) {
              issues.push({
                id: `exp-${index}-too-long`,
                type: 'warning',
                category: 'formatting',
                title: `Experiência muito longa (Experiência ${index + 1})`,
                description: 'Verifique se as datas estão corretas. Experiências muito longas podem parecer suspeitas.',
                severity: 'medium',
                fixable: false,
                field: `experience[${index}].dates`
              });
            }
          }
        });
      }
      
      // ===== VERIFICAÇÕES DE EDUCAÇÃO =====
      
      onProgress?.({
        step: 'content',
        progress: 65,
        description: 'Verificando formação acadêmica...'
      });
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!data.education || data.education.length === 0) {
        issues.push({
          id: 'missing-education',
          type: 'warning',
          category: 'completeness',
          title: 'Formação acadêmica não informada',
          description: 'Considere adicionar sua formação acadêmica para fortalecer seu perfil.',
          severity: 'medium',
          fixable: false,
          field: 'education'
        });
      } else {
        data.education.forEach((edu, index) => {
          // Verificar curso (usando campo 'course' da interface Education)
          if (!edu.course?.trim()) {
            issues.push({
              id: `edu-${index}-missing-course`,
              type: 'warning',
              category: 'completeness',
              title: `Curso não informado (Educação ${index + 1})`,
              description: 'Informe o nome do curso/graduação.',
              severity: 'medium',
              fixable: false,
              field: `education[${index}].course`
            });
          }
          
          // Verificar instituição
          if (!edu.institution?.trim()) {
            issues.push({
              id: `edu-${index}-missing-institution`,
              type: 'warning',
              category: 'completeness',
              title: `Instituição não informada (Educação ${index + 1})`,
              description: 'Informe o nome da instituição de ensino.',
              severity: 'medium',
              fixable: false,
              field: `education[${index}].institution`
            });
          }
        });
      }
      
      // ===== VERIFICAÇÕES DE HABILIDADES =====
      
      onProgress?.({
        step: 'content',
        progress: 75,
        description: 'Verificando habilidades...'
      });
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (!data.skills || data.skills.length === 0) {
        issues.push({
          id: 'missing-skills',
          type: 'suggestion',
          category: 'completeness',
          title: 'Habilidades não informadas',
          description: 'Adicione suas principais habilidades técnicas e comportamentais.',
          severity: 'low',
          fixable: false,
          field: 'skills'
        });
      } else if (data.skills.length < 3) {
        issues.push({
          id: 'few-skills',
          type: 'suggestion',
          category: 'content',
          title: 'Poucas habilidades listadas',
          description: 'Considere adicionar mais habilidades relevantes (recomendado: 5-10 habilidades).',
          severity: 'low',
          fixable: false,
          field: 'skills'
        });
      } else if (data.skills.length > 15) {
        issues.push({
          id: 'too-many-skills',
          type: 'suggestion',
          category: 'content',
          title: 'Muitas habilidades listadas',
          description: 'Considere focar nas habilidades mais relevantes para o cargo desejado.',
          severity: 'low',
          fixable: false,
          field: 'skills'
        });
      }
      
      // ===== VERIFICAÇÕES COM IA =====
      
      onProgress?.({
        step: 'ai',
        progress: 85,
        description: 'Verificando gramática e conteúdo com IA...'
      });
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      try {
        const aiIssues = await this.checkWithAI(data);
        issues.push(...aiIssues);
        console.log('🤖 IA: Verificações de IA concluídas:', aiIssues.length, 'problemas encontrados');
      } catch (error) {
        console.warn('🤖 IA: Erro na verificação com IA (continuando sem IA):', error);
        // Não adiciona erro, apenas continua sem IA
      }
      
      // Progresso final
      onProgress?.({
        step: 'complete',
        progress: 95,
        description: 'Calculando pontuação...'
      });
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const result = this.calculateResult(issues);
      
      onProgress?.({
        step: 'complete',
        progress: 100,
        description: 'Verificação concluída!'
      });
      
      console.log('🔧 SERVICE: Resultado calculado:', result);
      return result;
      
    } catch (error) {
      console.error('🚨 SERVICE: Erro na verificação:', error);
      throw new Error('Erro durante a verificação. Tente novamente.');
    }
  }

  /**
   * Verificações inteligentes com IA
   */
  private async checkWithAI(data: CurriculumData): Promise<CheckIssue[]> {
    const aiIssues: CheckIssue[] = [];
    
    try {
      // 1. Verificar gramática do objetivo profissional
      if (data.personalInfo?.objective?.trim()) {
        const grammarCheck = await this.checkGrammar(data.personalInfo.objective, 'objetivo profissional');
        if (grammarCheck) {
          aiIssues.push(grammarCheck);
        }
      }
      
      // 2. Verificar qualidade das descrições de experiência
      if (data.experience && data.experience.length > 0) {
        for (let i = 0; i < data.experience.length; i++) {
          const exp = data.experience[i];
          if (exp.description?.trim()) {
            const grammarCheck = await this.checkGrammar(exp.description, `experiência ${i + 1}`);
            if (grammarCheck) {
              grammarCheck.id = `exp-${i}-grammar`;
              grammarCheck.field = `experience[${i}].description`;
              aiIssues.push(grammarCheck);
            }
            
            // Verificar se a descrição é muito genérica
            const contentQuality = await this.checkContentQuality(exp.description, `experiência ${i + 1}`);
            if (contentQuality) {
              contentQuality.id = `exp-${i}-generic`;
              contentQuality.field = `experience[${i}].description`;
              aiIssues.push(contentQuality);
            }
          }
        }
      }
      
      // 3. Verificar se o currículo tem palavras-chave relevantes
      const keywordCheck = await this.checkRelevantKeywords(data);
      if (keywordCheck) {
        aiIssues.push(keywordCheck);
      }
      
    } catch (error) {
      console.warn('🤖 IA: Erro durante verificação com IA:', error);
      // Retorna o que conseguiu verificar até agora
    }
    
    return aiIssues;
  }
  
  /**
   * Verifica gramática de um texto usando IA
   */
  private async checkGrammar(text: string, context: string): Promise<CheckIssue | null> {
    try {
      const prompt = `Analise o seguinte texto de currículo (${context}) e identifique APENAS erros graves de gramática, ortografia ou concordância. Seja específico e objetivo:

TEXTO: "${text}"

Responda APENAS com:
- "OK" se não há erros significativos
- "ERRO: [descrição específica do erro]" se há problemas

Exemplo: "ERRO: Erro de concordância em 'responsavel por gerenciar' - deveria ser 'responsável por gerenciar'"`;

      const aiResponse = await generateAIContent({
        type: 'grammar_check',
        prompt,
        content: text
      });
      
      if (aiResponse && aiResponse.includes('ERRO:')) {
        const errorDescription = aiResponse.replace('ERRO:', '').trim();
        
        return {
          id: 'ai-grammar',
          type: 'warning',
          category: 'grammar',
          title: `Possível erro de gramática (${context})`,
          description: errorDescription,
          severity: 'medium',
          fixable: false
        };
      }
      
      return null;
    } catch (error) {
      console.warn('🤖 IA: Erro na verificação de gramática:', error);
      return null;
    }
  }
  
  /**
   * Verifica qualidade do conteúdo usando IA
   */
  private async checkContentQuality(text: string, context: string): Promise<CheckIssue | null> {
    try {
      // Só analisa textos muito genéricos ou muito curtos
      if (text.length < 30) return null;
      
      const genericPhrases = [
        'responsável por',
        'atendimento ao cliente',
        'trabalho em equipe',
        'proativo',
        'organizado',
        'dedicado'
      ];
      
      const genericCount = genericPhrases.filter(phrase => 
        text.toLowerCase().includes(phrase)
      ).length;
      
      if (genericCount >= 3) {
        return {
          id: 'ai-generic-content',
          type: 'suggestion',
          category: 'content',
          title: `Descrição muito genérica (${context})`,
          description: 'Considere usar exemplos específicos de resultados e conquistas ao invés de frases genéricas.',
          severity: 'low',
          fixable: false
        };
      }
      
      return null;
    } catch (error) {
      console.warn('🤖 IA: Erro na verificação de qualidade:', error);
      return null;
    }
  }
  
  /**
   * Verifica se o currículo tem palavras-chave relevantes
   */
  private async checkRelevantKeywords(data: CurriculumData): Promise<CheckIssue | null> {
    try {
      const allText = [
        data.personalInfo?.objective || '',
        ...(data.experience?.map(exp => exp.description) || []),
        ...(data.skills?.map(skill => skill.name) || [])
      ].join(' ').toLowerCase();
      
      // Verificar se tem palavras técnicas/profissionais
      const technicalWords = [
        'gestão', 'análise', 'desenvolvimento', 'implementação', 'otimização',
        'liderança', 'estratégia', 'processo', 'projeto', 'resultado',
        'eficiência', 'qualidade', 'inovação', 'planejamento'
      ];
      
      const hasRelevantKeywords = technicalWords.some(word => allText.includes(word));
      
      if (!hasRelevantKeywords && allText.length > 100) {
        return {
          id: 'missing-keywords',
          type: 'suggestion',
          category: 'content',
          title: 'Poucas palavras-chave profissionais',
          description: 'Considere adicionar mais termos técnicos e palavras-chave relevantes para sua área.',
          severity: 'low',
          fixable: false
        };
      }
      
      return null;
    } catch (error) {
      console.warn('🤖 IA: Erro na verificação de palavras-chave:', error);
      return null;
    }
  }

  /**
   * Calcula resultado final com pontuação
   */
  private calculateResult(issues: CheckIssue[]): CheckResult {
    const errors = issues.filter(i => i.type === 'error').length;
    const warnings = issues.filter(i => i.type === 'warning').length;
    const suggestions = issues.filter(i => i.type === 'suggestion').length;
    
    // Cálculo de pontuação baseado em peso dos problemas
    let score = 100;
    score -= errors * 15;      // Erros pesam mais
    score -= warnings * 8;     // Avisos pesam moderadamente  
    score -= suggestions * 3;  // Sugestões pesam pouco
    
    score = Math.max(0, Math.min(100, score));
    
    // Gera sugestões básicas
    const basicSuggestions = [];
    if (errors > 0) {
      basicSuggestions.push('Corrija os erros críticos encontrados para melhorar seu currículo.');
    }
    if (warnings > 0) {
      basicSuggestions.push('Revise os avisos para aprimorar a qualidade do conteúdo.');
    }
    if (issues.length === 0) {
      basicSuggestions.push('Excelente! Seu currículo está bem estruturado e pronto para impressionar.');
    }
    if (score >= 80) {
      basicSuggestions.push('Ótima qualidade! Pequenos ajustes podem torná-lo ainda melhor.');
    }
    
    return {
      score,
      issues,
      suggestions: basicSuggestions
    };
  }
}

// Instância singleton
export const curriculumChecker = CurriculumChecker.getInstance();
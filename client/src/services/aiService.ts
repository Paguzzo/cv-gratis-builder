export interface AIRequest {
  type: 'objective' | 'experience';
  userInput: string;
  keywords?: string;
  position?: string;
  company?: string;
  context?: string;
}

export interface AIResponse {
  success: boolean;
  generatedText: string;
  suggestions?: string[];
  error?: string;
}

// Configurações do OpenAI a partir das variáveis de ambiente
const OPENAI_CONFIG = {
  API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  MODEL: import.meta.env.OPENAI_MODEL || 'gpt-4o-mini',
  MAX_TOKENS: parseInt(import.meta.env.OPENAI_MAX_TOKENS) || 1500,
  BASE_URL: 'https://api.openai.com/v1/chat/completions'
};

// Prompts otimizados para ATS e textos estratégicos
const PROMPTS = {
  objective: `Você é um especialista em RH e criação de currículos com 15 anos de experiência. Sua missão é criar um objetivo profissional estratégico, fluido e naturalmente otimizado.

CONTEXTO DO CANDIDATO:
Texto base: {userInput}
Palavras-chave da área: {keywords}

INSTRUÇÕES ESTRATÉGICAS:
1. ANÁLISE: Identifique o perfil profissional através do texto base
2. INTEGRAÇÃO: Incorpore as palavras-chave de forma NATURAL e contextual (NÃO liste todas juntas)
3. NARRATIVA: Crie uma narrativa coesa que demonstre evolução e propósito
4. VALOR: Foque no valor que o profissional entrega, não no que ele quer

ESTRUTURA IDEAL:
• Frase 1: Posicionamento profissional + área de expertise
• Frase 2: Principais competências/experiências (integre palavras-chave aqui)
• Frase 3: Valor/impacto que gera + direcionamento de carreira

REGRAS DE OURO:
✅ Máximo 3 frases, linguagem executiva
✅ Palavras-chave integradas naturalmente no contexto
✅ Foco em resultados e impacto, não em responsabilidades
✅ Evite: "busco", "oportunidades", "crescimento pessoal"
✅ Use: "especializado", "comprovada experiência", "resultados"

Crie um objetivo profissional único e memorável:`,

  experience: `Você é um headhunter executivo com especialização em otimização de currículos para grandes corporações. Transforme esta experiência em uma narrativa poderosa de conquistas.

CONTEXTO DA POSIÇÃO:
Cargo: {position}  
Empresa: {company}
Descrição atual: {userInput}
Competências-chave: {keywords}

METODOLOGIA DE TRANSFORMAÇÃO:
1. ANÁLISE: Identifique as responsabilidades core e conquistas implícitas
2. QUANTIFICAÇÃO: Adicione métricas realistas quando não especificadas
3. INTEGRAÇÃO: Incorpore palavras-chave naturalmente nas conquistas
4. IMPACTO: Transforme tarefas em resultados de negócio

ESTRUTURA ESTRATÉGICA:
• Bullet 1: Principal conquista/impacto (inclua métricas se possível)
• Bullet 2: Competência técnica + resultado específico (integre palavras-chave)
• Bullet 3: Liderança/colaboração + benefício organizacional
• Bullet 4: Inovação/melhoria de processo + resultado mensurável
• Bullet 5: Desenvolvimento/capacitação + impacto na equipe/empresa

FÓRMULA DE CADA BULLET:
[VERBO DE AÇÃO] + [O QUE FEZ] + [COMO/MÉTODO] + [RESULTADO MENSURÁVEL]

VERBOS ESTRATÉGICOS: Liderou, Implementou, Otimizou, Desenvolveu, Gerenciou, Arquitetou, Coordenou, Estabeleceu, Transformou

MÉTRICAS INTELIGENTES: Use % de melhoria, tempo economizado, custos reduzidos, pessoas impactadas, projetos entregues, indicadores de qualidade

Crie 4-5 bullets poderosos que demonstrem o candidato como um profissional de alto impacto:`
};

// Integração real com OpenAI API
async function callOpenAI(prompt: string): Promise<string> {
  // Verificar se a API key está configurada
  if (!OPENAI_CONFIG.API_KEY) {
    console.warn('OpenAI API key não configurada, usando fallback...');
    return getFallbackResponse(prompt);
  }

  try {
    const response = await fetch(OPENAI_CONFIG.BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_CONFIG.API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_CONFIG.MODEL,
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em criação de currículos e otimização para ATS (Applicant Tracking Systems). Crie textos profissionais, estratégicos e impactantes.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: OPENAI_CONFIG.MAX_TOKENS,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Resposta inválida da OpenAI API');
    }

    const generatedText = data.choices[0].message.content.trim();
    console.log('✅ Texto gerado pela OpenAI:', generatedText.substring(0, 100) + '...');
    
    return generatedText;

  } catch (error) {
    console.error('❌ Erro na OpenAI API:', error);
    console.warn('Usando resposta de fallback...');
    return getFallbackResponse(prompt);
  }
}

// Resposta de fallback quando OpenAI não está disponível
function getFallbackResponse(prompt: string): string {
  if (prompt.includes('objetivo profissional')) {
    // NOVA LÓGICA: Análise inteligente das palavras-chave
    const keywordsMatch = prompt.match(/Palavras-chave da área: (.+)/);
    const userTextMatch = prompt.match(/Texto base: (.+?)(?=\n|$)/);
    
    const keywords = keywordsMatch ? keywordsMatch[1].split(',').map(k => k.trim()).filter(k => k) : [];
    const userText = userTextMatch ? userTextMatch[1] : '';
    
    // Separar tipos de informação
    const experienceYears = keywords.find(k => k.match(/\d+\s*anos?/i)) || '';
    const technicalSkills = keywords.filter(k => !k.match(/\d+\s*anos?/i) && k.length > 2).slice(0, 3);
    
    // Construir texto estratégico
    let objectiveText = '';
    
    if (experienceYears && technicalSkills.length > 0) {
      const years = experienceYears.match(/\d+/)?.[0] || '5';
      const mainArea = technicalSkills[0];
      const specializations = technicalSkills.slice(1);
      
      objectiveText = `Profissional com ${years} anos de experiência em ${mainArea}, especializado em ${specializations.join(' e ')}. `;
    } else if (technicalSkills.length > 0) {
      objectiveText = `Especialista em ${technicalSkills[0]} com comprovada expertise em ${technicalSkills.slice(1).join(', ')}. `;
    } else {
      objectiveText = 'Profissional experiente com sólida formação técnica. ';
    }
    
    objectiveText += 'Histórico de transformar desafios complexos em soluções estratégicas, entregando resultados mensuráveis e agregando valor aos indicadores organizacionais. ';
    objectiveText += 'Foco na otimização de processos e desenvolvimento de equipes de alta performance para acelerar o crescimento sustentável da empresa.';
    
    return objectiveText;
  } else {
    // NOVA LÓGICA: IA de Experiência - Uma competência por bullet
    const positionMatch = prompt.match(/Cargo: (.+)/);
    const companyMatch = prompt.match(/Empresa: (.+)/);
    const keywordsMatch = prompt.match(/Competências-chave: (.+)/);
    const userTextMatch = prompt.match(/Descrição atual: (.+?)(?=\n|$)/);
    
    const position = positionMatch ? positionMatch[1].trim() : 'Profissional';
    const company = companyMatch ? companyMatch[1].trim() : '';
    const keywords = keywordsMatch ? keywordsMatch[1].split(',').map(k => k.trim()).filter(k => k) : [];
    const userText = userTextMatch ? userTextMatch[1] : '';
    
    // Mapear contexto por tipo de cargo
    const cargoContexts = {
      'coordenador': { action: 'Coordenou', focus: 'equipes e processos', metrics: ['eficiência', 'produtividade', 'qualidade'] },
      'analista': { action: 'Analisou', focus: 'dados e processos', metrics: ['precisão', 'otimização', 'insights'] },
      'gerente': { action: 'Gerenciou', focus: 'operações e estratégias', metrics: ['crescimento', 'receita', 'performance'] },
      'desenvolvedor': { action: 'Desenvolveu', focus: 'soluções e sistemas', metrics: ['performance', 'automação', 'escalabilidade'] },
      'consultor': { action: 'Consultou', focus: 'estratégias e melhorias', metrics: ['resultados', 'satisfação', 'transformação'] }
    };
    
    const cargoKey = Object.keys(cargoContexts).find(key => position.toLowerCase().includes(key)) || 'analista';
    const context = cargoContexts[cargoKey];
    
    // Gerar bullets contextualizados - uma competência por bullet
    const bullets = [];
    for (let i = 0; i < Math.min(keywords.length, 4); i++) {
      const keyword = keywords[i];
      const metric = context.metrics[i % context.metrics.length];
      
      if (i === 0) {
        bullets.push(`• ${context.action} ${context.focus} com foco em ${keyword}, resultando em melhoria de 25% em ${metric}`);
      } else if (i === 1) {
        bullets.push(`• Implementou soluções de ${keyword} que otimizaram processos críticos, gerando impacto positivo de 30% nos indicadores`);
      } else if (i === 2) {
        bullets.push(`• Liderou iniciativas de ${keyword} em colaboração com equipes multidisciplinares, alcançando 95% de satisfação dos stakeholders`);
      } else {
        bullets.push(`• Desenvolveu metodologias e práticas de ${keyword} que aceleraram entregas em 40% e melhoraram qualidade geral`);
      }
    }
    
    // Adicionar bullet de desenvolvimento se houver espaço
    if (bullets.length < 5) {
      bullets.push(`• Capacitou equipes em melhores práticas, contribuindo para retenção de talentos e crescimento da produtividade em 25%`);
    }
    
    return bullets.join('\n');
  }
}

export class AIService {
  private static instance: AIService;
  
  private constructor() {}
  
  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }
  
  // Verificar configuração da API
  static checkConfiguration(): {configured: boolean, model: string, hasApiKey: boolean} {
    return {
      configured: !!OPENAI_CONFIG.API_KEY,
      model: OPENAI_CONFIG.MODEL,
      hasApiKey: !!OPENAI_CONFIG.API_KEY
    };
  }

  // Testar conexão com OpenAI
  static async testConnection(): Promise<{success: boolean, model?: string, error?: string}> {
    if (!OPENAI_CONFIG.API_KEY) {
      return { success: false, error: 'API key não configurada' };
    }

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${OPENAI_CONFIG.API_KEY}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, error: `API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}` };
      }

      return { success: true, model: OPENAI_CONFIG.MODEL };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // Método estático simplificado para uso direto
  static async generateText(type: 'objective' | 'experience', userInput: string, keywords: string, position?: string, company?: string): Promise<string> {
    try {
      let prompt = '';
      
      if (type === 'objective') {
        prompt = PROMPTS.objective
          .replace('{userInput}', userInput || '')
          .replace('{keywords}', keywords || '');
      } else if (type === 'experience') {
        prompt = PROMPTS.experience
          .replace('{position}', position || '')
          .replace('{company}', company || '')
          .replace('{userInput}', userInput || '')
          .replace('{keywords}', keywords || '');
      }
      
      const generatedText = await callOpenAI(prompt);
      return generatedText;
      
    } catch (error) {
      throw new Error('Erro ao gerar texto com IA. Tente novamente.');
    }
  }
  
  async generateText(request: AIRequest): Promise<AIResponse> {
    try {
      let prompt = '';
      
      if (request.type === 'objective') {
        prompt = PROMPTS.objective
          .replace('{userInput}', request.userInput || '')
          .replace('{keywords}', request.keywords || '');
      } else if (request.type === 'experience') {
        prompt = PROMPTS.experience
          .replace('{position}', request.position || '')
          .replace('{company}', request.company || '')
          .replace('{userInput}', request.userInput || '')
          .replace('{keywords}', request.keywords || '');
      }
      
      const generatedText = await callOpenAI(prompt);
      
      return {
        success: true,
        generatedText,
        suggestions: this.generateSuggestions(request.type)
      };
      
    } catch (error) {
      return {
        success: false,
        generatedText: '',
        error: 'Erro ao gerar texto com IA. Tente novamente.'
      };
    }
  }
  
  private generateSuggestions(type: 'objective' | 'experience'): string[] {
    if (type === 'objective') {
      return [
        'Inclua métricas específicas de resultados alcançados',
        'Mencione tecnologias e metodologias relevantes',
        'Foque no valor que você agrega à empresa',
        'Use palavras-chave da descrição da vaga'
      ];
    } else {
      return [
        'Comece com verbos de ação impactantes',
        'Quantifique resultados sempre que possível',
        'Destaque liderança e trabalho em equipe',
        'Inclua tecnologias e ferramentas utilizadas',
        'Mencione reconhecimentos e conquistas'
      ];
    }
  }
  
  // Análise de palavras-chave para otimização ATS
  analyzeKeywords(text: string): string[] {
    const commonKeywords = [
      'liderança', 'gestão', 'estratégico', 'inovação', 'resultados',
      'otimização', 'eficiência', 'produtividade', 'crescimento',
      'desenvolvimento', 'implementação', 'coordenação', 'análise'
    ];
    
    return commonKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  }
  
  // Sugestões de melhoria baseadas em análise de texto
  getSuggestions(text: string): string[] {
    const suggestions: string[] = [];
    
    if (text.length < 50) {
      suggestions.push('Texto muito curto. Adicione mais detalhes sobre suas responsabilidades e conquistas.');
    }
    
    if (!text.match(/\d+/)) {
      suggestions.push('Inclua números e métricas para demonstrar resultados quantificáveis.');
    }
    
    if (!text.match(/\b(lider|gerenci|coorden|implement|desenvolv)/i)) {
      suggestions.push('Use verbos de ação que demonstrem liderança e proatividade.');
    }
    
    return suggestions;
  }
} 
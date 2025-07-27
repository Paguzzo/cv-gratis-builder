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

  experience: `Você é um especialista em RH com 15 anos de experiência em recrutamento e análise de currículos. Sua missão é transformar experiências profissionais em descrições impactantes e autênticas.

CONTEXTO DA EXPERIÊNCIA:
Cargo: {position}  
Empresa: {company}
Descrição fornecida: {userInput}
Palavras-chave específicas: {keywords}

DIRETRIZES CRÍTICAS:
1. AUTENTICIDADE: Baseie-se EXCLUSIVAMENTE na descrição fornecida pelo usuário
2. CONTEXTUALIZAÇÃO: Adapte a linguagem ao setor específico (saúde, tecnologia, gestão, etc.)
3. DIVERSIDADE: Crie bullets únicos e variados para cada palavra-chave
4. REALISMO: NUNCA invente percentuais ou métricas não mencionadas
5. COERÊNCIA: Mantenha consistência com o cargo e tempo de experiência

METODOLOGIA DE CRIAÇÃO:
• Analise o setor profissional pelo cargo e palavras-chave
• Para cada palavra-chave, crie um bullet específico e contextual
• Use verbos de ação apropriados ao setor
• Integre palavras-chave naturalmente na narrativa
• Mantenha linguagem profissional e impactante

ESTRUTURA POR SETOR:

SAÚDE/ENFERMAGEM:
- Verbos: Prestou, Realizou, Administrou, Executou, Manteve, Participou
- Foco: Cuidado ao paciente, segurança, protocolos, qualidade assistencial
- Evite: Métricas corporativas, linguagem empresarial genérica

TECNOLOGIA:
- Verbos: Desenvolveu, Implementou, Otimizou, Projetou, Integrou
- Foco: Soluções técnicas, sistemas, performance, inovação

GESTÃO:
- Verbos: Liderou, Coordenou, Supervisionou, Desenvolveu, Estabeleceu
- Foco: Equipes, processos, resultados organizacionais

REGRAS OBRIGATÓRIAS:
✅ Máximo 4-5 bullets
✅ Cada bullet deve ser único e contextual
✅ Integre TODAS as palavras-chave fornecidas
✅ Use linguagem específica do setor
✅ NÃO invente dados, percentuais ou métricas
✅ Mantenha coerência com a descrição original

Transforme esta experiência em bullets profissionais e autênticos:`
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
    // LÓGICA COMPLETAMENTE NOVA: Geração contextual baseada no cargo e setor
    const positionMatch = prompt.match(/Cargo: (.+)/);
    const companyMatch = prompt.match(/Empresa: (.+)/);
    const keywordsMatch = prompt.match(/Competências-chave: (.+)/);
    const userTextMatch = prompt.match(/Descrição atual: (.+?)(?=Competências-chave|$)/s);
    
    const position = positionMatch ? positionMatch[1].trim() : 'Profissional';
    const company = companyMatch ? companyMatch[1].trim() : '';
    const keywords = keywordsMatch ? keywordsMatch[1].split(',').map(k => k.trim()).filter(k => k.length > 1) : [];
    const userText = userTextMatch ? userTextMatch[1].trim() : '';
    
    // Detectar setor profissional baseado no cargo e palavras-chave
    const healthcareTerms = ['enfermagem', 'hospital', 'clínica', 'medicamentos', 'pacientes', 'sinais vitais', 'curativos', 'biossegurança', 'atendimento humanizado', 'prontuário'];
    const techTerms = ['desenvolvimento', 'programação', 'sistema', 'software', 'dados', 'tecnologia', 'algoritmo', 'database'];
    const managementTerms = ['gestão', 'liderança', 'coordenação', 'supervisão', 'equipe', 'projeto', 'estratégia'];
    
    const isHealthcare = healthcareTerms.some(term => 
      position.toLowerCase().includes(term) || 
      keywords.some(k => k.toLowerCase().includes(term)) ||
      userText.toLowerCase().includes(term)
    );
    
    const isTech = techTerms.some(term => 
      position.toLowerCase().includes(term) || 
      keywords.some(k => k.toLowerCase().includes(term))
    );
    
    const isManagement = managementTerms.some(term => 
      position.toLowerCase().includes(term) || 
      keywords.some(k => k.toLowerCase().includes(term))
    );
    
    // Gerar descrições contextuais baseadas no setor
    if (isHealthcare) {
      return generateHealthcareExperience(position, company, keywords, userText);
    } else if (isTech) {
      return generateTechExperience(position, company, keywords, userText);
    } else if (isManagement) {
      return generateManagementExperience(position, company, keywords, userText);
    } else {
      return generateGenericExperience(position, company, keywords, userText);
    }
  }
}

// Função específica para experiências na área da saúde
function generateHealthcareExperience(position: string, company: string, keywords: string[], userText: string): string {
  const healthcareActions = [
    'Prestou assistência integral aos pacientes',
    'Executou procedimentos técnicos de enfermagem',
    'Realizou controle rigoroso de sinais vitais',
    'Administrou medicamentos conforme prescrição médica',
    'Desenvolveu planos de cuidados personalizados',
    'Manteve registros detalhados em prontuários',
    'Participou ativamente de rounds médicos',
    'Implementou protocolos de biossegurança'
  ];
  
  const healthcareImpacts = [
    'garantindo segurança e bem-estar dos pacientes',
    'seguindo rigorosamente protocolos institucionais',
    'mantendo excelência na qualidade do atendimento',
    'contribuindo para redução de intercorrências',
    'promovendo ambiente terapêutico humanizado',
    'assegurando conformidade com normas sanitárias',
    'otimizando fluxos de atendimento',
    'fortalecendo vínculos terapêuticos com pacientes'
  ];
  
  const bullets = [];
  const shuffledActions = [...healthcareActions].sort(() => 0.5 - Math.random());
  const shuffledImpacts = [...healthcareImpacts].sort(() => 0.5 - Math.random());
  
  // Gerar bullets únicos baseados nas palavras-chave
  keywords.slice(0, 4).forEach((keyword, index) => {
    const action = shuffledActions[index % shuffledActions.length];
    const impact = shuffledImpacts[index % shuffledImpacts.length];
    
    if (keyword.toLowerCase().includes('medicamento') || keyword.toLowerCase().includes('administração')) {
      bullets.push(`• Administrou medicamentos e terapias prescritas com precisão e segurança, mantendo registro detalhado e monitoramento contínuo dos pacientes`);
    } else if (keyword.toLowerCase().includes('curativos') || keyword.toLowerCase().includes('feridas')) {
      bullets.push(`• Realizou curativos complexos e cuidados com feridas, aplicando técnicas especializadas e promovendo cicatrização adequada`);
    } else if (keyword.toLowerCase().includes('sinais vitais') || keyword.toLowerCase().includes('monitoramento')) {
      bullets.push(`• Monitorou sinais vitais e parâmetros clínicos dos pacientes, identificando alterações e comunicando à equipe médica prontamente`);
    } else if (keyword.toLowerCase().includes('prontuário') || keyword.toLowerCase().includes('registro')) {
      bullets.push(`• Manteve documentação completa e precisa dos cuidados prestados, assegurando continuidade assistencial e rastreabilidade`);
    } else if (keyword.toLowerCase().includes('biossegurança') || keyword.toLowerCase().includes('infecção')) {
      bullets.push(`• Implementou rigorosamente protocolos de biossegurança e prevenção de infecções, contribuindo para ambiente seguro`);
    } else {
      bullets.push(`• ${action} focando em ${keyword}, ${impact} e fortalecendo resultados assistenciais`);
    }
  });
  
  // Adicionar bullet de desenvolvimento profissional se necessário
  if (bullets.length < 4) {
    bullets.push(`• Participou de treinamentos continuados e capacitações técnicas, mantendo atualização profissional e excelência no atendimento`);
  }
  
  return bullets.slice(0, 5).join('\n');
}

// Função específica para experiências em tecnologia
function generateTechExperience(position: string, company: string, keywords: string[], userText: string): string {
  const techActions = [
    'Desenvolveu soluções tecnológicas inovadoras',
    'Implementou arquiteturas escaláveis e robustas',
    'Otimizou performance de sistemas críticos',
    'Automatizou processos complexos',
    'Projetou e implementou APIs eficientes',
    'Desenvolveu interfaces intuitivas e responsivas',
    'Integrou sistemas legados com novas tecnologias',
    'Estabeleceu pipelines de CI/CD'
  ];
  
  const bullets = [];
  keywords.slice(0, 4).forEach((keyword, index) => {
    const action = techActions[index % techActions.length];
    bullets.push(`• ${action} utilizando ${keyword}, resultando em melhoria significativa na experiência do usuário e eficiência operacional`);
  });
  
  if (bullets.length < 4) {
    bullets.push(`• Colaborou com equipes multidisciplinares para entrega de projetos complexos, mantendo alta qualidade de código e documentação`);
  }
  
  return bullets.slice(0, 5).join('\n');
}

// Função específica para experiências em gestão
function generateManagementExperience(position: string, company: string, keywords: string[], userText: string): string {
  const managementActions = [
    'Liderou equipes multidisciplinares',
    'Implementou estratégias organizacionais',
    'Coordenou projetos complexos',
    'Otimizou processos operacionais',
    'Desenvolveu talentos da equipe',
    'Estabeleceu métricas de performance',
    'Gerenciou stakeholders estratégicos',
    'Promoveu cultura de excelência'
  ];
  
  const bullets = [];
  keywords.slice(0, 4).forEach((keyword, index) => {
    const action = managementActions[index % managementActions.length];
    bullets.push(`• ${action} com foco em ${keyword}, alcançando objetivos estratégicos e fortalecendo resultados organizacionais`);
  });
  
  if (bullets.length < 4) {
    bullets.push(`• Capacitou e desenvolveu membros da equipe, contribuindo para crescimento profissional e retenção de talentos`);
  }
  
  return bullets.slice(0, 5).join('\n');
}

// Função genérica para outras áreas
function generateGenericExperience(position: string, company: string, keywords: string[], userText: string): string {
  const genericActions = [
    'Executou atividades especializadas',
    'Colaborou efetivamente com equipes',
    'Implementou melhorias processuais',
    'Manteve padrões de qualidade elevados',
    'Contribuiu para objetivos organizacionais',
    'Desenvolveu competências técnicas',
    'Participou de projetos estratégicos',
    'Estabeleceu relacionamentos profissionais'
  ];
  
  const bullets = [];
  keywords.slice(0, 4).forEach((keyword, index) => {
    const action = genericActions[index % genericActions.length];
    bullets.push(`• ${action} relacionadas a ${keyword}, contribuindo para eficiência operacional e qualidade dos resultados`);
  });
  
  if (bullets.length < 4) {
    bullets.push(`• Manteve atualização profissional constante e participou de iniciativas de melhoria contínua`);
  }
  
  return bullets.slice(0, 5).join('\n');
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
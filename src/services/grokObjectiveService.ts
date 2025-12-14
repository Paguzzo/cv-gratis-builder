// 🔒 SERVIÇO SEGURO para geração de objetivo profissional usando GROK AI
import { toast } from '@/hooks/use-toast';
import SecureApiService from './secureApiService';

interface GrokConfig {
  MODEL: string;
  MAX_TOKENS: number;
}

// Configurações do GROK (sem chave de API - agora no backend)
const GROK_CONFIG: GrokConfig = {
  MODEL: 'grok-beta',
  MAX_TOKENS: 500
};

interface ObjectiveRequest {
  keywords: string;
  seekingFor?: string;
  description?: string;
  position?: string;
}

interface ObjectiveResponse {
  content: string;
  source: 'grok' | 'fallback';
}

export class GrokObjectiveService {
  
  // ✅ GROK sempre configurado via backend seguro
  static isConfigured(): boolean {
    return true; // Backend sempre disponível
  }

  // Gerar objetivo profissional usando GROK
  static async generateObjective(request: ObjectiveRequest): Promise<ObjectiveResponse> {
    console.log('🤖 GROK: Iniciando geração de objetivo profissional...');
    
    // Se GROK não estiver configurado, usar fallback
    if (!this.isConfigured()) {
      console.warn('⚠️ GROK: API não configurada, usando fallback...');
      return this.generateFallbackObjective(request);
    }

    try {
      // Criar prompt especializado para GROK
      const prompt = this.buildGrokPrompt(request);
      
      // 🔒 Chamar GROK via backend seguro
      const grokResponse = await SecureApiService.generateWithGrok({
        prompt,
        maxTokens: GROK_CONFIG.MAX_TOKENS
      });
      
      
      return {
        content: grokResponse.content,
        source: 'grok'
      };
      
    } catch (error) {
      console.error('❌ GROK: Erro na API, usando fallback:', error);
      return this.generateFallbackObjective(request);
    }
  }

  // Construir prompt otimizado para GROK
  private static buildGrokPrompt(request: ObjectiveRequest): string {
    const { keywords, seekingFor, description, position } = request;

    return `Você é um especialista em Recursos Humanos criando um objetivo profissional de alto impacto para um currículo.

DADOS FORNECIDOS:
- Competências-chave: ${keywords}
${description ? `- Contexto: ${description}` : ''}
${position || seekingFor ? `- Objetivo de carreira: ${position || seekingFor}` : ''}

REGRAS CRÍTICAS (NÃO VIOLE ESTAS REGRAS):

1. NUNCA REPITA palavras ou conceitos - cada competência deve aparecer UMA ÚNICA VEZ
2. INTEGRE as competências de forma NATURAL em frases fluidas, não as liste
3. SEJA ESPECÍFICO - evite frases genéricas que servem para qualquer profissional
4. Use TODAS as competências fornecidas de forma orgânica e contextualizada

ESTRUTURA DO TEXTO (3-4 frases):

Frase 1 - POSICIONAMENTO:
Apresente o profissional com sua área principal e contexto (se houver anos de experiência, mencione).
Exemplo: "Especialista em operações florestais com 12 anos dedicados à gestão de atividades de silvicultura."

Frase 2 - EXPERTISE INTEGRADA:
Integre as competências-chave de forma natural, mostrando COMO são aplicadas (não apenas liste).
ATENÇÃO: Se uma competência já foi mencionada, use sinônimos ou reformule - NUNCA repita.
Exemplo: "Expertise em coordenação de equipes próprias e terceirizadas, com foco em otimização de custos operacionais e implementação de processos mecanizados que aumentam produtividade."

Frase 3 - VALOR E IMPACTO:
Demonstre o valor entregue e diferenciais profissionais.
Exemplo: "Reconhecido por implementar soluções que equilibram eficiência operacional com sustentabilidade, gerando resultados mensuráveis e redução de desperdícios."

Frase 4 - OBJETIVO (se fornecido):
Se "objetivo de carreira" foi informado, integre aqui conectando com as competências.
Se NÃO foi fornecido, faça uma frase de fechamento sobre impacto/visão profissional.

EXEMPLO COMPLETO (para o caso do usuário):

Input: "Gestão das atividades de silvicultura, gestão de equipe própria e terceira, gestão de custos, mecanização"

CORRETO ✅:
"Especialista em operações de silvicultura com sólida experiência na coordenação integrada de atividades florestais. Expertise comprovada na liderança de equipes próprias e terceirizadas, com foco em otimização de custos operacionais e implementação de processos mecanizados que elevam produtividade. Reconhecido por desenvolver soluções que equilibram eficiência, sustentabilidade e resultados financeiros mensuráveis. Comprometido com a excelência operacional e a evolução contínua das práticas de gestão florestal."

ERRADO ❌ (NÃO FAÇA ASSIM):
"Especialista em Gestão de silvicultura com foco em gestão de equipe própria e terceira. Comprovada expertise em gestão de equipe própria e terceira, gestão de custos, mecanização..."
(Problema: repete "gestão de equipe própria e terceira" duas vezes, lista palavras sem contexto)

DIRETRIZES FINAIS:
- Cada competência aparece UMA VEZ no texto
- Use sinônimos e reformulações para evitar repetição
- Adicione VERBOS DE AÇÃO e CONTEXTO às competências
- O texto deve fluir naturalmente como uma narrativa profissional
- Seja conciso mas impactante

AGORA CRIE o objetivo profissional seguindo RIGOROSAMENTE as regras acima:`;
  }

  // 🔒 REMOVIDO: callGrokAPI() - agora usa backend seguro via SecureApiService

  // Fallback caso GROK falhe
  private static async generateFallbackObjective(request: ObjectiveRequest): Promise<ObjectiveResponse> {

    const { keywords, seekingFor, description } = request;

    // Lógica de fallback INTELIGENTE e MELHORADA
    const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
    const mainKeywords = keywordList.slice(0, 5); // Pegar até 5 palavras-chave

    let objective = '';

    // Extrair informações do contexto
    const experience = this.extractExperienceLevel(description || '');
    const yearsOfExperience = this.extractYearsOfExperience(description || '');
    const mainArea = mainKeywords[0] || 'gestão e desenvolvimento';

    // Primeira frase - Posicionamento Profissional
    if (description && description.length > 20) {
      // Com descrição detalhada
      if (yearsOfExperience) {
        objective += `Profissional ${experience} com ${yearsOfExperience} de experiência especializada em ${mainArea}`;
      } else {
        objective += `Profissional ${experience} especializado em ${mainArea}`;
      }

      // Adicionar contexto da descrição se possível
      const context = this.extractContextFromDescription(description);
      if (context) {
        objective += `, ${context}`;
      }
    } else {
      // Sem descrição, usar palavras-chave
      objective += `Especialista em ${mainArea} com foco em ${mainKeywords[1] || 'excelência operacional'}`;
    }

    objective += '. ';

    // Segunda frase - Competências Técnicas (usar TODAS as palavras-chave)
    if (mainKeywords.length > 1) {
      const competencias = mainKeywords.slice(1, 4).join(', ');
      objective += `Comprovada expertise em ${competencias}`;

      if (mainKeywords.length > 4) {
        objective += ` e ${mainKeywords[4]}`;
      }

      objective += ', com histórico de entrega de resultados consistentes e mensuráveis';
    } else {
      objective += `Sólida experiência em ${mainArea}, com capacidade de liderar projetos complexos e gerar impacto positivo`;
    }

    objective += '. ';

    // Terceira frase - Diferenciais e Abordagem
    const softSkills = this.generateRelevantSoftSkills(mainKeywords);
    objective += `Reconhecido por ${softSkills}, sempre orientado à inovação e melhoria contínua`;
    objective += '. ';

    // Quarta frase - Objetivo Profissional (se fornecido)
    if (seekingFor && seekingFor.trim().length > 0) {
      const seeking = seekingFor.toLowerCase();
      objective += `Busco contribuir em ${seeking} onde possa aplicar minha experiência em ${mainArea} para impulsionar ${this.getRelevantObjective(mainKeywords)}`;
    } else {
      // Sem "o que busca", focar no valor entregue
      objective += `Focado em entregar soluções estratégicas que otimizam processos, maximizam resultados e agregam valor sustentável ao negócio`;
    }

    objective += '.';

    return {
      content: objective,
      source: 'fallback'
    };
  }

  // Extrair anos de experiência da descrição
  private static extractYearsOfExperience(description: string): string {
    const text = description.toLowerCase();

    // Padrões: "X anos", "X ano", etc
    const patterns = [
      /(\d+)\s*anos/i,
      /(\d+)\s*ano/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return `${match[1]} anos`;
      }
    }

    return '';
  }

  // Extrair contexto relevante da descrição
  private static extractContextFromDescription(description: string): string {
    const text = description.toLowerCase();

    // Identificar área de atuação mencionada
    const areas = ['tecnologia', 'ti', 'vendas', 'marketing', 'rh', 'recursos humanos',
                   'financeiro', 'finanças', 'operações', 'logística', 'comercial',
                   'engenharia', 'projetos', 'qualidade', 'produção'];

    for (const area of areas) {
      if (text.includes(area)) {
        return `atuando na área de ${area}`;
      }
    }

    // Identificar setor mencionado
    const setores = ['saúde', 'educação', 'varejo', 'indústria', 'serviços',
                     'tecnologia', 'agronegócio', 'construção'];

    for (const setor of setores) {
      if (text.includes(setor)) {
        return `com foco no setor de ${setor}`;
      }
    }

    return '';
  }

  // Gerar soft skills relevantes baseadas nas palavras-chave
  private static generateRelevantSoftSkills(keywords: string[]): string {
    const keywordsText = keywords.join(' ').toLowerCase();

    // Mapear palavras-chave para soft skills relevantes
    if (keywordsText.includes('gestão') || keywordsText.includes('liderança') || keywordsText.includes('equipe')) {
      return 'capacidade de liderança e desenvolvimento de equipes de alto desempenho';
    }

    if (keywordsText.includes('análise') || keywordsText.includes('dados') || keywordsText.includes('business intelligence')) {
      return 'pensamento analítico e capacidade de transformar dados em insights estratégicos';
    }

    if (keywordsText.includes('vendas') || keywordsText.includes('comercial') || keywordsText.includes('negociação')) {
      return 'habilidades excepcionais de negociação e relacionamento com clientes';
    }

    if (keywordsText.includes('projeto') || keywordsText.includes('planejamento') || keywordsText.includes('ágil')) {
      return 'gestão eficaz de projetos e capacidade de entregar no prazo';
    }

    if (keywordsText.includes('qualidade') || keywordsText.includes('processo') || keywordsText.includes('melhoria')) {
      return 'foco em excelência operacional e melhoria contínua de processos';
    }

    // Genérico mas profissional
    return 'visão estratégica, capacidade de resolução de problemas complexos e orientação a resultados';
  }

  // Gerar objetivo relevante baseado nas palavras-chave
  private static getRelevantObjective(keywords: string[]): string {
    const keywordsText = keywords.join(' ').toLowerCase();

    if (keywordsText.includes('crescimento') || keywordsText.includes('expansão')) {
      return 'crescimento e expansão do negócio';
    }

    if (keywordsText.includes('inovação') || keywordsText.includes('transformação digital')) {
      return 'inovação e transformação digital';
    }

    if (keywordsText.includes('vendas') || keywordsText.includes('receita')) {
      return 'aumento de receita e market share';
    }

    if (keywordsText.includes('operações') || keywordsText.includes('eficiência')) {
      return 'eficiência operacional e redução de custos';
    }

    if (keywordsText.includes('qualidade') || keywordsText.includes('excelência')) {
      return 'excelência operacional e garantia de qualidade';
    }

    // Genérico mas estratégico
    return 'crescimento sustentável e resultados de alto impacto';
  }

  // Extrair nível de experiência da descrição
  private static extractExperienceLevel(description: string): string {
    const text = description.toLowerCase();
    
    if (text.includes('sênior') || text.includes('senior') || text.includes('líder') || text.includes('coordenador') || text.includes('gerente')) {
      return 'sênior';
    }
    
    if (text.includes('pleno') || text.includes('anos') || text.includes('experiência')) {
      return 'experiente';
    }
    
    return 'qualificado';
  }

  // 🔒 Testar conectividade com GROK via backend seguro
  static async testConnection(): Promise<{ success: boolean; error?: string; model?: string }> {
    try {
      const response = await SecureApiService.generateWithGrok({
        prompt: 'teste de conectividade',
        maxTokens: 10
      });

      return { success: true, model: GROK_CONFIG.MODEL };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de conectividade com backend'
      };
    }
  }

  // Obter informações de configuração
  static getConfig() {
    return {
      isConfigured: this.isConfigured(),
      model: GROK_CONFIG.MODEL,
      backend: 'secure' // Backend gerencia chaves de API
    };
  }
}
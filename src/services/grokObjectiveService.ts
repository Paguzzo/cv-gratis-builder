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

    return `Você é um ESPECIALISTA SÊNIOR em Recursos Humanos e desenvolvimento de carreira, com mais de 15 anos de experiência criando currículos de alto impacto para executivos e profissionais de mercado.

📋 DADOS DO CANDIDATO:
Palavras-chave estratégicas: ${keywords}
${description ? `Descrição base: ${description}` : ''}
${position || seekingFor ? `O que busca: ${position || seekingFor}` : ''}

🎯 SUA MISSÃO:
Criar um objetivo profissional EXCEPCIONAL de 3-5 frases que seja:
• ESPECÍFICO e personalizado para este candidato
• IMPACTANTE e memorável para recrutadores
• NATURAL e fluido na leitura
• ESTRATÉGICO ao posicionar o candidato no mercado

✅ INSTRUÇÕES DETALHADAS:

1️⃣ ANÁLISE PROFUNDA:
   - Identifique o nível de senioridade mencionado na descrição (júnior/pleno/sênior/especialista)
   - Extraia a área de atuação principal das palavras-chave
   - Identifique competências técnicas vs. comportamentais
   - Reconheça padrões de especialização ou nichos mencionados

2️⃣ INTEGRAÇÃO DAS PALAVRAS-CHAVE:
   - Use TODAS as palavras-chave fornecidas de forma ORGÂNICA
   - Não liste as palavras mecanicamente
   - Transforme-as em narrativa profissional coerente
   - Crie conexões lógicas entre elas
   - Adicione verbos de ação e contexto que as tornem vivas

3️⃣ APROVEITAMENTO DA DESCRIÇÃO:
   - Extraia informações específicas mencionadas (anos de experiência, setores, realizações)
   - Use o contexto para enriquecer o texto
   - Mantenha fidelidade aos dados fornecidos
   - Expanda conceitos de forma inteligente sem inventar

4️⃣ USO DO CAMPO "O QUE BUSCA":
   - Se fornecido, integre como objetivo de carreira na ÚLTIMA frase
   - Conecte com as competências mencionadas
   - Demonstre como o candidato agregará valor nessa busca
   - Seja específico sobre o tipo de contribuição desejada

📝 ESTRUTURA ESTRATÉGICA:

• Frase 1 (POSICIONAMENTO):
  Apresentação profissional + nível de senioridade + área de especialização principal
  Exemplo: "Especialista em [área] com [X anos] de experiência focada em [nicho específico]"

• Frase 2 (COMPETÊNCIAS TÉCNICAS):
  Integre as palavras-chave técnicas de forma natural, mostrando domínio
  Exemplo: "Comprovada expertise em [competência 1], [competência 2] e [competência 3], com histórico de [resultado]"

• Frase 3 (DIFERENCIAIS):
  Destaque competências comportamentais, soft skills ou abordagem única
  Exemplo: "Reconhecido por [diferencial 1] e [diferencial 2], sempre orientado a [valor]"

• Frase 4 (VALOR ENTREGUE):
  Demonstre o impacto/valor que o profissional gera
  Exemplo: "Focado em entregar [tipo de resultado] através de [abordagem/metodologia]"

• Frase 5 (OBJETIVO - OPCIONAL):
  Se "o que busca" foi fornecido, integre aqui de forma estratégica
  Exemplo: "Busco contribuir em [área/posição desejada] onde possa aplicar minha experiência em [competências] para [objetivo específico]"

💡 EXEMPLOS DE QUALIDADE:

EXEMPLO 1 (COM "O QUE BUSCA"):
Input: keywords="gestão de projetos, metodologias ágeis, liderança de equipes", description="10 anos em TI, coordenando projetos de transformação digital", seekingFor="Posição de gerência em empresas de tecnologia"

Output: "Profissional com 10 anos de experiência em Tecnologia da Informação, especializado em gestão de projetos de transformação digital. Expertise consolidada em metodologias ágeis, com histórico de liderança de equipes multidisciplinares em ambientes dinâmicos e inovadores. Reconhecido por implementar processos eficientes que aceleram entregas e maximizam resultados estratégicos. Busco posição de gerência em empresas de tecnologia onde possa aplicar minha experiência em gestão ágil para impulsionar a inovação e o crescimento organizacional."

EXEMPLO 2 (SEM "O QUE BUSCA"):
Input: keywords="análise de dados, business intelligence, SQL, Python", description="Analista com 5 anos focado em inteligência de mercado"

Output: "Analista de dados com 5 anos de experiência especializada em inteligência de mercado e suporte a decisões estratégicas. Domínio avançado de SQL e Python para desenvolvimento de soluções de Business Intelligence que transformam dados complexos em insights acionáveis. Capacidade comprovada de identificar tendências, otimizar processos e gerar valor através de análises preditivas. Comprometido com a excelência analítica e a entrega de recomendações fundamentadas que impulsionam o crescimento do negócio."

🚫 PROIBIÇÕES ABSOLUTAS:
- ❌ Textos genéricos que servem para qualquer profissional
- ❌ Listar palavras-chave sem contexto ("Experiência em X, Y, Z")
- ❌ Inventar números, tecnologias ou certificações não mencionadas
- ❌ Usar clichês ("profissional dinâmico", "proativo", sem contexto)
- ❌ Frases muito curtas ou superficiais
- ❌ Ignorar o campo "o que busca" quando fornecido

⚠️ REGRA CRÍTICA DE NÃO-REPETIÇÃO:
- ❌ NUNCA repita a mesma frase, expressão ou conceito mais de uma vez no texto final
- ❌ Se o usuário repetiu uma informação nas palavras-chave E na descrição, USE APENAS UMA VEZ
- ❌ Analise os dados de entrada e identifique duplicações ANTES de escrever
- ❌ Cada competência, número ou informação específica deve aparecer NO MÁXIMO UMA VEZ
- ❌ Varie a linguagem: não use as mesmas palavras para expressar ideias similares
- Exemplo: Se "gestão de 140 colaboradores" aparece nas palavras-chave E na descrição, mencione APENAS UMA VEZ no texto final

🎬 AGORA CRIE:
Com base nos dados fornecidos acima, crie um objetivo profissional EXCEPCIONAL seguindo rigorosamente todas as instruções. O texto deve impressionar recrutadores e posicionar o candidato como autoridade em sua área.

IMPORTANTE: Use APENAS as informações fornecidas. Não invente dados, mas seja criativo ao expandir e contextualizar o que foi dado.`;
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
// 🔒 SERVIÇO SEGURO para geração de experiências profissionais usando GROK AI
// SEGURANÇA: Usa backend seguro - chaves de API nunca expostas no frontend

import SecureApiService from './secureApiService';

interface GrokConfig {
  MODEL: string;
  MAX_TOKENS: number;
}

// Configurações do GROK (sem chave de API - agora no backend)
const GROK_CONFIG: GrokConfig = {
  MODEL: 'grok-beta',
  MAX_TOKENS: 3000
};

interface ExperienceRequest {
  position: string;
  company: string;
  userDescription: string;
  keywords: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

interface ExperienceResponse {
  success: boolean;
  content?: string;
  error?: string;
  source: 'grok' | 'fallback';
}

export class GrokExperienceService {
  
  // ✅ GROK sempre configurado via backend seguro
  static isConfigured(): boolean {
    return true; // Backend sempre disponível
  }

  // Gerar descrição de experiência usando GROK
  static async generateExperienceDescription(request: ExperienceRequest): Promise<ExperienceResponse> {
    console.log('🤖 GROK: Iniciando geração de experiência profissional...');
    
    // Se GROK não estiver configurado, usar fallback
    if (!this.isConfigured()) {
      console.warn('⚠️ GROK: API não configurada, usando fallback...');
      return this.generateFallbackDescription(request);
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
        success: true,
        content: grokResponse.content,
        source: 'grok'
      };

    } catch (error) {
      console.error('❌ GROK: Erro na API, usando fallback:', error);
      return this.generateFallbackDescription(request);
    }
  }

  // Construir prompt otimizado para GROK
  private static buildGrokPrompt(request: ExperienceRequest): string {
    const duration = request.isCurrent ?
      `de ${request.startDate} até o presente` :
      `de ${request.startDate} a ${request.endDate}`;

    return `Você é um especialista em Recursos Humanos criando bullets de alto impacto para uma experiência profissional em currículo.

DADOS DA EXPERIÊNCIA:
- Cargo: ${request.position}
- Empresa: ${request.company}
- Período: ${duration}
- Descrição das atividades: "${request.userDescription}"
- Competências-chave: ${request.keywords}

REGRAS CRÍTICAS (NÃO VIOLE):

1. GERE EXATAMENTE 3 A 5 BULLETS (não menos, não mais)
2. CADA BULLET DEVE SER ÚNICO - varie formato, foco e estrutura
3. INTEGRE as competências-chave de forma NATURAL (não liste mecanicamente)
4. USE a descrição fornecida + seu conhecimento sobre o cargo "${request.position}"
5. NUNCA repita o mesmo verbo de ação mais de uma vez
6. SEJA ESPECÍFICO - evite frases genéricas que servem para qualquer profissional

ESTRUTURA DE CADA BULLET:

Formato: VERBO DE AÇÃO + ATIVIDADE ESPECÍFICA + COMPETÊNCIA/MÉTODO + RESULTADO/FINALIDADE

Exemplo correto: "Desenvolveu dashboards gerenciais em Power BI consolidando dados de vendas, possibilitando análise de performance em tempo real"

VARIAÇÃO OBRIGATÓRIA:

Bullet 1 - FOCO EM RESULTADO:
Mostre o IMPACTO da atividade (o que foi alcançado/gerado)
Exemplo: "Analisou processos operacionais identificando gargalos, propondo melhorias que reduziram tempo de execução"

Bullet 2 - FOCO EM EXECUÇÃO:
Descreva COMO a atividade foi realizada (metodologia/ferramentas)
Exemplo: "Coordenou equipe de 8 pessoas utilizando metodologia ágil, facilitando entregas incrementais e adaptação a mudanças"

Bullet 3 - FOCO EM RESPONSABILIDADE:
Defina o ESCOPO da responsabilidade
Exemplo: "Responsável pela gestão completa do ciclo de compras, desde especificação até homologação de fornecedores"

Bullets 4-5 (se aplicável) - VARIE O FOCO:
Alterne entre: colaboração, otimização, entrega técnica, articulação com áreas
Use estruturas diferentes dos bullets anteriores

DIRETRIZES DE QUALIDADE:

✅ FAÇA:
- Use seu conhecimento sobre o cargo para enriquecer as atividades
- Integre TODAS as competências (${request.keywords}) distribuídas nos bullets
- Mostre valor e contexto profissional de cada atividade
- Varie extensão dos bullets (alguns mais curtos, outros descritivos)
- Use verbos de ação fortes e diferentes em cada bullet

❌ NÃO FAÇA:
- Inventar métricas, números ou ferramentas não mencionadas
- Usar frases genéricas: "garantindo qualidade", "otimizando processos"
- Listar competências sem contexto: "Atuou com X, Y e Z"
- Repetir a mesma estrutura em todos os bullets
- Usar o mesmo verbo mais de uma vez

EXEMPLO COMPLETO:

Cargo: "Analista de Dados"
Descrição: "Análise de dados comerciais, criação de relatórios"
Competências: "SQL, Python, Power BI, Excel"

CORRETO ✅:
• Analisou dados comerciais utilizando SQL e Python, identificando padrões de compra que orientaram estratégia de segmentação de clientes
• Desenvolveu dashboards executivos em Power BI consolidando KPIs de vendas, possibilitando acompanhamento de metas em tempo real
• Elaborou relatórios gerenciais com Excel avançado, automatizando processos de coleta e apresentando insights acionáveis à liderança
• Colaborou com equipe comercial traduzindo análises em recomendações estratégicas para campanhas promocionais

ERRADO ❌:
• Analisou dados utilizando SQL, Python, Power BI e Excel
• Realizou análise de dados comerciais garantindo qualidade
• Criou relatórios otimizando processos
(Problemas: lista competências sem contexto, frases genéricas, sem variação, apenas 3 bullets vagos)

IMPORTANTE SOBRE REPETIÇÕES:

Como o candidato pode ter VÁRIAS experiências no currículo, CADA experiência deve ter abordagem DIFERENTE.
- Varie os verbos de ação entre experiências
- Mude o foco e estilo narrativo
- Use sinônimos e estruturas alternativas

AGORA CRIE:

Com base nos dados fornecidos acima, gere 3 a 5 bullets de alto impacto para a experiência como ${request.position}.

RETORNE APENAS OS BULLETS, um por linha, iniciando com "•" - sem explicações ou comentários.`;
  }

  // Instruções específicas por estilo
  private static getStyleInstructions(style: string, request: ExperienceRequest): string {
    const styles = {
      'RESULTADO E IMPACTO': `
📊 **Foque em RESULTADOS e IMPACTO:**
- Cada bullet deve mostrar o RESULTADO da atividade
- Estrutura: Verbo + Ação + Tecnologia/Método + Resultado/Impacto
- Enfatize: "identificando...", "direcionando...", "tornando...", "eliminando..."
- Use as competências (${request.keywords}) como FERRAMENTAS que geraram impacto
- Exemplo: "Analisou dados financeiros usando Excel avançado, identificando oportunidades de redução de custos em contratos"`,

      'ATIVIDADE E CONTEXTO': `
🔄 **Foque em ATIVIDADES e CONTEXTO:**
- Cada bullet deve descrever uma atividade clara com seu contexto
- Estrutura: Verbo + Atividade específica + Contexto/Finalidade
- Enfatize: "realizou...", "elaborou...", "participou...", "executou..."
- Integre as competências (${request.keywords}) nas descrições de atividades
- Exemplo: "Elaborou relatórios gerenciais em Power BI, consolidando dados de múltiplas fontes para análise da diretoria"`,

      'METODOLOGIA E EXECUÇÃO': `
⚙️ **Foque em METODOLOGIA e EXECUÇÃO:**
- Cada bullet deve mostrar COMO a atividade foi executada
- Estrutura: Verbo + Metodologia/Abordagem + Execução + Finalidade
- Enfatize: "aplicou...", "executou...", "coordenou...", "implementou..."
- Use as competências (${request.keywords}) como métodos aplicados
- Exemplo: "Aplicou metodologia ágil na coordenação de projetos, facilitando adaptação rápida a mudanças de escopo"`,

      'RESPONSABILIDADE E ESCOPO': `
👔 **Foque em RESPONSABILIDADE e ESCOPO:**
- Cada bullet deve mostrar o ESCOPO da responsabilidade
- Estrutura: "Responsável por..." / "Gerenciou..." + Escopo + Atividades-chave
- Enfatize: "responsável por...", "gerenciou...", "administrou...", "liderou..."
- Integre as competências (${request.keywords}) no escopo das responsabilidades
- Exemplo: "Responsável pela gestão completa do processo de compras, desde cotação até negociação com fornecedores"`,

      'COLABORAÇÃO E COORDENAÇÃO': `
🤝 **Foque em COLABORAÇÃO e COORDENAÇÃO:**
- Cada bullet deve mostrar TRABALHO EM EQUIPE e ARTICULAÇÃO
- Estrutura: Verbo + Colaboração/Coordenação + Equipes/Áreas + Objetivo
- Enfatize: "colaborou...", "articulou...", "apoiou...", "facilitou..."
- Use as competências (${request.keywords}) no contexto colaborativo
- Exemplo: "Colaborou com equipes de produto e tecnologia na definição de requisitos, garantindo alinhamento técnico-estratégico"`,

      'OTIMIZAÇÃO E MELHORIA': `
📈 **Foque em OTIMIZAÇÃO e MELHORIA:**
- Cada bullet deve mostrar MELHORIAS implementadas
- Estrutura: Verbo + Identificação/Análise + Ação de melhoria + Benefício
- Enfatize: "identificou...", "otimizou...", "revisou...", "automatizou...", "propôs..."
- Integre as competências (${request.keywords}) como ferramentas de otimização
- Exemplo: "Identificou ineficiências no processo de atendimento e propôs novo fluxo que melhorou tempo de resposta ao cliente"`
    };

    return styles[style] || styles['ATIVIDADE E CONTEXTO'];
  }

  // 🔒 REMOVIDO: callGrokAPI() - agora usa backend seguro via SecureApiService

  // Fallback caso GROK falhe - MELHORADO para usar conhecimento do cargo
  private static generateFallbackDescription(request: ExperienceRequest): ExperienceResponse {

    console.log('⚠️ Usando fallback inteligente baseado em conhecimento do cargo');

    const keywords = request.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
    const description = request.userDescription.toLowerCase();
    const position = request.position.toLowerCase();

    const bullets: string[] = [];

    // Base de conhecimento: atividades típicas por categoria de cargo
    const cargoKnowledge: Record<string, string[]> = {
      // Engenharia e Técnico
      'engenheiro': [
        'Desenvolveu projetos técnicos aplicando {keywords}, garantindo conformidade com normas e especificações',
        'Realizou análises e cálculos especializados utilizando {keywords} para otimização de processos',
        'Coordenou implementação de melhorias técnicas em {keywords}, acompanhando resultados e ajustes'
      ],
      'técnico': [
        'Executou manutenção e operação de sistemas utilizando {keywords}, assegurando funcionamento adequado',
        'Realizou inspeções e testes com {keywords}, documentando resultados e não-conformidades',
        'Apoiou equipe técnica na resolução de problemas aplicando conhecimentos em {keywords}'
      ],
      // Análise e Dados
      'analista': [
        'Analisou dados e informações utilizando {keywords}, gerando insights para tomada de decisão',
        'Elaborou relatórios e apresentações com {keywords}, comunicando resultados a stakeholders',
        'Colaborou com áreas de negócio aplicando {keywords} para solução de demandas analíticas'
      ],
      'cientista de dados': [
        'Desenvolveu modelos analíticos aplicando {keywords} para previsão e classificação de dados',
        'Realizou exploração e tratamento de dados com {keywords}, preparando bases para análise',
        'Criou visualizações e dashboards utilizando {keywords} para comunicação de insights'
      ],
      // Desenvolvimento
      'desenvolvedor': [
        'Desenvolveu funcionalidades e sistemas utilizando {keywords}, seguindo boas práticas de código',
        'Realizou testes e debugging com {keywords}, garantindo qualidade das entregas',
        'Colaborou com equipe em code reviews aplicando {keywords} para manutenção de padrões'
      ],
      'programador': [
        'Implementou soluções de software com {keywords}, atendendo requisitos funcionais e técnicos',
        'Realizou manutenção e evolução de sistemas aplicando {keywords} de forma eficiente',
        'Participou de cerimônias ágeis utilizando conhecimentos em {keywords} para planejamento'
      ],
      // Gestão e Coordenação
      'gerente': [
        'Gerenciou equipe e processos aplicando {keywords}, acompanhando performance e desenvolvimento',
        'Coordenou projetos estratégicos utilizando {keywords} para alinhamento de entregas e prazos',
        'Analisou indicadores de gestão com {keywords}, propondo ações de melhoria contínua'
      ],
      'coordenador': [
        'Coordenou atividades operacionais utilizando {keywords}, distribuindo demandas e acompanhando execução',
        'Facilitou comunicação entre áreas aplicando {keywords} para alinhamento de processos',
        'Monitorou resultados e métricas com {keywords}, identificando oportunidades de otimização'
      ],
      // Administrativo e Operacional
      'assistente': [
        'Executou rotinas administrativas aplicando {keywords}, mantendo organização e controle de processos',
        'Apoiou equipe em atividades operacionais utilizando {keywords} para agilizar demandas',
        'Elaborou documentos e planilhas com {keywords}, garantindo precisão das informações'
      ],
      'auxiliar': [
        'Realizou atividades de suporte operacional aplicando {keywords} conforme procedimentos estabelecidos',
        'Manteve organização e controle utilizando {keywords} para facilitar acesso a informações',
        'Colaborou com equipe na execução de tarefas com {keywords}, cumprindo prazos e padrões'
      ],
      // Comercial e Vendas
      'vendedor': [
        'Realizou atendimento e negociação com clientes aplicando {keywords} para identificar necessidades',
        'Apresentou produtos e soluções utilizando {keywords}, destacando benefícios e diferenciais',
        'Acompanhou pipeline comercial com {keywords}, gerenciando oportunidades até fechamento'
      ],
      'consultor': [
        'Conduziu diagnósticos e análises aplicando {keywords} para identificar oportunidades de melhoria',
        'Desenvolveu propostas e soluções utilizando {keywords}, alinhadas aos objetivos do cliente',
        'Apresentou recomendações estratégicas com {keywords}, demonstrando valor e retorno esperado'
      ],
      // Atendimento e Suporte
      'atendente': [
        'Realizou atendimento multicanal aplicando {keywords}, solucionando dúvidas e demandas de clientes',
        'Registrou e acompanhou solicitações utilizando {keywords}, garantindo resolução adequada',
        'Manteve comunicação empática com {keywords}, buscando satisfação e fidelização de clientes'
      ],
      // Padrão genérico
      'default': [
        'Executou atividades da função aplicando {keywords}, contribuindo para resultados da área',
        'Utilizou ferramentas e metodologias de {keywords} no desenvolvimento das responsabilidades',
        'Colaborou com equipe aplicando conhecimentos em {keywords} para alcance de objetivos'
      ]
    };

    // Identificar categoria do cargo
    let cargoTemplates = cargoKnowledge.default;
    for (const [key, templates] of Object.entries(cargoKnowledge)) {
      if (position.includes(key)) {
        cargoTemplates = templates;
        break;
      }
    }

    // Função auxiliar para distribuir keywords nos bullets
    const distributeKeywords = (templates: string[], keywords: string[]): string[] => {
      const result: string[] = [];
      const keywordsPerBullet = Math.ceil(keywords.length / Math.min(templates.length, 5));

      for (let i = 0; i < Math.min(templates.length, 5); i++) {
        const startIdx = i * keywordsPerBullet;
        const endIdx = Math.min(startIdx + keywordsPerBullet, keywords.length);
        const bulletKeywords = keywords.slice(startIdx, endIdx);

        if (bulletKeywords.length > 0) {
          const keywordText = bulletKeywords.join(', ');
          const bullet = templates[i].replace('{keywords}', keywordText);
          result.push(`• ${bullet}`);
        }
      }

      return result;
    };

    // Se há keywords, distribuir entre bullets baseados no cargo
    if (keywords.length > 0) {
      bullets.push(...distributeKeywords(cargoTemplates, keywords));
    } else {
      // Se não há keywords, usar descrição genérica
      bullets.push(`• Executou atividades inerentes ao cargo de ${request.position}, aplicando conhecimentos técnicos e operacionais`);
      bullets.push(`• Colaborou com equipe no desenvolvimento de processos e rotinas da função`);
      bullets.push(`• Manteve atualização profissional e aplicação de boas práticas na área de atuação`);
    }

    // Se tem descrição do usuário, tentar adicionar bullet específico
    if (description && description.length > 10) {
      if (description.includes('equipe') || description.includes('time')) {
        bullets.push('• Trabalhou de forma colaborativa com equipe, compartilhando conhecimentos e alinhando esforços para resultados coletivos');
      } else if (description.includes('projeto') || description.includes('projetos')) {
        bullets.push('• Participou ativamente de projetos da área, contribuindo com expertise técnica e acompanhamento de entregas');
      } else if (description.includes('cliente') || description.includes('clientes')) {
        bullets.push('• Manteve relacionamento próximo com clientes, compreendendo necessidades e garantindo qualidade do atendimento');
      }
    }

    return {
      success: true,
      content: bullets.join('\n'),
      source: 'fallback'
    };
  }
}

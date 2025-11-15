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

    // Sistema melhorado de variação: combina múltiplos fatores para criar identidade única
    const positionHash = request.position.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const companyHash = request.company.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const descriptionHash = request.userDescription.slice(0, 20).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const combinedHash = (positionHash * 7 + companyHash * 13 + descriptionHash * 3) % 6;

    const bulletStyles = [
      'RESULTADO E IMPACTO',
      'ATIVIDADE E CONTEXTO',
      'METODOLOGIA E EXECUÇÃO',
      'RESPONSABILIDADE E ESCOPO',
      'COLABORAÇÃO E COORDENAÇÃO',
      'OTIMIZAÇÃO E MELHORIA'
    ];
    const selectedStyle = bulletStyles[combinedHash];

    return `Você é um ESPECIALISTA SÊNIOR em Recursos Humanos com 20 anos de experiência transformando atividades profissionais em bullets de currículo que CONQUISTAM ENTREVISTAS.

🎯 **CONTEXTO DA EXPERIÊNCIA:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 Cargo/Função: ${request.position}
🏢 Empresa: ${request.company}
📅 Período: ${duration}
💼 O que fazia no dia-a-dia: "${request.userDescription}"
🔑 Competências e Tecnologias: ${request.keywords}

🎨 **ESTILO DOMINANTE PARA ESTA EXPERIÊNCIA: ${selectedStyle}**
(Cada experiência do candidato deve ter formato diferente para demonstrar versatilidade)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧠 **PASSO 1: ANÁLISE DO CARGO "${request.position}"**

Antes de escrever os bullets, PENSE sobre este cargo:
• Quais são as responsabilidades TÍPICAS de um(a) ${request.position}?
• Que desafios e problemas esta função geralmente resolve?
• Que entregáveis e resultados são esperados nesta posição?
• Como esta função agrega valor ao negócio?

Use este conhecimento para ENRIQUECER os bullets com contexto profissional realista.
NÃO invente métricas, MAS use seu conhecimento sobre a função para dar profundidade às atividades descritas.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 **PASSO 2: SUA MISSÃO**

Criar 4-6 bullets EXCEPCIONAIS que:
✓ Posicionem o candidato como AUTORIDADE no cargo ${request.position}
✓ Demonstrem VALOR TANGÍVEL e IMPACTO no negócio
✓ Integrem TODAS as competências: ${request.keywords}
✓ Reflitam as atividades reais: "${request.userDescription}"
✓ Sigam PREDOMINANTEMENTE o estilo ${selectedStyle}, mas com VARIAÇÃO INTERNA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 **DIRECIONAMENTO POR ESTILO:**

${this.getStyleInstructions(selectedStyle, request)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ **PRINCÍPIOS DE EXCELÊNCIA:**

1. **CONTEXTUALIZAÇÃO PROFUNDA:**
   - Use seu conhecimento sobre "${request.position}" para inferir atividades típicas da função
   - Combine: [Conhecimento do cargo] + [Descrição do usuário] + [Competências técnicas]
   - Traga profundidade profissional sem inventar dados específicos

2. **INTEGRAÇÃO ESTRATÉGICA:**
   - Integre TODAS as competências (${request.keywords}) de forma NATURAL nas atividades
   - Evite listar palavras-chave mecanicamente - integre-as ao contexto
   - Crie narrativa coesa que demonstre domínio técnico E impacto profissional

3. **FOCO EM VALOR E CONTRIBUIÇÃO:**
   - Estruture: AÇÃO → MÉTODO/FERRAMENTA → RESULTADO/FINALIDADE/IMPACTO
   - Sempre que possível, mostre o "POR QUÊ" da atividade (qual problema resolve? que valor gera?)
   - Use verbos de ação fortes que transmitam protagonismo

4. **VARIAÇÃO INTERNA OBRIGATÓRIA:**
   - NUNCA use o mesmo formato em todos os bullets
   - Varie: extensão (curto vs. descritivo), foco (técnico vs. estratégico), estrutura gramatical
   - Mescle 2-3 estilos dentro da mesma experiência (mas com predominância do estilo principal)
   - Crie ritmo de leitura dinâmico e envolvente

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💎 **DIRETRIZES DE QUALIDADE:**

✅ FAÇA:
• Infira atividades realistas do cargo usando conhecimento profissional
• Demonstre valor e impacto sem precisar de números inventados
• Varie formato, extensão e foco entre os bullets
• Use competências como ferramentas que geraram resultados
• Mostre protagonismo e domínio técnico
• Descreva contexto e finalidade das atividades

❌ EVITE:
• Inventar números, percentuais ou métricas específicas não mencionadas
• Adicionar ferramentas/tecnologias não citadas pelo usuário
• Usar finais genéricos: "otimizando resultados", "garantindo eficiência", "melhorando processos"
• Bullets idênticos ou muito similares
• Listar competências sem contexto: "Experiência em X, Y e Z"
• Repetir o mesmo verbo de ação mais de 2 vezes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 **EXEMPLOS DE EXCELÊNCIA:**

**VARIAÇÃO DENTRO DE UM MESMO ESTILO (RESULTADO E IMPACTO):**
✓ Analisou dados de vendas com SQL e Python, identificando padrões sazonais que direcionaram campanha promocional de fim de ano
✓ Dashboards em Power BI para KPIs comerciais - acesso executivo a insights em tempo real
✓ Implementou validação automatizada de dados, eliminando inconsistências em relatórios mensais e aumentando confiabilidade das análises
✓ Colaborou com equipe comercial interpretando dados de mercado e traduzindo em recomendações acionáveis

**Note:** Mesmo sendo todos do estilo "Resultado e Impacto", há variação em:
- Extensão (bullet 2 é mais curto)
- Estrutura gramatical (bullet 2 usa fragmento)
- Foco (técnico vs. colaborativo)
- Nível de detalhe

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎬 **AGORA EXECUTE:**

**DADOS DA EXPERIÊNCIA:**
- Cargo: ${request.position}
- Atividades descritas: "${request.userDescription}"
- Competências a integrar: ${request.keywords}
- Estilo dominante: ${selectedStyle}

**PROCESSO:**
1. Pense sobre responsabilidades típicas de um(a) ${request.position}
2. Combine esse conhecimento com as atividades descritas
3. Gere 4-6 bullets VARIADOS que demonstrem valor e competência
4. Integre TODAS as competências de forma natural
5. Varie formato e foco entre os bullets (mesmo dentro do estilo ${selectedStyle})

**IMPORTANTE:**
Retorne APENAS os bullets, um por linha, cada um iniciando com "•"
Não inclua explicações, comentários ou cabeçalhos - APENAS os bullets.`;
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

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

    // Gerar um ID único para esta experiência para evitar repetições
    const experienceId = `${request.position}_${request.company}_${request.startDate}`.replace(/\s+/g, '_');

    return `Você é um especialista em transformar atividades profissionais em descrições impactantes SEM INVENTAR INFORMAÇÕES.

**EXPERIÊNCIA ID: ${experienceId}**

📋 **INFORMAÇÕES REAIS FORNECIDAS:**
- Cargo: ${request.position}
- Empresa: ${request.company}
- Período: ${duration}
- Atividades descritas pelo usuário: "${request.userDescription}"
- Palavras-chave fornecidas: ${request.keywords}

🚨 **REGRAS CRÍTICAS - NÃO INVENTE INFORMAÇÕES:**

1. **NUNCA ADICIONE INFORMAÇÕES FALSAS**:
   ❌ NÃO invente porcentagens, números ou métricas que o usuário não mencionou
   ❌ NÃO mencione ferramentas, sistemas ou tecnologias não citadas pelo usuário
   ❌ NÃO adicione atividades que o usuário não descreveu
   ❌ NÃO invente resultados ou conquistas não mencionadas
   ❌ NÃO adicione metodologias (Lean, Six Sigma, etc.) não citadas

2. **USE APENAS O QUE FOI FORNECIDO**:
   ✅ Base-se EXCLUSIVAMENTE na descrição: "${request.userDescription}"
   ✅ Use SOMENTE as palavras-chave fornecidas: ${request.keywords}
   ✅ Transforme as atividades reais em linguagem profissional
   ✅ Cada bullet deve refletir UMA atividade real mencionada pelo usuário

3. **ESTRUTURA DOS BULLETS** (3-6 bullets):
   • Verbo de ação + atividade real descrita + contexto baseado na descrição
   • NUNCA termine com frases genéricas: "otimizando resultados", "contribuindo para objetivos", "garantindo eficiência"
   • Seja ESPECÍFICO sobre o que foi feito, baseado no texto do usuário

4. **FINAIS PROIBIDOS**:
   ❌ "otimizando resultados da área"
   ❌ "contribuindo para objetivos organizacionais"
   ❌ "garantindo eficiência operacional"
   ❌ "melhorando processos internos"
   ❌ "apoiando a equipe"

📝 **EXEMPLO DE TRANSFORMAÇÃO CORRETA:**

**ENTRADA:**
- Atividades: "Controlava máquinas florestais, fazia manutenção preventiva, coordenava equipe"
- Palavras-chave: manutenção, operações florestais, gestão de equipe

**SAÍDA CORRETA:**
• Controlou operações de máquinas florestais, assegurando disponibilidade e performance dos equipamentos
• Executou manutenção preventiva em equipamentos, identificando e corrigindo falhas mecânicas
• Coordenou equipe de operadores, distribuindo atividades e acompanhando execução das tarefas

**SAÍDA ERRADA (NÃO FAÇA ISSO):**
• Gerenciou frota de 50 máquinas ❌ (INVENTOU NÚMERO) utilizando sistema SAP ❌ (INVENTOU FERRAMENTA), reduzindo downtime em 30% ❌ (INVENTOU MÉTRICA)
• Implementou metodologia Lean Six Sigma ❌ (INVENTOU METODOLOGIA) nas operações florestais

🎯 **AGORA TRANSFORME AS ATIVIDADES:**
Texto do usuário: "${request.userDescription}"
Palavras-chave: ${request.keywords}

Gere 3-6 bullets profissionais baseados APENAS nas informações fornecidas. NÃO invente números, ferramentas ou resultados.`;
  }

  // 🔒 REMOVIDO: callGrokAPI() - agora usa backend seguro via SecureApiService

  // Fallback caso GROK falhe
  private static generateFallbackDescription(request: ExperienceRequest): ExperienceResponse {
    
    // Fallback inteligente baseado no texto do usuário
    const keywords = request.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
    const description = request.userDescription.toLowerCase();
    
    const bullets = [];
    
    // Analisar atividades específicas mencionadas
    if (description.includes('controle') || description.includes('controlava')) {
      bullets.push(`• Administrou controle de processos operacionais, mantendo registros atualizados e precisos.`);
    } else if (description.includes('organiz') || description.includes('arquivo')) {
      bullets.push(`• Estruturou sistema de organização documental, facilitando acesso rápido às informações.`);
    } else if (description.includes('atend') || description.includes('telefone')) {
      bullets.push(`• Realizou atendimento ao cliente via telefone, solucionando dúvidas e direcionando demandas.`);
    } else if (description.includes('planilha') || description.includes('excel')) {
      bullets.push(`• Elaborou planilhas de controle e acompanhamento, automatizando cálculos e relatórios.`);
    } else {
      bullets.push(`• Executou atividades operacionais do cargo ${request.position.toLowerCase()}, seguindo procedimentos estabelecidos.`);
    }
    
    // Calcular quantidade de bullets baseada nas palavras-chave (3-8 bullets)
    const targetBullets = Math.min(Math.max(3, keywords.length + 1), 8);
    
    // Adicionar bullets baseados nas palavras-chave
    const specificEndings = [
      'utilizando ferramentas digitais especializadas.',
      'seguindo normas e procedimentos internos.',
      'mantendo comunicação efetiva com equipe.',
      'priorizando qualidade e precisão dos resultados.',
      'cumprindo prazos estabelecidos pela gestão.',
      'aplicando melhores práticas do setor.',
      'garantindo conformidade com regulamentações.'
    ];
    
    const verbs = [
      'Aplicou conhecimentos em',
      'Utilizou ferramentas de', 
      'Operou sistemas de',
      'Gerenciou processos de',
      'Coordenou atividades de',
      'Desenvolveu rotinas de',
      'Implementou procedimentos de'
    ];
    
    // Corrigir ortografia de palavras-chave comuns
    const correctedKeywords = keywords.map(keyword => {
      const corrections = {
        'elatórios': 'relatórios',
        'relatóios': 'relatórios',
        'planilhas': 'planilhas',
        'telefone': 'telefone',
        'arquivo': 'arquivo'
      };
      return corrections[keyword.toLowerCase()] || keyword;
    });
    
    correctedKeywords.forEach((keyword, index) => {
      if (bullets.length < targetBullets) {
        const verb = verbs[index % verbs.length];
        const ending = specificEndings[index % specificEndings.length];
        bullets.push(`• ${verb} ${keyword}, ${ending}`);
      }
    });
    
    // Adicionar bullets extras se necessário para atingir o mínimo
    const extraBullets = [
      '• Colaborou com equipe multidisciplinar, compartilhando informações e alinhando atividades.',
      '• Participou de reuniões setoriais, contribuindo com sugestões e feedback construtivo.',
      '• Manteve organização do ambiente de trabalho, otimizando fluxo de atividades diárias.'
    ];
    
    let extraIndex = 0;
    while (bullets.length < Math.max(3, targetBullets) && extraIndex < extraBullets.length) {
      bullets.push(extraBullets[extraIndex]);
      extraIndex++;
    }

    return {
      success: true,
      content: bullets.join('\n'),
      source: 'fallback'
    };
  }
}

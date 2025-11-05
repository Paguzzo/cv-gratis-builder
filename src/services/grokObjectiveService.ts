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

    return `Você é um especialista em RH especializado em criar objetivos profissionais concisos e impactantes. Sua missão é transformar as informações fornecidas pelo candidato em um objetivo profissional estratégico SEM INVENTAR INFORMAÇÕES.

📋 INFORMAÇÕES REAIS DO CANDIDATO:
• Palavras-chave fornecidas: ${keywords}
• Posição desejada: ${position || seekingFor || 'Não especificado'}
• Descrição do candidato: ${description || 'Não fornecida'}

🚨 REGRAS CRÍTICAS - LEIA COM ATENÇÃO:

1. **NUNCA INVENTE INFORMAÇÕES**:
   ❌ NÃO adicione porcentagens ou números que o candidato não mencionou
   ❌ NÃO mencione ferramentas, sistemas ou metodologias não citadas pelo candidato
   ❌ NÃO invente conquistas, resultados ou métricas
   ❌ NÃO adicione tecnologias ou certificações não mencionadas

2. **USE APENAS O QUE FOI FORNECIDO**:
   ✅ Use SOMENTE as palavras-chave fornecidas: ${keywords}
   ✅ Base-se EXCLUSIVAMENTE na descrição: ${description || 'sem descrição fornecida'}
   ✅ Transforme o texto do usuário em linguagem profissional SEM adicionar fatos novos
   ✅ Integre as palavras-chave de forma natural no contexto real do candidato

3. **ESTRUTURA OBRIGATÓRIA** (máximo 3-4 frases):
   • Frase 1: Apresentação profissional + área de atuação (baseado na descrição real)
   • Frase 2: Competências-chave (usando APENAS as palavras-chave fornecidas)
   • Frase 3: Experiência e foco (baseado SOMENTE no que foi escrito na descrição)
   • Frase 4 (opcional): Valor agregado (inferido do contexto, SEM inventar dados)

4. **LINGUAGEM PERMITIDA**:
   ✅ "Experiência em [área mencionada]"
   ✅ "Foco em [competência citada]"
   ✅ "Especializado em [palavras-chave fornecidas]"
   ✅ "Atuação em [contexto descrito]"

5. **LINGUAGEM PROIBIDA**:
   ❌ "Redução de X%..." (a menos que o candidato tenha mencionado)
   ❌ "Domínio em [ferramenta não mencionada]"
   ❌ "Utilizando [metodologia não citada]"
   ❌ "Resultados de X%..." (sem evidência fornecida)

📝 EXEMPLO DE TRANSFORMAÇÃO CORRETA:

**ENTRADA:**
- Palavras-chave: Redução de custo, gerencia operacional, gestão de equipe propria
- Descrição: Experiencia de 20 anos em operações florestais, foco em eficiencia operacional e disponibilidade mecanica, com qualidade e segurança

**SAÍDA CORRETA:**
"Profissional com 20 anos de experiência em operações florestais, especializado em redução de custos, gerência operacional e gestão de equipes próprias. Foco em eficiência operacional e disponibilidade mecânica, assegurando qualidade e segurança em todos os processos. Comprometido com a otimização de operações e desenvolvimento de equipes de alto desempenho."

**SAÍDA ERRADA (NÃO FAÇA ISSO):**
"Especialista com 20 anos em operações florestais, dominando ERP florestal e Lean Six Sigma ❌ (INVENTOU FERRAMENTAS), com redução de custos em 15% ❌ (INVENTOU NÚMERO) e aumento de produtividade em 20% ❌ (INVENTOU MÉTRICA)..."

🎯 AGORA CRIE O OBJETIVO PROFISSIONAL:
Use APENAS as informações acima. Não adicione números, ferramentas ou resultados que não foram mencionados. Seja fiel ao que o candidato escreveu.`;
  }

  // 🔒 REMOVIDO: callGrokAPI() - agora usa backend seguro via SecureApiService

  // Fallback caso GROK falhe
  private static async generateFallbackObjective(request: ObjectiveRequest): Promise<ObjectiveResponse> {
    
    const { keywords, seekingFor, description } = request;
    
    // Lógica de fallback inteligente
    const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
    const mainKeywords = keywordList.slice(0, 3); // Pegar as 3 principais
    
    let objective = '';
    
    // Primeira frase - Posicionamento
    if (description && description.length > 20) {
      // Se tem descrição, usar como base
      const experience = this.extractExperienceLevel(description);
      objective += `Profissional ${experience} especializado em ${mainKeywords[0] || 'gestão'}`;
    } else {
      // Sem descrição, usar palavras-chave
      objective += `Especialista em ${mainKeywords[0] || 'gestão'} com foco em ${mainKeywords[1] || 'resultados'}`;
    }
    
    // Segunda frase - Competências
    if (mainKeywords.length > 1) {
      objective += `. Comprovada experiência em ${mainKeywords.slice(1).join(', ')}`;
    }
    
    // Terceira frase - Valor e direcionamento
    if (seekingFor) {
      objective += `. Orientado a entregar soluções estratégicas e resultados mensuráveis em ${seekingFor.toLowerCase()}.`;
    } else {
      objective += `. Focado em otimizar processos e gerar resultados sustentáveis através de estratégias inovadoras.`;
    }
    
    return {
      content: objective,
      source: 'fallback'
    };
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
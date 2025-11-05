// Serviço específico para geração de cartas de apresentação usando GROK AI
// Este serviço é isolado e não interfere com outras IAs do projeto

import SecureApiService from './secureApiService';

interface GrokConfig {
  MODEL: string;
  MAX_TOKENS: number;
}

// Configurações específicas do GROK
const GROK_CONFIG: GrokConfig = {
  MODEL: 'grok-beta',
  MAX_TOKENS: 2000
};

interface CoverLetterRequest {
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  position: string;
  company: string;
  candidateProfile: string;
  specificPoints?: string;
  motivation?: string;
  dateReference?: string;
}

interface CoverLetterResponse {
  success: boolean;
  content?: string;
  error?: string;
  source: 'grok' | 'fallback';
}

export class GrokCoverLetterService {
  
  // Verificar se o GROK está configurado
  static isConfigured(): boolean {
    return true; // Backend sempre disponível
  }

  // Gerar carta de apresentação usando GROK
  static async generateCoverLetter(request: CoverLetterRequest): Promise<CoverLetterResponse> {
    console.log('🤖 GROK: Iniciando geração de carta de apresentação...');
    
    // Se GROK não estiver configurado, usar fallback
    if (!this.isConfigured()) {
      console.warn('⚠️ GROK: API não configurada, usando fallback...');
      return this.generateFallbackLetter(request);
    }

    try {
      // Criar prompt especializado para GROK
      const prompt = this.buildGrokPrompt(request);
      
      // Chamar API do GROK via SecureApiService
      const aiResponse = await SecureApiService.generateWithGrok({
        prompt,
        maxTokens: GROK_CONFIG.MAX_TOKENS
      });

      const grokResponse = aiResponse.content;
      
      return {
        success: true,
        content: grokResponse,
        source: 'grok'
      };
      
    } catch (error) {
      console.error('❌ GROK: Erro na API, usando fallback:', error);
      return this.generateFallbackLetter(request);
    }
  }

  // Construir prompt otimizado para GROK
  private static buildGrokPrompt(request: CoverLetterRequest): string {
    return `Você é um especialista em redação de cartas de apresentação profissionais. Sua missão é criar uma carta persuasiva SEM INVENTAR INFORMAÇÕES sobre o candidato.

📋 **INFORMAÇÕES REAIS DO CANDIDATO:**
Nome: ${request.candidateName}
Email: ${request.candidateEmail}
Telefone: ${request.candidatePhone}
Cargo desejado: ${request.position}
Empresa: ${request.company}
Data: ${request.dateReference || new Date().toLocaleDateString('pt-BR')}

${request.specificPoints ? `Pontos específicos a destacar: ${request.specificPoints}` : ''}
${request.motivation ? `Motivação pessoal: ${request.motivation}` : ''}

**PERFIL PROFISSIONAL COMPLETO:**
${request.candidateProfile}

🚨 **REGRAS CRÍTICAS - NÃO INVENTE INFORMAÇÕES:**

1. **NUNCA ADICIONE INFORMAÇÕES FALSAS**:
   ❌ NÃO invente porcentagens, números ou métricas não mencionados no perfil
   ❌ NÃO mencione ferramentas, sistemas ou tecnologias não citadas no perfil
   ❌ NÃO adicione experiências ou conquistas não descritas no perfil
   ❌ NÃO invente resultados ou certificações não mencionadas
   ❌ NÃO adicione metodologias ou frameworks não citados

2. **USE APENAS O QUE FOI FORNECIDO**:
   ✅ Base-se EXCLUSIVAMENTE no perfil profissional fornecido acima
   ✅ Transforme as experiências reais em narrativa persuasiva
   ✅ Conecte experiências reais do candidato com as necessidades da vaga
   ✅ Use linguagem profissional mas fiel aos fatos fornecidos

📝 **ESTRUTURA OBRIGATÓRIA DA CARTA (máximo 300-400 palavras):**

1. **CABEÇALHO:**
${request.candidateName}
${request.candidateEmail}
${request.candidatePhone}

${request.dateReference || new Date().toLocaleDateString('pt-BR')}

Prezado(a) Equipe de Recrutamento da ${request.company}

Prezado(a) Senhor(a),

2. **PRIMEIRO PARÁGRAFO** (50-80 palavras):
   - Manifestar interesse na vaga de ${request.position}
   - Mencionar como tomou conhecimento da oportunidade (se aplicável)
   - Conexão inicial entre seu perfil e a vaga

3. **SEGUNDO PARÁGRAFO** (100-150 palavras):
   - Destacar experiências REAIS do perfil fornecido
   - Conectar essas experiências com as necessidades da vaga
   - Usar APENAS informações do perfil fornecido
   - NUNCA inventar números, ferramentas ou resultados

4. **TERCEIRO PARÁGRAFO** (50-80 palavras):
   - ${request.motivation || 'Expressar interesse genuíno pela empresa e vaga'}
   - Demonstrar como pode contribuir (baseado em experiências reais)
   - Call-to-action para entrevista

5. **ENCERRAMENTO:**
Atenciosamente,

${request.candidateName}

✅ **LINGUAGEM PERMITIDA:**
- "Minha experiência em [área mencionada no perfil]..."
- "Durante minha atuação em [empresa citada no perfil]..."
- "Desenvolvi competências em [habilidades mencionadas no perfil]..."

❌ **LINGUAGEM PROIBIDA:**
- "Reduzi custos em X%..." (sem evidência no perfil)
- "Implementei sistema [não mencionado]..."
- "Certificado em [certificação não citada]..."
- "Domínio em [ferramenta não mencionada]..."

🎯 **AGORA CRIE A CARTA DE APRESENTAÇÃO:**
Use APENAS as informações do perfil fornecido. Não adicione números, ferramentas, certificações ou resultados que não foram mencionados. Seja persuasivo mas honesto.`;
  }


  // Fallback quando GROK não está disponível
  private static generateFallbackLetter(request: CoverLetterRequest): CoverLetterResponse {
    
    const { candidateName, candidateEmail, candidatePhone, position, company, candidateProfile, specificPoints, motivation, dateReference } = request;
    const date = dateReference || new Date().toLocaleDateString('pt-BR');
    
    // Análise inteligente do perfil
    const profile = candidateProfile.toLowerCase();
    const hasExperience = profile.includes('experiência') || profile.includes('trabalhou') || profile.includes('atuou');
    const hasTechSkills = profile.includes('sistema') || profile.includes('software') || profile.includes('tecnologia') || profile.includes('programação');
    const hasManagementExp = profile.includes('coordenou') || profile.includes('liderou') || profile.includes('gerenciou') || profile.includes('supervisionou');
    const hasEducation = profile.includes('formação') || profile.includes('graduação') || profile.includes('curso') || profile.includes('universidade');
    const hasCertifications = profile.includes('certificação') || profile.includes('certificado') || profile.includes('especialização');

    // Construir carta contextualizada
    let carta = `${candidateName}
${candidateEmail}
${candidatePhone}

${date}

Prezado(a) Equipe de Recrutamento da ${company}

Prezado(a) Senhor(a),

Venho por meio desta demonstrar meu interesse na posição de ${position} em sua empresa. `;

    // Primeiro parágrafo - Apresentação personalizada baseada no perfil
    if (specificPoints && specificPoints.includes('liderança') || hasManagementExp) {
      carta += `Minha trajetória profissional em posições de liderança me capacitou para enfrentar desafios estratégicos e desenvolver soluções que impactam diretamente nos resultados organizacionais, competências que considero fundamentais para o sucesso nesta posição.`;
    } else if (hasTechSkills) {
      carta += `Meu perfil técnico e experiência prática com sistemas e tecnologias me permitiram desenvolver competências sólidas que considero altamente aplicáveis aos desafios técnicos desta posição.`;
    } else if (hasExperience) {
      carta += `Acredito que minha experiência profissional e competências desenvolvidas ao longo de minha carreira se alinham perfeitamente com os requisitos desta oportunidade.`;
    } else {
      carta += `Minha formação acadêmica e interesse genuíno pela área me motivam a contribuir efetivamente para os objetivos desta posição.`;
    }

    carta += `

`;

    // Segundo parágrafo - Experiências e competências contextualizadas
    if (hasExperience) {
      carta += `Durante minha trajetória profissional, desenvolvi competências em `;
      
      if (hasTechSkills) {
        carta += `análise de sistemas, desenvolvimento de soluções tecnológicas e otimização de processos digitais`;
      } else if (hasManagementExp) {
        carta += `gestão de equipes, coordenação de projetos e otimização de processos organizacionais`;
      } else {
        carta += `análise de processos, resolução de problemas e trabalho colaborativo em equipe`;
      }
      
      carta += `. `;
      
      if (specificPoints) {
        carta += `Gostaria de destacar especialmente minha experiência em ${specificPoints.toLowerCase()}, que considero fundamental para contribuir efetivamente com os objetivos da ${company}. `;
      }
      
      if (hasCertifications) {
        carta += `Minhas certificações e especializações complementam minha experiência prática, proporcionando uma base sólida para enfrentar os desafios do cargo. `;
      }
      
      carta += `Minha abordagem analítica para resolução de problemas e capacidade de adaptação me permitiram entregar resultados consistentes em ambientes dinâmicos.`;
    } else {
      carta += `Minha formação acadêmica me proporcionou uma base sólida em `;
      
      if (hasTechSkills) {
        carta += `tecnologias e metodologias modernas`;
      } else if (hasEducation) {
        carta += `conceitos fundamentais da área e metodologias aplicadas`;
      } else {
        carta += `conhecimentos teóricos e práticas profissionais`;
      }
      
      carta += `. Demonstro interesse genuíno em aplicar meus conhecimentos em um ambiente profissional que valorize inovação e crescimento mútuo.`;
      
      if (specificPoints) {
        carta += ` Tenho particular interesse em desenvolver competências em ${specificPoints.toLowerCase()}, área que considero estratégica para meu desenvolvimento profissional.`;
      }
    }

    carta += `

`;

    // Terceiro parágrafo - Motivação e call-to-action
    if (motivation) {
      carta += `${motivation} `;
    } else {
      carta += `A reputação da ${company} no mercado e seu compromisso com a excelência despertaram meu interesse em fazer parte desta equipe. `;
    }
    
    carta += `Estou convicto de que posso contribuir significativamente para os objetivos estratégicos da empresa, aplicando `;
    
    if (hasExperience) {
      carta += `minha experiência prática e conhecimentos técnicos`;
    } else {
      carta += `minha dedicação e conhecimentos acadêmicos`;
    }
    
    carta += ` para gerar resultados de impacto.

Coloco-me à disposição para uma entrevista e aguardo a oportunidade de discutir pessoalmente como posso contribuir para o crescimento da ${company}.

Atenciosamente,

${candidateName}`;

    return {
      success: true,
      content: carta,
      source: 'fallback'
    };
  }

  // Método de teste da conexão
  static async testConnection(): Promise<{success: boolean, model?: string, error?: string}> {
    try {
      // Teste simples com o SecureApiService
      await SecureApiService.generateWithGrok({
        prompt: 'Test connection',
        maxTokens: 10
      });

      return { success: true, model: GROK_CONFIG.MODEL };
    } catch (error) {
      return { success: false, error: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  // Obter status da configuração
  static getConfig(): {configured: boolean, model: string, maxTokens: number} {
    return {
      configured: this.isConfigured(),
      model: GROK_CONFIG.MODEL,
      maxTokens: GROK_CONFIG.MAX_TOKENS
    };
  }
}

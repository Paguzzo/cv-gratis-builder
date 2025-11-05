/**
 * 🔒 SERVIÇO DE API SEGURO
 *
 * Este serviço faz chamadas para um backend seguro em vez de expor
 * chaves de API no frontend. Todas as chaves secretas ficam no servidor.
 *
 * SEGURANÇA: Nunca expor chaves de API no frontend!
 */

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface AdminUser {
  id: string;
  username: string;
  role: 'admin';
  permissions: string[];
}

interface AIRequest {
  prompt: string;
  context?: string;
  maxTokens?: number;
}

interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

class SecureApiService {
  private static readonly BASE_URL = '/api/secure';

  /**
   * 📧 Envio seguro de email via backend
   */
  static async sendEmail(request: EmailRequest): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await fetch(`${this.BASE_URL}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Email API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('🚨 Secure Email Service Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 🤖 Geração de conteúdo com GROK AI via backend
   */
  static async generateWithGrok(request: AIRequest): Promise<AIResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/ai/grok`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`GROK AI API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('🚨 Secure GROK Service Error:', error);
      throw new Error('Erro ao gerar conteúdo com IA. Tente novamente.');
    }
  }

  /**
   * 🧠 Geração de conteúdo com OpenAI via backend
   */
  static async generateWithOpenAI(request: AIRequest): Promise<AIResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/ai/openai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('🚨 Secure OpenAI Service Error:', error);
      throw new Error('Erro ao gerar conteúdo com IA. Tente novamente.');
    }
  }

  /**
   * 💳 Processamento seguro de pagamentos via backend
   */
  static async createPaymentIntent(amount: number, currency: string = 'brl', metadata?: Record<string, string>) {
    try {
      const response = await fetch(`${this.BASE_URL}/payments/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          metadata,
        }),
      });

      if (!response.ok) {
        throw new Error(`Payment API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('🚨 Secure Payment Service Error:', error);
      throw new Error('Erro ao processar pagamento. Tente novamente.');
    }
  }

  /**
   * 🔐 Verificação de status de autenticação admin
   */
  static async verifyAdminAuth(token: string): Promise<{ valid: boolean; user?: AdminUser }> {
    try {
      const response = await fetch(`${this.BASE_URL}/admin/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return { valid: false };
      }

      return await response.json();
    } catch (error) {
      console.error('🚨 Admin Auth Verification Error:', error);
      return { valid: false };
    }
  }

  /**
   * 🔑 Login administrativo seguro
   */
  static async adminLogin(username: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const response = await fetch(`${this.BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        return {
          success: false,
          error: 'Credenciais inválidas'
        };
      }

      return await response.json();
    } catch (error) {
      console.error('🚨 Admin Login Error:', error);
      return {
        success: false,
        error: 'Erro de conexão. Tente novamente.'
      };
    }
  }
}

export default SecureApiService;
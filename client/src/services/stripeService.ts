import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Template } from '@/types/templates';

// Configurações do Stripe a partir das variáveis de ambiente
const STRIPE_CONFIG = {
  PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  WEBHOOK_SECRET: import.meta.env.VITE_STRIPE_WEBHOOK_SECRET,
  // Secret key não deve estar no frontend - será usado no backend quando necessário
};

interface PaymentResult {
  success: boolean;
  error?: string;
  paymentIntent?: any;
  clientSecret?: string;
}

export interface PaymentData {
  templateId: string;
  templateName: string;
  price: number;
  userId: string;
  userEmail: string;
}

interface StripeProduct {
  id: string;
  name: string;
  price: number;
  currency: string;
  description?: string;
}

export class StripeService {
  private static stripe: Stripe | null = null;

  // MODO DESENVOLVEDOR - Para testar premium
  private static readonly DEV_MODE = import.meta.env.NODE_ENV === 'development';
  private static readonly DEV_PREMIUM_ACCESS = 'dev_premium_enabled';

  static async initialize(): Promise<void> {
    if (!this.stripe && STRIPE_CONFIG.PUBLISHABLE_KEY) {
      try {
        this.stripe = await loadStripe(STRIPE_CONFIG.PUBLISHABLE_KEY);
        console.log('✅ Stripe inicializado com sucesso');
      } catch (error) {
        console.error('❌ Erro ao inicializar Stripe:', error);
      }
    } else if (!STRIPE_CONFIG.PUBLISHABLE_KEY) {
      console.warn('⚠️ Stripe Publishable Key não configurada');
    }
  }

  // Verificar configuração
  static checkConfiguration(): {configured: boolean, hasPublishableKey: boolean, devMode: boolean} {
    return {
      configured: !!STRIPE_CONFIG.PUBLISHABLE_KEY,
      hasPublishableKey: !!STRIPE_CONFIG.PUBLISHABLE_KEY,
      devMode: this.DEV_MODE
    };
  }

  // Testar conexão com Stripe
  static async testConnection(): Promise<{success: boolean, error?: string}> {
    if (!STRIPE_CONFIG.PUBLISHABLE_KEY) {
      return { success: false, error: 'Publishable key não configurada' };
    }

    try {
      await this.initialize();
      if (this.stripe) {
        return { success: true };
      } else {
        return { success: false, error: 'Falha ao carregar Stripe' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Criar sessão de pagamento para template premium
  static async createPaymentSession(template: Template): Promise<PaymentResult> {
    try {
      if (!this.stripe) {
        await this.initialize();
      }

      if (!this.stripe) {
        throw new Error('Stripe não inicializado');
      }

      // Em desenvolvimento, simular sucesso
      if (this.DEV_MODE) {
        console.log('🔧 DEV MODE: Simulando pagamento bem-sucedido');
        localStorage.setItem(`stripe_purchased_${template.id}`, 'true');
        return {
          success: true,
          paymentIntent: { status: 'succeeded' }
        };
      }

      // TODO: Implementar criação real de sessão de pagamento
      // Isso requer backend para criar a sessão de pagamento
      
      const mockPaymentIntent = {
        id: 'pi_mock_' + Date.now(),
        status: 'requires_payment_method',
        client_secret: 'pi_mock_secret_' + Date.now()
      };

      return {
        success: true,
        paymentIntent: mockPaymentIntent,
        clientSecret: mockPaymentIntent.client_secret
      };

    } catch (error) {
      console.error('Erro ao criar sessão de pagamento:', error);
      return {
        success: false,
        error: error.message || 'Erro ao processar pagamento'
      };
    }
  }

  // Processar pagamento com Stripe Checkout real
  static async processTemplatePayment(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      console.log('💳 STRIPE: Redirecionando para pagamento do template:', paymentData.templateId);
      
      // Usar link direto do Stripe para pagamento
      const stripePaymentUrl = 'https://buy.stripe.com/aFa7sMf0t2rl34gaEK2sM00';
      
      // Adicionar parâmetros para identificar o usuário e template
      const urlParams = new URLSearchParams({
        client_reference_id: paymentData.userId,
        metadata: JSON.stringify({
          templateId: paymentData.templateId,
          userEmail: paymentData.userEmail,
          templateName: paymentData.templateName
        })
      });
      
      const finalUrl = `${stripePaymentUrl}?${urlParams}`;
      
      // Salvar dados do pagamento pendente no localStorage
      localStorage.setItem('stripe_pending_payment', JSON.stringify({
        templateId: paymentData.templateId,
        userEmail: paymentData.userEmail,
        timestamp: Date.now()
      }));
      
      // Redirecionar para o Stripe
      window.location.href = finalUrl;
      
      return {
        success: true,
        paymentIntent: { status: 'redirect_to_stripe' }
      };

    } catch (error) {
      console.error('❌ STRIPE: Erro ao processar pagamento:', error);
      return {
        success: false,
        error: error.message || 'Erro ao redirecionar para pagamento'
      };
    }
  }

  // Verificar se template foi comprado
  static hasPurchasedTemplate(templateId: string): boolean {
    // Verificar se há registro de compra no localStorage
    const purchased = localStorage.getItem(`stripe_purchased_${templateId}`);
    return purchased === 'true';
  }

  // Verificar status do pagamento via API
  static async checkPaymentStatus(templateId: string, userEmail: string): Promise<boolean> {
    try {
      const response = await fetch('/api/check-premium-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ templateId, userEmail })
      });
      
      const result = await response.json();
      
      if (result.success && result.hasPremiumAccess) {
        // Marcar como comprado no localStorage
        localStorage.setItem(`stripe_purchased_${templateId}`, 'true');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao verificar status do pagamento:', error);
      return false;
    }
  }

  // Marcar template como comprado (para desenvolvimento)
  static markTemplateAsPurchased(templateId: string): void {
    localStorage.setItem(`stripe_purchased_${templateId}`, 'true');
  }

  // Limpar compras (para desenvolvimento)
  static clearPurchases(): void {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('stripe_purchased_')) {
        localStorage.removeItem(key);
      }
    });
    localStorage.removeItem(this.DEV_PREMIUM_ACCESS);
  }

  // Habilitar modo premium para desenvolvimento
  static enableDevPremium(): void {
    if (this.DEV_MODE) {
      localStorage.setItem(this.DEV_PREMIUM_ACCESS, 'true');
      console.log('🔧 DEV MODE: Premium habilitado para todos os templates');
    }
  }

  // Desabilitar modo premium para desenvolvimento
  static disableDevPremium(): void {
    if (this.DEV_MODE) {
      localStorage.removeItem(this.DEV_PREMIUM_ACCESS);
      console.log('🔧 DEV MODE: Premium desabilitado');
    }
  }

  // Verificar se dev mode premium está habilitado
  static isDevModeEnabled(): boolean {
    // 🚨 CORREÇÃO CRÍTICA: SEMPRE retornar FALSE para forçar modal
    console.log('🔧 STRIPE: Dev mode forçado como FALSE para testar modal');
    return false;
  }

  // Obter produtos disponíveis (mock para desenvolvimento)
  static getAvailableProducts(): StripeProduct[] {
    return [
      {
        id: 'template_premium_1',
        name: 'Template Premium - Executivo',
        price: 4.90,
        currency: 'BRL',
        description: 'Template profissional para cargos executivos'
      },
      {
        id: 'template_premium_2',
        name: 'Template Premium - Criativo',
        price: 4.90,
        currency: 'BRL',
        description: 'Template moderno para áreas criativas'
      },
      {
        id: 'all_templates',
        name: 'Todos os Templates Premium',
        price: 9.90,
        currency: 'BRL',
        description: 'Acesso a todos os templates premium'
      }
    ];
  }



  // Status do serviço
  static getStatus(): {
    configured: boolean,
    initialized: boolean,
    devMode: boolean,
    premiumEnabled: boolean
  } {
    return {
      configured: !!STRIPE_CONFIG.PUBLISHABLE_KEY,
      initialized: !!this.stripe,
      devMode: this.DEV_MODE,
      premiumEnabled: this.DEV_MODE && localStorage.getItem(this.DEV_PREMIUM_ACCESS) === 'true'
    };
  }
} 
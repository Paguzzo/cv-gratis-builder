/**
 * RESILIENT STRIPE SERVICE
 *
 * Wrapper para StripeService com resiliência de rede integrada
 * Adiciona retry automático e validações extras para pagamentos
 */

import { StripeService, PaymentData } from './stripeService';
import { ResilientApiService } from './resilientApiService';
import type { Template } from '@/types/templates';
import type { RetryOptions } from '@/utils/networkResilience';

/**
 * Opções específicas para serviço de pagamento
 */
export interface ResilientPaymentOptions extends Partial<RetryOptions> {
  validateBeforeRetry?: boolean;
}

/**
 * Resultado de pagamento
 */
export interface PaymentResult {
  success: boolean;
  error?: string;
  paymentIntent?: any;
  clientSecret?: string;
}

/**
 * Serviço de Stripe com resiliência de rede
 */
export class ResilientStripeService {
  /**
   * Inicializa Stripe com retry
   */
  static async initialize(options: Partial<RetryOptions> = {}): Promise<void> {
    try {
      const initFn = async () => {
        await StripeService.initialize();
      };

      await ResilientApiService.call(initFn, {
        serviceType: 'PAYMENT',
        ...options,
        onRetry: (error, attempt, delay) => {
          console.log(
            `Stripe Service (Init): Tentativa ${attempt}/2 falhou, retry em ${delay}ms`,
            error.message
          );
          options.onRetry?.(error, attempt, delay);
        }
      });
    } catch (error) {
      console.error('Stripe Service: Falha ao inicializar:', error);
      throw error;
    }
  }

  /**
   * Cria sessão de pagamento com retry
   */
  static async createPaymentSession(
    template: Template,
    options: ResilientPaymentOptions = {}
  ): Promise<PaymentResult> {
    const { validateBeforeRetry = true, ...retryOptions } = options;

    try {
      const createSessionFn = async () => {
        return await StripeService.createPaymentSession(template);
      };

      const result = await ResilientApiService.callPayment(createSessionFn, {
        ...retryOptions,
        shouldRetry: (error, attempt) => {
          // Não retry em erros de validação
          if (validateBeforeRetry) {
            const status = error.status || error.response?.status;
            if (status && status >= 400 && status < 500 && status !== 408) {
              console.warn('Stripe: Erro de validação, não será feito retry:', error);
              return false;
            }
          }

          return true;
        },
        onRetry: (error, attempt, delay) => {
          console.log(
            `Stripe Service (Payment Session): Tentativa ${attempt}/2 falhou, retry em ${delay}ms`,
            error.message
          );
          retryOptions.onRetry?.(error, attempt, delay);
        }
      });

      return result;
    } catch (error) {
      console.error('Stripe Service (Payment Session): Todas as tentativas falharam:', error);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao processar pagamento'
      };
    }
  }

  /**
   * Processa pagamento de template com retry
   */
  static async processTemplatePayment(
    paymentData: PaymentData,
    options: ResilientPaymentOptions = {}
  ): Promise<PaymentResult> {
    const { validateBeforeRetry = true, ...retryOptions } = options;

    try {
      const processPaymentFn = async () => {
        return await StripeService.processTemplatePayment(paymentData);
      };

      const result = await ResilientApiService.callPayment(processPaymentFn, {
        ...retryOptions,
        shouldRetry: (error, attempt) => {
          // Não retry em erros de validação
          if (validateBeforeRetry) {
            const status = error.status || error.response?.status;
            if (status && status >= 400 && status < 500 && status !== 408) {
              console.warn('Stripe: Erro de validação, não será feito retry:', error);
              return false;
            }
          }

          return true;
        },
        onRetry: (error, attempt, delay) => {
          console.log(
            `Stripe Service (Process Payment): Tentativa ${attempt}/2 falhou, retry em ${delay}ms`,
            error.message
          );
          retryOptions.onRetry?.(error, attempt, delay);
        }
      });

      return result;
    } catch (error) {
      console.error('Stripe Service (Process Payment): Todas as tentativas falharam:', error);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao processar pagamento'
      };
    }
  }

  /**
   * Verifica acesso premium com retry
   */
  static async checkPremiumAccess(
    templateId: string,
    email: string,
    options: Partial<RetryOptions> = {}
  ): Promise<{ hasAccess: boolean; expiresAt?: string; error?: string }> {
    try {
      const checkAccessFn = async () => {
        return await StripeService.checkPremiumAccess(templateId, email);
      };

      return await ResilientApiService.callPayment(checkAccessFn, {
        ...options,
        onRetry: (error, attempt, delay) => {
          console.log(
            `Stripe Service (Check Access): Tentativa ${attempt}/2 falhou, retry em ${delay}ms`,
            error.message
          );
          options.onRetry?.(error, attempt, delay);
        }
      });
    } catch (error) {
      console.error('Stripe Service (Check Access): Falha ao verificar acesso:', error);

      return {
        hasAccess: false,
        error: error instanceof Error ? error.message : 'Erro ao verificar acesso premium'
      };
    }
  }

  /**
   * Testa conexão com Stripe
   */
  static async testConnection(options: Partial<RetryOptions> = {}) {
    try {
      const testFn = async () => {
        return await StripeService.testConnection();
      };

      return await ResilientApiService.callPayment(testFn, options);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Verifica configuração do Stripe
   */
  static checkConfiguration() {
    return StripeService.checkConfiguration();
  }

  /**
   * Obtém status do serviço
   */
  static getStatus() {
    return StripeService.getStatus();
  }

  /**
   * Métodos de desenvolvimento
   */
  static markTemplateAsPurchased(templateId: string): void {
    StripeService.markTemplateAsPurchased(templateId);
  }

  static clearPurchases(): void {
    StripeService.clearPurchases();
  }

  static enableDevPremium(): void {
    StripeService.enableDevPremium();
  }

  static disableDevPremium(): void {
    StripeService.disableDevPremium();
  }

  static isDevModeEnabled(): boolean {
    return StripeService.isDevModeEnabled();
  }

  static getAvailableProducts() {
    return StripeService.getAvailableProducts();
  }
}

/**
 * Instância singleton para uso direto
 */
export const resilientStripe = ResilientStripeService;

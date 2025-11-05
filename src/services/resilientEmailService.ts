/**
 * RESILIENT EMAIL SERVICE
 *
 * Wrapper para EmailService com resiliência de rede integrada
 * Adiciona retry automático e fallback para envio de emails
 */

import { EmailService, EmailData } from './emailService';
import { ResilientApiService } from './resilientApiService';
import type { RetryOptions } from '@/utils/networkResilience';

/**
 * Opções específicas para serviço de email
 */
export interface ResilientEmailOptions extends Partial<RetryOptions> {
  offerDownload?: boolean; // Oferecer download manual em caso de falha
}

/**
 * Resultado do envio de email
 */
export interface EmailResult {
  success: boolean;
  method?: string;
  error?: string;
  shouldOfferDownload?: boolean;
}

/**
 * Serviço de email com resiliência de rede
 */
export class ResilientEmailService {
  /**
   * Envia email com retry automático
   */
  static async sendEmail(
    emailData: EmailData,
    options: ResilientEmailOptions = {}
  ): Promise<EmailResult> {
    const { offerDownload = true, ...retryOptions } = options;

    try {
      // Função de chamada ao serviço de email
      const sendFn = async () => {
        return await EmailService.sendEmailWithFallback(emailData);
      };

      // Executar com retry
      const result = await ResilientApiService.callEmail(sendFn, {
        ...retryOptions,
        onRetry: (error, attempt, delay) => {
          console.log(
            `Email Service: Tentativa ${attempt}/3 falhou, retry em ${delay}ms`,
            error.message
          );
          retryOptions.onRetry?.(error, attempt, delay);
        }
      });

      return {
        success: result.success,
        method: result.method
      };
    } catch (error) {
      console.error('Email Service: Todas as tentativas falharam:', error);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        shouldOfferDownload: offerDownload
      };
    }
  }

  /**
   * Envia currículo por email com retry
   */
  static async sendCurriculumByEmail(
    emailData: EmailData,
    pdfBlob?: Blob,
    options: ResilientEmailOptions = {}
  ): Promise<EmailResult> {
    const { offerDownload = true, ...retryOptions } = options;

    try {
      const sendFn = async () => {
        await EmailService.sendCurriculumByEmail(emailData, pdfBlob);
        return { success: true, method: 'email' };
      };

      const result = await ResilientApiService.callEmail(sendFn, {
        ...retryOptions,
        onRetry: (error, attempt, delay) => {
          console.log(
            `Email Service (Curriculum): Tentativa ${attempt}/3 falhou, retry em ${delay}ms`,
            error.message
          );
          retryOptions.onRetry?.(error, attempt, delay);
        }
      });

      return result;
    } catch (error) {
      console.error('Email Service (Curriculum): Todas as tentativas falharam:', error);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        shouldOfferDownload: offerDownload
      };
    }
  }

  /**
   * Envia link do currículo por email com retry
   */
  static async sendCurriculumLink(
    emailData: EmailData,
    shareUrl: string,
    options: ResilientEmailOptions = {}
  ): Promise<EmailResult> {
    const { offerDownload = true, ...retryOptions } = options;

    try {
      const sendFn = async () => {
        await EmailService.sendCurriculumLink(emailData, shareUrl);
        return { success: true, method: 'email' };
      };

      const result = await ResilientApiService.callEmail(sendFn, {
        ...retryOptions,
        onRetry: (error, attempt, delay) => {
          console.log(
            `Email Service (Link): Tentativa ${attempt}/3 falhou, retry em ${delay}ms`,
            error.message
          );
          retryOptions.onRetry?.(error, attempt, delay);
        }
      });

      return result;
    } catch (error) {
      console.error('Email Service (Link): Todas as tentativas falharam:', error);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        shouldOfferDownload: offerDownload
      };
    }
  }

  /**
   * Envia email com Resend
   */
  static async sendWithResend(
    emailData: EmailData,
    options: ResilientEmailOptions = {}
  ): Promise<boolean> {
    try {
      const sendFn = async () => {
        return await EmailService.sendWithResend(emailData);
      };

      return await ResilientApiService.callEmail(sendFn, options);
    } catch (error) {
      console.error('Email Service (Resend): Falha ao enviar:', error);
      return false;
    }
  }
}

/**
 * Instância singleton para uso direto
 */
export const resilientEmail = ResilientEmailService;

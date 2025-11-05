/**
 * RESILIENT AI SERVICE
 *
 * Wrapper para aiService com resiliência de rede integrada
 * Adiciona retry automático, timeout e fallback para todas as chamadas de AI
 */

import { AIService } from './aiService';
import { ResilientApiService } from './resilientApiService';
import type { RetryOptions } from '@/utils/networkResilience';

/**
 * Opções específicas para serviço de AI
 */
export interface ResilientAIOptions extends Partial<RetryOptions> {
  useFallback?: boolean;
  cacheResults?: boolean;
}

/**
 * Serviço de AI com resiliência de rede
 */
export class ResilientAIService {
  /**
   * Gera texto com retry automático e fallback
   */
  static async generateText(
    type: 'objective' | 'experience' | 'cover_letter',
    userInput: string,
    keywords: string,
    position?: string,
    company?: string,
    context?: string,
    options: ResilientAIOptions = {}
  ): Promise<string> {
    const { useFallback = true, cacheResults = false, ...retryOptions } = options;

    // Função de chamada à API
    const apiFn = async () => {
      return await AIService.generateText(
        type,
        userInput,
        keywords,
        position,
        company,
        context
      );
    };

    // Função de fallback (usa os fallbacks internos do AIService)
    const fallbackFn = async () => {
      console.warn('AI Service: Usando fallback interno devido a erro na API');
      // O AIService já tem fallbacks internos implementados
      return await AIService.generateText(
        type,
        userInput,
        keywords,
        position,
        company,
        context
      );
    };

    try {
      if (useFallback) {
        // Usar retry com fallback
        const result = await ResilientApiService.callAI(apiFn, fallbackFn, {
          ...retryOptions,
          onRetry: (error, attempt, delay) => {
            console.log(
              `AI Service: Tentativa ${attempt}/3 falhou, retry em ${delay}ms`,
              error.message
            );
            retryOptions.onRetry?.(error, attempt, delay);
          }
        });

        if (!result.success || !result.data) {
          throw result.error || new Error('Falha ao gerar texto com AI');
        }

        return result.data;
      } else {
        // Retry simples sem fallback
        return await ResilientApiService.call(apiFn, {
          serviceType: 'AI',
          ...retryOptions,
          useCache: cacheResults,
          cacheKey: cacheResults ? `ai_${type}_${userInput.slice(0, 50)}` : undefined,
          cacheTTL: cacheResults ? 3600000 : undefined, // 1 hora
          onRetry: (error, attempt, delay) => {
            console.log(
              `AI Service: Tentativa ${attempt}/3 falhou, retry em ${delay}ms`,
              error.message
            );
            retryOptions.onRetry?.(error, attempt, delay);
          }
        });
      }
    } catch (error) {
      console.error('AI Service: Todas as tentativas falharam:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  /**
   * Gera objetivo profissional com resiliência
   */
  static async generateObjective(
    userInput: string,
    keywords: string,
    options: ResilientAIOptions = {}
  ): Promise<string> {
    return this.generateText('objective', userInput, keywords, undefined, undefined, undefined, options);
  }

  /**
   * Gera descrição de experiência com resiliência
   */
  static async generateExperience(
    userInput: string,
    keywords: string,
    position: string,
    company: string,
    options: ResilientAIOptions = {}
  ): Promise<string> {
    return this.generateText('experience', userInput, keywords, position, company, undefined, options);
  }

  /**
   * Gera carta de apresentação com resiliência
   */
  static async generateCoverLetter(
    userInput: string,
    keywords: string,
    position: string,
    company: string,
    context: string,
    options: ResilientAIOptions = {}
  ): Promise<string> {
    return this.generateText('cover_letter', userInput, keywords, position, company, context, options);
  }

  /**
   * Verifica configuração do serviço
   */
  static checkConfiguration() {
    return AIService.checkConfiguration();
  }

  /**
   * Testa conexão com serviço de AI
   */
  static async testConnection() {
    return AIService.testConnection();
  }
}

/**
 * Instância singleton para uso direto
 */
export const resilientAI = ResilientAIService;

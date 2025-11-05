/**
 * RESILIENT API SERVICE
 *
 * Wrapper para serviços de API com resiliência de rede integrada
 * Adiciona retry automático, timeout e fallback a qualquer chamada de API
 */

import {
  retryWithBackoff,
  retryWithFallback,
  withTimeout,
  fetchWithRetry,
  RetryOptions,
  FallbackOptions,
  RetryResult
} from '@/utils/networkResilience';
import { cacheService } from './cacheService';

/**
 * Configurações padrão para diferentes tipos de serviço
 */
export const SERVICE_CONFIGS = {
  // Configuração para serviços de AI/GROK
  AI: {
    maxAttempts: 3,
    baseDelay: 2000,
    maxDelay: 10000,
    timeout: 60000 // 60 segundos para IA
  },
  // Configuração para serviços de email
  EMAIL: {
    maxAttempts: 3,
    baseDelay: 1500,
    maxDelay: 8000,
    timeout: 30000
  },
  // Configuração para Stripe/pagamentos
  PAYMENT: {
    maxAttempts: 2,
    baseDelay: 2000,
    maxDelay: 5000,
    timeout: 20000
  },
  // Configuração padrão para outras APIs
  DEFAULT: {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 8000,
    timeout: 30000
  }
} as const;

/**
 * Opções para chamada de API resiliente
 */
export interface ResilientApiOptions<T> extends RetryOptions {
  cacheKey?: string;
  cacheTTL?: number;
  useCache?: boolean;
  fallbackData?: T;
  serviceType?: keyof typeof SERVICE_CONFIGS;
}

/**
 * Classe para gerenciar chamadas de API com resiliência
 */
export class ResilientApiService {
  /**
   * Faz uma chamada de API com retry automático
   */
  static async call<T>(
    apiFn: () => Promise<T>,
    options: ResilientApiOptions<T> = {}
  ): Promise<T> {
    const {
      cacheKey,
      cacheTTL,
      useCache = false,
      fallbackData,
      serviceType = 'DEFAULT',
      ...retryOptions
    } = options;

    // Configurações base do serviço
    const baseConfig = SERVICE_CONFIGS[serviceType];

    // Tentar obter do cache primeiro
    if (useCache && cacheKey) {
      const cached = cacheService.get<T>(cacheKey);
      if (cached !== null) {
        console.log(`Cache HIT para ${cacheKey}`);
        return cached;
      }
    }

    // Se há fallback data, usar retryWithFallback
    if (fallbackData !== undefined) {
      const result = await retryWithFallback<T>(
        apiFn,
        { ...baseConfig, ...retryOptions },
        {
          fallbackFn: () => fallbackData,
          onFallback: (error) => {
            console.warn(`Usando fallback data devido a erro:`, error);
          }
        }
      );

      if (!result.success) {
        throw result.error;
      }

      return result.data!;
    }

    // Retry simples
    const data = await retryWithBackoff(apiFn, {
      ...baseConfig,
      ...retryOptions
    });

    // Salvar no cache se configurado
    if (useCache && cacheKey && cacheTTL) {
      cacheService.set(cacheKey, data, cacheTTL);
    }

    return data;
  }

  /**
   * Faz uma chamada fetch com retry automático
   */
  static async fetch<T = any>(
    url: string,
    init?: RequestInit,
    options: ResilientApiOptions<T> = {}
  ): Promise<T> {
    const {
      cacheKey,
      cacheTTL,
      useCache = false,
      fallbackData,
      serviceType = 'DEFAULT',
      ...retryOptions
    } = options;

    // Configurações base do serviço
    const baseConfig = SERVICE_CONFIGS[serviceType];

    // Tentar obter do cache primeiro
    if (useCache && cacheKey) {
      const cached = cacheService.get<T>(cacheKey);
      if (cached !== null) {
        console.log(`Cache HIT para ${cacheKey}`);
        return cached;
      }
    }

    // Fazer fetch com retry
    const response = await fetchWithRetry(url, init, {
      ...baseConfig,
      ...retryOptions
    });

    const data: T = await response.json();

    // Salvar no cache se configurado
    if (useCache && cacheKey && cacheTTL) {
      cacheService.set(cacheKey, data, cacheTTL);
    }

    return data;
  }

  /**
   * Wrapper para serviço de AI com retry e fallback
   */
  static async callAI<T>(
    apiFn: () => Promise<T>,
    fallbackFn: () => Promise<T> | T,
    options: Partial<RetryOptions> = {}
  ): Promise<RetryResult<T>> {
    return retryWithFallback(
      apiFn,
      { ...SERVICE_CONFIGS.AI, ...options },
      {
        fallbackFn,
        onFallback: (error) => {
          console.warn('AI Service: Usando fallback devido a erro:', error);
        }
      }
    );
  }

  /**
   * Wrapper para serviço de email com retry
   */
  static async callEmail<T>(
    apiFn: () => Promise<T>,
    options: Partial<RetryOptions> = {}
  ): Promise<T> {
    return retryWithBackoff(apiFn, {
      ...SERVICE_CONFIGS.EMAIL,
      ...options,
      onRetry: (error, attempt, delay) => {
        console.log(`Email Service: Retry ${attempt}/${SERVICE_CONFIGS.EMAIL.maxAttempts} em ${delay}ms`);
        options.onRetry?.(error, attempt, delay);
      }
    });
  }

  /**
   * Wrapper para serviço de pagamento com retry
   */
  static async callPayment<T>(
    apiFn: () => Promise<T>,
    options: Partial<RetryOptions> = {}
  ): Promise<T> {
    return retryWithBackoff(apiFn, {
      ...SERVICE_CONFIGS.PAYMENT,
      ...options,
      shouldRetry: (error, attempt) => {
        // Não retry em erros de validação (4xx exceto timeout)
        const status = error.status || error.response?.status;
        if (status && status >= 400 && status < 500 && status !== 408) {
          return false;
        }
        return true;
      },
      onRetry: (error, attempt, delay) => {
        console.log(`Payment Service: Retry ${attempt}/${SERVICE_CONFIGS.PAYMENT.maxAttempts} em ${delay}ms`);
        options.onRetry?.(error, attempt, delay);
      }
    });
  }

  /**
   * Executa múltiplas chamadas em paralelo com retry
   */
  static async parallel<T>(
    calls: Array<() => Promise<T>>,
    options: ResilientApiOptions<T> = {}
  ): Promise<T[]> {
    return Promise.all(
      calls.map(call => this.call(call, options))
    );
  }

  /**
   * Executa múltiplas chamadas em paralelo, retorna apenas sucessos
   */
  static async parallelSettled<T>(
    calls: Array<() => Promise<T>>,
    options: ResilientApiOptions<T> = {}
  ): Promise<Array<{ success: true; data: T } | { success: false; error: Error }>> {
    const results = await Promise.allSettled(
      calls.map(call => this.call(call, options))
    );

    return results.map(result => {
      if (result.status === 'fulfilled') {
        return { success: true as const, data: result.value };
      } else {
        return {
          success: false as const,
          error: result.reason instanceof Error ? result.reason : new Error(String(result.reason))
        };
      }
    });
  }

  /**
   * Executa chamadas sequencialmente com retry
   */
  static async sequential<T>(
    calls: Array<() => Promise<T>>,
    options: ResilientApiOptions<T> = {}
  ): Promise<T[]> {
    const results: T[] = [];

    for (const call of calls) {
      const result = await this.call(call, options);
      results.push(result);
    }

    return results;
  }

  /**
   * Invalida cache
   */
  static invalidateCache(cacheKey: string): void {
    cacheService.remove(cacheKey);
  }

  /**
   * Limpa todo o cache
   */
  static clearCache(): void {
    cacheService.clear();
  }
}

/**
 * Instância singleton para uso direto
 */
export const resilientApi = ResilientApiService;

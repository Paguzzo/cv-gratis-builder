/**
 * NETWORK RESILIENCE UTILITY
 *
 * Sistema completo de resiliência de rede com:
 * - Retry automático com backoff exponencial
 * - Timeout configurável
 * - Fallback automático
 * - Detecção de status da rede
 * - Controle de cancelamento
 */

/**
 * Opções de configuração para retry
 */
export interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  exponentialBase?: number;
  timeout?: number;
  shouldRetry?: (error: any, attempt: number) => boolean;
  onRetry?: (error: any, attempt: number, delay: number) => void;
  abortSignal?: AbortSignal;
}

/**
 * Opções de configuração para timeout
 */
export interface TimeoutOptions {
  timeout: number;
  timeoutError?: Error;
  abortSignal?: AbortSignal;
}

/**
 * Opções de configuração para fallback
 */
export interface FallbackOptions<T> {
  fallbackFn: () => Promise<T> | T;
  shouldFallback?: (error: any) => boolean;
  onFallback?: (error: any) => void;
}

/**
 * Resultado de uma operação com retry
 */
export interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  attempts: number;
  totalTime: number;
  fromFallback?: boolean;
}

/**
 * Classe de erro para timeout
 */
export class TimeoutError extends Error {
  constructor(message: string = 'Operation timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * Classe de erro para retry esgotado
 */
export class RetryExhaustedError extends Error {
  public readonly attempts: number;
  public readonly originalError: Error;

  constructor(attempts: number, originalError: Error) {
    super(`Failed after ${attempts} attempts: ${originalError.message}`);
    this.name = 'RetryExhaustedError';
    this.attempts = attempts;
    this.originalError = originalError;
  }
}

/**
 * Padrões de configuração
 */
const DEFAULT_RETRY_OPTIONS: Required<Omit<RetryOptions, 'onRetry' | 'abortSignal'>> = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 8000,
  exponentialBase: 2,
  timeout: 30000,
  shouldRetry: (error: any) => {
    // Retry em erros de rede, timeout e 5xx
    if (error instanceof TimeoutError) return true;
    if (error.name === 'NetworkError') return true;
    if (error.name === 'AbortError') return false;

    // Para erros HTTP
    const status = error.status || error.response?.status;
    if (status) {
      // Não retry em 4xx (exceto 408 Request Timeout, 429 Too Many Requests)
      if (status >= 400 && status < 500) {
        return status === 408 || status === 429;
      }
      // Retry em 5xx
      return status >= 500;
    }

    return true; // Retry por padrão em erros desconhecidos
  }
};

/**
 * Calcula o delay para o próximo retry usando backoff exponencial
 */
export function calculateBackoffDelay(
  attempt: number,
  baseDelay: number = DEFAULT_RETRY_OPTIONS.baseDelay,
  exponentialBase: number = DEFAULT_RETRY_OPTIONS.exponentialBase,
  maxDelay: number = DEFAULT_RETRY_OPTIONS.maxDelay
): number {
  const delay = baseDelay * Math.pow(exponentialBase, attempt - 1);
  // Adiciona jitter aleatório (±25%) para evitar thundering herd
  const jitter = delay * 0.25 * (Math.random() * 2 - 1);
  return Math.min(delay + jitter, maxDelay);
}

/**
 * Aguarda um tempo específico (com suporte a AbortSignal)
 */
export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    const timeout = setTimeout(resolve, ms);

    signal?.addEventListener('abort', () => {
      clearTimeout(timeout);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

/**
 * RETRY COM BACKOFF EXPONENCIAL
 *
 * Tenta executar uma função várias vezes com delay crescente entre tentativas
 *
 * @example
 * const result = await retryWithBackoff(
 *   () => fetch('/api/data'),
 *   { maxAttempts: 3, baseDelay: 1000 }
 * );
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_RETRY_OPTIONS, ...options };
  const startTime = Date.now();
  let lastError: Error = new Error('Unknown error');

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      // Verificar se foi abortado
      if (config.abortSignal?.aborted) {
        throw new DOMException('Aborted', 'AbortError');
      }

      // Executar a função
      const result = await fn();

      // Sucesso!
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Verificar se deve tentar novamente
      const shouldRetry = config.shouldRetry
        ? config.shouldRetry(error, attempt)
        : DEFAULT_RETRY_OPTIONS.shouldRetry(error, attempt);

      // Se não deve tentar ou se foi a última tentativa, lançar erro
      if (!shouldRetry || attempt >= config.maxAttempts) {
        throw lastError;
      }

      // Calcular delay para próximo retry
      const delay = calculateBackoffDelay(
        attempt,
        config.baseDelay,
        config.exponentialBase,
        config.maxDelay
      );

      // Notificar sobre retry
      if (options.onRetry) {
        options.onRetry(error, attempt, delay);
      }

      console.warn(
        `Retry attempt ${attempt}/${config.maxAttempts} after ${delay}ms:`,
        error
      );

      // Aguardar antes de próxima tentativa
      await sleep(delay, config.abortSignal);
    }
  }

  // Se chegou aqui, esgotou as tentativas
  throw new RetryExhaustedError(config.maxAttempts, lastError);
}

/**
 * WITH TIMEOUT
 *
 * Adiciona timeout a uma Promise
 *
 * @example
 * const result = await withTimeout(
 *   fetch('/api/data'),
 *   { timeout: 5000 }
 * );
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  options: TimeoutOptions
): Promise<T> {
  const { timeout, timeoutError, abortSignal } = options;

  // Verificar se já foi abortado
  if (abortSignal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  return new Promise<T>((resolve, reject) => {
    // Timer de timeout
    const timer = setTimeout(() => {
      reject(timeoutError || new TimeoutError(`Operation timed out after ${timeout}ms`));
    }, timeout);

    // Listener de abort
    const abortHandler = () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    };

    abortSignal?.addEventListener('abort', abortHandler);

    // Promise original
    promise
      .then((result) => {
        clearTimeout(timer);
        abortSignal?.removeEventListener('abort', abortHandler);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timer);
        abortSignal?.removeEventListener('abort', abortHandler);
        reject(error);
      });
  });
}

/**
 * WITH FALLBACK
 *
 * Tenta executar função principal, se falhar usa fallback
 *
 * @example
 * const result = await withFallback(
 *   () => fetchFromAPI(),
 *   { fallbackFn: () => getFromCache() }
 * );
 */
export async function withFallback<T>(
  fn: () => Promise<T>,
  options: FallbackOptions<T>
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    // Verificar se deve usar fallback
    const shouldFallback = options.shouldFallback
      ? options.shouldFallback(error)
      : true;

    if (!shouldFallback) {
      throw error;
    }

    // Notificar sobre fallback
    if (options.onFallback) {
      options.onFallback(error);
    }

    console.warn('Using fallback due to error:', error);

    // Executar fallback
    return await Promise.resolve(options.fallbackFn());
  }
}

/**
 * RETRY WITH FALLBACK
 *
 * Combina retry com fallback: tenta várias vezes, se falhar usa fallback
 *
 * @example
 * const result = await retryWithFallback(
 *   () => fetchFromAPI(),
 *   { maxAttempts: 3 },
 *   { fallbackFn: () => getFromCache() }
 * );
 */
export async function retryWithFallback<T>(
  fn: () => Promise<T>,
  retryOptions: RetryOptions = {},
  fallbackOptions: FallbackOptions<T>
): Promise<RetryResult<T>> {
  const startTime = Date.now();
  let attempts = 0;

  try {
    const data = await retryWithBackoff(fn, {
      ...retryOptions,
      onRetry: (error, attempt, delay) => {
        attempts = attempt;
        retryOptions.onRetry?.(error, attempt, delay);
      }
    });

    return {
      success: true,
      data,
      attempts: attempts || 1,
      totalTime: Date.now() - startTime,
      fromFallback: false
    };
  } catch (error) {
    // Tentar fallback
    try {
      const data = await withFallback(() => Promise.reject(error), fallbackOptions);

      return {
        success: true,
        data,
        attempts: retryOptions.maxAttempts || DEFAULT_RETRY_OPTIONS.maxAttempts,
        totalTime: Date.now() - startTime,
        fromFallback: true
      };
    } catch (fallbackError) {
      return {
        success: false,
        error: fallbackError instanceof Error ? fallbackError : new Error(String(fallbackError)),
        attempts: retryOptions.maxAttempts || DEFAULT_RETRY_OPTIONS.maxAttempts,
        totalTime: Date.now() - startTime,
        fromFallback: false
      };
    }
  }
}

/**
 * FETCH WITH RETRY
 *
 * Wrapper para fetch com retry automático
 *
 * @example
 * const response = await fetchWithRetry('/api/data', {
 *   method: 'POST',
 *   body: JSON.stringify({ foo: 'bar' })
 * });
 */
export async function fetchWithRetry(
  url: string,
  init?: RequestInit,
  options: RetryOptions = {}
): Promise<Response> {
  const abortController = new AbortController();

  // Mesclar abort signals se houver
  if (options.abortSignal) {
    options.abortSignal.addEventListener('abort', () => {
      abortController.abort();
    });
  }

  const fetchFn = async () => {
    const response = await fetch(url, {
      ...init,
      signal: abortController.signal
    });

    // Lançar erro em respostas não-ok para acionar retry
    if (!response.ok) {
      const error: any = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.response = response;
      throw error;
    }

    return response;
  };

  return retryWithBackoff(fetchFn, {
    ...options,
    abortSignal: abortController.signal
  });
}

/**
 * Verifica se há conexão com a internet
 */
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

/**
 * Aguarda a conexão voltar
 */
export async function waitForOnline(timeout?: number): Promise<void> {
  if (isOnline()) return;

  return new Promise((resolve, reject) => {
    const onlineHandler = () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('online', onlineHandler);
      resolve();
    };

    const timer = timeout
      ? setTimeout(() => {
          window.removeEventListener('online', onlineHandler);
          reject(new TimeoutError('Network connection timeout'));
        }, timeout)
      : null;

    window.addEventListener('online', onlineHandler);
  });
}

/**
 * Testa conectividade fazendo ping em um endpoint
 */
export async function testConnectivity(
  url: string = '/api/health',
  timeout: number = 5000
): Promise<boolean> {
  try {
    const response = await withTimeout(
      fetch(url, { method: 'HEAD', cache: 'no-cache' }),
      { timeout }
    );
    return response.ok;
  } catch {
    return false;
  }
}

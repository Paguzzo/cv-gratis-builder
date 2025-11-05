import { useState, useCallback, useRef } from 'react';
import {
  retryWithBackoff,
  retryWithFallback,
  RetryOptions,
  FallbackOptions,
  RetryResult,
  TimeoutError,
  RetryExhaustedError
} from '@/utils/networkResilience';

/**
 * Estado de uma requisição com retry
 */
export interface ApiRequestState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  retrying: boolean;
  currentAttempt: number;
  maxAttempts: number;
  fromFallback: boolean;
}

/**
 * Opções do hook useApiWithRetry
 */
export interface UseApiWithRetryOptions<T> extends RetryOptions {
  fallbackFn?: () => Promise<T> | T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  immediate?: boolean;
}

/**
 * Hook para fazer chamadas de API com retry automático
 *
 * @example
 * const { data, loading, error, execute, cancel } = useApiWithRetry(
 *   async () => {
 *     const res = await fetch('/api/data');
 *     return res.json();
 *   },
 *   {
 *     maxAttempts: 3,
 *     baseDelay: 1000,
 *     fallbackFn: () => getFromCache()
 *   }
 * );
 */
export function useApiWithRetry<T>(
  apiFn: () => Promise<T>,
  options: UseApiWithRetryOptions<T> = {}
) {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 8000,
    exponentialBase = 2,
    timeout = 30000,
    fallbackFn,
    onSuccess,
    onError,
    immediate = false,
    ...restOptions
  } = options;

  // Estado da requisição
  const [state, setState] = useState<ApiRequestState<T>>({
    data: null,
    error: null,
    loading: immediate,
    retrying: false,
    currentAttempt: 0,
    maxAttempts,
    fromFallback: false
  });

  // AbortController para cancelamento
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Executa a requisição com retry
   */
  const execute = useCallback(async (): Promise<T | null> => {
    // Cancelar requisição anterior se houver
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Criar novo AbortController
    abortControllerRef.current = new AbortController();

    // Resetar estado
    setState({
      data: null,
      error: null,
      loading: true,
      retrying: false,
      currentAttempt: 0,
      maxAttempts,
      fromFallback: false
    });

    try {
      let result: T;

      if (fallbackFn) {
        // Usar retry com fallback
        const retryResult: RetryResult<T> = await retryWithFallback(
          apiFn,
          {
            maxAttempts,
            baseDelay,
            maxDelay,
            exponentialBase,
            timeout,
            abortSignal: abortControllerRef.current.signal,
            onRetry: (error, attempt, delay) => {
              setState(prev => ({
                ...prev,
                retrying: true,
                currentAttempt: attempt
              }));

              restOptions.onRetry?.(error, attempt, delay);
            },
            ...restOptions
          },
          {
            fallbackFn,
            onFallback: (error) => {
              console.warn('Using fallback due to error:', error);
            }
          }
        );

        if (!retryResult.success || !retryResult.data) {
          throw retryResult.error || new Error('Request failed');
        }

        result = retryResult.data;

        // Atualizar estado com dados do fallback
        setState({
          data: result,
          error: null,
          loading: false,
          retrying: false,
          currentAttempt: retryResult.attempts,
          maxAttempts,
          fromFallback: retryResult.fromFallback
        });
      } else {
        // Usar retry simples
        result = await retryWithBackoff(apiFn, {
          maxAttempts,
          baseDelay,
          maxDelay,
          exponentialBase,
          timeout,
          abortSignal: abortControllerRef.current.signal,
          onRetry: (error, attempt, delay) => {
            setState(prev => ({
              ...prev,
              retrying: true,
              currentAttempt: attempt
            }));

            restOptions.onRetry?.(error, attempt, delay);
          },
          ...restOptions
        });

        // Atualizar estado com sucesso
        setState({
          data: result,
          error: null,
          loading: false,
          retrying: false,
          currentAttempt: maxAttempts,
          maxAttempts,
          fromFallback: false
        });
      }

      // Chamar callback de sucesso
      onSuccess?.(result);

      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));

      // Atualizar estado com erro
      setState({
        data: null,
        error: err,
        loading: false,
        retrying: false,
        currentAttempt: maxAttempts,
        maxAttempts,
        fromFallback: false
      });

      // Chamar callback de erro
      onError?.(err);

      return null;
    }
  }, [
    apiFn,
    maxAttempts,
    baseDelay,
    maxDelay,
    exponentialBase,
    timeout,
    fallbackFn,
    onSuccess,
    onError,
    restOptions
  ]);

  /**
   * Cancela a requisição em andamento
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;

      setState(prev => ({
        ...prev,
        loading: false,
        retrying: false,
        error: new DOMException('Aborted', 'AbortError')
      }));
    }
  }, []);

  /**
   * Reseta o estado
   */
  const reset = useCallback(() => {
    cancel();
    setState({
      data: null,
      error: null,
      loading: false,
      retrying: false,
      currentAttempt: 0,
      maxAttempts,
      fromFallback: false
    });
  }, [cancel, maxAttempts]);

  return {
    ...state,
    execute,
    cancel,
    reset,
    isTimeout: state.error instanceof TimeoutError,
    isRetryExhausted: state.error instanceof RetryExhaustedError
  };
}

/**
 * Hook simplificado para fetch com retry
 *
 * @example
 * const { data, loading, error, refetch } = useFetchWithRetry('/api/data', {
 *   method: 'POST',
 *   body: JSON.stringify({ foo: 'bar' })
 * });
 */
export function useFetchWithRetry<T = any>(
  url: string,
  init?: RequestInit,
  options: UseApiWithRetryOptions<T> = {}
) {
  const apiFn = useCallback(async (): Promise<T> => {
    const response = await fetch(url, init);

    if (!response.ok) {
      const error: any = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.response = response;
      throw error;
    }

    return response.json();
  }, [url, init]);

  return useApiWithRetry(apiFn, options);
}

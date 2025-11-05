/**
 * RETRY INDICATOR
 *
 * Componente que exibe feedback visual durante operações com retry
 * Mostra loading states, tentativas atuais e opção de cancelar
 */

import React from 'react';
import { RefreshCw, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export interface RetryIndicatorProps {
  loading: boolean;
  retrying: boolean;
  currentAttempt: number;
  maxAttempts: number;
  error?: Error | null;
  onCancel?: () => void;
  operationName?: string;
  className?: string;
}

export function RetryIndicator({
  loading,
  retrying,
  currentAttempt,
  maxAttempts,
  error,
  onCancel,
  operationName = 'Operação',
  className = ''
}: RetryIndicatorProps) {
  // Não mostrar se não está carregando e não há erro
  if (!loading && !error) {
    return null;
  }

  // Calcular progresso
  const progress = maxAttempts > 0 ? (currentAttempt / maxAttempts) * 100 : 0;

  // Se está retrying
  if (retrying) {
    return (
      <Alert className={`border-blue-200 bg-blue-50 ${className}`}>
        <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
        <AlertTitle className="text-blue-800">
          Tentando novamente...
        </AlertTitle>
        <AlertDescription className="space-y-2">
          <div className="flex items-center justify-between text-sm text-blue-700">
            <span>
              Tentativa {currentAttempt} de {maxAttempts}
            </span>
            {onCancel && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onCancel}
                className="h-6 px-2"
              >
                <X className="h-3 w-3 mr-1" />
                Cancelar
              </Button>
            )}
          </div>
          <Progress value={progress} className="h-1" />
        </AlertDescription>
      </Alert>
    );
  }

  // Se está carregando (primeira tentativa)
  if (loading && !error) {
    return (
      <Alert className={`border-gray-200 bg-gray-50 ${className}`}>
        <RefreshCw className="h-4 w-4 animate-spin text-gray-600" />
        <AlertTitle className="text-gray-800">{operationName}</AlertTitle>
        <AlertDescription className="flex items-center justify-between text-sm text-gray-700">
          <span>Processando...</span>
          {onCancel && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onCancel}
              className="h-6 px-2"
            >
              <X className="h-3 w-3 mr-1" />
              Cancelar
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // Se há erro
  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription className="space-y-2">
          <p className="text-sm">{error.message || 'Ocorreu um erro inesperado'}</p>
          {currentAttempt >= maxAttempts && (
            <p className="text-xs opacity-75">
              Todas as {maxAttempts} tentativas falharam.
            </p>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}

/**
 * Componente inline simples para retry
 */
export interface InlineRetryIndicatorProps {
  retrying: boolean;
  currentAttempt: number;
  maxAttempts: number;
  className?: string;
}

export function InlineRetryIndicator({
  retrying,
  currentAttempt,
  maxAttempts,
  className = ''
}: InlineRetryIndicatorProps) {
  if (!retrying) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 text-sm text-blue-600 ${className}`}>
      <RefreshCw className="h-3 w-3 animate-spin" />
      <span>
        Tentativa {currentAttempt}/{maxAttempts}
      </span>
    </div>
  );
}

/**
 * Toast-style retry notification
 */
export interface RetryToastProps {
  show: boolean;
  currentAttempt: number;
  maxAttempts: number;
  onCancel?: () => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function RetryToast({
  show,
  currentAttempt,
  maxAttempts,
  onCancel,
  position = 'bottom-right'
}: RetryToastProps) {
  if (!show) {
    return null;
  }

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 animate-in slide-in-from-bottom-5`}
    >
      <div className="bg-white border border-blue-200 rounded-lg shadow-lg p-4 min-w-[300px]">
        <div className="flex items-start gap-3">
          <RefreshCw className="h-5 w-5 animate-spin text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-sm text-gray-900">
              Tentando novamente
            </h4>
            <p className="text-xs text-gray-600 mt-1">
              Tentativa {currentAttempt} de {maxAttempts}
            </p>
            <Progress
              value={(currentAttempt / maxAttempts) * 100}
              className="h-1 mt-2"
            />
          </div>
          {onCancel && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onCancel}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Success indicator
 */
export interface SuccessIndicatorProps {
  show: boolean;
  message?: string;
  fromFallback?: boolean;
  onDismiss?: () => void;
  autoHide?: boolean;
  autoHideDelay?: number;
  className?: string;
}

export function SuccessIndicator({
  show,
  message = 'Operação concluída com sucesso',
  fromFallback = false,
  onDismiss,
  autoHide = true,
  autoHideDelay = 3000,
  className = ''
}: SuccessIndicatorProps) {
  const [visible, setVisible] = React.useState(show);

  React.useEffect(() => {
    setVisible(show);

    if (show && autoHide) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [show, autoHide, autoHideDelay, onDismiss]);

  if (!visible) {
    return null;
  }

  return (
    <Alert className={`border-green-200 bg-green-50 ${className}`}>
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-800">Sucesso</AlertTitle>
      <AlertDescription className="space-y-1">
        <p className="text-sm text-green-700">{message}</p>
        {fromFallback && (
          <p className="text-xs text-green-600 opacity-75">
            Dados obtidos do cache local
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
}

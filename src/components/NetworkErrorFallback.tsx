/**
 * NETWORK ERROR FALLBACK
 *
 * Componente que exibe opções de fallback quando há erro de rede
 * Oferece alternativas como cache, download manual, etc.
 */

import React from 'react';
import { AlertTriangle, Download, RefreshCw, Database, Wifi } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface NetworkErrorFallbackProps {
  error: Error;
  onRetry?: () => void;
  onUseCache?: () => void;
  onDownload?: () => void;
  isTimeout?: boolean;
  isRetryExhausted?: boolean;
  hasCache?: boolean;
  canDownload?: boolean;
  operationName?: string;
  className?: string;
}

export function NetworkErrorFallback({
  error,
  onRetry,
  onUseCache,
  onDownload,
  isTimeout = false,
  isRetryExhausted = false,
  hasCache = false,
  canDownload = false,
  operationName = 'a operação',
  className = ''
}: NetworkErrorFallbackProps) {
  return (
    <Card className={`border-red-200 bg-red-50 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-800">
          <AlertTriangle className="h-5 w-5" />
          {isTimeout ? 'Timeout de Rede' : 'Erro de Conexão'}
        </CardTitle>
        <CardDescription className="text-red-700">
          {isTimeout
            ? `${operationName} demorou muito para responder.`
            : isRetryExhausted
            ? `Não foi possível completar ${operationName} após várias tentativas.`
            : `Houve um problema ao executar ${operationName}.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mensagem de erro */}
        <Alert variant="destructive" className="bg-red-100 border-red-300">
          <AlertDescription className="text-sm">
            {error.message || 'Erro desconhecido'}
          </AlertDescription>
        </Alert>

        {/* Opções de fallback */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">O que você pode fazer:</p>

          <div className="grid gap-2">
            {/* Retry */}
            {onRetry && (
              <Button
                variant="outline"
                className="justify-start"
                onClick={onRetry}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar novamente
              </Button>
            )}

            {/* Usar cache */}
            {hasCache && onUseCache && (
              <Button
                variant="outline"
                className="justify-start"
                onClick={onUseCache}
              >
                <Database className="h-4 w-4 mr-2" />
                Usar dados salvos localmente
              </Button>
            )}

            {/* Download manual */}
            {canDownload && onDownload && (
              <Button
                variant="outline"
                className="justify-start"
                onClick={onDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Fazer download manual
              </Button>
            )}
          </div>
        </div>

        {/* Dicas */}
        <div className="pt-2 border-t border-red-200">
          <p className="text-xs text-gray-600 font-medium mb-2">
            Dicas para resolver:
          </p>
          <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
            <li>Verifique sua conexão com a internet</li>
            <li>Tente recarregar a página</li>
            <li>Desative VPN ou proxy se estiver usando</li>
            {isTimeout && <li>Aguarde alguns instantes e tente novamente</li>}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Mensagem inline simples de erro de rede
 */
export interface InlineNetworkErrorProps {
  error: Error;
  onRetry?: () => void;
  className?: string;
}

export function InlineNetworkError({
  error,
  onRetry,
  className = ''
}: InlineNetworkErrorProps) {
  return (
    <div className={`flex items-center gap-2 text-sm text-red-600 ${className}`}>
      <Wifi className="h-4 w-4" />
      <span>{error.message}</span>
      {onRetry && (
        <Button
          size="sm"
          variant="link"
          onClick={onRetry}
          className="h-auto p-0 text-red-600"
        >
          Tentar novamente
        </Button>
      )}
    </div>
  );
}

/**
 * Banner de erro de rede (full-width)
 */
export interface NetworkErrorBannerProps {
  error: Error;
  onRetry?: () => void;
  onDismiss?: () => void;
  position?: 'top' | 'bottom';
  className?: string;
}

export function NetworkErrorBanner({
  error,
  onRetry,
  onDismiss,
  position = 'top',
  className = ''
}: NetworkErrorBannerProps) {
  const positionClasses =
    position === 'top'
      ? 'top-0 left-0 right-0'
      : 'bottom-0 left-0 right-0';

  return (
    <div className={`fixed ${positionClasses} z-50 ${className}`}>
      <Alert variant="destructive" className="rounded-none border-x-0">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erro de conexão</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>{error.message || 'Erro desconhecido'}</span>
          <div className="flex gap-2 ml-4">
            {onRetry && (
              <Button size="sm" variant="outline" onClick={onRetry}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Tentar novamente
              </Button>
            )}
            {onDismiss && (
              <Button size="sm" variant="ghost" onClick={onDismiss}>
                Fechar
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

/**
 * Modal de erro com opções de fallback
 */
export interface NetworkErrorModalProps extends NetworkErrorFallbackProps {
  show: boolean;
  onClose?: () => void;
}

export function NetworkErrorModal({
  show,
  onClose,
  ...props
}: NetworkErrorModalProps) {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="max-w-md w-full">
        <NetworkErrorFallback {...props} />
        {onClose && (
          <div className="mt-4 flex justify-end">
            <Button variant="ghost" onClick={onClose}>
              Fechar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

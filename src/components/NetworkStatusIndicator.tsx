/**
 * NETWORK STATUS INDICATOR
 *
 * Componente que exibe o status da conexão de rede
 * Mostra indicador quando offline ou com conexão lenta
 */

import React from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface NetworkStatusIndicatorProps {
  showOnline?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
  position?: 'top' | 'bottom';
  className?: string;
}

export function NetworkStatusIndicator({
  showOnline = false,
  autoHide = true,
  autoHideDelay = 3000,
  position = 'top',
  className = ''
}: NetworkStatusIndicatorProps) {
  const { status, online, rtt, recheck, isChecking } = useNetworkStatus({
    checkInterval: 30000
  });

  const [visible, setVisible] = React.useState(true);
  const [dismissed, setDismissed] = React.useState(false);

  // Auto-hide quando online
  React.useEffect(() => {
    if (autoHide && online && !dismissed) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, autoHideDelay);

      return () => clearTimeout(timer);
    } else if (!online) {
      setVisible(true);
      setDismissed(false);
    }
  }, [online, autoHide, autoHideDelay, dismissed]);

  // Não mostrar se online e showOnline é false
  if (online && !showOnline) {
    return null;
  }

  // Não mostrar se foi dismissado ou não está visível
  if (dismissed || !visible) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
  };

  const handleRecheck = async () => {
    await recheck();
  };

  // Classes de posição
  const positionClasses =
    position === 'top'
      ? 'top-0 left-0 right-0'
      : 'bottom-0 left-0 right-0';

  // Renderizar baseado no status
  if (status === 'offline') {
    return (
      <div className={`fixed ${positionClasses} z-50 ${className}`}>
        <Alert variant="destructive" className="rounded-none border-x-0">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>Sem conexão</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>
              Você está offline. Verifique sua conexão com a internet.
            </span>
            <div className="flex gap-2 ml-4">
              <Button
                size="sm"
                variant="outline"
                onClick={handleRecheck}
                disabled={isChecking}
              >
                {isChecking ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  'Tentar novamente'
                )}
              </Button>
              <Button size="sm" variant="ghost" onClick={handleDismiss}>
                Fechar
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (status === 'slow') {
    return (
      <div className={`fixed ${positionClasses} z-50 ${className}`}>
        <Alert className="rounded-none border-x-0 bg-yellow-50 border-yellow-200">
          <Wifi className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Conexão lenta</AlertTitle>
          <AlertDescription className="flex items-center justify-between text-yellow-700">
            <span>
              Sua conexão está lenta ({rtt}ms). Algumas operações podem
              demorar mais.
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              className="ml-4"
            >
              Fechar
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (status === 'online' && showOnline) {
    return (
      <div className={`fixed ${positionClasses} z-50 ${className}`}>
        <Alert className="rounded-none border-x-0 bg-green-50 border-green-200">
          <Wifi className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Conectado</AlertTitle>
          <AlertDescription className="flex items-center justify-between text-green-700">
            <span>Você está online{rtt ? ` (${rtt}ms)` : ''}.</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              className="ml-4"
            >
              Fechar
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return null;
}

/**
 * Badge simples de status de rede
 */
export function NetworkBadge({ className = '' }: { className?: string }) {
  const { online, status } = useNetworkStatus();

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    slow: 'bg-yellow-500',
    checking: 'bg-gray-500'
  };

  const statusLabels = {
    online: 'Online',
    offline: 'Offline',
    slow: 'Lento',
    checking: 'Verificando...'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span
        className={`w-2 h-2 rounded-full ${statusColors[status]}`}
        title={statusLabels[status]}
      />
      <span className="text-xs text-gray-600">{statusLabels[status]}</span>
    </div>
  );
}

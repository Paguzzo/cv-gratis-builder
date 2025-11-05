import { useState, useEffect, useCallback } from 'react';
import { isOnline, testConnectivity } from '@/utils/networkResilience';

/**
 * Status da rede
 */
export type NetworkStatus = 'online' | 'offline' | 'slow' | 'checking';

/**
 * Informações sobre a conexão
 */
export interface NetworkInfo {
  status: NetworkStatus;
  online: boolean;
  effectiveType?: string; // '4g', '3g', '2g', 'slow-2g'
  downlink?: number; // Mbps
  rtt?: number; // Round trip time em ms
  saveData?: boolean;
  lastChecked: Date | null;
}

/**
 * Opções do hook useNetworkStatus
 */
export interface UseNetworkStatusOptions {
  checkInterval?: number; // Intervalo para verificar conectividade (ms)
  checkUrl?: string; // URL para teste de conectividade
  slowThreshold?: number; // RTT threshold para considerar conexão lenta (ms)
  onOnline?: () => void;
  onOffline?: () => void;
  onSlow?: () => void;
}

/**
 * Hook para monitorar o status da rede
 *
 * @example
 * const { status, online, rtt, recheck } = useNetworkStatus({
 *   checkInterval: 30000,
 *   onOffline: () => toast.error('Sem conexão')
 * });
 */
export function useNetworkStatus(options: UseNetworkStatusOptions = {}) {
  const {
    checkInterval = 30000,
    checkUrl = '/api/health',
    slowThreshold = 2000,
    onOnline,
    onOffline,
    onSlow
  } = options;

  // Estado da rede
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>(() => {
    const online = isOnline();
    return {
      status: online ? 'online' : 'offline',
      online,
      lastChecked: null
    };
  });

  /**
   * Verifica o status da rede
   */
  const checkNetworkStatus = useCallback(async () => {
    setNetworkInfo(prev => ({ ...prev, status: 'checking' }));

    const online = isOnline();
    const now = new Date();

    // Se offline pelo navegador, não precisa testar conectividade
    if (!online) {
      setNetworkInfo({
        status: 'offline',
        online: false,
        lastChecked: now
      });
      return;
    }

    // Testar conectividade real
    const startTime = performance.now();
    const connected = await testConnectivity(checkUrl, 5000);
    const rtt = Math.round(performance.now() - startTime);

    // Determinar status baseado na conectividade e RTT
    let status: NetworkStatus = 'online';
    if (!connected) {
      status = 'offline';
    } else if (rtt > slowThreshold) {
      status = 'slow';
    }

    // Obter informações da API Network Information (se disponível)
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

    const newInfo: NetworkInfo = {
      status,
      online: connected,
      rtt,
      lastChecked: now,
      ...(connection && {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        saveData: connection.saveData
      })
    };

    setNetworkInfo(newInfo);

    // Chamar callbacks
    if (status === 'offline' && onOffline) {
      onOffline();
    } else if (status === 'online' && onOnline) {
      onOnline();
    } else if (status === 'slow' && onSlow) {
      onSlow();
    }
  }, [checkUrl, slowThreshold, onOnline, onOffline, onSlow]);

  /**
   * Handler para evento online
   */
  const handleOnline = useCallback(() => {
    console.log('Network: Online');
    checkNetworkStatus();
  }, [checkNetworkStatus]);

  /**
   * Handler para evento offline
   */
  const handleOffline = useCallback(() => {
    console.log('Network: Offline');
    setNetworkInfo(prev => ({
      ...prev,
      status: 'offline',
      online: false,
      lastChecked: new Date()
    }));
    onOffline?.();
  }, [onOffline]);

  /**
   * Handler para mudança de conexão
   */
  const handleConnectionChange = useCallback(() => {
    console.log('Network: Connection changed');
    checkNetworkStatus();
  }, [checkNetworkStatus]);

  // Efeito para monitorar eventos de rede
  useEffect(() => {
    // Adicionar listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Network Information API
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    // Verificação inicial
    checkNetworkStatus();

    // Verificação periódica
    const interval = setInterval(checkNetworkStatus, checkInterval);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
      clearInterval(interval);
    };
  }, [handleOnline, handleOffline, handleConnectionChange, checkNetworkStatus, checkInterval]);

  return {
    ...networkInfo,
    recheck: checkNetworkStatus,
    isOnline: networkInfo.online,
    isOffline: networkInfo.status === 'offline',
    isSlow: networkInfo.status === 'slow',
    isChecking: networkInfo.status === 'checking'
  };
}

/**
 * Hook simplificado para detectar apenas se está online/offline
 *
 * @example
 * const isOnline = useOnlineStatus();
 */
export function useOnlineStatus(): boolean {
  const [online, setOnline] = useState(() => isOnline());

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return online;
}

/**
 * Hook para aguardar conexão online
 *
 * @example
 * const { waiting, waitForConnection } = useWaitForOnline();
 *
 * await waitForConnection();
 */
export function useWaitForOnline() {
  const [waiting, setWaiting] = useState(false);
  const { isOnline } = useNetworkStatus();

  const waitForConnection = useCallback(async (timeout?: number): Promise<void> => {
    if (isOnline) return;

    setWaiting(true);

    return new Promise((resolve, reject) => {
      const handleOnline = () => {
        cleanup();
        setWaiting(false);
        resolve();
      };

      const timer = timeout
        ? setTimeout(() => {
            cleanup();
            setWaiting(false);
            reject(new Error('Network connection timeout'));
          }, timeout)
        : null;

      const cleanup = () => {
        window.removeEventListener('online', handleOnline);
        if (timer) clearTimeout(timer);
      };

      window.addEventListener('online', handleOnline);
    });
  }, [isOnline]);

  return {
    waiting,
    waitForConnection
  };
}

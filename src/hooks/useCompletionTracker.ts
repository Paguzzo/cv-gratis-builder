import { useState, useEffect, useCallback } from 'react';

export interface CompletionState {
  downloadCompleted: boolean;
  printCompleted: boolean;
  timestamp: number;
  sessionId: string;
}

const STORAGE_KEY = 'cvgratis-completion-state';
const SESSION_KEY = 'cvgratis-session-id';

// Gera ID único da sessão
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

// Carrega estado do localStorage
const loadState = (): CompletionState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const state = JSON.parse(stored) as CompletionState;
      const currentSession = getSessionId();

      // Se for sessão diferente, resetar
      if (state.sessionId !== currentSession) {
        return getDefaultState();
      }

      return state;
    }
  } catch (error) {
    console.error('Erro ao carregar completion state:', error);
  }
  return getDefaultState();
};

// Estado padrão
const getDefaultState = (): CompletionState => ({
  downloadCompleted: false,
  printCompleted: false,
  timestamp: Date.now(),
  sessionId: getSessionId()
});

// Salva estado
const saveState = (state: CompletionState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Erro ao salvar completion state:', error);
  }
};

// Limpa estado
const clearState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Erro ao limpar completion state:', error);
  }
};

export const useCompletionTracker = () => {
  const [state, setState] = useState<CompletionState>(loadState);

  // Sincronizar com localStorage
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Marca download como completo
  const markDownloadComplete = useCallback(() => {
    setState(prev => ({
      ...prev,
      downloadCompleted: true,
      timestamp: Date.now()
    }));
  }, []);

  // Marca impressão como completa
  const markPrintComplete = useCallback(() => {
    setState(prev => ({
      ...prev,
      printCompleted: true,
      timestamp: Date.now()
    }));
  }, []);

  // Verifica se tudo está completo
  const isComplete = useCallback((): boolean => {
    return state.downloadCompleted && state.printCompleted;
  }, [state]);

  // Verifica se tem ações pendentes
  const hasPendingActions = useCallback((): boolean => {
    return !state.downloadCompleted || !state.printCompleted;
  }, [state]);

  // Lista ações pendentes
  const getPendingActions = useCallback((): string[] => {
    const pending: string[] = [];
    if (!state.downloadCompleted) pending.push('Download do PDF');
    if (!state.printCompleted) pending.push('Impressão do currículo');
    return pending;
  }, [state]);

  // Lista ações completadas
  const getCompletedActions = useCallback((): string[] => {
    const completed: string[] = [];
    if (state.downloadCompleted) completed.push('Download do PDF');
    if (state.printCompleted) completed.push('Impressão do currículo');
    return completed;
  }, [state]);

  // Reseta estado (para "Revisar Novamente")
  const reset = useCallback(() => {
    setState(getDefaultState());
  }, []);

  // Limpa completamente (após confirmação final)
  const clear = useCallback(() => {
    clearState();
    setState(getDefaultState());
  }, []);

  return {
    state,
    isComplete: isComplete(),
    hasPendingActions: hasPendingActions(),
    pendingActions: getPendingActions(),
    completedActions: getCompletedActions(),
    markDownloadComplete,
    markPrintComplete,
    reset,
    clear
  };
};

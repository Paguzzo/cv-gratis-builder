import { useState, useCallback, useEffect } from 'react';

interface UserData {
  name: string;
  email: string;
  whatsapp: string;
}

export function useUserDataCollection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [actionType, setActionType] = useState<'download' | 'print' | 'email'>('download');
  const [hasData, setHasData] = useState(false);

  // Verificar se usuário já forneceu dados
  const checkUserData = useCallback(() => {
    return localStorage.getItem('cvgratis-user-data-collected') === 'true';
  }, []);

  // Atualizar estado quando localStorage mudar
  useEffect(() => {
    setHasData(checkUserData());
  }, [checkUserData]);

  // Função para solicitar ação que requer dados do usuário
  const requestUserDataIfNeeded = useCallback((
    action: () => void,
    type: 'download' | 'print' | 'email',
    isTemplatePreumium: boolean = false
  ) => {
    // Se for template premium, executa direto sem pedir dados
    if (isTemplatePreumium) {
      action();
      return;
    }

    // Se usuário já forneceu dados, executa direto
    if (checkUserData()) {
      action();
      return;
    }

    // Caso contrário, abre modal para coletar dados
    setPendingAction(() => action);
    setActionType(type);
    setIsModalOpen(true);
  }, [checkUserData]);

  // Callback quando usuário submete os dados
  const handleUserDataSubmit = useCallback((userData: UserData) => {
    // Atualizar estado local
    setHasData(true);
    
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    setIsModalOpen(false);
  }, [pendingAction]);

  // Callback quando usuário cancela
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setPendingAction(null);
  }, []);

  // Função para obter dados salvos do usuário
  const getSavedUserData = useCallback((): UserData | null => {
    try {
      const data = localStorage.getItem('cvgratis-user-data');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }, []);

  // Função para limpar dados (logout/reset)
  const clearUserData = useCallback(() => {
    localStorage.removeItem('cvgratis-user-data-collected');
    localStorage.removeItem('cvgratis-user-data');
    setHasData(false);
  }, []);

  return {
    isModalOpen,
    actionType,
    hasUserData: hasData,
    savedUserData: getSavedUserData(),
    requestUserDataIfNeeded,
    handleUserDataSubmit,
    handleModalClose,
    clearUserData
  };
} 
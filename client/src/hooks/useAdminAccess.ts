import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

export function useAdminAccess() {
  const [, setLocation] = useLocation();
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    // Verificar se está no modo admin
    const adminMode = localStorage.getItem('admin_mode') === 'true';
    const adminEnabled = localStorage.getItem('admin_access_enabled') === 'true';
    setIsAdminMode(adminMode && adminEnabled);
  }, []);

  const enableAdminMode = () => {
    const adminEnabled = localStorage.getItem('admin_access_enabled') === 'true';
    if (adminEnabled) {
      localStorage.setItem('admin_mode', 'true');
      setIsAdminMode(true);
      setLocation('/admin');
    } else {
      alert('❌ Acesso administrativo não autorizado. Clique 5 vezes na headline da página inicial.');
    }
  };

  const exitAdminMode = () => {
    localStorage.removeItem('admin_mode');
    setIsAdminMode(false);
    setLocation('/');
  };

  return {
    isAdminMode,
    enableAdminMode,
    exitAdminMode
  };
}
import { useState, useEffect } from 'react';

export function useAdminAccess() {
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
      // Navegação direta via window.location
      window.location.href = '/admin';
    } else {
      alert('❌ Acesso administrativo não autorizado. Clique 5 vezes na headline da página inicial.');
    }
  };

  const exitAdminMode = () => {
    localStorage.removeItem('admin_mode');
    setIsAdminMode(false);
    window.location.href = '/';
  };

  return {
    isAdminMode,
    enableAdminMode,
    exitAdminMode
  };
}
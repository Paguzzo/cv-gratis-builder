/**
 * 🔒 HOOK DE ACESSO ADMIN SEGURO
 *
 * DEPRECADO: Este hook usava sistema inseguro de "5 cliques"
 * NOVO: Agora redireciona para login JWT seguro
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from './useAdminAuth';

export function useAdminAccess() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, logout } = useAdminAuth();

  // 🔒 SEGURO: Redirecionar para login em vez de "5 cliques"
  const handleHeadlineClick = useCallback(() => {
    if (isAuthenticated) {
      navigate('/admin');
    } else {
      navigate('/admin/login');

      toast({
        title: "🔐 Acesso Restrito",
        description: "Faça login para acessar o painel administrativo",
        duration: 3000,
      });
    }
  }, [isAuthenticated, navigate, toast]);

  // Verificar se está no modo admin baseado na autenticação
  const checkAdminMode = useCallback(() => {
    return isAuthenticated && window.location.pathname.startsWith('/admin');
  }, [isAuthenticated]);

  // Sair do modo admin com logout seguro
  const exitAdminMode = useCallback(async () => {
    await logout();
  }, [logout]);

  // Compatibilidade com código legado
  const resetAdminAccess = useCallback(() => {
    // Não faz nada - mantido para compatibilidade
  }, []);

  return {
    // Compatibilidade com código legado
    clickCount: 0,
    isAdminMode: isAuthenticated,

    // Funções atualizadas para segurança
    handleHeadlineClick,
    exitAdminMode,
    checkAdminMode,
    resetAdminAccess
  };
} 
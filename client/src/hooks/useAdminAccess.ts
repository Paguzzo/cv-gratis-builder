import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export function useAdminAccess() {
  const [clickCount, setClickCount] = useState(0);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verificar se está no modo admin baseado na URL
  const checkAdminMode = useCallback(() => {
    const isInAdminPage = window.location.pathname === '/admin';
    setIsAdminMode(isInAdminPage);
    return isInAdminPage;
  }, []);

  // Manipular clique na headline
  const handleHeadlineClick = useCallback(() => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    // Limpar timeout anterior
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
    }

    // Feedback visual baseado no número de cliques
    if (newCount === 1) {
      toast({
        title: "🤔",
        description: "Curioso...",
        duration: 1000,
      });
    } else if (newCount === 2) {
      toast({
        title: "🧐",
        description: "Hmm, interessante...",
        duration: 1000,
      });
    } else if (newCount === 3) {
      toast({
        title: "🕵️",
        description: "Você está procurando algo?",
        duration: 1000,
      });
    } else if (newCount === 4) {
      toast({
        title: "🔍",
        description: "Mais um clique...",
        duration: 1000,
      });
    } else if (newCount === 5) {
      // Acesso liberado!
      toast({
        title: "🔓 Acesso Administrativo Liberado!",
        description: "Redirecionando para painel admin...",
        duration: 2000,
      });
      
      setTimeout(() => {
        navigate('/admin');
        setIsAdminMode(true);
      }, 1000);
      
      setClickCount(0);
      return;
    }

    // Reset contador após 3 segundos sem cliques
    clickTimeout.current = setTimeout(() => {
      setClickCount(0);
    }, 3000);
  }, [clickCount, navigate, toast]);

  // Sair do modo admin
  const exitAdminMode = useCallback(() => {
    setIsAdminMode(false);
    setClickCount(0);
    navigate('/');
    toast({
      title: "👋 Saindo do modo admin",
      description: "Redirecionando para página inicial...",
      duration: 2000,
    });
  }, [navigate, toast]);

  // Limpar estados
  const resetAdminAccess = useCallback(() => {
    setClickCount(0);
    setIsAdminMode(false);
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
    }
  }, []);

  return {
    clickCount,
    isAdminMode,
    handleHeadlineClick,
    exitAdminMode,
    checkAdminMode,
    resetAdminAccess
  };
} 
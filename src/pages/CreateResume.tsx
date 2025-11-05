import { useEffect } from 'react';
import { CombinedProvider } from '@/contexts/CombinedProvider';
import { CurriculumBuilder } from '@/components/resume-builder/CurriculumBuilder';
import { FormErrorBoundary } from '@/components/error';

export default function CreateResume() {
  // Função para limpar template premium quando sair da página (ex: F5, fechar aba)
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Não limpar se está apenas navegando dentro do fluxo premium
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/premium-editor')) {
        localStorage.removeItem('selected-premium-template');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // 🔧 CORREÇÃO: Limpar flag de currículo finalizado ao entrar na página
    // Isso permite que o usuário continue editando
    localStorage.removeItem('cvgratis-curriculum-completed');

    // 🚨 CORREÇÃO CRÍTICA: NÃO sobrescrever localStorage aqui
    // O CurriculumContext já carrega automaticamente do localStorage
    // Sobrescrever aqui causava conflito e perda de dados nos formulários
    console.log('✅ CreateResume montado - CurriculumContext carregará dados automaticamente');

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <FormErrorBoundary>
      <CombinedProvider>
        <div className="h-screen bg-gray-50 overflow-hidden">
          <CurriculumBuilder />
        </div>
      </CombinedProvider>
    </FormErrorBoundary>
  );
}
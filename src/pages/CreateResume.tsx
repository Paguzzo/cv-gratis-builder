import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CombinedProvider } from '@/contexts/CombinedProvider';
import { CurriculumBuilder } from '@/components/resume-builder/CurriculumBuilder';
import { FormErrorBoundary } from '@/components/error';
import SEOHead from '@/components/SEOHead';
import StructuredData from '@/components/StructuredData';

export default function CreateResume() {
  const [searchParams] = useSearchParams();

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

    // 🚨 CORREÇÃO CRÍTICA DO BUG: Limpar flags de sessão premium APENAS se não for fluxo premium
    const isPremiumFlow = searchParams.get('premium') === 'true';

    if (!isPremiumFlow) {
      // Quando o usuário acessa /criar-curriculo SEM parâmetros premium, é um fluxo GRATUITO
      // Limpar flags antigas de sessão premium para evitar redirecionamento incorreto ao finalizar
      console.log('🧹 Limpando flags de sessão premium (fluxo gratuito detectado)');
      localStorage.removeItem('is-premium-session');
      localStorage.removeItem('selected-premium-template');
    } else {
      console.log('🏆 Fluxo premium detectado - mantendo flags de sessão');
    }

    // 🚨 CORREÇÃO CRÍTICA: NÃO sobrescrever localStorage aqui
    // O CurriculumContext já carrega automaticamente do localStorage
    // Sobrescrever aqui causava conflito e perda de dados nos formulários
    console.log('✅ CreateResume montado - CurriculumContext carregará dados automaticamente');

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [searchParams]);

  return (
    <FormErrorBoundary>
      <SEOHead
        title="Criar Currículo Profissional Grátis | CVGratis"
        description="Crie seu currículo profissional em 3 minutos com ajuda da IA. Templates modernos, exportação em PDF e 100% gratuito. Comece agora!"
        keywords="criar currículo, currículo grátis, fazer currículo online, gerador de currículo, currículo profissional"
        canonicalUrl="https://www.curriculogratisonline.com/criar-curriculo"
        ogImage="https://www.curriculogratisonline.com/og-image.jpg"
      />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Início', url: 'https://www.curriculogratisonline.com/' },
          { name: 'Criar Currículo', url: 'https://www.curriculogratisonline.com/criar-curriculo' }
        ]}
      />
      <CombinedProvider>
        <div className="h-screen bg-gray-50 overflow-hidden">
          <CurriculumBuilder />
        </div>
      </CombinedProvider>
    </FormErrorBoundary>
  );
}
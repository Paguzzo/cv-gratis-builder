import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CombinedProvider } from '@/contexts/CombinedProvider';
import { useTemplate } from '@/contexts/TemplateContext';
import { useCurriculum } from '@/contexts/CurriculumContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useCompletionTracker } from '@/hooks/useCompletionTracker';
import { useSafeHtml, SANITIZE_PRESETS } from '@/utils/sanitizeHtml';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';
import { TemplateCarousel } from '@/components/templates/TemplateCarousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Crown, Check, Download, ArrowLeft, Loader2, Printer, Lock, BrainCircuit, X, Gift, Star, Info, Zap, Target, Award, FileText, Search, Filter, Heart } from 'lucide-react';
import { AVAILABLE_TEMPLATES, Template } from '@/types/templates';
import { PDFExportService } from '@/services/pdfExportService';
import { PrintService } from '@/services/printService';
import { TEMPLATES_CATALOG, searchTemplates, getTemplatesByCategory, getFreeTemplates, getPremiumTemplates } from '@/data/templatesCatalog';
import { TEMPLATE_CATEGORIES, type TemplateCategory, type TemplateLevel } from '@/types/templateCategories';
import { useTemplateFavorites } from '@/hooks/useTemplateFavorites';
import { TemplateFavoriteButton } from '@/components/templates/TemplateFavoriteButton';
import { CompletionBadgeWithTooltip } from '@/components/ui/completion-badge';
import { CompletionModal } from '@/components/ui/completion-modal';
// import { StripeService } from '@/services/stripeService'; // 🚨 REMOVIDO
// Email e WhatsApp removidos para simplicidade
import { PaymentDialog } from '@/components/ui/payment-dialog';
// import { DevModePanel } from '@/components/ui/dev-mode-panel';
// import { JobAIChat } from '@/components/ui/jobai-chat-fixed'; // 🚨 REMOVIDO DEFINITIVAMENTE
import { toast } from 'sonner';

// Importar sistema de coleta de dados
import { userDataService } from '@/services/userDataService';
import { useStripeReturn } from '@/hooks/useStripeReturn';
import { useStripeCancellationDetector } from '@/hooks/useStripeCancellationDetector';
import { PaymentSuccessToast } from '@/components/ui/payment-success-toast';
import { safeParseCurriculumData, safeParseJsonObject } from '@/utils/safeJsonParse';

function TemplateSelectorContent() {

  const navigate = useNavigate();
  const { state, selectTemplate, unlockPremium } = useTemplate();
  const { state: curriculumState } = useCurriculum();
  const { isAdmin } = useAdmin();

  // 🛡️ Sanitizar CSS antecipadamente para evitar problemas de React Hooks
  const sanitizedCustomCSS = useSafeHtml(`
          .templates-sidebar {
            scrollbar-width: thin;
            scrollbar-color: #CBD5E0 #F7FAFC;
          }
          .templates-sidebar::-webkit-scrollbar {
            width: 6px;
          }
          .templates-sidebar::-webkit-scrollbar-track {
            background: #F7FAFC;
          }
          .templates-sidebar::-webkit-scrollbar-thumb {
            background: #CBD5E0;
            border-radius: 3px;
          }
          .templates-sidebar::-webkit-scrollbar-thumb:hover {
            background: #A0AEC0;
          }
          .preview-container::-webkit-scrollbar {
            width: 12px;
          }
          .preview-container::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 6px;
          }
          .preview-container::-webkit-scrollbar-thumb {
            background: #94a3b8;
            border-radius: 6px;
            border: 3px solid #f1f5f9;
          }
          .preview-container::-webkit-scrollbar-thumb:hover {
            background: #64748b;
          }
          .preview-container {
            scrollbar-width: thin;
            scrollbar-color: #94a3b8 #f1f5f9;
          }
          #template-preview-container {
            max-height: none !important;
            height: auto !important;
            overflow: visible !important;
            display: flex !important;
            justify-content: center !important;
            align-items: flex-start !important;
            width: 100% !important;
          }
          #template-preview-container > * {
            max-height: none !important;
            height: auto !important;
            overflow: visible !important;
            display: block !important;
            width: 100% !important;
            max-width: 900px !important;
            margin: 0 auto !important;
          }
          #template-preview-container * {
            max-height: none !important;
          }
          .preview-container > div {
            min-height: 100% !important;
          }
          @keyframes pulse-glow {
            0%, 100% {
              box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
            }
            50% {
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6);
            }
          }
          @keyframes bounce-enhanced {
            0%, 20%, 53%, 80%, 100% {
              transform: translate3d(0,0,0);
            }
            40%, 43% {
              transform: translate3d(0,-8px,0);
            }
            70% {
              transform: translate3d(0,-4px,0);
            }
            90% {
              transform: translate3d(0,-2px,0);
            }
          }
          .animate-bounce {
            animation: bounce-enhanced 1s infinite;
          }
          @keyframes shimmer-green {
            0%, 100% {
              background: linear-gradient(to right, #f0fdf4, #dcfce7);
              border-color: #bbf7d0;
            }
            50% {
              background: linear-gradient(to right, #bbf7d0, #86efac);
              border-color: #22c55e;
              box-shadow: 0 0 8px rgba(34, 197, 94, 0.3);
            }
          }
          .animate-shimmer-green {
            animation: shimmer-green 3s ease-in-out infinite;
          }
          @keyframes shimmer-gold {
            0%, 100% {
              background: linear-gradient(to right, #fffbeb, #fef3c7);
              border-color: #fde68a;
            }
            50% {
              background: linear-gradient(to right, #fde68a, #f59e0b);
              border-color: #d97706;
              box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
            }
          }
          .animate-shimmer-gold {
            animation: shimmer-gold 3s ease-in-out infinite 0.5s;
          }
        `, SANITIZE_PRESETS.TEMPLATE_CSS);
  const stripeReturn = useStripeReturn();

  // 🚫 Detector automático de cancelamento do Stripe
  useStripeCancellationDetector();

  const [isExporting, setIsExporting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  // Email dialog removido para simplicidade
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedTemplateForPayment, setSelectedTemplateForPayment] = useState<Template | null>(null);

  // const [jobAIChatOpen, setJobAIChatOpen] = useState(false); // 🚨 REMOVIDO DEFINITIVAMENTE
  
    // 🔧 SISTEMA SIMPLES DE COLETA DE DADOS
  const [userDataModalOpen, setUserDataModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [currentActionType, setCurrentActionType] = useState<'download' | 'print' | 'email' | 'whatsapp'>('download');
  const [userFormData, setUserFormData] = useState({
      name: '',
      email: '',
      whatsapp: ''
    });

  // 🔧 VERIFICAR SE DADOS DO USUÁRIO JÁ FORAM SALVOS
  const hasUserDataSaved = () => {
    const savedData = localStorage.getItem('cv-user-data');
    return !!savedData;
  };

  // 🔧 CARREGAR DADOS SALVOS
  const loadSavedUserData = () => {
    try {
      const savedData = localStorage.getItem('cv-user-data');
      if (savedData) {
        return safeParseJsonObject(savedData);
      }
    } catch (error) {
      console.warn('Erro ao carregar dados salvos:', error);
    }
    return null;
  };

  // 🎯 ESTADOS PARA MODAIS "SAIBA MAIS"
  const [freeInfoModalOpen, setFreeInfoModalOpen] = useState(false);
  const [premiumInfoModalOpen, setPremiumInfoModalOpen] = useState(false);

  // 🆕 FASE 3A - Estados para filtros e busca
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<TemplateLevel | 'all'>('all');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const { favorites, isFavorite, toggleFavorite } = useTemplateFavorites();

  // 🔧 NOVO: Estado de carregamento para aguardar contextos carregarem do localStorage
  const [isLoadingData, setIsLoadingData] = useState(true);

  // 🎯 Sistema de rastreamento de conclusão
  const completion = useCompletionTracker();
  const [completionModalOpen, setCompletionModalOpen] = useState(false);

  // 📱 Estados para preview mobile
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const { clearAllData } = useCurriculum();

  // 🔧 NOVO: useEffect para aguardar carregamento dos contextos
  useEffect(() => {
    console.log('⏳ [TemplateSelector] Aguardando carregamento de dados...');

    // Aguardar um momento para os contextos carregarem do localStorage
    const loadingTimer = setTimeout(() => {
      setIsLoadingData(false);
      console.log('✅ [TemplateSelector] Carregamento de dados concluído');
    }, 800); // 800ms é suficiente para contextos carregarem

    return () => clearTimeout(loadingTimer);
  }, []);

  // 🎯 Monitorar conclusão de todas as ações
  useEffect(() => {
    if (completion.isComplete) {
      console.log('✅ Todas as ações completas! Abrindo modal de conclusão');
      setCompletionModalOpen(true);
    }
  }, [completion.isComplete]);

  // 🎯 Interceptar tentativa de sair da página
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (completion.hasPendingActions) {
        e.preventDefault();
        e.returnValue = 'Você ainda não completou todas as ações (download e impressão). Tem certeza que deseja sair?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [completion.hasPendingActions]);

  const allTemplates = AVAILABLE_TEMPLATES;

  // 🆕 FASE 3A - Filtragem de templates
  const filteredTemplates = useMemo(() => {
    let result = allTemplates;

    // Filtrar por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query)
      );
    }

    // Filtrar por nível (free/premium)
    if (selectedLevel !== 'all') {
      const isPremium = selectedLevel === 'premium';
      result = result.filter(template => template.isPremium === isPremium);
    }

    // Filtrar por favoritos
    if (showOnlyFavorites) {
      result = result.filter(template => isFavorite(template.id));
    }

    return result;
  }, [allTemplates, searchQuery, selectedLevel, showOnlyFavorites, favorites, isFavorite]);

  // Lidar com retorno do Stripe
  useEffect(() => {
    if (stripeReturn.isReturningFromStripe) {
      console.log('🔄 RETORNO DO STRIPE DETECTADO:', stripeReturn);
      
      if (stripeReturn.paymentStatus === 'success' && stripeReturn.purchasedTemplate) {
        // Buscar informações do template comprado
        const purchasedTemplate = allTemplates.find(t => t.id === stripeReturn.purchasedTemplate);
        const templateName = purchasedTemplate?.name || 'Template Premium';
        
        // Mostrar notificação rica de sucesso
        toast.custom((t) => (
          <PaymentSuccessToast 
            templateName={templateName}
            templateId={stripeReturn.purchasedTemplate}
            onRedirect={() => {
              navigate(`/premium-editor?template=${stripeReturn.purchasedTemplate}`);
              toast.dismiss(t);
            }}
          />
        ), {
          duration: 3000
        });

        
        // Redirecionar para a configuração do template premium após 2.5 segundos
        setTimeout(() => {
          navigate(`/premium-editor?template=${stripeReturn.purchasedTemplate}`);
        }, 2500);
      } else if (stripeReturn.paymentStatus === 'cancelled') {
        // Recuperar info do template que estava tentando comprar
        const pendingPurchase = localStorage.getItem('stripe_pending_purchase');
        let templateName = 'Template Premium';

        if (pendingPurchase) {
          try {
            const data = JSON.parse(pendingPurchase);
            templateName = data.templateName || templateName;
          } catch (e) {
            console.error('Erro ao parsear pending purchase:', e);
          }
        }

        toast.info(
          `Você cancelou a compra do "${templateName}". Fique à vontade para tentar novamente quando quiser! 😊`,
          {
            duration: 5000,
            icon: '🚫',
          }
        );
      }
    }
  }, [stripeReturn, navigate]);

    useEffect(() => {
    console.log('🔍 Estado do template:', state);
    console.log('🔍 Dados do currículo context:', curriculumState.data);
    
    // 🔧 DEBUG: Verificar templates disponíveis
    console.log('📋 TEMPLATES DISPONÍVEIS:');
    allTemplates.forEach((template, index) => {
      console.log(`${index + 1}. ${template.name} - Premium: ${template.isPremium}`);
    });
    
    // Verificar dados no localStorage diretamente
    const personalInfoLS = localStorage.getItem('cvgratis-curriculum');
    console.log('💾 TemplateSelector - localStorage check:', personalInfoLS ? 'Dados encontrados' : 'Sem dados');
    
    // Se não há template selecionado, selecionar o primeiro
    if (!state.selectedTemplate || !state.selectedTemplate.id) {
      const defaultTemplate = allTemplates[0];
      if (defaultTemplate) {
        console.log('🎯 Template padrão selecionado:', defaultTemplate.name, 'Premium:', defaultTemplate.isPremium);
        selectTemplate(defaultTemplate.id);
      }
    }
  }, [curriculumState.data, state.selectedTemplate, selectTemplate, allTemplates]);

  // Verificar se temos dados válidos
  const hasValidData = () => {
    
    // 🔧 CORREÇÃO CRÍTICA: Primeiro verificar se há currículo finalizado
    const finalizedCurriculum = localStorage.getItem('cvgratis-curriculum-finalized');
    if (finalizedCurriculum) {
      try {
        const parsedFinalized = JSON.parse(finalizedCurriculum);
        if (parsedFinalized.isCompleted) {
          return true;
        }
      } catch (error) {
        console.warn('⚠️ Erro ao processar currículo finalizado:', error);
      }
    }
    
    // 🔧 CORREÇÃO CRÍTICA: Verificar se o usuário acabou de finalizar o currículo
    const hasCompletedCurriculum = localStorage.getItem('cvgratis-curriculum-completed') === 'true';
    if (hasCompletedCurriculum) {
      return true;
    }
    
    // Verificar no context
    console.log('📋 Context data:', curriculumState.data);
    if (curriculumState.data?.personalInfo?.name && curriculumState.data.personalInfo.name.trim() !== '') {
      return true;
    }
    
    // Verificar no localStorage
    try {
      const personalInfoLS = localStorage.getItem('cvgratis-curriculum');
      console.log('💾 localStorage data:', personalInfoLS);
      
      if (personalInfoLS) {
        const parsedData = safeParseCurriculumData(personalInfoLS);
        console.log('📊 Parsed data:', parsedData);
        
        // Verificar se há dados pessoais com nome preenchido
        const hasPersonalInfo = parsedData && 
          parsedData.personalInfo && 
          parsedData.personalInfo.name && 
          parsedData.personalInfo.name.trim() !== '';
        console.log('👤 Personal info check:', hasPersonalInfo);
        
        if (hasPersonalInfo) {
          return true;
        }
        
        // Verificar se há pelo menos algum dado preenchido
        const hasAnyData = parsedData && (
          (parsedData.personalInfo && Object.keys(parsedData.personalInfo).some(key => {
            const value = parsedData.personalInfo[key];
            return value && typeof value === 'string' && value.trim() !== '';
          })) ||
          (parsedData.objective && parsedData.objective.description && parsedData.objective.description.trim() !== '') ||
          (parsedData.experience && Array.isArray(parsedData.experience) && parsedData.experience.length > 0) ||
          (parsedData.education && Array.isArray(parsedData.education) && parsedData.education.length > 0) ||
          (parsedData.skills && Array.isArray(parsedData.skills) && parsedData.skills.length > 0) ||
          (parsedData.languages && Array.isArray(parsedData.languages) && parsedData.languages.length > 0) ||
          (parsedData.courses && Array.isArray(parsedData.courses) && parsedData.courses.length > 0) ||
          (parsedData.projects && Array.isArray(parsedData.projects) && parsedData.projects.length > 0) ||
          (parsedData.achievements && Array.isArray(parsedData.achievements) && parsedData.achievements.length > 0)
        );
        
        console.log('📝 Any data check:', hasAnyData);
        
        if (hasAnyData) {
          return true;
        }
      }
    } catch (error) {
      console.warn('⚠️ Erro ao verificar localStorage:', error);
    }
    
    console.log('❌ Nenhum dado válido encontrado');
    return false;
  };

  // 🔧 CORREÇÃO CRÍTICA: Retornar ao currículo com validação de template premium
  const handleReturnToResume = () => {
    console.log('🔍 DEBUG - Voltando ao editor');
    console.log('📋 Template selecionado:', state.selectedTemplate);

    // 🚨 VALIDAÇÃO: Se template premium estiver selecionado, avisar
    if (state.selectedTemplate && state.selectedTemplate.isPremium) {
      const hasAccess = checkPremiumAccess(state.selectedTemplate);

      if (!hasAccess) {
        // Template premium não comprado - mostrar aviso
        const confirmed = window.confirm(
          `⚠️ Atenção!\n\n` +
          `Você selecionou o template premium "${state.selectedTemplate.name}".\n\n` +
          `Para continuar editando com este template, você precisa comprá-lo por R$ ${(state.selectedTemplate.price || 4.90).toFixed(2)}.\n\n` +
          `Deseja:\n` +
          `• OK = Comprar template premium agora\n` +
          `• Cancelar = Continuar com template gratuito`
        );

        if (confirmed) {
          // Abrir dialog de pagamento
          setSelectedTemplateForPayment(state.selectedTemplate);
          setPaymentDialogOpen(true);
          return; // Não navegar ainda
        } else {
          // Usuário escolheu template gratuito - selecionar o primeiro gratuito
          const firstFreeTemplate = allTemplates.find(t => !t.isPremium);
          if (firstFreeTemplate) {
            selectTemplate(firstFreeTemplate.id);
            console.log('🎁 Template alterado para gratuito:', firstFreeTemplate.name);
          }
        }
      }
    }

    // 🔧 CORREÇÃO: NÃO sobrescrever localStorage - os dados JÁ estão lá
    // O CurriculumContext carrega automaticamente do localStorage
    console.log('✅ Navegando para editor - Context carregará dados automaticamente');

    // Limpar flag de completude para permitir edição
    localStorage.removeItem('cvgratis-curriculum-completed');

    // Navegar de volta para criar currículo
    navigate('/criar-curriculo');
  };

  // 🔧 NOVO: Loading state enquanto aguarda dados carregarem
  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">Carregando seu currículo...</p>
          <p className="text-sm text-gray-500 mt-2">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  // Loading/No Data state
  if (!hasValidData()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Complete seu currículo primeiro
          </h2>
          <p className="text-gray-600 mb-6">
            Para escolher um template, você precisa preencher pelo menos seus dados pessoais.
          </p>
          <Button onClick={() => navigate('/criar-curriculo')}>
            Preencher Dados
          </Button>
        </div>
        {/* 🔧 CORREÇÃO: UserDataCollector para pop-ups de coleta */}
        {/* <UserDataCollector
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={async (userData: any) => {
            console.log('🔍 SUBMIT DEBUG - Dados do usuário:', userData);
            console.log('🎯 Action type:', actionType);
            try {
              await userDataService.saveUser(userData, actionType);
              toast.success(`Obrigado, ${userData.name}! Seus dados foram salvos.`);
              handleUserDataSubmit(userData);
            } catch (error) {
              console.error('❌ Erro ao salvar:', error);
              toast.error('Erro ao salvar dados.');
            }
          }}
          actionType={actionType}
          templateType="free"
        /> */}
      </div>
    );
  }


    const handleTemplateSelect = (templateId: string) => {
    const template = AVAILABLE_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    if (template.isPremium && !state.isPremiumUnlocked) {
      alert(`Template Premium ${template.name} - R$ ${template.price?.toFixed(2)}\n\nEm breve: integração com pagamento!`);
      unlockPremium();
    }
    selectTemplate(templateId);
  };

  const handleCarouselDownload = async (templateId: string) => {
    const template = AVAILABLE_TEMPLATES.find(t => t.id === templateId);
    
    if (!template) return;
    
    console.log('🎠 CARROSSEL DOWNLOAD - Template:', template.name, 'Premium:', template.isPremium);
    
    const executeDownload = async () => {
      // Temporariamente selecionar o template
      const originalSelected = state.selectedTemplate.id;
      selectTemplate(templateId);
      
      setTimeout(async () => {
        await handleDownload(template);
        // Voltar para o template original
        if (originalSelected !== templateId) {
          selectTemplate(originalSelected);
        }
      }, 100);
    };

    // 🔧 CORREÇÃO: Verificar se é template gratuito
    if (template.isPremium) {
      console.log('🔑 Carrossel: Template premium - executando direto');
      executeDownload();
    } else {
      // Se for gratuito, SEMPRE solicita dados do usuário
      console.log('🎁 Carrossel: Template gratuito - abrindo pop-up');
      setPendingAction(() => executeDownload);
      setCurrentActionType('download');
      setUserDataModalOpen(true);
    }
  };

  const checkPremiumAccess = (template: Template): boolean => {
    if (!template.isPremium) return true;

    // 👑 ADMIN: Acesso total para administradores
    if (isAdmin) {
      console.log('👑 ADMIN: Acesso liberado para template', template.id);
      return true;
    }

    // 🚨 SOLUÇÃO DEFINITIVA: Sistema de acesso 100% independente
    const purchased1 = localStorage.getItem(`template_purchased_${template.id}`) === 'true';
    const purchased2 = localStorage.getItem(`premium_access_${template.id}`) === 'true';
    const hasAccess = purchased1 || purchased2;
    console.log('💳 ACESSO INDEPENDENTE: Template', template.id, 'liberado?', hasAccess);
    return hasAccess;
  };

  const handlePremiumAction = (template: Template, action: () => void) => {
    if (checkPremiumAccess(template)) {
      action();
    } else {
      setSelectedTemplateForPayment(template);
      setPaymentDialogOpen(true);
    }
  };

  const handleDownload = async (template?: Template) => {
    const targetTemplate = template || state.selectedTemplate;
    
    if (!targetTemplate) {
      toast.error('Nenhum template selecionado');
      return;
    }

    const executeDownload = async () => {
      setIsExporting(true);
      try {
        console.log('🔍 EXECUTANDO DOWNLOAD:', targetTemplate.name, 'Premium:', targetTemplate.isPremium);
        
        const pdfService = new PDFExportService();
        const result = await pdfService.exportTemplate(targetTemplate);

        if (result.success) {
          // 🎯 Marcar download como completo
          completion.markDownloadComplete();
          toast.success('✅ Download completo! ' + (completion.state.printCompleted ? '' : 'Não esqueça de imprimir'));
        } else {
          throw new Error(result.error || 'Erro ao gerar PDF');
        }
      } catch (error) {
        console.error('Erro ao exportar PDF:', error);
        toast.error('Erro ao baixar PDF. Tente novamente.');
      } finally {
        setIsExporting(false);
      }
    };

    // 🔧 CORREÇÃO: Verificar se é template gratuito
    console.log('🔍 DEBUG DOWNLOAD - Template:', targetTemplate.name, 'Premium:', targetTemplate.isPremium);
    
    // Se for premium, executa direto
    if (targetTemplate.isPremium) {
      console.log('🔑 Template premium - executando direto ou solicitando pagamento');
      handlePremiumAction(targetTemplate, executeDownload);
    } else {
      // Se for gratuito, verificar se já tem dados salvos
      if (hasUserDataSaved()) {
        executeDownload();
      } else {
        console.log('🎁 Template gratuito - abrindo pop-up de coleta');
        setPendingAction(() => executeDownload);
        setCurrentActionType('download');
        setUserDataModalOpen(true);
      }
    }
  };

  const handlePrint = async () => {
    if (!state.selectedTemplate) {
      toast.error('Nenhum template selecionado');
          return;
        }

    const executePrint = async () => {
      setIsPrinting(true);
      try {
        await PrintService.printTemplate();

        // 🎯 Marcar impressão como completa
        completion.markPrintComplete();
        toast.success('✅ Impressão completa! ' + (completion.state.downloadCompleted ? '' : 'Não esqueça de baixar o PDF'));
      } catch (error) {
        console.error('Erro ao imprimir:', error);
        toast.error('Erro ao imprimir. Tente novamente.');
      } finally {
        setIsPrinting(false);
      }
    };

    console.log('🔍 DEBUG PRINT - Template:', state.selectedTemplate.name, 'Premium:', state.selectedTemplate.isPremium);

    // Se for premium, executa direto
    if (state.selectedTemplate.isPremium) {
      handlePremiumAction(state.selectedTemplate, executePrint);
    } else {
      // Se for gratuito, verificar se já tem dados salvos
      if (hasUserDataSaved()) {
        executePrint();
      } else {
        console.log('🎁 Template gratuito - abrindo pop-up para print');
        setPendingAction(() => executePrint);
        setCurrentActionType('print');
        setUserDataModalOpen(true);
      }
    }
  };

  // Função handleSendEmail removida para simplicidade

  // Função handleWhatsApp removida para simplicidade

  // 🎯 Handlers do sistema de conclusão
  const handleConfirmClean = () => {
    console.log('🧹 Limpando todos os dados...');

    // Limpar dados do completion tracker
    completion.clear();

    // Limpar TODOS os dados do currículo
    const success = clearAllData();

    if (success) {
      toast.success('Dados limpos com sucesso! Voltando para página inicial...');
      setCompletionModalOpen(false);

      // Aguardar um pouco e redirecionar
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      toast.error('Erro ao limpar dados. Tente novamente.');
    }
  };

  const handleReviewAgain = () => {
    console.log('🔄 Usuário quer revisar novamente');
    completion.reset();
    setCompletionModalOpen(false);
    toast.info('Você pode fazer novos downloads e impressões');
  };

  const handlePaymentSuccess = () => {
    toast.success('Template desbloqueado! Você pode usar todas as funcionalidades.');
    // Atualizar a interface se necessário
  };

  const handleUserDataSubmit = async (userData: any) => {
    try {
      // 🔧 VALIDAR DADOS OBRIGATÓRIOS
      if (!userData.name || !userData.email || !userData.whatsapp) {
        toast.error('Todos os campos são obrigatórios!');
        return;
      }

      // 🚨 CORREÇÃO CRÍTICA: Debug detalhado para rastrear salvamento
      console.log('🔍 ADMIN DEBUG - Tentando salvar dados:', userData);
      console.log('🎯 Action type:', currentActionType);
      
      const result = await userDataService.saveUser(userData, currentActionType);
      console.log('✅ ADMIN DEBUG - Resultado salvamento:', result);

      // 🔧 SALVAR NO LOCALSTORAGE PARA EVITAR POPUP DUPLO
      localStorage.setItem('cv-user-data', JSON.stringify(userData));
      
      toast.success(`Obrigado, ${userData.name}! Seus dados foram salvos.`);
      
      // 🚨 CORREÇÃO: Verificar se dados foram realmente salvos
      const database = userDataService.getDatabase();
      
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
      toast.error('Erro ao salvar dados.');
    } finally {
      setUserDataModalOpen(false);
      setUserFormData({ name: '', email: '', whatsapp: '' });
    }
  };

  // 📱 Função para abrir preview mobile
  const handleOpenPreview = (template: Template) => {
    setPreviewTemplate(template);
    setMobilePreviewOpen(true);
  };

  const handleUserDataModalClose = () => {
    setUserDataModalOpen(false);
    setPendingAction(null);
    setUserFormData({ name: '', email: '', whatsapp: '' });
  };


    return (
    <div className="h-screen bg-gradient-hero-subtle overflow-hidden">
      {/* Badge flutuante de conclusão */}
      <CompletionBadgeWithTooltip
        downloadCompleted={completion.state.downloadCompleted}
        printCompleted={completion.state.printCompleted}
        isComplete={completion.isComplete}
        onClick={() => setCompletionModalOpen(true)}
      />

      {/* Header Hero - Premium 2025 */}
      <div className="px-4 py-3 lg:py-6 bg-white/95 backdrop-blur-sm shadow-md border-b">
        <div className="flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto gap-3">
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <Button
              variant="outline"
              onClick={handleReturnToResume}
              className="flex items-center gap-2 text-xs lg:text-sm hover-lift"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Voltar ao Editor</span>
              <span className="sm:hidden">Voltar</span>
            </Button>
          </div>

          <div className="text-center w-full lg:w-auto">
            <Badge className="mb-2 bg-gradient-premium text-white text-xs px-3 py-1">
              ✨ 12 Templates Profissionais
            </Badge>
            <h1 className="text-xl lg:text-2xl font-bold text-slate-800 mb-1">
              Templates de <span className="text-gradient">Currículo Premium</span>
            </h1>
            <p className="text-xs lg:text-sm text-slate-600">
               {(() => {
                 // Tentar pegar nome do context primeiro
                 if (curriculumState.data.personalInfo.name) {
                   return `Olá, ${curriculumState.data.personalInfo.name}!`;
                 }
                 
                 // Se não, tentar pegar do currículo finalizado
                 const finalizedCurriculum = localStorage.getItem('cvgratis-curriculum-finalized');
                 if (finalizedCurriculum) {
                   try {
                     const parsedData = JSON.parse(finalizedCurriculum);
                     if (parsedData.personalInfo?.name) {
                       return `Olá, ${parsedData.personalInfo.name}!`;
                     }
                   } catch (error) {
                     console.warn('Erro ao processar currículo finalizado:', error);
                   }
                 }
                 
                 return 'Complete seus dados primeiro';
               })()}
             </p>
            
            {/* Seção Saiba Mais */}
            <div className="flex items-center justify-center gap-3 mt-3 p-3 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-lg border border-blue-200 animate-pulse-glow">
              <span className="text-xs text-blue-700 font-bold animate-bounce">💡 Saiba mais:</span>
              
              {/* Template Gratuito */}
              <button
                onClick={() => setFreeInfoModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1 bg-green-50 hover:bg-green-100 border border-green-200 rounded-full text-xs font-medium text-green-700 transition-all duration-300 hover:scale-105 hover:shadow-md animate-shimmer-green"
              >
                <Gift className="w-3 h-3" />
                Gratuito
              </button>
              
              {/* Template Premium */}
              <button
                onClick={() => setPremiumInfoModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 border border-yellow-200 rounded-full text-xs font-medium text-yellow-700 transition-all duration-300 hover:scale-105 hover:shadow-md animate-shimmer-gold"
              >
                <Crown className="w-3 h-3" />
                Premium
              </button>
            </div>
          </div>

          <div className="hidden lg:block w-28" />
              </div>
            </div>

      {/* Layout principal - duas colunas */}
      <div className="flex flex-col lg:flex-row h-full mx-auto">
        {/* COLUNA ESQUERDA - Templates e Ações */}
        <div className="w-full lg:w-72 bg-white lg:border-r shadow-sm templates-sidebar overflow-y-auto lg:overflow-visible">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Templates Disponíveis</h2>
            <p className="text-sm text-gray-600">Selecione um template abaixo</p>
          </div>

          {/* 🆕 FASE 3A - Barra de busca e filtros */}
          <div className="p-4 space-y-3 border-b bg-white">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>

            {/* Filtros Pills Premium */}
            <div className="flex gap-2">
              <Button
                variant={selectedLevel === 'all' ? 'blue' : 'outline'}
                size="sm"
                onClick={() => setSelectedLevel('all')}
                className="flex-1 text-xs rounded-full"
              >
                <Target className="w-3 h-3 mr-1" />
                Todos ({allTemplates.length})
              </Button>
              <Button
                variant={selectedLevel === 'free' ? 'emerald' : 'outline'}
                size="sm"
                onClick={() => setSelectedLevel('free')}
                className="flex-1 text-xs rounded-full"
              >
                <Gift className="w-3 h-3 mr-1" />
                Grátis ({filteredTemplates.filter(t => !t.isPremium).length})
              </Button>
              <Button
                variant={selectedLevel === 'premium' ? 'premium' : 'outline'}
                size="sm"
                onClick={() => setSelectedLevel('premium')}
                className="flex-1 text-xs rounded-full"
              >
                <Crown className="w-3 h-3 mr-1" />
                Premium ({filteredTemplates.filter(t => t.isPremium).length})
              </Button>
            </div>

            {/* Favoritos toggle */}
            <Button
              variant={showOnlyFavorites ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className="w-full text-xs"
            >
              <Heart className={`w-3 h-3 mr-1 ${showOnlyFavorites ? 'fill-current' : ''}`} />
              {showOnlyFavorites ? 'Mostrando Favoritos' : 'Mostrar Favoritos'}
              {favorites.length > 0 && ` (${favorites.length})`}
            </Button>
          </div>

          <div className="overflow-y-auto h-full pb-20" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                {/* Templates Filtrados */}
            <div className="p-4">
              {filteredTemplates.filter(t => !t.isPremium).length > 0 && (
                <>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Templates Gratuitos ({filteredTemplates.filter(t => !t.isPremium).length})
                  </h3>
                  <div className="space-y-3">
                    {filteredTemplates.filter(t => !t.isPremium).map((template) => (
                      <div
                        key={template.id}
                        onClick={() => handleTemplateSelect(template.id)}
                        className={`
                          relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 group hover-lift shadow-card hover:shadow-card-hover
                          ${state.selectedTemplate?.id === template.id
                            ? 'border-emerald-500 bg-emerald-50 shadow-emerald transform scale-[1.02]'
                            : 'border-slate-200 bg-white hover:border-emerald-300'
                          }
                        `}
                      >
                        {/* Badge Grátis */}
                        <div className="absolute -top-2 -right-2">
                          <Badge variant="emerald" className="text-xs px-2 py-0.5">
                            <Gift className="w-3 h-3 mr-1" />
                            Grátis
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between mb-2 mt-2">
                          <div className="flex items-center gap-2 flex-1">
                            <h4 className="font-semibold text-slate-800 text-sm">{template.name}</h4>
                          </div>
                          <div className="flex items-center gap-1">
                            <TemplateFavoriteButton
                              templateId={template.id}
                              isFavorite={isFavorite(template.id)}
                              onToggle={toggleFavorite}
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                            />
                            {state.selectedTemplate?.id === template.id && (
                              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse ml-1"></div>
                            )}
                          </div>
                        </div>
                    <p className="text-xs text-slate-600 mb-3">{template.description}</p>

                    {/* Botão de preview sempre visível no mobile */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenPreview(template);
                      }}
                      className="lg:hidden w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-3 rounded-lg text-xs font-semibold transition-all hover:shadow-lg mb-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Ver Preview
                    </button>

                    {/* Ações para template gratuito selecionado */}
                    {state.selectedTemplate?.id === template.id && (
                      <div className="space-y-2 mt-3 pt-3 border-t border-emerald-200">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload();
                            }}
                            disabled={isExporting}
                            className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-3 rounded-lg text-xs font-semibold transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isExporting ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Download className="w-3 h-3" />
                            )}
                            {isExporting ? 'Gerando...' : 'Baixar PDF'}
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrint();
                            }}
                            disabled={isPrinting}
                            className="flex items-center justify-center gap-1 bg-emerald-600 text-white py-2 px-2 rounded-lg text-xs font-semibold transition-all hover:bg-emerald-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isPrinting ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Printer className="w-3 h-3" />
                            )}
                            Imprimir
                          </button>
                        </div>
                      </div>
                    )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

                {/* Templates Premium */}
            {filteredTemplates.filter(t => t.isPremium).length > 0 && (
              <div className="p-4 border-t bg-gradient-to-br from-violet-50 to-purple-50">
                <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-violet-600" />
                  Templates Premium ({filteredTemplates.filter(t => t.isPremium).length})
                </h3>
                <div className="space-y-3">
                  {filteredTemplates.filter(t => t.isPremium).map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template.id)}
                      className={`
                        relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 group hover-lift shadow-card hover:shadow-premium
                        ${state.selectedTemplate?.id === template.id
                          ? 'border-violet-500 bg-violet-50 shadow-premium transform scale-[1.02]'
                          : 'border-violet-200 bg-white hover:border-violet-400'
                        }
                      `}
                    >
                      {/* Badge Premium Absoluto */}
                      <div className="absolute -top-2 -right-2">
                        <Badge variant="premium" className="text-xs px-2 py-0.5 relative overflow-hidden">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                          {/* Shimmer effect */}
                          <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between mb-2 mt-2">
                        <div className="flex items-center gap-2 flex-1">
                          <h4 className="font-semibold text-slate-800 text-sm">{template.name}</h4>
                        </div>
                        <div className="flex items-center gap-1">
                          <TemplateFavoriteButton
                            templateId={template.id}
                            isFavorite={isFavorite(template.id)}
                            onToggle={toggleFavorite}
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                          />
                          {state.selectedTemplate?.id === template.id && (
                            <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse ml-1"></div>
                          )}
                        </div>
                      </div>
                    <p className="text-xs text-slate-600 mb-3">{template.description}</p>

                    {/* Botão de preview sempre visível no mobile */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenPreview(template);
                      }}
                      className="lg:hidden w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white py-2 px-3 rounded-lg text-xs font-semibold transition-all hover:shadow-lg mb-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Ver Preview Premium
                    </button>

                    {/* Preço e ação para template premium */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400 line-through">R$ 29,90</p>
                        <span className="text-lg font-bold text-violet-700">
                          R$ {(template.price || 4.90).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      {checkPremiumAccess(template) && (
                        <Badge variant="success" className="text-xs">
                          <Check className="w-3 h-3 mr-1" />
                          Desbloqueado
                        </Badge>
                      )}
              </div>

                    {/* Ações para template premium selecionado */}
                    {state.selectedTemplate?.id === template.id && (
                      <div className="space-y-2 mt-3 pt-3 border-t border-violet-200">
                        {/* Template premium: SEMPRE mostrar apenas botão de compra */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTemplateForPayment(template);
                            setPaymentDialogOpen(true);
                          }}
                          className="w-full flex items-center justify-center gap-2 bg-gradient-premium text-white py-2.5 px-3 rounded-lg text-xs font-semibold transition-all shadow-premium hover:shadow-lg hover:scale-105"
                        >
                          <Crown className="w-4 h-4" />
                          Comprar Premium - R$ {(template.price || 4.90).toFixed(2).replace('.', ',')}
                        </button>
                      </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mensagem quando não há resultados */}
            {filteredTemplates.length === 0 && (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-2">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Nenhum template encontrado
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {showOnlyFavorites
                    ? 'Você ainda não tem favoritos. Clique no coração nos templates para adicioná-los.'
                    : 'Tente ajustar os filtros ou a busca.'}
                </p>
                {(searchQuery || selectedLevel !== 'all' || showOnlyFavorites) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedLevel('all');
                      setShowOnlyFavorites(false);
                    }}
                  >
                    Limpar Filtros
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* COLUNA DIREITA - Preview do Currículo */}
        <div className="flex-1 bg-gray-50 preview-container overflow-y-auto"
             style={{ maxHeight: 'calc(100vh - 60px)' }}>
          <div className="px-2 py-4 pb-20">
                                                     {state.selectedTemplate && (curriculumState.data.personalInfo.name || localStorage.getItem('cvgratis-curriculum-finalized')) ? (
               <div id="template-preview-container" className="bg-white rounded-lg shadow-lg mb-10" style={{ minHeight: 'fit-content', height: 'auto' }}>
                 <TemplateRenderer
                   template={state.selectedTemplate}
                   className="pointer-events-none"
                   forExport={true}
                   />
                 </div>
             ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-200 max-w-md">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ArrowLeft className="w-8 h-8 text-blue-600" />
                    </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Complete seu currículo primeiro
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Preencha suas informações para visualizar como ficará nos templates
                    </p>
                    <Button 
                    onClick={() => navigate('/criar-curriculo')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Voltar ao Editor
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs - EmailDialog removido para simplicidade */}

      {selectedTemplateForPayment && (
        <PaymentDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          template={selectedTemplateForPayment}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Modal de Coleta de Dados do Usuário */}
      {userDataModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {currentActionType === 'download' ? 'Dados para Download' : 'Dados para Impressão'}
              </h3>
              <button onClick={handleUserDataModalClose} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                id="name"
                value={userFormData.name}
                onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Seu nome"
                required
              />
              </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={userFormData.email}
                onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="seu.email@exemplo.com"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp
              </label>
              <input
                type="tel"
                id="whatsapp"
                value={userFormData.whatsapp}
                onChange={(e) => setUserFormData({ ...userFormData, whatsapp: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="(11) 99999-9999"
                required
              />
      </div>
            <Button onClick={() => handleUserDataSubmit(userFormData)} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              {currentActionType === 'download' ? 'Baixar PDF' : 'Imprimir'}
                    </Button>
                  </div>
                </div>
              )}

      {/* JobIA Chat - Especialista em RH */}
      {/* <JobAIChat
        open={jobAIChatOpen}
        onOpenChange={setJobAIChatOpen}
      /> */}

      {/* Dev Mode Panel - Apenas em desenvolvimento */}
      {/* <DevModePanel /> */}

      {/* Modal Template Gratuito */}
      {freeInfoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Gift className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Template Gratuito</h3>
              </div>
              <button 
                onClick={() => setFreeInfoModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Criação Rápida e Gratuita
                </h4>
                <p className="text-green-700 text-sm">
                  Crie um currículo profissional de qualidade em minutos, sem custo algum!
                </p>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Design profissional e moderno</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Download em PDF de alta qualidade</span>
                    </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Pronto para impressão</span>
                    </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Adequado para recrutadores</span>
                    </div>
                  </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 text-center">
                  💡 <strong>Dica:</strong> Perfeito para quem precisa de um currículo rápido e profissional!
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setFreeInfoModalOpen(false)}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Entendi!
            </button>
          </div>
        </div>
      )}

      {/* Modal Template Premium */}
      {premiumInfoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Template Premium</h3>
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                  R$ 4,90
                </Badge>
              </div>
              <button 
                onClick={() => setPremiumInfoModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
        </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Configuração Avançada + IA Especializada
                </h4>
                <p className="text-yellow-700 text-sm">
                  Maximize suas chances com tecnologia de ponta por apenas <strong>R$ 4,90</strong>!
                </p>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <BrainCircuit className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span><strong>IA Especializada:</strong> Otimiza seu currículo automaticamente</span>
                </div>
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Configurações Avançadas:</strong> Personalização completa</span>
                </div>
                <div className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Nota de Qualidade:</strong> Análise detalhada do seu currículo</span>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Pontos de Melhoria:</strong> Sugestões para destacar-se</span>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Carta de Apresentação com IA:</strong> Geração automática personalizada</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg border border-green-200">
                <p className="text-xs text-gray-700 text-center">
                  🚀 <strong>Resultado:</strong> Currículo que chama atenção de recrutadores e aumenta suas chances de contratação!
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">R$ 4,90</div>
                <div className="text-xs text-gray-500">Investimento único para sua carreira</div>
              </div>
            </div>
            
            <button 
              onClick={() => setPremiumInfoModalOpen(false)}
              className="w-full mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-all shadow-md"
            >
              Quero Conhecer!
            </button>
      </div>
        </div>
      )}

      {/* Modal de conclusão */}
      <CompletionModal
        open={completionModalOpen}
        onOpenChange={setCompletionModalOpen}
        completedActions={completion.completedActions}
        pendingActions={completion.pendingActions}
        isComplete={completion.isComplete}
        onConfirmClean={handleConfirmClean}
        onReview={handleReviewAgain}
        onContinue={() => setCompletionModalOpen(false)}
      />

      {/* Modal de preview mobile */}
      {mobilePreviewOpen && previewTemplate && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-2">
          <div className="bg-white rounded-lg w-full h-full max-w-[95vw] max-h-[95vh] flex flex-col">
            {/* Header do modal */}
            <div className="flex items-center justify-between p-3 border-b shrink-0">
              <h3 className="text-base font-semibold text-gray-800">
                Preview: {previewTemplate.name}
              </h3>
              <button
                onClick={() => setMobilePreviewOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Fechar preview"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Conteúdo do preview */}
            <div className="flex-1 overflow-auto bg-gray-100">
              <div className="w-full min-h-full flex justify-center py-1 px-1">
                <div
                  className="bg-white shadow-lg w-full"
                  style={{
                    maxWidth: '210mm',
                    minHeight: '297mm'
                  }}
                >
                  <TemplateRenderer
                    template={previewTemplate}
                    data={curriculumState.data}
                  />
                </div>
              </div>
            </div>

            {/* Footer do modal */}
            <div className="p-3 border-t shrink-0">
              <button
                onClick={() => setMobilePreviewOpen(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors text-sm"
              >
                Fechar Preview
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    );
  }

export default function TemplateSelector() {
  return (
    <CombinedProvider>
      <TemplateSelectorContent />
    </CombinedProvider>
  );
}
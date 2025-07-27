import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { CombinedProvider } from '@/contexts/CombinedProvider';
import { useTemplate } from '@/contexts/TemplateContext';
import { useCurriculumData } from '@/hooks/useCurriculumData';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';
import { TemplateCarousel } from '@/components/templates/TemplateCarousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, Download, ArrowLeft, Loader2, Printer, Mail, Lock, BrainCircuit, X, FileText } from 'lucide-react';
import { AVAILABLE_TEMPLATES, Template } from '@/types/templates';
import { PDFExportService } from '@/services/pdfExportService';
import { PrintService } from '@/services/printService';
// import { StripeService } from '@/services/stripeService'; // 🚨 REMOVIDO
import { EmailDialog } from '@/components/ui/email-dialog';
import { PaymentDialog } from '@/components/ui/payment-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

// import { JobAIChat } from '@/components/ui/jobai-chat-fixed'; // 🚨 REMOVIDO DEFINITIVAMENTE
import { toast } from 'sonner';

// Importar sistema de coleta de dados
import { userDataService } from '@/services/userDataService';

function TemplateSelectorContent() {
  console.log('🔍 TemplateSelector: Componente iniciando...');

  const [, setLocation] = useLocation();
  const { state, selectTemplate, unlockPremium } = useTemplate();
  const { data } = useCurriculumData();
  const [isExporting, setIsExporting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedTemplateForPayment, setSelectedTemplateForPayment] = useState<Template | null>(null);
  // const [jobAIChatOpen, setJobAIChatOpen] = useState(false); // 🚨 REMOVIDO DEFINITIVAMENTE

  // 🔧 SISTEMA SIMPLES DE COLETA DE DADOS
  const [userDataModalOpen, setUserDataModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [currentActionType, setCurrentActionType] = useState<'download' | 'print' | 'email'>('download');
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  });

  // 🎯 ORGANIZAÇÃO: Gratuitos primeiro, depois Premium
  const allTemplates = [...AVAILABLE_TEMPLATES].sort((a, b) => {
    // Gratuitos primeiro (isPremium = false primeiro)
    if (a.isPremium === b.isPremium) return 0;
    return a.isPremium ? 1 : -1;
  });

  useEffect(() => {
    console.log('🔍 TemplateSelector: useEffect executado');
    console.log('🔍 Estado do template:', state);
    console.log('🔍 Dados do currículo context:', data);

    // 🧹 LIMPAR: Template premium selecionado (usuário está na seleção normal)
    const premiumTemplateSelected = localStorage.getItem('premium-template-selected');
    if (premiumTemplateSelected) {
      localStorage.removeItem('premium-template-selected');
      console.log('🧹 Template premium removido do localStorage:', premiumTemplateSelected);
    }

    // 🔧 DEBUG: Verificar templates disponíveis
    console.log('📋 TEMPLATES DISPONÍVEIS:');
    allTemplates.forEach((template, index) => {
      console.log(`${index + 1}. ${template.name} - Premium: ${template.isPremium}`);
    });

    // Verificar dados no localStorage diretamente
    const personalInfoLS = localStorage.getItem('curriculum-personal-info');
    console.log('💾 TemplateSelector - localStorage check:', personalInfoLS ? 'Dados encontrados' : 'Sem dados');

    // Se não há template selecionado, selecionar o primeiro
    if (!state.selectedTemplate || !state.selectedTemplate.id) {
      console.log('🔍 TemplateSelector: Selecionando template padrão...');
      const defaultTemplate = allTemplates[0];
      if (defaultTemplate) {
        console.log('🎯 Template padrão selecionado:', defaultTemplate.name, 'Premium:', defaultTemplate.isPremium);
        selectTemplate(defaultTemplate.id);
      }
    }
  }, [data, state.selectedTemplate, selectTemplate, allTemplates]);

  // Verificar se temos dados válidos
  const hasValidData = () => {
    // Primeiro verificar no context
    if (data?.personalInfo?.name) {
      return true;
    }

    // Se não, verificar no localStorage
    try {
      const personalInfoLS = localStorage.getItem('curriculum-personal-info');
      if (personalInfoLS) {
        const parsedData = JSON.parse(personalInfoLS);
        return !!(parsedData && parsedData.name);
      }
    } catch (error) {
      console.warn('⚠️ Erro ao verificar localStorage:', error);
    }

    return false;
  };

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
          <Button onClick={() => setLocation('/criar-curriculo')}>
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

  console.log('✅ TemplateSelector: Renderizando com dados válidos...');

  const handleTemplateSelect = (templateId: string) => {
    const template = AVAILABLE_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    console.log('🎯 SELEÇÃO DE TEMPLATE - ANTES:');
    console.log('🎯 Template clicado:', templateId, template.name);
    console.log('🎯 Template atual no contexto:', state.selectedTemplate?.id);
    console.log('🎯 Template no localStorage:', localStorage.getItem('cvgratis-selected-template'));

    if (template.isPremium && !state.isPremiumUnlocked) {
      alert(`Template Premium ${template.name} - R$ ${template.price?.toFixed(2)}\n\nEm breve: integração com pagamento!`);
      unlockPremium();
    }
    selectTemplate(templateId);

    // Verificar após a seleção
    setTimeout(() => {
      console.log('🎯 SELEÇÃO DE TEMPLATE - DEPOIS:');
      console.log('🎯 Template no contexto:', state.selectedTemplate?.id);
      console.log('🎯 Template no localStorage:', localStorage.getItem('cvgratis-selected-template'));
    }, 100);
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
      // 🎯 SOLUÇÃO DEFINITIVA - PREMIUM
      console.log('🎯 TEMPLATE SELECTOR - PREMIUM DETECTADO');
      console.log('🎯 Template ID:', template.id);

      const targetUrl = `/premium-editor?template=${template.id}`;
      console.log('🎯 REDIRECIONAMENTO DEFINITIVO PARA:', targetUrl);

      // SOLUÇÃO DEFINITIVA: REDIRECIONAMENTO GARANTIDO
      try {
        // Método 1: Imediato
        window.location.href = targetUrl;
        console.log('🎯 TEMPLATE SELECTOR - MÉTODO 1 EXECUTADO: href');

        // Método 2: Backup imediato
        setTimeout(() => {
          window.location.replace(targetUrl);
          console.log('🎯 TEMPLATE SELECTOR - MÉTODO 2 EXECUTADO: replace');
        }, 50);

        // Método 3: Último recurso
        setTimeout(() => {
          window.open(targetUrl, '_self');
          console.log('🎯 TEMPLATE SELECTOR - MÉTODO 3 EXECUTADO: open');
        }, 150);

      } catch (error) {
        console.error('🎯 TEMPLATE SELECTOR - ERRO NO REDIRECIONAMENTO:', error);
        // Forçar navegação mesmo com erro
        window.location.href = targetUrl;
      }
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
          toast.success('PDF baixado com sucesso!');
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
      // Se for gratuito, SEMPRE solicita dados do usuário
      console.log('🎁 Template gratuito - abrindo pop-up de coleta');
      setPendingAction(() => executeDownload);
      setCurrentActionType('download');
      setUserDataModalOpen(true);
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
        toast.success('Imprimindo currículo...');
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
      // Se for gratuito, SEMPRE solicita dados do usuário
      console.log('🎁 Template gratuito - abrindo pop-up para print');
      setPendingAction(() => executePrint);
      setCurrentActionType('print');
      setUserDataModalOpen(true);
    }
  };

  const handleSendEmail = async () => {
    if (!state.selectedTemplate) {
      toast.error('Nenhum template selecionado');
      return;
    }

    const executeEmail = () => {
      setEmailDialogOpen(true);
    };

    console.log('🔍 DEBUG EMAIL - Template:', state.selectedTemplate.name, 'Premium:', state.selectedTemplate.isPremium);

    // Se for premium, executa direto
    if (state.selectedTemplate.isPremium) {
      handlePremiumAction(state.selectedTemplate, executeEmail);
    } else {
      // Se for gratuito, SEMPRE solicita dados do usuário
      console.log('🎁 Template gratuito - abrindo pop-up para email');
      setPendingAction(() => executeEmail);
      setCurrentActionType('email');
      setUserDataModalOpen(true);
    }
  };

  // Função para executar ação pendente após coleta de dados
  const executeUserAction = async () => {
    if (!pendingAction) return;

    console.log('🎯 Executando ação pendente:', currentActionType);

    // Salvar dados do usuário
    await userDataService.collectUserData({
      name: userFormData.name,
      email: userFormData.email,
      whatsapp: userFormData.whatsapp,
      action: currentActionType,
      templateId: state.selectedTemplate?.id || 'unknown'
    });

    // Fechar modal
    setUserDataModalOpen(false);

    // Executar ação
    pendingAction();

    // Limpar
    setPendingAction(null);
    setUserFormData({ name: '', email: '', whatsapp: '' });
  };

  const handlePaymentSuccess = () => {
    console.log('🔧 PREMIUM: Pagamento realizado com sucesso!');
    toast.success('Template Premium desbloqueado! Redirecionando para configuração...');

    // 🚀 NOVO FLUXO: Redirecionar direto para configuração premium
    if (selectedTemplateForPayment) {
      setTimeout(() => {
        setLocation(`/premium-editor?template=${selectedTemplateForPayment.id}`);
      }, 1500);
    }
  };

  const handleUserDataSubmit = async (userData: any) => {
    try {
      // 🚨 CORREÇÃO CRÍTICA: Debug detalhado para rastrear salvamento
      console.log('🔍 ADMIN DEBUG - Tentando salvar dados:', userData);
      console.log('🎯 Action type:', currentActionType);

      const result = await userDataService.saveUser(userData, currentActionType);
      console.log('✅ ADMIN DEBUG - Resultado salvamento:', result);

      toast.success(`Obrigado, ${userData.name}! Seus dados foram salvos.`);

      // 🚨 CORREÇÃO: Verificar se dados foram realmente salvos
      const database = userDataService.getDatabase();
      console.log('📊 ADMIN DEBUG - Database após salvamento:', database.length, 'itens');

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

  const handleUserDataModalClose = () => {
    setUserDataModalOpen(false);
    setPendingAction(null);
    setUserFormData({ name: '', email: '', whatsapp: '' });
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={() => setLocation('/criar-curriculo')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Editor
          </Button>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Escolha seu Template
            </h1>
            <p className="text-gray-600 mt-1">
              {data.personalInfo.name ? `Olá, ${data.personalInfo.name}!` : 'Complete seus dados primeiro'}
            </p>
          </div>

          <div className="w-24" /> {/* Spacer for center alignment */}
        </div>

        {/* Template Selecionado e Ações */}
        <div className="max-w-6xl mx-auto">
          {/* Preview do Template Selecionado - Compacto */}
          {state.selectedTemplate && data.personalInfo.name && (
            <Card className="mb-4 shadow-md border-0 bg-white">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-gray-800">
                    {state.selectedTemplate.name}
                  </h2>
                  {state.selectedTemplate.isPremium && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  Preview do seu currículo com o template selecionado
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-center mb-4">
                  <div className="transform scale-40 border rounded-lg shadow-sm">
                    <TemplateRenderer 
                      template={state.selectedTemplate} 
                      className="pointer-events-none"
                      forExport={true}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ações do Currículo */}
          {state.selectedTemplate && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Ações do Currículo
              </h2>

              <div className="flex flex-wrap justify-center gap-4">
                {/* Download PDF */}
                <button
                  onClick={() => handleDownload()}
                  disabled={isExporting}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isExporting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  {isExporting ? 'Gerando PDF...' : 'Baixar PDF'}
                  {state.selectedTemplate.isPremium && !checkPremiumAccess(state.selectedTemplate) && (
                    <Lock className="w-4 h-4" />
                  )}
                </button>

                {/* Print */}
                <button
                  onClick={handlePrint}
                  disabled={isPrinting}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isPrinting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Printer className="w-5 h-5" />
                  )}
                  {isPrinting ? 'Preparando...' : 'Imprimir'}
                  {state.selectedTemplate.isPremium && !checkPremiumAccess(state.selectedTemplate) && (
                    <Lock className="w-4 h-4" />
                  )}
                </button>

                {/* Send Email */}
                <button
                  onClick={handleSendEmail}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Enviar por Email
                  {state.selectedTemplate.isPremium && !checkPremiumAccess(state.selectedTemplate) && (
                    <Lock className="w-4 h-4" />
                  )}
                </button>

                {/* JobIA - Sempre disponível para qualquer template */}
                {/* <button
                  onClick={() => setJobAIChatOpen(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg"
                >
                  <BrainCircuit className="w-5 h-5" />
                  JobIA - Especialista RH
                </button> */}
              </div>

              {/* Premium Notice */}
              {state.selectedTemplate.isPremium && !checkPremiumAccess(state.selectedTemplate) && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
                  <p className="text-amber-800 text-sm">
                    <Lock className="w-4 h-4 inline mr-1" />
                    Este é um template premium. Desbloqueie todas as funcionalidades por apenas R$ {(state.selectedTemplate.price || 4.90).toFixed(2).replace('.', ',')}.
                  </p>
                </div>
              )}

              {/* Notice para templates gratuitos */}
              {!state.selectedTemplate.isPremium && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                  <p className="text-green-800 text-sm font-medium">
                    🎉 Template gratuito! Para usar, precisamos apenas de suas informações básicas (nome, email, WhatsApp) para melhorar nosso serviço.
                  </p>
                  {hasValidData() && ( // Changed from hasUserData to hasValidData
                    <p className="text-green-600 text-xs mt-1">
                      ✅ Seus dados já foram coletados. Pode usar à vontade!
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Galeria de Templates em Carrossel */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <TemplateCarousel
              templates={allTemplates}
              selectedTemplateId={state.selectedTemplate.id}
              onTemplateSelect={handleTemplateSelect}
              onDownload={data.personalInfo.name ? handleCarouselDownload : undefined}
              isExporting={isExporting}
              hasData={!!data.personalInfo.name}
            />
          </div>

          {/* 🚀 SEÇÃO DE MARKETING PREMIUM */}
          <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-xl p-8 shadow-2xl border border-purple-200 mt-8 text-white overflow-hidden relative">
            {/* Elementos decorativos */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-400/20 to-purple-500/20 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 py-2 rounded-full text-sm font-bold mb-4">
                  <Crown className="w-4 h-4" />
                  OFERTA ESPECIAL PREMIUM
                </div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  🚀 Transforme seu Currículo em uma Ferramenta de Sucesso!
                </h2>
                <p className="text-xl text-purple-100 mb-6">
                  Após sua compra, você terá acesso a uma <strong>página exclusiva</strong> onde poderá:
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">⚙️</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-cyan-300">Personalização Total</h3>
                  <p className="text-purple-100 text-sm">
                    Configure cores, fontes, espaçamentos e layout em <strong>tempo real</strong>. Veja as mudanças instantaneamente!
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-emerald-300">Avaliação Profissional</h3>
                  <p className="text-purple-100 text-sm">
                    Receba uma <strong>análise detalhada</strong> do seu currículo com pontos de melhoria e dicas de especialistas em RH.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-pink-300">Resultado Premium</h3>
                  <p className="text-purple-100 text-sm">
                    Currículos que <strong>chamam atenção</strong> dos recrutadores e aumentam suas chances de contratação em até 300%!
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-400/30 rounded-lg p-4 mb-6">
                  <p className="text-yellow-300 font-bold text-lg mb-2">
                    🔥 <span className="animate-pulse">OFERTA LIMITADA</span> 🔥
                  </p>
                  <p className="text-purple-100">
                    <span className="line-through text-gray-400">R$ 19,90</span> 
                    <span className="text-3xl font-bold text-yellow-300 ml-2">R$ 4,90</span>
                    <span className="text-sm text-purple-200 ml-2">(75% de desconto)</span>
                  </p>
                  <p className="text-sm text-red-300 mt-1">⏰ Apenas para os primeiros 100 usuários!</p>
                </div>

                <div className="flex flex-wrap justify-center gap-4 text-sm text-purple-200 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Sem mensalidades</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Acesso vitalício</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Sem watermark</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Suporte especializado</span>
                  </div>
                </div>

                <p className="text-purple-200 text-lg mb-4">
                  👆 <strong>Clique em "Comprar Premium"</strong> em qualquer template acima e seja redirecionado para sua página exclusiva!
                </p>

                <div className="text-xs text-purple-300">
                  💡 Dica: Escolha o template que mais combina com seu perfil e clique em "Comprar Premium" para começar!
                </div>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {!data.personalInfo.name && (
            <div className="text-center py-12">
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 max-w-md mx-auto">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowLeft className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Complete seu currículo primeiro
                </h3>
                <p className="text-gray-600 mb-4">
                  Preencha suas informações para visualizar como ficará nos templates
                </p>
                <Button 
                  onClick={() => setLocation('/criar-curriculo')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Voltar ao Editor
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <EmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        templateId={state.selectedTemplate?.id || ''}
        senderName={data.personalInfo.name || 'Usuário'}
      />

      {selectedTemplateForPayment && (
        <PaymentDialog 
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          template={selectedTemplateForPayment}
          onPaymentSuccess={handlePaymentSuccess}
        />

        {/* Modal de Coleta de Dados do Usuário */}
        <Dialog open={userDataModalOpen} onOpenChange={setUserDataModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Dados para {currentActionType === 'email' ? 'Envio por Email' : 
                          currentActionType === 'download' ? 'Download' : 'Impressão'}
              </DialogTitle>
              <DialogDescription>
                Para continuar, precisamos de alguns dados básicos:
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nome completo *</label>
                <Input 
                  placeholder="Seu nome completo"
                  value={userFormData.name}
                  onChange={(e) => setUserFormData(prev => ({...prev, name: e.target.value}))}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Email *</label>
                <Input 
                  type="email"
                  placeholder="seu@email.com"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData(prev => ({...prev, email: e.target.value}))}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">WhatsApp (opcional)</label>
                <Input 
                  placeholder="(11) 99999-9999"
                  value={userFormData.whatsapp}
                  onChange={(e) => setUserFormData(prev => ({...prev, whatsapp: e.target.value}))}
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border text-sm">
                <p className="font-medium text-blue-800 mb-1">✅ Seus dados estão seguros:</p>
                <p className="text-blue-700">• Não compartilhamos com terceiros</p>
                <p className="text-blue-700">• Usado apenas para melhorar nossos serviços</p>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => setUserDataModalOpen(false)}
                  variant="outline" 
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={executeUserAction}
                  disabled={!userFormData.name || !userFormData.email}
                  className="flex-1"
                >
                  Continuar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      {/* JobIA Chat - Especialista em RH */}
      {/* <JobAIChat
        open={jobAIChatOpen}
        onOpenChange={setJobAIChatOpen}
      /> */}

      {/* Dev Mode Panel - Apenas em desenvolvimento */}

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
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CombinedProvider } from '@/contexts/CombinedProvider';
import { useTemplate } from '@/contexts/TemplateContext';
import { useCurriculumData } from '@/hooks/useCurriculumData';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';
import { TemplateCarousel } from '@/components/templates/TemplateCarousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, Download, ArrowLeft, Loader2, Printer, Mail, Lock, BrainCircuit } from 'lucide-react';
import { AVAILABLE_TEMPLATES, Template } from '@/types/templates';
import { PDFExportService } from '@/services/pdfExportService';
import { PrintService } from '@/services/printService';
import { StripeService } from '@/services/stripeService';
import { EmailDialog } from '@/components/ui/email-dialog';
import { PaymentDialog } from '@/components/ui/payment-dialog';
import { DevModePanel } from '@/components/ui/dev-mode-panel';
import { JobAIChat } from '@/components/ui/jobai-chat';
import { toast } from 'sonner';

// Importar sistema de coleta de dados
import UserDataCollector from '@/components/UserDataCollector';
import { useUserDataCollection } from '@/hooks/useUserDataCollection';
import { userDataService } from '@/services/userDataService';

function TemplateSelectorContent() {
  console.log('🔍 TemplateSelector: Componente iniciando...');
  
  const navigate = useNavigate();
  const { state, selectTemplate, unlockPremium } = useTemplate();
  const { data } = useCurriculumData();
  const [isExporting, setIsExporting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedTemplateForPayment, setSelectedTemplateForPayment] = useState<Template | null>(null);
  const [jobAIChatOpen, setJobAIChatOpen] = useState(false);
  
  const allTemplates = AVAILABLE_TEMPLATES;

  // Sistema de coleta de dados
  const {
    isModalOpen,
    actionType,
    hasUserData,
    requestUserDataIfNeeded,
    handleUserDataSubmit,
    handleModalClose
  } = useUserDataCollection();

  useEffect(() => {
    console.log('🔍 TemplateSelector: useEffect executado');
    console.log('🔍 Estado do template:', state);
    console.log('🔍 Dados do currículo context:', data);
    
    // Verificar dados no localStorage diretamente
    const personalInfoLS = localStorage.getItem('curriculum-personal-info');
    console.log('💾 TemplateSelector - localStorage check:', personalInfoLS ? 'Dados encontrados' : 'Sem dados');
    
    // Se não há template selecionado, selecionar o primeiro
    if (!state.selectedTemplate || !state.selectedTemplate.id) {
      console.log('🔍 TemplateSelector: Selecionando template padrão...');
      const defaultTemplate = allTemplates[0];
      if (defaultTemplate) {
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
          <Button onClick={() => navigate('/criar-curriculo')}>
            Preencher Dados
          </Button>
        </div>
      </div>
    );
  }

  console.log('✅ TemplateSelector: Renderizando com dados válidos...');

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
    const originalSelected = state.selectedTemplate.id;
    const template = AVAILABLE_TEMPLATES.find(t => t.id === templateId);
    
    if (!template) return;
    
    selectTemplate(templateId);
    
    // Aguardar um pouco para a seleção ser processada
    setTimeout(() => {
      const executeDownload = async () => {
        await handleDownload(template);
        // Voltar para o template originalmente selecionado se necessário
        if (originalSelected !== templateId) {
          selectTemplate(originalSelected);
        }
      };

      // Solicitar dados do usuário se for template gratuito
      requestUserDataIfNeeded(executeDownload, 'download', template.isPremium);
    }, 100);
  };

  const checkPremiumAccess = (template: Template): boolean => {
    if (!template.isPremium) return true;
    
    // Verificar se modo desenvolvedor está ativo
    if (StripeService.isDevModeEnabled()) return true;
    
    return StripeService.hasPurchasedTemplate(template.id);
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
        // Salvar dados do usuário se for template gratuito e ainda não salvou
        if (!targetTemplate.isPremium && !hasUserData) {
          console.log('⚠️ Template gratuito sem dados do usuário - isto não deveria acontecer');
        }

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

    // Se for premium, executa direto
    if (targetTemplate.isPremium) {
      handlePremiumAction(targetTemplate, executeDownload);
    } else {
      // Se for gratuito, solicita dados do usuário
      requestUserDataIfNeeded(executeDownload, 'download', false);
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

    // Se for premium, executa direto
    if (state.selectedTemplate.isPremium) {
      handlePremiumAction(state.selectedTemplate, executePrint);
    } else {
      // Se for gratuito, solicita dados do usuário
      requestUserDataIfNeeded(executePrint, 'print', false);
    }
  };

  const handleSendEmail = () => {
    if (!state.selectedTemplate) {
      toast.error('Nenhum template selecionado');
      return;
    }

    const executeEmail = () => {
      setEmailDialogOpen(true);
    };

    // Se for premium, executa direto
    if (state.selectedTemplate.isPremium) {
      handlePremiumAction(state.selectedTemplate, executeEmail);
    } else {
      // Se for gratuito, solicita dados do usuário
      requestUserDataIfNeeded(executeEmail, 'email', false);
    }
  };

  const handlePaymentSuccess = () => {
    console.log('🔧 DEV: Pagamento realizado com sucesso!');
    toast.success('Template desbloqueado! Você pode usar todas as funcionalidades.');
    // Atualizar a interface se necessário
  };

  // Callback quando usuário submete dados
  const handleUserDataSubmitSuccess = async (userData: any) => {
    try {
      // Salvar no banco de dados local
      await userDataService.saveUser(userData, actionType);
      
      toast.success(`Obrigado, ${userData.name}! Seus dados foram salvos com segurança.`);
      
      // Chamar callback original
      handleUserDataSubmit(userData);
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
      toast.error('Erro ao salvar dados. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/criar-curriculo')}
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

                {/* JobIA - Apenas para templates premium */}
                {state.selectedTemplate.isPremium && checkPremiumAccess(state.selectedTemplate) && (
                  <button
                    onClick={() => setJobAIChatOpen(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg"
                  >
                    <BrainCircuit className="w-5 h-5" />
                    JobIA - Especialista RH
                  </button>
                )}
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
                  {hasUserData && (
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
      )}

      {/* Modal de Coleta de Dados do Usuário */}
      <UserDataCollector
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleUserDataSubmitSuccess}
        actionType={actionType}
        templateType={state.selectedTemplate?.isPremium ? 'premium' : 'free'}
      />

      {/* JobIA Chat - Especialista em RH */}
      <JobAIChat
        open={jobAIChatOpen}
        onOpenChange={setJobAIChatOpen}
      />

      {/* Dev Mode Panel - Apenas em desenvolvimento */}
      <DevModePanel />
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
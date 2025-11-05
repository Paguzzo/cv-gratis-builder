import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Loader2, CheckCircle, Lock, Smartphone } from "lucide-react";
import { Template } from "@/types/templates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { STRIPE_PAYMENT_LINK_URL } from "@/utils/stripeConfig";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Template | null;
  onPaymentSuccess: () => void;
}

export function PaymentDialog({ open, onOpenChange, template, onPaymentSuccess }: PaymentDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Se template for nulo, não renderizar o dialog
  if (!template) {
    return null;
  }

  const handleCardPayment = async () => {
    setIsProcessing(true);

    try {
      console.log('💳 PAGAMENTO CARTÃO: Redirecionando para Stripe real:', template.id);

      // 🎯 URL do Stripe Payment Link (configurável via .env)
      const stripeUrl = STRIPE_PAYMENT_LINK_URL;

      // ⚠️ IMPORTANTE: Payment Links do Stripe NÃO aceitam parâmetros via URL
      // As URLs de sucesso/cancelamento devem ser configuradas no Dashboard do Stripe
      // Apenas salvamos o template ID localmente para recuperar após o pagamento

      console.log('🎯 STRIPE: Redirecionando para Payment Link:', stripeUrl);
      console.log('📦 TEMPLATE ID:', template.id);
      console.log('📝 TEMPLATE NOME:', template.name);

      // Salvar dados localmente para quando retornar do Stripe
      const purchaseData = {
        templateId: template.id,
        templateName: template.name,
        price: template.price || 4.90,
        timestamp: Date.now()
      };

      localStorage.setItem('stripe_pending_purchase', JSON.stringify(purchaseData));
      localStorage.setItem('stripe_payment_initiated', 'true');

      console.log('💾 DADOS SALVOS LOCALMENTE:', purchaseData);

      // Fechar modal antes de redirecionar
      onOpenChange(false);

      // Aguardar um momento para garantir que o modal foi fechado
      setTimeout(() => {
        console.log('🚀 STRIPE: Iniciando redirecionamento para Payment Link...');
        // Redirecionar direto para o Payment Link (sem parâmetros adicionais)
        window.location.href = stripeUrl;
      }, 500);

    } catch (error) {
      console.error('❌ Erro no pagamento:', error);
      toast({
        title: "Erro no pagamento",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  const handlePixPayment = async () => {
    setIsProcessing(true);

    try {
      console.log('💚 PAGAMENTO PIX: Gerando código PIX para template:', template.id);

      // Simular geração de código PIX (aqui você integraria com sua API de PIX real)
      await new Promise(resolve => setTimeout(resolve, 1500));

      const pixCode = `00020126580014br.gov.bcb.pix0136${template.id}-${Date.now()}520400005303986540${(template.price || 4.90).toFixed(2)}5802BR5925CVGRATIS TEMPLATES6009SAO PAULO62070503***6304`;

      // Salvar para verificação posterior
      localStorage.setItem('pix_pending_template', template.id);
      localStorage.setItem('pix_code', pixCode);

      toast({
        title: "✅ Código PIX Gerado!",
        description: "Copie o código PIX e realize o pagamento no app do seu banco.",
        duration: 5000
      });

      // Mostrar modal com código PIX
      alert(`Código PIX Copia e Cola:\n\n${pixCode}\n\nApós o pagamento, o template será desbloqueado automaticamente!`);

      onOpenChange(false);

    } catch (error) {
      console.error('❌ Erro ao gerar PIX:', error);
      toast({
        title: "Erro ao gerar PIX",
        description: "Tente novamente ou use cartão de crédito.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'pix') {
      handlePixPayment();
    } else {
      handleCardPayment();
    }
  };

  if (paymentComplete) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px] text-center">
          <div className="flex flex-col items-center gap-4 py-6">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold">Pagamento Aprovado!</h3>
              <p className="text-gray-600 mt-2">
                Redirecionando para o Editor Premium...
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] p-0 overflow-hidden flex flex-col">
        {/* Header com gradiente atraente */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-4 text-white flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-white">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <CreditCard className="w-5 h-5" />
              </div>
              Desbloquear Template Premium
            </DialogTitle>
            <DialogDescription className="text-blue-100 mt-1 text-sm">
              Acesso completo ao editor avançado e recursos exclusivos
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Área de conteúdo com scroll */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Tabs de Método de Pagamento - Design melhorado */}
          <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'card' | 'pix')}>
            <TabsList className="grid w-full grid-cols-2 p-1 bg-gradient-to-r from-gray-100 to-gray-200 h-11">
              <TabsTrigger
                value="card"
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
              >
                <CreditCard className="w-4 h-4" />
                <span className="font-semibold">Cartão</span>
              </TabsTrigger>
              <TabsTrigger
                value="pix"
                className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
              >
                <Smartphone className="w-4 h-4" />
                <span className="font-semibold">PIX</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="card" className="mt-3">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-2.5 rounded-lg border-2 border-blue-200 shadow-sm">
                <p className="text-xs text-blue-900 font-medium flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Pagamento 100% seguro via Stripe
                </p>
                <p className="text-[10px] text-blue-700 mt-0.5">
                  Cartão de crédito ou débito • Aprovação instantânea
                </p>
              </div>
            </TabsContent>

            <TabsContent value="pix" className="mt-3">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-2.5 rounded-lg border-2 border-green-200 shadow-sm">
                <p className="text-xs text-green-900 font-medium flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  Pagamento instantâneo via PIX
                </p>
                <p className="text-[10px] text-green-700 mt-0.5">
                  Aprovação em segundos • Copiar código QR
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Informações do Template - Design melhorado */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200 shadow-sm">
            <h3 className="font-bold text-lg text-gray-800 mb-0.5">{template.name}</h3>
            <p className="text-gray-600 text-xs">{template.description}</p>

            {template.features && template.features.length > 0 && (
              <div className="mt-3">
                <h4 className="font-semibold text-xs mb-2 text-gray-700">✨ Recursos inclusos:</h4>
                <ul className="space-y-1.5">
                  {template.features.map((feature, index) => (
                    <li key={index} className="text-xs text-gray-700 flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Funcionalidades Premium Exclusivas - Design melhorado */}
          <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-lg p-3 border-2 border-purple-200 shadow-md">
            <h4 className="font-bold text-sm mb-2 text-purple-900 flex items-center gap-1.5">
              <div className="p-1 bg-purple-200 rounded">
                🚀
              </div>
              Editor Premium Desbloqueado
            </h4>
            <ul className="space-y-1.5">
              <li className="text-xs text-purple-800 flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-purple-600 mt-0.5 flex-shrink-0" />
                <span><strong>Tipografia Avançada:</strong> Controle total sobre fontes</span>
              </li>
              <li className="text-xs text-purple-800 flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-purple-600 mt-0.5 flex-shrink-0" />
                <span><strong>Paleta de Cores:</strong> Personalize cada detalhe</span>
              </li>
              <li className="text-xs text-purple-800 flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-purple-600 mt-0.5 flex-shrink-0" />
                <span><strong>Avaliação IA:</strong> Feedback inteligente</span>
              </li>
              <li className="text-xs text-purple-800 flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-purple-600 mt-0.5 flex-shrink-0" />
                <span><strong>Preview em Tempo Real:</strong> Mudanças instantâneas</span>
              </li>
            </ul>
          </div>

          {/* Preço - Design melhorado */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg blur opacity-20"></div>
            <div className="relative text-center py-3 border-2 border-green-300 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
              <div className="text-xs text-green-700 font-medium mb-0.5">Investimento único</div>
              <div className="text-3xl font-extrabold text-green-600 mb-0.5">
                R$ {(template.price || 4.90).toFixed(2).replace('.', ',')}
              </div>
              <div className="text-[10px] text-green-600 font-medium">
                Acesso vitalício ao template e editor premium
              </div>
            </div>
          </div>

          {/* Segurança - Design melhorado */}
          <div className="flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-50 rounded-lg border border-gray-200">
            <Lock className="w-4 h-4 text-gray-600" />
            <span className="text-xs font-medium text-gray-700">
              {paymentMethod === 'pix' ? '🔒 Pagamento 100% seguro via PIX' : '🔒 Pagamento via Stripe'}
            </span>
          </div>
        </div>

        {/* Footer com botões melhorados - FIXO NA PARTE INFERIOR */}
        <div className="flex-shrink-0 p-4 bg-white border-t flex gap-2 shadow-lg">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-11 font-semibold border-2 hover:bg-gray-100"
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`flex-1 h-11 font-bold text-sm shadow-lg transition-all ${
              paymentMethod === 'pix'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                {paymentMethod === 'pix' ? 'Gerando PIX...' : 'Processando...'}
              </>
            ) : (
              <>
                {paymentMethod === 'pix' ? (
                  <>
                    <Smartphone className="w-4 h-4 mr-1.5" />
                    Pagar com PIX
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-1.5" />
                    Pagar Agora
                  </>
                )}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
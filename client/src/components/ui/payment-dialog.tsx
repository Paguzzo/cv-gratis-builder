import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
// import { StripeService, PaymentData } from "@/services/stripeService"; // 🚨 REMOVIDO
import { CreditCard, Loader2, CheckCircle, Lock } from "lucide-react";
import { Template } from "@/types/templates";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Template | null;
  onPaymentSuccess: () => void;
}

export function PaymentDialog({ open, onOpenChange, template, onPaymentSuccess }: PaymentDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Se template for nulo, não renderizar o dialog
  if (!template) {
    return null;
  }

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      console.log('💳 PAGAMENTO: Redirecionando para Stripe real:', template.id);
      
      // URL do Stripe real fornecida pelo usuário
      const stripeUrl = 'https://buy.stripe.com/aFa7sMf0t2rl34gaEK2sM00';
      const baseUrl = window.location.origin;
      
      // Configurar URLs de retorno corretas
      const successUrl = `${baseUrl}/premium-editor?template=${template.id}&payment=success`;
      const cancelUrl = `${baseUrl}/templates?payment=cancelled`;
      
      // Parâmetros para o Stripe
      const params = new URLSearchParams({
        'success_url': successUrl,
        'cancel_url': cancelUrl,
        'client_reference_id': `template_${template.id}_${Date.now()}`,
        'metadata[template_id]': template.id,
        'metadata[template_name]': template.name,
        'metadata[source]': 'curriculum_gratis_online'
      });
      
      const finalUrl = `${stripeUrl}?${params.toString()}`;
      
      console.log('🎯 STRIPE: Redirecionando para:', finalUrl);
      console.log('✅ STRIPE: Success URL:', successUrl);
      console.log('❌ STRIPE: Cancel URL:', cancelUrl);
      
      // Salvar dados para quando retornar
      localStorage.setItem('stripe_pending_template', template.id);
      localStorage.setItem('stripe_payment_initiated', 'true');
      localStorage.setItem('stripe_redirect_template', template.id);
      
      // Fechar modal antes de redirecionar
      onOpenChange(false);
      
      // Aguardar um momento para garantir que o modal foi fechado
      setTimeout(() => {
        console.log('🚀 STRIPE: Iniciando redirecionamento...');
        window.location.href = finalUrl;
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
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Desbloquear Template Premium
          </DialogTitle>
          <DialogDescription>
            Para usar este template e suas funcionalidades premium, é necessário fazer o pagamento.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {/* Informações do Template */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-lg">{template.name}</h3>
            <p className="text-gray-600 text-sm mt-1">{template.description}</p>
            
            <div className="mt-4">
              <h4 className="font-medium text-sm mb-2">Recursos inclusos:</h4>
              <ul className="space-y-1">
                {template.features?.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Funcionalidades Premium Exclusivas */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-sm mb-2 text-blue-800">🚀 Acesso ao Editor Premium:</h4>
            <ul className="space-y-1">
              <li className="text-sm text-blue-700 flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-blue-500" />
                Customização de tipografia avançada
              </li>
              <li className="text-sm text-blue-700 flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-blue-500" />
                Paleta de cores personalizada
              </li>
              <li className="text-sm text-blue-700 flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-blue-500" />
                Avaliação inteligente com feedback
              </li>
              <li className="text-sm text-blue-700 flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-blue-500" />
                Preview em tempo real
              </li>
            </ul>
          </div>

          {/* Preço */}
          <div className="text-center py-4 border rounded-lg bg-blue-50">
            <div className="text-2xl font-bold text-blue-600">
              R$ {(template.price || 4.90).toFixed(2).replace('.', ',')}
            </div>
            <div className="text-sm text-gray-600">Pagamento único</div>
          </div>

          {/* Segurança */}
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            Pagamento seguro via Stripe
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handlePayment} 
            disabled={isProcessing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Pagar R$ {(template.price || 4.90).toFixed(2).replace('.', ',')}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
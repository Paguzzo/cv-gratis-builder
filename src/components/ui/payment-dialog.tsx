import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { StripeService, PaymentData } from "@/services/stripeService";
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
  const navigate = useNavigate();

  // Se template for nulo, não renderizar o dialog
  if (!template) {
    return null;
  }

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const paymentData: PaymentData = {
        templateId: template.id,
        templateName: template.name,
        price: template.price || 4.90,
        userId: 'guest', // Em produção, pegar do contexto de usuário
        userEmail: '' // Em produção, pegar do contexto de usuário
      };

      console.log('🔧 DEV: Iniciando pagamento simulado para template:', template.id);
      const result = await StripeService.processTemplatePayment(paymentData);

      if (result.success) {
        setPaymentComplete(true);
        
        toast({
          title: "Pagamento realizado!",
          description: `Template "${template.name}" desbloqueado com sucesso.`,
        });

        console.log('🔧 DEV: =====================================');
        console.log('🔧 DEV: PAGAMENTO BEM-SUCEDIDO!');
        console.log('🔧 DEV: Template ID:', template.id);
        console.log('🔧 DEV: Template Name:', template.name);
        console.log('🔧 DEV: Aguardando 3s antes de redirecionar...');
        console.log('🔧 DEV: =====================================');
        
        // Aguardar um pouco antes de redirecionar para o Premium Editor
        setTimeout(() => {
          console.log('🔧 DEV: Executando callbacks...');
          onPaymentSuccess();
          onOpenChange(false);
          setPaymentComplete(false);
          
          const redirectUrl = `/premium-editor?template=${template.id}`;
          console.log('🔧 DEV: Redirecionando para:', redirectUrl);
          console.log('🔧 DEV: URL atual antes redirect:', window.location.href);
          
          // Usar replace para evitar voltar à página de pagamento
          navigate(redirectUrl, { replace: true });
          
          // Log adicional após tentativa de navegação
          setTimeout(() => {
            console.log('🔧 DEV: URL após tentativa de redirect:', window.location.href);
          }, 100);
        }, 3000);

      } else {
        throw new Error(result.error || 'Erro no pagamento');
      }

    } catch (error) {
      console.error('❌ Erro no pagamento:', error);
      toast({
        title: "Erro no pagamento",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "destructive"
      });
    } finally {
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
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPendingPurchase, confirmPaymentViaWebhook } from '@/utils/stripeConfig';

interface StripeReturnState {
  isReturningFromStripe: boolean;
  paymentStatus: 'success' | 'cancelled' | 'pending' | null;
  purchasedTemplate: string | null;
}

export function useStripeReturn(): StripeReturnState {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<StripeReturnState>({
    isReturningFromStripe: false,
    paymentStatus: null,
    purchasedTemplate: null
  });

  useEffect(() => {
    // Verificar se está retornando do Stripe
    const paymentParam = searchParams.get('payment');
    const sessionId = searchParams.get('session_id');
    
    if (paymentParam || sessionId) {
      console.log('🔄 RETORNANDO DO STRIPE:', { paymentParam, sessionId });
      
      setState(prev => ({
        ...prev,
        isReturningFromStripe: true,
        paymentStatus: paymentParam as 'success' | 'cancelled' || 'pending'
      }));

      // Verificar se há compra pendente
      const pendingPurchase = getPendingPurchase();
      
      if (pendingPurchase && paymentParam === 'success') {
        console.log('✅ PAGAMENTO CONFIRMADO:', pendingPurchase);
        console.log('🎯 TEMPLATE COMPRADO:', pendingPurchase.templateId);
        console.log('📝 TEMPLATE NOME:', pendingPurchase.templateName);
        
        // Confirmar o pagamento
        confirmPaymentViaWebhook(pendingPurchase.templateId);
        
        setState(prev => ({
          ...prev,
          purchasedTemplate: pendingPurchase.templateId
        }));
        
        // Limpar URL (após um pequeno delay para permitir o redirecionamento)
        setTimeout(() => {
          window.history.replaceState(null, '', window.location.pathname);
        }, 500);
      }
      
      // Se cancelado, limpar pendência e notificar usuário
      if (paymentParam === 'cancelled') {
        const pendingData = getPendingPurchase();

        console.log('🚫 PAGAMENTO CANCELADO:', pendingData);

        // Limpar pendência
        localStorage.removeItem('stripe_pending_purchase');

        // Mensagem informativa ao usuário (opcional - pode ser tratado no componente)
        console.log('ℹ️ Você cancelou a compra. Fique à vontade para tentar novamente quando quiser!');

        // Limpar URL (após um pequeno delay para permitir que o componente reaja)
        setTimeout(() => {
          window.history.replaceState(null, '', window.location.pathname);
        }, 500);
      }
    }
  }, [searchParams]);

  return state;
}

export default useStripeReturn;

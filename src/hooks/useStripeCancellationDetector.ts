import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 🚫 Hook que detecta automaticamente quando usuário cancela pagamento no Stripe
 *
 * Funciona verificando se há compra pendente + usuário voltou à página sem session_id
 *
 * **Como funciona:**
 * 1. Detecta quando usuário volta à aba/janela (visibility change)
 * 2. Verifica se há compra pendente no localStorage
 * 3. Verifica se NÃO tem session_id na URL (indicando que não completou)
 * 4. Aguarda 2 segundos para dar tempo do Stripe redirecionar (caso configurado)
 * 5. Se ainda pendente, considera como cancelamento e limpa dados
 *
 * **Uso:**
 * ```tsx
 * function TemplateSelector() {
 *   useStripeCancellationDetector();
 *   // ... resto do código
 * }
 * ```
 */
export function useStripeCancellationDetector() {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se há compra pendente
    const checkForPendingPurchase = () => {
      try {
        return localStorage.getItem('stripe_pending_purchase');
      } catch (error) {
        console.error('❌ Erro ao verificar compra pendente:', error);
        return null;
      }
    };

    const pending = checkForPendingPurchase();

    if (!pending) {
      console.log('ℹ️ Nenhuma compra pendente detectada');
      return;
    }

    console.log('⏳ Compra pendente detectada, monitorando cancelamento...');

    let timeoutId: NodeJS.Timeout;

    // Quando usuário volta ao site (troca de aba)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👀 Usuário voltou à aba - verificando status do pagamento...');

        // Usuário voltou - verificar se completou pagamento
        const urlParams = new URLSearchParams(window.location.search);
        const hasSessionId = urlParams.has('session_id');
        const paymentParam = urlParams.get('payment');

        console.log('🔍 Status da URL:', {
          hasSessionId,
          paymentParam,
          url: window.location.href
        });

        // Se voltou SEM session_id e SEM payment=success, provavelmente cancelou
        if (!hasSessionId && paymentParam !== 'success') {
          console.log('⚠️ Possível cancelamento detectado - aguardando confirmação...');

          // Aguardar 2 segundos para dar tempo do Stripe redirecionar (caso tenha configurado)
          timeoutId = setTimeout(() => {
            const stillPending = checkForPendingPurchase();
            const currentUrlParams = new URLSearchParams(window.location.search);
            const stillNoSession = !currentUrlParams.has('session_id');
            const currentPayment = currentUrlParams.get('payment');

            console.log('🔍 Verificação final:', {
              stillPending: !!stillPending,
              stillNoSession,
              currentPayment,
              willCancel: stillPending && stillNoSession && currentPayment !== 'success'
            });

            if (stillPending && stillNoSession && currentPayment !== 'success') {
              // Confirma que foi cancelamento
              console.log('🚫 CANCELAMENTO CONFIRMADO - Limpando dados...');

              try {
                // Recuperar info da compra antes de limpar
                const purchaseData = JSON.parse(stillPending);
                console.log('📝 Compra cancelada:', purchaseData);

                // Limpar pendência
                localStorage.removeItem('stripe_pending_purchase');
                console.log('✅ Pendência removida do localStorage');

                // Redirecionar ou mostrar mensagem se não estiver já na página correta
                if (!window.location.search.includes('payment=cancelled')) {
                  console.log('🔄 Redirecionando para template-selector com flag de cancelamento...');
                  navigate('/template-selector?payment=cancelled', { replace: true });
                }
              } catch (error) {
                console.error('❌ Erro ao processar cancelamento:', error);
                // Limpar de qualquer forma
                localStorage.removeItem('stripe_pending_purchase');
              }
            } else {
              console.log('✅ Pagamento ainda pode estar em andamento ou foi completado');
            }
          }, 2000);
        } else {
          console.log('✅ Usuário tem session_id ou payment=success - pagamento OK');
        }
      }
    };

    // Também verificar imediatamente ao montar o componente
    const checkImmediately = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hasSessionId = urlParams.has('session_id');
      const paymentParam = urlParams.get('payment');

      // Se estamos na página e já tem payment=cancelled, limpar pendência
      if (paymentParam === 'cancelled') {
        console.log('🚫 Parâmetro payment=cancelled detectado - limpando pendência...');
        localStorage.removeItem('stripe_pending_purchase');
      }

      // Se não tem session_id e não tem payment success, pode ser cancelamento manual
      if (!hasSessionId && paymentParam !== 'success' && pending) {
        console.log('⚠️ Página carregada sem session_id - possível retorno do Stripe');
        // Dar um tempo para o Stripe redirecionar
        timeoutId = setTimeout(() => {
          const stillPending = checkForPendingPurchase();
          const stillNoSession = !new URLSearchParams(window.location.search).has('session_id');

          if (stillPending && stillNoSession) {
            console.log('🚫 Confirmando cancelamento na verificação inicial...');
            localStorage.removeItem('stripe_pending_purchase');
            if (!window.location.search.includes('payment=cancelled')) {
              navigate('/template-selector?payment=cancelled', { replace: true });
            }
          }
        }, 3000); // 3 segundos na verificação inicial
      }
    };

    // Executar verificação imediata
    checkImmediately();

    // Detectar quando usuário volta à aba
    document.addEventListener('visibilitychange', handleVisibilityChange);

    console.log('✅ Detector de cancelamento Stripe ativado');

    return () => {
      console.log('🔌 Detector de cancelamento Stripe desativado');
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [navigate]);
}

export default useStripeCancellationDetector;

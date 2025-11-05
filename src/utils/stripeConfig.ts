// Configuração do Stripe para Templates Premium

export interface StripeProductConfig {
  priceId: string;
  amount: number; // em centavos (490 = R$ 4,90)
}

// Mapeamento de Templates para Produtos Stripe
export const STRIPE_PRODUCTS: Record<string, StripeProductConfig> = {
  'premium-executive': { 
    priceId: 'price_1QOexample1', // Substituir pelos IDs reais do Stripe
    amount: 490 
  },
  'premium-tech': { 
    priceId: 'price_1QOexample2', 
    amount: 490 
  },
  'premium-creative': { 
    priceId: 'price_1QOexample3', 
    amount: 490 
  },
  'premium-minimalist': { 
    priceId: 'price_1QOexample4', 
    amount: 490 
  },
  'premium-pastel': { 
    priceId: 'price_1QOexample5', 
    amount: 490 
  },
  'premium-formal': { 
    priceId: 'price_1QOexample6', 
    amount: 490 
  },
  'premium-professional': { 
    priceId: 'price_1QOexample7', 
    amount: 490 
  }
};

// Configuração do Stripe
export const STRIPE_CONFIG = {
  PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  WEBHOOK_SECRET: import.meta.env.VITE_STRIPE_WEBHOOK_SECRET || '',
  CURRENCY: 'brl',
  COUNTRY: 'BR'
};

// URLs de retorno após pagamento
export const STRIPE_URLS = {
  SUCCESS_URL: `${window.location.origin}/template-selector?payment=success`,
  CANCEL_URL: `${window.location.origin}/template-selector?payment=cancelled`,
  // Link real do Stripe para pagamento premium
  PAYMENT_LINK: 'https://buy.stripe.com/aFa7sMf0t2rl34gaEK2sM00',
  // Webhook para verificar status do pagamento
  WEBHOOK_URL: 'https://compg.app.n8n.cloud/webhook-test/stripe-assinatura'
};

// URL para configuração do template premium
export function getPremiumEditorUrl(templateId: string): string {
  return `/premium-editor?template=${templateId}`;
}

// 🎯 URL REAL DO STRIPE PAYMENT LINK
// Configure sua URL após criar o Payment Link no Dashboard do Stripe
// Ver: QUICK_START_STRIPE.md ou STRIPE_SETUP.md para instruções
export const STRIPE_PAYMENT_LINK_URL = import.meta.env.VITE_STRIPE_PAYMENT_LINK || 'https://buy.stripe.com/aFa7sMf0t2rl34gaEK';

// Verificar se Stripe está configurado
export function isStripeConfigured(): boolean {
  return !!STRIPE_CONFIG.PUBLISHABLE_KEY;
}

// Obter preço formatado
export function getFormattedPrice(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount / 100);
}

// Verificar se template foi comprado
export function isTemplatePurchased(templateId: string): boolean {
  return localStorage.getItem(`stripe_purchased_${templateId}`) === 'true';
}

// Marcar template como comprado
export function markTemplateAsPurchased(templateId: string): void {
  localStorage.setItem(`stripe_purchased_${templateId}`, 'true');
  console.log('✅ Template marcado como comprado:', templateId);
}

// Obter templates comprados
export function getPurchasedTemplates(): string[] {
  return Object.keys(STRIPE_PRODUCTS).filter(templateId => 
    isTemplatePurchased(templateId)
  );
}

// Redirecionar para pagamento real do Stripe
export function redirectToStripePayment(templateId: string, templateName: string): void {
  console.log('💳 REDIRECIONANDO PARA STRIPE REAL:', templateName);
  
  // Salvar dados do template sendo comprado
  localStorage.setItem('stripe_pending_purchase', JSON.stringify({
    templateId,
    templateName,
    timestamp: Date.now()
  }));

  // Redirecionar para o link real do Stripe
  window.location.href = STRIPE_URLS.PAYMENT_LINK;
}

// Verificar se há pagamento pendente
export function getPendingPurchase(): { templateId: string; templateName: string; timestamp: number } | null {
  try {
    const pending = localStorage.getItem('stripe_pending_purchase');
    return pending ? JSON.parse(pending) : null;
  } catch {
    return null;
  }
}

// Confirmar pagamento via webhook (simulação)
export function confirmPaymentViaWebhook(templateId: string): void {
  console.log('✅ PAGAMENTO CONFIRMADO VIA WEBHOOK:', templateId);
  
  // Marcar como comprado
  markTemplateAsPurchased(templateId);
  
  // Remover pendência
  localStorage.removeItem('stripe_pending_purchase');
  
  // Mostrar confirmação
  alert('🎉 Pagamento confirmado! Template premium desbloqueado!');
}

export default {
  STRIPE_PRODUCTS,
  STRIPE_CONFIG,
  STRIPE_URLS,
  isStripeConfigured,
  getFormattedPrice,
  isTemplatePurchased,
  markTemplateAsPurchased,
  getPurchasedTemplates
};

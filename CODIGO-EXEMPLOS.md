# Exemplos de Código - Validação Premium

Exemplos prontos para copiar e colar.

---

## 1. Verificar Acesso no Frontend

### React Component

```typescript
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StripeService } from '@/services/stripeService';
import { toast } from 'sonner';

function PremiumComponent() {
  const [hasAccess, setHasAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      const templateId = 'premium-executive';
      const email = searchParams.get('email') || localStorage.getItem('user-email');

      if (!email) {
        toast.error('Email não fornecido');
        navigate('/template-selector');
        return;
      }

      // Verificar acesso via API server-side
      const result = await StripeService.checkPremiumAccess(templateId, email);

      if (result.hasAccess) {
        setHasAccess(true);
        toast.success('Acesso premium confirmado!');
      } else {
        toast.error('Você não tem acesso a este template');
        navigate('/template-selector');
      }

      setIsChecking(false);
    };

    checkAccess();
  }, []);

  if (isChecking) {
    return <div>Verificando acesso...</div>;
  }

  if (!hasAccess) {
    return <div>Acesso negado</div>;
  }

  return <div>Conteúdo premium liberado!</div>;
}
```

---

## 2. Configurar Stripe Checkout

### stripeService.ts

```typescript
// Atualizar método processTemplatePayment
static async processTemplatePayment(paymentData: PaymentData): Promise<PaymentResult> {
  try {
    if (!this.stripe) {
      await this.initialize();
    }

    if (!this.stripe) {
      throw new Error('Stripe não inicializado');
    }

    const productData = this.STRIPE_PRODUCTS[paymentData.templateId];
    if (!productData) {
      throw new Error(`Produto não encontrado: ${paymentData.templateId}`);
    }

    // Redirecionar para Stripe Checkout
    const { error } = await this.stripe.redirectToCheckout({
      mode: 'payment',
      lineItems: [{
        price: productData.priceId, // Price ID do Stripe Dashboard
        quantity: 1,
      }],
      successUrl: `${window.location.origin}/premium-editor?template=${paymentData.templateId}&email={CUSTOMER_EMAIL}&success=true`,
      cancelUrl: `${window.location.origin}/template-selector?canceled=true`,
      customerEmail: paymentData.userEmail, // Pré-preencher email
      metadata: {
        templateId: paymentData.templateId,
        templateName: paymentData.templateName,
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      paymentIntent: { status: 'redirect_to_checkout' }
    };

  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    return {
      success: false,
      error: error.message || 'Erro ao processar pagamento'
    };
  }
}
```

---

## 3. Processar Webhook do Stripe

### webhooks/stripe.js

```javascript
// Handler personalizado para seu caso de uso
async function handleCheckoutSessionCompleted(session) {
  console.log('✅ Checkout completado:', session.id);

  try {
    const {
      id: sessionId,
      customer_email,
      amount_total,
      currency,
      metadata
    } = session;

    const templateId = metadata?.templateId;
    const templateName = metadata?.templateName || 'Template Premium';

    if (!customer_email || !templateId) {
      console.error('❌ Email ou template ID ausente');
      return;
    }

    // Converter centavos para valor decimal
    const amount = amount_total / 100;

    // Salvar no Supabase
    const { data, error } = await supabase
      .from('purchases')
      .insert({
        user_email: customer_email.toLowerCase(),
        template_id: templateId,
        stripe_session_id: sessionId,
        amount: amount,
        currency: currency.toUpperCase(),
        status: 'completed',
        expires_at: null, // Vitalício
        metadata: {
          template_name: templateName,
          completed_at: new Date().toISOString(),
        }
      })
      .select()
      .single();

    if (error && error.code !== '23505') { // Ignorar duplicate
      throw error;
    }

    console.log(`✅ Compra registrada: ${customer_email} → ${templateId}`);

    // OPCIONAL: Enviar email de confirmação
    await sendConfirmationEmail(customer_email, templateName);

  } catch (error) {
    console.error('❌ Erro ao processar checkout:', error);
    throw error;
  }
}
```

---

## 4. Consultas SQL Úteis

### Verificar Compras

```sql
-- Todas as compras de um usuário
SELECT
  template_id,
  amount,
  currency,
  status,
  created_at,
  expires_at
FROM purchases
WHERE user_email = 'user@example.com'
ORDER BY created_at DESC;

-- Compras ativas (não expiradas)
SELECT * FROM purchases
WHERE user_email = 'user@example.com'
  AND status = 'completed'
  AND (expires_at IS NULL OR expires_at > NOW());

-- Estatísticas por template
SELECT
  template_id,
  COUNT(*) as total_purchases,
  COUNT(DISTINCT user_email) as unique_users,
  SUM(amount) as total_revenue
FROM purchases
WHERE status = 'completed'
GROUP BY template_id
ORDER BY total_revenue DESC;

-- Compras recentes (últimas 24h)
SELECT
  user_email,
  template_id,
  amount,
  created_at
FROM purchases
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Verificar acesso específico
SELECT
  has_access,
  expires_at,
  purchased_at
FROM check_premium_access(
  'user@example.com',
  'premium-executive'
);
```

---

## 5. Endpoint para Admin Panel

### routes/premium.js

```javascript
// Listar todas as compras (admin only)
router.get('/all', authenticateAdmin, async (req, res) => {
  try {
    const { limit = 50, offset = 0, status = 'completed' } = req.query;

    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({
      success: true,
      purchases: data,
      total: data.length,
    });

  } catch (error) {
    console.error('❌ Erro ao listar compras:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar compras'
    });
  }
});

// Estatísticas gerais (admin only)
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('purchase_statistics')
      .select('*');

    if (error) throw error;

    res.json({
      success: true,
      stats: data,
    });

  } catch (error) {
    console.error('❌ Erro ao obter estatísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao obter estatísticas'
    });
  }
});
```

---

## 6. React Hook Personalizado

### hooks/usePremiumAccess.ts

```typescript
import { useState, useEffect } from 'react';
import { StripeService } from '@/services/stripeService';

interface UsePremiumAccessResult {
  hasAccess: boolean;
  isChecking: boolean;
  error: string | null;
  expiresAt: string | null;
}

export function usePremiumAccess(
  templateId: string,
  userEmail: string | null
): UsePremiumAccessResult {
  const [hasAccess, setHasAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      if (!userEmail) {
        setError('Email não fornecido');
        setIsChecking(false);
        return;
      }

      setIsChecking(true);
      setError(null);

      const result = await StripeService.checkPremiumAccess(templateId, userEmail);

      if (result.error) {
        setError(result.error);
        setHasAccess(false);
      } else {
        setHasAccess(result.hasAccess);
        setExpiresAt(result.expiresAt || null);
      }

      setIsChecking(false);
    };

    checkAccess();
  }, [templateId, userEmail]);

  return { hasAccess, isChecking, error, expiresAt };
}

// Uso:
// const { hasAccess, isChecking } = usePremiumAccess('premium-executive', 'user@example.com');
```

---

## 7. Componente de Loading

### components/PremiumAccessCheck.tsx

```typescript
import React from 'react';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { Crown } from 'lucide-react';

interface PremiumAccessCheckProps {
  templateId: string;
  userEmail: string | null;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PremiumAccessCheck({
  templateId,
  userEmail,
  children,
  fallback
}: PremiumAccessCheckProps) {
  const { hasAccess, isChecking, error } = usePremiumAccess(templateId, userEmail);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl font-bold">Verificando acesso premium...</h2>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Aguarde...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !hasAccess) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">Acesso Negado</h2>
          <p className="text-gray-600 mt-2">
            {error || 'Você não tem acesso a este template premium'}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Uso:
// <PremiumAccessCheck templateId="premium-executive" userEmail={email}>
//   <PremiumContent />
// </PremiumAccessCheck>
```

---

## 8. Teste Automatizado

### tests/premium.test.js

```javascript
const request = require('supertest');
const app = require('../server/secure-backend');

describe('Premium Validation API', () => {
  const testEmail = 'test@example.com';
  const testTemplateId = 'premium-executive';

  // Teste 1: Conceder acesso
  test('POST /api/premium/grant - should grant access', async () => {
    const response = await request(app)
      .post('/api/premium/grant')
      .send({
        email: testEmail,
        templateId: testTemplateId,
        stripeSessionId: 'cs_test_12345',
        amount: 4.90,
        currency: 'BRL'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  // Teste 2: Verificar acesso
  test('GET /api/premium/check/:templateId - should return hasAccess true', async () => {
    const response = await request(app)
      .get(`/api/premium/check/${testTemplateId}?email=${testEmail}`);

    expect(response.status).toBe(200);
    expect(response.body.hasAccess).toBe(true);
  });

  // Teste 3: Listar compras
  test('GET /api/premium/purchases - should list purchases', async () => {
    const response = await request(app)
      .get(`/api/premium/purchases?email=${testEmail}`);

    expect(response.status).toBe(200);
    expect(response.body.purchases.length).toBeGreaterThan(0);
  });

  // Teste 4: Revogar acesso
  test('POST /api/premium/revoke - should revoke access', async () => {
    const response = await request(app)
      .post('/api/premium/revoke')
      .send({
        email: testEmail,
        templateId: testTemplateId
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

---

## 9. Coletar Email Antes do Checkout

### components/EmailCollector.tsx

```typescript
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail } from 'lucide-react';

interface EmailCollectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmailSubmit: (email: string) => void;
}

export function EmailCollector({ open, onOpenChange, onEmailSubmit }: EmailCollectorProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email inválido');
      return;
    }

    // Salvar email
    localStorage.setItem('user-email', email);

    // Callback
    onEmailSubmit(email);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-500" />
            Informe seu Email
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Digite seu email para acessar o template premium após o pagamento.
            </p>

            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className={error ? 'border-red-500' : ''}
            />

            {error && (
              <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Continuar para Pagamento
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Uso:
// const [emailModalOpen, setEmailModalOpen] = useState(false);
//
// const handlePurchaseClick = () => {
//   const savedEmail = localStorage.getItem('user-email');
//   if (savedEmail) {
//     proceedToCheckout(savedEmail);
//   } else {
//     setEmailModalOpen(true);
//   }
// };
//
// const proceedToCheckout = async (email: string) => {
//   await StripeService.processTemplatePayment({
//     templateId: 'premium-executive',
//     templateName: 'Executive Premium',
//     price: 4.90,
//     userId: 'guest',
//     userEmail: email
//   });
// };
```

---

## 10. Debug e Logging

### utils/premiumLogger.ts

```typescript
// Logger específico para validação premium
export class PremiumLogger {
  private static isEnabled = import.meta.env.NODE_ENV === 'development';

  static checkAccess(templateId: string, email: string, hasAccess: boolean) {
    if (!this.isEnabled) return;

    console.group('🔒 Premium Access Check');
    console.log('Template:', templateId);
    console.log('Email:', email);
    console.log('Has Access:', hasAccess ? '✅ YES' : '❌ NO');
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
  }

  static purchaseGranted(email: string, templateId: string, purchaseId: string) {
    console.group('✅ Purchase Granted');
    console.log('Email:', email);
    console.log('Template:', templateId);
    console.log('Purchase ID:', purchaseId);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
  }

  static error(context: string, error: any) {
    console.group('❌ Premium Error');
    console.log('Context:', context);
    console.error('Error:', error);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
  }

  static webhookReceived(eventType: string, sessionId: string) {
    console.group('📨 Webhook Received');
    console.log('Event Type:', eventType);
    console.log('Session ID:', sessionId);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
  }
}

// Uso:
// PremiumLogger.checkAccess('premium-executive', 'user@example.com', true);
```

---

**Todos os exemplos estão prontos para uso em produção.**
**Copie, cole e adapte conforme necessário.**

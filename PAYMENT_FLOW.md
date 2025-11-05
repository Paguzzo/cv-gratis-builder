# 💳 Fluxo de Pagamento - Arquitetura

Documentação do fluxo completo de pagamento para templates premium.

---

## 🎯 Visão Geral

```
Usuário → PaymentDialog → Stripe Checkout → Webhook → Supabase → Premium Editor
```

---

## 📊 Fluxo Detalhado

### 1️⃣ Usuário Seleciona Template Premium

**Componente**: `TemplateSelector.tsx`

```typescript
// Usuário clica em "Comprar Premium"
handleTemplateSelect(templateId) →
  checkPremiumAccess(template) →
  setPaymentDialogOpen(true)
```

**Validação**:
- ✅ Template é premium?
- ✅ Usuário já comprou?
- ❌ Abrir dialog de pagamento

---

### 2️⃣ Dialog de Pagamento

**Componente**: `PaymentDialog.tsx`

**Opções**:
- 💳 **Cartão** → Redireciona para Stripe Checkout
- 💚 **PIX** → Gera código PIX (em desenvolvimento)

**Ação de Pagamento**:
```javascript
handleCardPayment() {
  // 1. Construir URL do Stripe com params
  const params = {
    success_url: '/premium-editor?template=${templateId}&payment=success',
    cancel_url: '/template-selector?payment=cancelled',
    metadata: {
      template_id: templateId,
      template_name: templateName
    }
  }

  // 2. Salvar dados localmente
  localStorage.setItem('stripe_pending_template', templateId);

  // 3. Redirecionar para Stripe
  window.location.href = stripeCheckoutUrl;
}
```

---

### 3️⃣ Stripe Checkout

**Ambiente**: Externo (Stripe)

1. Usuário preenche dados do cartão
2. Stripe processa pagamento
3. Stripe redireciona baseado no resultado:
   - ✅ **Sucesso**: → `success_url`
   - ❌ **Cancelado**: → `cancel_url`

---

### 4️⃣ Webhook do Stripe

**Backend**: `server/webhooks/stripe.js`

**Evento Recebido**: `checkout.session.completed`

```javascript
// 1. Verificar assinatura do webhook
event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);

// 2. Extrair dados
const {
  customer_email,
  amount_total,
  metadata: { template_id, template_name }
} = session;

// 3. Salvar compra no Supabase
await supabase.from('purchases').insert({
  user_email: customer_email,
  template_id: template_id,
  amount: amount_total / 100,
  status: 'completed',
  expires_at: null // vitalício
});
```

**Eventos Tratados**:
- ✅ `checkout.session.completed`
- ✅ `checkout.session.async_payment_succeeded`
- ✅ `payment_intent.succeeded`
- 🔄 `charge.refunded`

---

### 5️⃣ Redirecionamento de Sucesso

**URL**: `/premium-editor?template=xxx&payment=success`

**Hook**: `useStripeReturn.ts`

```typescript
useEffect(() => {
  // 1. Detectar retorno do Stripe
  const paymentParam = searchParams.get('payment');

  if (paymentParam === 'success') {
    // 2. Buscar template pendente
    const pendingTemplate = localStorage.getItem('stripe_pending_template');

    // 3. Marcar como comprado localmente
    confirmPaymentViaWebhook(pendingTemplate);

    // 4. Mostrar toast de sucesso
    toast.success('Pagamento confirmado! Template desbloqueado.');

    // 5. Redirecionar para editor premium
    navigate(`/premium-editor?template=${pendingTemplate}`);
  }
}, [searchParams]);
```

---

### 6️⃣ Editor Premium Desbloqueado

**Componente**: `PremiumEditor.tsx`

**Verificação Server-Side**:
```typescript
// 1. Obter email do usuário
const userEmail = getUserEmail(); // Do context ou localStorage

// 2. Verificar acesso via API
const response = await fetch(
  `/api/premium/check/${templateId}?email=${userEmail}`
);

const { hasAccess, expiresAt } = await response.json();

// 3. Se tem acesso, mostrar editor
if (hasAccess) {
  return <PremiumEditorInterface />;
} else {
  return <PaymentRequired />;
}
```

**Recursos Desbloqueados**:
- ✨ Customização de cores
- 🎨 Tipografia avançada
- 🤖 Avaliação com IA
- 📊 Análise de qualidade
- 💾 Exportação premium

---

## 🗄️ Estrutura de Dados (Supabase)

### Tabela: `purchases`

```sql
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  template_id TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  status TEXT DEFAULT 'completed', -- completed, refunded, expired
  expires_at TIMESTAMPTZ, -- NULL = vitalício
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  UNIQUE(user_email, template_id)
);

-- Índices
CREATE INDEX idx_purchases_email ON purchases(user_email);
CREATE INDEX idx_purchases_template ON purchases(template_id);
CREATE INDEX idx_purchases_status ON purchases(status);
```

### Função SQL: `check_premium_access`

```sql
CREATE OR REPLACE FUNCTION check_premium_access(
  p_user_email TEXT,
  p_template_id TEXT
)
RETURNS TABLE (
  has_access BOOLEAN,
  purchase_id UUID,
  purchased_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    TRUE as has_access,
    id as purchase_id,
    created_at as purchased_at,
    expires_at
  FROM purchases
  WHERE
    user_email = LOWER(p_user_email)
    AND template_id = p_template_id
    AND status = 'completed'
    AND (expires_at IS NULL OR expires_at > NOW())
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;
```

---

## 🔒 Segurança

### Client-Side (Frontend)

```javascript
// ❌ NUNCA fazer:
const stripeSecretKey = "sk_live_..."; // NO FRONTEND!

// ✅ SEMPRE usar:
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
```

### Server-Side (Backend)

```javascript
// ✅ Chaves secretas APENAS no backend
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
```

### Validação de Acesso

**Sempre validar server-side**:
```javascript
// Frontend: Pode ser burlado
const hasAccess = localStorage.getItem('premium_access') === 'true';

// Backend: Seguro
const { hasAccess } = await checkPremiumAccessFromDB(email, templateId);
```

---

## 📍 Rotas Configuradas

### Frontend

| Rota | Propósito |
|------|-----------|
| `/template-selector` | Seleção de templates |
| `/template-selector?payment=cancelled` | Retorno de cancelamento |
| `/premium-editor?template=xxx&payment=success` | Retorno de sucesso |
| `/premium-editor?template=xxx` | Editor premium |

### Backend

| Endpoint | Método | Propósito |
|----------|--------|-----------|
| `/api/webhooks/stripe` | POST | Receber eventos do Stripe |
| `/api/premium/check/:templateId` | GET | Verificar acesso premium |
| `/api/premium/grant` | POST | Conceder acesso (webhook) |
| `/api/premium/purchases` | GET | Listar compras do usuário |
| `/api/premium/revoke` | POST | Revogar acesso (reembolso) |

---

## 🧪 Testes

### Teste Local do Webhook

```bash
# Terminal 1: Iniciar servidor
cd server
npm start

# Terminal 2: Stripe CLI
stripe listen --forward-to localhost:3001/api/webhooks/stripe

# Terminal 3: Simular evento
stripe trigger checkout.session.completed
```

### Teste Manual da Compra

```bash
curl -X POST http://localhost:3001/api/webhooks/stripe/test \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "templateId": "premium-executive"
  }'
```

### Teste de Verificação de Acesso

```bash
curl "http://localhost:3001/api/premium/check/premium-executive?email=test@example.com"
```

---

## 🎨 UI/UX

### Design do PaymentDialog

**Características**:
- 🎨 Gradiente vibrante no header
- 💳 Tabs para Cartão/PIX
- ✨ Lista de recursos premium destacados
- 💰 Preço em destaque com gradiente
- 🔒 Indicador de segurança

**Estados**:
1. **Inicial**: Escolha de método
2. **Processando**: Loading com spinner
3. **Sucesso**: Checkmark + redirecionamento

---

## 🚀 Melhorias Futuras

- [ ] Suporte a PIX real (não apenas simulação)
- [ ] Cupons de desconto
- [ ] Assinaturas mensais
- [ ] Pacote "todos os templates"
- [ ] Sistema de afiliados
- [ ] Recuperação de carrinho abandonado
- [ ] Email transacional pós-compra
- [ ] Dashboard de compras do usuário
- [ ] Histórico de faturas

---

## 📊 Métricas Importantes

**Para monitorar**:
- Taxa de conversão (visualizações → compras)
- Taxa de abandono no checkout
- Valor médio de transação
- Tempo de confirmação do webhook
- Erros de webhook
- Reembolsos solicitados

**Ferramentas**:
- Stripe Dashboard
- Google Analytics
- Supabase Dashboard
- Logs do servidor

---

## 🔗 Links Úteis

- [Stripe Dashboard](https://dashboard.stripe.com/)
- [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
- [Stripe Docs](https://stripe.com/docs)
- [Supabase Dashboard](https://app.supabase.com/)

---

**Última atualização**: 02/11/2025

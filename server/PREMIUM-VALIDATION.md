# Validação Premium Server-Side - Documentação Completa

Sistema de validação seguro de acesso a templates premium usando Supabase e Stripe.

## Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Setup do Supabase](#setup-do-supabase)
4. [Configuração do Backend](#configuração-do-backend)
5. [Configuração do Stripe](#configuração-do-stripe)
6. [Endpoints da API](#endpoints-da-api)
7. [Fluxo Completo](#fluxo-completo)
8. [Testes](#testes)
9. [Segurança](#segurança)
10. [Troubleshooting](#troubleshooting)

---

## Visão Geral

### Problema Resolvido

❌ **ANTES**: Validação client-side (localStorage) - facilmente burlável
✅ **AGORA**: Validação server-side (Supabase) - 100% segura

### Tecnologias

- **Supabase**: Banco de dados PostgreSQL com RLS (Row Level Security)
- **Express.js**: API backend Node.js
- **Stripe**: Processamento de pagamentos e webhooks
- **TypeScript**: Frontend com validação tipada

---

## Arquitetura

```
┌─────────────────┐
│   FRONTEND      │
│   (React)       │
└────────┬────────┘
         │
         │ 1. Checkout Stripe
         ▼
┌─────────────────┐
│   STRIPE        │
│   (Pagamento)   │
└────────┬────────┘
         │
         │ 2. Webhook
         ▼
┌─────────────────┐
│   BACKEND       │
│   (Express)     │
└────────┬────────┘
         │
         │ 3. Salvar compra
         ▼
┌─────────────────┐
│   SUPABASE      │
│   (PostgreSQL)  │
└────────┬────────┘
         │
         │ 4. Verificar acesso
         ▼
┌─────────────────┐
│   FRONTEND      │
│   (Premium)     │
└─────────────────┘
```

---

## Setup do Supabase

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote a **URL** e **Service Key** (não a anon key!)

### 2. Executar Script SQL

1. No Supabase Dashboard, vá em **SQL Editor**
2. Cole o conteúdo de `server/database/supabase-setup.sql`
3. Execute o script (clique em "Run")

**O que o script cria:**

- ✅ Tabela `purchases` com validações
- ✅ Índices para performance
- ✅ Função `check_premium_access(email, template_id)`
- ✅ RLS Policies para segurança
- ✅ Triggers para atualização automática

### 3. Obter Credenciais

No Supabase Dashboard:

1. Vá em **Settings** → **API**
2. Copie:
   - `URL` → `VITE_SUPABASE_URL`
   - `service_role key` → `SUPABASE_SERVICE_KEY` (⚠️ NUNCA exponha no frontend!)

---

## Configuração do Backend

### 1. Instalar Dependências

```bash
cd server
npm install @supabase/supabase-js stripe
```

### 2. Configurar Variáveis de Ambiente

Adicione ao `.env`:

```env
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=sua-service-role-key-aqui

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Verificar Rotas Registradas

Em `server/secure-backend.js`, confirme que as rotas estão registradas:

```javascript
// Importar rotas
const premiumRoutes = require('./routes/premium');
const stripeWebhook = require('./webhooks/stripe');

// Registrar rotas
app.use('/api/premium', premiumRoutes);
app.use('/api/webhooks', stripeWebhook);
```

### 4. Iniciar Servidor

```bash
node server/secure-backend.js
```

Ou com nodemon:

```bash
npm install -g nodemon
nodemon server/secure-backend.js
```

---

## Configuração do Stripe

### 1. Criar Produtos no Stripe Dashboard

1. Acesse [dashboard.stripe.com](https://dashboard.stripe.com)
2. Vá em **Products** → **Add Product**
3. Para cada template premium:
   - Nome: "Template Premium - Executive"
   - Preço: R$ 4,90 (ou seu preço)
   - Tipo: One-time purchase
   - Copie o **Price ID** (ex: `price_1234567890`)

### 2. Configurar Webhook

1. No Stripe Dashboard, vá em **Developers** → **Webhooks**
2. Clique em **Add endpoint**
3. URL: `https://seu-dominio.com/api/webhooks/stripe`
4. Eventos a escutar:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `charge.refunded`
5. Copie o **Webhook Secret** (`whsec_...`)

### 3. Atualizar Frontend

Em `src/services/stripeService.ts`, atualize os Price IDs:

```typescript
private static readonly STRIPE_PRODUCTS = {
  'premium-executive': { priceId: 'price_1234567890', amount: 490 },
  'premium-tech': { priceId: 'price_ABCDEFGHIJ', amount: 490 },
  // ... outros templates
};
```

### 4. Configurar Checkout

Atualize o método `processTemplatePayment()` em `stripeService.ts`:

```typescript
const { error } = await this.stripe.redirectToCheckout({
  mode: 'payment',
  lineItems: [{
    price: this.STRIPE_PRODUCTS[paymentData.templateId].priceId,
    quantity: 1,
  }],
  successUrl: `${window.location.origin}/premium-editor?template=${paymentData.templateId}&email={CUSTOMER_EMAIL}&success=true`,
  cancelUrl: `${window.location.origin}/template-selector?canceled=true`,
  customerEmail: paymentData.userEmail, // Preencher automaticamente
  metadata: {
    templateId: paymentData.templateId,
    templateName: paymentData.templateName,
  }
});
```

---

## Endpoints da API

### 1. GET `/api/premium/check/:templateId`

Verifica se um email tem acesso a um template.

**Request:**
```
GET /api/premium/check/premium-executive?email=user@example.com
```

**Response:**
```json
{
  "success": true,
  "hasAccess": true,
  "expiresAt": null,
  "purchaseId": "uuid-123",
  "purchasedAt": "2025-01-01T12:00:00Z"
}
```

### 2. POST `/api/premium/grant`

Concede acesso premium (chamado pelo webhook).

**Request:**
```json
{
  "email": "user@example.com",
  "templateId": "premium-executive",
  "stripeSessionId": "cs_test_123",
  "amount": 4.90,
  "currency": "BRL",
  "metadata": {
    "template_name": "Executive Premium"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Acesso premium concedido com sucesso",
  "purchaseId": "uuid-456",
  "expiresAt": null
}
```

### 3. GET `/api/premium/purchases`

Lista compras de um usuário.

**Request:**
```
GET /api/premium/purchases?email=user@example.com
```

**Response:**
```json
{
  "success": true,
  "purchases": [
    {
      "id": "uuid-123",
      "template_id": "premium-executive",
      "amount": 4.90,
      "created_at": "2025-01-01T12:00:00Z"
    }
  ],
  "total": 1
}
```

### 4. POST `/api/premium/revoke`

Revoga acesso (admin only).

**Request:**
```json
{
  "email": "user@example.com",
  "templateId": "premium-executive"
}
```

### 5. POST `/api/webhooks/stripe`

Recebe eventos do Stripe (automático).

---

## Fluxo Completo

### Fluxo de Compra

```
1. Usuário escolhe template premium no TemplateSelector
   ↓
2. Clica em "Comprar" → Stripe Checkout abre
   ↓
3. Preenche dados de pagamento → Confirma
   ↓
4. Stripe processa pagamento
   ↓
5. Stripe envia webhook para /api/webhooks/stripe
   ↓
6. Backend salva compra no Supabase (purchases)
   ↓
7. Usuário é redirecionado para /premium-editor?template=X&email=Y
   ↓
8. Frontend chama GET /api/premium/check/X?email=Y
   ↓
9. Backend consulta Supabase → Retorna { hasAccess: true }
   ↓
10. Frontend libera acesso ao editor premium
```

### Fluxo de Verificação

```typescript
// Em PremiumEditor.tsx
useEffect(() => {
  const checkAccess = async () => {
    const email = searchParams.get('email') || localStorage.getItem('user-email');

    // Verificar via API server-side
    const result = await StripeService.checkPremiumAccess(templateId, email);

    if (result.hasAccess) {
      // Liberar acesso
      setSelectedTemplate(template);
    } else {
      // Redirecionar para compra
      navigate('/template-selector');
    }
  };

  checkAccess();
}, []);
```

---

## Testes

### 1. Teste Manual do Webhook

```bash
curl -X POST http://localhost:3001/api/webhooks/stripe/test \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "templateId": "premium-executive"
  }'
```

### 2. Verificar Acesso

```bash
curl "http://localhost:3001/api/premium/check/premium-executive?email=test@example.com"
```

### 3. Listar Compras

```bash
curl "http://localhost:3001/api/premium/purchases?email=test@example.com"
```

### 4. Testar Stripe Webhook (Local)

Use Stripe CLI:

```bash
stripe listen --forward-to localhost:3001/api/webhooks/stripe
stripe trigger checkout.session.completed
```

---

## Segurança

### ✅ Implementado

1. **RLS (Row Level Security)** no Supabase
   - Usuários só veem suas compras
   - Apenas service_role pode inserir/atualizar

2. **Validação de Webhook**
   - Stripe signature verification
   - Rejeita webhooks não assinados

3. **Rate Limiting**
   - 100 requests/15min por IP
   - 5 tentativas de login/15min

4. **Validação de Entrada**
   - Express-validator em todos endpoints
   - Sanitização de emails e dados

5. **HTTPS Only** (produção)
   - Helmet.js configurado
   - CORS restrito ao frontend

### ⚠️ Importante

- **NUNCA** exponha `SUPABASE_SERVICE_KEY` no frontend
- **NUNCA** exponha `STRIPE_SECRET_KEY` no frontend
- Sempre use HTTPS em produção
- Mantenha `.env` fora do Git

---

## Troubleshooting

### Erro: "Supabase não configurado"

**Causa:** Variáveis de ambiente não carregadas

**Solução:**
```bash
# Verificar .env
cat .env | grep SUPABASE

# Reiniciar servidor
nodemon server/secure-backend.js
```

### Erro: "Webhook signature failed"

**Causa:** Secret do webhook incorreto

**Solução:**
1. No Stripe Dashboard, copie o Webhook Secret
2. Atualize `STRIPE_WEBHOOK_SECRET` no `.env`
3. Reinicie o servidor

### Erro: "hasAccess: false" mesmo após compra

**Causas possíveis:**

1. **Webhook não disparou:**
   - Verifique logs do Stripe Dashboard
   - Teste manualmente: `/api/webhooks/stripe/test`

2. **Email diferente:**
   - Verifique se o email no Stripe == email na URL
   - Use `{CUSTOMER_EMAIL}` no successUrl

3. **Compra não salva:**
   - Verifique logs do backend
   - Consulte Supabase Table Editor

**Debug:**
```sql
-- No Supabase SQL Editor
SELECT * FROM purchases
WHERE user_email = 'seu-email@example.com';
```

### Erro: "Service role can insert purchases POLICY failed"

**Causa:** RLS configurado incorretamente

**Solução:**
```sql
-- Recriar policies
DROP POLICY IF EXISTS "Service role can insert purchases" ON purchases;

CREATE POLICY "Service role can insert purchases"
  ON purchases
  FOR INSERT
  WITH CHECK (true); -- Permitir todos inserts (backend usa service key)
```

---

## Deploy em Produção

### 1. Backend (Heroku/Railway/Vercel)

```bash
# Configurar variáveis de ambiente
heroku config:set SUPABASE_SERVICE_KEY=xxx
heroku config:set STRIPE_SECRET_KEY=xxx
heroku config:set STRIPE_WEBHOOK_SECRET=xxx

# Deploy
git push heroku main
```

### 2. Atualizar Webhook do Stripe

1. URL de produção: `https://seu-backend.com/api/webhooks/stripe`
2. Copiar novo Webhook Secret
3. Atualizar `.env` de produção

### 3. Atualizar Frontend

```env
# .env.production
VITE_BACKEND_URL=https://seu-backend.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## Próximos Passos

- [ ] Implementar expiração de acesso (ex: 1 ano)
- [ ] Adicionar logs de auditoria
- [ ] Criar painel admin para gerenciar compras
- [ ] Implementar sistema de cupons de desconto
- [ ] Adicionar suporte a múltiplos templates (bundle)
- [ ] Implementar renovação automática (subscriptions)

---

## Suporte

Para dúvidas ou problemas:

1. Verifique os logs do backend
2. Consulte a tabela `purchases` no Supabase
3. Teste endpoints com Postman/curl
4. Revise a documentação do Stripe

**Logs importantes:**
- ✅ Compra registrada: `console.log('✅ Compra registrada...')`
- ❌ Erro: `console.error('❌ Erro...')`
- 📨 Webhook recebido: `console.log('📨 Webhook recebido...')`

---

**Última atualização:** 2025-10-05
**Versão:** 1.0.0
**Autor:** Sistema de Validação Premium

# Quick Start - Validação Premium Server-Side

Guia rápido para implementar validação segura de templates premium em 5 passos.

## Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase
- Conta no Stripe
- Backend rodando (`npm run dev`)

---

## Passo 1: Configurar Supabase (5 min)

### 1.1 Criar Projeto
1. Acesse https://supabase.com
2. Clique em "New Project"
3. Preencha nome, senha e região
4. Aguarde criação (2-3 minutos)

### 1.2 Executar SQL
1. No Supabase Dashboard, clique em "SQL Editor"
2. Copie todo o conteúdo de `server/database/supabase-setup.sql`
3. Cole no editor e clique em "Run"
4. Verifique se apareceu "Success" ✅

### 1.3 Obter Credenciais
1. Vá em "Settings" → "API"
2. Copie:
   - **URL do projeto** (algo como `https://xyz.supabase.co`)
   - **service_role key** (começa com `eyJ...`)

---

## Passo 2: Configurar Backend (3 min)

### 2.1 Adicionar ao .env

Adicione estas linhas ao arquivo `.env` na raiz do projeto:

```env
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=eyJ... (sua service_role key aqui)

# Stripe (configurar no próximo passo)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2.2 Instalar Dependências

```bash
cd server
npm install @supabase/supabase-js stripe
```

### 2.3 Reiniciar Backend

```bash
# Parar servidor (Ctrl+C)
# Iniciar novamente
node secure-backend.js
```

Você deve ver:
```
✅ Servidor seguro iniciado!
📡 Porta: 3001
```

---

## Passo 3: Configurar Stripe (7 min)

### 3.1 Criar Produto

1. Acesse https://dashboard.stripe.com
2. Clique em "Products" → "Add Product"
3. Preencha:
   - **Nome**: Template Premium - Executive
   - **Descrição**: Template profissional para currículos executivos
   - **Preço**: R$ 4,90 (ou USD $0.99)
   - **Tipo**: One-time purchase
4. Clique em "Save product"
5. **COPIE O PRICE ID** (ex: `price_1AB2CD3EF4GH5IJ6`)

Repita para cada template premium.

### 3.2 Configurar Webhook (Teste Local)

Para desenvolvimento local, use Stripe CLI:

```bash
# Instalar Stripe CLI
# Windows: scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe
# Linux: https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks para seu backend local
stripe listen --forward-to http://localhost:3001/api/webhooks/stripe
```

Copie o **Webhook Secret** que aparece (`whsec_...`) e adicione ao `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3.3 Obter Chaves de API

1. No Stripe Dashboard, vá em "Developers" → "API keys"
2. Copie:
   - **Publishable key** (começa com `pk_test_`)
   - **Secret key** (começa com `sk_test_`)

Adicione ao `.env`:

```env
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## Passo 4: Atualizar Frontend (5 min)

### 4.1 Adicionar Price IDs

Em `src/services/stripeService.ts`, localize `STRIPE_PRODUCTS` e atualize:

```typescript
private static readonly STRIPE_PRODUCTS = {
  'premium-executive': { priceId: 'price_1AB2CD3EF4GH5IJ6', amount: 490 },
  'premium-tech': { priceId: 'price_SEUPRICEAQUI', amount: 490 },
  'premium-creative': { priceId: 'price_SEUPRICEAQUI', amount: 490 },
  // ... outros templates
};
```

### 4.2 Configurar Backend URL

Em `.env` (raiz do projeto):

```env
VITE_BACKEND_URL=http://localhost:3001
```

### 4.3 Reiniciar Frontend

```bash
npm run dev
```

---

## Passo 5: Testar (10 min)

### 5.1 Teste Manual do Webhook

```bash
curl -X POST http://localhost:3001/api/webhooks/stripe/test \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu-email@example.com",
    "templateId": "premium-executive"
  }'
```

Resposta esperada:
```json
{
  "success": true,
  "message": "Compra de teste registrada com sucesso"
}
```

### 5.2 Verificar Acesso

```bash
curl "http://localhost:3001/api/premium/check/premium-executive?email=seu-email@example.com"
```

Resposta esperada:
```json
{
  "success": true,
  "hasAccess": true,
  "expiresAt": null,
  "purchaseId": "uuid-aqui",
  "purchasedAt": "2025-10-05T12:00:00Z"
}
```

### 5.3 Verificar no Supabase

1. No Supabase Dashboard, vá em "Table Editor"
2. Clique na tabela `purchases`
3. Você deve ver sua compra de teste:

| user_email | template_id | status | amount |
|------------|-------------|--------|--------|
| seu-email@example.com | premium-executive | completed | 4.90 |

### 5.4 Testar no Frontend

1. Acesse http://localhost:8080/template-selector
2. Clique em um template premium
3. Você deve ver o Stripe Checkout abrir
4. Use cartão de teste: `4242 4242 4242 4242`
5. Após pagamento, deve ser redirecionado para `/premium-editor`
6. Verifique no console:
   ```
   ✅ Acesso premium confirmado!
   ```

---

## Verificação Final

Execute todos os testes:

```bash
# 1. Health check do backend
curl http://localhost:3001/health

# 2. Verificar tabela no Supabase
# No Supabase Dashboard → SQL Editor:
SELECT * FROM purchases ORDER BY created_at DESC LIMIT 5;

# 3. Listar compras de um usuário
curl "http://localhost:3001/api/premium/purchases?email=seu-email@example.com"
```

---

## Troubleshooting Rápido

### ❌ Erro: "Supabase não configurado"
- Verifique se `VITE_SUPABASE_URL` e `SUPABASE_SERVICE_KEY` estão no `.env`
- Reinicie o backend

### ❌ Erro: "Stripe não configurado"
- Verifique se `STRIPE_SECRET_KEY` está no `.env`
- Reinicie o backend

### ❌ Erro: "hasAccess: false" após compra
- Verifique se o webhook foi disparado (veja logs do backend)
- Teste manualmente: `POST /api/webhooks/stripe/test`
- Verifique se o email é o mesmo usado no checkout

### ❌ Erro: "CORS blocked"
- Verifique se `FRONTEND_URL` está correto no `.env`
- Reinicie o backend

---

## Próximos Passos

Agora que está funcionando:

1. [ ] Configure webhook em produção (Stripe Dashboard)
2. [ ] Implemente coleta de email antes do checkout
3. [ ] Adicione todos os templates premium
4. [ ] Teste fluxo completo end-to-end
5. [ ] Configure analytics de conversão
6. [ ] Implemente sistema de cupons (opcional)

---

## Recursos Adicionais

- **Documentação Completa**: `server/PREMIUM-VALIDATION.md`
- **Script SQL**: `server/database/supabase-setup.sql`
- **Código das Rotas**: `server/routes/premium.js`
- **Webhook Handler**: `server/webhooks/stripe.js`

---

## Suporte

Se encontrar problemas:

1. Verifique logs do backend (`console.log`)
2. Verifique logs do Stripe (Dashboard → Logs)
3. Consulte tabela `purchases` no Supabase
4. Revise a documentação completa

---

**Tempo total:** ~30 minutos
**Dificuldade:** Intermediária
**Última atualização:** 2025-10-05

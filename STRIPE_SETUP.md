# 💳 Configuração do Stripe - CV Grátis Builder

Este guia mostra como configurar o Stripe para aceitar pagamentos de templates premium.

---

## 📋 Sumário

1. [Pré-requisitos](#-pré-requisitos)
2. [Criar Conta no Stripe](#-criar-conta-no-stripe)
3. [Obter Chaves da API](#-obter-chaves-da-api)
4. [Configurar Produtos](#-configurar-produtos)
5. [Configurar Webhooks](#-configurar-webhooks)
6. [Configurar Variáveis de Ambiente](#-configurar-variáveis-de-ambiente)
7. [Testar Pagamentos](#-testar-pagamentos)
8. [Produção](#-produção)

---

## 🎯 Pré-requisitos

- Conta no Stripe (gratuita)
- Node.js 18+ instalado
- Supabase configurado (para salvar compras)

---

## 🚀 Criar Conta no Stripe

1. Acesse: https://dashboard.stripe.com/register
2. Crie sua conta gratuitamente
3. Ative o modo de teste

---

## 🔑 Obter Chaves da API

### 1. Acesse o Dashboard do Stripe
- URL: https://dashboard.stripe.com/test/apikeys

### 2. Copie suas chaves:

**Chave Pública** (Publishable key):
```
pk_test_51xxxxx...
```

**Chave Secreta** (Secret key):
```
sk_test_51xxxxx...
```

### 3. Adicione ao arquivo `.env`:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_publica
STRIPE_SECRET_KEY=sk_test_sua_chave_secreta
```

⚠️ **IMPORTANTE**: NUNCA exponha a chave secreta no frontend!

---

## 🛍️ Configurar Produtos

### Opção 1: Payment Links (Recomendado para começar)

1. Acesse: https://dashboard.stripe.com/test/payment-links
2. Clique em **"New"** (Novo)
3. Preencha:
   - **Nome**: Template Premium - Executive
   - **Preço**: R$ 4,90
   - **Moeda**: BRL
4. Em **"After payment"** (Após pagamento):
   - **Success URL**: `https://seu-site.com/premium-editor?template={CHECKOUT_SESSION_ID}&payment=success`
   - **Cancel URL**: `https://seu-site.com/template-selector?payment=cancelled`
5. Em **"Metadata"** (opcional):
   - `template_id`: premium-executive
   - `template_name`: Template Executive
6. Clique em **"Create link"**
7. Copie o link gerado

### Opção 2: Checkout Sessions (Avançado)

Se preferir usar Checkout Sessions via API:

```javascript
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'brl',
      product_data: {
        name: 'Template Premium - Executive',
      },
      unit_amount: 490, // R$ 4,90 em centavos
    },
    quantity: 1,
  }],
  mode: 'payment',
  success_url: 'https://seu-site.com/premium-editor?session_id={CHECKOUT_SESSION_ID}',
  cancel_url: 'https://seu-site.com/template-selector?payment=cancelled',
  metadata: {
    template_id: 'premium-executive',
    template_name: 'Template Executive'
  }
});
```

---

## 🔔 Configurar Webhooks

Os webhooks permitem que o Stripe notifique seu servidor quando um pagamento é confirmado.

### 1. Acesse Webhooks
- URL: https://dashboard.stripe.com/test/webhooks

### 2. Clique em **"Add endpoint"**

### 3. Configure o Endpoint

**Endpoint URL**:
```
https://seu-dominio.com/api/webhooks/stripe
```

Se estiver testando localmente, use **Stripe CLI** ou **ngrok**:
```
https://seu-ngrok.ngrok.io/api/webhooks/stripe
```

### 4. Selecione os Eventos:

Marque estes eventos importantes:
- ✅ `checkout.session.completed`
- ✅ `checkout.session.async_payment_succeeded`
- ✅ `payment_intent.succeeded`
- ✅ `charge.refunded`

### 5. Copie o Webhook Secret

Após criar, copie o **Signing secret**:
```
whsec_xxxxxxxxxxxxx
```

### 6. Adicione ao `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_sua_chave_webhook
```

---

## ⚙️ Configurar Variáveis de Ambiente

### Arquivo `.env` completo:

```env
# STRIPE
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_publica
STRIPE_SECRET_KEY=sk_test_sua_chave_secreta
STRIPE_WEBHOOK_SECRET=whsec_sua_chave_webhook

# SUPABASE
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_KEY=sua_service_key

# SERVIDOR
PORT=3001
FRONTEND_URL=http://localhost:8080
VITE_BACKEND_URL=http://localhost:3001
```

---

## 🧪 Testar Pagamentos

### 1. Inicie o Backend

```bash
cd server
npm install
npm start
```

### 2. Inicie o Frontend

```bash
cd cv-gratis-builder
npm run dev
```

### 3. Teste com Cartões de Teste

Use estes cartões fornecidos pelo Stripe:

| Cenário | Número do Cartão | CVV | Validade |
|---------|------------------|-----|----------|
| ✅ Sucesso | 4242 4242 4242 4242 | 123 | Qualquer futura |
| ❌ Recusado | 4000 0000 0000 0002 | 123 | Qualquer futura |
| 🔄 Requer autenticação | 4000 0027 6000 3184 | 123 | Qualquer futura |

**Dados adicionais para teste**:
- **Nome**: Qualquer nome
- **Email**: test@example.com
- **CEP**: Qualquer

### 4. Fluxo de Teste Completo

1. Acesse o seletor de templates
2. Escolha um template premium
3. Clique em "Comprar Premium"
4. Use cartão de teste: `4242 4242 4242 4242`
5. Após pagamento:
   - ✅ **Sucesso**: Redireciona para `/premium-editor?template=xxx&payment=success`
   - ❌ **Cancelamento**: Volta para `/template-selector?payment=cancelled`

### 5. Verificar no Dashboard

- Acesse: https://dashboard.stripe.com/test/payments
- Verifique se o pagamento apareceu
- Confirme se o webhook foi recebido em: https://dashboard.stripe.com/test/webhooks

---

## 🌐 Produção

### 1. Trocar para Modo Live

No Dashboard do Stripe:
1. Clique em **"Activate your account"**
2. Preencha as informações bancárias
3. Complete a verificação

### 2. Obter Chaves de Produção

- URL: https://dashboard.stripe.com/apikeys
- Copie as chaves **live** (começam com `pk_live_` e `sk_live_`)

### 3. Atualizar `.env` de Produção

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_sua_chave_publica_live
STRIPE_SECRET_KEY=sk_live_sua_chave_secreta_live
STRIPE_WEBHOOK_SECRET=whsec_sua_chave_webhook_live
NODE_ENV=production
```

### 4. Reconfigurar Webhooks para Produção

- URL: https://dashboard.stripe.com/webhooks
- Adicione endpoint com URL de produção
- Copie novo webhook secret

### 5. Testar em Produção

⚠️ **ATENÇÃO**: Em produção, use cartões REAIS. Você será cobrado!

---

## 🔍 Monitoramento e Logs

### Ver Logs do Webhook

```bash
# No terminal do servidor
tail -f server.log
```

### Dashboard do Stripe

- **Pagamentos**: https://dashboard.stripe.com/payments
- **Clientes**: https://dashboard.stripe.com/customers
- **Webhooks**: https://dashboard.stripe.com/webhooks
- **Eventos**: https://dashboard.stripe.com/events

---

## 🐛 Troubleshooting

### Webhook não está recebendo eventos

1. Verifique se o servidor está rodando
2. Teste o endpoint: `curl https://seu-site.com/health`
3. Use Stripe CLI para testar localmente:

```bash
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```

### Pagamento não desbloqueia template

1. Verifique logs do webhook
2. Confirme que o Supabase está configurado
3. Verifique se a tabela `purchases` existe
4. Teste manualmente:

```bash
curl -X POST http://localhost:3001/api/webhooks/stripe/test \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","templateId":"premium-executive"}'
```

### Erro: "Stripe não configurado"

- Confirme que as variáveis de ambiente estão no `.env`
- Reinicie o servidor após alterar `.env`
- Verifique se as chaves são válidas

---

## 📚 Recursos Úteis

- 📖 [Documentação Stripe](https://stripe.com/docs)
- 🔧 [Stripe CLI](https://stripe.com/docs/stripe-cli)
- 🧪 [Cartões de Teste](https://stripe.com/docs/testing)
- 💬 [Suporte Stripe](https://support.stripe.com/)
- 🎓 [Tutoriais Stripe](https://stripe.com/docs/development/quickstart)

---

## ✅ Checklist Final

Antes de ir para produção:

- [ ] Chaves de API configuradas (live mode)
- [ ] Webhook configurado com URL de produção
- [ ] Supabase em produção configurado
- [ ] URLs de sucesso/cancelamento corretas
- [ ] Testado fluxo completo de pagamento
- [ ] Metadata dos produtos configurada
- [ ] Monitoramento de webhooks ativo
- [ ] Backup da tabela `purchases` configurado
- [ ] Política de reembolso definida
- [ ] Termos de uso atualizados

---

## 🤝 Suporte

Problemas? Entre em contato:
- 📧 Email: contato@curriculogratisonline.com
- 💬 Issues: https://github.com/seu-usuario/cv-gratis-builder/issues

---

**🎉 Pronto! Seu sistema de pagamentos Stripe está configurado!**

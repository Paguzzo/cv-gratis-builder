# ⚡ Configuração Rápida do Stripe - 10 Minutos

## 🎯 O QUE VOCÊ PRECISA FAZER

Seguir **4 passos simples** para configurar o Stripe:

1. ✅ Obter chaves da API
2. ✅ Criar Payment Link
3. ✅ Atualizar .env
4. ✅ Testar pagamento

---

## 📝 PASSO 1: OBTER CHAVES DA API (2 min)

### 1.1 Acesse seu Dashboard do Stripe

```
https://dashboard.stripe.com/login
```

### 1.2 Vá para API Keys

```
https://dashboard.stripe.com/apikeys
```

### 1.3 Copie as 2 Chaves

Você verá algo assim:

```
┌─────────────────────────────────────────┐
│ Publishable key                         │
│ pk_live_51xxxxxxxxxxxxx                 │  ← COPIE ESTA
│                                         │
│ Secret key                              │
│ sk_live_51xxxxxxxxxxxxx                 │  ← COPIE ESTA
└─────────────────────────────────────────┘
```

**IMPORTANTE**:
- ✅ Use chaves de **TESTE** (`pk_test_...` e `sk_test_...`) para testar
- ✅ Use chaves de **LIVE** (`pk_live_...` e `sk_live_...`) para produção

---

## 📝 PASSO 2: CRIAR PAYMENT LINK (3 min)

### 2.1 Acesse Payment Links

```
https://dashboard.stripe.com/payment-links
```

### 2.2 Clique em "New" (Novo)

### 2.3 Preencha o Formulário

```
┌────────────────────────────────────────────────┐
│ Product name:                                  │
│ ┌────────────────────────────────────────────┐ │
│ │ Template Premium                           │ │
│ └────────────────────────────────────────────┘ │
│                                                │
│ Price:                                         │
│ ┌──────┐  ┌─────┐                            │
│ │ 4.90 │  │ BRL │                            │
│ └──────┘  └─────┘                            │
└────────────────────────────────────────────────┘
```

### 2.4 Configure URLs de Retorno

**IMPORTANTE**: Para desenvolvimento local:

```
After successful payment:
┌────────────────────────────────────────────────────────────┐
│ http://localhost:8080/premium-editor?session_id=           │
│ {CHECKOUT_SESSION_ID}&payment=success                      │
└────────────────────────────────────────────────────────────┘

If customer cancels:
┌────────────────────────────────────────────────────────────┐
│ http://localhost:8080/template-selector?payment=cancelled  │
└────────────────────────────────────────────────────────────┘
```

**Para produção** (quando for ao ar):

```
After successful payment:
┌────────────────────────────────────────────────────────────┐
│ https://seudomain.com/premium-editor?session_id=           │
│ {CHECKOUT_SESSION_ID}&payment=success                      │
└────────────────────────────────────────────────────────────┘

If customer cancels:
┌────────────────────────────────────────────────────────────┐
│ https://seudomain.com/template-selector?payment=cancelled  │
└────────────────────────────────────────────────────────────┘
```

### 2.5 Configure Coleta de Email

```
┌────────────────────────────────────┐
│ Collect customer information       │
│ ✅ Email address (required)        │
└────────────────────────────────────┘
```

### 2.6 (Opcional) Adicione Metadata

```
┌──────────────────────────────────────┐
│ Metadata                             │
│ ┌──────────────┬───────────────────┐ │
│ │ Key          │ Value             │ │
│ ├──────────────┼───────────────────┤ │
│ │ template_id  │ premium-executive │ │
│ │ source       │ curriculo_gratis  │ │
│ └──────────────┴───────────────────┘ │
└──────────────────────────────────────┘
```

### 2.7 Clique em "Create link"

### 2.8 COPIE O LINK GERADO

Você receberá um link assim:

```
https://buy.stripe.com/test_14k2x7xxxxxx
```

**⚠️ GUARDE ESTE LINK!**

---

## 📝 PASSO 3: ATUALIZAR .ENV (1 min)

Edite o arquivo `.env` na raiz do projeto:

```env
# 💳 STRIPE - Pagamentos
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_SUA_CHAVE_AQUI
STRIPE_SECRET_KEY=sk_test_SUA_CHAVE_AQUI
VITE_STRIPE_PAYMENT_LINK=https://buy.stripe.com/test_SEU_LINK_AQUI
STRIPE_WEBHOOK_SECRET=whsec_SUA_WEBHOOK_SECRET
```

**Substitua**:
- `SUA_CHAVE_AQUI` pelas chaves que você copiou no **Passo 1**
- `SEU_LINK_AQUI` pelo link que você copiou no **Passo 2**

---

## 📝 PASSO 4: TESTAR PAGAMENTO (4 min)

### 4.1 Reinicie os Servidores

```bash
# Pare os servidores (Ctrl + C)
# Inicie novamente:

# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd server
npm start
```

### 4.2 Acesse o Site

```
http://localhost:8080/template-selector
```

### 4.3 Clique em "Comprar Premium"

### 4.4 Use Cartão de Teste

```
┌──────────────────────────────────────────┐
│ Card number:                             │
│ ┌──────────────────────────────────────┐ │
│ │ 4242 4242 4242 4242                  │ │  ← TESTE
│ └──────────────────────────────────────┘ │
│                                          │
│ MM/YY        CVC                         │
│ ┌──────┐    ┌──────┐                    │
│ │ 12/25│    │ 123  │                    │
│ └──────┘    └──────┘                    │
│                                          │
│ Email:                                   │
│ ┌──────────────────────────────────────┐ │
│ │ test@example.com                     │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

**Outros cartões de teste do Stripe**:

| Cartão | Resultado |
|--------|-----------|
| 4242 4242 4242 4242 | ✅ Sucesso |
| 4000 0000 0000 0002 | ❌ Recusado |
| 4000 0027 6000 3184 | 🔐 Requer autenticação |

### 4.5 Confirme o Pagamento

Após clicar em "Pay", você será:
1. ✅ Redirecionado para `/premium-editor` (sucesso)
2. ❌ Redirecionado para `/template-selector` (cancelado)

---

## ✅ CHECKLIST DE VERIFICAÇÃO

Marque cada item conforme completa:

- [ ] Chaves da API copiadas do Dashboard
- [ ] Payment Link criado com URLs corretas
- [ ] `.env` atualizado com chaves e link
- [ ] Servidores reiniciados
- [ ] Teste com cartão `4242 4242 4242 4242`
- [ ] Redirecionamento para premium-editor funcionou
- [ ] Template foi desbloqueado

---

## 🔍 VERIFICAR SE FUNCIONOU

### No Dashboard do Stripe

Acesse:
```
https://dashboard.stripe.com/payments
```

Você deve ver o pagamento de **R$ 4,90** listado.

### No Console do Navegador

Pressione **F12** e veja os logs:
```
💳 PAGAMENTO CARTÃO: Redirecionando para Stripe real: premium-executive
🎯 STRIPE: Redirecionando para: https://buy.stripe.com/...
✅ STRIPE: Success URL: http://localhost:8080/premium-editor?...
```

---

## 🐛 PROBLEMAS COMUNS

### Erro: "Payment link não encontrado"

**Solução**: Verifique se copiou o link completo incluindo `https://`

### Erro: "Invalid API key"

**Solução**:
1. Verifique se as chaves começam com `pk_` e `sk_`
2. Confirme que não copiou espaços extras
3. Reinicie os servidores após alterar `.env`

### Erro: "ERR_CONNECTION_REFUSED"

**Solução**: Servidores não estão rodando. Execute:
```bash
npm run dev  # Frontend
cd server && npm start  # Backend
```

### Pagamento não desbloqueia template

**Solução**:
1. Verifique se o webhook está configurado (Passo 5)
2. Teste manualmente:
```bash
curl -X POST http://localhost:3001/api/webhooks/stripe/test \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","templateId":"premium-executive"}'
```

---

## 🚀 PRÓXIMO PASSO (OPCIONAL): WEBHOOK

Para **confirmação automática** de pagamentos, configure o webhook:

1. Acesse: https://dashboard.stripe.com/webhooks
2. Clique em "Add endpoint"
3. URL: `https://seu-dominio.com/api/webhooks/stripe`
4. Eventos: `checkout.session.completed`
5. Copie o **Signing secret** (começa com `whsec_...`)
6. Adicione ao `.env`: `STRIPE_WEBHOOK_SECRET=whsec_...`

**Para desenvolvimento local**, use **Stripe CLI**:
```bash
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```

---

## 📚 DOCUMENTAÇÃO COMPLETA

Para configuração detalhada e produção:
- 📖 [STRIPE_SETUP.md](./STRIPE_SETUP.md)
- 🔄 [PAYMENT_FLOW.md](./PAYMENT_FLOW.md)
- ⚡ [QUICK_START_STRIPE.md](./QUICK_START_STRIPE.md)

---

## 🎉 PRONTO!

Seu gateway de pagamento Stripe está configurado!

**Tempo estimado**: ~10 minutos
**Dificuldade**: Fácil

**Dúvidas?** Consulte a documentação completa ou entre em contato.

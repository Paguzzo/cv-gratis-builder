# ⚡ Quick Start - Stripe em 5 Minutos

Configure o Stripe rapidamente para aceitar pagamentos de templates premium.

---

## 🎯 Passo a Passo Rápido

### 1. Criar Conta no Stripe (2 min)

```bash
# Acesse e crie sua conta gratuita:
https://dashboard.stripe.com/register
```

✅ Ative o **modo de teste** após criar a conta

---

### 2. Copiar Chaves da API (1 min)

```bash
# Acesse:
https://dashboard.stripe.com/test/apikeys

# Copie as chaves:
# - Publishable key (pk_test_...)
# - Secret key (sk_test_...)
```

---

### 3. Configurar Variáveis de Ambiente (1 min)

Crie o arquivo `.env` na raiz do projeto:

```env
# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_SUA_CHAVE_PUBLICA
STRIPE_SECRET_KEY=sk_test_SUA_CHAVE_SECRETA

# Supabase (se ainda não tiver)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_KEY=sua_service_key

# Backend
PORT=3001
FRONTEND_URL=http://localhost:8080
VITE_BACKEND_URL=http://localhost:3001
```

---

### 4. Criar Payment Link no Stripe (2 min)

```bash
# 1. Acesse:
https://dashboard.stripe.com/test/payment-links

# 2. Clique em "New" (Novo)

# 3. Preencha:
Nome: Template Premium
Preço: 4.90 BRL

# 4. Em "After payment":
Success URL: http://localhost:8080/premium-editor?session_id={CHECKOUT_SESSION_ID}&payment=success
Cancel URL: http://localhost:8080/template-selector?payment=cancelled

# 5. Em "Metadata" (Adicionar metadados):
template_id: premium-executive
template_name: Template Executive

# 6. Copie o link gerado (ex: buy.stripe.com/test_xxxxx)
```

---

### 5. Atualizar Payment Link no Código (30 seg)

Edite o arquivo: `src/components/ui/payment-dialog.tsx`

Linha 37, substitua:
```typescript
const stripeUrl = 'https://buy.stripe.com/aFa7sMf0t2rl34gaEK';
```

Por:
```typescript
const stripeUrl = 'SEU_LINK_DO_STRIPE_AQUI';
```

---

### 6. Iniciar Servidores (1 min)

Terminal 1 - Backend:
```bash
cd server
npm install   # primeira vez
npm start
```

Terminal 2 - Frontend:
```bash
cd ..
npm install   # primeira vez
npm run dev
```

---

### 7. Testar Pagamento (1 min)

1. Acesse: `http://localhost:8080`
2. Complete um currículo
3. Vá para seleção de templates
4. Escolha um template premium
5. Clique em "Comprar Premium"
6. Use cartão de teste: **4242 4242 4242 4242**
7. CVV: **123**
8. Validade: **12/25**
9. Email: **test@example.com**

✅ **Sucesso!** Você será redirecionado para o editor premium

---

## 🔍 Verificar se Funcionou

### No Dashboard do Stripe:
```bash
https://dashboard.stripe.com/test/payments
# Você deve ver o pagamento de R$ 4,90
```

### No Console do Backend:
```
✅ Checkout session completado: cs_test_xxxxx
✅ Compra registrada com sucesso: test@example.com -> premium-executive
💰 Valor: BRL 4.90
```

---

## 🐛 Problemas Comuns

### ❌ "Stripe não configurado"

**Solução**:
```bash
# Verifique se o .env está correto
cat .env

# Reinicie o backend
cd server
npm start
```

### ❌ "Webhook não recebe eventos"

**Para desenvolvimento local, use Stripe CLI**:
```bash
# Instalar Stripe CLI
brew install stripe/stripe-cli/stripe  # Mac
# ou
scoop install stripe                   # Windows

# Fazer login
stripe login

# Redirecionar webhooks
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```

### ❌ "Template não desbloqueia após pagamento"

**Solução**:
1. Verifique se o Supabase está configurado
2. Confirme que a tabela `purchases` existe
3. Teste manualmente:

```bash
curl -X POST http://localhost:3001/api/webhooks/stripe/test \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","templateId":"premium-executive"}'
```

---

## 🎨 Customizar Design do Dialog

O PaymentDialog já está estilizado profissionalmente com:
- ✨ Gradiente vibrante no header
- 💳 Tabs elegantes para Cartão/PIX
- 🎨 Cards informativos
- 💰 Destaque visual no preço
- 🔒 Indicadores de segurança

Nenhuma customização necessária! Mas se quiser ajustar:

Arquivo: `src/components/ui/payment-dialog.tsx`

---

## 📋 Próximos Passos

Após configurar e testar:

1. ✅ Configure webhook no Stripe Dashboard
2. ✅ Teste reembolso
3. ✅ Configure PIX (opcional)
4. ✅ Prepare para produção (chaves live)

Ver guias completos:
- 📖 [STRIPE_SETUP.md](./STRIPE_SETUP.md) - Configuração detalhada
- 🔄 [PAYMENT_FLOW.md](./PAYMENT_FLOW.md) - Arquitetura do fluxo

---

## ✅ Checklist de Configuração

- [ ] Conta Stripe criada
- [ ] Chaves da API copiadas
- [ ] `.env` configurado
- [ ] Payment Link criado
- [ ] Link atualizado no código
- [ ] Backend rodando (porta 3001)
- [ ] Frontend rodando (porta 8080)
- [ ] Pagamento testado com cartão de teste
- [ ] Pagamento apareceu no Dashboard Stripe
- [ ] Template desbloqueado após pagamento

---

## 🚀 Está Pronto!

Seu sistema de pagamentos Stripe está configurado e funcionando!

**Suporte**:
- 📧 Email: contato@curriculogratisonline.com
- 📖 Docs: [STRIPE_SETUP.md](./STRIPE_SETUP.md)
- 🔄 Fluxo: [PAYMENT_FLOW.md](./PAYMENT_FLOW.md)

---

**Tempo total**: ~10 minutos ⏱️

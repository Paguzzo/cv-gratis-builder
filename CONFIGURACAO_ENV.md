# 🔐 Configuração das Variáveis de Ambiente - CVGratis

## 📋 Template para o arquivo .env

Copie o conteúdo abaixo e cole no seu arquivo `.env` na raiz do projeto:

```env
# 🔐 VARIÁVEIS DE AMBIENTE - CVGratis
# ⚠️ SUBSTITUA OS VALORES DE EXEMPLO PELAS SUAS CHAVES REAIS

# 💳 STRIPE - Pagamentos
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51234567890abcdefghijklmnop
STRIPE_SECRET_KEY=sk_test_51234567890abcdefghijklmnop
VITE_STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdefghijklmnop

# 📧 RESEND - Email Service
VITE_RESEND_API_KEY=re_AbCdEfGh_1234567890abcdefghijklmnop
RESEND_FROM_EMAIL=noreply@curriculogratisonline.com

# 🤖 OPENAI - IA para Currículos
VITE_OPENAI_API_KEY=sk-proj-1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=1500

# 📊 EMAILJS - Fallback Email (opcional)
VITE_EMAILJS_SERVICE_ID=service_1234567
VITE_EMAILJS_TEMPLATE_ID=template_1234567
VITE_EMAILJS_PUBLIC_KEY=abcdefghijk1234567

# 🌐 CONFIGURAÇÕES DO APP
VITE_APP_URL=https://www.curriculogratisonline.com
VITE_APP_NAME=CVGratis
VITE_APP_VERSION=1.0.0

# 🔧 AMBIENTE
NODE_ENV=production
VITE_ENV=production
```

## 🔑 Onde Conseguir as Chaves de API

### 💳 **Stripe (Pagamentos)**
1. Acesse: https://dashboard.stripe.com/apikeys
2. Copie a **Publishable key** → `VITE_STRIPE_PUBLISHABLE_KEY`
3. Copie a **Secret key** → `STRIPE_SECRET_KEY`
4. Para webhooks: https://dashboard.stripe.com/webhooks

### 📧 **Resend (Email)**
1. Acesse: https://resend.com/api-keys
2. Crie uma nova API key
3. Copie a chave → `VITE_RESEND_API_KEY`

### 🤖 **OpenAI (IA)**
1. Acesse: https://platform.openai.com/api-keys
2. Crie uma nova API key
3. Copie a chave → `VITE_OPENAI_API_KEY`

### 📊 **EmailJS (Fallback - Opcional)**
1. Acesse: https://www.emailjs.com/
2. Crie uma conta e configure um serviço
3. Copie as chaves necessárias

## ⚠️ **IMPORTANTES OBSERVAÇÕES**

### 🔒 **Segurança**
- ✅ Arquivo `.env` já está no `.gitignore`
- ✅ Nunca commite chaves reais no Git
- ✅ Use chaves de **TESTE** em desenvolvimento
- ✅ Use chaves de **PRODUÇÃO** apenas no deploy

### 🎯 **Variáveis VITE_**
- Variáveis com `VITE_` ficam **expostas no frontend**
- Use apenas para chaves que podem ser públicas
- Chaves secretas **NÃO** devem ter prefixo `VITE_`

### 📝 **Exemplo de Substituição**

```diff
// Antes (exemplo):
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51234567890abcdefghijklmnop

// Depois (sua chave real):
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51AbCdEf7M8N9pQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYz123456789
```

## 🚀 **Como Usar**

1. **Copie** o template acima
2. **Cole** no seu arquivo `.env`
3. **Substitua** os valores de exemplo pelas suas chaves reais
4. **Salve** o arquivo
5. **Reinicie** o servidor de desenvolvimento (`npm run dev`)

## 🔧 **Testando as Configurações**

Após configurar, você pode testar:

```javascript
// No console do navegador (F12):
console.log('Stripe:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
console.log('OpenAI:', import.meta.env.VITE_OPENAI_API_KEY);
console.log('Resend:', import.meta.env.VITE_RESEND_API_KEY);
```

---

**✅ Configure suas APIs e potencialize o CVGratis!** 
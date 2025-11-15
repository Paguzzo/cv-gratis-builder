# Deploy na Vercel - CV Grátis Builder

Este guia explica como fazer o deploy completo do projeto na Vercel com todas as funcionalidades.

## Pré-requisitos

1. Conta na [Vercel](https://vercel.com)
2. Repositório no GitHub/GitLab/Bitbucket
3. Contas configuradas em:
   - [Neon Database](https://neon.tech) (banco de dados PostgreSQL serverless)
   - [Resend](https://resend.com) (envio de emails)
   - [Stripe](https://stripe.com) (pagamentos)
   - [xAI/GROK](https://x.ai) ou [OpenAI](https://openai.com) (IA)

## Passo 1: Configurar Neon Database

1. Acesse [console.neon.tech](https://console.neon.tech)
2. Crie um novo projeto
3. Copie a **Connection String**
4. Execute o script SQL em `database/schema.sql` no SQL Editor do Neon

## Passo 2: Deploy na Vercel

### Via Dashboard:

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe seu repositório
3. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Via CLI:

```bash
npx vercel --prod
```

## Passo 3: Configurar Variáveis de Ambiente

No Dashboard da Vercel → Settings → Environment Variables, adicione:

### Obrigatórias:

```env
# Neon Database
DATABASE_URL=postgres://user:pass@host.neon.tech/db?sslmode=require

# Resend (Email)
RESEND_API_KEY=re_xxx
FROM_EMAIL=CV Grátis <noreply@seudominio.com>

# Stripe (Pagamentos)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# IA (escolha um)
GROK_API_KEY=xai-xxx
# ou
OPENAI_API_KEY=sk-xxx

# Admin
JWT_SECRET=sua-chave-secreta-com-pelo-menos-32-caracteres
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=hash-sha256-da-senha
```

### Frontend (prefixo VITE_):

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyxxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

## Passo 4: Configurar Webhook do Stripe

1. No Stripe Dashboard → Developers → Webhooks
2. Adicione endpoint: `https://seu-dominio.vercel.app/api/webhook/stripe`
3. Selecione eventos:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copie o Webhook Secret para `STRIPE_WEBHOOK_SECRET`

## Passo 5: Configurar Domínio (Opcional)

1. Vercel Dashboard → Settings → Domains
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções

## Estrutura da API

Após o deploy, você terá os seguintes endpoints disponíveis:

### Públicos:
- `GET /api/health` - Health check
- `POST /api/send-email` - Envio de emails

### IA:
- `POST /api/ai/generate-objective` - Gerar objetivo profissional
- `POST /api/ai/generate-experience` - Gerar experiência
- `POST /api/ai/generate-cover-letter` - Gerar carta de apresentação
- `POST /api/ai/check-curriculum` - Avaliar currículo
- `POST /api/ai/chat` - Chat com JobAI

### Premium:
- `GET/POST /api/premium/check` - Verificar acesso premium
- `POST /api/secure/payments/create-intent` - Criar pagamento

### Admin:
- `POST /api/secure/admin/login` - Login admin
- `POST /api/secure/admin/verify` - Verificar token

### Webhooks:
- `POST /api/webhook/stripe` - Webhook do Stripe

## Testar Localmente

Para testar as funções localmente:

```bash
npm install
npm install -g vercel
vercel dev
```

Isso iniciará o Vite dev server + funções serverless em `http://localhost:3000`

## Solução de Problemas

### Build Falhou
- Verifique se todas as dependências estão no package.json
- Execute `npm run build` localmente primeiro

### API Retornando 500
- Verifique as variáveis de ambiente no Vercel Dashboard
- Olhe os logs em Vercel → Deployments → Functions

### Stripe Webhook Não Funciona
- Verifique se o STRIPE_WEBHOOK_SECRET está correto
- Teste com Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhook/stripe`

### Banco de Dados Não Conecta
- Verifique se a DATABASE_URL está correta
- Execute o schema.sql no Neon

## Monitoramento

- **Logs**: Vercel Dashboard → Deployments → View Function Logs
- **Analytics**: Vercel Dashboard → Analytics
- **Erros**: Vercel Dashboard → Monitoring

## Custos Estimados

- **Vercel**: Gratuito até 100GB bandwidth/mês
- **Neon**: Gratuito até 0.5GB storage
- **Resend**: Gratuito até 100 emails/dia
- **Stripe**: 2.9% + R$0.60 por transação
- **GROK/OpenAI**: Pay as you go

## Suporte

Em caso de problemas:
1. Verifique os logs da Vercel
2. Teste endpoints individualmente
3. Consulte documentação de cada serviço

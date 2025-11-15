# 🔒 DOCUMENTAÇÃO DE SEGURANÇA - CV Grátis Builder

## ⚠️ AÇÕES CRÍTICAS REALIZADAS

Esta documentação descreve as correções de segurança críticas implementadas no projeto.

---

## 🚨 CORREÇÕES CRÍTICAS IMPLEMENTADAS

### 1. Remoção de Arquivos .env do Histórico Git

**Problema:** Arquivos `.env` com chaves secretas estavam no histórico do Git.

**Solução Aplicada:**
```bash
✅ Executado git filter-branch para remover .env do histórico
✅ Limpeza de refs e garbage collection
✅ Atualizado .gitignore com proteções adicionais
```

**⚠️ AÇÃO OBRIGATÓRIA ANTES DO DEPLOY:**

1. **REVOGAR IMEDIATAMENTE** todas as chaves de API expostas:
   - Stripe Dashboard → Developers → API Keys → Revogar e gerar novas
   - OpenAI Dashboard → API Keys → Revogar
   - X.AI (GROK) → API Keys → Revogar
   - Resend → API Keys → Revogar

2. **Gerar novas chaves** em todos os serviços

3. **Configurar secrets** na plataforma de deploy:
   ```bash
   # GitHub Secrets (se usar GitHub Actions)
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   VITE_STRIPE_PUBLISHABLE_KEY
   RESEND_API_KEY
   GROK_API_KEY
   OPENAI_API_KEY
   STRIPE_SECRET_KEY
   STRIPE_WEBHOOK_SECRET
   JWT_SECRET
   ```

### 2. Remoção de Credenciais Hardcoded

**Problema:** Credenciais de admin hardcoded em `useAdminAuth.ts`:
```typescript
// ❌ REMOVIDO
username: 'admin'
password: 'cvgratis@2025'
```

**Solução Aplicada:**
```typescript
✅ Autenticação APENAS via backend
✅ Tokens JWT validados no servidor
✅ Credenciais em variáveis de ambiente do backend
```

**Configuração Necessária:**

No arquivo `server/.env`, adicione:
```env
ADMIN_USERNAME=seu_usuario_admin
ADMIN_PASSWORD_HASH=hash_bcrypt_da_senha
JWT_SECRET=chave_criptograficamente_segura_256_bits
```

**Gerar hash de senha:**
```bash
cd server
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('sua_senha_forte', 10, (e,h) => console.log(h));"
```

### 3. Atualização de Dependências Vulneráveis

**Vulnerabilidades Corrigidas:**
```
✅ jspdf atualizado (XSS via dompurify) - CRÍTICO
✅ validator atualizado (URL validation bypass) - MODERADO
✅ brace-expansion, nanoid atualizados
```

**Status Atual:**
- Frontend: **0 vulnerabilidades em produção**
- Backend: **0 vulnerabilidades**

### 4. Proteção CSRF Implementada

**Adicionado:** Middleware `csrf-sync` no backend

**Rotas Protegidas:**
- ✅ `/api/secure/admin/login` (Login administrativo)
- ✅ `/api/secure/admin/verify` (Verificação de token)
- ✅ `/api/secure/admin/refresh` (Refresh de token)
- ✅ `/api/secure/admin/logout` (Logout)

**Como Usar:**

1. **Obter token CSRF:**
```javascript
const response = await fetch('/api/csrf-token');
const { csrfToken } = await response.json();
```

2. **Incluir em requisições:**
```javascript
fetch('/api/secure/admin/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-csrf-token': csrfToken
  },
  body: JSON.stringify({ username, password })
});
```

### 5. Configurações de Segurança Aprimoradas

**Headers de Segurança (Helmet.js):**
```javascript
✅ Content Security Policy (sem unsafe-inline)
✅ HSTS (HTTP Strict Transport Security)
✅ X-Frame-Options: DENY (anti-clickjacking)
✅ X-Content-Type-Options: nosniff
✅ XSS Filter habilitado
✅ Referrer Policy configurada
```

**CORS Configurado:**
- Origem restrita (variável FRONTEND_URL)
- Credentials habilitados

**Rate Limiting:**
- API geral: 100 req/15min
- Login admin: 5 req/15min

### 6. Build Otimizado com Source Maps

**Configurações Vite:**
```typescript
✅ Source maps habilitados (debug em produção)
✅ Manual chunks (react, ui, pdf, stripe, icons)
✅ Cache busting com hashes
✅ CSS code splitting
✅ Minificação otimizada com esbuild
```

**Benefícios:**
- Melhor caching do navegador
- Bundle size otimizado
- Debug facilitado em produção

### 7. CI/CD Pipeline Configurado

**GitHub Actions Workflow:**
```
✅ Lint e validação de código
✅ Auditoria de segurança automática
✅ Verificação de secrets expostos
✅ Build automático
✅ Deploy staging/production
```

**Arquivo:** `.github/workflows/ci-cd.yml`

---

## 📋 CHECKLIST PRÉ-DEPLOY

### Antes de Fazer Deploy:

- [ ] **1. Revogar todas as chaves de API antigas**
  - [ ] Stripe (Dashboard)
  - [ ] OpenAI (API Keys)
  - [ ] GROK/X.AI (API Keys)
  - [ ] Resend (API Keys)

- [ ] **2. Gerar novas chaves de API**
  - [ ] Stripe Secret Key (sk_live_...)
  - [ ] Stripe Publishable Key (pk_live_...)
  - [ ] Stripe Webhook Secret
  - [ ] OpenAI API Key
  - [ ] GROK API Key
  - [ ] Resend API Key

- [ ] **3. Configurar variáveis de ambiente na plataforma**
  - [ ] GitHub Secrets (se usar Actions)
  - [ ] Vercel/Netlify Environment Variables
  - [ ] Backend: arquivo .env com secrets

- [ ] **4. Gerar JWT Secret forte**
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```

- [ ] **5. Criar hash de senha admin**
  ```bash
  cd server
  npm install bcrypt
  node -e "const bcrypt = require('bcrypt'); bcrypt.hash('SUA_SENHA_FORTE', 10, (e,h) => console.log(h));"
  ```

- [ ] **6. Atualizar arquivo server/.env**
  ```env
  JWT_SECRET=seu_jwt_secret_aqui
  ADMIN_USERNAME=admin
  ADMIN_PASSWORD_HASH=hash_gerado_no_passo_5
  STRIPE_SECRET_KEY=nova_chave_stripe
  RESEND_API_KEY=nova_chave_resend
  GROK_API_KEY=nova_chave_grok
  OPENAI_API_KEY=nova_chave_openai
  ```

- [ ] **7. Testar build local**
  ```bash
  npm run build
  npm run preview
  ```

- [ ] **8. Verificar que .env não está no Git**
  ```bash
  git status
  # .env NÃO deve aparecer na lista
  ```

- [ ] **9. Testar backend localmente**
  ```bash
  cd server
  npm start
  # Verificar se inicia sem erros
  ```

- [ ] **10. Push para repositório**
  ```bash
  git add .
  git commit -m "security: Apply critical security fixes"
  git push origin main
  ```

---

## 🔐 MELHORES PRÁTICAS DE SEGURANÇA

### 1. Gestão de Secrets

**NUNCA:**
- ❌ Commitar arquivos .env
- ❌ Hardcodar credenciais no código
- ❌ Compartilhar secrets via email/chat
- ❌ Usar chaves de desenvolvimento em produção

**SEMPRE:**
- ✅ Usar variáveis de ambiente
- ✅ Usar secrets manager da plataforma
- ✅ Rotacionar secrets periodicamente
- ✅ Usar diferentes secrets para dev/staging/prod

### 2. Autenticação

**Backend:**
- ✅ JWT com secret forte (256 bits)
- ✅ Tokens com expiração (24h)
- ✅ Refresh tokens
- ✅ bcrypt para hashing de senhas (cost 10+)

**Frontend:**
- ✅ Tokens em httpOnly cookies (quando possível)
- ✅ CSRF protection em todas as rotas sensíveis
- ✅ Rate limiting

### 3. Dependências

**Manutenção:**
```bash
# Verificar vulnerabilidades mensalmente
npm audit

# Atualizar dependências
npm update

# Verificar dependências desatualizadas
npm outdated
```

### 4. Monitoramento

**Implementar:**
- Sentry ou similar para error tracking
- Log aggregation (Logtail, Papertrail)
- Uptime monitoring (UptimeRobot, Pingdom)
- Security headers checker (securityheaders.com)

---

## 🚀 DEPLOY SEGURO

### Ordem de Deploy:

1. **Backend primeiro:**
   ```bash
   cd server
   # Deploy para plataforma (Heroku, Railway, etc)
   # Configurar variáveis de ambiente
   ```

2. **Frontend depois:**
   ```bash
   npm run build
   # Deploy para Vercel/Netlify
   # Configurar variáveis de ambiente públicas
   ```

3. **Verificação pós-deploy:**
   - [ ] Testar login administrativo
   - [ ] Testar criação de currículo
   - [ ] Testar export PDF
   - [ ] Testar envio de email
   - [ ] Testar integração Stripe
   - [ ] Verificar headers de segurança
   - [ ] Monitorar logs por 24h

---

## 📞 SUPORTE E REPORTAR VULNERABILIDADES

**Encontrou uma vulnerabilidade?**

Por favor, NÃO abra uma issue pública. Envie para:
- Email: security@curriculogratisonline.com
- Ou crie uma Security Advisory no GitHub

Responderemos em até 48 horas.

---

## 📚 REFERÊNCIAS

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [npm Security Best Practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Última atualização:** 11 de novembro de 2025
**Versão:** 1.0.0
**Autor:** Claude Code Security Audit

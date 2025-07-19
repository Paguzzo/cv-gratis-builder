# Configuração do EmailJS para CV Grátis Builder

## Para que o email funcione de verdade, siga estes passos:

### 1. Criar conta no EmailJS
1. Acesse: https://www.emailjs.com/
2. Crie uma conta gratuita
3. Confirme seu email

### 2. Configurar serviço de email
1. Vá em "Email Services" 
2. Clique "Add New Service"
3. Escolha "Gmail" ou outro provedor
4. Configure com suas credenciais
5. Copie o **Service ID** (ex: service_abc123)

### 3. Criar template de email
1. Vá em "Email Templates"
2. Clique "Create New Template"
3. Use este template:

```
Para: {{to_email}}
Assunto: {{subject}}

{{message}}

Anexo: {{attachment_name}}
Data: {{attachment_data}}

Enviado via CV Grátis Builder
```

4. Copie o **Template ID** (ex: template_xyz789)

### 4. Configurar chaves no código
Edite o arquivo `src/services/emailService.ts`:

```typescript
const EMAIL_CONFIG = {
  SERVICE_ID: 'SEU_SERVICE_ID_AQUI',
  TEMPLATE_ID: 'SEU_TEMPLATE_ID_AQUI', 
  PUBLIC_KEY: 'SUA_PUBLIC_KEY_AQUI'
};
```

### 5. Testar
1. Execute `npm run dev`
2. Acesse o editor premium
3. Clique "Email" 
4. Preencha dados e teste "Enviar Direto"

## Status Atual
- ✅ Código implementado
- ⚠️ Precisa configurar chaves do EmailJS
- ✅ Fallback funcionando (abre cliente local)

## Alternativas se EmailJS não funcionar:
- FormSpree.io
- Netlify Forms  
- SendGrid API
- Resend.com 
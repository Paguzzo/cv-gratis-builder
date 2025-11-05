# APIs para Envio Automático de Email

## 🚀 OPÇÕES RECOMENDADAS (Gratuitas/Baratas)

### 1. **Resend.com** ⭐ RECOMENDADO
```bash
npm install resend
```

**Vantagens:**
- ✅ 3.000 emails/mês GRÁTIS
- ✅ Anexos até 40MB
- ✅ API simples
- ✅ Boa entregabilidade

**Código:**
```typescript
import { Resend } from 'resend';

const resend = new Resend('re_123456789'); // Sua API key

await resend.emails.send({
  from: 'noreply@seudominio.com',
  to: 'destinatario@email.com',
  subject: 'Meu Currículo',
  html: '<p>Segue anexo meu currículo</p>',
  attachments: [{
    filename: 'curriculo.pdf',
    content: pdfBase64
  }]
});
```

### 2. **EmailJS** (Atual - Limitado)
**Problema:** Não envia anexos grandes
**Solução:** Usar para notificação + link de download

### 3. **SendGrid**
```bash
npm install @sendgrid/mail
```

**Vantagens:**
- ✅ 100 emails/dia GRÁTIS
- ✅ Anexos suportados
- ✅ Confiável

### 4. **Nodemailer + SMTP**
**Para backend próprio**

---

## 📧 IMPLEMENTAÇÃO RESEND (RECOMENDADA)

### Passo 1: Criar conta
1. Acesse: https://resend.com
2. Crie conta gratuita
3. Copie API key

### Passo 2: Instalar
```bash
npm install resend
```

### Passo 3: Implementar
```typescript
// src/services/resendService.ts
import { Resend } from 'resend';

const resend = new Resend('SUA_API_KEY_AQUI');

export class ResendService {
  static async sendCurriculumEmail(
    to: string, 
    subject: string, 
    message: string, 
    pdfBase64: string,
    fileName: string
  ) {
    try {
      const result = await resend.emails.send({
        from: 'curriculo@seudominio.com', // Precisa ser domínio verificado
        to: to,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h2>📄 Currículo Profissional</h2>
            <p>${message}</p>
            <p>📎 Currículo em anexo no formato PDF.</p>
            <hr>
            <small>Enviado via CV Grátis Builder</small>
          </div>
        `,
        attachments: [{
          filename: fileName,
          content: pdfBase64
        }]
      });
      
      return { success: true, id: result.data?.id };
    } catch (error) {
      console.error('Erro Resend:', error);
      return { success: false, error };
    }
  }
}
```

### Passo 4: Usar no PremiumEditor
```typescript
// No handleSendEmail, substituir EmailService por:
const result = await ResendService.sendCurriculumEmail(
  to, subject, message, pdfBase64, fileName
);

if (result.success) {
  toast.success(`✅ Email enviado automaticamente para ${to}!`);
} else {
  // Fallback para cliente local
}
```

---

## ⚡ SOLUÇÃO RÁPIDA (SEM API)

### Melhorar cliente local:
1. ✅ Baixar PDF automaticamente 
2. ✅ Instruções claras no email
3. ✅ Nome do arquivo no texto

**Status atual implementado:**
- PDF baixa automaticamente
- Email abre com instruções para anexar
- Nome do arquivo especificado

---

## 🎯 RECOMENDAÇÃO

**Para produção:** Use Resend.com
**Para teste:** Atual (cliente local) está OK

**Custo Resend:**
- 0-3.000 emails: GRÁTIS
- 3.001-50.000: $20/mês
- Anexos inclusos

Quer que eu implemente a integração com Resend? 
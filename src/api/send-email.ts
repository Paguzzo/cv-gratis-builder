/**
 * API ENDPOINT PARA ENVIO DE EMAIL VIA RESEND
 * Este endpoint resolve o problema de CORS
 */

export interface EmailRequest {
  to: string;
  subject: string;
  message: string;
  senderName: string;
  recipientName?: string;
  pdfBase64?: string;
  pdfFileName?: string;
}

export interface EmailResponse {
  success: boolean;
  emailId?: string;
  error?: string;
}

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || 'your_resend_api_key_here';
const FROM_EMAIL = 'contato@app.curriculogratisonline.com';
const RESEND_API_URL = 'https://api.resend.com/emails';

/**
 * Handler para requisições POST /api/send-email
 */
export default async function handler(req: Request): Promise<Response> {
  // Permitir apenas POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método não permitido' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    console.log('📧 API SEND-EMAIL: Processando requisição...');
    
    const emailData: EmailRequest = await req.json();
    
    console.log('📧 Dados recebidos:', {
      to: emailData.to,
      subject: emailData.subject,
      senderName: emailData.senderName,
      hasPDF: !!emailData.pdfBase64
    });

    // Validações
    if (!emailData.to || !emailData.subject || !emailData.message) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Campos obrigatórios: to, subject, message' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Preparar mensagem de texto
    const greeting = emailData.recipientName ? `Olá, ${emailData.recipientName}!` : 'Olá!';
    const textMessage = `${greeting}

${emailData.message}

---

Obrigado por usar o CurriculoGratisOnline.com! 🎉

Esperamos que este currículo te ajude a conquistar novas oportunidades profissionais.

${emailData.pdfBase64 ? '📎 Seu currículo em PDF está anexado a este email.' : '🔗 Acesse seu currículo online.'}

Boa sorte em sua jornada profissional!

---
Equipe CurriculoGratisOnline.com
✨ Criando oportunidades, um currículo por vez!

Enviado por: ${emailData.senderName}`;

    // Preparar mensagem HTML
    const htmlMessage = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Currículo - ${emailData.senderName}</title>
  <style>
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      margin: 0; 
      padding: 0; 
      background-color: #f5f5f5; 
    }
    .container { 
      max-width: 600px; 
      margin: 20px auto; 
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header { 
      background: linear-gradient(135deg, #2563eb, #1d4ed8); 
      color: white; 
      padding: 30px 20px; 
      text-align: center; 
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .header p {
      margin: 10px 0 0 0;
      opacity: 0.9;
      font-size: 16px;
    }
    .content { 
      padding: 30px 20px; 
      background: white;
    }
    .content p {
      margin: 0 0 15px 0;
      font-size: 15px;
    }
    .highlight {
      background: #f0f9ff;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #2563eb;
      margin: 20px 0;
    }
    .footer { 
      padding: 20px; 
      text-align: center; 
      background: #f8f9fa;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      margin: 0;
      font-size: 13px; 
      color: #6b7280;
    }
    .footer a {
      color: #2563eb;
      text-decoration: none;
    }
    .divider {
      height: 1px;
      background: #e5e7eb;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📄 Currículo Profissional</h1>
      <p>Enviado por: ${emailData.senderName}</p>
    </div>
    <div class="content">
      <p><strong>${greeting}</strong></p>
      ${emailData.message.split('\n').map(line => `<p>${line}</p>`).join('')}
      
      ${emailData.pdfBase64 ? `
      <div class="highlight">
        <p><strong>📎 Currículo em PDF anexado!</strong></p>
        <p>Seu currículo profissional está anexado a este email no formato PDF, pronto para ser aberto e visualizado.</p>
      </div>
      ` : ''}
      
      <div class="divider"></div>
      <p><strong>Este currículo foi gerado através da plataforma CurriculoGratisOnline.com 🎉</strong></p>
      <p>Esperamos que este currículo te ajude a conquistar novas oportunidades profissionais!</p>
    </div>
    <div class="footer">
      <p>
        Enviado via <strong>CurriculoGratisOnline.com</strong> 🚀<br>
        <a href="https://curriculogratisonline.com">Crie seu currículo gratuitamente</a>
      </p>
    </div>
  </div>
</body>
</html>`;

    // Preparar payload para Resend
    const resendPayload: any = {
      from: FROM_EMAIL,
      to: [emailData.to],
      subject: emailData.subject,
      text: textMessage,
      html: htmlMessage
    };

    // Adicionar anexo PDF se disponível
    if (emailData.pdfBase64 && emailData.pdfFileName) {
      resendPayload.attachments = [{
        filename: emailData.pdfFileName,
        content: emailData.pdfBase64
      }];
      console.log('📎 Anexo PDF adicionado:', emailData.pdfFileName);
    }

    console.log('📧 Enviando via Resend API...');

    // Fazer requisição para Resend
    const resendResponse = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(resendPayload)
    });

    console.log('📡 Resposta Resend:', resendResponse.status, resendResponse.statusText);

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error('❌ Erro Resend:', errorText);
      throw new Error(`Resend API Error: ${resendResponse.status} - ${errorText}`);
    }

    const resendResult = await resendResponse.json();
    console.log('✅ Email enviado via Resend! ID:', resendResult.id);

    const response: EmailResponse = {
      success: true,
      emailId: resendResult.id
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('❌ Erro no envio de email:', error);
    
    const response: EmailResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };

    return new Response(JSON.stringify(response), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
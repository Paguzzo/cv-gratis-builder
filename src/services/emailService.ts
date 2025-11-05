// 📧 EmailService usando Resend via MCP

// Declaração de tipos para MCP
declare global {
  interface Window {
    mcp_Email_sending_send_email?: (config: {
      to: string;
      from: string;
      subject: string;
      text: string;
      html?: string;
    }) => Promise<{ success: boolean; messageId?: string; error?: string }>;
  }
}

export interface EmailData {
  to_email: string;
  subject: string;
  message: string;
  attachment_data?: string;
  attachment_name?: string;
  from_name?: string;
}

export class EmailService {
  // Método principal usando Resend
  static async sendEmailWithFallback(emailData: EmailData): Promise<{success: boolean, method: string}> {
    console.log('📧 Enviando email via Resend...', emailData);
    
    try {
      // Usar Resend com MCP
      const success = await this.sendWithResend(emailData);
      return { success, method: success ? 'resend' : 'failed' };
    } catch (error) {
      console.error('❌ Erro no Resend:', error);
      return { success: false, method: 'failed' };
    }
  }

  // Envio via Resend usando MCP
  static async sendWithResend(emailData: EmailData): Promise<boolean> {
    try {
      console.log('📧 Enviando via Resend MCP...');
      
      // Verificar se existe MCP Email disponível
      if (typeof window === 'undefined' || !window.mcp_Email_sending_send_email) {
        throw new Error('MCP Email Sending não disponível');
      }

      // Configurações do email
      const emailConfig = {
        to: emailData.to_email,
        from: 'contato@app.curriculogratisonline.com', // Domínio verificado
        subject: emailData.subject,
        text: emailData.message,
        html: this.formatEmailHTML(emailData.message, emailData.from_name || 'CVGratis')
      };

      console.log('📧 Configuração do email:', emailConfig);

      // Chamar MCP Email Sending
      const result = await window.mcp_Email_sending_send_email(emailConfig);
      
      console.log('✅ Email enviado via Resend:', result);
      return true;
    } catch (error) {
      console.error('❌ Erro no Resend:', error);
      throw error;
    }
  }

  // Formatar HTML do email
  static formatEmailHTML(message: string, fromName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Currículo - ${fromName}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { padding: 10px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📄 Currículo Profissional</h1>
            <p>De: ${fromName}</p>
          </div>
          <div class="content">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <div class="footer">
            <p>Enviado via <strong>CurriculoGratisOnline.com</strong> 🚀</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Enviar currículo por email usando Resend
  static async sendCurriculumByEmail(emailData: EmailData, pdfBlob?: Blob): Promise<void> {
    console.log('📧 Enviando currículo por email via Resend...');
    
    const emailToSend: EmailData = {
      to_email: emailData.recipientEmail || emailData.to_email || emailData.to,
      subject: emailData.subject || 'Meu Currículo Profissional',
      message: emailData.message || 'Segue em anexo meu currículo profissional.',
      from_name: emailData.senderName || emailData.from_name || 'CVGratis'
    };

    const result = await this.sendEmailWithFallback(emailToSend);
    
    if (!result.success) {
      throw new Error('Falha ao enviar email');
    }
    
    console.log('✅ Email enviado com sucesso via', result.method);
  }

  // Enviar link do currículo por email usando Resend
  static async sendCurriculumLink(emailData: EmailData, shareUrl: string): Promise<void> {
    console.log('📧 Enviando link por email via Resend...');
    
    const messageWithLink = `${emailData.message}\n\n🔗 Visualizar currículo: ${shareUrl}\n\nCriado com CurriculoGratisOnline.com`;
    
    const emailToSend: EmailData = {
      to_email: emailData.recipientEmail || emailData.to_email || emailData.to,
      subject: emailData.subject || 'Meu Currículo Profissional - Link de Acesso',
      message: messageWithLink,
      from_name: emailData.senderName || emailData.from_name || 'CVGratis'
    };

    const result = await this.sendEmailWithFallback(emailToSend);
    
    if (!result.success) {
      throw new Error('Falha ao enviar email');
    }
    
    console.log('✅ Link enviado com sucesso via', result.method);
  }
} 
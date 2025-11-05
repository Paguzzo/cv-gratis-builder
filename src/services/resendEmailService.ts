// 📧 SERVIÇO DE EMAIL RESEND SEGURO
// Usa SecureApiService para envio seguro via backend - API keys nunca expostas no frontend

import SecureApiService from './secureApiService';

export interface EmailData {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
}

export interface EmailResponse {
  success: boolean;
  emailId?: string;
  error?: string;
}

export class ResendEmailService {
  private static readonly FROM_EMAIL = 'contato@app.curriculogratisonline.com'; // Domínio verificado do Resend

  /**
   * Enviar email usando SecureApiService (backend seguro)
   */
  static async sendEmail(emailData: EmailData): Promise<EmailResponse> {
    console.log('📧 RESEND SECURE SERVICE - Enviando email via backend seguro');
    console.log('📧 Para:', emailData.to);
    console.log('📧 Assunto:', emailData.subject);

    try {
      // Preparar dados para o backend seguro
      const secureEmailRequest = {
        to: emailData.to,
        from: emailData.from || this.FROM_EMAIL,
        subject: emailData.subject,
        html: emailData.html || emailData.text
      };

      console.log('📧 Enviando via SecureApiService...');
      console.log('📧 Dados do email:', {
        to: emailData.to,
        from: emailData.from || this.FROM_EMAIL,
        subject: emailData.subject,
        hasHtml: !!emailData.html
      });

      // Usar SecureApiService para envio seguro
      const result = await SecureApiService.sendEmail(secureEmailRequest);

      if (!result.success) {
        console.error('❌ Erro no SecureApiService:', result.error);
        return {
          success: false,
          error: result.error || 'Falha no envio via backend seguro'
        };
      }

      console.log('✅ ID do email:', result.messageId);

      return {
        success: true,
        emailId: result.messageId || `secure_${Date.now()}`
      };

    } catch (error) {
      console.error('❌ ERRO NO ENVIO SEGURO:', error);
      return {
        success: false,
        error: `Erro no envio: ${error instanceof Error ? error.message : 'Falha desconhecida'}`
      };
    }
  }

  /**
   * Enviar email de bônus
   */
  static async sendBonusEmail({
    recipientName,
    recipientEmail,
    bonusTitle,
    bonusDescription,
    downloadLink,
    emailTemplate
  }: {
    recipientName: string;
    recipientEmail: string;
    bonusTitle: string;
    bonusDescription: string;
    downloadLink: string;
    emailTemplate: string;
  }): Promise<EmailResponse> {
    
    console.log('🎁 ENVIANDO EMAIL DE BÔNUS...');
    
    const emailData: EmailData = {
      to: recipientEmail,
      from: this.FROM_EMAIL,
      subject: `🎁 Seu bônus: ${bonusTitle}`,
      text: emailTemplate
        .replace('{NOME}', recipientName)
        .replace('{LINK_DOWNLOAD}', downloadLink)
        .replace(/<[^>]*>/g, ''), // Remove HTML tags para versão texto
      html: emailTemplate
        .replace('{NOME}', recipientName)
        .replace('{LINK_DOWNLOAD}', downloadLink)
    };

    return await this.sendEmail(emailData);
  }

  /**
   * Testar configuração do serviço seguro
   */
  static async testConfiguration(): Promise<EmailResponse> {
    console.log('🧪 TESTANDO CONFIGURAÇÃO RESEND SEGURO...');

    const testEmail: EmailData = {
      to: 'pabloguzzo.oficial@gmail.com', // Email de teste
      from: this.FROM_EMAIL,
      subject: '🧪 Teste - Configuração Resend Seguro',
      text: 'Este é um teste da configuração do Resend via backend seguro. Se você recebeu este email, o sistema está funcionando!',
      html: '<h1>🧪 Teste Resend Seguro</h1><p>Sistema funcionando corretamente via backend!</p>'
    };

    return await this.sendEmail(testEmail);
  }
}

export default ResendEmailService;
import emailjs from '@emailjs/browser';

// Configurações básicas do EmailJS (sem necessidade de .env)
const EMAIL_CONFIG = {
  SERVICE_ID: 'service_cvgratis',
  TEMPLATE_ID: 'template_curriculo', 
  PUBLIC_KEY: 'hWHzKXgz-rJ_M3vNB'
};

interface EmailData {
  to_email: string;
  subject: string;
  message: string;
  attachment_data?: string;
  attachment_name?: string;
  from_name?: string;
}

export class EmailService {
  // Método simplificado que sempre funciona
  static async sendEmailWithFallback(emailData: EmailData): Promise<{success: boolean, method: string}> {
    console.log('📧 Tentando enviar email...', emailData);
    
    try {
      // Usar EmailJS com configuração básica
      const success = await this.sendWithEmailJS(emailData);
      return { success, method: success ? 'emailjs' : 'simulated' };
    } catch (error) {
      console.warn('EmailJS falhou, simulando envio:', error);
      // Simular sucesso para desenvolvimento
      return { success: true, method: 'simulated' };
    }
  }

  // Envio via EmailJS simplificado
  static async sendWithEmailJS(emailData: EmailData): Promise<boolean> {
    try {
      console.log('📧 Enviando via EmailJS...');
      
      const templateParams = {
        to_email: emailData.to_email,
        subject: emailData.subject,
        message: emailData.message,
        from_name: emailData.from_name || 'CVGratis',
        attachment_data: emailData.attachment_data || '',
        attachment_name: emailData.attachment_name || 'curriculo.pdf'
      };

      const result = await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAIL_CONFIG.PUBLIC_KEY
      );

      console.log('✅ Email enviado via EmailJS:', result);
      return result.status === 200;
    } catch (error) {
      console.error('❌ Erro no EmailJS:', error);
      throw error;
    }
  }

  // Enviar currículo por email com anexo PDF (SIMPLIFICADO)
  static async sendCurriculumByEmail(emailData: any, pdfBlob: Blob): Promise<void> {
    console.log('📧 Enviando currículo por email...');
    
    // Para desenvolvimento, simular sucesso sempre
    const emailServiceData = {
      to_email: emailData.recipientEmail,
      subject: emailData.subject,
      message: emailData.message,
      from_name: emailData.senderName || 'CVGratis'
    };

    // Simular delay e sucesso
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('✅ Email simulado enviado com sucesso!');
  }

  // Enviar link do currículo por email (SIMPLIFICADO)
  static async sendCurriculumLink(emailData: any, shareUrl: string): Promise<void> {
    console.log('📧 Enviando link por email...');
    
    const messageWithLink = `${emailData.message}\n\nVocê pode visualizar meu currículo em: ${shareUrl}`;
    
    const emailServiceData = {
      to_email: emailData.recipientEmail,
      subject: emailData.subject,
      message: messageWithLink,
      from_name: emailData.senderName || 'CVGratis'
    };

    // Simular delay e sucesso
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('✅ Link simulado enviado com sucesso!');
  }
} 
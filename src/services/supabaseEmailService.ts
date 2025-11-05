// 📧 SERVIÇO DE EMAIL SUPABASE + RESEND
// Integração do Resend com Supabase para envio de emails

import { supabase, isSupabaseConfigured } from '@/lib/supabase';

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

export interface BonusEmailData {
  recipientName: string;
  recipientEmail: string;
  bonusTitle: string;
  bonusDescription: string;
  downloadLink: string;
  emailTemplate: string;
}

export class SupabaseEmailService {
  private static readonly FROM_EMAIL = 'contato@app.curriculogratisonline.com';
  
  /**
   * Enviar email usando Supabase Edge Function com Resend
   */
  static async sendEmail(emailData: EmailData): Promise<EmailResponse> {
    console.log('📧 SUPABASE EMAIL SERVICE - Enviando email');
    console.log('📧 Para:', emailData.to);
    console.log('📧 Assunto:', emailData.subject);

    try {
      // Verificar se o Supabase está disponível
      if (!isSupabaseConfigured()) {
        console.error('❌ Supabase não está disponível');
        return {
          success: false,
          error: 'Supabase não configurado'
        };
      }

      // Preparar dados do email
      const emailPayload = {
        to: emailData.to,
        from: emailData.from || this.FROM_EMAIL,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html || emailData.text
      };

      console.log('📧 Enviando via Supabase Edge Function...');
      console.log('📧 Payload:', { ...emailPayload, text: '[TEXTO_OMITIDO]', html: '[HTML_OMITIDO]' });

      // Chamar Edge Function do Supabase
      if (!supabase) {
        throw new Error('Cliente Supabase não inicializado');
      }
      
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: emailPayload
      });

      if (error) {
        console.error('❌ Erro na Edge Function:', error);
        return {
          success: false,
          error: `Erro Supabase: ${error.message || 'Falha na Edge Function'}`
        };
      }

      console.log('✅ Resposta:', data);
      
      return {
        success: true,
        emailId: data?.id || `supabase_${Date.now()}`
      };

    } catch (error) {
      console.error('❌ ERRO NO ENVIO SUPABASE:', error);
      return {
        success: false,
        error: `Erro no envio: ${error instanceof Error ? error.message : 'Falha desconhecida'}`
      };
    }
  }

  /**
   * Enviar email de bônus usando Supabase
   */
  static async sendBonusEmail(bonusData: BonusEmailData): Promise<EmailResponse> {
    console.log('🎁 ENVIANDO EMAIL DE BÔNUS VIA SUPABASE...');
    
    const emailData: EmailData = {
      to: bonusData.recipientEmail,
      from: this.FROM_EMAIL,
      subject: `🎁 Seu bônus: ${bonusData.bonusTitle}`,
      text: bonusData.emailTemplate
        .replace('{NOME}', bonusData.recipientName)
        .replace('{LINK_DOWNLOAD}', bonusData.downloadLink)
        .replace(/<[^>]*>/g, ''), // Remove HTML tags para versão texto
      html: bonusData.emailTemplate
        .replace('{NOME}', bonusData.recipientName)
        .replace('{LINK_DOWNLOAD}', bonusData.downloadLink)
    };

    return await this.sendEmail(emailData);
  }

  /**
   * Testar configuração do serviço Supabase
   */
  static async testConfiguration(): Promise<EmailResponse> {
    console.log('🧪 TESTANDO CONFIGURAÇÃO SUPABASE...');
    
    const testEmail: EmailData = {
      to: 'pabloguzzo.oficial@gmail.com',
      from: this.FROM_EMAIL,
      subject: '🧪 Teste - Configuração Supabase + Resend',
      text: 'Este é um teste da configuração do Supabase com Resend. Se você recebeu este email, o sistema está funcionando!',
      html: '<h1>🧪 Teste Supabase + Resend</h1><p>Sistema funcionando corretamente!</p><p>Integração: Supabase Edge Function + Resend API</p>'
    };

    return await this.sendEmail(testEmail);
  }

  /**
   * Verificar se o Supabase está configurado
   */
  static isConfigured(): boolean {
    return isSupabaseConfigured();
  }

  /**
   * Obter informações de configuração
   */
  static getConfigInfo(): { configured: boolean; service: string } {
    return {
      configured: this.isConfigured(),
      service: 'Supabase + Resend'
    };
  }
}

// Instância do serviço para uso direto
export const supabaseEmailService = new SupabaseEmailService();

export default SupabaseEmailService;

// Declaração global para TypeScript
declare global {
  interface Window {
    supabase?: any;
  }
}
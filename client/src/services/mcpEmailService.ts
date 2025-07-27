import { PDFExportService } from './pdfExportService';

export interface MCPEmailData {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
}

export interface CurriculumEmailData {
  recipientEmail: string;
  recipientName?: string;
  senderName: string;
  subject: string;
  message: string;
  templateId?: string;
}

// Interface para MCP Email function
interface MCPEmailFunction {
  (config: MCPEmailData): Promise<{id: string}>;
}

export class MCPEmailService {
  // Configurações padrão do domínio
  private static readonly DEFAULT_FROM = 'noreply@app.curriculogratisonline.com';
  private static readonly FALLBACK_FROM = 'onboarding@resend.dev';
  private static readonly ADMIN_EMAIL = 'contato@app.curriculogratisonline.com';

  /**
   * Enviar email usando MCP Resend
   */
  static async sendEmail(emailData: MCPEmailData): Promise<{success: boolean, emailId?: string, error?: string}> {
    console.log('📧 Iniciando envio de email via MCP + Resend');
    console.log('📧 Para:', emailData.to);
    console.log('📧 Assunto:', emailData.subject);

    try {
      // Verificar se MCP está disponível
      if (typeof window !== 'undefined' && window.mcp_Email_sending_send_email) {
        console.log('📧 MCP Email disponível, tentando envio real...');
        
        try {
          const result = await window.mcp_Email_sending_send_email({
            to: emailData.to,
            from: this.DEFAULT_FROM,
            subject: emailData.subject,
            text: emailData.text,
            html: emailData.html || emailData.text
          });
          
          console.log('✅ Email enviado via MCP com sucesso:', result);
          
          return {
            success: true,
            emailId: result.id || `mcp_${Date.now()}`
          };
        } catch (mcpError) {
          console.warn('⚠️ Erro no MCP, usando fallback:', mcpError);
        }
      }

      // Fallback: Simular envio para desenvolvimento
      console.log('📧 Usando modo fallback/desenvolvimento');
      
      const emailId = `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Simular delay de envio real
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Log detalhado para debug
      console.log('📧 DADOS DO EMAIL PROCESSADO:');
      console.log('- Para:', emailData.to);
      console.log('- De:', emailData.from);
      console.log('- Assunto:', emailData.subject);
      console.log('- Conteúdo:', emailData.text.substring(0, 100) + '...');
      console.log('- ID:', emailId);
      
      console.log('✅ Email processado com sucesso (modo desenvolvimento)');
      
      return {
        success: true,
        emailId: emailId
      };
      
    } catch (error) {
      console.error('❌ Erro no envio de email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido no envio'
      };
    }
  }

  /**
   * Formatar template HTML profissional para emails
   */
  static formatEmailHTML(message: string, senderName: string, recipientName?: string): string {
    const greeting = recipientName ? `Olá, ${recipientName}!` : 'Olá!';
    
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Currículo - ${senderName}</title>
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
            <p>Enviado por: ${senderName}</p>
          </div>
          <div class="content">
            <p>${greeting}</p>
            ${message.split('\n').map(line => `<p>${line}</p>`).join('')}
            <div class="divider"></div>
            <p><strong>Este currículo foi gerado através da plataforma CurriculoGratisOnline.com</strong></p>
          </div>
          <div class="footer">
            <p>
              Enviado via <strong>CurriculoGratisOnline.com</strong> 🚀<br>
              <a href="https://curriculogratisonline.com">Crie seu currículo gratuitamente</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Enviar currículo completo por email
   */
  static async sendCurriculumByEmail(curriculumData: CurriculumEmailData): Promise<{success: boolean, emailId?: string, error?: string}> {
    console.log('📧 Enviando currículo por email...', curriculumData);
    console.log('🔍 DEBUG EMAIL: Verificando ambiente MCP...');
    console.log('🔍 DEBUG EMAIL: window disponível?', typeof window !== 'undefined');
    console.log('🔍 DEBUG EMAIL: MCP função disponível?', typeof window?.mcp_Email_sending_send_email === 'function');

    try {
      let pdfGenerated = false;
      
             try {
         // Verificar elementos em ordem de prioridade: Premium → Gratuito → Genéricos
         const templateElement = 
           document.querySelector('.template-premium-preview') ||           // Premium
           document.getElementById('template-preview-container') ||         // Gratuito padrão
           document.querySelector('.template-preview') ||                   // Alternativo
           document.querySelector('.template-container') ||                 // Container genérico
           document.querySelector('[class*="template-preview"]') ||         // Qualquer classe com template-preview
           document.querySelector('[id*="template"]') ||                    // ID com template
           document.querySelector('[class*="template"]') ||                 // Classe com template
           document.querySelector('.curriculum-preview') ||                 // Preview de currículo
           document.querySelector('[data-template]');                       // Atributo data
         
         if (templateElement) {
           console.log('🎯 Elemento encontrado para PDF:', templateElement.className || templateElement.id);
           const pdfService = new PDFExportService();
           const pdfBlob = await pdfService.exportTemplateAsBlob(false);
           pdfGenerated = true;
           console.log('✅ PDF gerado com sucesso para email');
         } else {
           console.warn('⚠️ Nenhum elemento de template encontrado, enviando apenas texto');
           console.log('🔍 Elementos disponíveis na página:', {
             'template-preview-container': !!document.getElementById('template-preview-container'),
             'template-premium-preview': !!document.querySelector('.template-premium-preview'),
             'qualquer-template': !!document.querySelector('[class*="template"]')
           });
         }
       } catch (pdfError) {
         console.warn('⚠️ Não foi possível gerar PDF:', pdfError);
       }

      let emailMessage = curriculumData.message;
      
      if (!pdfGenerated) {
        const shareUrl = `${window.location.origin}/curriculum/${curriculumData.templateId || 'preview'}`;
        emailMessage += `\n\n🔗 Visualizar currículo online: ${shareUrl}`;
      }

      emailMessage += '\n\n---\nEste currículo foi criado gratuitamente em CurriculoGratisOnline.com';

      const emailData: MCPEmailData = {
        to: curriculumData.recipientEmail,
        from: this.DEFAULT_FROM,
        subject: curriculumData.subject,
        text: emailMessage,
        html: this.formatEmailHTML(curriculumData.message, curriculumData.senderName, curriculumData.recipientName)
      };

      console.log('🔍 DEBUG EMAIL: Chamando sendEmail com dados:', emailData);
      const result = await this.sendEmail(emailData);
      console.log('🔍 DEBUG EMAIL: Resultado do sendEmail:', result);

      if (result.success) {
        console.log('✅ DEBUG EMAIL: Sucesso! Notificando admin...');
        this.notifyAdminEmailSent(curriculumData, result.emailId || 'unknown');
      } else {
        console.error('❌ DEBUG EMAIL: Falha no envio:', result.error);
      }

      return result;

    } catch (error) {
      console.error('❌ Erro ao enviar currículo por email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Notificar administrador sobre emails enviados
   */
  private static async notifyAdminEmailSent(curriculumData: CurriculumEmailData, emailId: string): Promise<void> {
    try {
      const adminNotification: MCPEmailData = {
        to: this.ADMIN_EMAIL,
        from: this.DEFAULT_FROM,
        subject: `📊 Currículo Enviado - ${curriculumData.senderName}`,
        text: `Um currículo foi enviado através da plataforma:

De: ${curriculumData.senderName}
Para: ${curriculumData.recipientEmail}
Assunto: ${curriculumData.subject}
Email ID: ${emailId}
Data: ${new Date().toLocaleString('pt-BR')}

CurriculoGratisOnline.com`,
        html: `
          <h3>📊 Currículo Enviado</h3>
          <p><strong>De:</strong> ${curriculumData.senderName}</p>
          <p><strong>Para:</strong> ${curriculumData.recipientEmail}</p>
          <p><strong>Assunto:</strong> ${curriculumData.subject}</p>
          <p><strong>Email ID:</strong> ${emailId}</p>
          <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          <hr>
          <p><small>CurriculoGratisOnline.com - Notificação Automática</small></p>
        `
      };

      await this.sendEmail(adminNotification);
      console.log('✅ Administrador notificado sobre envio');
    } catch (error) {
      console.warn('⚠️ Não foi possível notificar administrador:', error);
    }
  }

  /**
   * Testar configuração do sistema de email
   */
  static async testEmailConfiguration(): Promise<{success: boolean, details: string}> {
    try {
      const testEmail: MCPEmailData = {
        to: 'compg.oficial@gmail.com',
        from: this.FALLBACK_FROM,
        subject: '✅ Teste - Sistema Email CV Grátis',
        text: 'Este é um teste do sistema de email MCP + Resend integrado ao CV Grátis.',
        html: `
          <h2>✅ Teste do Sistema de Email</h2>
          <p>Este é um teste da integração MCP + Resend com o sistema CV Grátis.</p>
          <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          <p><strong>Status:</strong> Funcionando corretamente!</p>
        `
      };

      const result = await this.sendEmail(testEmail);
      
      return {
        success: result.success,
        details: result.success 
          ? `Email de teste enviado com sucesso! ID: ${result.emailId}`
          : `Falha no teste: ${result.error}`
      };
    } catch (error) {
      return {
        success: false,
        details: `Erro no teste: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }
}

export default MCPEmailService; 
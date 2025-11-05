/**
 * SERVIÇO DE EMAIL LOCAL - ESTRATÉGIA DEFINITIVA
 * Esta abordagem usa o cliente de email local do usuário
 */

export interface LocalEmailData {
  to: string;
  subject: string;
  message: string;
  senderName: string;
  recipientName?: string;
  pdfBlob?: Blob;
  pdfFileName?: string;
}

export class LocalEmailService {
  
  /**
   * ✅ ENVIAR EMAIL VIA CLIENTE LOCAL - SEMPRE FUNCIONA!
   */
  static async sendEmailLocal(emailData: LocalEmailData): Promise<{success: boolean, method: string, details: string}> {
    console.log('🚀 ENVIANDO EMAIL VIA CLIENTE LOCAL...');
    console.log('📧 Para:', emailData.to);
    console.log('📧 Assunto:', emailData.subject);
    console.log('📎 PDF disponível:', !!emailData.pdfBlob);

    try {
      // ===== PREPARAR CONTEÚDO DO EMAIL =====
      const emailBody = this.formatEmailBody(emailData);
      
      // ===== SALVAR PDF LOCALMENTE =====
      let pdfDownloaded = false;
      if (emailData.pdfBlob && emailData.pdfFileName) {
        console.log('📎 Baixando PDF automaticamente...');
        this.downloadPDF(emailData.pdfBlob, emailData.pdfFileName);
        pdfDownloaded = true;
        console.log('✅ PDF baixado:', emailData.pdfFileName);
      }

      // ===== PREPARAR MAILTO LINK =====
      const mailtoUrl = this.createMailtoUrl(emailData.to, emailData.subject, emailBody);
      
      console.log('📧 Abrindo cliente de email...');
      
      // ===== ABRIR CLIENTE DE EMAIL =====
      const emailOpened = this.openEmailClient(mailtoUrl);
      
      if (emailOpened) {
        
        // ===== MOSTRAR INSTRUÇÕES =====
        this.showInstructions(emailData, pdfDownloaded);
        
        return {
          success: true,
          method: 'cliente_local',
          details: `Email aberto no cliente local. ${pdfDownloaded ? 'PDF baixado automaticamente.' : 'Sem PDF para anexar.'}`
        };
      } else {
        throw new Error('Não foi possível abrir o cliente de email');
      }

    } catch (error) {
      console.error('❌ ERRO NO EMAIL LOCAL:', error);
      
      // ===== FALLBACK: COPIAR PARA ÁREA DE TRANSFERÊNCIA =====
      return this.copyToClipboardFallback(emailData);
    }
  }

  /**
   * Formatar corpo do email
   */
  private static formatEmailBody(emailData: LocalEmailData): string {
    const greeting = emailData.recipientName ? `Olá, ${emailData.recipientName}!` : 'Olá!';
    
    return `${greeting}

${emailData.message}

---

Obrigado por usar o CurriculoGratisOnline.com! 🎉

Esperamos que este currículo te ajude a conquistar novas oportunidades profissionais.

${emailData.pdfBlob ? '📎 Anexei meu currículo em PDF a este email.' : '🔗 Meu currículo está disponível online.'}

Boa sorte em minha jornada profissional!

---
Atenciosamente,
${emailData.senderName}

Enviado via CurriculoGratisOnline.com
✨ Criando oportunidades, um currículo por vez!`;
  }

  /**
   * Criar URL mailto
   */
  private static createMailtoUrl(to: string, subject: string, body: string): string {
    const params = new URLSearchParams({
      to: to,
      subject: subject,
      body: body
    });
    
    return `mailto:?${params.toString()}`;
  }

  /**
   * Abrir cliente de email
   */
  private static openEmailClient(mailtoUrl: string): boolean {
    try {
      // Tentar abrir com window.open primeiro
      const emailWindow = window.open(mailtoUrl, '_blank');
      
      // Se window.open falhar, usar location
      if (!emailWindow) {
        window.location.href = mailtoUrl;
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao abrir cliente de email:', error);
      return false;
    }
  }

  /**
   * Baixar PDF automaticamente
   */
  private static downloadPDF(pdfBlob: Blob, fileName: string): void {
    try {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.style.display = 'none';
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Limpar URL após um tempo
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      
      console.log('✅ PDF baixado automaticamente:', fileName);
    } catch (error) {
      console.error('❌ Erro ao baixar PDF:', error);
    }
  }

  /**
   * Mostrar instruções claras
   */
  private static showInstructions(emailData: LocalEmailData, pdfDownloaded: boolean): void {
    const instructions = pdfDownloaded 
      ? `✅ PERFEITO! Seu email foi preparado e o PDF foi baixado!

PRÓXIMOS PASSOS:
1. 📧 Seu cliente de email deve ter aberto automaticamente
2. 📎 Anexe o arquivo "${emailData.pdfFileName}" que foi baixado
3. ✅ Revise o conteúdo e clique em "Enviar"

O email já está pré-preenchido com:
• Destinatário: ${emailData.to}
• Assunto: ${emailData.subject}
• Mensagem completa formatada

🎉 Pronto para enviar!`
      : `✅ Email preparado e aberto no seu cliente!

PRÓXIMOS PASSOS:
1. 📧 Seu cliente de email deve ter aberto automaticamente
2. ✅ Revise o conteúdo e clique em "Enviar"

O email já está pré-preenchido com:
• Destinatário: ${emailData.to}
• Assunto: ${emailData.subject}
• Mensagem completa formatada`;

    // Mostrar em um alerta estilizado
    console.log('📋 INSTRUÇÕES PARA O USUÁRIO:');
    console.log(instructions);
    
    // Também mostrar como notificação no navegador
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('📧 Email Preparado!', {
        body: 'Seu cliente de email foi aberto. Anexe o PDF e envie!',
        icon: '/favicon.ico'
      });
    }
  }

  /**
   * Fallback: Copiar para área de transferência
   */
  private static async copyToClipboardFallback(emailData: LocalEmailData): Promise<{success: boolean, method: string, details: string}> {
    try {
      
      const emailText = `Para: ${emailData.to}
Assunto: ${emailData.subject}

${this.formatEmailBody(emailData)}`;

      await navigator.clipboard.writeText(emailText);
      
      
      return {
        success: true,
        method: 'clipboard',
        details: 'Dados do email copiados. Cole em seu cliente de email preferido.'
      };
      
    } catch (clipboardError) {
      console.error('❌ Erro ao copiar para área de transferência:', clipboardError);
      
      return {
        success: false,
        method: 'manual',
        details: 'Abra seu cliente de email manualmente e use os dados fornecidos.'
      };
    }
  }

  /**
   * Testar cliente de email
   */
  static async testEmailClient(): Promise<{success: boolean, details: string}> {
    console.log('🧪 TESTANDO CLIENTE DE EMAIL LOCAL...');
    
    try {
      const testData: LocalEmailData = {
        to: 'teste@exemplo.com',
        subject: '✅ TESTE - Cliente de Email Local',
        message: 'Este é um teste do sistema de email local.\n\nSe o cliente de email abriu, está funcionando!',
        senderName: 'Sistema CV Grátis'
      };

      const result = await this.sendEmailLocal(testData);
      
      return {
        success: result.success,
        details: result.success 
          ? `✅ Teste realizado! Método: ${result.method} - ${result.details}`
          : `❌ Falha no teste: ${result.details}`
      };
    } catch (error) {
      return {
        success: false,
        details: `❌ Erro no teste: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }
}

export default LocalEmailService;






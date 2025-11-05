/**
 * Serviço para envio de PDF via WhatsApp
 * Utiliza WhatsApp Web API para enviar documentos
 */

// Número fixo para envio
const WHATSAPP_NUMBER = '+5531971052200';

interface WhatsAppMessage {
  phone: string;
  message: string;
  pdfBlob?: Blob;
  fileName?: string;
}

/**
 * Gera URL do WhatsApp Web com mensagem pré-definida
 */
export function generateWhatsAppURL(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = WHATSAPP_NUMBER.replace('+', '');
  
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

/**
 * Abre WhatsApp Web em nova aba com mensagem personalizada
 */
export function sendToWhatsApp(userName: string, templateName: string): void {
  const message = `
👋 *Olá! Sou ${userName}*

💼 Gostaria de compartilhar meu currículo profissional com você.

🎯 *Informações:*
• Template: ${templateName}
• Gerado em: ${new Date().toLocaleDateString('pt-BR')}
• Criado via CVGrátis.com

📧 *Posso enviar por email* se preferir (formato PDF)
📞 *Ou podemos conversar* sobre oportunidades

Aguardo seu retorno! 🤝

#curriculo #emprego #oportunidade
  `.trim();

  const whatsappURL = generateWhatsAppURL(message);
  
  // Abrir em nova aba
  window.open(whatsappURL, '_blank');
}

/**
 * Envia PDF via WhatsApp Web com download automático
 */
export function sendPDFToWhatsApp(
  pdfBlob: Blob, 
  userName: string, 
  templateName: string
): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    try {
      // 1. Fazer download automático do PDF
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Curriculo_${userName.replace(/\s+/g, '_')}_${templateName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // 2. Abrir WhatsApp Web com mensagem específica
      sendToWhatsAppWithPDF(userName, templateName);
      
      resolve({
        success: true,
        message: 'PDF baixado automaticamente! WhatsApp Web aberto - envie o PDF baixado.'
      });
    } catch (error) {
      console.error('❌ Erro ao processar WhatsApp:', error);
      resolve({
        success: false,
        message: 'Erro ao processar envio WhatsApp'
      });
    }
  });
}

/**
 * Abre WhatsApp Web com mensagem específica para envio de PDF
 */
function sendToWhatsAppWithPDF(userName: string, templateName: string): void {
  const message = `
📄 *Currículo Profissional - CVGrátis.com*

👋 Olá! Gostaria de compartilhar meu currículo com você:

👤 *Nome:* ${userName}
📋 *Template:* ${templateName}
🎯 *Gerado em:* ${new Date().toLocaleDateString('pt-BR')}

📎 *IMPORTANTE:*
• O PDF foi baixado na pasta Downloads do meu computador
• Vou anexar o arquivo nesta conversa agora
• Se preferir, posso enviar por email também

✨ Currículo criado gratuitamente em CVGrátis.com
💼 Profissional e otimizado para recrutadores

Aguardo seu retorno para conversarmos sobre oportunidades! 🤝

#curriculo #emprego #oportunidade
  `.trim();

  const whatsappURL = generateWhatsAppURL(message);
  
  // Abrir em nova aba
  window.open(whatsappURL, '_blank');
}

/**
 * Cria mensagem personalizada baseada nos dados do usuário
 */
export function createWhatsAppMessage(
  userName: string,
  userEmail: string,
  templateName: string
): string {
  return `
🎯 *Novo Currículo Enviado*

📋 *Dados do Candidato:*
👤 Nome: ${userName}
📧 Email: ${userEmail}
📄 Template: ${templateName}

🕒 Enviado em: ${new Date().toLocaleString('pt-BR')}

---
💼 Gerado via CVGrátis.com
✨ Sistema automatizado de currículos
  `.trim();
}

/**
 * Valida número de WhatsApp
 */
export function isValidWhatsAppNumber(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
}

/**
 * Formata número para padrão internacional
 */
export function formatWhatsAppNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('55')) {
    return `+${cleaned}`;
  }
  
  if (cleaned.startsWith('31')) {
    return `+55${cleaned}`;
  }
  
  return `+55${cleaned}`;
}

export default {
  sendToWhatsApp,
  sendPDFToWhatsApp,
  generateWhatsAppURL,
  createWhatsAppMessage,
  isValidWhatsAppNumber,
  formatWhatsAppNumber,
  WHATSAPP_NUMBER
};

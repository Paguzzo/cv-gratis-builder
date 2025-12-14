/**
 * 📚 Serviço de Gerenciamento de Ebook
 *
 * Sistema completo para:
 * - Upload de PDF do ebook
 * - Armazenamento em localStorage (base64)
 * - Envio automático via email
 * - Gerenciamento no dashboard administrativo
 */

interface EbookData {
  fileName: string;
  fileSize: number;
  uploadDate: string;
  base64Content: string;
  description?: string;
}

interface EbookSendResult {
  success: boolean;
  message: string;
  error?: string;
}

const STORAGE_KEY = 'cvgratis-ebook-data';
const EBOOK_LEADS_KEY = 'cvgratis-ebook-leads';

/**
 * 📤 Upload do PDF do Ebook
 */
export async function uploadEbook(file: File): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    // Validações
    if (!file) {
      return { success: false, message: 'Nenhum arquivo selecionado' };
    }

    if (file.type !== 'application/pdf') {
      return { success: false, message: 'Apenas arquivos PDF são permitidos' };
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { success: false, message: 'Arquivo muito grande. Máximo: 10MB' };
    }

    // Converter para base64
    const base64 = await fileToBase64(file);

    const ebookData: EbookData = {
      fileName: file.name,
      fileSize: file.size,
      uploadDate: new Date().toISOString(),
      base64Content: base64,
      description: 'Guia Secreto de Entrevistas'
    };

    // Salvar no localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ebookData));

    console.log('✅ Ebook salvo com sucesso:', {
      fileName: ebookData.fileName,
      size: formatFileSize(ebookData.fileSize)
    });

    return {
      success: true,
      message: `Ebook "${file.name}" salvo com sucesso!`
    };
  } catch (error) {
    console.error('❌ Erro ao fazer upload do ebook:', error);
    return {
      success: false,
      message: 'Erro ao processar arquivo',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

/**
 * 📥 Recuperar dados do Ebook
 */
export function getEbookData(): EbookData | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    return JSON.parse(data) as EbookData;
  } catch (error) {
    console.error('❌ Erro ao recuperar ebook:', error);
    return null;
  }
}

/**
 * ❓ Verificar se ebook está configurado
 */
export function isEbookConfigured(): boolean {
  const data = getEbookData();
  return !!data && !!data.base64Content;
}

/**
 * 📧 Enviar Ebook por Email
 */
export async function sendEbookToLead(
  name: string,
  email: string
): Promise<EbookSendResult> {
  try {
    // Verificar se ebook está configurado
    const ebookData = getEbookData();
    if (!ebookData) {
      return {
        success: false,
        message: 'Ebook não configurado. Por favor, faça upload do PDF no painel administrativo.'
      };
    }

    console.log('📧 Enviando ebook para:', email);

    // Preparar payload
    const payload = {
      to: email,
      subject: '🎁 Seu Bônus Exclusivo: Guia Secreto de Entrevistas',
      senderName: 'CV Grátis Online',
      recipientName: name,
      message: `
Olá ${name}! 👋

Parabéns por garantir seu bônus exclusivo!

Anexado a este email você encontra o **Guia Secreto de Entrevistas** - um material completo que vai te ajudar a se destacar nas suas entrevistas de emprego.

📚 **O que você vai encontrar no guia:**

✅ 50+ Perguntas e Respostas de Entrevista
✅ Técnicas de Persuasão para Impressionar
✅ Checklist Completo do Candidato Perfeito
✅ Template de Follow-up Pós-Entrevista

💡 **Dica:** Leia o guia antes da sua próxima entrevista e aplique as técnicas. Você vai perceber a diferença!

Boa sorte na sua jornada profissional! 🚀

---
Equipe CV Grátis Online
www.curriculogratisonline.com
      `.trim(),
      pdfBase64: ebookData.base64Content,
      pdfFileName: ebookData.fileName
    };

    let result: any;
    let sendMethod = 'API Backend';

    try {
      // TENTATIVA 1: Chamar API de envio de email via backend
      console.log('📧 Tentando enviar via API backend /api/send-email...');
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000) // 10s timeout
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Erro HTTP: ${response.status}`);
      }

      result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Falha no envio via backend');
      }

      console.log('✅ Email enviado via backend API');
    } catch (backendError) {
      console.warn('⚠️ Falha no backend, tentando Resend direto...', backendError);

      // TENTATIVA 2: FALLBACK - Enviar diretamente via Resend (apenas se backend falhar)
      const resendApiKey = import.meta.env.VITE_RESEND_API_KEY;

      if (!resendApiKey || resendApiKey === 'your_resend_api_key_here') {
        throw new Error('Chave da API Resend não configurada. Configure VITE_RESEND_API_KEY no arquivo .env');
      }

      console.log('📧 Enviando via Resend API diretamente...');
      sendMethod = 'Resend Direto';

      const resendPayload = {
        from: 'CV Grátis Online <contato@app.curriculogratisonline.com>',
        to: [email],
        subject: payload.subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">🎁 Seu Bônus Exclusivo!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">CV Grátis Online</p>
            </div>
            <div style="padding: 30px 20px; background: white;">
              ${payload.message.split('\n').map(line => `<p style="margin: 0 0 15px 0;">${line}</p>`).join('')}
              <div style="background: #f0f9ff; padding: 15px; border-radius: 6px; border-left: 4px solid #2563eb; margin: 20px 0;">
                <p style="margin: 0;"><strong>📎 Guia em PDF anexado!</strong></p>
                <p style="margin: 10px 0 0 0;">Seu guia está anexado a este email no formato PDF.</p>
              </div>
            </div>
            <div style="padding: 20px; text-align: center; background: #f8f9fa; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 13px; color: #6b7280;">
                Enviado via <strong>CurriculoGratisOnline.com</strong> 🚀
              </p>
            </div>
          </div>
        `,
        attachments: [{
          filename: ebookData.fileName,
          content: ebookData.base64Content
        }]
      };

      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resendPayload)
      });

      if (!resendResponse.ok) {
        const errorText = await resendResponse.text();
        console.error('❌ Erro Resend:', errorText);
        throw new Error(`Resend API Error: ${resendResponse.status} - ${errorText}`);
      }

      result = await resendResponse.json();
      console.log('✅ Email enviado via Resend direto! ID:', result.id);
    }

    // Registrar envio
    await registerEbookSend(name, email);

    console.log(`✅ Ebook enviado com sucesso para: ${email} (método: ${sendMethod})`);

    return {
      success: true,
      message: `Ebook enviado com sucesso para ${email}!`
    };
  } catch (error) {
    console.error('❌ Erro ao enviar ebook:', error);
    return {
      success: false,
      message: 'Erro ao enviar ebook. Por favor, tente novamente ou entre em contato conosco.',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

/**
 * 📝 Registrar envio de ebook (para analytics)
 */
async function registerEbookSend(name: string, email: string): Promise<void> {
  try {
    const leads = getEbookLeads();
    leads.push({
      id: Date.now().toString(),
      name,
      email,
      sentAt: new Date().toISOString(),
      status: 'sent'
    });

    localStorage.setItem(EBOOK_LEADS_KEY, JSON.stringify(leads));
  } catch (error) {
    console.error('Erro ao registrar envio:', error);
  }
}

/**
 * 📊 Recuperar leads que receberam o ebook
 */
export function getEbookLeads(): Array<{
  id: string;
  name: string;
  email: string;
  sentAt: string;
  status: string;
}> {
  try {
    const data = localStorage.getItem(EBOOK_LEADS_KEY);
    if (!data) return [];

    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao recuperar leads:', error);
    return [];
  }
}

/**
 * 📈 Estatísticas de envio
 */
export function getEbookStatistics() {
  const leads = getEbookLeads();
  const ebookData = getEbookData();

  return {
    totalSent: leads.length,
    lastSent: leads.length > 0 ? leads[leads.length - 1].sentAt : null,
    ebookConfigured: !!ebookData,
    ebookFileName: ebookData?.fileName || null,
    ebookSize: ebookData ? formatFileSize(ebookData.fileSize) : null
  };
}

/**
 * 🗑️ Remover ebook
 */
export function removeEbook(): void {
  localStorage.removeItem(STORAGE_KEY);
  console.log('🗑️ Ebook removido');
}

/**
 * 📥 Download do ebook (para admin testar)
 */
export function downloadEbook(): void {
  const ebookData = getEbookData();
  if (!ebookData) {
    alert('Nenhum ebook configurado');
    return;
  }

  // Converter base64 para blob
  const blob = base64ToBlob(ebookData.base64Content, 'application/pdf');
  const url = URL.createObjectURL(blob);

  // Criar link e disparar download
  const a = document.createElement('a');
  a.href = url;
  a.download = ebookData.fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log('📥 Download iniciado:', ebookData.fileName);
}

// ========== UTILITÁRIOS ==========

/**
 * Converter File para Base64
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remover prefixo "data:application/pdf;base64,"
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

/**
 * Converter Base64 para Blob
 */
function base64ToBlob(base64: string, type: string): Blob {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type });
}

/**
 * Formatar tamanho de arquivo
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Exportar tudo
 */
export default {
  uploadEbook,
  getEbookData,
  isEbookConfigured,
  sendEbookToLead,
  getEbookLeads,
  getEbookStatistics,
  removeEbook,
  downloadEbook
};

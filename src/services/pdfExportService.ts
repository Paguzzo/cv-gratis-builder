import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Template } from '@/types/templates';

interface PDFExportOptions {
  fileName?: string;
  quality?: number;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  margin?: number;
}

interface PDFExportResult {
  success: boolean;
  error?: string;
  blob?: Blob;
}

export class PDFExportService {
  private static instance: PDFExportService;

  public static getInstance(): PDFExportService {
    if (!PDFExportService.instance) {
      PDFExportService.instance = new PDFExportService();
    }
    return PDFExportService.instance;
  }

  /**
   * Verifica se o usuário tem acesso a um template premium
   */
  private checkPremiumAccess(template: Template): boolean {
    if (!template.isPremium) return true;

    // Verificar se é admin
    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
    if (isAdmin) {
      console.log('👑 ADMIN: Acesso liberado para template', template.id);
      return true;
    }

    // Verificar se o template foi comprado
    const purchased1 = localStorage.getItem(`template_purchased_${template.id}`) === 'true';
    const purchased2 = localStorage.getItem(`premium_access_${template.id}`) === 'true';
    const hasAccess = purchased1 || purchased2;

    console.log('💳 PDF Service - Verificação de acesso:', {
      templateId: template.id,
      isPremium: template.isPremium,
      purchased1,
      purchased2,
      hasAccess
    });

    return hasAccess;
  }

  /**
   * Adiciona watermark de bloqueio para templates premium não pagos
   */
  private addPremiumBlockWatermark(pdf: jsPDF, pageWidth: number, pageHeight: number): void {
    try {
      // Watermark grande no centro
      pdf.setTextColor(255, 0, 0);
      pdf.setFontSize(60);
      pdf.setFont('helvetica', 'bold');

      // Adicionar múltiplos watermarks de "NÃO PAGO"
      for (let i = 0; i < pdf.getNumberOfPages(); i++) {
        pdf.setPage(i + 1);

        // Watermark diagonal no centro
        pdf.text('NÃO PAGO', pageWidth / 2, pageHeight / 2, {
          align: 'center',
          angle: 45
        });

        // Aviso no topo
        pdf.setFontSize(12);
        pdf.setTextColor(255, 0, 0);
        pdf.text('⚠️ Template Premium Não Adquirido', pageWidth / 2, 15, {
          align: 'center'
        });

        // Aviso no rodapé
        pdf.setFontSize(10);
        pdf.text('Adquira este template premium em CVGratis.com.br', pageWidth / 2, pageHeight - 10, {
          align: 'center'
        });
      }
    } catch (error) {
      console.warn('Erro ao adicionar watermark de bloqueio:', error);
    }
  }

  /**
   * Exporta um elemento DOM como PDF de alta qualidade
   */
  public async exportElementToPDF(
    elementId: string,
    template: Template,
    options: PDFExportOptions = {}
  ): Promise<PDFExportResult> {
    try {
      // 🚨 VALIDAÇÃO CRÍTICA: Verificar acesso premium
      const hasPremiumAccess = this.checkPremiumAccess(template);

      if (template.isPremium && !hasPremiumAccess) {
        console.warn('🚫 BLOQUEIO: Tentativa de export de template premium sem pagamento');
        return {
          success: false,
          error: '❌ Este é um template premium. Por favor, adquira-o para fazer o download sem restrições.'
        };
      }

      const {
        fileName = `curriculo-${template.name.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        quality = 2, // 2x resolution for high quality
        format = 'a4',
        orientation = 'portrait'
      } = options;

      // Encontrar o elemento a ser capturado
      const element = document.getElementById(elementId);
      if (!element) {
        return {
          success: false,
          error: 'Elemento não encontrado para exportação'
        };
      }

      // Configurações para alta qualidade mantendo proporções
      const canvas = await html2canvas(element, {
        scale: quality,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        removeContainer: true,
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        onclone: (clonedDoc) => {
          // Garantir que fontes e estilos sejam preservados
          const clonedElement = clonedDoc.getElementById(elementId);
          if (clonedElement) {
            clonedElement.style.boxShadow = 'none';
            clonedElement.style.transform = 'none';
            // Manter dimensões naturais do elemento
            clonedElement.style.margin = '0';
            clonedElement.style.padding = '20px';
          }
        }
      });

      // Dimensões da página PDF (A4 em pontos)
      const pageWidth = format === 'a4' ? 210 : 216; // mm
      const pageHeight = format === 'a4' ? 297 : 279; // mm

      // Criar PDF
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: format.toUpperCase() as 'A4' | 'LETTER'
      });

      // Usar largura máxima com margens, altura proporcional (múltiplas páginas se necessário)
      const pdfMargin = 8; // Margem de 8mm
      const finalWidth = pageWidth - (pdfMargin * 2); // Usar toda a largura disponível
      const finalHeight = (canvas.height * finalWidth) / canvas.width; // Altura proporcional
      
      // Centralizar horizontalmente, começar do topo com margem
      const x = pdfMargin;
      const y = pdfMargin;

      // Converter canvas para imagem
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      // Quebra de páginas adequada para evitar sobreposição
      const pageContentHeight = pageHeight - (pdfMargin * 2); // Área útil da página
      
      if (finalHeight <= pageContentHeight) {
        // Cabe em uma página - renderizar normalmente
        pdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight);
      } else {
        // Precisa de múltiplas páginas - dividir conteúdo
        let sourceY = 0;
        let remainingHeight = finalHeight;
        let pageNumber = 1;
        
        while (remainingHeight > 0) {
          if (pageNumber > 1) {
            pdf.addPage();
          }
          
          // Altura para esta página (respeitando margens)
          const heightForThisPage = Math.min(remainingHeight, pageContentHeight);
          
          // Calcular proporção da imagem para esta página
          const sourceHeight = (heightForThisPage / finalHeight) * canvas.height;
          
          // Criar sub-canvas para esta página
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          
          tempCanvas.width = canvas.width;
          tempCanvas.height = sourceHeight;
          
          // Desenhar parte da imagem no canvas temporário
          tempCtx?.drawImage(
            canvas,
            0, sourceY, canvas.width, sourceHeight,
            0, 0, canvas.width, sourceHeight
          );
          
          // Converter para imagem e adicionar ao PDF
          const pageImgData = tempCanvas.toDataURL('image/jpeg', 0.95);
          pdf.addImage(pageImgData, 'JPEG', x, y, finalWidth, heightForThisPage);
          
          // Atualizar valores para próxima página
          sourceY += sourceHeight;
          remainingHeight -= heightForThisPage;
          pageNumber++;
        }
      }

      // Adicionar watermark se for template gratuito
      if (!template.isPremium) {
        this.addWatermark(pdf, pageWidth, pageHeight);
      }

      // Gerar blob para download
      const pdfBlob = pdf.output('blob');

      // Trigger download
      this.downloadBlob(pdfBlob, fileName);

      return {
        success: true,
        blob: pdfBlob
      };

    } catch (error) {
      console.error('Erro na exportação PDF:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido na exportação'
      };
    }
  }

  /**
   * Adiciona watermark para templates gratuitos
   */
  private addWatermark(pdf: jsPDF, pageWidth: number, pageHeight: number): void {
    try {
      pdf.setTextColor(200, 200, 200);
      pdf.setFontSize(8);
      pdf.text('Criado em CVGratis.com.br', pageWidth - 50, pageHeight - 5);
      
      // Adicionar watermark sutil no centro
      pdf.setTextColor(240, 240, 240);
      pdf.setFontSize(12);
      pdf.text('CVGratis.com.br', pageWidth / 2 - 15, pageHeight / 2, {
        angle: 45
      });
    } catch (error) {
      console.warn('Erro ao adicionar watermark:', error);
    }
  }

  /**
   * Força download do blob
   */
  private downloadBlob(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Exporta template específico com dados do currículo
   */
  public async exportTemplate(
    template: Template,
    options: PDFExportOptions = {}
  ): Promise<PDFExportResult> {
    // ID padrão do elemento que contém o template renderizado
    const templateElementId = 'template-preview-container';
    
    return this.exportElementToPDF(templateElementId, template, options);
  }

  async exportTemplateAsBlob(addWatermark: boolean = false): Promise<Blob> {
    const element = document.getElementById('template-preview-container');
    
    if (!element) {
      throw new Error('Elemento do template não encontrado');
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        removeContainer: true,
        ignoreElements: (element) => {
          return element.classList.contains('no-print');
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Configurações com margens adequadas e quebra de página correta
      const blobMargin = 8; // 8mm de margem
      const pageWidth = 210; // A4 width
      const pageHeight = 297; // A4 height
      const imgWidth = pageWidth - (blobMargin * 2); // 194mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Proporcional
      const pageContentHeight = pageHeight - (blobMargin * 2); // Área útil
      
      if (imgHeight <= pageContentHeight) {
        // Cabe em uma página
        pdf.addImage(imgData, 'PNG', blobMargin, blobMargin, imgWidth, imgHeight);
      } else {
        // Múltiplas páginas sem sobreposição
        let sourceY = 0;
        let remainingHeight = imgHeight;
        let pageNum = 1;
        
        while (remainingHeight > 0) {
          if (pageNum > 1) {
        pdf.addPage();
          }
          
          const heightForPage = Math.min(remainingHeight, pageContentHeight);
          const sourceHeight = (heightForPage / imgHeight) * canvas.height;
          
          // Criar canvas temporário para esta página
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          
          tempCanvas.width = canvas.width;
          tempCanvas.height = sourceHeight;
          
          tempCtx?.drawImage(
            canvas,
            0, sourceY, canvas.width, sourceHeight,
            0, 0, canvas.width, sourceHeight
          );
          
          const pageImgData = tempCanvas.toDataURL('image/png');
          pdf.addImage(pageImgData, 'PNG', blobMargin, blobMargin, imgWidth, heightForPage);
          
          sourceY += sourceHeight;
          remainingHeight -= heightForPage;
          pageNum++;
        }
      }

      if (addWatermark) {
        this.addWatermark(pdf, pageWidth, pageHeight);
      }

      return pdf.output('blob');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw new Error('Não foi possível gerar o PDF');
    }
  }

  /**
   * Verifica se o navegador suporta exportação
   */
  public isSupported(): boolean {
    return typeof window !== 'undefined' && 
           'HTMLCanvasElement' in window && 
           'toDataURL' in HTMLCanvasElement.prototype;
  }

  /**
   * Estima o tempo de exportação baseado no conteúdo
   */
  public estimateExportTime(complexity: 'low' | 'medium' | 'high' = 'medium'): number {
    const times = {
      low: 2000,    // 2s
      medium: 4000, // 4s  
      high: 7000    // 7s
    };
    return times[complexity];
  }
} 
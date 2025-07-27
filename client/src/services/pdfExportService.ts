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
   * Exporta um elemento DOM como PDF de alta qualidade
   */
  public async exportElementToPDF(
    elementId: string,
    template: Template,
    options: PDFExportOptions = {}
  ): Promise<PDFExportResult> {
    try {
      const {
        fileName = `curriculo-${template.name.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        quality = 2, // 2x resolution for high quality
        format = 'a4',
        orientation = 'portrait',
        margin = 10
      } = options;

      // Encontrar o elemento a ser capturado
      const element = document.getElementById(elementId);
      if (!element) {
        return {
          success: false,
          error: 'Elemento não encontrado para exportação'
        };
      }

      // Configurações para alta qualidade
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

      // Calcular dimensões para ajustar na página
      const imgWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Se a altura da imagem exceder a página, ajustar proporcionalmente
      let finalWidth = imgWidth;
      let finalHeight = imgHeight;

      if (imgHeight > pageHeight - (margin * 2)) {
        finalHeight = pageHeight - (margin * 2);
        finalWidth = (canvas.width * finalHeight) / canvas.height;
      }

      // Centralizar na página
      const x = (pageWidth - finalWidth) / 2;
      const y = margin;

      // Converter canvas para imagem e adicionar ao PDF
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight);

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
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      if (addWatermark) {
        this.addWatermark(pdf);
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
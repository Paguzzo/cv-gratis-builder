import jsPDF from 'jspdf';

// 🚀 PERFORMANCE: Dynamic import de html2canvas (561KB)
type Html2CanvasType = typeof import('html2canvas').default;

/**
 * Formatos de exportação suportados
 */
export type ExportFormat = 'pdf' | 'docx' | 'png' | 'jpg';

/**
 * Configurações de qualidade para exportação
 */
export interface ExportQualityConfig {
  format: ExportFormat;
  quality: number; // 0-100 para JPG, 1-3 para outros (escala)
  resolution: 72 | 150 | 300; // DPI
  backgroundColor?: string;
  transparentBackground?: boolean; // Apenas para PNG
}

/**
 * Configurações de página
 */
export interface PageConfig {
  size: 'A4' | 'LETTER' | 'CUSTOM';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  customWidth?: number; // Para tamanho customizado (mm)
  customHeight?: number; // Para tamanho customizado (mm)
}

/**
 * Resultado da exportação
 */
export interface ExportResult {
  success: boolean;
  blob?: Blob;
  error?: string;
  fileName: string;
  format: ExportFormat;
}

/**
 * Serviço avançado de exportação com múltiplos formatos
 */
export class AdvancedExportService {
  private static instance: AdvancedExportService;

  public static getInstance(): AdvancedExportService {
    if (!AdvancedExportService.instance) {
      AdvancedExportService.instance = new AdvancedExportService();
    }
    return AdvancedExportService.instance;
  }

  /**
   * 🚀 PERFORMANCE: Carrega html2canvas dinamicamente
   */
  private async loadHtml2Canvas(): Promise<Html2CanvasType> {
    return (await import('html2canvas')).default;
  }

  /**
   * Exporta elemento para o formato especificado
   */
  public async exportElement(
    elementId: string,
    fileName: string,
    qualityConfig: ExportQualityConfig,
    pageConfig: PageConfig
  ): Promise<ExportResult> {
    try {
      switch (qualityConfig.format) {
        case 'pdf':
          return await this.exportToPDF(elementId, fileName, qualityConfig, pageConfig);
        case 'docx':
          return await this.exportToDOCX(elementId, fileName, qualityConfig);
        case 'png':
          return await this.exportToPNG(elementId, fileName, qualityConfig);
        case 'jpg':
          return await this.exportToJPG(elementId, fileName, qualityConfig);
        default:
          throw new Error(`Formato não suportado: ${qualityConfig.format}`);
      }
    } catch (error) {
      console.error('Erro na exportação:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        fileName,
        format: qualityConfig.format
      };
    }
  }

  /**
   * Exporta para PDF com alta qualidade
   */
  private async exportToPDF(
    elementId: string,
    fileName: string,
    qualityConfig: ExportQualityConfig,
    pageConfig: PageConfig
  ): Promise<ExportResult> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Elemento não encontrado');
    }

    // Configurar escala baseada na resolução
    const scale = this.getScaleFromDPI(qualityConfig.resolution);

    // 🚀 Carregar html2canvas dinamicamente
    const html2canvas = await this.loadHtml2Canvas();

    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: false,
      backgroundColor: qualityConfig.backgroundColor || '#ffffff',
      removeContainer: true,
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    // Dimensões da página
    const { width: pageWidth, height: pageHeight } = this.getPageDimensions(pageConfig);

    // Criar PDF
    const pdf = new jsPDF({
      orientation: pageConfig.orientation,
      unit: 'mm',
      format: pageConfig.size === 'CUSTOM'
        ? [pageConfig.customWidth || 210, pageConfig.customHeight || 297]
        : pageConfig.size
    });

    // Calcular dimensões com margens
    const margins = pageConfig.margins;
    const contentWidth = pageWidth - margins.left - margins.right;
    const contentHeight = pageHeight - margins.top - margins.bottom;

    // Calcular dimensões da imagem
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    // Adicionar imagem com paginação se necessário
    if (imgHeight <= contentHeight) {
      pdf.addImage(imgData, 'JPEG', margins.left, margins.top, imgWidth, imgHeight);
    } else {
      await this.addMultiPageImage(pdf, canvas, imgWidth, imgHeight, contentHeight, margins);
    }

    const blob = pdf.output('blob');
    const finalFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;

    return {
      success: true,
      blob,
      fileName: finalFileName,
      format: 'pdf'
    };
  }

  /**
   * Exporta para PNG com alta resolução
   */
  private async exportToPNG(
    elementId: string,
    fileName: string,
    qualityConfig: ExportQualityConfig
  ): Promise<ExportResult> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Elemento não encontrado');
    }

    const scale = this.getScaleFromDPI(qualityConfig.resolution);

    // 🚀 Carregar html2canvas dinamicamente
    const html2canvas = await this.loadHtml2Canvas();

    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: false,
      backgroundColor: qualityConfig.transparentBackground ? null : (qualityConfig.backgroundColor || '#ffffff'),
      removeContainer: true,
      logging: false,
    });

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Falha ao criar blob PNG'));
        },
        'image/png'
      );
    });

    const finalFileName = fileName.endsWith('.png') ? fileName : `${fileName}.png`;

    return {
      success: true,
      blob,
      fileName: finalFileName,
      format: 'png'
    };
  }

  /**
   * Exporta para JPG com qualidade configurável
   */
  private async exportToJPG(
    elementId: string,
    fileName: string,
    qualityConfig: ExportQualityConfig
  ): Promise<ExportResult> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Elemento não encontrado');
    }

    const scale = this.getScaleFromDPI(qualityConfig.resolution);
    const quality = qualityConfig.quality / 100; // Converter 0-100 para 0-1

    // 🚀 Carregar html2canvas dinamicamente
    const html2canvas = await this.loadHtml2Canvas();

    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: false,
      backgroundColor: qualityConfig.backgroundColor || '#ffffff',
      removeContainer: true,
      logging: false,
    });

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Falha ao criar blob JPG'));
        },
        'image/jpeg',
        quality
      );
    });

    const finalFileName = fileName.endsWith('.jpg') ? fileName : `${fileName}.jpg`;

    return {
      success: true,
      blob,
      fileName: finalFileName,
      format: 'jpg'
    };
  }

  /**
   * Exporta para DOCX (Word)
   * Nota: Implementação simplificada - converte HTML para imagem e insere no DOCX
   */
  private async exportToDOCX(
    elementId: string,
    fileName: string,
    qualityConfig: ExportQualityConfig
  ): Promise<ExportResult> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Elemento não encontrado');
    }

    // Por enquanto, vamos usar uma abordagem simplificada
    // Criar um documento HTML que pode ser aberto no Word
    const htmlContent = this.generateWordHTML(element);
    const blob = new Blob([htmlContent], { type: 'application/msword' });

    const finalFileName = fileName.endsWith('.doc') ? fileName : `${fileName}.doc`;

    return {
      success: true,
      blob,
      fileName: finalFileName,
      format: 'docx'
    };
  }

  /**
   * Gera HTML compatível com Word
   */
  private generateWordHTML(element: HTMLElement): string {
    const styles = this.extractStyles(element);
    const content = element.innerHTML;

    return `
      <!DOCTYPE html>
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
      <head>
        <meta charset="utf-8">
        <title>Currículo</title>
        <style>
          ${styles}
          body { font-family: Arial, sans-serif; }
          @page { size: A4; margin: 2cm; }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `;
  }

  /**
   * Extrai estilos do elemento
   */
  private extractStyles(element: HTMLElement): string {
    const sheets = document.styleSheets;
    let css = '';

    for (let i = 0; i < sheets.length; i++) {
      try {
        const rules = (sheets[i] as CSSStyleSheet).cssRules;
        for (let j = 0; j < rules.length; j++) {
          css += rules[j].cssText + '\n';
        }
      } catch (e) {
        // Ignorar folhas de estilo de outros domínios
      }
    }

    return css;
  }

  /**
   * Adiciona imagem em múltiplas páginas
   */
  private async addMultiPageImage(
    pdf: jsPDF,
    canvas: HTMLCanvasElement,
    imgWidth: number,
    imgHeight: number,
    pageHeight: number,
    margins: { top: number; left: number }
  ): Promise<void> {
    let sourceY = 0;
    let remainingHeight = imgHeight;
    let pageNumber = 1;

    while (remainingHeight > 0) {
      if (pageNumber > 1) {
        pdf.addPage();
      }

      const heightForPage = Math.min(remainingHeight, pageHeight);
      const sourceHeight = (heightForPage / imgHeight) * canvas.height;

      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');

      tempCanvas.width = canvas.width;
      tempCanvas.height = sourceHeight;

      tempCtx?.drawImage(
        canvas,
        0, sourceY, canvas.width, sourceHeight,
        0, 0, canvas.width, sourceHeight
      );

      const pageImgData = tempCanvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(pageImgData, 'JPEG', margins.left, margins.top, imgWidth, heightForPage);

      sourceY += sourceHeight;
      remainingHeight -= heightForPage;
      pageNumber++;
    }
  }

  /**
   * Converte DPI para escala de renderização
   */
  private getScaleFromDPI(dpi: 72 | 150 | 300): number {
    switch (dpi) {
      case 72:
        return 1;
      case 150:
        return 2;
      case 300:
        return 4;
      default:
        return 2;
    }
  }

  /**
   * Obtém dimensões da página em mm
   */
  private getPageDimensions(pageConfig: PageConfig): { width: number; height: number } {
    if (pageConfig.size === 'CUSTOM') {
      return {
        width: pageConfig.customWidth || 210,
        height: pageConfig.customHeight || 297
      };
    }

    const sizes = {
      A4: { width: 210, height: 297 },
      LETTER: { width: 216, height: 279 }
    };

    const size = sizes[pageConfig.size];

    if (pageConfig.orientation === 'landscape') {
      return { width: size.height, height: size.width };
    }

    return size;
  }

  /**
   * Faz download do blob gerado
   */
  public downloadBlob(blob: Blob, fileName: string): void {
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
   * Retorna estimativa de tempo baseado no formato e resolução
   */
  public estimateExportTime(format: ExportFormat, resolution: 72 | 150 | 300): number {
    const baseTime = {
      pdf: 3000,
      docx: 2000,
      png: 4000,
      jpg: 3500
    };

    const resolutionMultiplier = {
      72: 1,
      150: 1.5,
      300: 2.5
    };

    return baseTime[format] * resolutionMultiplier[resolution];
  }
}

export default AdvancedExportService;

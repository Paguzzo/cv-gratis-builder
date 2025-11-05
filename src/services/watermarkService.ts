import jsPDF from 'jspdf';

/**
 * Posição da marca d'água
 */
export type WatermarkPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'diagonal'
  | 'repeat'; // Marca d'água em grade

/**
 * Estilo da marca d'água
 */
export type WatermarkStyle = 'discrete' | 'bold' | 'transparent';

/**
 * Tipo de marca d'água
 */
export type WatermarkType = 'text' | 'image' | 'both';

/**
 * Configuração de marca d'água de texto
 */
export interface TextWatermarkConfig {
  text: string;
  fontSize: number;
  color: string;
  fontFamily?: string;
  rotation?: number; // Graus
}

/**
 * Configuração de marca d'água de imagem
 */
export interface ImageWatermarkConfig {
  imageData: string; // Base64 ou URL
  width: number;
  height: number;
}

/**
 * Configuração completa de marca d'água
 */
export interface WatermarkConfig {
  type: WatermarkType;
  position: WatermarkPosition;
  style: WatermarkStyle;
  opacity: number; // 0-100
  textConfig?: TextWatermarkConfig;
  imageConfig?: ImageWatermarkConfig;
  enabled: boolean;
}

/**
 * Serviço de marca d'água
 * Aplica marcas d'água personalizadas em PDFs e imagens
 */
export class WatermarkService {
  private static instance: WatermarkService;

  private constructor() {}

  public static getInstance(): WatermarkService {
    if (!WatermarkService.instance) {
      WatermarkService.instance = new WatermarkService();
    }
    return WatermarkService.instance;
  }

  /**
   * Aplica marca d'água em PDF
   */
  public applyToPDF(
    pdf: jsPDF,
    config: WatermarkConfig,
    pageWidth: number,
    pageHeight: number,
    pageNumber?: number
  ): void {
    if (!config.enabled) return;

    const opacity = config.opacity / 100;

    // Aplicar estilo
    this.applyStyleToPDF(pdf, config.style, opacity);

    // Aplicar baseado no tipo
    if (config.type === 'text' || config.type === 'both') {
      if (config.textConfig) {
        this.applyTextWatermarkToPDF(pdf, config.textConfig, config.position, pageWidth, pageHeight);
      }
    }

    if (config.type === 'image' || config.type === 'both') {
      if (config.imageConfig) {
        this.applyImageWatermarkToPDF(pdf, config.imageConfig, config.position, pageWidth, pageHeight);
      }
    }
  }

  /**
   * Aplica marca d'água de texto em PDF
   */
  private applyTextWatermarkToPDF(
    pdf: jsPDF,
    textConfig: TextWatermarkConfig,
    position: WatermarkPosition,
    pageWidth: number,
    pageHeight: number
  ): void {
    const { text, fontSize, color, fontFamily = 'helvetica', rotation = 0 } = textConfig;

    // Configurar fonte e cor
    pdf.setFont(fontFamily);
    pdf.setFontSize(fontSize);

    // Converter cor hex para RGB
    const rgb = this.hexToRGB(color);
    pdf.setTextColor(rgb.r, rgb.g, rgb.b);

    // Calcular posição
    const coords = this.calculatePosition(position, pageWidth, pageHeight, text, fontSize);

    // Aplicar baseado na posição
    if (position === 'repeat') {
      this.applyRepeatedText(pdf, text, fontSize, pageWidth, pageHeight);
    } else {
      pdf.text(text, coords.x, coords.y, {
        angle: rotation || coords.rotation
      });
    }
  }

  /**
   * Aplica marca d'água de imagem em PDF
   */
  private applyImageWatermarkToPDF(
    pdf: jsPDF,
    imageConfig: ImageWatermarkConfig,
    position: WatermarkPosition,
    pageWidth: number,
    pageHeight: number
  ): void {
    const { imageData, width, height } = imageConfig;

    const coords = this.calculateImagePosition(position, pageWidth, pageHeight, width, height);

    // Adicionar imagem
    try {
      pdf.addImage(imageData, 'PNG', coords.x, coords.y, width, height);
    } catch (error) {
      console.error('Erro ao adicionar marca d\'água de imagem:', error);
    }
  }

  /**
   * Aplica marca d'água em canvas (para PNG/JPG)
   */
  public applyToCanvas(
    canvas: HTMLCanvasElement,
    config: WatermarkConfig
  ): HTMLCanvasElement {
    if (!config.enabled) return canvas;

    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    const opacity = config.opacity / 100;
    ctx.globalAlpha = opacity;

    if (config.type === 'text' || config.type === 'both') {
      if (config.textConfig) {
        this.applyTextWatermarkToCanvas(ctx, config.textConfig, config.position, canvas.width, canvas.height);
      }
    }

    if (config.type === 'image' || config.type === 'both') {
      if (config.imageConfig) {
        this.applyImageWatermarkToCanvas(ctx, config.imageConfig, config.position, canvas.width, canvas.height);
      }
    }

    ctx.globalAlpha = 1;
    return canvas;
  }

  /**
   * Aplica marca d'água de texto em canvas
   */
  private applyTextWatermarkToCanvas(
    ctx: CanvasRenderingContext2D,
    textConfig: TextWatermarkConfig,
    position: WatermarkPosition,
    width: number,
    height: number
  ): void {
    const { text, fontSize, color, fontFamily = 'Arial', rotation = 0 } = textConfig;

    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;

    const coords = this.calculatePosition(position, width, height, text, fontSize);

    if (position === 'repeat') {
      this.applyRepeatedTextToCanvas(ctx, text, fontSize, width, height);
    } else {
      ctx.save();
      ctx.translate(coords.x, coords.y);
      ctx.rotate((rotation || coords.rotation) * Math.PI / 180);
      ctx.fillText(text, 0, 0);
      ctx.restore();
    }
  }

  /**
   * Aplica marca d'água de imagem em canvas
   */
  private async applyImageWatermarkToCanvas(
    ctx: CanvasRenderingContext2D,
    imageConfig: ImageWatermarkConfig,
    position: WatermarkPosition,
    width: number,
    height: number
  ): Promise<void> {
    const { imageData, width: imgWidth, height: imgHeight } = imageConfig;

    const img = new Image();
    img.src = imageData;

    await new Promise<void>((resolve) => {
      img.onload = () => {
        const coords = this.calculateImagePosition(position, width, height, imgWidth, imgHeight);
        ctx.drawImage(img, coords.x, coords.y, imgWidth, imgHeight);
        resolve();
      };
      img.onerror = () => resolve();
    });
  }

  /**
   * Aplica estilo à marca d'água no PDF
   */
  private applyStyleToPDF(pdf: jsPDF, style: WatermarkStyle, opacity: number): void {
    // A opacidade será aplicada via GState se necessário
    // Por enquanto, ajustamos cores baseado no estilo
  }

  /**
   * Aplica texto repetido (em grade)
   */
  private applyRepeatedText(
    pdf: jsPDF,
    text: string,
    fontSize: number,
    pageWidth: number,
    pageHeight: number
  ): void {
    const spacing = fontSize * 4;
    const rows = Math.ceil(pageHeight / spacing);
    const cols = Math.ceil(pageWidth / spacing);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = (col + 0.5) * spacing;
        const y = (row + 0.5) * spacing;
        pdf.text(text, x, y, { angle: 45 });
      }
    }
  }

  /**
   * Aplica texto repetido em canvas
   */
  private applyRepeatedTextToCanvas(
    ctx: CanvasRenderingContext2D,
    text: string,
    fontSize: number,
    width: number,
    height: number
  ): void {
    const spacing = fontSize * 4;
    const rows = Math.ceil(height / spacing);
    const cols = Math.ceil(width / spacing);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = (col + 0.5) * spacing;
        const y = (row + 0.5) * spacing;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(45 * Math.PI / 180);
        ctx.fillText(text, 0, 0);
        ctx.restore();
      }
    }
  }

  /**
   * Calcula posição da marca d'água
   */
  private calculatePosition(
    position: WatermarkPosition,
    pageWidth: number,
    pageHeight: number,
    text: string,
    fontSize: number
  ): { x: number; y: number; rotation: number } {
    const textWidth = text.length * fontSize * 0.6; // Estimativa

    switch (position) {
      case 'top-left':
        return { x: 10, y: 20, rotation: 0 };
      case 'top-center':
        return { x: pageWidth / 2 - textWidth / 2, y: 20, rotation: 0 };
      case 'top-right':
        return { x: pageWidth - textWidth - 10, y: 20, rotation: 0 };
      case 'center':
        return { x: pageWidth / 2 - textWidth / 2, y: pageHeight / 2, rotation: 0 };
      case 'bottom-left':
        return { x: 10, y: pageHeight - 10, rotation: 0 };
      case 'bottom-center':
        return { x: pageWidth / 2 - textWidth / 2, y: pageHeight - 10, rotation: 0 };
      case 'bottom-right':
        return { x: pageWidth - textWidth - 10, y: pageHeight - 10, rotation: 0 };
      case 'diagonal':
        return { x: pageWidth / 2, y: pageHeight / 2, rotation: 45 };
      default:
        return { x: pageWidth / 2, y: pageHeight / 2, rotation: 0 };
    }
  }

  /**
   * Calcula posição de imagem
   */
  private calculateImagePosition(
    position: WatermarkPosition,
    pageWidth: number,
    pageHeight: number,
    imgWidth: number,
    imgHeight: number
  ): { x: number; y: number } {
    switch (position) {
      case 'top-left':
        return { x: 10, y: 10 };
      case 'top-center':
        return { x: pageWidth / 2 - imgWidth / 2, y: 10 };
      case 'top-right':
        return { x: pageWidth - imgWidth - 10, y: 10 };
      case 'center':
        return { x: pageWidth / 2 - imgWidth / 2, y: pageHeight / 2 - imgHeight / 2 };
      case 'bottom-left':
        return { x: 10, y: pageHeight - imgHeight - 10 };
      case 'bottom-center':
        return { x: pageWidth / 2 - imgWidth / 2, y: pageHeight - imgHeight - 10 };
      case 'bottom-right':
        return { x: pageWidth - imgWidth - 10, y: pageHeight - imgHeight - 10 };
      case 'diagonal':
        return { x: pageWidth / 2 - imgWidth / 2, y: pageHeight / 2 - imgHeight / 2 };
      default:
        return { x: pageWidth / 2 - imgWidth / 2, y: pageHeight / 2 - imgHeight / 2 };
    }
  }

  /**
   * Converte cor hexadecimal para RGB
   */
  private hexToRGB(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : { r: 0, g: 0, b: 0 };
  }

  /**
   * Cria configuração padrão de marca d'água
   */
  public createDefaultConfig(): WatermarkConfig {
    return {
      type: 'text',
      position: 'bottom-right',
      style: 'discrete',
      opacity: 30,
      textConfig: {
        text: 'CVGratis.com.br',
        fontSize: 12,
        color: '#cccccc',
        fontFamily: 'helvetica',
        rotation: 0
      },
      enabled: false
    };
  }

  /**
   * Cria marca d'água personalizada
   */
  public createCustomWatermark(
    text: string,
    position: WatermarkPosition = 'bottom-right',
    opacity: number = 30
  ): WatermarkConfig {
    return {
      type: 'text',
      position,
      style: 'discrete',
      opacity,
      textConfig: {
        text,
        fontSize: 12,
        color: '#cccccc',
        fontFamily: 'helvetica',
        rotation: 0
      },
      enabled: true
    };
  }

  /**
   * Cria marca d'água de imagem
   */
  public createImageWatermark(
    imageData: string,
    width: number,
    height: number,
    position: WatermarkPosition = 'bottom-right',
    opacity: number = 30
  ): WatermarkConfig {
    return {
      type: 'image',
      position,
      style: 'discrete',
      opacity,
      imageConfig: {
        imageData,
        width,
        height
      },
      enabled: true
    };
  }

  /**
   * Valida configuração de marca d'água
   */
  public validateConfig(config: WatermarkConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (config.opacity < 0 || config.opacity > 100) {
      errors.push('Opacidade deve estar entre 0 e 100');
    }

    if (config.type === 'text' || config.type === 'both') {
      if (!config.textConfig) {
        errors.push('Configuração de texto ausente');
      } else if (!config.textConfig.text || config.textConfig.text.trim() === '') {
        errors.push('Texto da marca d\'água vazio');
      }
    }

    if (config.type === 'image' || config.type === 'both') {
      if (!config.imageConfig) {
        errors.push('Configuração de imagem ausente');
      } else if (!config.imageConfig.imageData) {
        errors.push('Imagem da marca d\'água ausente');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Converte imagem para base64
   */
  public async imageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

export default WatermarkService;

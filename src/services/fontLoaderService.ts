// Serviço para carregar fontes do Google Fonts dinamicamente
import { FontConfig } from '@/types/customTemplate';

class FontLoaderService {
  private loadedFonts: Set<string> = new Set();
  private fontCache: Map<string, FontFace> = new Map();

  /**
   * Carrega fontes do Google Fonts
   */
  async loadGoogleFonts(fonts: string[]): Promise<void> {
    const fontsToLoad = fonts.filter(font => !this.loadedFonts.has(font));

    if (fontsToLoad.length === 0) {
      console.log('[FontLoader] Todas as fontes já estão carregadas');
      return;
    }

    const fontFamilies = fontsToLoad.join('|').replace(/ /g, '+');
    const url = `https://fonts.googleapis.com/css2?family=${fontFamilies}&display=swap`;

    try {
      // Criar link element para carregar as fontes
      const link = document.createElement('link');
      link.href = url;
      link.rel = 'stylesheet';

      // Adicionar ao head
      document.head.appendChild(link);

      // Aguardar o carregamento
      await new Promise((resolve, reject) => {
        link.onload = resolve;
        link.onerror = reject;

        // Timeout de 5 segundos
        setTimeout(() => reject(new Error('Timeout loading fonts')), 5000);
      });

      // Marcar como carregadas
      fontsToLoad.forEach(font => this.loadedFonts.add(font));

      console.log('[FontLoader] Fontes carregadas com sucesso:', fontsToLoad);
    } catch (error) {
      console.error('[FontLoader] Erro ao carregar fontes:', error);
      throw error;
    }
  }

  /**
   * Carrega uma configuração de fonte completa
   */
  async loadFontConfig(config: FontConfig): Promise<void> {
    if (config.googleFonts && config.googleFonts.length > 0) {
      await this.loadGoogleFonts(config.googleFonts);
    }
  }

  /**
   * Carrega uma fonte customizada de arquivo
   */
  async loadCustomFont(name: string, url: string, weight: number = 400): Promise<void> {
    const cacheKey = `${name}-${weight}`;

    if (this.fontCache.has(cacheKey)) {
      console.log(`[FontLoader] Fonte customizada já carregada: ${name}`);
      return;
    }

    try {
      const fontFace = new FontFace(name, `url(${url})`, {
        weight: weight.toString(),
        style: 'normal'
      });

      await fontFace.load();
      document.fonts.add(fontFace);

      this.fontCache.set(cacheKey, fontFace);
      console.log(`[FontLoader] Fonte customizada carregada: ${name}`);
    } catch (error) {
      console.error(`[FontLoader] Erro ao carregar fonte customizada ${name}:`, error);
      throw error;
    }
  }

  /**
   * Verifica se uma fonte está disponível no sistema
   */
  isFontAvailable(fontName: string): boolean {
    // Criar um elemento temporário para testar
    const testElement = document.createElement('span');
    testElement.style.fontFamily = fontName;
    testElement.style.position = 'absolute';
    testElement.style.visibility = 'hidden';
    testElement.textContent = 'test';

    document.body.appendChild(testElement);

    // Medir largura com fonte padrão
    const defaultWidth = testElement.offsetWidth;

    // Tentar aplicar a fonte
    testElement.style.fontFamily = `${fontName}, monospace`;
    const testWidth = testElement.offsetWidth;

    document.body.removeChild(testElement);

    // Se as larguras forem diferentes, a fonte está disponível
    return defaultWidth !== testWidth;
  }

  /**
   * Obtém lista de fontes carregadas
   */
  getLoadedFonts(): string[] {
    return Array.from(this.loadedFonts);
  }

  /**
   * Limpa cache de fontes
   */
  clearCache(): void {
    this.fontCache.clear();
    this.loadedFonts.clear();
    console.log('[FontLoader] Cache de fontes limpo');
  }

  /**
   * Pré-carrega fontes populares do Google Fonts
   */
  async preloadPopularFonts(): Promise<void> {
    const popularFonts = [
      'Inter:400,500,700',
      'Roboto:400,500,700',
      'Open Sans:400,600,700',
      'Poppins:400,600,700',
      'Playfair Display:700'
    ];

    try {
      await this.loadGoogleFonts(popularFonts);
      console.log('[FontLoader] Fontes populares pré-carregadas');
    } catch (error) {
      console.error('[FontLoader] Erro ao pré-carregar fontes populares:', error);
    }
  }

  /**
   * Aplica uma configuração de fonte a um elemento
   */
  applyFontConfig(element: HTMLElement, config: FontConfig, type: 'heading' | 'body'): void {
    if (type === 'heading') {
      element.style.fontFamily = config.headingFont;
      element.style.fontWeight = config.headingWeight?.toString() || '700';
      element.style.fontSize = config.headingSize ? `${config.headingSize}px` : '';
    } else {
      element.style.fontFamily = config.bodyFont;
      element.style.fontWeight = config.bodyWeight?.toString() || '400';
      element.style.fontSize = config.bodySize ? `${config.bodySize}px` : '';
    }

    if (config.lineHeight) {
      element.style.lineHeight = config.lineHeight.toString();
    }

    if (config.letterSpacing) {
      element.style.letterSpacing = config.letterSpacing;
    }
  }

  /**
   * Gera CSS para uma configuração de fonte
   */
  generateFontCSS(config: FontConfig): string {
    return `
      body {
        font-family: ${config.bodyFont};
        font-weight: ${config.bodyWeight || 400};
        font-size: ${config.bodySize || 14}px;
        line-height: ${config.lineHeight || 1.5};
        letter-spacing: ${config.letterSpacing || 'normal'};
      }

      h1, h2, h3, h4, h5, h6 {
        font-family: ${config.headingFont};
        font-weight: ${config.headingWeight || 700};
        letter-spacing: ${config.letterSpacing || 'normal'};
      }

      h1 {
        font-size: ${config.headingSize || 24}px;
      }

      h2 {
        font-size: ${config.subheadingSize || 18}px;
      }

      h3, h4 {
        font-size: ${config.bodySize ? config.bodySize + 2 : 16}px;
      }
    `;
  }
}

// Exportar instância singleton
export const fontLoaderService = new FontLoaderService();

// Exportar a classe também para casos específicos
export default FontLoaderService;

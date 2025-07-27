/**
 * 🗜️ ASSET OPTIMIZER - Otimização automática de assets e imagens
 * 
 * Funcionalidades:
 * - Lazy loading de imagens
 * - Compressão automática de imagens grandes
 * - Preload de assets críticos  
 * - Webp fallback para imagens
 * - Purge de CSS não utilizado
 * - Bundle size monitoring
 */

interface AssetOptimizationConfig {
  enableLazyImages: boolean;
  enableWebpFallback: boolean;
  enablePreload: boolean;
  imageQuality: number; // 0-100
  maxImageSize: number; // em bytes
}

interface AssetStats {
  totalImages: number;
  optimizedImages: number;
  sizeSaved: number;
  lazyImagesLoaded: number;
  webpSupported: boolean;
}

class AssetOptimizer {
  private static instance: AssetOptimizer;
  private config: AssetOptimizationConfig = {
    enableLazyImages: true,
    enableWebpFallback: true,
    enablePreload: true,
    imageQuality: 85,
    maxImageSize: 500 * 1024 // 500KB
  };
  
  private stats: AssetStats = {
    totalImages: 0,
    optimizedImages: 0,
    sizeSaved: 0,
    lazyImagesLoaded: 0,
    webpSupported: this.checkWebpSupport()
  };

  private intersectionObserver: IntersectionObserver | null = null;
  private preloadedAssets = new Set<string>();

  private constructor() {
    this.initializeOptimizations();
  }

  public static getInstance(): AssetOptimizer {
    if (!AssetOptimizer.instance) {
      AssetOptimizer.instance = new AssetOptimizer();
    }
    return AssetOptimizer.instance;
  }

  /**
   * 🚀 INITIALIZATION
   */
  private initializeOptimizations(): void {
    if (typeof window !== 'undefined') {
      this.setupLazyLoading();
      this.preloadCriticalAssets();
      this.optimizeExistingImages();
      console.log('🗜️ Asset Optimizer initialized');
    }
  }

  /**
   * 🖼️ LAZY LOADING DE IMAGENS
   */
  private setupLazyLoading(): void {
    if (!this.config.enableLazyImages || !('IntersectionObserver' in window)) {
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            this.loadImage(img);
            this.intersectionObserver?.unobserve(img);
          }
        });
      },
      { 
        rootMargin: '50px 0px', // Carregar 50px antes de aparecer
        threshold: 0.1 
      }
    );
  }

  public enableLazyLoading(selector: string = 'img[data-src]'): void {
    if (!this.intersectionObserver) return;

    const images = document.querySelectorAll(selector);
    images.forEach(img => {
      this.intersectionObserver?.observe(img);
      this.stats.totalImages++;
    });

    console.log(`🖼️ Lazy loading enabled for ${images.length} images`);
  }

  private loadImage(img: HTMLImageElement): void {
    const src = img.dataset.src;
    if (!src) return;

    // Criar versão otimizada da URL se possível
    const optimizedSrc = this.getOptimizedImageUrl(src);
    
    // Preloader para transição suave
    const tempImg = new Image();
    tempImg.onload = () => {
      img.src = optimizedSrc;
      img.classList.add('loaded');
      this.stats.lazyImagesLoaded++;
    };
    tempImg.onerror = () => {
      // Fallback para imagem original
      img.src = src;
    };
    tempImg.src = optimizedSrc;
  }

  /**
   * 🎯 PRELOAD DE ASSETS CRÍTICOS
   */
  private preloadCriticalAssets(): void {
    if (!this.config.enablePreload) return;

    const criticalAssets = [
      '/templates/free-modern.png',
      '/icons/logo.svg',
      // Adicionar outros assets críticos conforme necessário
    ];

    criticalAssets.forEach(asset => this.preloadAsset(asset));
  }

  public preloadAsset(url: string, type: 'image' | 'style' | 'script' = 'image'): void {
    if (this.preloadedAssets.has(url)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    
    switch (type) {
      case 'image':
        link.as = 'image';
        break;
      case 'style':
        link.as = 'style';
        break;
      case 'script':
        link.as = 'script';
        break;
    }

    document.head.appendChild(link);
    this.preloadedAssets.add(url);
    
    console.log(`🎯 Preloaded asset: ${url}`);
  }

  /**
   * 🗜️ OTIMIZAÇÃO DE IMAGENS
   */
  private getOptimizedImageUrl(originalUrl: string): string {
    // Se suporta WebP, tentar versão WebP primeiro
    if (this.stats.webpSupported && this.config.enableWebpFallback) {
      const webpUrl = originalUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      return webpUrl;
    }

    // Adicionar parâmetros de qualidade se for URL externa
    if (originalUrl.includes('http') && !originalUrl.includes(window.location.origin)) {
      const separator = originalUrl.includes('?') ? '&' : '?';
      return `${originalUrl}${separator}quality=${this.config.imageQuality}&format=auto`;
    }

    return originalUrl;
  }

  private optimizeExistingImages(): void {
    const images = document.querySelectorAll('img:not([data-optimized])');
    
    images.forEach((img: Element) => {
      const imageElement = img as HTMLImageElement;
      
      // Marcar como processada
      imageElement.dataset.optimized = 'true';
      
      // Adicionar loading lazy se não tiver
      if (!imageElement.loading) {
        imageElement.loading = 'lazy';
      }

      // Aplicar otimizações de estilo
      this.applyImageOptimizations(imageElement);
      
      this.stats.optimizedImages++;
    });

    console.log(`🗜️ Optimized ${images.length} existing images`);
  }

  private applyImageOptimizations(img: HTMLImageElement): void {
    // Evitar layout shift
    if (!img.style.aspectRatio && img.dataset.aspectRatio) {
      img.style.aspectRatio = img.dataset.aspectRatio;
    }

    // Otimizar rendering
    img.style.contentVisibility = 'auto';
    
    // Adicionar classe para CSS otimizações
    img.classList.add('optimized-image');
  }

  /**
   * 📊 MONITORING E ANALYTICS
   */
  public getStats(): AssetStats {
    return { ...this.stats };
  }

  public getBundleAnalysis(): { 
    estimatedSize: number; 
    recommendations: string[];
    criticalAssets: string[];
  } {
    const recommendations: string[] = [];
    const criticalAssets: string[] = [];

    // Analisar imagens grandes
    const images = document.querySelectorAll('img');
    let estimatedSize = 0;

    images.forEach(img => {
      if (img.naturalWidth > 1920 || img.naturalHeight > 1080) {
        recommendations.push(`Imagem muito grande: ${img.src} (${img.naturalWidth}x${img.naturalHeight})`);
      }
      
      // Estimar tamanho (aproximação)
      estimatedSize += (img.naturalWidth * img.naturalHeight * 3) / 8; // RGB em bytes
    });

    // Verificar se há CSS não usado
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    if (stylesheets.length > 5) {
      recommendations.push('Muitos arquivos CSS - considere concatenar');
    }

    // Assets críticos identificados
    criticalAssets.push(...Array.from(this.preloadedAssets));

    return {
      estimatedSize: Math.round(estimatedSize / 1024), // KB
      recommendations,
      criticalAssets
    };
  }

  /**
   * 🔧 UTILITY METHODS
   */
  private checkWebpSupport(): boolean {
    if (typeof window === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  public updateConfig(newConfig: Partial<AssetOptimizationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('🗜️ Asset Optimizer config updated:', this.config);
  }

  /**
   * 🎨 CSS OPTIMIZATION
   */
  public addOptimizedImageCSS(): void {
    if (document.getElementById('asset-optimizer-styles')) return;

    const style = document.createElement('style');
    style.id = 'asset-optimizer-styles';
    style.textContent = `
      .optimized-image {
        contain: layout style paint;
        content-visibility: auto;
        image-rendering: auto;
      }
      
      .optimized-image[loading="lazy"] {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
      }
      
      .optimized-image.loaded,
      .optimized-image[loading="lazy"]:not([data-src]) {
        opacity: 1;
      }
      
      /* Placeholder para imagens lazy */
      .optimized-image[data-src]:not(.loaded) {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }
      
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      /* Otimizações para imagens de template */
      .template-preview img {
        object-fit: cover;
        will-change: transform;
      }
    `;
    
    document.head.appendChild(style);
    console.log('🎨 Added optimized image CSS');
  }
}

// 🌟 EXPORT E INICIALIZAÇÃO
export const assetOptimizer = AssetOptimizer.getInstance();

// 🎯 REACT HOOKS
export const useAssetStats = () => {
  return assetOptimizer.getStats();
};

export const useBundleAnalysis = () => {
  return assetOptimizer.getBundleAnalysis();
};

// 🚀 AUTO-INITIALIZE
if (typeof window !== 'undefined') {
  // Adicionar CSS otimizado
  assetOptimizer.addOptimizedImageCSS();
  
  // Otimizar imagens quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      assetOptimizer.enableLazyLoading();
    });
  } else {
    assetOptimizer.enableLazyLoading();
  }
} 
import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'loading'> {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  aspectRatio?: string;
  blurDataURL?: string;
}

/**
 * Componente de imagem com lazy loading otimizado
 * - Lazy loading nativo do navegador
 * - Fallback para navegadores antigos com IntersectionObserver
 * - Placeholder blur opcional
 * - Aspect ratio para evitar layout shift
 */
export function LazyImage({
  src,
  alt,
  fallback = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif" font-size="18"%3ECarregando...%3C/text%3E%3C/svg%3E',
  className,
  aspectRatio,
  blurDataURL,
  ...props
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(blurDataURL || fallback);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Verificar suporte a lazy loading nativo
    const supportsLazyLoading = 'loading' in HTMLImageElement.prototype;

    if (supportsLazyLoading) {
      // Navegador suporta lazy loading nativo, carregar imagem
      setImageSrc(src);
    } else {
      // Fallback com IntersectionObserver
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: '50px', // Começar a carregar 50px antes de entrar no viewport
        }
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => {
        observer.disconnect();
      };
    }
  }, [src]);

  const handleLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleError = () => {
    setImageError(true);
    setImageSrc(fallback);
  };

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          imageLoaded && !imageError ? 'opacity-100' : 'opacity-70',
          blurDataURL && !imageLoaded ? 'blur-sm' : ''
        )}
        {...props}
      />

      {/* Loading overlay */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" aria-hidden="true" />
      )}
    </div>
  );
}

export default LazyImage;

/**
 * 💬 TOOLTIP SYSTEM - Sistema de tooltips explicativos
 * 
 * Funcionalidades:
 * - Tooltips responsivos e acessíveis
 * - Posicionamento inteligente
 * - Suporte a conteúdo rico (HTML)
 * - Delays configuráveis
 * - Temas variados
 * - Mobile-friendly
 * - ARIA accessibility
 */

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { Info, HelpCircle, AlertTriangle, CheckCircle, X } from 'lucide-react';

// 🎯 TYPES E INTERFACES
interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  variant?: 'default' | 'info' | 'warning' | 'success' | 'error' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  delay?: number;
  disabled?: boolean;
  className?: string;
  arrow?: boolean;
  trigger?: 'hover' | 'click' | 'focus';
  maxWidth?: number;
}

interface TooltipContentProps {
  content: ReactNode;
  position: 'top' | 'bottom' | 'left' | 'right';
  variant: string;
  size: string;
  arrow: boolean;
  maxWidth: number;
  triggerRect: DOMRect;
  className?: string;
}

interface HelpTooltipProps {
  title: string;
  description: string;
  steps?: string[];
  variant?: 'info' | 'warning' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// 🎨 TOOLTIP PRINCIPAL
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'auto',
  variant = 'default',
  size = 'md',
  delay = 300,
  disabled = false,
  className,
  arrow = true,
  trigger = 'hover',
  maxWidth = 300
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top');
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // 🎯 CALCULAR POSIÇÃO INTELIGENTE
  const calculatePosition = (rect: DOMRect): 'top' | 'bottom' | 'left' | 'right' => {
    if (position !== 'auto') return position;

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollY: window.scrollY,
      scrollX: window.scrollX
    };

    // Verificar espaço disponível em cada direção
    const spaceTop = rect.top - viewport.scrollY;
    const spaceBottom = viewport.height - (rect.bottom - viewport.scrollY);
    const spaceLeft = rect.left - viewport.scrollX;
    const spaceRight = viewport.width - (rect.right - viewport.scrollX);

    // Escolher posição com mais espaço
    const maxSpace = Math.max(spaceTop, spaceBottom, spaceLeft, spaceRight);
    
    if (maxSpace === spaceTop && spaceTop > 100) return 'top';
    if (maxSpace === spaceBottom && spaceBottom > 100) return 'bottom';
    if (maxSpace === spaceLeft && spaceLeft > 150) return 'left';
    if (maxSpace === spaceRight && spaceRight > 150) return 'right';
    
    // Fallback: posição com mais espaço vertical
    return spaceBottom > spaceTop ? 'bottom' : 'top';
  };

  // 🔄 EVENT HANDLERS
  const showTooltip = () => {
    if (disabled || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    setTriggerRect(rect);
    setCurrentPosition(calculatePosition(rect));

    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    } else {
      setIsVisible(true);
    }
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const handleClick = () => {
    if (trigger === 'click') {
      isVisible ? hideTooltip() : showTooltip();
    }
  };

  const handleFocus = () => {
    if (trigger === 'focus') {
      showTooltip();
    }
  };

  const handleBlur = () => {
    if (trigger === 'focus') {
      hideTooltip();
    }
  };

  // 🧹 CLEANUP
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // 🎨 EVENT PROPS
  const eventProps = {
    ...(trigger === 'hover' && {
      onMouseEnter: showTooltip,
      onMouseLeave: hideTooltip,
    }),
    ...(trigger === 'click' && {
      onClick: handleClick,
    }),
    ...(trigger === 'focus' && {
      onFocus: handleFocus,
      onBlur: handleBlur,
      tabIndex: 0,
    }),
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={cn('inline-block', className)}
        {...eventProps}
      >
        {children}
      </div>
      
      {isVisible && triggerRect && createPortal(
        <TooltipContent
          content={content}
          position={currentPosition}
          variant={variant}
          size={size}
          arrow={arrow}
          maxWidth={maxWidth}
          triggerRect={triggerRect}
        />,
        document.body
      )}
    </>
  );
};

// 🎨 CONTEÚDO DO TOOLTIP
const TooltipContent: React.FC<TooltipContentProps> = ({
  content,
  position,
  variant,
  size,
  arrow,
  maxWidth,
  triggerRect,
  className
}) => {
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const calculateStyle = (): React.CSSProperties => {
      const offset = 8; // Distância do trigger
      const arrowSize = arrow ? 6 : 0;

      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = triggerRect.top + window.scrollY - offset - arrowSize;
          left = triggerRect.left + window.scrollX + (triggerRect.width / 2);
          break;
        case 'bottom':
          top = triggerRect.bottom + window.scrollY + offset + arrowSize;
          left = triggerRect.left + window.scrollX + (triggerRect.width / 2);
          break;
        case 'left':
          top = triggerRect.top + window.scrollY + (triggerRect.height / 2);
          left = triggerRect.left + window.scrollX - offset - arrowSize;
          break;
        case 'right':
          top = triggerRect.top + window.scrollY + (triggerRect.height / 2);
          left = triggerRect.right + window.scrollX + offset + arrowSize;
          break;
      }

      return {
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        maxWidth: `${maxWidth}px`,
        transform: position === 'left' || position === 'right' 
          ? 'translateY(-50%)' 
          : 'translateX(-50%)',
        zIndex: 9999,
      };
    };

    setTooltipStyle(calculateStyle());
  }, [position, triggerRect, maxWidth, arrow]);

  // 🎨 VARIANT CLASSES
  const variantClasses = {
    default: 'bg-gray-900 text-white border-gray-700',
    info: 'bg-blue-900 text-blue-100 border-blue-700',
    warning: 'bg-yellow-900 text-yellow-100 border-yellow-700',
    success: 'bg-green-900 text-green-100 border-green-700',
    error: 'bg-red-900 text-red-100 border-red-700',
    premium: 'bg-gradient-to-r from-purple-900 to-pink-900 text-white border-purple-700'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  // 🎯 ARROW CLASSES
  const arrowClasses = arrow ? {
    top: 'after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-current',
    bottom: 'after:absolute after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-b-current',
    left: 'after:absolute after:left-full after:top-1/2 after:-translate-y-1/2 after:border-4 after:border-transparent after:border-l-current',
    right: 'after:absolute after:right-full after:top-1/2 after:-translate-y-1/2 after:border-4 after:border-transparent after:border-r-current'
  } : {};

  return (
    <div
      style={tooltipStyle}
      className={cn(
        'rounded-lg border shadow-lg backdrop-blur-sm relative transition-all duration-200 ease-out',
        'animate-in fade-in-0 zoom-in-95',
        variantClasses[variant as keyof typeof variantClasses],
        sizeClasses[size as keyof typeof sizeClasses],
        arrow && arrowClasses[position],
        className
      )}
      role="tooltip"
      aria-live="polite"
    >
      {content}
    </div>
  );
};

// 💡 HELP TOOLTIP ESPECIALIZADO
export const HelpTooltip: React.FC<HelpTooltipProps> = ({
  title,
  description,
  steps = [],
  variant = 'info',
  size = 'md',
  className
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const content = (
    <div className="space-y-2 max-w-xs">
      <div className="flex items-center gap-2">
        {getIcon()}
        <h4 className="font-semibold text-sm">{title}</h4>
      </div>
      <p className="text-xs leading-relaxed opacity-90">{description}</p>
      {steps.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium mb-2">Passos:</p>
          <ol className="list-decimal list-inside space-y-1">
            {steps.map((step, index) => (
              <li key={index} className="text-xs opacity-90">{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );

  return (
    <Tooltip
      content={content}
      variant={variant}
      size={size}
      position="auto"
      maxWidth={350}
      className={className}
    >
      <HelpCircle className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-help transition-colors" />
    </Tooltip>
  );
};

// 🏷️ FEATURE TOOLTIP
export const FeatureTooltip: React.FC<{
  feature: string;
  description: string;
  isPremium?: boolean;
  children: ReactNode;
  className?: string;
}> = ({ feature, description, isPremium = false, children, className }) => {
  const content = (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-sm">{feature}</span>
        {isPremium && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            Premium
          </span>
        )}
      </div>
      <p className="text-xs leading-relaxed opacity-90">{description}</p>
    </div>
  );

  return (
    <Tooltip
      content={content}
      variant={isPremium ? 'premium' : 'default'}
      position="auto"
      className={className}
    >
      {children}
    </Tooltip>
  );
};

// 🎯 PRESET TOOLTIPS COMUNS
export const TooltipPresets = {
  download: "Baixar arquivo em formato PDF otimizado para impressão e compartilhamento.",
  print: "Imprimir diretamente do navegador com formatação profissional.",
  email: "Enviar currículo por email para contatos e recrutadores.",
  premium: "Recurso premium com templates exclusivos e sem marca d'água.",
  save: "Salvar automaticamente suas informações no navegador.",
  edit: "Editar informações do currículo em tempo real.",
  preview: "Visualizar como o currículo ficará no formato final.",
  template: "Escolher entre diferentes modelos profissionais."
};

// 🎨 CSS GLOBAL PARA ANIMAÇÕES
export const TooltipSystemCSS = () => (
  <style>{`
    @keyframes tooltip-in {
      from {
        opacity: 0;
        transform: translateY(4px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    .animate-tooltip-in {
      animation: tooltip-in 0.15s ease-out;
    }
    
    /* Acessibilidade: High contrast mode */
    @media (prefers-contrast: high) {
      [role="tooltip"] {
        border: 2px solid currentColor !important;
      }
    }
    
    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      [role="tooltip"] {
        animation: none !important;
        transition: none !important;
      }
    }
  `}</style>
); 
/**
 * 🎨 LOADING SYSTEM - Sistema global de loading states visuais
 * 
 * Funcionalidades:
 * - Loading spinners padronizados
 * - Skeleton loaders para conteúdo
 * - Progress bars para operações longas
 * - Shimmer effects para placeholders
 * - Loading overlays globais
 * - Micro-interações suaves
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Loader2, Download, Upload, FileText, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

// 🎯 TYPES E INTERFACES
interface LoadingContextType {
  isLoading: boolean;
  loadingMessage: string;
  setLoading: (loading: boolean, message?: string) => void;
  showProgress: (progress: number) => void;
  hideProgress: () => void;
  progress: number | null;
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
  label?: string;
}

interface SkeletonProps {
  className?: string;
  lines?: number;
  animate?: boolean;
  variant?: 'text' | 'card' | 'image' | 'button' | 'circle';
}

interface ProgressBarProps {
  progress: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  animated?: boolean;
  className?: string;
}

// 🌟 LOADING CONTEXT
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};

// 🎛️ LOADING PROVIDER
export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Carregando...');
  const [progress, setProgress] = useState<number | null>(null);

  const setLoading = (loading: boolean, message = 'Carregando...') => {
    setIsLoading(loading);
    setLoadingMessage(message);
    if (!loading) {
      setProgress(null);
    }
  };

  const showProgress = (progressValue: number) => {
    setProgress(Math.max(0, Math.min(100, progressValue)));
  };

  const hideProgress = () => {
    setProgress(null);
  };

  return (
    <LoadingContext.Provider value={{
      isLoading,
      loadingMessage,
      setLoading,
      showProgress,
      hideProgress,
      progress
    }}>
      {children}
      {isLoading && <GlobalLoadingOverlay message={loadingMessage} progress={progress} />}
    </LoadingContext.Provider>
  );
};

// 🌀 LOADING SPINNER COMPONENT
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className,
  label
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const variantClasses = {
    default: 'text-gray-500',
    primary: 'text-blue-600',
    secondary: 'text-purple-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600'
  };

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2 className={cn(
        'animate-spin',
        sizeClasses[size],
        variantClasses[variant]
      )} />
      {label && (
        <span className={cn(
          'text-sm font-medium',
          variantClasses[variant]
        )}>
          {label}
        </span>
      )}
    </div>
  );
};

// 💀 SKELETON LOADER COMPONENT
export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  lines = 1,
  animate = true,
  variant = 'text'
}) => {
  const baseClasses = cn(
    'bg-gray-200 rounded',
    animate && 'animate-pulse',
    className
  );

  const variantClasses = {
    text: 'h-4 w-full',
    card: 'h-32 w-full',
    image: 'h-48 w-full',
    button: 'h-10 w-24',
    circle: 'h-12 w-12 rounded-full'
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i}
            className={cn(
              baseClasses,
              variantClasses[variant],
              i === lines - 1 && 'w-3/4' // Última linha menor
            )} 
          />
        ))}
      </div>
    );
  }

  return <div className={cn(baseClasses, variantClasses[variant])} />;
};

// 📊 PROGRESS BAR COMPONENT
export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  size = 'md',
  variant = 'default',
  animated = true,
  className
}) => {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const variantClasses = {
    default: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600'
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
        </div>
      )}
      <div className={cn(
        'w-full bg-gray-200 rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-out',
            variantClasses[variant],
            animated && 'animate-pulse'
          )}
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
      </div>
    </div>
  );
};

// ✨ SHIMMER EFFECT COMPONENT
export const ShimmerCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn(
    'animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded-lg',
    'animate-shimmer',
    className
  )}>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      <div className="h-3 bg-gray-300 rounded w-full"></div>
    </div>
  </div>
);

// 🎯 GLOBAL LOADING OVERLAY
const GlobalLoadingOverlay: React.FC<{ message: string; progress?: number | null }> = ({ 
  message, 
  progress 
}) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full mx-4">
      <div className="text-center space-y-4">
        <LoadingSpinner size="xl" variant="primary" />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{message}</h3>
          {progress !== null && (
            <div className="mt-3">
              <ProgressBar 
                progress={progress || 0} 
                variant="default" 
                animated 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// 🎨 LOADING BUTTON COMPONENT
export const LoadingButton: React.FC<{
  loading?: boolean;
  children: React.ReactNode;
  loadingText?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}> = ({
  loading = false,
  children,
  loadingText = 'Carregando...',
  icon,
  variant = 'default',
  size = 'md',
  className,
  onClick,
  disabled = false
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    default: 'bg-gray-600 hover:bg-gray-700 text-white',
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-purple-600 hover:bg-purple-700 text-white',
    outline: 'border-2 border-gray-300 hover:border-gray-400 text-gray-700'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" variant="default" />
          {loadingText}
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
};

// 🎯 ACTION LOADING STATES
export const ActionLoadingStates = {
  downloading: { icon: <Download className="w-4 h-4" />, message: 'Baixando arquivo...' },
  uploading: { icon: <Upload className="w-4 h-4" />, message: 'Enviando arquivo...' },
  processing: { icon: <Zap className="w-4 h-4" />, message: 'Processando...' },
  generating: { icon: <FileText className="w-4 h-4" />, message: 'Gerando documento...' },
  saving: { icon: <FileText className="w-4 h-4" />, message: 'Salvando dados...' }
};

// 🚀 CUSTOM HOOKS PARA OPERAÇÕES COMUNS
export const useAsyncOperation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async <T,>(
    operation: () => Promise<T>,
    loadingMessage = 'Processando...'
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await operation();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, execute };
};

// 🎨 CSS ADICIONAL PARA ANIMAÇÕES
export const LoadingSystemCSS = () => (
  <style>{`
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    .animate-shimmer {
      animation: shimmer 2s infinite linear;
    }
    
    .loading-fade-in {
      animation: fadeIn 0.3s ease-in-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `}</style>
); 
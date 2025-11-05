import React, { Component, ReactNode } from 'react';
import { errorLogger } from '@/services/errorLogger';
import { ErrorFallback } from './ErrorFallback';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, resetError: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  errorType?: 'generic' | 'form' | 'template' | 'page';
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Genérico
 *
 * Captura erros em qualquer parte da árvore de componentes React
 * e exibe uma UI de fallback amigável ao invés de quebrar toda a aplicação.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <ComponenteQuePodemFalhar />
 * </ErrorBoundary>
 * ```
 *
 * @example Com fallback customizado
 * ```tsx
 * <ErrorBoundary
 *   fallback={(error, reset) => <MeuComponenteDeErro error={error} onReset={reset} />}
 * >
 *   <ComponenteQuePodemFalhar />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Atualiza o estado para renderizar a UI de fallback na próxima renderização
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Loga o erro para o serviço de logging
    errorLogger.logError(error, errorInfo);

    // Callback customizado se fornecido
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Renderizar fallback customizado se fornecido
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      // Renderizar fallback padrão
      return (
        <ErrorFallback
          error={this.state.error}
          resetError={this.resetError}
          errorType={this.props.errorType}
        />
      );
    }

    return this.props.children;
  }
}

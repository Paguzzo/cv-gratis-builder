import React, { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface FormErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Error Boundary Específico para Formulários
 *
 * Componente especializado para capturar erros em formulários multi-etapas.
 * Preserva os dados do usuário e oferece opção de tentar novamente sem perder o progresso.
 *
 * @example
 * ```tsx
 * <FormErrorBoundary>
 *   <FormularioMultiEtapas />
 * </FormErrorBoundary>
 * ```
 */
export function FormErrorBoundary({ children, onError }: FormErrorBoundaryProps) {
  const handleFormError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log customizado para erros de formulário
    console.group('📝 Form Error Boundary - Erro no Formulário');
    console.error('Erro:', error.message);
    console.error('Component Stack:', errorInfo.componentStack);

    // Verificar se dados do formulário existem
    const hasFormData = !!localStorage.getItem('cvgratis-curriculum');
    console.log('Dados do formulário preservados:', hasFormData);
    console.groupEnd();

    // Callback customizado se fornecido
    if (onError) {
      onError(error, errorInfo);
    }
  };

  const customFallback = (error: Error, resetError: () => void) => {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">Erro no Formulário</AlertTitle>
          <AlertDescription className="mt-2">
            Ocorreu um erro ao processar o formulário, mas não se preocupe - seus dados foram
            salvos automaticamente e não foram perdidos.
          </AlertDescription>
        </Alert>

        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Seus dados estão seguros
            </h3>
            <p className="text-sm text-blue-700">
              Todas as informações que você preencheu foram salvas automaticamente. Quando você
              tentar novamente, tudo estará lá.
            </p>
          </div>

          {import.meta.env.DEV && (
            <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <summary className="cursor-pointer font-semibold text-gray-900 hover:text-gray-700">
                Detalhes técnicos (desenvolvimento)
              </summary>
              <pre className="mt-3 text-xs bg-white p-3 rounded border overflow-auto max-h-40">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}

          <div className="flex gap-3">
            <Button onClick={resetError} className="flex-1 bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="flex-1"
            >
              Recarregar Página
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Se o problema persistir, tente atualizar a página ou usar outro navegador.
          </p>
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary
      fallback={customFallback}
      onError={handleFormError}
      errorType="form"
    >
      {children}
    </ErrorBoundary>
  );
}

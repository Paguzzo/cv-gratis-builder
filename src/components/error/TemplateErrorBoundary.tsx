import React, { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { FileText, AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface TemplateErrorBoundaryProps {
  children: ReactNode;
  templateName?: string;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Error Boundary Específico para Templates
 *
 * Componente especializado para capturar erros durante renderização de templates.
 * Oferece opções de trocar template ou voltar para edição.
 *
 * @example
 * ```tsx
 * <TemplateErrorBoundary templateName="Modern">
 *   <TemplateModern data={curriculumData} />
 * </TemplateErrorBoundary>
 * ```
 */
export function TemplateErrorBoundary({
  children,
  templateName,
  onError,
}: TemplateErrorBoundaryProps) {
  const handleTemplateError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log customizado para erros de template
    console.group('🎨 Template Error Boundary - Erro no Template');
    console.error('Template:', templateName || 'Unknown');
    console.error('Erro:', error.message);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();

    // Callback customizado se fornecido
    if (onError) {
      onError(error, errorInfo);
    }
  };

  const customFallback = (error: Error, resetError: () => void) => {
    const handleChangeTemplate = () => {
      // Redirecionar para seletor de templates
      window.location.href = '/template-selector';
    };

    const handleBackToEditor = () => {
      // Voltar para página de edição
      window.location.href = '/criar-curriculo';
    };

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg border p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 rounded-full">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Erro ao Renderizar Template
              </h2>
              {templateName && (
                <p className="text-gray-600">
                  Ocorreu um erro ao carregar o template <strong>{templateName}</strong>
                </p>
              )}
            </div>
          </div>

          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>O que aconteceu?</AlertTitle>
            <AlertDescription className="mt-2">
              O template selecionado encontrou um erro durante a renderização. Isso pode acontecer
              por problemas de compatibilidade ou dados inválidos.
            </AlertDescription>
          </Alert>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Não se preocupe!</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Seus dados estão salvos e não foram perdidos</li>
              <li>• Você pode tentar um template diferente</li>
              <li>• Ou voltar para continuar editando seu currículo</li>
            </ul>
          </div>

          {import.meta.env.DEV && (
            <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <summary className="cursor-pointer font-semibold text-gray-900 hover:text-gray-700">
                Detalhes do erro (desenvolvimento)
              </summary>
              <pre className="mt-3 text-xs bg-white p-3 rounded border overflow-auto max-h-40 font-mono">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              onClick={resetError}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>

            <Button
              onClick={handleChangeTemplate}
              variant="outline"
              className="w-full"
            >
              <FileText className="w-4 h-4 mr-2" />
              Outro Template
            </Button>

            <Button
              onClick={handleBackToEditor}
              variant="outline"
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Voltar Editor
            </Button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">Sugestões:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Experimente um template diferente</li>
              <li>• Verifique se todas as informações estão preenchidas corretamente</li>
              <li>• Tente recarregar a página (F5)</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary
      fallback={customFallback}
      onError={handleTemplateError}
      errorType="template"
    >
      {children}
    </ErrorBoundary>
  );
}

import { AlertTriangle, Home, RefreshCw, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  errorType?: 'generic' | 'form' | 'template' | 'page';
}

export function ErrorFallback({ error, resetError, errorType = 'generic' }: ErrorFallbackProps) {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleReportError = () => {
    const subject = encodeURIComponent('Erro no CV Grátis Builder');
    const body = encodeURIComponent(
      `Olá, encontrei um erro na aplicação:\n\n` +
      `Tipo: ${errorType}\n` +
      `Mensagem: ${error.message}\n` +
      `URL: ${window.location.href}\n` +
      `Timestamp: ${new Date().toISOString()}\n\n` +
      `Por favor, ajudem a resolver este problema.`
    );
    window.location.href = `mailto:suporte@cvgratis.com?subject=${subject}&body=${body}`;
  };

  const getErrorTitle = () => {
    switch (errorType) {
      case 'form':
        return 'Erro no Formulário';
      case 'template':
        return 'Erro no Template';
      case 'page':
        return 'Erro na Página';
      default:
        return 'Algo deu errado';
    }
  };

  const getErrorDescription = () => {
    switch (errorType) {
      case 'form':
        return 'Ocorreu um erro ao processar o formulário. Seus dados foram preservados e você pode tentar novamente.';
      case 'template':
        return 'Ocorreu um erro ao renderizar o template do currículo. Seus dados estão seguros.';
      case 'page':
        return 'Ocorreu um erro ao carregar esta página. Você pode tentar novamente ou voltar para o início.';
      default:
        return 'Ocorreu um erro inesperado na aplicação. Seus dados estão seguros.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">{getErrorTitle()}</CardTitle>
              <CardDescription className="mt-1">
                {getErrorDescription()}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Mensagem de erro (desenvolvimento) */}
          {import.meta.env.DEV && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Detalhes do Erro (modo desenvolvimento)</AlertTitle>
              <AlertDescription className="mt-2 font-mono text-xs whitespace-pre-wrap">
                {error.message}
                {error.stack && (
                  <details className="mt-2">
                    <summary className="cursor-pointer hover:underline">Ver stack trace</summary>
                    <pre className="mt-2 text-xs overflow-auto max-h-40">
                      {error.stack}
                    </pre>
                  </details>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Informação sobre dados */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Seus dados estão seguros</h3>
            <p className="text-sm text-blue-700">
              Todas as informações do seu currículo foram salvas automaticamente no navegador.
              Você não perderá nenhum dado ao tentar novamente.
            </p>
          </div>

          {/* Ações */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              onClick={resetError}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>

            <Button
              onClick={handleGoHome}
              variant="outline"
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Página Inicial
            </Button>

            <Button
              onClick={handleReportError}
              variant="outline"
              className="w-full"
            >
              <Mail className="w-4 h-4 mr-2" />
              Reportar Erro
            </Button>
          </div>

          {/* Sugestões de solução */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">O que você pode fazer:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Clique em "Tentar Novamente" para recarregar o componente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Atualize a página (F5) para reiniciar a aplicação</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Tente usar um navegador diferente (Chrome, Firefox, Edge)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Se o problema persistir, clique em "Reportar Erro"</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

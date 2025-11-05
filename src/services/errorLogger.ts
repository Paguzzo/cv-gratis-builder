/**
 * Error Logger Service
 *
 * Serviço responsável por capturar, logar e enviar erros para debugging
 * Em desenvolvimento: logs no console
 * Em produção: pode ser integrado com serviços como Sentry, LogRocket, etc.
 */

interface ErrorLog {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: Date;
  userAgent: string;
  url: string;
  userData?: {
    hasData: boolean;
    step?: string;
  };
}

class ErrorLoggerService {
  private isDevelopment = import.meta.env.DEV;

  /**
   * Loga erro no console (development) ou envia para serviço (production)
   */
  logError(error: Error, errorInfo?: React.ErrorInfo): void {
    const errorLog: ErrorLog = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userData: this.collectUserData(),
    };

    if (this.isDevelopment) {
      this.logToConsole(errorLog);
    } else {
      this.logToService(errorLog);
    }

    // Sempre salvar no localStorage para análise posterior
    this.saveToLocalStorage(errorLog);
  }

  /**
   * Coleta dados do usuário (sem informações sensíveis)
   */
  private collectUserData() {
    try {
      const curriculumData = localStorage.getItem('cvgratis-curriculum');
      return {
        hasData: !!curriculumData,
        step: localStorage.getItem('current-step') || 'unknown',
      };
    } catch {
      return {
        hasData: false,
        step: 'unknown',
      };
    }
  }

  /**
   * Log detalhado no console (desenvolvimento)
   */
  private logToConsole(errorLog: ErrorLog): void {
    console.group('🚨 Error Boundary - Erro Capturado');
    console.error('Message:', errorLog.message);
    console.error('Stack:', errorLog.stack);
    console.error('Component Stack:', errorLog.componentStack);
    console.log('Timestamp:', errorLog.timestamp.toISOString());
    console.log('URL:', errorLog.url);
    console.log('User Data:', errorLog.userData);
    console.groupEnd();
  }

  /**
   * Envia erro para serviço externo (produção)
   * Integração com Sentry, LogRocket, etc.
   */
  private logToService(errorLog: ErrorLog): void {
    // TODO: Integrar com serviço de monitoramento (Sentry, LogRocket, etc.)
    // Exemplo de integração com Sentry:
    // if (window.Sentry) {
    //   window.Sentry.captureException(new Error(errorLog.message), {
    //     extra: {
    //       componentStack: errorLog.componentStack,
    //       userData: errorLog.userData,
    //     },
    //   });
    // }

    // Por enquanto, apenas log no console mesmo em produção
    console.error('[Production Error]', errorLog);

    // Você pode fazer uma chamada para sua API backend:
    // fetch('/api/error-logs', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorLog),
    // }).catch(() => {
    //   // Falhou ao enviar, mas não queremos quebrar mais
    // });
  }

  /**
   * Salva logs de erro no localStorage para análise
   */
  private saveToLocalStorage(errorLog: ErrorLog): void {
    try {
      const MAX_LOGS = 10; // Manter apenas os últimos 10 erros
      const existingLogs = this.getStoredLogs();
      const newLogs = [errorLog, ...existingLogs].slice(0, MAX_LOGS);
      localStorage.setItem('cvgratis-error-logs', JSON.stringify(newLogs));
    } catch {
      // Se falhar ao salvar, não há muito o que fazer
    }
  }

  /**
   * Recupera logs armazenados
   */
  getStoredLogs(): ErrorLog[] {
    try {
      const logs = localStorage.getItem('cvgratis-error-logs');
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  /**
   * Limpa logs armazenados
   */
  clearStoredLogs(): void {
    try {
      localStorage.removeItem('cvgratis-error-logs');
    } catch {
      // Ignorar erro
    }
  }
}

export const errorLogger = new ErrorLoggerService();

# Error Boundaries - CV Grátis Builder

Sistema completo de tratamento de erros para a aplicação CV Grátis Builder.

## Componentes Disponíveis

### 1. ErrorBoundary (Genérico)

Componente base para capturar erros em qualquer parte da aplicação.

**Uso básico:**
```tsx
import { ErrorBoundary } from '@/components/error';

function MinhaPage() {
  return (
    <ErrorBoundary errorType="page">
      <ComponenteQuePodemFalhar />
    </ErrorBoundary>
  );
}
```

**Com fallback customizado:**
```tsx
import { ErrorBoundary } from '@/components/error';

function MinhaPage() {
  return (
    <ErrorBoundary
      fallback={(error, resetError) => (
        <div>
          <h1>Ops! {error.message}</h1>
          <button onClick={resetError}>Tentar novamente</button>
        </div>
      )}
    >
      <ComponenteQuePodemFalhar />
    </ErrorBoundary>
  );
}
```

**Props:**
- `children`: ReactNode - Componentes filhos a serem protegidos
- `fallback?`: (error: Error, resetError: () => void) => ReactNode - UI customizada de erro
- `onError?`: (error: Error, errorInfo: React.ErrorInfo) => void - Callback quando erro ocorrer
- `errorType?`: 'generic' | 'form' | 'template' | 'page' - Tipo do erro para mensagens específicas

---

### 2. FormErrorBoundary

Componente especializado para proteger formulários multi-etapas.

**Uso:**
```tsx
import { FormErrorBoundary } from '@/components/error';

function CreateResume() {
  return (
    <FormErrorBoundary>
      <CurriculumBuilder />
    </FormErrorBoundary>
  );
}
```

**Características:**
- Preserva dados do formulário automaticamente
- Mensagens específicas para erros de formulário
- UI otimizada para contexto de preenchimento de dados
- Logs personalizados para debugging

**Props:**
- `children`: ReactNode - Componentes filhos
- `onError?`: (error: Error, errorInfo: React.ErrorInfo) => void - Callback customizado

---

### 3. TemplateErrorBoundary

Componente especializado para proteger renderização de templates.

**Uso:**
```tsx
import { TemplateErrorBoundary } from '@/components/error';

function TemplatePreview() {
  return (
    <TemplateErrorBoundary templateName="Modern">
      <TemplateRenderer template={modernTemplate} />
    </TemplateErrorBoundary>
  );
}
```

**Características:**
- Mensagens específicas para erros de template
- Opção de trocar template sem perder dados
- UI com sugestões de solução
- Botão para voltar ao editor

**Props:**
- `children`: ReactNode - Componentes filhos
- `templateName?`: string - Nome do template para exibição
- `onError?`: (error: Error, errorInfo: React.ErrorInfo) => void - Callback customizado

---

## Error Logger Service

Serviço centralizado para logging de erros.

**Importação:**
```tsx
import { errorLogger } from '@/services/errorLogger';
```

**Uso manual:**
```tsx
try {
  // código que pode falhar
} catch (error) {
  errorLogger.logError(error as Error);
}
```

**Funcionalidades:**
- Log detalhado no console (desenvolvimento)
- Envio para serviço externo (produção) - configurável
- Salva logs no localStorage para análise
- Coleta dados de contexto (URL, user agent, etc.)

**Métodos:**
- `logError(error: Error, errorInfo?: React.ErrorInfo)`: Loga um erro
- `getStoredLogs()`: Retorna logs salvos no localStorage
- `clearStoredLogs()`: Limpa logs salvos

---

## Implementação na Aplicação

### Nível 1: App.tsx (Global)
```tsx
import { ErrorBoundary } from '@/components/error';

function App() {
  return (
    <ErrorBoundary errorType="page">
      <Router>
        {/* resto da aplicação */}
      </Router>
    </ErrorBoundary>
  );
}
```

### Nível 2: Páginas Principais
```tsx
// CreateResume.tsx
import { FormErrorBoundary } from '@/components/error';

export default function CreateResume() {
  return (
    <FormErrorBoundary>
      <CombinedProvider>
        <CurriculumBuilder />
      </CombinedProvider>
    </FormErrorBoundary>
  );
}
```

```tsx
// PremiumEditor.tsx
import { ErrorBoundary, TemplateErrorBoundary } from '@/components/error';

export default function PremiumEditor() {
  return (
    <ErrorBoundary errorType="page">
      <CombinedProvider>
        {/* conteúdo da página */}
        <TemplateErrorBoundary templateName={selectedTemplate.name}>
          <TemplateRenderer template={selectedTemplate} />
        </TemplateErrorBoundary>
      </CombinedProvider>
    </ErrorBoundary>
  );
}
```

---

## Boas Práticas

### 1. Granularidade
- Use Error Boundaries em múltiplos níveis
- Componentes críticos devem ter seu próprio boundary
- Evite boundaries muito amplos que escondem erros específicos

### 2. Preservação de Dados
- Sempre verifique se dados do usuário foram salvos antes do erro
- Use localStorage para persistência automática
- Ofereça opção de recuperar dados após erro

### 3. Mensagens de Erro
- Em desenvolvimento: mostre stack trace completo
- Em produção: mensagens amigáveis e acionáveis
- Sempre ofereça ações para o usuário (tentar novamente, voltar, etc.)

### 4. Logging
- Em desenvolvimento: console detalhado
- Em produção: integre com Sentry, LogRocket, etc.
- Salve contexto relevante (URL, user agent, dados do usuário)

### 5. Fallback UI
- Use componentes do shadcn/ui para consistência visual
- Ofereça múltiplas opções de recuperação
- Explique o que aconteceu de forma clara

---

## Integração com Serviços Externos

### Sentry (Recomendado para Produção)

1. Instalar Sentry:
```bash
npm install @sentry/react
```

2. Configurar em `errorLogger.ts`:
```typescript
import * as Sentry from "@sentry/react";

private logToService(errorLog: ErrorLog): void {
  Sentry.captureException(new Error(errorLog.message), {
    extra: {
      componentStack: errorLog.componentStack,
      userData: errorLog.userData,
    },
  });
}
```

3. Inicializar Sentry em `main.tsx`:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

---

## Testes

### Testar Error Boundary

Para testar se os Error Boundaries estão funcionando:

```tsx
// Componente de teste que força erro
function BrokenComponent() {
  throw new Error('Erro de teste!');
  return <div>Nunca será renderizado</div>;
}

// Usar em desenvolvimento
<ErrorBoundary>
  <BrokenComponent />
</ErrorBoundary>
```

---

## Troubleshooting

### Erro não está sendo capturado
- Error Boundaries só capturam erros em componentes filhos
- Erros em event handlers precisam de try/catch manual
- Erros assíncronos (Promises) não são capturados

### Fallback não aparece
- Verifique se o componente está dentro do boundary
- Cheque se há outro boundary pai interceptando
- Confirme que o erro está sendo lançado em render

### Dados sendo perdidos
- Verifique implementação de localStorage
- Confirme que contextos estão salvando dados corretamente
- Use `errorLogger.getStoredLogs()` para investigar

---

## Estrutura de Arquivos

```
src/
├── components/
│   └── error/
│       ├── ErrorBoundary.tsx         # Componente base
│       ├── FormErrorBoundary.tsx     # Para formulários
│       ├── TemplateErrorBoundary.tsx # Para templates
│       ├── ErrorFallback.tsx         # UI de fallback padrão
│       ├── index.ts                  # Exports
│       └── README.md                 # Esta documentação
└── services/
    └── errorLogger.ts                # Serviço de logging
```

---

## Changelog

### v1.0.0 (2025-01-10)
- Implementação inicial do sistema de Error Boundaries
- ErrorBoundary genérico
- FormErrorBoundary especializado
- TemplateErrorBoundary especializado
- Error Logger Service
- Integração em App.tsx, CreateResume.tsx, PremiumEditor.tsx

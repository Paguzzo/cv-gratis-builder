# Guia de Integração do Sistema de Validação

## Como Integrar o DataCorruptionAlert

### 1. Adicionar ao App Principal

Para ativar o sistema de detecção de dados corrompidos, adicione o componente `DataCorruptionAlert` no arquivo principal da aplicação:

```typescript
// src/App.tsx
import { DataCorruptionAlert } from '@/components/DataCorruptionAlert';

function App() {
  return (
    <ErrorBoundary errorType="page">
      <LoadingProvider>
        <LoadingSystemCSS />
        <Router>
          <div className="min-h-screen bg-gray-50">
            {/* Adicione aqui - será mostrado em todas as páginas quando necessário */}
            <DataCorruptionAlert />

            <Suspense fallback={<PageLoadingSpinner />}>
              <Routes>
                {/* suas rotas */}
              </Routes>
            </Suspense>

            <Toaster />
            <CookieConsent />
            <FloatingLiveCounter />
          </div>
        </Router>
      </LoadingProvider>
    </ErrorBoundary>
  );
}
```

### 2. Ou Adicionar em Páginas Específicas

Se preferir mostrar apenas em páginas onde o currículo é editado:

```typescript
// src/pages/CreateResume.tsx
import { DataCorruptionAlert } from '@/components/DataCorruptionAlert';

function CreateResume() {
  return (
    <CurriculumProvider>
      <DataCorruptionAlert />

      {/* resto do conteúdo */}
      <CurriculumBuilder />
    </CurriculumProvider>
  );
}
```

## Como o Sistema Funciona

### Fluxo Automático

1. **Ao Carregar a Aplicação**:
   - CurriculumContext carrega dados do localStorage
   - Valida automaticamente usando Zod schemas
   - Se encontrar erros, tenta recuperar campos válidos
   - Sinaliza `dataCorrupted: true` se houver problemas

2. **Durante a Validação**:
   - Dados válidos são mantidos
   - Dados inválidos são removidos ou resetados
   - Arrays inválidos têm apenas itens válidos mantidos
   - Tudo é logado no console para debug

3. **Quando Detecta Corrupção**:
   - DataCorruptionAlert mostra alerta no topo
   - Toast notification aparece
   - Usuário pode expandir para ver detalhes
   - Opções de recuperação são apresentadas

### Opções de Recuperação

O usuário tem 5 opções quando dados corrompidos são detectados:

1. **Restaurar Backup Automático**
   - Restaura o backup mais recente (últimos 3 salvos)
   - Sem perda de dados se backup for recente

2. **Exportar Dados Atuais**
   - Salva estado atual em arquivo JSON
   - Útil para backup manual antes de resetar

3. **Importar Backup**
   - Permite importar arquivo de backup anterior
   - Valida antes de importar

4. **Resetar Dados**
   - Limpa tudo e começa do zero
   - Cria backup antes de resetar

5. **Continuar com Dados Atuais**
   - Fecha o alerta
   - Usa dados recuperados (se houver)

## Validação em Formulários

### Exemplo: Validar ao Submeter

```typescript
import { PersonalInfoStepSchema } from '@/schemas/curriculumSchema';
import { toast } from 'sonner';

function PersonalInfoForm() {
  const { updatePersonalInfo } = useCurriculum();

  const handleSubmit = (data: any) => {
    try {
      // Valida antes de salvar
      const validated = PersonalInfoStepSchema.parse({ personalInfo: data });
      updatePersonalInfo(validated.personalInfo);

      toast.success('Dados salvos com sucesso');
    } catch (error) {
      if (error instanceof ZodError) {
        error.errors.forEach(err => {
          toast.error(`Erro: ${err.message}`, {
            description: `Campo: ${err.path.join('.')}`
          });
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* campos do formulário */}
    </form>
  );
}
```

### Exemplo: Validação em Tempo Real

```typescript
import { PersonalInfoSchema } from '@/schemas/curriculumSchema';

function EmailField() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleChange = (value: string) => {
    setEmail(value);

    try {
      PersonalInfoSchema.pick({ email: true }).parse({ email: value });
      setError('');
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.errors[0].message);
      }
    }
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => handleChange(e.target.value)}
        className={error ? 'border-red-500' : ''}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}
```

## Monitoramento de Estado

### Hook Personalizado para Validação

```typescript
import { useCurriculum } from '@/contexts/CurriculumContext';
import { useEffect } from 'react';

function useDataValidation() {
  const { state } = useCurriculum();

  useEffect(() => {
    if (state.dataCorrupted) {
      console.warn('⚠️ Dados corrompidos detectados');
      console.log('Erros:', state.validationErrors);
      console.log('Campos recuperados:', state.recoveredFields);
    }
  }, [state.dataCorrupted, state.validationErrors, state.recoveredFields]);

  return {
    isCorrupted: state.dataCorrupted,
    errors: state.validationErrors,
    recoveredFields: state.recoveredFields
  };
}
```

### Uso do Hook

```typescript
function MyComponent() {
  const { isCorrupted, errors, recoveredFields } = useDataValidation();

  if (isCorrupted) {
    return (
      <div className="bg-yellow-50 p-4 rounded">
        <p>Alguns dados foram recuperados automaticamente</p>
        <ul>
          {recoveredFields.map(field => (
            <li key={field}>{field}</li>
          ))}
        </ul>
      </div>
    );
  }

  return <div>{/* conteúdo normal */}</div>;
}
```

## Tratamento de Erros por Campo

### Mostrar Erros Específicos

```typescript
function ValidationErrorDisplay() {
  const { state } = useCurriculum();

  const getFieldErrors = (fieldPath: string) => {
    return state.validationErrors.filter(err =>
      err.field.startsWith(fieldPath)
    );
  };

  return (
    <div>
      {/* Erros de informações pessoais */}
      {getFieldErrors('personalInfo').length > 0 && (
        <div className="bg-red-50 p-3 rounded mb-4">
          <h4 className="font-semibold text-red-900">Erros em Informações Pessoais:</h4>
          <ul className="mt-2 space-y-1">
            {getFieldErrors('personalInfo').map((err, i) => (
              <li key={i} className="text-sm text-red-700">
                {err.field.split('.').pop()}: {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Erros de experiência */}
      {getFieldErrors('experience').length > 0 && (
        <div className="bg-red-50 p-3 rounded">
          <h4 className="font-semibold text-red-900">Erros em Experiências:</h4>
          <ul className="mt-2 space-y-1">
            {getFieldErrors('experience').map((err, i) => (
              <li key={i} className="text-sm text-red-700">
                {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

## Testes e Debug

### Simular Dados Corrompidos

Para testar o sistema, você pode simular dados corrompidos:

```typescript
// No console do navegador ou em um componente de teste
function CorruptDataForTesting() {
  const handleCorrupt = () => {
    // Salva dados inválidos no localStorage
    localStorage.setItem('cvgratis-curriculum', JSON.stringify({
      personalInfo: {
        name: 'Teste',
        email: 'email-invalido',  // Email sem @
        phone: 'abc'  // Telefone inválido
      },
      education: [
        {
          id: 'not-uuid',  // ID inválido
          course: '',  // Curso vazio (obrigatório)
          institution: 'Teste',
          startDate: '2020',
          endDate: '2024',
          level: 'invalido'  // Nível inválido
        }
      ],
      experience: 'not-an-array',  // Deveria ser array
      skills: null  // Deveria ser array
    }));

    // Recarrega a página para ver o sistema de validação
    window.location.reload();
  };

  return (
    <button onClick={handleCorrupt} className="bg-red-500 text-white px-4 py-2 rounded">
      Simular Dados Corrompidos
    </button>
  );
}
```

### Ver Logs de Validação

O sistema loga todas as operações no console:

```
✅ Dados do currículo validados com sucesso
⚠️ Erros de validação encontrados: [...]
🔧 Dados parcialmente recuperados: ['personalInfo', 'education (2/3 itens)']
❌ Não foi possível recuperar objective
💾 Backup criado com sucesso: 2024-01-15T10:30:00.000Z
📥 Dados carregados do localStorage
```

## Checklist de Integração

- [ ] Adicionar `DataCorruptionAlert` no App ou páginas específicas
- [ ] Verificar se `CurriculumProvider` está envolvendo os componentes
- [ ] Testar com dados corrompidos simulados
- [ ] Verificar logs no console durante desenvolvimento
- [ ] Testar restauração de backup
- [ ] Testar exportação/importação de dados
- [ ] Verificar comportamento em diferentes cenários de erro
- [ ] Testar em diferentes navegadores (localStorage pode variar)

## Boas Práticas

1. **Sempre envolva com CurriculumProvider**
   ```typescript
   <CurriculumProvider>
     <DataCorruptionAlert />
     <YourComponent />
   </CurriculumProvider>
   ```

2. **Valide antes de operações críticas**
   ```typescript
   const validation = validateCurriculumData(data);
   if (validation.isValid) {
     // prosseguir
   }
   ```

3. **Mantenha usuário informado**
   ```typescript
   if (state.dataCorrupted) {
     // Mostre aviso claro
     // Ofereça opções de recuperação
   }
   ```

4. **Crie backups antes de resetar**
   ```typescript
   createBackup(state.data);
   resetCurriculum();
   ```

5. **Use schemas parciais para validação progressiva**
   ```typescript
   // Valide cada etapa individualmente
   PersonalInfoStepSchema.parse(data);
   EducationStepSchema.parse(data);
   ```

## Suporte e Debug

### Verificar Estado Atual

```typescript
function DebugPanel() {
  const { state, availableBackups } = useCurriculum();

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3>Debug Info</h3>
      <pre>{JSON.stringify({
        dataCorrupted: state.dataCorrupted,
        errorsCount: state.validationErrors.length,
        recoveredFields: state.recoveredFields,
        backupsAvailable: availableBackups.length
      }, null, 2)}</pre>
    </div>
  );
}
```

### Limpar Todo o Estado (Emergência)

```typescript
function ClearAllData() {
  const handleClear = () => {
    if (confirm('Isso vai limpar TODOS os dados. Tem certeza?')) {
      Object.keys(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(STORAGE_KEYS[key]);
      });
      window.location.reload();
    }
  };

  return (
    <button onClick={handleClear} className="bg-red-600 text-white px-4 py-2 rounded">
      Limpar Tudo (Emergência)
    </button>
  );
}
```

# Modern React 18+ & TypeScript 5+ Patterns for CV Builder (2025)

## Executive Summary

This document provides modern React 18+ and TypeScript 5+ patterns specifically designed for your CV/Resume builder application. All patterns are designed to enhance your existing Context + useReducer architecture without breaking changes.

## Current Architecture Analysis

Your application uses:
- ✅ React 18.2.0 with TypeScript 5.5.3
- ✅ Context API + useReducer pattern (solid foundation)
- ✅ Multi-step form with progress tracking
- ✅ Local storage persistence
- ✅ Comprehensive type definitions

## 1. Enhanced TypeScript 5+ Patterns

### 1.1 Modern CurriculumContext with TypeScript 5+ Features

```typescript
// src/contexts/EnhancedCurriculumContext.tsx
import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import { CurriculumData, CurriculumStep } from '@/types/curriculum';
import { safeParseCurriculumData } from '@/utils/safeJsonParse';

// Enhanced state with loading and error handling
interface EnhancedCurriculumState {
  data: CurriculumData;
  currentStep: CurriculumStep;
  isComplete: boolean;
  isLoading: boolean;
  error: string | null;
  isDirty: boolean; // Track unsaved changes
  lastSaved: Date | null;
}

// Enhanced actions with async support
type CurriculumAction =
  | { type: 'UPDATE_PERSONAL_INFO'; payload: Partial<CurriculumData['personalInfo']> }
  | { type: 'UPDATE_OBJECTIVE'; payload: Partial<CurriculumData['objective']> }
  | { type: 'UPDATE_EDUCATION'; payload: CurriculumData['education'] }
  | { type: 'UPDATE_EXPERIENCE'; payload: CurriculumData['experience'] }
  | { type: 'UPDATE_SKILLS'; payload: CurriculumData['skills'] }
  | { type: 'UPDATE_LANGUAGES'; payload: CurriculumData['languages'] }
  | { type: 'UPDATE_COURSES'; payload: CurriculumData['courses'] }
  | { type: 'UPDATE_PROJECTS'; payload: CurriculumData['projects'] }
  | { type: 'UPDATE_ACHIEVEMENTS'; payload: CurriculumData['achievements'] }
  | { type: 'SET_STEP'; payload: CurriculumStep }
  | { type: 'LOAD_FROM_STORAGE'; payload: CurriculumData }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DIRTY'; payload: boolean }
  | { type: 'MARK_SAVED' }
  | { type: 'RESET' };

// Using TypeScript 5+ satisfies operator for better type inference
const INITIAL_DATA = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
  },
  objective: {
    keywords: '',
    description: '',
  },
  education: [],
  experience: [],
  skills: [],
  languages: [],
  courses: [],
  projects: [],
  achievements: [],
} as const satisfies CurriculumData;

const INITIAL_STATE = {
  data: INITIAL_DATA,
  currentStep: 'personal-info' as const,
  isComplete: false,
  isLoading: false,
  error: null,
  isDirty: false,
  lastSaved: null,
} as const satisfies EnhancedCurriculumState;

// Enhanced reducer with better error handling
function enhancedCurriculumReducer(
  state: EnhancedCurriculumState,
  action: CurriculumAction
): EnhancedCurriculumState {
  switch (action.type) {
    case 'UPDATE_PERSONAL_INFO':
      return {
        ...state,
        data: {
          ...state.data,
          personalInfo: { ...state.data.personalInfo, ...action.payload },
        },
        isDirty: true,
        error: null,
      };

    case 'UPDATE_OBJECTIVE':
      return {
        ...state,
        data: {
          ...state.data,
          objective: { ...state.data.objective, ...action.payload },
        },
        isDirty: true,
        error: null,
      };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'SET_DIRTY':
      return { ...state, isDirty: action.payload };

    case 'MARK_SAVED':
      return {
        ...state,
        isDirty: false,
        lastSaved: new Date(),
        error: null
      };

    case 'LOAD_FROM_STORAGE':
      return {
        ...state,
        data: action.payload,
        isDirty: false,
        error: null,
      };

    case 'RESET':
      return INITIAL_STATE;

    default:
      return state;
  }
}

// Enhanced context type with async operations
interface EnhancedCurriculumContextType {
  state: EnhancedCurriculumState;
  dispatch: React.Dispatch<CurriculumAction>;

  // Async operations
  updatePersonalInfoAsync: (data: Partial<CurriculumData['personalInfo']>) => Promise<void>;
  updateObjectiveAsync: (data: Partial<CurriculumData['objective']>) => Promise<void>;

  // Validation helpers
  validateCurrentStep: () => boolean;
  getStepCompletionStatus: () => Record<CurriculumStep, boolean>;

  // Persistence
  saveToStorageAsync: () => Promise<void>;
  loadFromStorageAsync: () => Promise<void>;

  // Navigation helpers
  canProceedToNextStep: () => boolean;
  getNextStep: () => CurriculumStep | null;
  getPreviousStep: () => CurriculumStep | null;
}

const EnhancedCurriculumContext = createContext<EnhancedCurriculumContextType | undefined>(undefined);

export function EnhancedCurriculumProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(enhancedCurriculumReducer, INITIAL_STATE);

  // Async operations with error handling
  const updatePersonalInfoAsync = useCallback(async (data: Partial<CurriculumData['personalInfo']>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // Simulate API delay for demo
      await new Promise(resolve => setTimeout(resolve, 100));
      dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: data });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, []);

  const updateObjectiveAsync = useCallback(async (data: Partial<CurriculumData['objective']>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await new Promise(resolve => setTimeout(resolve, 100));
      dispatch({ type: 'UPDATE_OBJECTIVE', payload: data });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, []);

  // Enhanced persistence with error handling
  const saveToStorageAsync = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      localStorage.setItem('cvgratis-curriculum', JSON.stringify(state.data));
      dispatch({ type: 'MARK_SAVED' });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save data' });
    }
  }, [state.data]);

  const loadFromStorageAsync = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const saved = localStorage.getItem('cvgratis-curriculum');
      if (saved) {
        const data = safeParseCurriculumData(saved);
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: data });
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
    }
  }, []);

  // Validation helpers
  const validateCurrentStep = useCallback(() => {
    switch (state.currentStep) {
      case 'personal-info':
        return !!(state.data.personalInfo.name && state.data.personalInfo.email);
      case 'objective':
        return !!(state.data.objective.description);
      default:
        return true;
    }
  }, [state.currentStep, state.data]);

  const getStepCompletionStatus = useCallback((): Record<CurriculumStep, boolean> => {
    return {
      'personal-info': !!(state.data.personalInfo.name && state.data.personalInfo.email),
      'objective': !!(state.data.objective.description),
      'experience': state.data.experience.length > 0,
      'education': state.data.education.length > 0,
      'skills': state.data.skills.length > 0,
      'languages': state.data.languages.length > 0,
      'courses': true, // Optional step
      'projects-achievements': true, // Optional step
    };
  }, [state.data]);

  // Navigation helpers
  const steps: CurriculumStep[] = [
    'personal-info', 'objective', 'experience', 'education',
    'skills', 'languages', 'courses', 'projects-achievements'
  ];

  const canProceedToNextStep = useCallback(() => {
    return validateCurrentStep();
  }, [validateCurrentStep]);

  const getNextStep = useCallback((): CurriculumStep | null => {
    const currentIndex = steps.indexOf(state.currentStep);
    return currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;
  }, [state.currentStep]);

  const getPreviousStep = useCallback((): CurriculumStep | null => {
    const currentIndex = steps.indexOf(state.currentStep);
    return currentIndex > 0 ? steps[currentIndex - 1] : null;
  }, [state.currentStep]);

  // Auto-save functionality
  useEffect(() => {
    if (state.isDirty) {
      const timer = setTimeout(() => {
        saveToStorageAsync();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timer);
    }
  }, [state.isDirty, saveToStorageAsync]);

  // Load from storage on mount
  useEffect(() => {
    loadFromStorageAsync();
  }, [loadFromStorageAsync]);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo((): EnhancedCurriculumContextType => ({
    state,
    dispatch,
    updatePersonalInfoAsync,
    updateObjectiveAsync,
    validateCurrentStep,
    getStepCompletionStatus,
    saveToStorageAsync,
    loadFromStorageAsync,
    canProceedToNextStep,
    getNextStep,
    getPreviousStep,
  }), [
    state,
    updatePersonalInfoAsync,
    updateObjectiveAsync,
    validateCurrentStep,
    getStepCompletionStatus,
    saveToStorageAsync,
    loadFromStorageAsync,
    canProceedToNextStep,
    getNextStep,
    getPreviousStep,
  ]);

  return (
    <EnhancedCurriculumContext.Provider value={contextValue}>
      {children}
    </EnhancedCurriculumContext.Provider>
  );
}

export function useEnhancedCurriculum() {
  const context = useContext(EnhancedCurriculumContext);
  if (context === undefined) {
    throw new Error('useEnhancedCurriculum must be used within an EnhancedCurriculumProvider');
  }
  return context;
}
```

### 1.2 Enhanced TypeScript Types with Modern Patterns

```typescript
// src/types/enhanced-curriculum.ts
import { CurriculumData, CurriculumStep } from './curriculum';

// Using TypeScript 5+ template literal types for better type safety
export type StepStatus = 'pending' | 'in-progress' | 'completed' | 'error';
export type ValidationErrorType = 'required' | 'invalid-format' | 'min-length' | 'max-length';

// Enhanced validation result with specific error types
export interface ValidationResult {
  isValid: boolean;
  errors: Array<{
    field: keyof CurriculumData | string;
    type: ValidationErrorType;
    message: string;
  }>;
}

// Generic async state pattern
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// Using satisfies for better type inference with const assertions
export const STEP_TITLES = {
  'personal-info': 'Informações Pessoais',
  'objective': 'Objetivo Profissional',
  'experience': 'Experiência Profissional',
  'education': 'Educação',
  'skills': 'Habilidades',
  'languages': 'Idiomas',
  'courses': 'Cursos',
  'projects-achievements': 'Projetos & Conquistas',
} as const satisfies Record<CurriculumStep, string>;

// Utility types for better type safety
export type StepTitles = typeof STEP_TITLES;
export type StepTitle = StepTitles[CurriculumStep];

// Enhanced form field types with validation
export interface FormField<T> {
  value: T;
  error: string | null;
  touched: boolean;
  isValidating: boolean;
}

// Generic form state pattern
export type FormState<T extends Record<string, any>> = {
  [K in keyof T]: FormField<T[K]>;
};

// API response patterns
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

// Event handler types with better type safety
export type AsyncEventHandler<T = void> = (event?: React.SyntheticEvent) => Promise<T>;
export type SyncEventHandler<T = void> = (event?: React.SyntheticEvent) => T;
```

## 2. React 18 Concurrent Features Integration

### 2.1 Enhanced Loading States with Suspense

```typescript
// src/components/enhanced/SuspenseWrapper.tsx
import React, { Suspense, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

// Loading skeleton component
const DefaultLoadingFallback = () => (
  <div className="animate-pulse space-y-4 p-6">
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
  </div>
);

// Error fallback component
const DefaultErrorFallback = ({ error, resetErrorBoundary }: {
  error: Error;
  resetErrorBoundary: () => void;
}) => (
  <div className="p-6 border border-red-200 rounded-lg bg-red-50">
    <h3 className="text-lg font-semibold text-red-800 mb-2">
      Ops! Algo deu errado
    </h3>
    <p className="text-red-600 mb-4">{error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Tentar novamente
    </button>
  </div>
);

export function SuspenseWrapper({
  children,
  fallback = <DefaultLoadingFallback />,
  errorFallback,
  onError
}: SuspenseWrapperProps) {
  return (
    <ErrorBoundary
      FallbackComponent={errorFallback ? () => <>{errorFallback}</> : DefaultErrorFallback}
      onError={onError}
      onReset={() => window.location.reload()}
    >
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
```

### 2.2 Concurrent Safe Data Fetching Hook

```typescript
// src/hooks/useAsyncOperation.ts
import { useState, useCallback, useRef, useEffect } from 'react';

interface AsyncOperationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAsyncOperationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  retryCount?: number;
  retryDelay?: number;
}

export function useAsyncOperation<T>(
  asyncFn: () => Promise<T>,
  options: UseAsyncOperationOptions = {}
) {
  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async () => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await asyncFn();

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setState({ data: result, loading: false, error: null });
      retryCountRef.current = 0;
      options.onSuccess?.(result);
    } catch (error) {
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Retry logic
      if (retryCountRef.current < (options.retryCount || 0)) {
        retryCountRef.current++;
        setTimeout(() => {
          execute();
        }, options.retryDelay || 1000);
        return;
      }

      setState({ data: null, loading: false, error: errorMessage });
      options.onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [asyncFn, options]);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState({ data: null, loading: false, error: null });
    retryCountRef.current = 0;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    execute,
    reset,
    retry: () => {
      retryCountRef.current = 0;
      execute();
    },
  };
}
```

### 2.3 Optimized Form Components with startTransition

```typescript
// src/components/enhanced/OptimizedFormField.tsx
import React, { useState, useTransition, useCallback, useDeferredValue } from 'react';

interface OptimizedFormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  validation?: (value: string) => string | null;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel';
  required?: boolean;
}

export function OptimizedFormField({
  label,
  value,
  onChange,
  onBlur,
  validation,
  placeholder,
  type = 'text',
  required = false,
}: OptimizedFormFieldProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  // Defer validation to avoid blocking urgent updates
  const deferredValue = useDeferredValue(value);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Urgent update - update input immediately
    onChange(newValue);

    // Non-urgent update - validation can be deferred
    if (validation && touched) {
      startTransition(() => {
        const validationError = validation(newValue);
        setError(validationError);
      });
    }
  }, [onChange, validation, touched]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    onBlur?.();

    if (validation) {
      startTransition(() => {
        const validationError = validation(deferredValue);
        setError(validationError);
      });
    }
  }, [onBlur, validation, deferredValue]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${error && touched ? 'border-red-500' : 'border-gray-300'}
            ${isPending ? 'opacity-70' : ''}
          `}
        />

        {isPending && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {error && touched && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
```

## 3. Modern State Management Enhancements

### 3.1 Integration with React Query for Enhanced Data Fetching

```typescript
// src/hooks/useCurriculumQuery.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CurriculumData } from '@/types/curriculum';

// Query keys factory for better organization
export const curriculumKeys = {
  all: ['curriculum'] as const,
  curriculum: (id: string) => [...curriculumKeys.all, id] as const,
  templates: () => [...curriculumKeys.all, 'templates'] as const,
} as const;

// Enhanced curriculum data with server sync
export function useCurriculumQuery(id: string = 'default') {
  return useQuery({
    queryKey: curriculumKeys.curriculum(id),
    queryFn: async (): Promise<CurriculumData> => {
      // Check local storage first
      const localData = localStorage.getItem('cvgratis-curriculum');
      if (localData) {
        return JSON.parse(localData);
      }

      // Fallback to default data
      return {
        personalInfo: { name: '', email: '', phone: '', whatsapp: '', address: '' },
        objective: { keywords: '', description: '' },
        education: [],
        experience: [],
        skills: [],
        languages: [],
        courses: [],
        projects: [],
        achievements: [],
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Mutation for saving curriculum data
export function useSaveCurriculumMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CurriculumData): Promise<void> => {
      // Save to localStorage
      localStorage.setItem('cvgratis-curriculum', JSON.stringify(data));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
    },
    onSuccess: (_, variables) => {
      // Update cache
      queryClient.setQueryData(curriculumKeys.curriculum('default'), variables);
    },
    onError: (error) => {
      console.error('Failed to save curriculum:', error);
    },
  });
}
```

### 3.2 Zustand Integration for Global UI State

```typescript
// src/stores/uiStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UIState {
  // Theme and preferences
  theme: 'light' | 'dark' | 'system';
  language: 'pt-BR' | 'en-US';

  // Form state
  isFormDirty: boolean;
  unsavedChanges: string[];

  // UI state
  sidebarOpen: boolean;
  currentModal: string | null;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: Date;
  }>;

  // Actions
  setTheme: (theme: UIState['theme']) => void;
  setLanguage: (language: UIState['language']) => void;
  setFormDirty: (dirty: boolean) => void;
  addUnsavedChange: (change: string) => void;
  clearUnsavedChanges: () => void;
  toggleSidebar: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  addNotification: (notification: Omit<UIState['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        theme: 'system',
        language: 'pt-BR',
        isFormDirty: false,
        unsavedChanges: [],
        sidebarOpen: false,
        currentModal: null,
        notifications: [],

        // Actions
        setTheme: (theme) => set({ theme }, false, 'setTheme'),

        setLanguage: (language) => set({ language }, false, 'setLanguage'),

        setFormDirty: (isFormDirty) => set({ isFormDirty }, false, 'setFormDirty'),

        addUnsavedChange: (change) => set(
          (state) => ({
            unsavedChanges: [...state.unsavedChanges, change],
            isFormDirty: true,
          }),
          false,
          'addUnsavedChange'
        ),

        clearUnsavedChanges: () => set(
          { unsavedChanges: [], isFormDirty: false },
          false,
          'clearUnsavedChanges'
        ),

        toggleSidebar: () => set(
          (state) => ({ sidebarOpen: !state.sidebarOpen }),
          false,
          'toggleSidebar'
        ),

        openModal: (modalId) => set({ currentModal: modalId }, false, 'openModal'),

        closeModal: () => set({ currentModal: null }, false, 'closeModal'),

        addNotification: (notification) => set(
          (state) => ({
            notifications: [
              ...state.notifications,
              {
                ...notification,
                id: crypto.randomUUID(),
                timestamp: new Date(),
              },
            ],
          }),
          false,
          'addNotification'
        ),

        removeNotification: (id) => set(
          (state) => ({
            notifications: state.notifications.filter(n => n.id !== id),
          }),
          false,
          'removeNotification'
        ),

        clearNotifications: () => set({ notifications: [] }, false, 'clearNotifications'),
      }),
      {
        name: 'cvgratis-ui-state',
        partialize: (state) => ({
          theme: state.theme,
          language: state.language,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    {
      name: 'CVGratis UI Store',
    }
  )
);

// Selectors for optimized re-renders
export const useTheme = () => useUIStore((state) => state.theme);
export const useLanguage = () => useUIStore((state) => state.language);
export const useNotifications = () => useUIStore((state) => state.notifications);
export const useCurrentModal = () => useUIStore((state) => state.currentModal);
```

## 4. Performance Optimization Patterns

### 4.1 Optimized Context Provider with React.memo

```typescript
// src/components/enhanced/OptimizedProviders.tsx
import React, { memo, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EnhancedCurriculumProvider } from '@/contexts/EnhancedCurriculumContext';

// Memoized query client to prevent recreations
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes('4')) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: 1,
    },
  },
});

interface AppProvidersProps {
  children: React.ReactNode;
}

// Memoized providers to prevent unnecessary re-renders
export const AppProviders = memo(({ children }: AppProvidersProps) => {
  const queryClient = useMemo(() => createQueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <EnhancedCurriculumProvider>
        {children}
      </EnhancedCurriculumProvider>
    </QueryClientProvider>
  );
});

AppProviders.displayName = 'AppProviders';
```

### 4.2 Virtual Scrolling for Large Lists

```typescript
// src/components/enhanced/VirtualizedList.tsx
import React, { memo, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  onItemClick?: (item: T, index: number) => void;
}

function VirtualizedListComponent<T>({
  items,
  itemHeight,
  height,
  renderItem,
  keyExtractor,
  onItemClick,
}: VirtualizedListProps<T>) {
  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = items[index];

    return (
      <div
        style={style}
        onClick={() => onItemClick?.(item, index)}
        className="cursor-pointer hover:bg-gray-50"
      >
        {renderItem(item, index)}
      </div>
    );
  }, [items, renderItem, onItemClick]);

  const itemCount = useMemo(() => items.length, [items.length]);

  return (
    <List
      height={height}
      itemCount={itemCount}
      itemSize={itemHeight}
      itemKey={(index) => keyExtractor(items[index], index)}
    >
      {Row}
    </List>
  );
}

export const VirtualizedList = memo(VirtualizedListComponent) as typeof VirtualizedListComponent;
```

## 5. Migration Path and Implementation Strategy

### 5.1 Gradual Migration Strategy

1. **Phase 1: Enhanced Types** (Week 1)
   - Add new TypeScript 5+ patterns alongside existing types
   - Update import statements to use new enhanced types
   - No breaking changes to existing functionality

2. **Phase 2: Enhanced Context** (Week 2)
   - Introduce EnhancedCurriculumProvider alongside existing provider
   - Gradually migrate components to use enhanced hooks
   - Maintain backward compatibility

3. **Phase 3: Performance Optimizations** (Week 3)
   - Add React Query for data fetching
   - Implement Zustand for UI state
   - Add Suspense boundaries and error handling

4. **Phase 4: Modern Components** (Week 4)
   - Replace form components with optimized versions
   - Add virtual scrolling where needed
   - Implement concurrent features

### 5.2 Implementation Example

```typescript
// src/App.tsx - Enhanced version
import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from '@/components/enhanced/OptimizedProviders';
import { SuspenseWrapper } from '@/components/enhanced/SuspenseWrapper';

// Lazy load main components for better performance
const CurriculumBuilder = React.lazy(() => import('@/components/resume-builder/CurriculumBuilder'));

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <SuspenseWrapper
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
          }
        >
          <CurriculumBuilder />
        </SuspenseWrapper>
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;
```

## 6. Testing Strategy

### 6.1 Enhanced Testing with Modern Patterns

```typescript
// src/__tests__/enhanced-curriculum-context.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EnhancedCurriculumProvider, useEnhancedCurriculum } from '@/contexts/EnhancedCurriculumContext';

// Test component
function TestComponent() {
  const { state, updatePersonalInfoAsync, canProceedToNextStep } = useEnhancedCurriculum();

  return (
    <div>
      <div data-testid="current-step">{state.currentStep}</div>
      <div data-testid="can-proceed">{canProceedToNextStep() ? 'yes' : 'no'}</div>
      <button
        onClick={() => updatePersonalInfoAsync({ name: 'John Doe', email: 'john@example.com' })}
        data-testid="update-info"
      >
        Update Info
      </button>
    </div>
  );
}

// Test wrapper
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <EnhancedCurriculumProvider>
        {children}
      </EnhancedCurriculumProvider>
    </QueryClientProvider>
  );
}

describe('EnhancedCurriculumContext', () => {
  test('should update personal info and allow progression', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    // Initially should not be able to proceed
    expect(screen.getByTestId('can-proceed')).toHaveTextContent('no');

    // Update personal info
    await user.click(screen.getByTestId('update-info'));

    // Should now be able to proceed
    await waitFor(() => {
      expect(screen.getByTestId('can-proceed')).toHaveTextContent('yes');
    });
  });
});
```

## 7. Bundle Size Optimization

### 7.1 Recommended Package Updates

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.56.2",
    "zustand": "^4.4.7",
    "react-window": "^1.8.8",
    "react-error-boundary": "^4.0.11"
  },
  "devDependencies": {
    "@types/react-window": "^1.8.5"
  }
}
```

### 7.2 Bundle Analysis Script

```typescript
// scripts/analyze-bundle.ts
import { analyzeMetafile } from 'esbuild';
import fs from 'fs';

async function analyzeBundleSize() {
  try {
    const metafile = fs.readFileSync('dist/metafile.json', 'utf8');
    const analysis = await analyzeMetafile(JSON.parse(metafile));
    console.log(analysis);
  } catch (error) {
    console.error('Bundle analysis failed:', error);
  }
}

analyzeBundleSize();
```

## Conclusion

This comprehensive guide provides modern React 18+ and TypeScript 5+ patterns specifically tailored for your CV/Resume builder application. The patterns maintain compatibility with your existing Context + useReducer architecture while adding:

- Enhanced type safety with TypeScript 5+ features
- Better performance through React 18 concurrent features
- Improved error handling and loading states
- Modern state management options
- Optimized component patterns

All patterns are designed for gradual adoption, allowing you to enhance your application incrementally without breaking existing functionality.
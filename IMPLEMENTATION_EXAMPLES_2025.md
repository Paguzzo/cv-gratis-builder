# Implementation Examples - Modern React & TypeScript Patterns

## Overview

This document provides practical implementation examples showing how to integrate the modern React 18+ and TypeScript 5+ patterns with your existing CV builder components.

## 1. Enhanced PersonalInfo Component

### 1.1 Current Implementation Enhancement

```typescript
// src/components/resume-builder/steps/EnhancedPersonalInfo.tsx
import React, { useTransition, useDeferredValue, useCallback } from 'react';
import { useEnhancedCurriculum } from '@/contexts/EnhancedCurriculumContext';
import { OptimizedFormField } from '@/components/enhanced/OptimizedFormField';
import { useUIStore } from '@/stores/uiStore';

// Enhanced validation with TypeScript 5+ patterns
const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    required: true,
    pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
  },
} as const satisfies Record<string, any>;

export function EnhancedPersonalInfo() {
  const { state, updatePersonalInfoAsync, canProceedToNextStep } = useEnhancedCurriculum();
  const { addNotification } = useUIStore();
  const [isPending, startTransition] = useTransition();

  // Defer expensive validation operations
  const deferredData = useDeferredValue(state.data.personalInfo);

  const validateField = useCallback((field: keyof typeof VALIDATION_RULES, value: string): string | null => {
    const rules = VALIDATION_RULES[field];

    if (rules.required && !value.trim()) {
      return `${field} é obrigatório`;
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `${field} deve ter pelo menos ${rules.minLength} caracteres`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `${field} deve ter no máximo ${rules.maxLength} caracteres`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      if (field === 'email') return 'Email inválido';
      if (field === 'phone') return 'Telefone deve estar no formato (11) 99999-9999';
    }

    return null;
  }, []);

  const handleFieldUpdate = useCallback(async (field: keyof typeof state.data.personalInfo, value: string) => {
    // Optimistic update for immediate UI feedback
    const updates = { [field]: value };

    startTransition(async () => {
      try {
        await updatePersonalInfoAsync(updates);

        // Show success notification for important updates
        if (field === 'email' && value) {
          addNotification({
            type: 'success',
            message: 'Email atualizado com sucesso!',
          });
        }
      } catch (error) {
        addNotification({
          type: 'error',
          message: `Erro ao atualizar ${field}`,
        });
      }
    });
  }, [updatePersonalInfoAsync, addNotification]);

  const formatPhoneNumber = useCallback((value: string): string => {
    const numbers = value.replace(/\D/g, '');

    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Informações Pessoais
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OptimizedFormField
            label="Nome Completo"
            value={state.data.personalInfo.name}
            onChange={(value) => handleFieldUpdate('name', value)}
            validation={(value) => validateField('name', value)}
            placeholder="Digite seu nome completo"
            required
          />

          <OptimizedFormField
            label="Email"
            type="email"
            value={state.data.personalInfo.email}
            onChange={(value) => handleFieldUpdate('email', value)}
            validation={(value) => validateField('email', value)}
            placeholder="seu.email@exemplo.com"
            required
          />

          <OptimizedFormField
            label="Telefone"
            type="tel"
            value={state.data.personalInfo.phone}
            onChange={(value) => {
              const formatted = formatPhoneNumber(value);
              handleFieldUpdate('phone', formatted);
            }}
            validation={(value) => validateField('phone', value)}
            placeholder="(11) 99999-9999"
            required
          />

          <OptimizedFormField
            label="WhatsApp"
            type="tel"
            value={state.data.personalInfo.whatsapp || ''}
            onChange={(value) => {
              const formatted = formatPhoneNumber(value);
              handleFieldUpdate('whatsapp', formatted);
            }}
            placeholder="(11) 99999-9999"
          />

          <div className="md:col-span-2">
            <OptimizedFormField
              label="Endereço"
              value={state.data.personalInfo.address || ''}
              onChange={(value) => handleFieldUpdate('address', value)}
              placeholder="Cidade, Estado"
            />
          </div>
        </div>

        {/* Progress indicator with loading state */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {state.isLoading && (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span className="text-sm">Salvando...</span>
              </div>
            )}

            {state.lastSaved && (
              <span className="text-sm text-gray-500">
                Último salvamento: {state.lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {canProceedToNextStep() ? (
              <div className="flex items-center space-x-2 text-green-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">Pronto para continuar</span>
              </div>
            ) : (
              <span className="text-sm text-gray-500">
                Preencha os campos obrigatórios
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Error boundary for this section */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">{state.error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

## 2. Enhanced Experience Component with Async Operations

```typescript
// src/components/resume-builder/steps/EnhancedExperience.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { useEnhancedCurriculum } from '@/contexts/EnhancedCurriculumContext';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';
import { Experience } from '@/types/curriculum';
import { VirtualizedList } from '@/components/enhanced/VirtualizedList';

// AI service integration for experience descriptions
interface AIExperienceService {
  generateDescription: (keywords: string, position: string, company: string) => Promise<string>;
}

// Mock AI service - replace with your GROK integration
const aiService: AIExperienceService = {
  generateDescription: async (keywords, position, company) => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
    return `Profissional responsável por ${keywords.toLowerCase()} na ${company}, atuando como ${position} com foco em resultados excepcionais.`;
  },
};

interface ExperienceItemProps {
  experience: Experience;
  onEdit: (experience: Experience) => void;
  onDelete: (id: string) => void;
  onGenerateDescription: (experience: Experience) => void;
}

function ExperienceItem({ experience, onEdit, onDelete, onGenerateDescription }: ExperienceItemProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{experience.position}</h3>
          <p className="text-gray-600">{experience.company}</p>
          <p className="text-sm text-gray-500">
            {experience.startDate} - {experience.current ? 'Atual' : experience.endDate}
          </p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onGenerateDescription(experience)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
          >
            AI ✨
          </button>

          <button
            onClick={() => onEdit(experience)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Editar
          </button>

          <button
            onClick={() => onDelete(experience.id)}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
          >
            Remover
          </button>
        </div>
      </div>

      {experience.description && (
        <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
          <p className="text-sm text-gray-700">{experience.description}</p>
        </div>
      )}
    </div>
  );
}

export function EnhancedExperience() {
  const { state, updateExperience } = useEnhancedCurriculum();
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);

  // AI description generation with async operation hook
  const {
    loading: generatingDescription,
    error: generationError,
    execute: generateDescription,
  } = useAsyncOperation(
    async () => {
      if (!editingExperience) return '';

      return await aiService.generateDescription(
        editingExperience.keywords,
        editingExperience.position,
        editingExperience.company
      );
    },
    {
      onSuccess: (description) => {
        if (editingExperience && description) {
          updateExperience(
            state.data.experience.map(exp =>
              exp.id === editingExperience.id
                ? { ...exp, description }
                : exp
            )
          );
          setEditingExperience(null);
        }
      },
      onError: (error) => {
        console.error('Failed to generate description:', error);
      },
      retryCount: 2,
      retryDelay: 1000,
    }
  );

  const handleEdit = useCallback((experience: Experience) => {
    setEditingExperience(experience);
  }, []);

  const handleDelete = useCallback((id: string) => {
    updateExperience(state.data.experience.filter(exp => exp.id !== id));
  }, [state.data.experience, updateExperience]);

  const handleGenerateDescription = useCallback(async (experience: Experience) => {
    setEditingExperience(experience);
    await generateDescription();
  }, [generateDescription]);

  const handleAddNew = useCallback(() => {
    const newExperience: Experience = {
      id: crypto.randomUUID(),
      position: '',
      company: '',
      startDate: '',
      endDate: '',
      current: false,
      keywords: '',
      description: '',
    };

    updateExperience([...state.data.experience, newExperience]);
    setEditingExperience(newExperience);
  }, [state.data.experience, updateExperience]);

  // Memoized list items for performance
  const experienceItems = useMemo(() =>
    state.data.experience.map((exp, index) => (
      <ExperienceItem
        key={exp.id}
        experience={exp}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onGenerateDescription={handleGenerateDescription}
      />
    )),
    [state.data.experience, handleEdit, handleDelete, handleGenerateDescription]
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Experiência Profissional
          </h2>

          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Adicionar Experiência
          </button>
        </div>

        {/* Virtual scrolling for large lists */}
        {state.data.experience.length > 10 ? (
          <VirtualizedList
            items={state.data.experience}
            itemHeight={200}
            height={600}
            renderItem={(experience, index) => (
              <ExperienceItem
                experience={experience}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onGenerateDescription={handleGenerateDescription}
              />
            )}
            keyExtractor={(experience) => experience.id}
          />
        ) : (
          <div className="space-y-4">
            {experienceItems}
          </div>
        )}

        {/* AI Generation Status */}
        {generatingDescription && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <div>
                <p className="text-blue-800 font-medium">Gerando descrição com IA...</p>
                <p className="text-blue-600 text-sm">Isso pode levar alguns segundos</p>
              </div>
            </div>
          </div>
        )}

        {generationError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">Erro ao gerar descrição: {generationError}</p>
          </div>
        )}

        {state.data.experience.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma experiência cadastrada</h3>
            <p className="mt-1 text-sm text-gray-500">Comece adicionando sua primeira experiência profissional.</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

## 3. Enhanced Template Selector with Suspense

```typescript
// src/components/templates/EnhancedTemplateSelector.tsx
import React, { Suspense, memo, useMemo, useState, useTransition } from 'react';
import { useTemplateContext } from '@/contexts/TemplateContext';
import { useUIStore } from '@/stores/uiStore';
import { SuspenseWrapper } from '@/components/enhanced/SuspenseWrapper';

// Lazy load template components for better performance
const ClassicTemplate = React.lazy(() => import('@/components/templates/templates/ClassicTemplate'));
const CreativeTemplate = React.lazy(() => import('@/components/templates/templates/CreativeTemplate'));
const ExecutiveTemplate = React.lazy(() => import('@/components/templates/templates/ExecutiveTemplate'));

// Template metadata with TypeScript 5+ satisfies
const TEMPLATE_CONFIG = {
  classic: {
    name: 'Clássico',
    description: 'Template tradicional e profissional',
    component: ClassicTemplate,
    tags: ['tradicional', 'profissional', 'ATS-friendly'],
    preview: '/previews/classic.jpg',
  },
  creative: {
    name: 'Criativo',
    description: 'Template moderno e diferenciado',
    component: CreativeTemplate,
    tags: ['moderno', 'criativo', 'design'],
    preview: '/previews/creative.jpg',
  },
  executive: {
    name: 'Executivo',
    description: 'Template elegante para cargos executivos',
    component: ExecutiveTemplate,
    tags: ['executivo', 'elegante', 'premium'],
    preview: '/previews/executive.jpg',
  },
} as const satisfies Record<string, {
  name: string;
  description: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  tags: readonly string[];
  preview: string;
}>;

type TemplateId = keyof typeof TEMPLATE_CONFIG;

interface TemplateCardProps {
  templateId: TemplateId;
  isSelected: boolean;
  onSelect: (templateId: TemplateId) => void;
}

const TemplateCard = memo(({ templateId, isSelected, onSelect }: TemplateCardProps) => {
  const template = TEMPLATE_CONFIG[templateId];
  const [isPending, startTransition] = useTransition();

  const handleSelect = () => {
    startTransition(() => {
      onSelect(templateId);
    });
  };

  return (
    <div
      className={`
        relative cursor-pointer rounded-lg border-2 transition-all duration-200
        ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
        ${isPending ? 'opacity-70' : ''}
      `}
      onClick={handleSelect}
    >
      {/* Template Preview */}
      <div className="aspect-[3/4] bg-gray-100 rounded-t-lg overflow-hidden">
        <Suspense fallback={
          <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400">Carregando...</div>
          </div>
        }>
          <img
            src={template.preview}
            alt={`Preview do template ${template.name}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </Suspense>
      </div>

      {/* Template Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{template.description}</p>

        <div className="flex flex-wrap gap-1">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* Loading indicator */}
      {isPending && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg">
          <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  );
});

TemplateCard.displayName = 'TemplateCard';

export function EnhancedTemplateSelector() {
  const { selectedTemplate, setSelectedTemplate } = useTemplateContext();
  const { addNotification } = useUIStore();
  const [filterTag, setFilterTag] = useState<string>('');

  // Memoized filtered templates
  const filteredTemplates = useMemo(() => {
    if (!filterTag) return Object.keys(TEMPLATE_CONFIG) as TemplateId[];

    return (Object.keys(TEMPLATE_CONFIG) as TemplateId[]).filter(templateId =>
      TEMPLATE_CONFIG[templateId].tags.includes(filterTag)
    );
  }, [filterTag]);

  // All available tags for filtering
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    Object.values(TEMPLATE_CONFIG).forEach(template => {
      template.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  const handleTemplateSelect = (templateId: TemplateId) => {
    setSelectedTemplate(templateId);
    addNotification({
      type: 'success',
      message: `Template ${TEMPLATE_CONFIG[templateId].name} selecionado!`,
    });
  };

  return (
    <SuspenseWrapper
      fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      }
    >
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Escolha seu Template
          </h2>

          {/* Filter Tags */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterTag('')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  !filterTag
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>

              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filterTag === tag
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((templateId) => (
              <TemplateCard
                key={templateId}
                templateId={templateId}
                isSelected={selectedTemplate === templateId}
                onSelect={handleTemplateSelect}
              />
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Nenhum template encontrado para o filtro "{filterTag}"
              </p>
            </div>
          )}
        </div>
      </div>
    </SuspenseWrapper>
  );
}
```

## 4. Enhanced App Router with Concurrent Features

```typescript
// src/App-Enhanced.tsx
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';
import { useUIStore } from '@/stores/uiStore';
import { SuspenseWrapper } from '@/components/enhanced/SuspenseWrapper';

// Lazy load pages for optimal performance
const CreateResume = React.lazy(() => import('@/pages/CreateResume'));
const TemplateSelector = React.lazy(() => import('@/pages/TemplateSelector'));
const AdminPanel = React.lazy(() => import('@/pages/AdminPanel'));

// Query client with optimized configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes('404')) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Global error fallback
function GlobalErrorFallback({ error, resetErrorBoundary }: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  const { addNotification } = useUIStore();

  useEffect(() => {
    addNotification({
      type: 'error',
      message: 'Ocorreu um erro inesperado. A página será recarregada.',
    });
  }, [addNotification]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            Ops! Algo deu errado
          </h1>

          <p className="mt-2 text-gray-600">
            Encontramos um erro inesperado. Por favor, tente novamente.
          </p>

          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Detalhes técnicos
            </summary>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
              {error.message}
            </pre>
          </details>

          <div className="mt-6 space-y-3">
            <button
              onClick={resetErrorBoundary}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Tentar Novamente
            </button>

            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Ir para Página Inicial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function AppLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando aplicação...</p>
      </div>
    </div>
  );
}

function EnhancedApp() {
  const { theme } = useUIStore();

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        root.classList.toggle('dark', e.matches);
      };

      root.classList.toggle('dark', mediaQuery.matches);
      mediaQuery.addEventListener('change', handleChange);

      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return (
    <ErrorBoundary
      FallbackComponent={GlobalErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Global error:', error, errorInfo);
      }}
    >
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className={`min-h-screen transition-colors duration-200 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
            <SuspenseWrapper fallback={<AppLoadingFallback />}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Suspense fallback={<AppLoadingFallback />}>
                      <CreateResume />
                    </Suspense>
                  }
                />

                <Route
                  path="/templates"
                  element={
                    <Suspense fallback={<AppLoadingFallback />}>
                      <TemplateSelector />
                    </Suspense>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <Suspense fallback={<AppLoadingFallback />}>
                      <AdminPanel />
                    </Suspense>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </SuspenseWrapper>
          </div>
        </BrowserRouter>

        {/* Development tools */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default EnhancedApp;
```

## 5. Performance Monitoring Hook

```typescript
// src/hooks/usePerformanceMonitoring.ts
import { useEffect, useRef, useCallback } from 'react';
import { useUIStore } from '@/stores/uiStore';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}

export function usePerformanceMonitoring(componentName: string, threshold: number = 16) {
  const { addNotification } = useUIStore();
  const renderStartTime = useRef<number>();
  const metricsRef = useRef<PerformanceMetrics[]>([]);

  const startMeasurement = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  const endMeasurement = useCallback(() => {
    if (renderStartTime.current) {
      const renderTime = performance.now() - renderStartTime.current;

      const metrics: PerformanceMetrics = {
        renderTime,
        componentName,
        timestamp: Date.now(),
      };

      metricsRef.current.push(metrics);

      // Warn about slow renders in development
      if (process.env.NODE_ENV === 'development' && renderTime > threshold) {
        console.warn(
          `Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`
        );

        addNotification({
          type: 'warning',
          message: `Renderização lenta detectada: ${componentName} (${renderTime.toFixed(1)}ms)`,
        });
      }

      // Keep only last 100 measurements
      if (metricsRef.current.length > 100) {
        metricsRef.current = metricsRef.current.slice(-100);
      }
    }
  }, [componentName, threshold, addNotification]);

  // Measure render performance
  useEffect(() => {
    startMeasurement();
    return endMeasurement;
  });

  // Report performance metrics
  const getPerformanceReport = useCallback(() => {
    const metrics = metricsRef.current;
    if (metrics.length === 0) return null;

    const renderTimes = metrics.map(m => m.renderTime);
    const avgRenderTime = renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length;
    const maxRenderTime = Math.max(...renderTimes);
    const minRenderTime = Math.min(...renderTimes);

    return {
      componentName,
      measurementCount: metrics.length,
      avgRenderTime: Number(avgRenderTime.toFixed(2)),
      maxRenderTime: Number(maxRenderTime.toFixed(2)),
      minRenderTime: Number(minRenderTime.toFixed(2)),
      slowRenders: metrics.filter(m => m.renderTime > threshold).length,
    };
  }, [componentName, threshold]);

  return {
    getPerformanceReport,
    clearMetrics: () => {
      metricsRef.current = [];
    },
  };
}
```

## 6. Migration Strategy Implementation

### 6.1 Feature Flag System

```typescript
// src/utils/featureFlags.ts
interface FeatureFlags {
  enhancedContext: boolean;
  asyncOperations: boolean;
  aiIntegration: boolean;
  virtualScrolling: boolean;
  performanceMonitoring: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  enhancedContext: false,
  asyncOperations: false,
  aiIntegration: false,
  virtualScrolling: false,
  performanceMonitoring: process.env.NODE_ENV === 'development',
};

// Load flags from localStorage or environment
export function getFeatureFlags(): FeatureFlags {
  try {
    const stored = localStorage.getItem('cvgratis-feature-flags');
    if (stored) {
      return { ...DEFAULT_FLAGS, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.warn('Failed to load feature flags:', error);
  }

  return DEFAULT_FLAGS;
}

export function setFeatureFlag(flag: keyof FeatureFlags, enabled: boolean) {
  const current = getFeatureFlags();
  const updated = { ...current, [flag]: enabled };
  localStorage.setItem('cvgratis-feature-flags', JSON.stringify(updated));
}

// Hook for using feature flags
import { useState, useEffect } from 'react';

export function useFeatureFlag(flag: keyof FeatureFlags): boolean {
  const [enabled, setEnabled] = useState(() => getFeatureFlags()[flag]);

  useEffect(() => {
    const handleStorageChange = () => {
      setEnabled(getFeatureFlags()[flag]);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [flag]);

  return enabled;
}
```

### 6.2 Gradual Component Migration

```typescript
// src/components/MigrationWrapper.tsx
import React from 'react';
import { useFeatureFlag } from '@/utils/featureFlags';

interface MigrationWrapperProps {
  flag: keyof import('@/utils/featureFlags').FeatureFlags;
  legacyComponent: React.ComponentType<any>;
  enhancedComponent: React.ComponentType<any>;
  props?: any;
}

export function MigrationWrapper({
  flag,
  legacyComponent: LegacyComponent,
  enhancedComponent: EnhancedComponent,
  props = {},
}: MigrationWrapperProps) {
  const useEnhanced = useFeatureFlag(flag);

  return useEnhanced ? (
    <EnhancedComponent {...props} />
  ) : (
    <LegacyComponent {...props} />
  );
}

// Usage example
// <MigrationWrapper
//   flag="enhancedContext"
//   legacyComponent={PersonalInfo}
//   enhancedComponent={EnhancedPersonalInfo}
// />
```

This implementation guide provides practical examples showing how to integrate modern React and TypeScript patterns into your existing CV builder application while maintaining backward compatibility and enabling gradual migration.
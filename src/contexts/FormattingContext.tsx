import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FormattingOptions, TypographyOptions, ColorPalette, DEFAULT_TYPOGRAPHY, COLOR_PALETTES } from '@/types/formatting';

interface FormattingContextType {
  formatting: FormattingOptions;
  updateTypography: (typography: Partial<TypographyOptions>) => void;
  updateColorPalette: (palette: ColorPalette) => void;
  resetFormatting: () => void;
  applyFormatting: () => void;
}

const FormattingContext = createContext<FormattingContextType | undefined>(undefined);

interface FormattingProviderProps {
  children: ReactNode;
  templateId?: string;
}

const DEFAULT_FORMATTING: FormattingOptions = {
  typography: DEFAULT_TYPOGRAPHY,
  colorPalette: COLOR_PALETTES[0] // Cinza claro como padrão
};

export function FormattingProvider({ children, templateId }: FormattingProviderProps) {
  const [formatting, setFormatting] = useState<FormattingOptions>(DEFAULT_FORMATTING);

  // Carregar formatação salva no localStorage
  useEffect(() => {
    if (templateId) {
      const savedFormatting = localStorage.getItem(`formatting_${templateId}`);
      if (savedFormatting) {
        try {
          const parsed = JSON.parse(savedFormatting);
          setFormatting(parsed);
        } catch (error) {
          console.error('Erro ao carregar formatação:', error);
        }
      }
    }
  }, [templateId]);

  // Salvar formatação no localStorage quando mudança
  useEffect(() => {
    if (templateId) {
      localStorage.setItem(`formatting_${templateId}`, JSON.stringify(formatting));
    }
  }, [formatting, templateId]);

  const updateTypography = (typographyUpdate: Partial<TypographyOptions>) => {
    setFormatting(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        ...typographyUpdate
      }
    }));
  };

  const updateColorPalette = (palette: ColorPalette) => {
    setFormatting(prev => ({
      ...prev,
      colorPalette: palette
    }));
  };

  const resetFormatting = () => {
    setFormatting(DEFAULT_FORMATTING);
  };

  const applyFormatting = () => {
    // DESABILITADO: Não aplicar formatação para não interferir com templates normais
    // Formatação personalizada será implementada posteriormente de forma isolada
    return;
  };

  // Aplicar formatação automaticamente quando mudança
  useEffect(() => {
    applyFormatting();
  }, [formatting]);

  const value: FormattingContextType = {
    formatting,
    updateTypography,
    updateColorPalette,
    resetFormatting,
    applyFormatting
  };

  return (
    <FormattingContext.Provider value={value}>
      {children}
    </FormattingContext.Provider>
  );
}

export function useFormatting(): FormattingContextType {
  const context = useContext(FormattingContext);
  if (!context) {
    throw new Error('useFormatting deve ser usado dentro de FormattingProvider');
  }
  return context;
}

// Funções auxiliares
function getFontFamilyCSS(fontFamily: string): string {
  const fontMap = {
    formal: '"Times New Roman", Times, serif',
    elegante: '"Playfair Display", "Times New Roman", serif',
    minimalista: '"Inter", "Helvetica Neue", sans-serif',
    tecnologico: '"JetBrains Mono", "Fira Code", monospace',
    classico: '"Arial", "Helvetica", sans-serif'
  };
  return fontMap[fontFamily as keyof typeof fontMap] || fontMap.classico;
}

function getFontSize(fontSize: string, type: 'base' | 'title' | 'subtitle' | 'small'): string {
  const sizeMap = {
    pequeno: { base: '11px', title: '14px', subtitle: '12px', small: '10px' },
    medio: { base: '14px', title: '18px', subtitle: '16px', small: '12px' },
    grande: { base: '16px', title: '22px', subtitle: '18px', small: '14px' }
  };
  return sizeMap[fontSize as keyof typeof sizeMap]?.[type] || sizeMap.medio[type];
} 
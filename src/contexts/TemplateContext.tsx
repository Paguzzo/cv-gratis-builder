import React, { createContext, useContext, useState, useEffect } from 'react';
import { Template, AVAILABLE_TEMPLATES } from '@/types/templates';

interface TemplateState {
  selectedTemplate: Template;
  availableTemplates: Template[];
  isPremiumUnlocked: boolean;
}

interface TemplateContextType {
  state: TemplateState;
  selectTemplate: (templateId: string) => void;
  unlockPremium: () => void;
  getTemplate: (id: string) => Template | undefined;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export function TemplateProvider({ children }: { children: React.ReactNode }) {
  console.log('[TemplateProvider] Iniciando TemplateProvider');
  console.log('[TemplateProvider] AVAILABLE_TEMPLATES:', AVAILABLE_TEMPLATES);
  
  const [state, setState] = useState<TemplateState>({
    selectedTemplate: AVAILABLE_TEMPLATES[0], // Default para template gratuito
    availableTemplates: AVAILABLE_TEMPLATES,
    isPremiumUnlocked: false,
  });
  
  console.log('[TemplateProvider] Estado inicial:', state);

  // Carregar template salvo do localStorage
  useEffect(() => {
    console.log('[TemplateProvider] useEffect executando');
    const saved = localStorage.getItem('cvgratis-selected-template');
    const premiumStatus = localStorage.getItem('cvgratis-premium-unlocked');
    console.log('[TemplateProvider] Template salvo:', saved);
    console.log('[TemplateProvider] Status premium:', premiumStatus);
    
    if (saved) {
      const template = AVAILABLE_TEMPLATES.find(t => t.id === saved);
      console.log('[TemplateProvider] Template encontrado:', template);
      if (template) {
        setState(prev => ({ 
          ...prev, 
          selectedTemplate: template,
          isPremiumUnlocked: premiumStatus === 'true'
        }));
        console.log('[TemplateProvider] Estado atualizado com template salvo');
      }
    }
  }, []);

  const selectTemplate = (templateId: string) => {
    const template = AVAILABLE_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setState(prev => ({ ...prev, selectedTemplate: template }));
      localStorage.setItem('cvgratis-selected-template', templateId);
    }
  };

  const unlockPremium = () => {
    setState(prev => ({ ...prev, isPremiumUnlocked: true }));
    localStorage.setItem('cvgratis-premium-unlocked', 'true');
  };

  const getTemplate = (id: string) => {
    return AVAILABLE_TEMPLATES.find(t => t.id === id);
  };

  const contextValue: TemplateContextType = {
    state,
    selectTemplate,
    unlockPremium,
    getTemplate,
  };

  return (
    <TemplateContext.Provider value={contextValue}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplate() {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
}
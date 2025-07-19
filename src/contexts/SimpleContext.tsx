import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CurriculumData, CurriculumStep } from '@/types/curriculum';

interface SimpleContextType {
  // Dados do currículo
  curriculumData: CurriculumData | null;
  updateCurriculumData: (data: Partial<CurriculumData>) => void;
  
  // Controle de steps
  currentStep: CurriculumStep;
  setCurrentStep: (step: CurriculumStep) => void;
  
  // Template
  selectedTemplate: string | null;
  setSelectedTemplate: (id: string) => void;
  
  // Utilities
  clearAllData: () => void;
  hasValidData: () => boolean;
}

const defaultCurriculumData: CurriculumData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    photo: '',
    isRoundPhoto: true,
  },
  education: [],
  experience: [],
  skills: {
    technical: [],
    languages: [],
    certifications: [],
  },
  extras: {
    objective: { keywords: '', description: '' },
    projects: [],
    achievements: [],
    courses: [],
  },
};

const SimpleContext = createContext<SimpleContextType | undefined>(undefined);

export function SimpleProvider({ children }: { children: ReactNode }) {
  const [curriculumData, setCurriculumData] = useState<CurriculumData>(defaultCurriculumData);
  const [currentStep, setCurrentStep] = useState<CurriculumStep>('personal-info');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Carregar dados na inicialização
  useEffect(() => {
    console.log('🔧 SimpleContext: Inicializando...');
    
    try {
      // Carregar dados do currículo
      const savedData = localStorage.getItem('cvgratis-curriculum-complete');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        console.log('📋 Dados carregados:', parsed);
        setCurriculumData(parsed.curriculumData || defaultCurriculumData);
        setCurrentStep(parsed.currentStep || 'personal-info');
        setSelectedTemplate(parsed.selectedTemplate || null);
      }
    } catch (error) {
      console.warn('⚠️ Erro ao carregar dados:', error);
    }
  }, []);

  // Salvar automaticamente
  useEffect(() => {
    const dataToSave = {
      curriculumData,
      currentStep,
      selectedTemplate,
      timestamp: Date.now()
    };

    localStorage.setItem('cvgratis-curriculum-complete', JSON.stringify(dataToSave));
    console.log('💾 Dados salvos automaticamente');
  }, [curriculumData, currentStep, selectedTemplate]);

  const updateCurriculumData = (newData: Partial<CurriculumData>) => {
    console.log('🔧 Atualizando dados:', newData);
    setCurriculumData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const clearAllData = () => {
    console.log('🗑️ Limpando todos os dados');
    setCurriculumData(defaultCurriculumData);
    setCurrentStep('personal-info');
    setSelectedTemplate(null);
    localStorage.removeItem('cvgratis-curriculum-complete');
  };

  const hasValidData = (): boolean => {
    return !!(curriculumData?.personalInfo?.name && curriculumData.personalInfo.name.trim().length > 0);
  };

  return (
    <SimpleContext.Provider value={{
      curriculumData,
      updateCurriculumData,
      currentStep,
      setCurrentStep,
      selectedTemplate,
      setSelectedTemplate,
      clearAllData,
      hasValidData
    }}>
      {children}
    </SimpleContext.Provider>
  );
}

export function useSimpleContext() {
  const context = useContext(SimpleContext);
  if (!context) {
    throw new Error('useSimpleContext must be used within a SimpleProvider');
  }
  return context;
} 
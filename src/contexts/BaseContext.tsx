import React, { createContext, useContext, useState } from 'react';
import { CurriculumStep } from '@/types/curriculum';

interface BaseState {
  currentStep: CurriculumStep;
  isComplete: boolean;
}

interface BaseContextType {
  state: BaseState;
  setCurrentStep: (step: CurriculumStep) => void;
  setComplete: (complete: boolean) => void;
}

const BaseContext = createContext<BaseContextType | undefined>(undefined);

export function BaseProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BaseState>({
    currentStep: 'personal-info',
    isComplete: false,
  });

  const setCurrentStep = (step: CurriculumStep) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  const setComplete = (complete: boolean) => {
    setState(prev => ({ ...prev, isComplete: complete }));
  };

  const contextValue: BaseContextType = {
    state,
    setCurrentStep,
    setComplete,
  };

  return (
    <BaseContext.Provider value={contextValue}>
      {children}
    </BaseContext.Provider>
  );
}

export function useBase() {
  const context = useContext(BaseContext);
  if (context === undefined) {
    throw new Error('useBase must be used within a BaseProvider');
  }
  return context;
} 
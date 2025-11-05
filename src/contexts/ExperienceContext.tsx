import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Experience } from '@/types/curriculum';
import { safeParseCurriculumData } from '@/utils/safeJsonParse';

interface ExperienceState {
  data: Experience[];
}

type ExperienceAction = 
  | { type: 'SET'; payload: Experience[] }
  | { type: 'ADD'; payload: Experience }
  | { type: 'UPDATE'; payload: { id: string; data: Partial<Experience> } }
  | { type: 'REMOVE'; payload: string }
  | { type: 'LOAD'; payload: Experience[] }
  | { type: 'RESET' };

const initialState: ExperienceState = {
  data: [],
};

function experienceReducer(state: ExperienceState, action: ExperienceAction): ExperienceState {
  switch (action.type) {
    case 'SET':
      return {
        ...state,
        data: action.payload,
      };
    case 'ADD':
      return {
        ...state,
        data: [...state.data, action.payload],
      };
    case 'UPDATE':
      return {
        ...state,
        data: state.data.map(item => 
          item.id === action.payload.id 
            ? { ...item, ...action.payload.data }
            : item
        ),
      };
    case 'REMOVE':
      return {
        ...state,
        data: state.data.filter(item => item.id !== action.payload),
      };
    case 'LOAD':
      return {
        ...state,
        data: action.payload,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface ExperienceContextType {
  state: ExperienceState;
  dispatch: React.Dispatch<ExperienceAction>;
  setExperience: (data: Experience[]) => void;
  addExperience: (data: Experience) => void;
  updateExperience: (id: string, data: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  loadExperience: (data: Experience[]) => void;
  resetExperience: () => void;
}

const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined);

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(experienceReducer, initialState);

  // Auto-save to localStorage
  useEffect(() => {
    const saved = safeParseCurriculumData(localStorage.getItem('cvgratis-curriculum'));
    if (saved.experience) {
      dispatch({ type: 'LOAD', payload: saved.experience });
    }
  }, []);

  useEffect(() => {
    const saved = safeParseCurriculumData(localStorage.getItem('cvgratis-curriculum'));
    
    // Só salvar se realmente mudou
    const currentSaved = JSON.stringify(saved.experience || []);
    const newData = JSON.stringify(state.data);
    
    if (currentSaved !== newData) {
      const updated = { ...saved, experience: state.data };
      localStorage.setItem('cvgratis-curriculum', JSON.stringify(updated));
    }
  }, [state.data]);

  const contextValue: ExperienceContextType = {
    state,
    dispatch,
    setExperience: (data) => dispatch({ type: 'SET', payload: data }),
    addExperience: (data) => dispatch({ type: 'ADD', payload: data }),
    updateExperience: (id, data) => dispatch({ type: 'UPDATE', payload: { id, data } }),
    removeExperience: (id) => dispatch({ type: 'REMOVE', payload: id }),
    loadExperience: (data) => dispatch({ type: 'LOAD', payload: data }),
    resetExperience: () => dispatch({ type: 'RESET' }),
  };

  return (
    <ExperienceContext.Provider value={contextValue}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const context = useContext(ExperienceContext);
  if (context === undefined) {
    throw new Error('useExperience must be used within a ExperienceProvider');
  }
  return context;
}
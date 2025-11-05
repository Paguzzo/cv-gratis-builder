import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Education } from '@/types/curriculum';
import { safeParseCurriculumData } from '@/utils/safeJsonParse';

interface EducationState {
  data: Education[];
}

type EducationAction = 
  | { type: 'SET'; payload: Education[] }
  | { type: 'ADD'; payload: Education }
  | { type: 'UPDATE'; payload: { id: string; data: Partial<Education> } }
  | { type: 'REMOVE'; payload: string }
  | { type: 'LOAD'; payload: Education[] }
  | { type: 'RESET' };

const initialState: EducationState = {
  data: [],
};

function educationReducer(state: EducationState, action: EducationAction): EducationState {
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

interface EducationContextType {
  state: EducationState;
  dispatch: React.Dispatch<EducationAction>;
  setEducation: (data: Education[]) => void;
  addEducation: (data: Education) => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  loadEducation: (data: Education[]) => void;
  resetEducation: () => void;
}

const EducationContext = createContext<EducationContextType | undefined>(undefined);

export function EducationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(educationReducer, initialState);

  // Auto-save to localStorage
  useEffect(() => {
    const saved = safeParseCurriculumData(localStorage.getItem('cvgratis-curriculum'));
    if (saved.education) {
      dispatch({ type: 'LOAD', payload: saved.education });
    }
  }, []);

  useEffect(() => {
    const saved = safeParseCurriculumData(localStorage.getItem('cvgratis-curriculum'));
    
    // Só salvar se realmente mudou
    const currentSaved = JSON.stringify(saved.education || []);
    const newData = JSON.stringify(state.data);
    
    if (currentSaved !== newData) {
      const updated = { ...saved, education: state.data };
      localStorage.setItem('cvgratis-curriculum', JSON.stringify(updated));
    }
  }, [state.data]);

  const contextValue: EducationContextType = {
    state,
    dispatch,
    setEducation: (data) => dispatch({ type: 'SET', payload: data }),
    addEducation: (data) => dispatch({ type: 'ADD', payload: data }),
    updateEducation: (id, data) => dispatch({ type: 'UPDATE', payload: { id, data } }),
    removeEducation: (id) => dispatch({ type: 'REMOVE', payload: id }),
    loadEducation: (data) => dispatch({ type: 'LOAD', payload: data }),
    resetEducation: () => dispatch({ type: 'RESET' }),
  };

  return (
    <EducationContext.Provider value={contextValue}>
      {children}
    </EducationContext.Provider>
  );
}

export function useEducation() {
  const context = useContext(EducationContext);
  if (context === undefined) {
    throw new Error('useEducation must be used within a EducationProvider');
  }
  return context;
}
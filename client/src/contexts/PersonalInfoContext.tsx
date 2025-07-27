import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { PersonalInfo } from '@/types/curriculum';

interface PersonalInfoState {
  data: PersonalInfo;
}

type PersonalInfoAction = 
  | { type: 'UPDATE'; payload: Partial<PersonalInfo> }
  | { type: 'LOAD'; payload: PersonalInfo }
  | { type: 'RESET' };

const initialData: PersonalInfo = {
  name: '',
  email: '',
  phone: '',
  whatsapp: '',
  address: '',
  photo: '',
  isRoundPhoto: true,
};

const initialState: PersonalInfoState = {
  data: initialData,
};

function personalInfoReducer(state: PersonalInfoState, action: PersonalInfoAction): PersonalInfoState {
  switch (action.type) {
    case 'UPDATE':
      return {
        ...state,
        data: { ...state.data, ...action.payload },
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

interface PersonalInfoContextType {
  state: PersonalInfoState;
  dispatch: React.Dispatch<PersonalInfoAction>;
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void;
  loadPersonalInfo: (data: PersonalInfo) => void;
  resetPersonalInfo: () => void;
}

const PersonalInfoContext = createContext<PersonalInfoContextType | undefined>(undefined);

export function PersonalInfoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(personalInfoReducer, initialState);

  // Auto-save to localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cvgratis-curriculum') || '{}');
    if (saved.personalInfo) {
      dispatch({ type: 'LOAD', payload: saved.personalInfo });
    }
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cvgratis-curriculum') || '{}');
    const updated = { ...saved, personalInfo: state.data };
    localStorage.setItem('cvgratis-curriculum', JSON.stringify(updated));
  }, [state.data]);

  const contextValue: PersonalInfoContextType = {
    state,
    dispatch,
    updatePersonalInfo: (data) => dispatch({ type: 'UPDATE', payload: data }),
    loadPersonalInfo: (data) => dispatch({ type: 'LOAD', payload: data }),
    resetPersonalInfo: () => dispatch({ type: 'RESET' }),
  };

  return (
    <PersonalInfoContext.Provider value={contextValue}>
      {children}
    </PersonalInfoContext.Provider>
  );
}

export function usePersonalInfo() {
  const context = useContext(PersonalInfoContext);
  if (context === undefined) {
    throw new Error('usePersonalInfo must be used within a PersonalInfoProvider');
  }
  return context;
} 
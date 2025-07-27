import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CurriculumData, CurriculumStep } from '@/types/curriculum';

interface CurriculumState {
  data: CurriculumData;
  currentStep: CurriculumStep;
  isComplete: boolean;
}

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
  | { type: 'RESET' };

const initialData: CurriculumData = {
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
};

const initialState: CurriculumState = {
  data: initialData,
  currentStep: 'personal-info',
  isComplete: false,
};

function curriculumReducer(state: CurriculumState, action: CurriculumAction): CurriculumState {
  switch (action.type) {
    case 'UPDATE_PERSONAL_INFO':
      return {
        ...state,
        data: {
          ...state.data,
          personalInfo: { ...state.data.personalInfo, ...action.payload },
        },
      };
    case 'UPDATE_OBJECTIVE':
      return {
        ...state,
        data: {
          ...state.data,
          objective: { ...state.data.objective, ...action.payload },
        },
      };
    case 'UPDATE_EDUCATION':
      return {
        ...state,
        data: { ...state.data, education: action.payload },
      };
    case 'UPDATE_EXPERIENCE':
      return {
        ...state,
        data: { ...state.data, experience: action.payload },
      };
    case 'UPDATE_SKILLS':
      return {
        ...state,
        data: { ...state.data, skills: action.payload },
      };
    case 'UPDATE_LANGUAGES':
      return {
        ...state,
        data: { ...state.data, languages: action.payload },
      };
    case 'UPDATE_COURSES':
      return {
        ...state,
        data: { ...state.data, courses: action.payload },
      };
    case 'UPDATE_PROJECTS':
      return {
        ...state,
        data: { ...state.data, projects: action.payload },
      };
    case 'UPDATE_ACHIEVEMENTS':
      return {
        ...state,
        data: { ...state.data, achievements: action.payload },
      };
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload,
      };
    case 'LOAD_FROM_STORAGE':
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

interface CurriculumContextType {
  state: CurriculumState;
  dispatch: React.Dispatch<CurriculumAction>;
  updatePersonalInfo: (data: Partial<CurriculumData['personalInfo']>) => void;
  updateObjective: (data: Partial<CurriculumData['objective']>) => void;
  updateEducation: (data: CurriculumData['education']) => void;
  updateExperience: (data: CurriculumData['experience']) => void;
  updateSkills: (data: CurriculumData['skills']) => void;
  updateLanguages: (data: CurriculumData['languages']) => void;
  updateCourses: (data: CurriculumData['courses']) => void;
  updateProjects: (data: CurriculumData['projects']) => void;
  updateAchievements: (data: CurriculumData['achievements']) => void;
  setCurrentStep: (step: CurriculumStep) => void;
  saveToStorage: () => void;
  loadFromStorage: () => void;
  resetCurriculum: () => void;
}

const CurriculumContext = createContext<CurriculumContextType | undefined>(undefined);

export function CurriculumProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(curriculumReducer, initialState);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('cvgratis-curriculum', JSON.stringify(state.data));
  }, [state.data]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cvgratis-curriculum');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: data });
      } catch (error) {
        console.error('Error loading curriculum from storage:', error);
      }
    }
  }, []);

  const contextValue: CurriculumContextType = {
    state,
    dispatch,
    updatePersonalInfo: (data) => dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: data }),
    updateObjective: (data) => dispatch({ type: 'UPDATE_OBJECTIVE', payload: data }),
    updateEducation: (data) => dispatch({ type: 'UPDATE_EDUCATION', payload: data }),
    updateExperience: (data) => dispatch({ type: 'UPDATE_EXPERIENCE', payload: data }),
    updateSkills: (data) => dispatch({ type: 'UPDATE_SKILLS', payload: data }),
    updateLanguages: (data) => dispatch({ type: 'UPDATE_LANGUAGES', payload: data }),
    updateCourses: (data) => dispatch({ type: 'UPDATE_COURSES', payload: data }),
    updateProjects: (data) => dispatch({ type: 'UPDATE_PROJECTS', payload: data }),
    updateAchievements: (data) => dispatch({ type: 'UPDATE_ACHIEVEMENTS', payload: data }),
    setCurrentStep: (step) => dispatch({ type: 'SET_STEP', payload: step }),
    saveToStorage: () => {
      localStorage.setItem('cvgratis-curriculum', JSON.stringify(state.data));
    },
    loadFromStorage: () => {
      const saved = localStorage.getItem('cvgratis-curriculum');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          dispatch({ type: 'LOAD_FROM_STORAGE', payload: data });
        } catch (error) {
          console.error('Error loading curriculum from storage:', error);
        }
      }
    },
    resetCurriculum: () => dispatch({ type: 'RESET' }),
  };

  return (
    <CurriculumContext.Provider value={contextValue}>
      {children}
    </CurriculumContext.Provider>
  );
}

export function useCurriculum() {
  const context = useContext(CurriculumContext);
  if (context === undefined) {
    throw new Error('useCurriculum must be used within a CurriculumProvider');
  }
  return context;
}
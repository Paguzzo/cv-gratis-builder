import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Skill, Language, ProfessionalObjective } from '@/types/curriculum';
import { safeParseCurriculumData } from '@/utils/safeJsonParse';

interface SkillsState {
  skills: Skill[];
  languages: Language[];
  objective: ProfessionalObjective;
}

type SkillsAction = 
  | { type: 'SET_SKILLS'; payload: Skill[] }
  | { type: 'ADD_SKILL'; payload: Skill }
  | { type: 'REMOVE_SKILL'; payload: string }
  | { type: 'SET_LANGUAGES'; payload: Language[] }
  | { type: 'ADD_LANGUAGE'; payload: Language }
  | { type: 'REMOVE_LANGUAGE'; payload: string }
  | { type: 'UPDATE_OBJECTIVE'; payload: Partial<ProfessionalObjective> }
  | { type: 'LOAD'; payload: Partial<SkillsState> }
  | { type: 'RESET' };

const initialState: SkillsState = {
  skills: [],
  languages: [],
  objective: {
    keywords: '',
    description: '',
  },
};

function skillsReducer(state: SkillsState, action: SkillsAction): SkillsState {
  switch (action.type) {
    case 'SET_SKILLS':
      return {
        ...state,
        skills: action.payload,
      };
    case 'ADD_SKILL':
      return {
        ...state,
        skills: [...state.skills, action.payload],
      };
    case 'REMOVE_SKILL':
      return {
        ...state,
        skills: state.skills.filter(skill => skill.id !== action.payload),
      };
    case 'SET_LANGUAGES':
      return {
        ...state,
        languages: action.payload,
      };
    case 'ADD_LANGUAGE':
      return {
        ...state,
        languages: [...state.languages, action.payload],
      };
    case 'REMOVE_LANGUAGE':
      return {
        ...state,
        languages: state.languages.filter(lang => lang.id !== action.payload),
      };
    case 'UPDATE_OBJECTIVE':
      return {
        ...state,
        objective: { ...state.objective, ...action.payload },
      };
    case 'LOAD':
      return {
        ...state,
        ...action.payload,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface SkillsContextType {
  state: SkillsState;
  dispatch: React.Dispatch<SkillsAction>;
  setSkills: (data: Skill[]) => void;
  addSkill: (data: Skill) => void;
  removeSkill: (id: string) => void;
  setLanguages: (data: Language[]) => void;
  addLanguage: (data: Language) => void;
  removeLanguage: (id: string) => void;
  updateObjective: (data: Partial<ProfessionalObjective>) => void;
  loadSkills: (data: Partial<SkillsState>) => void;
  resetSkills: () => void;
}

const SkillsContext = createContext<SkillsContextType | undefined>(undefined);

export function SkillsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(skillsReducer, initialState);

  // Auto-save to localStorage
  useEffect(() => {
    const saved = safeParseCurriculumData(localStorage.getItem('cvgratis-curriculum'));
    const loadData: Partial<SkillsState> = {};
    
    if (saved.skills) loadData.skills = saved.skills;
    if (saved.languages) loadData.languages = saved.languages;
    if (saved.objective) loadData.objective = saved.objective;
    
    if (Object.keys(loadData).length > 0) {
      dispatch({ type: 'LOAD', payload: loadData });
    }
  }, []);

  useEffect(() => {
    const saved = safeParseCurriculumData(localStorage.getItem('cvgratis-curriculum'));
    
    // Só salvar se realmente mudou
    const currentSaved = JSON.stringify({
      skills: saved.skills || [],
      languages: saved.languages || [],
      objective: saved.objective || {}
    });
    const newData = JSON.stringify({
      skills: state.skills,
      languages: state.languages,
      objective: state.objective
    });
    
    if (currentSaved !== newData) {
      const updated = { 
        ...saved, 
        skills: state.skills,
        languages: state.languages,
        objective: state.objective
      };
      localStorage.setItem('cvgratis-curriculum', JSON.stringify(updated));
    }
  }, [state.skills, state.languages, state.objective]);

  const contextValue: SkillsContextType = {
    state,
    dispatch,
    setSkills: (data) => dispatch({ type: 'SET_SKILLS', payload: data }),
    addSkill: (data) => dispatch({ type: 'ADD_SKILL', payload: data }),
    removeSkill: (id) => dispatch({ type: 'REMOVE_SKILL', payload: id }),
    setLanguages: (data) => dispatch({ type: 'SET_LANGUAGES', payload: data }),
    addLanguage: (data) => dispatch({ type: 'ADD_LANGUAGE', payload: data }),
    removeLanguage: (id) => dispatch({ type: 'REMOVE_LANGUAGE', payload: id }),
    updateObjective: (data) => dispatch({ type: 'UPDATE_OBJECTIVE', payload: data }),
    loadSkills: (data) => dispatch({ type: 'LOAD', payload: data }),
    resetSkills: () => dispatch({ type: 'RESET' }),
  };

  return (
    <SkillsContext.Provider value={contextValue}>
      {children}
    </SkillsContext.Provider>
  );
}

export function useSkills() {
  const context = useContext(SkillsContext);
  if (context === undefined) {
    throw new Error('useSkills must be used within a SkillsProvider');
  }
  return context;
}
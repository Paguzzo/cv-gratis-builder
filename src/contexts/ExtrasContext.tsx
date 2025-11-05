import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Course, Project, Achievement } from '@/types/curriculum';
import { safeParseCurriculumData } from '@/utils/safeJsonParse';

interface ExtrasState {
  courses: Course[];
  projects: Project[];
  achievements: Achievement[];
}

type ExtrasAction = 
  | { type: 'SET_COURSES'; payload: Course[] }
  | { type: 'ADD_COURSE'; payload: Course }
  | { type: 'REMOVE_COURSE'; payload: string }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'REMOVE_PROJECT'; payload: string }
  | { type: 'SET_ACHIEVEMENTS'; payload: Achievement[] }
  | { type: 'ADD_ACHIEVEMENT'; payload: Achievement }
  | { type: 'REMOVE_ACHIEVEMENT'; payload: string }
  | { type: 'LOAD'; payload: Partial<ExtrasState> }
  | { type: 'RESET' };

const initialState: ExtrasState = {
  courses: [],
  projects: [],
  achievements: [],
};

function extrasReducer(state: ExtrasState, action: ExtrasAction): ExtrasState {
  switch (action.type) {
    case 'SET_COURSES':
      return {
        ...state,
        courses: action.payload,
      };
    case 'ADD_COURSE':
      return {
        ...state,
        courses: [...state.courses, action.payload],
      };
    case 'REMOVE_COURSE':
      return {
        ...state,
        courses: state.courses.filter(course => course.id !== action.payload),
      };
    case 'SET_PROJECTS':
      return {
        ...state,
        projects: action.payload,
      };
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };
    case 'REMOVE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload),
      };
    case 'SET_ACHIEVEMENTS':
      return {
        ...state,
        achievements: action.payload,
      };
    case 'ADD_ACHIEVEMENT':
      return {
        ...state,
        achievements: [...state.achievements, action.payload],
      };
    case 'REMOVE_ACHIEVEMENT':
      return {
        ...state,
        achievements: state.achievements.filter(achievement => achievement.id !== action.payload),
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

interface ExtrasContextType {
  state: ExtrasState;
  dispatch: React.Dispatch<ExtrasAction>;
  setCourses: (data: Course[]) => void;
  addCourse: (data: Course) => void;
  removeCourse: (id: string) => void;
  setProjects: (data: Project[]) => void;
  addProject: (data: Project) => void;
  removeProject: (id: string) => void;
  setAchievements: (data: Achievement[]) => void;
  addAchievement: (data: Achievement) => void;
  removeAchievement: (id: string) => void;
  loadExtras: (data: Partial<ExtrasState>) => void;
  resetExtras: () => void;
}

const ExtrasContext = createContext<ExtrasContextType | undefined>(undefined);

export function ExtrasProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(extrasReducer, initialState);

  // Auto-save to localStorage
  useEffect(() => {
    const saved = safeParseCurriculumData(localStorage.getItem('cvgratis-curriculum'));
    const loadData: Partial<ExtrasState> = {};
    
    if (saved.courses) loadData.courses = saved.courses;
    if (saved.projects) loadData.projects = saved.projects;
    if (saved.achievements) loadData.achievements = saved.achievements;
    
    if (Object.keys(loadData).length > 0) {
      dispatch({ type: 'LOAD', payload: loadData });
    }
  }, []);

  useEffect(() => {
    // Evitar salvar se os dados estão vazios (estado inicial)
    if (state.courses.length === 0 && state.projects.length === 0 && state.achievements.length === 0) {
      return;
    }

    const saved = safeParseCurriculumData(localStorage.getItem('cvgratis-curriculum'));
    const updated = { 
      ...saved, 
      courses: state.courses,
      projects: state.projects,
      achievements: state.achievements
    };
    
    // Só salvar se realmente mudou
    const currentSaved = JSON.stringify({
      courses: saved.courses || [],
      projects: saved.projects || [],
      achievements: saved.achievements || []
    });
    const newData = JSON.stringify({
      courses: state.courses,
      projects: state.projects,
      achievements: state.achievements
    });
    
    if (currentSaved !== newData) {
      localStorage.setItem('cvgratis-curriculum', JSON.stringify(updated));
    }
  }, [state.courses, state.projects, state.achievements]);

  const contextValue: ExtrasContextType = {
    state,
    dispatch,
    setCourses: (data) => dispatch({ type: 'SET_COURSES', payload: data }),
    addCourse: (data) => dispatch({ type: 'ADD_COURSE', payload: data }),
    removeCourse: (id) => dispatch({ type: 'REMOVE_COURSE', payload: id }),
    setProjects: (data) => dispatch({ type: 'SET_PROJECTS', payload: data }),
    addProject: (data) => dispatch({ type: 'ADD_PROJECT', payload: data }),
    removeProject: (id) => dispatch({ type: 'REMOVE_PROJECT', payload: id }),
    setAchievements: (data) => dispatch({ type: 'SET_ACHIEVEMENTS', payload: data }),
    addAchievement: (data) => dispatch({ type: 'ADD_ACHIEVEMENT', payload: data }),
    removeAchievement: (id) => dispatch({ type: 'REMOVE_ACHIEVEMENT', payload: id }),
    loadExtras: (data) => dispatch({ type: 'LOAD', payload: data }),
    resetExtras: () => dispatch({ type: 'RESET' }),
  };

  return (
    <ExtrasContext.Provider value={contextValue}>
      {children}
    </ExtrasContext.Provider>
  );
}

export function useExtras() {
  const context = useContext(ExtrasContext);
  if (context === undefined) {
    throw new Error('useExtras must be used within a ExtrasProvider');
  }
  return context;
}
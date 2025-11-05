import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { CurriculumData, CurriculumStep } from '@/types/curriculum';
import {
  validateCurriculumData,
  sanitizeStorageData,
  createBackup,
  STORAGE_KEYS,
  getDefaultCurriculumData,
  ValidationResult,
  restoreLatestBackup,
  listBackups
} from '@/utils/dataIntegrity';

interface CurriculumState {
  data: CurriculumData;
  currentStep: CurriculumStep;
  isComplete: boolean;
  validationErrors: ValidationResult['errors'];
  dataCorrupted: boolean;
  recoveredFields: string[];
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
  | { type: 'LOAD_FROM_STORAGE'; payload: { data: CurriculumData; validation: ValidationResult } }
  | { type: 'RESET' }
  | { type: 'CLEAR_CORRUPTION_WARNING' };

const initialState: CurriculumState = {
  data: getDefaultCurriculumData(),
  currentStep: 'personal-info',
  isComplete: false,
  validationErrors: [],
  dataCorrupted: false,
  recoveredFields: [],
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
        data: action.payload.data,
        validationErrors: action.payload.validation.errors,
        dataCorrupted: !action.payload.validation.isValid,
        recoveredFields: action.payload.validation.recoveredFields,
      };
    case 'CLEAR_CORRUPTION_WARNING':
      return {
        ...state,
        dataCorrupted: false,
        validationErrors: [],
        recoveredFields: [],
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
  clearCorruptionWarning: () => void;
  restoreFromBackup: () => boolean;
  exportData: () => string;
  importData: (jsonString: string) => boolean;
  availableBackups: Array<{ timestamp: string; }>;
}

const CurriculumContext = createContext<CurriculumContextType | undefined>(undefined);

export function CurriculumProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(curriculumReducer, initialState);
  const [availableBackups, setAvailableBackups] = useState<Array<{ timestamp: string }>>([]);

  // Save to localStorage whenever data changes with validation and backup
  useEffect(() => {
    try {
      // Valida os dados antes de salvar
      const validation = validateCurriculumData(state.data);

      if (validation.isValid && validation.data) {
        // Cria backup antes de atualizar
        createBackup(state.data);

        // Salva os dados validados
        localStorage.setItem(STORAGE_KEYS.CURRICULUM, JSON.stringify(state.data));
        localStorage.setItem(STORAGE_KEYS.CURRICULUM_VERSION, '1');

        console.log('✅ Dados salvos com sucesso no localStorage');
      } else {
        console.warn('⚠️ Dados inválidos - não salvando no localStorage:', validation.errors);
      }
    } catch (error) {
      console.error('❌ Erro ao salvar dados:', error);
    }
  }, [state.data]);

  // Load from localStorage on mount with validation and recovery
  useEffect(() => {
    try {
      // Tenta sanitizar e validar dados do localStorage
      const sanitizedData = sanitizeStorageData(STORAGE_KEYS.CURRICULUM);

      if (sanitizedData) {
        const validation = validateCurriculumData(sanitizedData);

        dispatch({
          type: 'LOAD_FROM_STORAGE',
          payload: {
            data: sanitizedData,
            validation
          }
        });

        console.log('📥 Dados carregados do localStorage');

        if (!validation.isValid) {
          console.warn('⚠️ Dados parcialmente corrompidos - alguns campos foram recuperados');
        }
      } else {
        console.log('ℹ️ Nenhum dado anterior encontrado - iniciando com dados limpos');
      }

      // Carrega lista de backups disponíveis
      const backups = listBackups();
      setAvailableBackups(backups.map(b => ({ timestamp: b.timestamp })));

    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
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
      try {
        createBackup(state.data);
        localStorage.setItem(STORAGE_KEYS.CURRICULUM, JSON.stringify(state.data));
        console.log('💾 Dados salvos manualmente');
      } catch (error) {
        console.error('❌ Erro ao salvar manualmente:', error);
      }
    },

    loadFromStorage: () => {
      try {
        const sanitizedData = sanitizeStorageData(STORAGE_KEYS.CURRICULUM);

        if (sanitizedData) {
          const validation = validateCurriculumData(sanitizedData);
          dispatch({
            type: 'LOAD_FROM_STORAGE',
            payload: { data: sanitizedData, validation }
          });
        }
      } catch (error) {
        console.error('❌ Erro ao carregar manualmente:', error);
      }
    },

    resetCurriculum: () => {
      // Cria backup antes de resetar
      createBackup(state.data);
      dispatch({ type: 'RESET' });
      localStorage.removeItem(STORAGE_KEYS.CURRICULUM);
      console.log('🔄 Currículo resetado');
    },

    clearCorruptionWarning: () => {
      dispatch({ type: 'CLEAR_CORRUPTION_WARNING' });
    },

    restoreFromBackup: () => {
      try {
        const backupData = restoreLatestBackup();

        if (backupData) {
          const validation = validateCurriculumData(backupData);

          if (validation.data) {
            dispatch({
              type: 'LOAD_FROM_STORAGE',
              payload: { data: validation.data, validation }
            });
            console.log('✅ Backup restaurado com sucesso');
            return true;
          }
        }

        console.warn('⚠️ Nenhum backup válido encontrado');
        return false;
      } catch (error) {
        console.error('❌ Erro ao restaurar backup:', error);
        return false;
      }
    },

    exportData: () => {
      try {
        const backup = {
          version: 1,
          timestamp: new Date().toISOString(),
          data: state.data,
        };
        return JSON.stringify(backup, null, 2);
      } catch (error) {
        console.error('❌ Erro ao exportar dados:', error);
        return '';
      }
    },

    importData: (jsonString: string) => {
      try {
        const parsed = JSON.parse(jsonString);

        if (!parsed.data) {
          console.error('❌ Formato de backup inválido');
          return false;
        }

        const validation = validateCurriculumData(parsed.data);

        if (validation.data) {
          // Cria backup antes de importar
          createBackup(state.data);

          dispatch({
            type: 'LOAD_FROM_STORAGE',
            payload: { data: validation.data, validation }
          });

          console.log('✅ Dados importados com sucesso');
          return true;
        }

        console.error('❌ Dados importados são inválidos');
        return false;
      } catch (error) {
        console.error('❌ Erro ao importar dados:', error);
        return false;
      }
    },

    availableBackups,
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
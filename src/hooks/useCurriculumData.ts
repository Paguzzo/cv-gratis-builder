import { usePersonalInfo } from '@/contexts/PersonalInfoContext';
import { useEducation } from '@/contexts/EducationContext';
import { useExperience } from '@/contexts/ExperienceContext';
import { useSkills } from '@/contexts/SkillsContext';
import { useExtras } from '@/contexts/ExtrasContext';
import { useCurriculum } from '@/contexts/CurriculumContext';
import { CurriculumData } from '@/types/curriculum';
import { useMemo, useRef } from 'react';

export function useCurriculumData(): { data: CurriculumData } {
  // Tentar usar contextos separados primeiro (para compatibilidade)
  const { state: personalInfoState } = usePersonalInfo();
  const { state: educationState } = useEducation();
  const { state: experienceState } = useExperience();
  const { state: skillsState } = useSkills();
  const { state: extrasState } = useExtras();

  // Fallback para CurriculumContext se os contextos separados estiverem vazios
  const { state: curriculumState } = useCurriculum();

  // Usar ref para armazenar dados anteriores e evitar re-renderizações desnecessárias
  const previousDataRef = useRef<string | null>(null);

  const data = useMemo(() => {
    // NOVO: Verificar se há dados finalizados salvos como fallback final
    let finalizedFallbackData: CurriculumData | null = null;
    try {
      const finalizedDataStr = localStorage.getItem('cvgratis-curriculum-finalized');
      if (finalizedDataStr) {
        const parsed = JSON.parse(finalizedDataStr);
        finalizedFallbackData = parsed;
        console.log('📥 [useCurriculumData] Dados finalizados encontrados no localStorage como fallback');
      }
    } catch (error) {
      console.error('❌ [useCurriculumData] Erro ao carregar dados finalizados:', error);
    }

    // Verificar se há dados válidos nos contextos
    const hasContextData =
      (personalInfoState?.data && Object.keys(personalInfoState.data).length > 0) ||
      (curriculumState?.data?.personalInfo && Object.keys(curriculumState.data.personalInfo).length > 0);

    // Se não há dados nos contextos mas há dados finalizados, usar os finalizados
    if (!hasContextData && finalizedFallbackData) {
      console.log('✅ [useCurriculumData] Usando dados finalizados como fonte principal');
      return finalizedFallbackData;
    }
    // Usar dados dos contextos separados com fallback para CurriculumContext
    const personalInfo = personalInfoState?.data || curriculumState?.data?.personalInfo || {
      name: '',
      email: '',
      phone: '',
      whatsapp: '',
      address: '',
      position: '',
      photo: '',
      isRoundPhoto: true,
      hasDriverLicense: false,
      driverLicenseCategories: []
    };

    const education = educationState?.data || curriculumState?.data?.education || [];
    const experience = experienceState?.data || curriculumState?.data?.experience || [];
    
    // Validação para skills context
    const skills = skillsState?.skills || curriculumState?.data?.skills || [];
    const languages = skillsState?.languages || curriculumState?.data?.languages || [];
    const objective = skillsState?.objective || curriculumState?.data?.objective || {
      keywords: '',
      description: ''
    };

    // Validação para extras context
    const courses = extrasState?.courses || curriculumState?.data?.courses || [];
    const projects = extrasState?.projects || curriculumState?.data?.projects || [];
    const achievements = extrasState?.achievements || curriculumState?.data?.achievements || [];

    const newData = {
      personalInfo,
      objective,
      education,
      experience,
      skills,
      languages,
      courses,
      projects,
      achievements,
    };

    // Comparar com dados anteriores para evitar re-renderizações desnecessárias
    const currentDataString = JSON.stringify(newData);
    if (previousDataRef.current === currentDataString) {
      return previousDataRef.currentData || newData;
    }



    previousDataRef.current = currentDataString;
    previousDataRef.currentData = newData;
    
    return newData;
  }, [
    personalInfoState?.data,
    educationState?.data,
    experienceState?.data,
    skillsState?.skills,
    skillsState?.languages,
    skillsState?.objective,
    extrasState?.courses,
    extrasState?.projects,
    extrasState?.achievements,
    curriculumState?.data
  ]);

  return { data };
}
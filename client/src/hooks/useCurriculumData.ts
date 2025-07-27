import { usePersonalInfo } from '@/contexts/PersonalInfoContext';
import { useEducation } from '@/contexts/EducationContext';
import { useExperience } from '@/contexts/ExperienceContext';
import { useSkills } from '@/contexts/SkillsContext';
import { useExtras } from '@/contexts/ExtrasContext';
import { CurriculumData } from '@/types/curriculum';
import { useMemo } from 'react';

export function useCurriculumData(): { data: CurriculumData } {
  console.log('🔍 useCurriculumData: Compilando dados...');
  
  const { state: personalInfoState } = usePersonalInfo();
  const { state: educationState } = useEducation();
  const { state: experienceState } = useExperience();
  const { state: skillsState } = useSkills();
  const { state: extrasState } = useExtras();

  console.log('📊 Estados dos contextos:', {
    personalInfo: personalInfoState?.data,
    education: educationState?.data,
    skills: skillsState,
    extras: extrasState
  });

  const data = useMemo(() => {
    // Validação de segurança
    const personalInfo = personalInfoState?.data || {
      name: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      website: ''
    };

    const education = educationState?.data || [];
    const experience = experienceState?.data || [];
    
    // Validação para skills context
    const skills = skillsState?.skills || [];
    const languages = skillsState?.languages || [];
    const objective = skillsState?.objective || {
      keywords: '',
      description: ''
    };

    // Validação para extras context
    const courses = extrasState?.courses || [];
    const projects = extrasState?.projects || [];
    const achievements = extrasState?.achievements || [];

    return {
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
  }, [personalInfoState, educationState, experienceState, skillsState, extrasState]);

  console.log('✅ Dados compilados:', data);
  return { data };
} 
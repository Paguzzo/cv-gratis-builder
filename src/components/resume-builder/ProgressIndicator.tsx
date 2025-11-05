import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Target, Award } from 'lucide-react';
import { useCurriculumData } from '@/hooks/useCurriculumData';
import { CURRICULUM_STEPS, CurriculumStep } from '@/types/curriculum';

interface ProgressIndicatorProps {
  currentStep: CurriculumStep;
  onStepClick: (step: CurriculumStep) => void;
}

// Sistema de títulos motivacionais baseado no percentual
const getMotivationalTitle = (percentage: number) => {
  if (percentage >= 95) return { name: "Perfil Vencedor", icon: Trophy, color: "bg-yellow-500" };
  if (percentage >= 85) return { name: "Candidato Estrela", icon: Star, color: "bg-purple-500" };
  if (percentage >= 75) return { name: "Perfil Competitivo", icon: Award, color: "bg-blue-500" };
  if (percentage >= 60) return { name: "Em Progresso", icon: Target, color: "bg-green-500" };
  if (percentage >= 40) return { name: "Começando Bem", icon: Target, color: "bg-orange-500" };
  return { name: "Iniciante", icon: Target, color: "bg-gray-500" };
};

// Calcular preenchimento baseado no conteúdo
const calculateCompletionPercentage = (data: any) => {
  let completedSections = 0;
  let totalSections = 9; // Total dos pesos: 2 + 1.5 + 2 + 1 + 1 + 0.5 + 0.5 + 0.5 = 9

  // Informações Pessoais (peso 2)
  const personalWeight = 2;
  let personalCompleted = 0;
  if (data.personalInfo?.name) personalCompleted += 0.4;
  if (data.personalInfo?.email) personalCompleted += 0.3;
  if (data.personalInfo?.phone) personalCompleted += 0.3;
  if (data.personalInfo?.photo) personalCompleted += 0.2; // Bônus por foto
  completedSections += Math.min(personalCompleted * personalWeight, personalWeight);

  // Objetivo Profissional (peso 1.5)
  const objectiveWeight = 1.5;
  if (data.objective?.description && data.objective.description.length > 20) {
    completedSections += objectiveWeight;
  }

  // Experiência Profissional (peso 2)
  const experienceWeight = 2;
  if (data.experience?.length > 0) {
    const expCompleteness = data.experience.reduce((acc: number, exp: any) => {
      let expScore = 0;
      if (exp.position) expScore += 0.3;
      if (exp.company) expScore += 0.3;
      if (exp.startDate) expScore += 0.2;
      if (exp.description) expScore += 0.2;
      return acc + Math.min(expScore, 1);
    }, 0) / data.experience.length;
    completedSections += expCompleteness * experienceWeight;
  }

  // Educação (peso 1)
  const educationWeight = 1;
  if (data.education?.length > 0) {
    completedSections += educationWeight;
  }

  // Habilidades (peso 1)
  const skillsWeight = 1;
  if (data.skills?.length >= 3) {
    completedSections += skillsWeight;
  }

  // Idiomas (peso 0.5)
  const languagesWeight = 0.5;
  if (data.languages?.length > 0) {
    completedSections += languagesWeight;
  }

  // Cursos (peso 0.5)
  const coursesWeight = 0.5;
  if (data.courses?.length > 0) {
    completedSections += coursesWeight;
  }

  // Projetos (peso 0.5)
  const projectsWeight = 0.5;
  if (data.projects?.length > 0) {
    completedSections += projectsWeight;
  }

  return Math.round((completedSections / totalSections) * 100);
};

export function ProgressIndicator({ currentStep, onStepClick }: ProgressIndicatorProps) {
  const { data } = useCurriculumData();
  
  // Calcular progresso do preenchimento (baseado no conteúdo)
  const completionPercentage = calculateCompletionPercentage(data);
  
  // Calcular progresso dos steps (baseado na navegação)
  const currentStepIndex = CURRICULUM_STEPS.findIndex(step => step.id === currentStep);
  const stepProgress = Math.round(((currentStepIndex + 1) / CURRICULUM_STEPS.length) * 100);
  
  // Usar o maior dos dois para mostrar progresso
  const displayProgress = Math.max(completionPercentage, stepProgress);
  
  const motivationalTitle = getMotivationalTitle(completionPercentage);
  const IconComponent = motivationalTitle.icon;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`${motivationalTitle.color} p-2 rounded-full text-white`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{motivationalTitle.name}</h3>
            <p className="text-sm text-gray-500">Completude do perfil</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-lg font-bold px-3 py-1">
          {completionPercentage}%
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progresso do currículo</span>
          <span className="font-medium text-gray-900">{completionPercentage}% preenchido</span>
        </div>
        <Progress value={displayProgress} className="h-3" />
        
        {completionPercentage < 95 && (
          <p className="text-xs text-gray-500 mt-2">
            💡 Complete mais seções para melhorar sua pontuação e se destacar!
          </p>
        )}
        
        {completionPercentage >= 95 && (
          <p className="text-xs text-yellow-600 mt-2">
            🏆 Parabéns! Seu perfil está completo e competitivo!
          </p>
        )}
      </div>
    </div>
  );
}
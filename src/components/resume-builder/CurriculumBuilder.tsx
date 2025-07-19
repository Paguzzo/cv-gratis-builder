import { useBase } from '@/contexts/BaseContext';
import { CURRICULUM_STEPS } from '@/types/curriculum';
import { useNavigate } from 'react-router-dom';
import { ProgressIndicator } from './ProgressIndicator';
import { StepNavigation } from './StepNavigation';
import { PersonalInfo } from './steps/PersonalInfo';
import { ProfessionalObjective } from './steps/ProfessionalObjective';
import { Education } from './steps/Education';
import { Experience } from './steps/Experience';
import { Skills } from './steps/Skills';
import { Languages } from './steps/Languages';
import { Courses } from './steps/Courses';
import { ProjectsAchievements } from './steps/ProjectsAchievements';

export function CurriculumBuilder() {
  const { state, setCurrentStep, setComplete } = useBase();
  const { currentStep } = state;
  const navigate = useNavigate();

  const currentStepIndex = CURRICULUM_STEPS.findIndex(step => step.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === CURRICULUM_STEPS.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      const nextStep = CURRICULUM_STEPS[currentStepIndex + 1];
      setCurrentStep(nextStep.id);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      const previousStep = CURRICULUM_STEPS[currentStepIndex - 1];
      setCurrentStep(previousStep.id);
    }
  };

  const handleFinish = () => {
    // Navigate to template selection
    navigate('/templates');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'personal-info':
        return <PersonalInfo />;
      case 'objective':
        return <ProfessionalObjective />;
      case 'education':
        return <Education />;
      case 'experience':
        return <Experience />;
      case 'skills':
        return <Skills />;
      case 'languages':
        return <Languages />;
      case 'courses':
        return <Courses />;
      case 'projects-achievements':
        return <ProjectsAchievements />;
      default:
        return <PersonalInfo />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Crie seu currículo profissional
        </h1>
        <p className="text-muted-foreground">
          Preencha as informações passo a passo e veja o resultado em tempo real
        </p>
      </div>

      <ProgressIndicator 
        currentStep={currentStep} 
        onStepClick={setCurrentStep}
      />

      <div className="min-h-[400px]">
        {renderCurrentStep()}
      </div>

      <StepNavigation
        currentStep={currentStep}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onFinish={handleFinish}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        canProceed={true}
      />
    </div>
  );
}
import { useCurriculum } from '@/contexts/CurriculumContext';
import { CURRICULUM_STEPS } from '@/types/curriculum';
import { ProgressIndicator } from './ProgressIndicator';
import { StepNavigation } from './StepNavigation';
import { PersonalInfo } from './steps/PersonalInfo';
import { ProfessionalObjective } from './steps/ProfessionalObjective';
import { Card, CardContent } from '@/components/ui/card';

export function CurriculumBuilder() {
  const { state, setCurrentStep } = useCurriculum();
  const { currentStep } = state;

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
    // Navigate to template selection or final page
    console.log('Curriculum finished!');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'personal-info':
        return <PersonalInfo />;
      case 'objective':
        return <ProfessionalObjective />;
      case 'education':
        return (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Educação</h3>
              <p className="text-muted-foreground">Em desenvolvimento...</p>
            </CardContent>
          </Card>
        );
      case 'experience':
        return (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Experiência Profissional</h3>
              <p className="text-muted-foreground">Em desenvolvimento...</p>
            </CardContent>
          </Card>
        );
      case 'skills':
        return (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Habilidades</h3>
              <p className="text-muted-foreground">Em desenvolvimento...</p>
            </CardContent>
          </Card>
        );
      case 'languages':
        return (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Idiomas</h3>
              <p className="text-muted-foreground">Em desenvolvimento...</p>
            </CardContent>
          </Card>
        );
      case 'courses':
        return (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Cursos</h3>
              <p className="text-muted-foreground">Em desenvolvimento...</p>
            </CardContent>
          </Card>
        );
      case 'projects-achievements':
        return (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Projetos & Conquistas</h3>
              <p className="text-muted-foreground">Em desenvolvimento...</p>
            </CardContent>
          </Card>
        );
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
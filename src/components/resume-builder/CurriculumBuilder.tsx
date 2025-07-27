import { useBase } from '@/contexts/BaseContext';
import { CURRICULUM_STEPS } from '@/types/curriculum';
import { useNavigate } from 'react-router-dom';
import { ProgressIndicator } from './ProgressIndicator';
import { StepNavigation } from './StepNavigation';
import { CurriculumPreview } from './CurriculumPreview';
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
    // 🔧 DEBUG: Log para rastrear finalização
    console.log('🔍 FINISH DEBUG - Usuário finalizando currículo');
    console.log('📝 Dados do usuário:', state);
    
    // 🎯 NOVO FLUXO: Verificar se há template premium selecionado
    const premiumTemplateSelected = localStorage.getItem('premium-template-selected');
    
    if (premiumTemplateSelected) {
      // Cliente está editando currículo premium - vai direto para configuração
      console.log('🏆 Cliente premium: Redirecionando para configuração premium:', premiumTemplateSelected);
      navigate(`/premium-editor?template=${premiumTemplateSelected}`);
    } else {
      // Cliente gratuito - vai para seleção de templates
      console.log('🎁 Cliente gratuito: Redirecionando para templates');
      navigate('/templates');
    }
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
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Crie seu currículo profissional
        </h1>
        <p className="text-muted-foreground">
          Preencha as informações passo a passo e veja o resultado em tempo real
        </p>
      </div>

      {/* Layout de duas colunas: Formulário + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Coluna do Formulário */}
        <div className="space-y-6">
          {/* Barra de progresso dentro da coluna do formulário */}
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

        {/* Coluna do Preview - altura completa sem limitações */}
        <div className="hidden lg:block">
          <div className="sticky top-6">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="text-center mb-4">
                <h3 className="text-sm font-semibold text-gray-600">
                  Preview do Currículo
                </h3>
              </div>
              
              {/* Container sem limitação de altura para mostrar todo o conteúdo */}
              <div className="w-full max-w-md mx-auto">
                <div 
                  className="w-full border rounded-lg overflow-auto bg-white shadow-sm"
                  style={{ 
                    aspectRatio: '210/297',
                    minHeight: '500px',
                    maxHeight: '80vh'
                  }}
                >
                  <div className="w-full h-full">
                    <CurriculumPreview />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
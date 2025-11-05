import { useCurriculum } from '@/contexts/CurriculumContext';
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
  const { state, setCurrentStep } = useCurriculum();
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

    // 🚨 CORREÇÃO CRÍTICA: Salvar flags de finalização
    try {
      // 1. Marcar como completado
      localStorage.setItem('cvgratis-curriculum-completed', 'true');

      // 2. Salvar cópia finalizada dos dados
      const curriculumData = localStorage.getItem('cvgratis-curriculum');
      if (curriculumData) {
        const parsedData = JSON.parse(curriculumData);
        localStorage.setItem('cvgratis-curriculum-finalized', JSON.stringify({
          ...parsedData,
          isCompleted: true,
          completedAt: new Date().toISOString()
        }));
        console.log('✅ Dados finalizados salvos com sucesso');
      }
    } catch (error) {
      console.error('❌ Erro ao salvar flags de finalização:', error);
    }

    // 🎯 NOVO FLUXO: Verificar se é sessão premium
    const isPremiumSession = localStorage.getItem('is-premium-session');
    const selectedPremiumTemplate = localStorage.getItem('selected-premium-template');

    if (isPremiumSession === 'true' || selectedPremiumTemplate) {
      // Cliente está em sessão premium - volta para editor premium
      let templateId = 'premium-professional'; // default

      if (selectedPremiumTemplate) {
        try {
          const templateData = JSON.parse(selectedPremiumTemplate);
          templateId = templateData.id || 'premium-professional';
        } catch (e) {
          // Se não for JSON, assume que é o ID direto
          templateId = selectedPremiumTemplate || 'premium-professional';
        }
      }

      console.log('🏆 Cliente premium: Redirecionando para editor premium:', templateId);
      navigate(`/premium-editor?template=${templateId}`);
    } else {
      // Cliente gratuito - vai para seleção de templates
      console.log('🎁 Cliente gratuito: Redirecionando para templates');
      navigate('/template-selector');
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

          <div className="overflow-y-scroll pr-4 step-container" style={{ height: 'calc(100vh - 250px)' }}>
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
            <div className="bg-white rounded-lg shadow-lg p-2">
              <div className="text-center mb-2">
                <h3 className="text-sm font-semibold text-gray-600">
                  Preview do Currículo
                </h3>
              </div>

              {/* Container sem limitação de altura para mostrar todo o conteúdo */}
              <div className="w-full">
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

      {/* Estilo da scrollbar cinza para o formulário */}
      <style>{`
        .step-container {
          scrollbar-width: thin;
          scrollbar-color: #9ca3af #f3f4f6;
          scroll-behavior: smooth;
          padding-bottom: 200px !important;
        }

        .step-container::-webkit-scrollbar {
          width: 10px;
        }

        .step-container::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 5px;
        }

        .step-container::-webkit-scrollbar-thumb {
          background: #9ca3af;
          border-radius: 5px;
          border: 2px solid #f3f4f6;
        }

        .step-container::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }

        /* Garantir que inputs focados sejam visíveis */
        .step-container input:focus,
        .step-container textarea:focus,
        .step-container button:focus {
          scroll-margin-top: 20px;
          scroll-margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
}
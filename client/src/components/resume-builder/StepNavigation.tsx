import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CURRICULUM_STEPS, CurriculumStep } from '@/types/curriculum';

interface StepNavigationProps {
  currentStep: CurriculumStep;
  onPrevious: () => void;
  onNext: () => void;
  onFinish?: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  canProceed?: boolean;
}

export function StepNavigation({
  currentStep,
  onPrevious,
  onNext,
  onFinish,
  isFirstStep,
  isLastStep,
  canProceed = true,
}: StepNavigationProps) {
  const currentStepIndex = CURRICULUM_STEPS.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / CURRICULUM_STEPS.length) * 100;

  return (
    <div className="sticky bottom-0 bg-background border-t border-border p-4 mt-8">
      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2 mb-4">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstStep}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </Button>

        <span className="text-sm text-muted-foreground">
          {currentStepIndex + 1} de {CURRICULUM_STEPS.length}
        </span>

        {isLastStep ? (
          <Button
            onClick={onFinish}
            disabled={!canProceed}
            className="flex items-center gap-2"
          >
            Finalizar Currículo
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="flex items-center gap-2"
          >
            Próximo
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
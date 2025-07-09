import { Check } from 'lucide-react';
import { CURRICULUM_STEPS, CurriculumStep } from '@/types/curriculum';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  currentStep: CurriculumStep;
  onStepClick?: (step: CurriculumStep) => void;
}

export function ProgressIndicator({ currentStep, onStepClick }: ProgressIndicatorProps) {
  const currentStepIndex = CURRICULUM_STEPS.findIndex(step => step.id === currentStep);

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {CURRICULUM_STEPS.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = index < currentStepIndex;
          const isClickable = index <= currentStepIndex;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center flex-1"
              onClick={() => isClickable && onStepClick?.(step.id)}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all duration-200 mb-2",
                  isCompleted && "bg-primary border-primary text-primary-foreground",
                  isActive && !isCompleted && "border-primary text-primary bg-background",
                  !isActive && !isCompleted && "border-muted text-muted-foreground bg-muted/50",
                  isClickable && "cursor-pointer hover:scale-105"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              
              <span
                className={cn(
                  "text-xs text-center max-w-20 leading-tight transition-colors duration-200",
                  isActive && "text-primary font-medium",
                  isCompleted && "text-foreground",
                  !isActive && !isCompleted && "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
              
              {index < CURRICULUM_STEPS.length - 1 && (
                <div
                  className={cn(
                    "absolute h-0.5 bg-muted top-4 transition-colors duration-200",
                    "left-1/2 transform -translate-x-1/2",
                    isCompleted && "bg-primary"
                  )}
                  style={{
                    width: `calc(100% / ${CURRICULUM_STEPS.length} - 2rem)`,
                    marginLeft: '1rem'
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
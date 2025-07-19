import { Card } from '@/components/ui/card';
import { useCurriculumData } from '@/hooks/useCurriculumData';
import { useTemplate } from '@/contexts/TemplateContext';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';

export function CurriculumPreview() {
  const { data } = useCurriculumData();
  const { state } = useTemplate();

  return (
    <Card className="h-fit sticky top-6 bg-background shadow-lg overflow-hidden">
      <div className="p-4">
        <div className="mb-4 text-center">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Template: {state.selectedTemplate.name}
          </h3>
          {state.selectedTemplate.isPremium && (
            <span className="text-xs text-yellow-600 font-medium">PREMIUM</span>
          )}
        </div>
        
        <div className="transform scale-75 origin-top border rounded">
          <TemplateRenderer 
            template={state.selectedTemplate} 
            className="pointer-events-none"
          />
        </div>
      </div>
    </Card>
  );
}
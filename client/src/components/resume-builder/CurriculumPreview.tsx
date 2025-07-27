import { Card } from '@/components/ui/card';
import { useCurriculumData } from '@/hooks/useCurriculumData';
import { useTemplate } from '@/contexts/TemplateContext';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';
import { AVAILABLE_TEMPLATES } from '@/types/templates';

export function CurriculumPreview() {
  const { data } = useCurriculumData();
  const { state } = useTemplate();
  
  // 🎯 NOVO FLUXO: Verificar se há template premium sendo editado
  const premiumTemplateSelected = localStorage.getItem('premium-template-selected');
  
  let templateToShow;
  if (premiumTemplateSelected) {
    // Mostrar template premium durante edição
    templateToShow = AVAILABLE_TEMPLATES.find(t => t.id === premiumTemplateSelected) || state.selectedTemplate;
    console.log('🏆 Preview mostrando template premium:', templateToShow.name);
  } else {
    // Lógica original - garantir que use um template gratuito se o atual for premium
    templateToShow = state.selectedTemplate.isPremium 
      ? AVAILABLE_TEMPLATES.find(t => t.id === 'free-modern') || AVAILABLE_TEMPLATES[0]
      : state.selectedTemplate;
  }

  return (
    <div className="w-full min-h-full">
      <div className="text-center mb-2">
        <h4 className="text-xs font-medium text-gray-500">
          {templateToShow.name}
        </h4>
        {templateToShow.isPremium && (
          <span className="text-xs text-yellow-600 font-medium">PREMIUM</span>
        )}
      </div>
      
      {/* Container que permite scroll e mostra todo o conteúdo */}
      <div className="w-full min-h-full overflow-visible">
        <div className="transform scale-95 origin-top-left min-h-full">
          <TemplateRenderer 
            template={templateToShow} 
            className="w-full min-h-full pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}
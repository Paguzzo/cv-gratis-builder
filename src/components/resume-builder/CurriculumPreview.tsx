import { Card } from '@/components/ui/card';
import { useCurriculumData } from '@/hooks/useCurriculumData';
import { useTemplate } from '@/contexts/TemplateContext';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';
import { AVAILABLE_TEMPLATES } from '@/types/templates';

export function CurriculumPreview() {
  const { data } = useCurriculumData();
  const { state } = useTemplate();
  
  // 🎯 NOVO FLUXO: Verificar se há template premium sendo editado
  const premiumTemplateStoredData = localStorage.getItem('selected-premium-template');

  let premiumTemplateSelected = null;
  if (premiumTemplateStoredData) {
    try {
      const templateData = JSON.parse(premiumTemplateStoredData);
      premiumTemplateSelected = templateData.id;
    } catch (e) {
      // Se não for JSON, assume que é o ID direto (fallback para compatibilidade)
      premiumTemplateSelected = premiumTemplateStoredData;
    }
  }
  
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
    <div className="w-full h-full flex flex-col">
      <div className="text-center mb-2 flex-shrink-0">
        <h4 className="text-xs font-medium text-gray-500">
          {templateToShow.name}
        </h4>
        {templateToShow.isPremium && (
          <span className="text-xs text-yellow-600 font-medium">PREMIUM</span>
        )}
      </div>

      {/* Container que permite scroll e mostra todo o conteúdo */}
      <div className="flex-1 overflow-auto px-1">
        <div className="w-full min-h-full">
          <div style={{
            transform: 'scale(0.9)',
            transformOrigin: 'top center',
            width: '111.11%',
            marginLeft: '-5.56%'
          }}>
            <TemplateRenderer
              template={templateToShow}
              className="pointer-events-none w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
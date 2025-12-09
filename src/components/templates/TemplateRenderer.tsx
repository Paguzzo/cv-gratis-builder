import React, { Suspense } from 'react';
import { Template } from '@/types/templates';
import { useCurriculumData } from '@/hooks/useCurriculumData';
import { Loader2 } from 'lucide-react';

// 🚀 LAZY LOADING: Carregar templates apenas quando necessário
const FreeModernTemplate = React.lazy(() => import('./templates/FreeModern').then(m => ({ default: m.FreeModern })));
const ModernTemplate = React.lazy(() => import('./templates/ModernTemplate').then(m => ({ default: m.ModernTemplate })));
const ExecutiveTemplate = React.lazy(() => import('./templates/ExecutiveTemplate').then(m => ({ default: m.ExecutiveTemplate })));
const TechTemplate = React.lazy(() => import('./templates/TechTemplate').then(m => ({ default: m.TechTemplate })));
const CreativeTemplate = React.lazy(() => import('./templates/CreativeTemplate').then(m => ({ default: m.CreativeTemplate })));
const ClassicTemplate = React.lazy(() => import('./templates/ClassicTemplate').then(m => ({ default: m.ClassicTemplate })));
const MinimalTemplate = React.lazy(() => import('./templates/MinimalTemplate').then(m => ({ default: m.MinimalTemplate })));
const PastelTemplate = React.lazy(() => import('./templates/PastelTemplate').then(m => ({ default: m.PastelTemplate })));
const FormalTemplate = React.lazy(() => import('./templates/FormalTemplate').then(m => ({ default: m.FormalTemplate })));
const ProfessionalTemplate = React.lazy(() => import('./templates/ProfessionalTemplate').then(m => ({ default: m.ProfessionalTemplate })));
// 🆕 NOVOS TEMPLATES PREMIUM
const PremiumInfographic = React.lazy(() => import('./templates/PremiumInfographic').then(m => ({ default: m.PremiumInfographic })));
const PremiumPortfolio = React.lazy(() => import('./templates/PremiumPortfolio').then(m => ({ default: m.PremiumPortfolio })));
const PremiumAcademic = React.lazy(() => import('./templates/PremiumAcademic').then(m => ({ default: m.PremiumAcademic })));

// 💾 PERFORMANCE: Loading component otimizado
const TemplateLoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
    <div className="text-center space-y-3">
      <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
      <p className="text-sm text-gray-600">Carregando template...</p>
    </div>
  </div>
);

interface TemplateRendererProps {
  template: Template;
  className?: string;
  forExport?: boolean;
}

export function TemplateRenderer({ template, className, forExport = false }: TemplateRendererProps) {
  const { data } = useCurriculumData();

  const renderTemplate = () => {
    switch (template.id) {
      case 'free-modern':
        return <FreeModernTemplate data={data} template={template} />;
      case 'free-classic':
        return <ClassicTemplate data={data} template={template} />;
      case 'premium-executive':
        return <ExecutiveTemplate data={data} template={template} />;
      case 'premium-tech':
        return <TechTemplate data={data} template={template} />;
      case 'premium-creative':
        return <CreativeTemplate data={data} template={template} />;
      case 'premium-minimal':
        return <MinimalTemplate data={data} template={template} />;
      case 'premium-pastel':
        return <PastelTemplate data={data} template={template} />;
      case 'premium-formal':
        return <FormalTemplate data={data} template={template} />;
      case 'premium-professional':
        return <ProfessionalTemplate data={data} template={template} />;
      case 'premium-infographic':
        return <PremiumInfographic data={data} />;
      case 'premium-portfolio':
        return <PremiumPortfolio data={data} />;
      case 'premium-academic':
        return <PremiumAcademic data={data} />;
      default:
        return <ModernTemplate data={data} template={template} />;
    }
  };

  return (
    <div className={className}>
      {/* 🚀 SUSPENSE: Loading state enquanto carrega template */}
      <Suspense fallback={<TemplateLoadingSpinner />}>
        {renderTemplate()}
      </Suspense>
    </div>
  );
} 
import React from 'react';
import { Template } from '@/types/templates';
import { useCurriculumData } from '@/hooks/useCurriculumData';
import { ModernTemplate } from './templates/ModernTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { TechTemplate } from './templates/TechTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { PastelTemplate } from './templates/PastelTemplate';
import { FormalTemplate } from './templates/FormalTemplate';
import { ProfessionalTemplate } from './templates/ProfessionalTemplate';

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
        return <ModernTemplate data={data} template={template} />;
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
      default:
        return <ModernTemplate data={data} template={template} />;
    }
  };

  return (
    <div 
      className={className} 
      id={forExport ? 'template-preview-container' : undefined}
    >
      {renderTemplate()}
    </div>
  );
} 
// Template categorization system for FASE 3A

export type TemplateCategory =
  | 'professional'
  | 'creative'
  | 'modern'
  | 'minimal'
  | 'academic'
  | 'tech';

export type TemplateLevel = 'free' | 'premium';

export interface TemplateTags {
  categories: TemplateCategory[];
  level: TemplateLevel;
  features: string[];
  bestFor: string[];
  colorScheme: string;
}

export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  tags: TemplateTags;
  thumbnail?: string;
  component: React.ComponentType<any>;
  previewImage?: string;
}

export interface TemplateFilter {
  category?: TemplateCategory;
  level?: TemplateLevel;
  searchQuery?: string;
}

// Catalog of all available templates with metadata
export const TEMPLATE_CATEGORIES: Record<TemplateCategory, { label: string; description: string; icon: string }> = {
  professional: {
    label: 'Profissional',
    description: 'Templates formais para ambientes corporativos',
    icon: '=¼'
  },
  creative: {
    label: 'Criativo',
    description: 'Designs únicos para profissionais criativos',
    icon: '<¨'
  },
  modern: {
    label: 'Moderno',
    description: 'Layouts contemporâneos e elegantes',
    icon: '('
  },
  minimal: {
    label: 'Minimalista',
    description: 'Designs limpos e objetivos',
    icon: '=Ä'
  },
  academic: {
    label: 'Acadêmico',
    description: 'Perfeito para pesquisadores e educadores',
    icon: '<“'
  },
  tech: {
    label: 'Tecnologia',
    description: 'Ideal para desenvolvedores e profissionais de TI',
    icon: '=»'
  }
};

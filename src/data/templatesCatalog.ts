// Complete catalog of all available templates with metadata
import type { TemplateMetadata } from '@/types/templateCategories';

// Template components
import { ClassicTemplate } from '@/components/templates/templates/ClassicTemplate';
import { CreativeTemplate } from '@/components/templates/templates/CreativeTemplate';
import { ExecutiveTemplate } from '@/components/templates/templates/ExecutiveTemplate';
import { FormalTemplate } from '@/components/templates/templates/FormalTemplate';
import { MinimalTemplate } from '@/components/templates/templates/MinimalTemplate';
import { ModernTemplate } from '@/components/templates/templates/ModernTemplate';
import { PastelTemplate } from '@/components/templates/templates/PastelTemplate';
import { ProfessionalTemplate } from '@/components/templates/templates/ProfessionalTemplate';
import { TechTemplate } from '@/components/templates/templates/TechTemplate';
import { FreeClassic } from '@/components/templates/templates/FreeClassic';
import { FreeModern } from '@/components/templates/templates/FreeModern';
import { PremiumExecutive } from '@/components/templates/templates/PremiumExecutive';
import { PremiumTech } from '@/components/templates/templates/PremiumTech';
import { PremiumInfographic } from '@/components/templates/templates/PremiumInfographic';
import { PremiumPortfolio } from '@/components/templates/templates/PremiumPortfolio';
import { PremiumAcademic } from '@/components/templates/templates/PremiumAcademic';
import { PremiumCreative } from '@/components/templates/templates/PremiumCreative';

export const TEMPLATES_CATALOG: TemplateMetadata[] = [
  // FREE TEMPLATES
  {
    id: 'free-classic',
    name: 'Classic Gratuito',
    description: 'Template clássico e elegante, ideal para iniciantes',
    component: FreeClassic,
    tags: {
      categories: ['professional', 'minimal'],
      level: 'free',
      features: ['Layout limpo', 'Fácil leitura', 'ATS-friendly'],
      bestFor: ['Primeiro emprego', 'Vagas tradicionais', 'Profissionais em transição'],
      colorScheme: 'Azul e Branco'
    }
  },
  {
    id: 'free-modern',
    name: 'Modern Gratuito',
    description: 'Design moderno e clean para destacar suas qualificações',
    component: FreeModern,
    tags: {
      categories: ['modern', 'minimal'],
      level: 'free',
      features: ['Design contemporâneo', 'Barra lateral', 'Ícones'],
      bestFor: ['Jovens profissionais', 'Startups', 'Tecnologia'],
      colorScheme: 'Cinza e Azul'
    }
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Template tradicional e confiável',
    component: ClassicTemplate,
    tags: {
      categories: ['professional', 'minimal'],
      level: 'free',
      features: ['Formato tradicional', 'Seções bem definidas', 'Texto focado'],
      bestFor: ['Setores conservadores', 'Finanças', 'Direito'],
      colorScheme: 'Preto e Branco'
    }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simplicidade e objetividade em primeiro lugar',
    component: MinimalTemplate,
    tags: {
      categories: ['minimal', 'professional'],
      level: 'free',
      features: ['Ultra-limpo', 'Foco no conteúdo', 'Tipografia clara'],
      bestFor: ['Qualquer área', 'Recrutadores ocupados', 'Conteúdo denso'],
      colorScheme: 'Monocromático'
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Equilíbrio perfeito entre formal e moderno',
    component: ProfessionalTemplate,
    tags: {
      categories: ['professional', 'modern'],
      level: 'free',
      features: ['Layout balanceado', 'Destaques sutis', 'Profissional'],
      bestFor: ['Gestores', 'Consultores', 'Executivos'],
      colorScheme: 'Azul Marinho'
    }
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Design atual com toque de personalidade',
    component: ModernTemplate,
    tags: {
      categories: ['modern', 'creative'],
      level: 'free',
      features: ['Cores vibrantes', 'Layout em grid', 'Visual atrativo'],
      bestFor: ['Marketing', 'Vendas', 'Comunicação'],
      colorScheme: 'Multicolorido'
    }
  },
  {
    id: 'pastel',
    name: 'Pastel',
    description: 'Cores suaves para um visual delicado',
    component: PastelTemplate,
    tags: {
      categories: ['creative', 'modern'],
      level: 'free',
      features: ['Paleta pastel', 'Suave', 'Elegante'],
      bestFor: ['Design', 'Criatividade', 'Áreas humanísticas'],
      colorScheme: 'Tons Pastel'
    }
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Para quem busca se destacar da multidão',
    component: CreativeTemplate,
    tags: {
      categories: ['creative', 'modern'],
      level: 'free',
      features: ['Design único', 'Layout assimétrico', 'Criativo'],
      bestFor: ['Designers', 'Artistas', 'Profissionais criativos'],
      colorScheme: 'Colorido'
    }
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Perfeito para profissionais de tecnologia',
    component: TechTemplate,
    tags: {
      categories: ['tech', 'modern'],
      level: 'free',
      features: ['Estilo tech', 'Ícones modernos', 'Code-friendly'],
      bestFor: ['Desenvolvedores', 'TI', 'Engenheiros'],
      colorScheme: 'Verde e Preto'
    }
  },
  {
    id: 'formal',
    name: 'Formal',
    description: 'Máxima formalidade e sobriedade',
    component: FormalTemplate,
    tags: {
      categories: ['professional', 'minimal'],
      level: 'free',
      features: ['Ultra-formal', 'Estrutura rígida', 'Conservador'],
      bestFor: ['Advocacia', 'Academia', 'Governo'],
      colorScheme: 'Preto'
    }
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sofisticação para posições de liderança',
    component: ExecutiveTemplate,
    tags: {
      categories: ['professional', 'modern'],
      level: 'free',
      features: ['Sofisticado', 'Destaque hierárquico', 'Premium look'],
      bestFor: ['C-Level', 'Diretores', 'Gestores sênior'],
      colorScheme: 'Azul Escuro'
    }
  },

  // PREMIUM TEMPLATES
  {
    id: 'premium-executive',
    name: 'Executive Premium',
    description: 'Sofisticação máxima para líderes',
    component: PremiumExecutive,
    tags: {
      categories: ['professional', 'modern'],
      level: 'premium',
      features: ['Design luxuoso', 'Gráficos profissionais', 'Layout premium'],
      bestFor: ['CEOs', 'Diretores', 'C-Level'],
      colorScheme: 'Dourado e Preto'
    }
  },
  {
    id: 'premium-tech',
    name: 'Tech Premium',
    description: 'Template tecnológico de alto nível',
    component: PremiumTech,
    tags: {
      categories: ['tech', 'modern'],
      level: 'premium',
      features: ['Design futurista', 'Seções técnicas', 'Visualização de skills'],
      bestFor: ['Tech Leads', 'Arquitetos', 'Senior Devs'],
      colorScheme: 'Ciano e Preto'
    }
  },
  {
    id: 'premium-infographic',
    name: 'Infographic',
    description: 'Visualize sua carreira com infográficos',
    component: PremiumInfographic,
    tags: {
      categories: ['creative', 'modern'],
      level: 'premium',
      features: ['Gráficos visuais', 'Timeline', 'Ícones personalizados'],
      bestFor: ['Marketing', 'Data Scientists', 'Product Managers'],
      colorScheme: 'Multicolorido'
    }
  },
  {
    id: 'premium-portfolio',
    name: 'Portfolio',
    description: 'Mostre seu trabalho de forma impactante',
    component: PremiumPortfolio,
    tags: {
      categories: ['creative', 'modern'],
      level: 'premium',
      features: ['Galeria de projetos', 'Visual storytelling', 'Layout portfolio'],
      bestFor: ['Designers', 'Fotógrafos', 'Criativos'],
      colorScheme: 'Personalizado'
    }
  },
  {
    id: 'premium-academic',
    name: 'Academic',
    description: 'Ideal para pesquisadores e acadêmicos',
    component: PremiumAcademic,
    tags: {
      categories: ['academic', 'professional'],
      level: 'premium',
      features: ['Seção de publicações', 'Citações', 'CV Lattes style'],
      bestFor: ['Pesquisadores', 'Professores', 'Cientistas'],
      colorScheme: 'Azul Acadêmico'
    }
  },
  {
    id: 'premium-creative',
    name: 'Creative Premium',
    description: 'Criatividade sem limites',
    component: PremiumCreative,
    tags: {
      categories: ['creative', 'modern'],
      level: 'premium',
      features: ['Design ousado', 'Layout inovador', 'Personalização total'],
      bestFor: ['Artistas', 'Designers', 'Inovadores'],
      colorScheme: 'Totalmente customizável'
    }
  }
];

// Helper functions for filtering
export const getTemplatesByCategory = (category: string) => {
  return TEMPLATES_CATALOG.filter(template =>
    template.tags.categories.includes(category as any)
  );
};

export const getTemplatesByLevel = (level: 'free' | 'premium') => {
  return TEMPLATES_CATALOG.filter(template => template.tags.level === level);
};

export const getFreeTemplates = () => getTemplatesByLevel('free');
export const getPremiumTemplates = () => getTemplatesByLevel('premium');

export const searchTemplates = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return TEMPLATES_CATALOG.filter(template =>
    template.name.toLowerCase().includes(lowerQuery) ||
    template.description.toLowerCase().includes(lowerQuery) ||
    template.tags.bestFor.some(item => item.toLowerCase().includes(lowerQuery)) ||
    template.tags.features.some(item => item.toLowerCase().includes(lowerQuery))
  );
};

export const getTemplateById = (id: string) => {
  return TEMPLATES_CATALOG.find(template => template.id === id);
};

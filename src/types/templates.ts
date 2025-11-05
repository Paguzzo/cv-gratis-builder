export type TemplateCategory = 'free' | 'premium';

export type TemplateStyle = 'modern' | 'classic' | 'minimal' | 'creative' | 'executive' | 'tech';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  style: TemplateStyle;
  preview: string; // URL da imagem de preview
  isPremium: boolean;
  price?: number;
  features: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
  };
}

export interface TemplateConfig {
  id: string;
  layout: 'single-column' | 'two-column' | 'sidebar';
  headerStyle: 'centered' | 'left-aligned' | 'split';
  sectionStyle: 'boxed' | 'minimal' | 'divided';
  typography: {
    headingFont: string;
    bodyFont: string;
    headingSize: 'small' | 'medium' | 'large';
  };
  spacing: 'compact' | 'normal' | 'spacious';
  showPhoto: boolean;
  showIcons: boolean;
  watermark?: boolean;
}

export const AVAILABLE_TEMPLATES: Template[] = [
  {
    id: 'free-modern',
    name: 'Moderno Gratuito',
    description: 'Template clean e profissional, perfeito para qualquer área',
    category: 'free',
    style: 'modern',
    preview: '/templates/free-modern.png',
    isPremium: false,
    features: [
      'Layout responsivo',
      'Design limpo',
      'Fácil leitura',
      'Watermark CVGrátis'
    ],
    colors: {
      primary: '#1f2937',
      secondary: '#6b7280',
      accent: '#3b82f6',
      text: '#111827'
    }
  },
  {
    id: 'premium-executive',
    name: 'Executivo Premium',
    description: 'Template corporativo com sidebar escura e layout executivo profissional',
    category: 'premium',
    style: 'executive',
    preview: '/templates/premium-executive.png',
    isPremium: true,
    price: 4.90,
    features: [
      'Layout executivo corporativo',
      'Sidebar escura profissional',
      'Foto integrada',
      'Sem watermark',
      'Design sério e confiável'
    ],
    colors: {
      primary: '#334155',
      secondary: '#64748b',
      accent: '#475569',
      text: '#1e293b'
    }
  },
  {
    id: 'premium-tech',
    name: 'Tech Premium',
    description: 'Template tech com sidebar verde e barras de progresso para habilidades',
    category: 'premium',
    style: 'tech',
    preview: '/templates/premium-tech.png',
    isPremium: true,
    price: 4.90,
    features: [
      'Layout tech moderno',
      'Sidebar verde vibrante',
      'Barras de progresso',
      'Sem watermark',
      'Design desenvolvedor'
    ],
    colors: {
      primary: '#0d9488',
      secondary: '#14b8a6',
      accent: '#06b6d4',
      text: '#1e293b'
    }
  },
  {
    id: 'premium-creative',
    name: 'Criativo Premium',
    description: 'Template diferenciado para áreas criativas',
    category: 'premium',
    style: 'creative',
    preview: '/templates/premium-creative.png',
    isPremium: true,
    price: 4.90,
    features: [
      'Design diferenciado',
      'Layout criativo',
      'Destaque visual',
      'Sem watermark',
      'Portfolio integrado'
    ],
    colors: {
      primary: '#7c2d12',
      secondary: '#a3a3a3',
      accent: '#ea580c',
      text: '#1c1917'
    }
  },

  // NOVOS TEMPLATES
  {
    id: 'free-classic',
    name: 'Clássico Gratuito',
    description: 'Template tradicional e elegante, ideal para áreas conservadoras',
    category: 'free',
    style: 'classic',
    preview: '/templates/free-classic.png',
    isPremium: false,
    features: [
      'Design clássico atemporal',
      'Universalmente aceito',
      'Foco no conteúdo',
      'Watermark CVGrátis'
    ],
    colors: {
      primary: '#374151',
      secondary: '#6b7280',
      accent: '#4b5563',
      text: '#111827'
    }
  },
  {
    id: 'premium-minimal',
    name: 'Minimalista Premium',
    description: 'Template moderno com barra lateral colorida e layout duas colunas',
    category: 'premium',
    style: 'minimal',
    preview: '/templates/premium-minimal.png',
    isPremium: true,
    price: 4.90,
    features: [
      'Layout duas colunas moderno',
      'Barra lateral colorida',
      'Foto integrada',
      'Sem watermark',
      'Design profissional'
    ],
    colors: {
      primary: '#ec4899',
      secondary: '#f472b6',
      accent: '#fb7185',
      text: '#374151'
    }
  },
  {
    id: 'premium-pastel',
    name: 'Elegante Premium',
    description: 'Template elegante com sidebar bege suave e design feminino delicado',
    category: 'premium',
    style: 'modern',
    preview: '/templates/premium-pastel.png',
    isPremium: true,
    price: 4.90,
    features: [
      'Design elegante e feminino',
      'Sidebar bege suave',
      'Layout delicado',
      'Sem watermark',
      'Cores pastéis'
    ],
    colors: {
      primary: '#f59e0b',
      secondary: '#fbbf24',
      accent: '#fcd34d',
      text: '#92400e'
    }
  },
  {
    id: 'premium-formal',
    name: 'Formal Premium',
    description: 'Template ultra-simples uma coluna com foto quadrada e títulos com riscos',
    category: 'premium',
    style: 'modern',
    preview: '/templates/premium-formal.png',
    isPremium: true,
    price: 4.90,
    features: [
      'Layout simples uma coluna',
      'Foto quadrada com cantos arredondados',
      'Títulos com linhas embaixo',
      'Sem watermark',
      'Máxima simplicidade'
    ],
    colors: {
      primary: '#000000',
      secondary: '#374151',
      accent: '#6b7280',
      text: '#000000'
    }
  },
  {
    id: 'premium-professional',
    name: 'Profissional Premium',
    description: 'Template moderno com faixa azul e layout duas colunas profissional',
    category: 'premium',
    style: 'modern',
    preview: '/templates/premium-professional.png',
    isPremium: true,
    price: 4.90,
    features: [
      'Faixa azul elegante',
      'Layout duas colunas',
      'Design profissional',
      'Sem watermark',
      'Visual corporativo'
    ],
    colors: {
      primary: '#2563eb',
      secondary: '#3b82f6',
      accent: '#60a5fa',
      text: '#374151'
    }
  },
  {
    id: 'premium-infographic',
    name: 'Infographic Premium',
    description: 'Template moderno com ícones, gráficos e timeline visual',
    category: 'premium',
    style: 'modern',
    preview: '/templates/premium-infographic.png',
    isPremium: true,
    price: 4.90,
    features: [
      'Design infográfico moderno',
      'Ícones e gráficos visuais',
      'Timeline profissional',
      'Sem watermark',
      'Visual impactante'
    ],
    colors: {
      primary: '#9333ea',
      secondary: '#ec4899',
      accent: '#ef4444',
      text: '#1e293b'
    }
  },
  {
    id: 'premium-portfolio',
    name: 'Portfolio Premium',
    description: 'Template criativo para mostrar portfólio de projetos',
    category: 'premium',
    style: 'creative',
    preview: '/templates/premium-portfolio.png',
    isPremium: true,
    price: 4.90,
    features: [
      'Design portfolio criativo',
      'Destaque para projetos',
      'Layout visual impactante',
      'Sem watermark',
      'Ideal para criativos'
    ],
    colors: {
      primary: '#f97316',
      secondary: '#fb923c',
      accent: '#fdba74',
      text: '#1c1917'
    }
  },
  {
    id: 'premium-academic',
    name: 'Academic Premium',
    description: 'Template acadêmico formal para pesquisadores e professores',
    category: 'premium',
    style: 'modern',
    preview: '/templates/premium-academic.png',
    isPremium: true,
    price: 4.90,
    features: [
      'Layout acadêmico formal',
      'Seção para publicações',
      'Design sério e profissional',
      'Sem watermark',
      'Ideal para pesquisadores'
    ],
    colors: {
      primary: '#1e40af',
      secondary: '#3b82f6',
      accent: '#60a5fa',
      text: '#1e293b'
    }
  }
]; 
import { ThemePreset } from '@/types/customTemplate';
import { defaultColorPalettes, defaultFontConfigs, defaultLayoutConfigs } from '@/types/customTemplate';

// Temas pré-definidos completos
export const predefinedThemes: ThemePreset[] = [
  {
    id: 'professional-classic',
    name: 'Profissional Clássico',
    description: 'Um tema tradicional e elegante, perfeito para setores corporativos e tradicionais',
    category: 'professional',
    tags: ['corporativo', 'formal', 'tradicional'],
    settings: {
      colors: defaultColorPalettes[0], // Azul Profissional
      fonts: defaultFontConfigs[0], // Clássico Times
      layout: defaultLayoutConfigs[0], // Uma Coluna
      sections: [
        { id: 'personalInfo', name: 'Informações Pessoais', visible: true, order: 0 },
        { id: 'objective', name: 'Objetivo Profissional', visible: true, order: 1 },
        { id: 'experience', name: 'Experiência Profissional', visible: true, order: 2 },
        { id: 'education', name: 'Formação Acadêmica', visible: true, order: 3 },
        { id: 'skills', name: 'Habilidades', visible: true, order: 4 },
        { id: 'languages', name: 'Idiomas', visible: true, order: 5 },
        { id: 'courses', name: 'Cursos', visible: true, order: 6 },
        { id: 'projects', name: 'Projetos', visible: true, order: 7 }
      ]
    }
  },
  {
    id: 'modern-tech',
    name: 'Tech Moderno',
    description: 'Design contemporâneo ideal para profissionais de tecnologia e startups',
    category: 'modern',
    tags: ['tecnologia', 'inovador', 'digital'],
    settings: {
      colors: defaultColorPalettes[2], // Cinza Minimalista
      fonts: defaultFontConfigs[4], // Tech Mono
      layout: defaultLayoutConfigs[1], // Duas Colunas Sidebar
      sections: [
        { id: 'personalInfo', name: 'Informações Pessoais', visible: true, order: 0 },
        { id: 'skills', name: 'Habilidades Técnicas', visible: true, order: 1 },
        { id: 'experience', name: 'Experiência', visible: true, order: 2 },
        { id: 'projects', name: 'Projetos Destacados', visible: true, order: 3 },
        { id: 'education', name: 'Formação', visible: true, order: 4 },
        { id: 'courses', name: 'Certificações', visible: true, order: 5 },
        { id: 'languages', name: 'Idiomas', visible: true, order: 6 },
        { id: 'objective', name: 'Sobre Mim', visible: true, order: 7 }
      ]
    }
  },
  {
    id: 'creative-bold',
    name: 'Criativo Audacioso',
    description: 'Para profissionais criativos que querem se destacar com cores vibrantes',
    category: 'creative',
    tags: ['criativo', 'design', 'artes', 'marketing'],
    isPremium: true,
    settings: {
      colors: defaultColorPalettes[1], // Roxo Criativo
      fonts: defaultFontConfigs[5], // Criativo Poppins
      layout: defaultLayoutConfigs[2], // Grid Moderno
      sections: [
        { id: 'personalInfo', name: 'Perfil', visible: true, order: 0 },
        { id: 'objective', name: 'Manifesto Criativo', visible: true, order: 1 },
        { id: 'projects', name: 'Portfolio', visible: true, order: 2 },
        { id: 'experience', name: 'Experiência', visible: true, order: 3 },
        { id: 'skills', name: 'Competências', visible: true, order: 4 },
        { id: 'education', name: 'Formação', visible: true, order: 5 },
        { id: 'courses', name: 'Workshops & Cursos', visible: true, order: 6 },
        { id: 'languages', name: 'Idiomas', visible: true, order: 7 }
      ]
    }
  },
  {
    id: 'minimal-elegant',
    name: 'Minimalista Elegante',
    description: 'Simplicidade e elegância para quem valoriza o essencial',
    category: 'minimal',
    tags: ['minimalista', 'clean', 'simples'],
    settings: {
      colors: defaultColorPalettes[2], // Cinza Minimalista
      fonts: defaultFontConfigs[1], // Moderno Inter
      layout: defaultLayoutConfigs[0], // Uma Coluna
      sections: [
        { id: 'personalInfo', name: 'Contato', visible: true, order: 0 },
        { id: 'experience', name: 'Experiência', visible: true, order: 1 },
        { id: 'education', name: 'Educação', visible: true, order: 2 },
        { id: 'skills', name: 'Habilidades', visible: true, order: 3 },
        { id: 'languages', name: 'Idiomas', visible: true, order: 4 },
        { id: 'objective', name: 'Resumo', visible: false, order: 5 },
        { id: 'courses', name: 'Cursos', visible: false, order: 6 },
        { id: 'projects', name: 'Projetos', visible: false, order: 7 }
      ]
    }
  },
  {
    id: 'executive-premium',
    name: 'Executivo Premium',
    description: 'Para líderes e executivos que buscam transmitir autoridade',
    category: 'professional',
    tags: ['executivo', 'liderança', 'premium'],
    isPremium: true,
    settings: {
      colors: defaultColorPalettes[6], // Preto Clássico
      fonts: defaultFontConfigs[2], // Profissional Roboto
      layout: defaultLayoutConfigs[1], // Duas Colunas Sidebar
      sections: [
        { id: 'personalInfo', name: 'Perfil Executivo', visible: true, order: 0 },
        { id: 'objective', name: 'Resumo Executivo', visible: true, order: 1 },
        { id: 'experience', name: 'Trajetória Profissional', visible: true, order: 2 },
        { id: 'education', name: 'Formação Acadêmica', visible: true, order: 3 },
        { id: 'skills', name: 'Competências Principais', visible: true, order: 4 },
        { id: 'projects', name: 'Realizações Destacadas', visible: true, order: 5 },
        { id: 'courses', name: 'Qualificações', visible: true, order: 6 },
        { id: 'languages', name: 'Idiomas', visible: true, order: 7 }
      ]
    }
  },
  {
    id: 'startup-dynamic',
    name: 'Startup Dinâmico',
    description: 'Energia e inovação para profissionais de startups e ambientes ágeis',
    category: 'modern',
    tags: ['startup', 'ágil', 'inovação'],
    isPremium: true,
    settings: {
      colors: defaultColorPalettes[5], // Laranja Moderno
      fonts: defaultFontConfigs[1], // Moderno Inter
      layout: defaultLayoutConfigs[2], // Grid Moderno
      sections: [
        { id: 'personalInfo', name: 'Bio', visible: true, order: 0 },
        { id: 'skills', name: 'Superpoderes', visible: true, order: 1 },
        { id: 'experience', name: 'Jornada', visible: true, order: 2 },
        { id: 'projects', name: 'Conquistas', visible: true, order: 3 },
        { id: 'education', name: 'Background', visible: true, order: 4 },
        { id: 'objective', name: 'Missão', visible: true, order: 5 },
        { id: 'courses', name: 'Learning', visible: true, order: 6 },
        { id: 'languages', name: 'Languages', visible: true, order: 7 }
      ]
    }
  },
  {
    id: 'academic-research',
    name: 'Acadêmico & Pesquisa',
    description: 'Estruturado e formal para ambiente acadêmico e de pesquisa',
    category: 'professional',
    tags: ['acadêmico', 'pesquisa', 'científico'],
    settings: {
      colors: defaultColorPalettes[4], // Verde Água Elegante
      fonts: defaultFontConfigs[0], // Clássico Times
      layout: defaultLayoutConfigs[0], // Uma Coluna
      sections: [
        { id: 'personalInfo', name: 'Dados Pessoais', visible: true, order: 0 },
        { id: 'objective', name: 'Áreas de Interesse', visible: true, order: 1 },
        { id: 'education', name: 'Formação Acadêmica', visible: true, order: 2 },
        { id: 'experience', name: 'Experiência Profissional', visible: true, order: 3 },
        { id: 'projects', name: 'Publicações e Pesquisas', visible: true, order: 4 },
        { id: 'courses', name: 'Cursos e Especializações', visible: true, order: 5 },
        { id: 'skills', name: 'Competências', visible: true, order: 6 },
        { id: 'languages', name: 'Idiomas', visible: true, order: 7 }
      ]
    }
  },
  {
    id: 'designer-portfolio',
    name: 'Designer Portfolio',
    description: 'Focado em visual para designers e profissionais de UX/UI',
    category: 'creative',
    tags: ['design', 'portfolio', 'visual', 'UX/UI'],
    isPremium: true,
    settings: {
      colors: defaultColorPalettes[3], // Vermelho Audacioso
      fonts: defaultFontConfigs[3], // Elegante Playfair
      layout: defaultLayoutConfigs[2], // Grid Moderno
      sections: [
        { id: 'personalInfo', name: 'Designer Profile', visible: true, order: 0 },
        { id: 'objective', name: 'Design Philosophy', visible: true, order: 1 },
        { id: 'projects', name: 'Featured Work', visible: true, order: 2 },
        { id: 'skills', name: 'Design Skills', visible: true, order: 3 },
        { id: 'experience', name: 'Experience', visible: true, order: 4 },
        { id: 'education', name: 'Education', visible: true, order: 5 },
        { id: 'courses', name: 'Certifications', visible: true, order: 6 },
        { id: 'languages', name: 'Languages', visible: true, order: 7 }
      ]
    }
  },
  {
    id: 'sales-marketing',
    name: 'Vendas & Marketing',
    description: 'Persuasivo e impactante para profissionais de vendas e marketing',
    category: 'bold',
    tags: ['vendas', 'marketing', 'comercial'],
    settings: {
      colors: defaultColorPalettes[3], // Vermelho Audacioso
      fonts: defaultFontConfigs[5], // Criativo Poppins
      layout: defaultLayoutConfigs[1], // Duas Colunas Sidebar
      sections: [
        { id: 'personalInfo', name: 'Perfil Comercial', visible: true, order: 0 },
        { id: 'objective', name: 'Proposta de Valor', visible: true, order: 1 },
        { id: 'experience', name: 'Resultados Comprovados', visible: true, order: 2 },
        { id: 'skills', name: 'Competências Comerciais', visible: true, order: 3 },
        { id: 'projects', name: 'Campanhas e Projetos', visible: true, order: 4 },
        { id: 'education', name: 'Formação', visible: true, order: 5 },
        { id: 'courses', name: 'Certificações', visible: true, order: 6 },
        { id: 'languages', name: 'Idiomas', visible: true, order: 7 }
      ]
    }
  },
  {
    id: 'healthcare-professional',
    name: 'Saúde Profissional',
    description: 'Confiável e limpo para profissionais da área de saúde',
    category: 'professional',
    tags: ['saúde', 'médico', 'enfermagem'],
    settings: {
      colors: defaultColorPalettes[4], // Verde Água Elegante
      fonts: defaultFontConfigs[2], // Profissional Roboto
      layout: defaultLayoutConfigs[0], // Uma Coluna
      sections: [
        { id: 'personalInfo', name: 'Dados Profissionais', visible: true, order: 0 },
        { id: 'objective', name: 'Resumo Profissional', visible: true, order: 1 },
        { id: 'education', name: 'Formação', visible: true, order: 2 },
        { id: 'experience', name: 'Experiência Clínica', visible: true, order: 3 },
        { id: 'courses', name: 'Especializações', visible: true, order: 4 },
        { id: 'skills', name: 'Competências Técnicas', visible: true, order: 5 },
        { id: 'projects', name: 'Pesquisas e Publicações', visible: true, order: 6 },
        { id: 'languages', name: 'Idiomas', visible: true, order: 7 }
      ]
    }
  }
];

// Categorias de temas
export const themeCategories = [
  { id: 'all', name: 'Todos os Temas', icon: '🎨' },
  { id: 'professional', name: 'Profissional', icon: '💼' },
  { id: 'creative', name: 'Criativo', icon: '🎭' },
  { id: 'minimal', name: 'Minimalista', icon: '⚪' },
  { id: 'bold', name: 'Audacioso', icon: '⚡' },
  { id: 'elegant', name: 'Elegante', icon: '✨' },
  { id: 'modern', name: 'Moderno', icon: '🚀' },
  { id: 'classic', name: 'Clássico', icon: '📜' }
];

// Função auxiliar para buscar tema por ID
export function getThemeById(id: string): ThemePreset | undefined {
  return predefinedThemes.find(theme => theme.id === id);
}

// Função auxiliar para filtrar temas por categoria
export function getThemesByCategory(category: string): ThemePreset[] {
  if (category === 'all') {
    return predefinedThemes;
  }
  return predefinedThemes.filter(theme => theme.category === category);
}

// Função auxiliar para obter temas gratuitos
export function getFreeThemes(): ThemePreset[] {
  return predefinedThemes.filter(theme => !theme.isPremium);
}

// Função auxiliar para obter temas premium
export function getPremiumThemes(): ThemePreset[] {
  return predefinedThemes.filter(theme => theme.isPremium);
}

// Tipos para customização avançada de templates

export interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  text: string;
  textLight?: string;
  textDark?: string;
  background?: string;
  backgroundLight?: string;
  accent?: string;
  link?: string;
  highlight?: string;
  gradient?: string;
  border?: string;
}

export interface FontConfig {
  id: string;
  name: string;
  headingFont: string;
  bodyFont: string;
  headingWeight?: number;
  bodyWeight?: number;
  headingSize?: number; // em pixels
  subheadingSize?: number;
  bodySize?: number;
  letterSpacing?: string;
  lineHeight?: number;
  googleFonts?: string[]; // Fontes do Google Fonts para carregar
}

export interface LayoutConfig {
  id: string;
  name: string;
  columns: number;
  sectionOrder: string[];
  spacing: {
    sections: number; // espaçamento entre seções
    items: number; // espaçamento entre itens
    padding: number; // padding geral
  };
  borders: {
    enabled: boolean;
    color?: string;
    width?: number;
    style?: 'solid' | 'dashed' | 'dotted';
    radius?: number; // border-radius
  };
  shadows: {
    enabled: boolean;
    color?: string;
    blur?: number;
    spread?: number;
    offsetX?: number;
    offsetY?: number;
  };
}

export interface SectionConfig {
  id: string;
  name: string;
  visible: boolean;
  order: number;
  customTitle?: string;
  icon?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
}

export interface LogoConfig {
  url: string;
  position: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'watermark';
  size: number; // percentual do tamanho original
  opacity?: number; // para watermark
}

export interface PhotoConfig {
  url: string;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  filters?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    grayscale?: boolean;
    sepia?: boolean;
    blur?: number;
  };
  border?: {
    enabled: boolean;
    color?: string;
    width?: number;
    radius?: number;
  };
  removedBackground?: boolean;
}

export interface CustomTemplateSettings {
  baseTemplate: string;
  colors: ColorScheme;
  fonts: FontConfig;
  layout: LayoutConfig;
  sections: SectionConfig[];
  logo?: LogoConfig;
  photo?: PhotoConfig;
  customCSS?: string; // CSS personalizado avançado
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: string;
  };
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'creative' | 'minimal' | 'bold' | 'elegant' | 'modern' | 'classic';
  thumbnail?: string;
  settings: Omit<CustomTemplateSettings, 'baseTemplate' | 'metadata'>;
  tags?: string[];
  isPremium?: boolean;
}

// Histórico de mudanças para undo/redo
export interface HistoryEntry {
  timestamp: number;
  settings: CustomTemplateSettings;
  description: string;
}

export interface CustomizationHistory {
  entries: HistoryEntry[];
  currentIndex: number;
  maxEntries: number;
}

// Paletas de cores pré-definidas
export const defaultColorPalettes: ColorScheme[] = [
  {
    id: 'professional-blue',
    name: 'Azul Profissional',
    primary: '#2563eb',
    secondary: '#3b82f6',
    text: '#1e3a8a',
    textLight: '#60a5fa',
    textDark: '#1e40af',
    background: '#ffffff',
    backgroundLight: '#eff6ff',
    accent: '#0ea5e9',
    link: '#0284c7',
    highlight: '#bfdbfe',
    border: '#93c5fd'
  },
  {
    id: 'creative-purple',
    name: 'Roxo Criativo',
    primary: '#7c3aed',
    secondary: '#a78bfa',
    text: '#5b21b6',
    textLight: '#c4b5fd',
    textDark: '#6b21a8',
    background: '#ffffff',
    backgroundLight: '#f5f3ff',
    accent: '#8b5cf6',
    link: '#7c3aed',
    highlight: '#ddd6fe',
    border: '#c4b5fd'
  },
  {
    id: 'minimal-gray',
    name: 'Cinza Minimalista',
    primary: '#374151',
    secondary: '#6b7280',
    text: '#111827',
    textLight: '#9ca3af',
    textDark: '#1f2937',
    background: '#ffffff',
    backgroundLight: '#f9fafb',
    accent: '#4b5563',
    link: '#1f2937',
    highlight: '#e5e7eb',
    border: '#d1d5db'
  },
  {
    id: 'bold-red',
    name: 'Vermelho Audacioso',
    primary: '#dc2626',
    secondary: '#ef4444',
    text: '#7f1d1d',
    textLight: '#fca5a5',
    textDark: '#991b1b',
    background: '#ffffff',
    backgroundLight: '#fef2f2',
    accent: '#f87171',
    link: '#b91c1c',
    highlight: '#fecaca',
    border: '#fca5a5'
  },
  {
    id: 'elegant-teal',
    name: 'Verde Água Elegante',
    primary: '#0d9488',
    secondary: '#14b8a6',
    text: '#134e4a',
    textLight: '#5eead4',
    textDark: '#115e59',
    background: '#ffffff',
    backgroundLight: '#f0fdfa',
    accent: '#2dd4bf',
    link: '#0f766e',
    highlight: '#99f6e4',
    border: '#5eead4'
  },
  {
    id: 'modern-orange',
    name: 'Laranja Moderno',
    primary: '#ea580c',
    secondary: '#f97316',
    text: '#7c2d12',
    textLight: '#fdba74',
    textDark: '#9a3412',
    background: '#ffffff',
    backgroundLight: '#fff7ed',
    accent: '#fb923c',
    link: '#c2410c',
    highlight: '#fed7aa',
    border: '#fdba74'
  },
  {
    id: 'classic-black',
    name: 'Preto Clássico',
    primary: '#000000',
    secondary: '#1f2937',
    text: '#000000',
    textLight: '#6b7280',
    textDark: '#000000',
    background: '#ffffff',
    backgroundLight: '#f9fafb',
    accent: '#374151',
    link: '#111827',
    highlight: '#e5e7eb',
    border: '#9ca3af'
  }
];

// Configurações de fonte pré-definidas
export const defaultFontConfigs: FontConfig[] = [
  {
    id: 'classic-times',
    name: 'Clássico (Times)',
    headingFont: '"Times New Roman", Georgia, serif',
    bodyFont: '"Times New Roman", Georgia, serif',
    headingWeight: 700,
    bodyWeight: 400,
    headingSize: 24,
    subheadingSize: 18,
    bodySize: 14,
    lineHeight: 1.6,
    letterSpacing: 'normal'
  },
  {
    id: 'modern-inter',
    name: 'Moderno (Inter)',
    headingFont: '"Inter", sans-serif',
    bodyFont: '"Inter", sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
    headingSize: 26,
    subheadingSize: 19,
    bodySize: 14,
    lineHeight: 1.5,
    letterSpacing: '-0.01em',
    googleFonts: ['Inter:400,500,700']
  },
  {
    id: 'professional-roboto',
    name: 'Profissional (Roboto)',
    headingFont: '"Roboto", sans-serif',
    bodyFont: '"Roboto", sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
    headingSize: 25,
    subheadingSize: 18,
    bodySize: 14,
    lineHeight: 1.5,
    letterSpacing: 'normal',
    googleFonts: ['Roboto:400,500,700']
  },
  {
    id: 'elegant-playfair',
    name: 'Elegante (Playfair)',
    headingFont: '"Playfair Display", serif',
    bodyFont: '"Open Sans", sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
    headingSize: 28,
    subheadingSize: 20,
    bodySize: 14,
    lineHeight: 1.6,
    letterSpacing: 'normal',
    googleFonts: ['Playfair Display:700', 'Open Sans:400,600']
  },
  {
    id: 'tech-mono',
    name: 'Tech (Mono)',
    headingFont: '"JetBrains Mono", monospace',
    bodyFont: '"Roboto Mono", monospace',
    headingWeight: 700,
    bodyWeight: 400,
    headingSize: 22,
    subheadingSize: 17,
    bodySize: 13,
    lineHeight: 1.7,
    letterSpacing: '0.02em',
    googleFonts: ['JetBrains Mono:400,700', 'Roboto Mono:400']
  },
  {
    id: 'creative-poppins',
    name: 'Criativo (Poppins)',
    headingFont: '"Poppins", sans-serif',
    bodyFont: '"Poppins", sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
    headingSize: 26,
    subheadingSize: 19,
    bodySize: 14,
    lineHeight: 1.6,
    letterSpacing: 'normal',
    googleFonts: ['Poppins:400,600,700']
  }
];

// Configurações de layout pré-definidas
export const defaultLayoutConfigs: LayoutConfig[] = [
  {
    id: 'one-column',
    name: 'Uma Coluna',
    columns: 1,
    sectionOrder: ['personalInfo', 'objective', 'experience', 'education', 'skills', 'languages', 'courses', 'projects'],
    spacing: {
      sections: 24,
      items: 16,
      padding: 32
    },
    borders: {
      enabled: false
    },
    shadows: {
      enabled: false
    }
  },
  {
    id: 'two-column-sidebar',
    name: 'Duas Colunas (Sidebar)',
    columns: 2,
    sectionOrder: ['personalInfo', 'skills', 'languages', 'objective', 'experience', 'education', 'courses', 'projects'],
    spacing: {
      sections: 20,
      items: 12,
      padding: 24
    },
    borders: {
      enabled: true,
      color: '#e5e7eb',
      width: 1,
      style: 'solid',
      radius: 8
    },
    shadows: {
      enabled: true,
      color: 'rgba(0, 0, 0, 0.1)',
      blur: 10,
      spread: 0,
      offsetX: 0,
      offsetY: 2
    }
  },
  {
    id: 'modern-grid',
    name: 'Grid Moderno',
    columns: 2,
    sectionOrder: ['personalInfo', 'objective', 'experience', 'skills', 'education', 'languages', 'courses', 'projects'],
    spacing: {
      sections: 16,
      items: 12,
      padding: 20
    },
    borders: {
      enabled: true,
      color: '#d1d5db',
      width: 2,
      style: 'solid',
      radius: 12
    },
    shadows: {
      enabled: false
    }
  }
];

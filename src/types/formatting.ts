export type FontFamily = 'formal' | 'elegante' | 'minimalista' | 'tecnologico' | 'classico';
export type FontSize = 'pequeno' | 'medio' | 'grande';
export type LineHeight = 1.0 | 1.2 | 1.3;

export interface TypographyOptions {
  fontFamily: FontFamily;
  fontSize: FontSize;
  lineHeight: LineHeight;
}

export interface ColorPalette {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface FormattingOptions {
  typography: TypographyOptions;
  colorPalette: ColorPalette;
}

export const DEFAULT_TYPOGRAPHY: TypographyOptions = {
  fontFamily: 'classico',
  fontSize: 'medio',
  lineHeight: 1.2
};

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'cinza-claro',
    name: 'Cinza Claro',
    primary: '#6c757d',
    secondary: '#adb5bd',
    accent: '#495057',
    background: '#f8f9fa',
    text: '#212529'
  },
  {
    id: 'verde-musgo',
    name: 'Verde Musgo',
    primary: '#7a942e',
    secondary: '#a8cc8c',
    accent: '#5d6e2a',
    background: '#d4e6cd',
    text: '#2d3e1f'
  },
  {
    id: 'azul-claro',
    name: 'Azul Claro',
    primary: '#2196f3',
    secondary: '#90caf9',
    accent: '#1976d2',
    background: '#e3f2fd',
    text: '#0d47a1'
  },
  {
    id: 'azul-escuro',
    name: 'Azul Escuro',
    primary: '#1a237e',
    secondary: '#5c6bc0',
    accent: '#303f9f',
    background: '#e8eaf6',
    text: '#1a237e'
  },
  {
    id: 'rosa-suave',
    name: 'Rosa Suave',
    primary: '#e91e63',
    secondary: '#f8bbd9',
    accent: '#c2185b',
    background: '#fce4ec',
    text: '#880e4f'
  },
  {
    id: 'amarelo-pastel',
    name: 'Amarelo Pastel',
    primary: '#fbc02d',
    secondary: '#fff176',
    accent: '#f57f17',
    background: '#fff8e1',
    text: '#ff8f00'
  },
  {
    id: 'roxo-moderno',
    name: 'Roxo Moderno',
    primary: '#9c27b0',
    secondary: '#ce93d8',
    accent: '#7b1fa2',
    background: '#f3e5f5',
    text: '#4a148c'
  },
  {
    id: 'vermelho-elegante',
    name: 'Vermelho Elegante',
    primary: '#d32f2f',
    secondary: '#ef5350',
    accent: '#c62828',
    background: '#ffebee',
    text: '#b71c1c'
  }
];

export const FONT_FAMILIES = {
  formal: {
    name: 'Formal',
    css: '"Times New Roman", "Georgia", serif',
    description: 'Tradicional e corporativo'
  },
  elegante: {
    name: 'Elegante', 
    css: '"Playfair Display", "Crimson Text", "Times New Roman", serif',
    description: 'Sofisticado e moderno'
  },
  minimalista: {
    name: 'Minimalista',
    css: '"Inter", "Helvetica Neue", "Arial", sans-serif',
    description: 'Clean e contemporâneo'
  },
  tecnologico: {
    name: 'Tecnológico',
    css: '"JetBrains Mono", "Fira Code", "Courier New", monospace',
    description: 'Moderno e tech'
  },
  classico: {
    name: 'Clássico',
    css: '"Arial", "Helvetica", sans-serif',
    description: 'Universal e legível'
  }
};

export const FONT_SIZES = {
  pequeno: {
    name: 'Pequeno',
    baseSize: '12px',
    titleSize: '16px',
    subtitleSize: '14px'
  },
  medio: {
    name: 'Médio',
    baseSize: '14px',
    titleSize: '18px',
    subtitleSize: '16px'
  },
  grande: {
    name: 'Grande',
    baseSize: '16px',
    titleSize: '20px',
    subtitleSize: '18px'
  }
};

export const LINE_HEIGHTS = {
  1.0: {
    name: 'Compacto',
    value: 1.0
  },
  1.2: {
    name: 'Normal',
    value: 1.2
  },
  1.3: {
    name: 'Espaçoso',
    value: 1.3
  }
}; 
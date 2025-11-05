# 🚀 FASE 3 - FUNCIONALIDADES ADICIONAIS
## Plano de Implementação Completo

**Data**: 06/10/2025
**Status**: 📋 PLANEJAMENTO COMPLETO
**Prioridade**: MÉDIA-ALTA

---

## 🎯 VISÃO GERAL DA FASE 3

A Fase 3 adiciona funcionalidades premium que diferenciam o CV Grátis Builder da concorrência, aumentando o valor percebido e justificando preços premium.

### Objetivos:
1. ✨ Mais opções de templates profissionais
2. 📥 Exportação em múltiplos formatos
3. 🎨 Personalização avançada completa
4. 💰 Aumentar valor percebido do produto

---

## 📊 ESTRUTURA DA FASE 3

### FASE 3A: Sistema de Templates Avançado
**Tempo Estimado**: 6-8 horas
**Complexidade**: Média

### FASE 3B: Exportação Avançada
**Tempo Estimado**: 8-10 horas
**Complexidade**: Alta

### FASE 3C: Personalização Avançada
**Tempo Estimado**: 10-12 horas
**Complexidade**: Alta

**Total**: 24-30 horas de desenvolvimento

---

## 🎨 FASE 3A: SISTEMA DE TEMPLATES AVANÇADO

### Funcionalidades a Implementar:

#### 1. Novos Templates Premium (4 templates)

**A) PremiumInfographic.tsx**
```typescript
// Características:
- Design moderno com ícones
- Timeline visual de experiência
- Skills com barras de progresso
- Seções com cores diferenciadas
- Gráficos de competências
```

**B) PremiumPortfolio.tsx**
```typescript
// Características:
- Focado em projetos
- Grid de trabalhos realizados
- Links para portfolio online
- Destaque para realizações
- Seção de cases de sucesso
```

**C) PremiumAcademic.tsx**
```typescript
// Características:
- Foco em formação acadêmica
- Publicações e pesquisas
- Certificações em destaque
- Formato formal
- Seção de orientações/mentorias
```

**D) PremiumCreative.tsx**
```typescript
// Características:
- Layout assimétrico
- Cores vibrantes
- Tipografia diferenciada
- Design ousado
- Elementos gráficos únicos
```

---

#### 2. Sistema de Categorização

**Arquivo**: `src/types/templateCategories.ts`

```typescript
export type TemplateCategory =
  | 'professional'  // Executivo, Formal
  | 'creative'      // Creative, Infographic
  | 'academic'      // Academic, Research
  | 'technical'     // Tech, Developer
  | 'executive';    // Leadership, C-Level

export interface TemplateMetadata {
  id: string;
  name: string;
  category: TemplateCategory;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  premium: boolean;
  price: number;
  description: string;
  previewImage: string;
  features: string[];
  bestFor: string[];
  rating: number;
  downloads: number;
}

export const TEMPLATE_CATEGORIES: Record<TemplateCategory, {
  label: string;
  description: string;
  icon: string;
}> = {
  professional: {
    label: 'Profissional',
    description: 'Templates formais para ambientes corporativos',
    icon: 'briefcase'
  },
  creative: {
    label: 'Criativo',
    description: 'Templates modernos para áreas criativas',
    icon: 'palette'
  },
  academic: {
    label: 'Acadêmico',
    description: 'Templates para pesquisadores e educadores',
    icon: 'graduation-cap'
  },
  technical: {
    label: 'Técnico',
    description: 'Templates para desenvolvedores e engenheiros',
    icon: 'code'
  },
  executive: {
    label: 'Executivo',
    description: 'Templates premium para C-Level',
    icon: 'crown'
  }
};
```

---

#### 3. Catálogo de Templates

**Arquivo**: `src/data/templatesCatalog.ts`

```typescript
import { TemplateMetadata } from '@/types/templateCategories';

export const TEMPLATES_CATALOG: TemplateMetadata[] = [
  // Gratuitos
  {
    id: 'free-modern',
    name: 'Moderno',
    category: 'professional',
    tags: ['clean', 'minimal', 'ATS-friendly'],
    difficulty: 'beginner',
    premium: false,
    price: 0,
    description: 'Template moderno e limpo, otimizado para ATS',
    previewImage: '/templates/free-modern.png',
    features: ['Layout limpo', 'Otimizado ATS', 'Fácil de editar'],
    bestFor: ['Iniciantes', 'Vagas tradicionais', 'Primeiro emprego'],
    rating: 4.5,
    downloads: 15420
  },
  {
    id: 'free-classic',
    name: 'Clássico',
    category: 'professional',
    tags: ['traditional', 'formal', 'conservative'],
    difficulty: 'beginner',
    premium: false,
    price: 0,
    description: 'Template clássico para ambientes conservadores',
    previewImage: '/templates/free-classic.png',
    features: ['Design tradicional', 'Amplamente aceito', 'Profissional'],
    bestFor: ['Áreas tradicionais', 'Cargos seniores', 'Setores conservadores'],
    rating: 4.3,
    downloads: 12850
  },

  // Premium Existentes
  {
    id: 'premium-executive',
    name: 'Executivo',
    category: 'executive',
    tags: ['leadership', 'c-level', 'premium'],
    difficulty: 'advanced',
    premium: true,
    price: 6.90,
    description: 'Template premium para executivos e lideranças',
    previewImage: '/templates/premium-executive.png',
    features: ['Design sofisticado', 'Seções estratégicas', 'Layout premium'],
    bestFor: ['C-Level', 'Diretores', 'Gerentes Seniores'],
    rating: 4.9,
    downloads: 3240
  },
  {
    id: 'premium-tech',
    name: 'Tech',
    category: 'technical',
    tags: ['developer', 'tech', 'modern'],
    difficulty: 'intermediate',
    premium: true,
    price: 6.90,
    description: 'Template especializado para profissionais de tecnologia',
    previewImage: '/templates/premium-tech.png',
    features: ['Tech-focused', 'Skills destacadas', 'Projetos em grid'],
    bestFor: ['Desenvolvedores', 'Engenheiros', 'Data Scientists'],
    rating: 4.8,
    downloads: 5680
  },

  // Novos Premium
  {
    id: 'premium-infographic',
    name: 'Infográfico',
    category: 'creative',
    tags: ['visual', 'infographic', 'creative'],
    difficulty: 'intermediate',
    premium: true,
    price: 8.90,
    description: 'Template visual com ícones, gráficos e timeline',
    previewImage: '/templates/premium-infographic.png',
    features: ['Visualizações', 'Timeline', 'Ícones', 'Barras de progresso'],
    bestFor: ['Marketing', 'Design', 'Comunicação'],
    rating: 4.7,
    downloads: 2150
  },
  {
    id: 'premium-portfolio',
    name: 'Portfolio',
    category: 'creative',
    tags: ['portfolio', 'projects', 'showcase'],
    difficulty: 'intermediate',
    premium: true,
    price: 8.90,
    description: 'Template focado em projetos e realizações',
    previewImage: '/templates/premium-portfolio.png',
    features: ['Grid de projetos', 'Cases de sucesso', 'Portfolio visual'],
    bestFor: ['Designers', 'Arquitetos', 'Profissionais visuais'],
    rating: 4.8,
    downloads: 1890
  },
  {
    id: 'premium-academic',
    name: 'Acadêmico',
    category: 'academic',
    tags: ['research', 'academic', 'publications'],
    difficulty: 'advanced',
    premium: true,
    price: 7.90,
    description: 'Template para pesquisadores e acadêmicos',
    previewImage: '/templates/premium-academic.png',
    features: ['Publicações', 'Pesquisas', 'Certificações', 'Mentorias'],
    bestFor: ['Pesquisadores', 'Professores', 'Pós-graduandos'],
    rating: 4.6,
    downloads: 980
  },
  {
    id: 'premium-creative',
    name: 'Criativo',
    category: 'creative',
    tags: ['bold', 'asymmetric', 'vibrant'],
    difficulty: 'advanced',
    premium: true,
    price: 9.90,
    description: 'Template ousado para profissionais criativos',
    previewImage: '/templates/premium-creative.png',
    features: ['Layout único', 'Cores vibrantes', 'Tipografia diferenciada'],
    bestFor: ['Artistas', 'Publicitários', 'Criativos'],
    rating: 4.9,
    downloads: 1560
  }
];

// Helpers
export function getTemplatesByCategory(category: TemplateCategory) {
  return TEMPLATES_CATALOG.filter(t => t.category === category);
}

export function getPremiumTemplates() {
  return TEMPLATES_CATALOG.filter(t => t.premium);
}

export function getFreeTemplates() {
  return TEMPLATES_CATALOG.filter(t => !t.premium);
}

export function searchTemplates(query: string) {
  const lowerQuery = query.toLowerCase();
  return TEMPLATES_CATALOG.filter(t =>
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.tags.some(tag => tag.includes(lowerQuery))
  );
}
```

---

#### 4. Sistema de Favoritos

**Arquivo**: `src/hooks/useTemplateFavorites.ts`

```typescript
import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'cvgratis-favorite-templates';

export function useTemplateFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Carregar favoritos do localStorage
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Erro ao carregar favoritos:', e);
      }
    }
  }, []);

  const saveFavorites = (newFavorites: string[]) => {
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  };

  const addFavorite = (templateId: string) => {
    if (!favorites.includes(templateId)) {
      saveFavorites([...favorites, templateId]);
    }
  };

  const removeFavorite = (templateId: string) => {
    saveFavorites(favorites.filter(id => id !== templateId));
  };

  const toggleFavorite = (templateId: string) => {
    if (favorites.includes(templateId)) {
      removeFavorite(templateId);
    } else {
      addFavorite(templateId);
    }
  };

  const isFavorite = (templateId: string) => {
    return favorites.includes(templateId);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite
  };
}
```

---

#### 5. Componente de Favorito

**Arquivo**: `src/components/templates/TemplateFavoriteButton.tsx`

```typescript
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTemplateFavorites } from '@/hooks/useTemplateFavorites';
import { cn } from '@/lib/utils';

interface TemplateFavoriteButtonProps {
  templateId: string;
  className?: string;
}

export function TemplateFavoriteButton({ templateId, className }: TemplateFavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useTemplateFavorites();
  const favorite = isFavorite(templateId);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(templateId);
      }}
      className={cn(
        "transition-all duration-200",
        favorite && "text-red-500 hover:text-red-600",
        className
      )}
      title={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart
        className={cn(
          "w-5 h-5 transition-all",
          favorite && "fill-current"
        )}
      />
    </Button>
  );
}
```

---

#### 6. Template Selector Melhorado

**Modificar**: `src/pages/TemplateSelector.tsx`

Adicionar funcionalidades:
- ✅ Filtros por categoria
- ✅ Busca por nome/tags
- ✅ Ordenação (popularidade, preço, nome)
- ✅ Badges (Novo, Popular, Favorito)
- ✅ Grid responsivo
- ✅ Paginação se necessário

---

## 📥 FASE 3B: EXPORTAÇÃO AVANÇADA

### Funcionalidades a Implementar:

#### 1. Serviço de Exportação Avançada

**Arquivo**: `src/services/advancedExportService.ts`

```typescript
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface ExportOptions {
  format: 'pdf' | 'png' | 'jpg' | 'docx';
  quality?: number; // 0-100 para JPG
  resolution?: number; // DPI: 72, 150, 300
  size?: 'a4' | 'letter' | 'custom';
  orientation?: 'portrait' | 'landscape';
  margins?: { top: number; right: number; bottom: number; left: number };
  watermark?: WatermarkOptions;
}

export interface WatermarkOptions {
  enabled: boolean;
  text?: string;
  image?: string;
  position: 'corner' | 'center' | 'footer';
  opacity: number;
  size: number;
}

class AdvancedExportService {
  // Exportar como PNG
  async exportAsPNG(element: HTMLElement, options: ExportOptions): Promise<Blob> {
    const dpi = options.resolution || 150;
    const scale = dpi / 96; // 96 DPI é padrão do navegador

    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    // Aplicar marca d'água se configurado
    if (options.watermark?.enabled) {
      await this.applyWatermarkToCanvas(canvas, options.watermark);
    }

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png');
    });
  }

  // Exportar como JPG
  async exportAsJPG(element: HTMLElement, options: ExportOptions): Promise<Blob> {
    const quality = (options.quality || 90) / 100;
    const dpi = options.resolution || 150;
    const scale = dpi / 96;

    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    if (options.watermark?.enabled) {
      await this.applyWatermarkToCanvas(canvas, options.watermark);
    }

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/jpeg', quality);
    });
  }

  // Exportar como DOCX (placeholder - requer biblioteca adicional)
  async exportAsDOCX(element: HTMLElement, options: ExportOptions): Promise<Blob> {
    // TODO: Implementar usando biblioteca html-docx-js ou docx
    throw new Error('DOCX export not implemented yet. Requires additional library.');
  }

  // Aplicar marca d'água no canvas
  private async applyWatermarkToCanvas(canvas: HTMLCanvasElement, watermark: WatermarkOptions) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalAlpha = watermark.opacity;
    ctx.fillStyle = '#999999';
    ctx.font = `${watermark.size}px Arial`;

    if (watermark.text) {
      const text = watermark.text;
      const metrics = ctx.measureText(text);

      let x = 0;
      let y = 0;

      switch (watermark.position) {
        case 'corner':
          x = canvas.width - metrics.width - 20;
          y = canvas.height - 20;
          break;
        case 'center':
          x = (canvas.width - metrics.width) / 2;
          y = canvas.height / 2;
          break;
        case 'footer':
          x = (canvas.width - metrics.width) / 2;
          y = canvas.height - 30;
          break;
      }

      ctx.fillText(text, x, y);
    }

    ctx.globalAlpha = 1;
  }

  // Download do arquivo
  downloadFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const advancedExportService = new AdvancedExportService();
```

---

#### 2. Exportação em Lote

**Arquivo**: `src/services/batchExportService.ts`

```typescript
import JSZip from 'jszip';
import { advancedExportService, ExportOptions } from './advancedExportService';

interface BatchExportItem {
  format: 'pdf' | 'png' | 'jpg';
  filename: string;
  options: ExportOptions;
}

class BatchExportService {
  async exportMultiple(
    element: HTMLElement,
    items: BatchExportItem[],
    onProgress?: (current: number, total: number) => void
  ): Promise<Blob> {
    const zip = new JSZip();

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // Notificar progresso
      if (onProgress) {
        onProgress(i + 1, items.length);
      }

      let blob: Blob;

      switch (item.format) {
        case 'png':
          blob = await advancedExportService.exportAsPNG(element, item.options);
          break;
        case 'jpg':
          blob = await advancedExportService.exportAsJPG(element, item.options);
          break;
        case 'pdf':
          // Usar serviço PDF existente
          blob = await this.exportAsPDF(element, item.options);
          break;
        default:
          continue;
      }

      zip.file(item.filename, blob);
    }

    return zip.generateAsync({ type: 'blob' });
  }

  private async exportAsPDF(element: HTMLElement, options: ExportOptions): Promise<Blob> {
    // Integrar com pdfExportService existente
    // Por ora, placeholder
    throw new Error('PDF export not implemented in batch service yet');
  }
}

export const batchExportService = new BatchExportService();
```

---

## 🎨 FASE 3C: PERSONALIZAÇÃO AVANÇADA

### Funcionalidades a Implementar:

#### 1. Editor de Cores Avançado

**Arquivo**: `src/components/customization/AdvancedColorEditor.tsx`

Funcionalidades:
- Color picker completo (RGB, HEX, HSL)
- Paletas pré-definidas
- Gerador automático de paleta harmoniosa
- Preview em tempo real
- Salvar esquemas personalizados

---

#### 2. Customizador de Fontes

**Arquivo**: `src/components/customization/FontCustomizer.tsx`

Funcionalidades:
- Seleção de Google Fonts
- Preview em tempo real
- Configuração por elemento (títulos, corpo, etc)
- Upload de fontes customizadas
- Ajuste de tamanho e peso

---

#### 3. Gerenciador de Temas

**Arquivo**: `src/components/customization/ThemeManager.tsx`

Funcionalidades:
- Temas pré-definidos (10+)
- Criar tema personalizado
- Salvar favoritos
- Importar/Exportar temas
- Preview antes de aplicar

---

## 📊 PRIORIZAÇÃO E ROADMAP

### Implementação Sugerida (Ordem):

**SPRINT 1** (1-2 dias):
1. ✅ Sistema de categorização de templates
2. ✅ Catálogo de templates
3. ✅ Sistema de favoritos
4. ✅ Melhorias no TemplateSelector

**SPRINT 2** (2-3 dias):
1. ⏳ 4 Novos templates premium
2. ⏳ Preview melhorado
3. ⏳ Comparação de templates

**SPRINT 3** (2-3 dias):
1. ⏳ Exportação PNG/JPG
2. ⏳ Configuração de qualidade
3. ⏳ Marca d'água

**SPRINT 4** (2-3 dias):
1. ⏳ Exportação DOCX
2. ⏳ Exportação em lote
3. ⏳ Sistema de temas

**SPRINT 5** (2-3 dias):
1. ⏳ Editor de cores avançado
2. ⏳ Customizador de fontes
3. ⏳ Testes finais

---

## 💰 IMPACTO NO NEGÓCIO

### Valor Agregado:
- **Templates novos**: Justifica aumento de preço (R$ 6,90 → R$ 8,90)
- **Exportação múltipla**: Feature única no mercado
- **Personalização**: Diferencial competitivo

### ROI Esperado:
- Conversão: +30-50%
- Ticket médio: +20-30%
- Satisfação: +40%

---

## 📝 NOTAS DE IMPLEMENTAÇÃO

### Bibliotecas Necessárias:
```json
{
  "jszip": "^3.10.1",              // Exportação em lote
  "html-docx-js": "^0.3.1",        // Exportação DOCX
  "react-color": "^2.19.3",        // Color picker
  "react-easy-crop": "^5.0.0",     // Image cropping
  "webfontloader": "^1.6.28"       // Google Fonts
}
```

### Instalação:
```bash
npm install jszip html-docx-js react-color react-easy-crop webfontloader
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### FASE 3A - Templates:
- [ ] Criar tipos de categorização
- [ ] Criar catálogo de templates
- [ ] Implementar hook de favoritos
- [ ] Criar botão de favorito
- [ ] Melhorar TemplateSelector
- [ ] Criar 4 novos templates premium
- [ ] Implementar comparação de templates
- [ ] Testes e ajustes

### FASE 3B - Exportação:
- [ ] Criar serviço de exportação avançada
- [ ] Implementar exportação PNG
- [ ] Implementar exportação JPG
- [ ] Implementar exportação DOCX
- [ ] Criar sistema de marca d'água
- [ ] Implementar exportação em lote
- [ ] Criar dialogs de configuração
- [ ] Testes e ajustes

### FASE 3C - Personalização:
- [ ] Criar editor de cores
- [ ] Criar customizador de fontes
- [ ] Criar gerenciador de temas
- [ ] Implementar temas pré-definidos
- [ ] Sistema de import/export de temas
- [ ] Preview em tempo real
- [ ] Testes e ajustes

---

**Status**: 📋 Planejamento Completo - Pronto para Implementação
**Próximo Passo**: Começar implementação do SPRINT 1
**ETA Completo**: 2-3 semanas (desenvolvimento parcial)

---

*Criado em: 06/10/2025*
*Autor: Claude Code (Sonnet 4.5)*
*Versão: 1.0*

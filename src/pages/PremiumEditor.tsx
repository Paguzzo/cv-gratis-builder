import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CombinedProvider } from '@/contexts/CombinedProvider';
import { useCurriculumData } from '@/hooks/useCurriculumData';
import { useCompletionTracker } from '@/hooks/useCompletionTracker';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';
import { ErrorBoundary, TemplateErrorBoundary } from '@/components/error';
import { Button } from '@/components/ui/button';
import { JobAIChat as CareerAIChat } from '@/components/ui/jobai-chat';
import { CurriculumChecker } from '@/components/ui/curriculum-checker';
import { CoverLetterGenerator } from '@/components/ui/cover-letter-generator';
import { CompletionBadgeWithTooltip } from '@/components/ui/completion-badge';
import { CompletionModal } from '@/components/ui/completion-modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { AVAILABLE_TEMPLATES, Template } from '@/types/templates';
import { StripeService } from '@/services/stripeService';
import { AIService } from '@/services/aiService';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
// Email services removidos para simplicidade
import {
  ArrowLeft,
  Download,
  Printer,
  Crown,
  Palette,
  Type,
  Award,
  Eye,
  Minus,
  Plus,
  Mail,
  MessageCircle,
  CheckCircle,
  AlertTriangle,
  Star,
  FileText,
  Send,
  User,
  Brain,
  BrainCircuit
} from 'lucide-react';

// Wrapper component para CurriculumChecker com acesso aos contextos
const CurriculumCheckerWrapper = ({ open, onOpenChange, onContinueAction, actionType }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinueAction: () => void;
  actionType: 'download' | 'print';
}) => {
  // ✅ Agora podemos obter curriculumData dentro dos contextos
  let curriculumData = null;
  try {
    const { data } = useCurriculumData();
    curriculumData = data;
    
    console.log('🔧 WRAPPER: curriculumData COMPLETO:', JSON.stringify(curriculumData, null, 2));
    
    if (curriculumData) {
      console.log('🔧 WRAPPER: personalInfo:', curriculumData.personalInfo);
      console.log('🔧 WRAPPER: personalInfo.name:', curriculumData.personalInfo?.name);
      console.log('🔧 WRAPPER: personalInfo.email:', curriculumData.personalInfo?.email);
      console.log('🔧 WRAPPER: personalInfo.phone:', curriculumData.personalInfo?.phone);
      console.log('🔧 WRAPPER: experience count:', curriculumData.experience?.length || 0);
      console.log('🔧 WRAPPER: education count:', curriculumData.education?.length || 0);
      console.log('🔧 WRAPPER: education details:', curriculumData.education);
      if (curriculumData.education && curriculumData.education.length > 0) {
        curriculumData.education.forEach((edu, index) => {
          console.log(`🔧 WRAPPER: education[${index}]:`, {
            course: edu.course,
            institution: edu.institution,
            level: edu.level
          });
        });
      }
      console.log('🔧 WRAPPER: skills count:', curriculumData.skills?.length || 0);
    }
  } catch (error) {
    console.error('🚨 WRAPPER: Erro ao obter curriculumData:', error);
    curriculumData = null;
  }

  return (
    <CurriculumChecker
      open={open}
      onOpenChange={onOpenChange}
      curriculumData={curriculumData}
      onContinueAction={onContinueAction}
      actionType={actionType}
    />
  );
};

// Wrapper component para CoverLetterGenerator com acesso aos contextos
const CoverLetterGeneratorWrapper = ({ open, onOpenChange }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  // ✅ Obter curriculumData dentro dos contextos
  let curriculumData = null;
  try {
    const { data } = useCurriculumData();
    curriculumData = data;
    
    console.log('🔧 COVER LETTER WRAPPER: curriculumData obtido:', curriculumData ? 'sucesso' : 'null');
  } catch (error) {
    console.error('🚨 COVER LETTER WRAPPER: Erro ao obter curriculumData:', error);
    curriculumData = null;
  }

  return (
    <CoverLetterGenerator
      open={open}
      onOpenChange={onOpenChange}
      curriculumData={curriculumData}
    />
  );
};

// Configurações de formatação
const FONT_STYLES = [
  { id: 'original', name: 'Original', css: 'inherit', isOriginal: true },
  { id: 'classico', name: 'Clássico', css: '"Times New Roman", "Georgia", serif' },
  { id: 'moderno', name: 'Moderno', css: '"Inter", "Segoe UI", "Roboto", sans-serif' },
  { id: 'elegante', name: 'Elegante', css: '"Playfair Display", "Crimson Text", serif' },
  { id: 'tech', name: 'Tech', css: '"JetBrains Mono", "Consolas", monospace' },
  { id: 'profissional', name: 'Profissional', css: '"Arial", "Helvetica", sans-serif' }
];

const FONT_SIZES = [
  { id: 'pequeno', name: 'Aa', multiplier: 0.85 },
  { id: 'medio', name: 'Aa', multiplier: 1.0 },
  { id: 'grande', name: 'Aa', multiplier: 1.15 }
];

const LINE_SPACINGS = [
  { id: '1.0', value: 1.0, name: '1,0' },
  { id: '1.15', value: 1.15, name: '1,15' },
  { id: '1.5', value: 1.5, name: '1,5' },
  { id: '2.0', value: 2.0, name: '2,0' }
];

// Tipos para as paletas de cor
interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  text: string;
  isOriginal?: boolean;
  textDark?: string;
  gradient?: string;
}

// Sistema de cores ORIGINAL (para todos os templates exceto Elegante)
const COLOR_PALETTE_ORIGINAL: ColorScheme[] = [
  {
    id: 'original',
    name: 'Cor Original',
    primary: 'original',
    secondary: 'original',
    text: 'original',
    isOriginal: true
  },
  { id: 'teal', name: 'Verde Água', primary: '#0d9488', secondary: '#14b8a6', text: '#ffffff', textDark: '#064e3b' },
  { id: 'blue', name: 'Azul', primary: '#2563eb', secondary: '#3b82f6', text: '#ffffff', textDark: '#1e3a8a' },
  { id: 'red', name: 'Vermelho', primary: '#dc2626', secondary: '#ef4444', text: '#ffffff', textDark: '#7f1d1d' },
  { id: 'black', name: 'Preto', primary: '#1f2937', secondary: '#374151', text: '#ffffff', textDark: '#111827' },
  { id: 'gray', name: 'Cinza', primary: '#6b7280', secondary: '#9ca3af', text: '#ffffff', textDark: '#374151' },
  { id: 'brown', name: 'Marrom', primary: '#92400e', secondary: '#d97706', text: '#ffffff', textDark: '#451a03' }
];

// Sistema de cores PASTEL (específico para Template Elegante)
const COLOR_PALETTE_ELEGANT: ColorScheme[] = [
  { 
    id: 'original', 
    name: 'Cor Original',
    primary: 'original', 
    secondary: 'original', 
    text: 'original',
    isOriginal: true 
  },
  { 
    id: 'teal', 
    name: 'Verde Água Pastel', 
    primary: '#67e8f9', 
    secondary: '#22d3ee', 
    text: '#0e7490',
    textDark: '#0c4a6e',
    gradient: 'linear-gradient(135deg, #67e8f915, #22d3ee25)'
  },
  { 
    id: 'blue', 
    name: 'Azul Suave', 
    primary: '#93c5fd', 
    secondary: '#60a5fa', 
    text: '#1e40af',
    textDark: '#1e3a8a',
    gradient: 'linear-gradient(135deg, #93c5fd15, #60a5fa25)'
  },
  { 
    id: 'red', 
    name: 'Rosa Elegante', 
    primary: '#f9a8d4', 
    secondary: '#f472b6', 
    text: '#be185d',
    textDark: '#9d174d',
    gradient: 'linear-gradient(135deg, #f9a8d415, #f472b625)'
  },
  { 
    id: 'black', 
    name: 'Lavanda', 
    primary: '#c4b5fd', 
    secondary: '#a78bfa', 
    text: '#7c3aed',
    textDark: '#6b21a8',
    gradient: 'linear-gradient(135deg, #c4b5fd15, #a78bfa25)'
  },
  { 
    id: 'gray', 
    name: 'Verde Menta', 
    primary: '#86efac', 
    secondary: '#4ade80', 
    text: '#15803d',
    textDark: '#14532d',
    gradient: 'linear-gradient(135deg, #86efac15, #4ade8025)'
  },
  { 
    id: 'brown', 
    name: 'Pêssego', 
    primary: '#fdba74', 
    secondary: '#fb923c', 
    text: '#c2410c',
    textDark: '#9a3412',
    gradient: 'linear-gradient(135deg, #fdba7415, #fb923c25)'
  }
];

export default function PremiumEditor() {
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');
  
  console.log('🔧 RENDER: templateId obtido:', templateId);
  
  // Função para escolher a paleta correta baseada no template
  const getColorPalette = (templateId: string) => {
    return (templateId === 'premium-elegante' || templateId === 'premium-minimalista') 
      ? COLOR_PALETTE_ELEGANT 
      : COLOR_PALETTE_ORIGINAL;
  };

  // Paleta atual baseada no template
  const COLOR_PALETTE = getColorPalette(templateId || '');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [activeTab, setActiveTab] = useState('texto');

  // Estados de formatação - Iniciar com valores "Original" do template
  const [fontStyle, setFontStyle] = useState('original');
  const [fontSize, setFontSize] = useState('medio');
  const [lineSpacing, setLineSpacing] = useState('1.15');
  const [selectedColor, setSelectedColor] = useState('original');

  // Estados para modais - email e whatsapp removidos
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [fullReport, setFullReport] = useState('');
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [checkerOpen, setCheckerOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'download' | 'print' | null>(null);
  const [coverLetterOpen, setCoverLetterOpen] = useState(false);
  const [exitWarningOpen, setExitWarningOpen] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  // Ref para controlar cooldown do aviso (persistir entre re-renders)
  const lastWarningTimeRef = useRef(0);
  const WARNING_COOLDOWN = 60000; // 1 minuto entre avisos

  // 🎯 Sistema de rastreamento de conclusão
  const completion = useCompletionTracker();
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  // const { clearAllData } = useCurriculumData(); // ❌ REMOVIDO: Hook não pode ser chamado fora do Provider

  // Obter dados do currículo - PRIORIZAR LOCALSTORAGE
  const getCurriculumData = () => {
    try {
      // Tentar localStorage primeiro (dados finalizados)
      const finalizedData = localStorage.getItem('cvgratis-curriculum-finalized');
      if (finalizedData) {
        console.log('✅ Dados carregados de localStorage (finalized)');
        return JSON.parse(finalizedData);
      }

      // Tentar localStorage padrão
      const savedData = localStorage.getItem('cvgratis-curriculum');
      if (savedData) {
        console.log('✅ Dados carregados de localStorage (saved)');
        return JSON.parse(savedData);
      }

      // ❌ REMOVIDO: Hook não pode ser chamado dentro de função regular
      // const { data } = useCurriculumData();
      // console.log('✅ Dados carregados do hook useCurriculumData');
      // return data;

      console.log('⚠️ Nenhum dado encontrado em localStorage');
      return null;
    } catch (error) {
      console.error('❌ Erro ao obter dados do currículo:', error);
      return null;
    }
  };

  const [curriculumDataFromHook, setCurriculumDataFromHook] = useState(getCurriculumData());

  // Atualizar dados quando o componente montar ou quando mudar
  useEffect(() => {
    const data = getCurriculumData();
    setCurriculumDataFromHook(data);
    console.log('📋 Dados do currículo atualizados:', data);
  }, []);

  // Estados para formulários de email e whatsapp removidos

  useEffect(() => {
    console.log('🔧 DEV: Template ID:', templateId);
    console.log('🔧 DEV: URL completa:', window.location.href);
    console.log('🔧 DEV: SearchParams:', Object.fromEntries(searchParams.entries()));

    if (!templateId) {
      console.log('🚨 DEV: Template ID não foi fornecido!');
      toast.error('Template não especificado na URL');
      setTimeout(() => navigate('/template-selector'), 1500);
      return;
    }

    const template = AVAILABLE_TEMPLATES.find(t => t.id === templateId);
    console.log('🔧 DEV: Template encontrado:', template);
    if (!template) {
      console.log('🔧 DEV: Templates disponíveis:', AVAILABLE_TEMPLATES.map(t => ({ id: t.id, name: t.name })));
      console.log('🔧 DEV: Template solicitado:', templateId);
      toast.error(`Template '${templateId}' não encontrado. Templates disponíveis: ${AVAILABLE_TEMPLATES.map(t => t.id).join(', ')}`);
      setTimeout(() => navigate('/template-selector'), 3000);
      return;
    }

    // Verificação de acesso - SERVER-SIDE SEGURA
    const checkAccess = async () => {
      if (!template.isPremium) {
        // Template gratuito, liberar acesso
        setSelectedTemplate(template);
        setIsCheckingAccess(false);
        return;
      }

      // Verificar modo admin primeiro (bypass)
      const isAdminAccess = localStorage.getItem('admin-mode-enabled') === 'true';
      if (isAdminAccess) {
        console.log('🔑 ACESSO ADMINISTRATIVO: Template premium liberado');
        toast.success(`🔧 Modo Admin: Acesso liberado ao ${template.name}`);
        setSelectedTemplate(template);
        setIsCheckingAccess(false);
        return;
      }

      // Obter email do usuário (você pode implementar um sistema de coleta de email)
      const userEmail = searchParams.get('email') || localStorage.getItem('user-email') || '';

      if (!userEmail) {
        toast.error('Email não fornecido. Redirecionando...');
        setTimeout(() => navigate('/template-selector'), 2000);
        setIsCheckingAccess(false);
        return;
      }

      // Verificar acesso via API server-side
      toast.loading('Verificando acesso ao template premium...');
      const accessCheck = await StripeService.checkPremiumAccess(templateId, userEmail);
      toast.dismiss();

      console.log('🔒 Verificação de acesso:', accessCheck);

      if (accessCheck.hasAccess) {
        console.log('✅ Acesso premium confirmado!');
        toast.success(`Acesso confirmado ao ${template.name}!`);
        setSelectedTemplate(template);
      } else {
        console.log('❌ Acesso negado - template não comprado');
        toast.error('Você não tem acesso a este template premium. Redirecionando...');
        setTimeout(() => navigate('/template-selector'), 3000);
      }

      setIsCheckingAccess(false);
    };

    checkAccess();

    setSelectedTemplate(template);
    console.log('🔧 DEV: Template selecionado com sucesso:', template.name);

    // Configurar aviso de saída da página
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Você tem certeza que deseja sair? Seu currículo não foi salvo automaticamente.';
      return 'Você tem certeza que deseja sair? Seu currículo não foi salvo automaticamente.';
    };

    const handleMouseLeave = (e: MouseEvent) => {
      // Verificar se o mouse saiu pela parte superior da janela (indicando intenção de fechar)
      const now = Date.now();
      if (e.clientY <= 0 && (now - lastWarningTimeRef.current) > WARNING_COOLDOWN) {
        lastWarningTimeRef.current = now;
        setExitWarningOpen(true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [templateId, navigate, searchParams]);

  // Estado para controlar se personalizações devem ser aplicadas
  const [hasUserCustomizations, setHasUserCustomizations] = useState(false);

  // Aplicar estilos dinamicamente - APENAS SE USUÁRIO FEZ PERSONALIZAÇÕES
  useEffect(() => {
    const styleId = 'premium-editor-styles';
    let existingStyle = document.getElementById(styleId);
    
    if (existingStyle) {
      existingStyle.remove();
    }

    // Se não há personalizações do usuário, não aplicar nada (manter original)
    if (!hasUserCustomizations) {
      return;
    }

    const selectedFontStyle = FONT_STYLES.find(f => f.id === fontStyle);
    const selectedFontSize = FONT_SIZES.find(f => f.id === fontSize);
    const selectedLineSpacing = LINE_SPACINGS.find(l => l.id === lineSpacing);
    const selectedColorScheme = COLOR_PALETTE.find(c => c.id === selectedColor);

    if (selectedFontStyle && selectedFontSize && selectedLineSpacing && selectedColorScheme) {
      const baseSize = 14; // Tamanho base em px
      const multiplier = selectedFontSize.multiplier;

      // Se for cor original, aplicar TODAS as formatações exceto cores
      if (selectedColorScheme.isOriginal) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          .template-premium-preview {
            font-family: ${selectedFontStyle.css} !important;
            line-height: ${selectedLineSpacing.value} !important;
          }
          
          .template-premium-preview h1 {
            font-size: ${Math.round(28 * multiplier)}px !important;
            line-height: ${selectedLineSpacing.value} !important;
            font-family: ${selectedFontStyle.css} !important;
          }
          
          .template-premium-preview h2 {
            font-size: ${Math.round(22 * multiplier)}px !important;
            line-height: ${selectedLineSpacing.value} !important;
            font-family: ${selectedFontStyle.css} !important;
          }
          
          .template-premium-preview h3 {
            font-size: ${Math.round(18 * multiplier)}px !important;
            line-height: ${selectedLineSpacing.value} !important;
            font-family: ${selectedFontStyle.css} !important;
          }
          
          .template-premium-preview h4 {
            font-size: ${Math.round(16 * multiplier)}px !important;
            line-height: ${selectedLineSpacing.value} !important;
            font-family: ${selectedFontStyle.css} !important;
          }
          
          .template-premium-preview p, 
          .template-premium-preview span, 
          .template-premium-preview div {
            font-size: ${Math.round(baseSize * multiplier)}px !important;
            line-height: ${selectedLineSpacing.value} !important;
            font-family: ${selectedFontStyle.css} !important;
          }
          
          /* Transições suaves */
          .template-premium-preview * {
            transition: all 0.3s ease !important;
          }
        `;
        document.head.appendChild(style);
        
        // Remover todas as cores customizadas para voltar ao original
        setTimeout(() => {
          const previewContainer = document.querySelector('.template-premium-preview');
          if (previewContainer) {
            const elementsWithInlineStyles = previewContainer.querySelectorAll('[style]');
            elementsWithInlineStyles.forEach((element: Element) => {
              const htmlElement = element as HTMLElement;
              
              // Verificar se tem cor original salva
              const originalBg = htmlElement.getAttribute('data-original-bg');
              const originalColor = htmlElement.getAttribute('data-original-color');
              const originalBorder = htmlElement.getAttribute('data-original-border');
              
              if (originalBg) {
                htmlElement.style.backgroundColor = originalBg;
                htmlElement.removeAttribute('data-original-bg');
              } else {
                htmlElement.style.removeProperty('background-color');
              }
              
              if (originalColor) {
                htmlElement.style.color = originalColor;
                htmlElement.removeAttribute('data-original-color');
              } else {
                htmlElement.style.removeProperty('color');
              }
              
              if (originalBorder) {
                htmlElement.style.borderColor = originalBorder;
                htmlElement.removeAttribute('data-original-border');
              } else {
                htmlElement.style.removeProperty('border-color');
              }
            });
          }
        }, 100);
        return;
      }
      
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .template-premium-preview {
          font-family: ${selectedFontStyle.css} !important;
          line-height: ${selectedLineSpacing.value} !important;
        }
        
        .template-premium-preview,
        .template-premium-preview p,
        .template-premium-preview div,
        .template-premium-preview span,
        .template-premium-preview li,
        .template-premium-preview td,
        .template-premium-preview th {
          font-size: ${Math.round(baseSize * multiplier)}px !important;
          line-height: ${selectedLineSpacing.value} !important;
          font-family: ${selectedFontStyle.css} !important;
        }
        
        .template-premium-preview h1 {
          font-size: ${Math.round(28 * multiplier)}px !important;
          line-height: ${selectedLineSpacing.value} !important;
          color: ${selectedColorScheme.textDark || selectedColorScheme.text} !important;
          font-family: ${selectedFontStyle.css} !important;
        }

        .template-premium-preview h2 {
          font-size: ${Math.round(22 * multiplier)}px !important;
          line-height: ${selectedLineSpacing.value} !important;
          color: ${selectedColorScheme.textDark || selectedColorScheme.text} !important;
          font-family: ${selectedFontStyle.css} !important;
        }

        .template-premium-preview h3 {
          font-size: ${Math.round(18 * multiplier)}px !important;
          line-height: ${selectedLineSpacing.value} !important;
          color: ${selectedColorScheme.textDark || selectedColorScheme.text} !important;
          font-family: ${selectedFontStyle.css} !important;
        }

        .template-premium-preview h4 {
          font-size: ${Math.round(16 * multiplier)}px !important;
          line-height: ${selectedLineSpacing.value} !important;
          color: ${selectedColorScheme.textDark || selectedColorScheme.text} !important;
          font-family: ${selectedFontStyle.css} !important;
        }
        
        /* SISTEMA ESPECÍFICO POR TEMPLATE */
        
        /* EXECUTIVE - mudar fundo gradiente, não texto */
        .template-premium-preview .bg-gradient-to-r,
        .template-premium-preview .from-slate-800,
        .template-premium-preview .to-slate-900 {
          background: linear-gradient(to right, ${selectedColorScheme.primary}, ${selectedColorScheme.secondary}) !important;
        }
        
        /* TECH + OUTROS - fundos coloridos específicos */
        .template-premium-preview .bg-blue-600,
        .template-premium-preview .bg-teal-600,
        .template-premium-preview .bg-slate-700 {
          background-color: ${selectedColorScheme.primary} !important;
          background-image: none !important;
        }
        
        /* ELEGANTE (PASTEL) TEMPLATE - Sistema de degradê pastel sofisticado */
        .template-premium-preview .bg-gradient-to-b.from-yellow-100.to-amber-50,
        .template-premium-preview .from-yellow-100,
        .template-premium-preview .to-amber-50 {
          background: ${selectedColorScheme.gradient || `linear-gradient(to bottom, ${selectedColorScheme.primary}15, ${selectedColorScheme.secondary}25)`} !important;
          background-image: ${selectedColorScheme.gradient || `linear-gradient(to bottom, ${selectedColorScheme.primary}15, ${selectedColorScheme.secondary}25)`} !important;
        }
        
        /* MINIMALISTA - degradê na barra lateral (igual Elegante) */
        .template-premium-preview .bg-gradient-to-b.from-pink-300.to-pink-400,
        .template-premium-preview .from-pink-300,
        .template-premium-preview .to-pink-400 {
          background: ${selectedColorScheme.gradient || `linear-gradient(to bottom, ${selectedColorScheme.primary}70, ${selectedColorScheme.secondary}90)`} !important;
          background-image: ${selectedColorScheme.gradient || `linear-gradient(to bottom, ${selectedColorScheme.primary}70, ${selectedColorScheme.secondary}90)`} !important;
        }
        
        /* OUTROS - fundos sutis simples */
        .template-premium-preview .bg-pink-200,
        .template-premium-preview .bg-yellow-200:not(.from-yellow-100):not(.from-pink-300) {
          background-color: ${selectedColorScheme.primary}30 !important;
          background-image: none !important;
        }
        
        /* CREATIVE - balões dos anos com cor mais clara para realçar */
        .template-premium-preview .bg-orange-600,
        .template-premium-preview .rounded-full.bg-orange-600 {
          background-color: ${selectedColorScheme.secondary}80 !important;
        }
        
        /* CREATIVE - balões das habilidades com cor clara */
        .template-premium-preview .rounded-full:not(.bg-orange-600) {
          background-color: ${selectedColorScheme.primary}40 !important;
        }
        
        /* TEMPLATES PASTEL (ELEGANTE + MINIMALISTA) - Títulos e nomes com cor mais escura */
        ${(templateId === 'premium-elegante' || templateId === 'premium-minimalista') ? `
        .template-premium-preview .text-amber-800,
        .template-premium-preview .text-amber-700,
        .template-premium-preview .text-amber-900,
        .template-premium-preview .text-amber-600,
        .template-premium-preview .text-pink-600,
        .template-premium-preview .text-pink-700,
        .template-premium-preview .text-pink-800,
        .template-premium-preview h1,
        .template-premium-preview h2,
        .template-premium-preview .font-bold {
          color: ${selectedColorScheme.textDark || selectedColorScheme.text} !important;
        }
        ` : ''}
        
        /* Bordas e linhas */
        .template-premium-preview .border-blue-600,
        .template-premium-preview .border-4,
        .template-premium-preview .border-b-2,
        .template-premium-preview div[style*="borderLeft"],
        .template-premium-preview div[style*="borderRight"],
        .template-premium-preview div[style*="border-left"],
        .template-premium-preview div[style*="border-right"],
        .template-premium-preview div[style*="borderColor"],
        .template-premium-preview div[style*="border-color"] {
          border-color: ${selectedColorScheme.primary} !important;
        }
        
        /* Textos */
        .template-premium-preview .text-blue-600,
        .template-premium-preview .text-teal-600,
        .template-premium-preview .text-slate-300 {
          color: ${selectedColorScheme.textDark || selectedColorScheme.text} !important;
        }

        /* CONTRASTE GARANTIDO - texto branco em fundos coloridos */
        .template-premium-preview .relative.p-8 *,
        .template-premium-preview .relative.p-8 h1,
        .template-premium-preview .relative.p-8 h2,
        .template-premium-preview .relative.p-8 h3,
        .template-premium-preview .relative.p-8 h4,
        .template-premium-preview .relative.p-8 div,
        .template-premium-preview .relative.p-8 span,
        .template-premium-preview .relative.p-8 p,
        .template-premium-preview .relative.p-8 .text-4xl,
        .template-premium-preview .relative.p-8 .text-center,
        .template-premium-preview .relative.p-8 .flex,
        .template-premium-preview .bg-slate-700 *,
        .template-premium-preview .bg-blue-600 *,
        .template-premium-preview .bg-teal-600 *,
        .template-premium-preview .bg-gradient-to-r *,
        .template-premium-preview .text-white {
          color: ${selectedColorScheme.text} !important;
        }

        /* TECH TEMPLATE - FORÇAR CONTRASTE NO HEADER LATERAL */
        .template-premium-preview .bg-slate-700 h1,
        .template-premium-preview .bg-slate-700 h2,
        .template-premium-preview .bg-slate-700 h3,
        .template-premium-preview .bg-slate-700 .text-4xl,
        .template-premium-preview .bg-slate-700 .text-2xl,
        .template-premium-preview .bg-slate-700 .font-bold {
          color: ${selectedColorScheme.text} !important;
        }

        /* Forçar branco em todos os elementos filhos do header */
        .template-premium-preview .relative.p-8 .relative.z-10 * {
          color: ${selectedColorScheme.text} !important;
        }

        /* Sobrescrever elementos com estilos inline de cor APENAS fora do header */
        .template-premium-preview *[style*="color:"]:not(.relative.p-8 *):not(.bg-slate-700 *):not(.bg-blue-600 *):not(.bg-teal-600 *) {
          color: ${selectedColorScheme.textDark || selectedColorScheme.text} !important;
        }
        
        /* Sobrescrever fundos com cores específicas */
        .template-premium-preview *[style*="backgroundColor"][style*="#"],
        .template-premium-preview *[style*="background-color"][style*="#"] {
          background-color: ${selectedColorScheme.primary} !important;
        }
        
        /* Elementos específicos do Creative Template */
        .template-premium-preview .relative.p-8 {
          background-color: ${selectedColorScheme.primary} !important;
        }
        
        .template-premium-preview .w-20.h-1,
        .template-premium-preview .w-2.rounded,
        .template-premium-preview .absolute.-left-4 {
          background-color: ${selectedColorScheme.secondary} !important;
        }
        
        /* REMOVIDO - não alterar automaticamente fundos de cards/caixas */
        
        /* Garantir que TODOS os elementos inline sejam sobrescritos */
        .template-premium-preview * {
          transition: all 0.3s ease !important;
        }
        
        /* Forçar mudança em todos os elementos com cores hard-coded */
        .template-premium-preview [style*="color"],
        .template-premium-preview [style*="background"],
        .template-premium-preview [style*="border"] {
          animation: color-change 0.1s ease-in-out !important;
        }
        
        @keyframes color-change {
          from { opacity: 0.8; }
          to { opacity: 1; }
        }
      `;
      document.head.appendChild(style);
      
      // Forçar mudança de estilos inline via JavaScript
      setTimeout(() => {
        const previewContainer = document.querySelector('.template-premium-preview');
        if (previewContainer) {
          // Primeiro, corrigir TODOS os textos no header colorido
          const headerElements = previewContainer.querySelectorAll('.relative.p-8 *');
          headerElements.forEach((element: Element) => {
            const htmlElement = element as HTMLElement;
            if (htmlElement.tagName === 'H1' || htmlElement.tagName === 'H2' || 
                htmlElement.tagName === 'DIV' || htmlElement.tagName === 'SPAN' ||
                htmlElement.tagName === 'P' || htmlElement.innerText) {
              htmlElement.style.color = 'white';
            }
          });
          
          // Encontrar todos os elementos com estilos inline de cor
          const elementsWithInlineStyles = previewContainer.querySelectorAll('[style]');
          
          // SALVAR CORES ORIGINAIS PRIMEIRO
          elementsWithInlineStyles.forEach((element: Element) => {
            const htmlElement = element as HTMLElement;
            
            // Salvar valores originais se ainda não foram salvos
            if (!htmlElement.getAttribute('data-original-bg') && htmlElement.style.backgroundColor) {
              htmlElement.setAttribute('data-original-bg', htmlElement.style.backgroundColor);
            }
            if (!htmlElement.getAttribute('data-original-color') && htmlElement.style.color) {
              htmlElement.setAttribute('data-original-color', htmlElement.style.color);
            }
            if (!htmlElement.getAttribute('data-original-border') && htmlElement.style.borderColor) {
              htmlElement.setAttribute('data-original-border', htmlElement.style.borderColor);
            }
          });
          
          // APLICAR CORES CUSTOMIZADAS DE FORMA INTELIGENTE
          elementsWithInlineStyles.forEach((element: Element) => {
            const htmlElement = element as HTMLElement;
            const currentStyle = htmlElement.getAttribute('style') || '';
            const isInHeader = htmlElement.closest('.relative.p-8');
            
            // Sobrescrever cores de fundo APENAS em elementos específicos
            if (currentStyle.includes('backgroundColor') || currentStyle.includes('background-color')) {
              if (isInHeader) {
                // Header principal - sempre cor primary
                htmlElement.style.backgroundColor = selectedColorScheme.primary;
              } else {
                // Fora do header - SER MUITO CONSERVADOR
                const originalBg = htmlElement.getAttribute('data-original-bg') || htmlElement.style.backgroundColor;
                
                // DETECÇÃO ESPECÍFICA POR TEMPLATE
                const isAccentElement = htmlElement.classList.contains('bg-blue-600') || 
                                       htmlElement.classList.contains('bg-teal-600') || 
                                       htmlElement.classList.contains('bg-orange-600') ||
                                       htmlElement.classList.contains('bg-slate-700') ||
                                       htmlElement.classList.contains('bg-pink-200') ||
                                       htmlElement.classList.contains('bg-yellow-200') ||
                                       htmlElement.classList.contains('bg-gradient-to-r') ||
                                       htmlElement.classList.contains('from-slate-800') ||
                                       htmlElement.classList.contains('rounded-full') ||
                                       htmlElement.classList.contains('w-20') ||
                                       htmlElement.classList.contains('w-2') ||
                                       htmlElement.classList.contains('absolute');
                
                if (isAccentElement) {
                  // Aplicar cor inteligente baseada no elemento
                  if (htmlElement.classList.contains('bg-gradient-to-r') || 
                      htmlElement.classList.contains('from-slate-800') ||
                      htmlElement.classList.contains('bg-slate-700')) {
                    // Headers/fundos principais - usar primary
                    htmlElement.style.backgroundColor = selectedColorScheme.primary;
                  } else if (htmlElement.classList.contains('from-yellow-100') || 
                             htmlElement.classList.contains('to-amber-50')) {
                    // ELEGANTE - aplicar degradê pastel sofisticado
                    const gradientToUse = selectedColorScheme.gradient || `linear-gradient(to bottom, ${selectedColorScheme.primary}15, ${selectedColorScheme.secondary}25)`;
                    htmlElement.style.background = gradientToUse;
                    htmlElement.style.backgroundImage = gradientToUse;
                  } else if (htmlElement.classList.contains('from-pink-300') || 
                             htmlElement.classList.contains('to-pink-400') ||
                             htmlElement.classList.contains('bg-gradient-to-b')) {
                    // MINIMALISTA - aplicar degradê pastel mais intenso
                    const gradientToUse = selectedColorScheme.gradient || `linear-gradient(to bottom, ${selectedColorScheme.primary}70, ${selectedColorScheme.secondary}90)`;
                    htmlElement.style.background = gradientToUse;
                    htmlElement.style.backgroundImage = gradientToUse;
                  } else if (htmlElement.classList.contains('bg-pink-200') || 
                             htmlElement.classList.contains('bg-yellow-200')) {
                    // MINIMALISTA - fundos sutis simples
                    htmlElement.style.backgroundColor = selectedColorScheme.primary + '30';
                  } else {
                    // Outros elementos (linhas, badges, balões) - usar secondary
                    htmlElement.style.backgroundColor = selectedColorScheme.secondary;
                  }
                }
                
                // CREATIVE TEMPLATE - balões dos anos (cor mais clara para realçar)
                if (originalBg && originalBg.includes('orange') && 
                    (htmlElement.classList.contains('rounded-full') || 
                     htmlElement.classList.contains('text-xs') ||
                     htmlElement.innerText?.match(/^\d{4}(-\d{2})?$/))) {
                  // Cor mais clara (80% opacidade) para realçar
                  htmlElement.style.backgroundColor = selectedColorScheme.secondary + '80';
                }
                
                // CREATIVE TEMPLATE - balões de habilidades (ainda mais claro)
                if (htmlElement.classList.contains('rounded-full') && 
                    !originalBg?.includes('orange') &&
                    htmlElement.closest('.template-premium-preview')) {
                  // Cor muito clara (40% opacidade) para habilidades
                  htmlElement.style.backgroundColor = selectedColorScheme.primary + '40';
                }
                // NÃO alterar outros fundos (cards, caixas, seções)
              }
            }
            
            // Sobrescrever cores de texto APENAS onde necessário
            if (currentStyle.includes('color:')) {
              // Verificar se está em qualquer fundo colorido (incluindo Tech Template)
              const isInColoredBackground = isInHeader || 
                                          htmlElement.closest('.bg-slate-700') ||
                                          htmlElement.closest('.bg-blue-600') ||
                                          htmlElement.closest('.bg-gradient-to-r') ||
                                          htmlElement.closest('[style*="background-color"]');
              
              // TECH TEMPLATE - forçar branco em elementos com classes específicas
              const isTechElement = htmlElement.classList.contains('text-white') ||
                                  htmlElement.classList.contains('text-4xl') ||
                                  htmlElement.classList.contains('text-2xl') ||
                                  htmlElement.classList.contains('font-bold') ||
                                  htmlElement.tagName === 'H1' ||
                                  htmlElement.tagName === 'H2';
              
              if (isInColoredBackground || isTechElement) {
                // Em fundo colorido, sempre branco para contraste
                htmlElement.style.color = 'white';
              } else {
                // Fora do header, SER MUITO SELETIVO
                const originalColor = htmlElement.getAttribute('data-original-color') || htmlElement.style.color;
                
                // SÓ alterar títulos principais e elementos claramente destacados
                const isHeadingElement = htmlElement.tagName === 'H2' || 
                                        htmlElement.tagName === 'H3' ||
                                        htmlElement.classList.contains('text-orange-600') ||
                                        htmlElement.classList.contains('text-blue-600') ||
                                        htmlElement.classList.contains('text-teal-600') ||
                                        htmlElement.classList.contains('text-amber-800') ||
                                        htmlElement.classList.contains('text-amber-700') ||
                                        htmlElement.classList.contains('text-amber-900') ||
                                        htmlElement.classList.contains('text-amber-600') ||
                                        htmlElement.classList.contains('text-pink-600') ||
                                        htmlElement.classList.contains('text-pink-700') ||
                                        htmlElement.classList.contains('text-pink-800') ||
                                        htmlElement.classList.contains('font-bold');
                
                if (isHeadingElement && originalColor &&
                    !originalColor.includes('rgb(0, 0, 0)') &&
                    !originalColor.includes('#000') &&
                    !originalColor.includes('black')) {
                  // Verificar se o elemento está dentro de um header colorido
                  const isInColoredHeader = htmlElement.closest('.relative.p-8') ||
                                          htmlElement.closest('.bg-slate-700') ||
                                          htmlElement.closest('.bg-blue-600') ||
                                          htmlElement.closest('.bg-teal-600') ||
                                          htmlElement.closest('.bg-gradient-to-r');

                  if (isInColoredHeader) {
                    // Dentro de header colorido - usar texto branco
                    htmlElement.style.color = selectedColorScheme.text;
                  } else {
                    // Fora de header colorido - usar textDark para contraste com fundo branco
                    htmlElement.style.color = selectedColorScheme.textDark || selectedColorScheme.text;
                  }
                }
                // NÃO alterar texto normal de cards/parágrafos
              }
            }
            
            // Sobrescrever cores de borda APENAS em elementos de destaque
            if (currentStyle.includes('border')) {
              // SÓ alterar bordas específicas (linhas decorativas, não bordas de cards)
              const isBorderAccent = htmlElement.classList.contains('border-l-4') ||
                                    htmlElement.classList.contains('border-orange-500') ||
                                    htmlElement.classList.contains('border-blue-600') ||
                                    htmlElement.classList.contains('border-teal-600') ||
                                    currentStyle.includes('borderLeft') ||
                                    currentStyle.includes('border-left');
              
              if (isBorderAccent) {
                htmlElement.style.borderColor = selectedColorScheme.secondary;
              }
              // NÃO alterar bordas de cards/caixas normais
            }
          });
        }
      }, 100);
    }
  }, [fontStyle, fontSize, lineSpacing, selectedColor, hasUserCustomizations]);

  // 🎯 Monitorar conclusão de todas as ações
  useEffect(() => {
    if (completion.isComplete) {
      console.log('✅ Todas as ações completas! Abrindo modal de conclusão');
      setCompletionModalOpen(true);
    }
  }, [completion.isComplete]);

  // 🎯 Handlers do sistema de conclusão
  const handleConfirmClean = () => {
    console.log('🧹 Limpando todos os dados...');

    // Limpar dados do completion tracker
    completion.clear();

    // Limpar TODOS os dados do currículo do localStorage
    try {
      localStorage.removeItem('cvgratis-curriculum');
      localStorage.removeItem('cvgratis-curriculum-finalized');
      localStorage.removeItem('cvgratis-template-config');
      console.log('✅ Dados do currículo removidos do localStorage');

      toast.success('Dados limpos com sucesso! Voltando para página inicial...');
      setCompletionModalOpen(false);

      // Aguardar um pouco e redirecionar
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('❌ Erro ao limpar dados:', error);
      toast.error('Erro ao limpar dados. Tente novamente.');
    }
  };

  const handleReviewAgain = () => {
    console.log('🔄 Usuário quer revisar novamente');
    completion.reset();
    setCompletionModalOpen(false);
    toast.info('Você pode fazer novos downloads e impressões');
  };

  const handleTryToExit = () => {
    if (completion.hasPendingActions) {
      // Tem ações pendentes - mostrar aviso
      setCompletionModalOpen(true);
    } else {
      // Tudo completo, pode sair
      navigate('/');
    }
  };

  // 🎯 Interceptar tentativa de sair da página
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (completion.hasPendingActions) {
        e.preventDefault();
        e.returnValue = 'Você ainda não completou todas as ações (download e impressão). Tem certeza que deseja sair?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [completion.hasPendingActions]);

  const handleBackToEditing = () => {
    // Ir para criar-curriculo com o template premium selecionado mantendo contexto premium
    if (selectedTemplate) {
      // Salvar template selecionado no localStorage para usar na página de criação
      localStorage.setItem('selected-premium-template', JSON.stringify(selectedTemplate));
      // Salvar flag indicando que é sessão premium
      localStorage.setItem('is-premium-session', 'true');
      // Redirecionar para criar-curriculo com parâmetro premium
      navigate(`/criar-curriculo?premium=true&template=${selectedTemplate.id}`);
    }
  };

  // Funções que interceptam ações para verificação
  const handlePrintWithCheck = () => {
    setPendingAction('print');
    setCheckerOpen(true);
  };

  const handleDownloadWithCheck = () => {
    setPendingAction('download');
    setCheckerOpen(true);
  };

  // handleEmailWithCheck removido para simplicidade

  const executePendingAction = () => {
    if (pendingAction === 'print') {
      handlePrint();
    } else if (pendingAction === 'download') {
      handleDownloadPDF();
    }
    setPendingAction(null);
  };

  const handlePrint = () => {
    const previewElement = document.querySelector('.template-premium-preview');
    
    if (previewElement) {
      // Capturar estilos aplicados dinamicamente
      const appliedStyles = document.getElementById('premium-editor-styles');
      const stylesheetContent = appliedStyles ? appliedStyles.innerHTML : '';
      
      // Capturar todos os estilos da página
      const allStyles = Array.from(document.styleSheets)
        .map(styleSheet => {
          try {
            return Array.from(styleSheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n');
          } catch (e) {
            return '';
          }
        })
        .join('\n');
      
      const printWindow = window.open('', '_blank');
      
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Currículo - Impressão</title>
              <meta charset="UTF-8">
              <style>
                /* Reset básico */
                * { 
                  margin: 0; 
                  padding: 0; 
                  box-sizing: border-box;
                  print-color-adjust: exact !important;
                  -webkit-print-color-adjust: exact !important;
                }
                
                body { 
                  font-family: Arial, sans-serif;
                  line-height: 1.4;
                  color: #000;
                  background: white !important;
                  padding: 0;
                  margin: 0;
                }
                
                /* Aplicar todos os estilos da aplicação */
                ${allStyles}
                
                /* Aplicar estilos dinâmicos do editor */
                ${stylesheetContent}
                
                /* Configurações específicas para impressão - PREMIUM SEM TEXTOS EXTRAS */
                @page {
                  margin: 0;
                  size: A4;
                }

                /* Remover cabeçalhos e rodapés padrão do navegador */
                @media print {
                  body::before,
                  body::after {
                    display: none !important;
                  }

                  /* Adicionar margem interna no conteúdo ao invés de margem da página */
                  body {
                    margin: 0 !important;
                    padding: 1cm !important;
                  }
                }

                /* Remover transformações do preview */
                .template-premium-preview {
                  transform: none !important;
                  scale: 1 !important;
                  width: 100% !important;
                  max-width: none !important;
                  height: auto !important;
                  overflow: visible !important;
                }
                
                /* Garantir que cores sejam impressas */
                .bg-blue-600, .bg-slate-700, .bg-teal-600, 
                .bg-gradient-to-b, .bg-gradient-to-r {
                  print-color-adjust: exact !important;
                  -webkit-print-color-adjust: exact !important;
                }
                
                /* Forçar visibilidade */
                * {
                  visibility: visible !important;
                  opacity: 1 !important;
                }
                
                /* Ajustes tipográficos */
                h1, h2, h3 {
                  page-break-after: avoid;
                  color: inherit !important;
                }
                
                p, div, span {
                  orphans: 2;
                  widows: 2;
                }
                
                /* Garantir que grid e flex funcionem */
                .grid {
                  display: grid !important;
                }
                
                .flex {
                  display: flex !important;
                }
              </style>
            </head>
            <body>
              <div class="template-premium-preview">
                ${previewElement.innerHTML}
              </div>
            </body>
          </html>
        `);
        
        printWindow.document.close();
        
        // Aguardar carregar antes de imprimir
        setTimeout(() => {
          printWindow.print();

          // 🎯 Marcar impressão como completa após iniciar impressão
          completion.markPrintComplete();

          setTimeout(() => {
            printWindow.close();
          }, 1000);
        }, 800);

        toast.success('✅ Impressão completa! ' + (completion.state.downloadCompleted ? '' : 'Não esqueça de baixar o PDF'));
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (!selectedTemplate) {
      toast.error('Template não selecionado');
      return;
    }

    try {
      setPendingAction('download');
      toast.loading('Gerando PDF...');

      // Elemento a ser convertido
      const element = document.querySelector('.template-premium-preview') as HTMLElement;
      if (!element) {
        toast.error('Elemento do currículo não encontrado');
        return;
      }

      // Clonar o elemento para não afetar o original
      const clonedElement = element.cloneNode(true) as HTMLElement;
      
      // Configurar o elemento clonado para PDF
      clonedElement.style.width = '210mm'; // Largura A4
      clonedElement.style.height = 'auto';
      clonedElement.style.position = 'absolute';
      clonedElement.style.left = '-9999px';
      clonedElement.style.top = '0';
      clonedElement.style.backgroundColor = 'white';
      clonedElement.style.color = 'black';
      clonedElement.style.fontSize = '12px';
      clonedElement.style.lineHeight = '1.4';
      clonedElement.style.margin = '0';
      clonedElement.style.padding = '0';
      
      // Adicionar ao DOM temporariamente
      document.body.appendChild(clonedElement);

      // Configurações do PDF
      const pdf = new jsPDF.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Margens do PDF
      const marginTop = 20;
      const marginBottom = 20;
      const marginLeft = 20;
      const marginRight = 20;
      
      // Dimensões da página
      const pageWidth = 210;
      const pageHeight = 297;
      const contentWidth = pageWidth - marginLeft - marginRight;
      const contentHeight = pageHeight - marginTop - marginBottom;

      // Renderizar o elemento com html2canvas
      const canvas = await html2canvas.default(clonedElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: clonedElement.scrollWidth,
        height: clonedElement.scrollHeight,
        scrollX: 0,
        scrollY: 0
      });

      // Calcular dimensões
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Calcular número total de páginas
      const totalPages = Math.ceil(imgHeight / contentHeight);
      
      console.log(`📄 PDF: Total de páginas: ${totalPages}`);
      console.log(`📄 PDF: Altura da imagem: ${imgHeight}mm`);
      console.log(`📄 PDF: Altura do conteúdo por página: ${contentHeight}mm`);

      // Adicionar páginas conforme necessário
      for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
        if (pageIndex > 0) {
          pdf.addPage();
        }

        // Calcular posição Y para esta página
        const sourceY = pageIndex * contentHeight;
        const pageContentHeight = Math.min(contentHeight, imgHeight - sourceY);
        
        // Criar canvas temporário para esta página
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        if (tempCtx) {
          // Configurar dimensões do canvas temporário
          tempCanvas.width = canvas.width;
          tempCanvas.height = (pageContentHeight * canvas.width) / imgWidth;
          
          // Desenhar apenas a parte desta página no canvas temporário
          tempCtx.drawImage(
            canvas,
            0, sourceY * (canvas.width / imgWidth), // sourceX, sourceY
            canvas.width, tempCanvas.height, // sourceWidth, sourceHeight
            0, 0, // destX, destY
            tempCanvas.width, tempCanvas.height // destWidth, destHeight
          );
          
          // Converter para imagem
          const pageImgData = tempCanvas.toDataURL('image/png', 1.0);
          
          // Adicionar à página do PDF com margens corretas
          pdf.addImage(
            pageImgData,
            'PNG',
            marginLeft,
            marginTop,
            imgWidth,
            pageContentHeight
          );
          
          console.log(`📄 PDF: Página ${pageIndex + 1} adicionada`);
        }
      }

      // Limpar elemento temporário
      document.body.removeChild(clonedElement);

      // Salvar o PDF
      const fileName = `curriculo-${selectedTemplate.name}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      // 🎯 Marcar download como completo
      completion.markDownloadComplete();

      toast.success('✅ Download completo! ' + (completion.state.printCompleted ? '' : 'Não esqueça de imprimir'));
      console.log('✅ PDF gerado com sucesso:', fileName);
      
    } catch (error) {
      console.error('❌ Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setPendingAction(null);
      toast.dismiss();
    }
  };

  // Funções handleSendEmail e handleSendWhatsApp removidas para simplicidade

  // ===== SISTEMA DE AVALIAÇÃO DINÂMICA DO CURRÍCULO =====

  const analyzeCurriculum = (curriculumData: any) => {
    // DEBUG: Log completo dos dados recebidos
    console.log('🔍 [ANÁLISE] Dados recebidos:', curriculumData);
    console.log('🔍 [ANÁLISE] PersonalInfo:', curriculumData?.personalInfo);
    console.log('🔍 [ANÁLISE] Experience:', curriculumData?.experience);
    console.log('🔍 [ANÁLISE] Education:', curriculumData?.education);
    console.log('🔍 [ANÁLISE] Skills:', curriculumData?.skills);

    // SEMPRE retorna uma avaliação, mesmo com currículo vazio
    if (!curriculumData) {
      console.warn('⚠️ [ANÁLISE] curriculumData está NULL!');
      curriculumData = {
        personalInfo: {},
        objective: '',
        experience: [],
        education: [],
        skills: [],
        languages: [],
        courses: []
      };
    }

    let score = 0;
    let maxScore = 115; // Atualizado: 100 + 15 pontos de critérios avançados de RH
    const issues: string[] = [];
    const strengths: string[] = [];

    // Extrair dados para análise
    const personalInfo = curriculumData.personalInfo || {};

    // CORREÇÃO: objective pode ser string ou objeto { keywords, description }
    const objectiveData = personalInfo?.objective || curriculumData.objective || '';
    const objective = typeof objectiveData === 'string'
      ? objectiveData
      : (objectiveData?.description || '');

    const experiences = curriculumData.experience || [];
    const education = curriculumData.education || [];
    const skills = curriculumData.skills || [];
    const languages = curriculumData.languages || [];

    // PONTUAÇÃO BASE: Incentivo para iniciar (10 pontos)
    // Qualquer currículo com dados iniciados recebe pontos base para evitar 0% absoluto
    const hasAnyData =
      (personalInfo?.fullName || personalInfo?.name || personalInfo?.email || personalInfo?.phone) ||
      objective ||
      experiences.length > 0 ||
      education.length > 0 ||
      skills.length > 0 ||
      languages.length > 0;

    if (hasAnyData) {
      score += 10;
      console.log('✅ [BASE] Pontos iniciais por começar o currículo: +10 pontos');
    }

    // ============================================
    // CRITÉRIOS TÉCNICOS DE AVALIAÇÃO PROFISSIONAL RH
    // ============================================

    // 1. DADOS PESSOAIS OBRIGATÓRIOS (15 pontos) - CRITÉRIO ELIMINATÓRIO
    const fullName = personalInfo?.fullName || personalInfo?.name || '';

    console.log('📋 [CRITÉRIO 1] Nome:', fullName);

    if (fullName && fullName.trim().split(' ').length >= 2) {
      score += 5;
      strengths.push('Nome completo com sobrenome');
    } else if (fullName) {
      score += 2;
      issues.push('Adicione seu sobrenome completo para identificação profissional');
    } else {
      issues.push('❌ CRÍTICO: Nome ausente - recrutadores não conseguirão identificá-lo');
    }

    if (personalInfo?.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
      score += 5;
      strengths.push('Email válido e profissional');
    } else if (personalInfo?.email) {
      score += 2;
      issues.push('Verifique o formato do email (exemplo: nome@email.com)');
    } else {
      issues.push('❌ CRÍTICO: Email ausente - essencial para recrutadores entrarem em contato');
    }

    if (personalInfo?.phone && personalInfo.phone.replace(/\D/g, '').length >= 10) {
      score += 5;
      strengths.push('Telefone válido para contato');
    } else if (personalInfo?.phone) {
      score += 2;
      issues.push('Complete seu telefone com DDD e número completo');
    } else {
      issues.push('❌ CRÍTICO: Telefone ausente - adicione para receber ligações de recrutadores');
    }

    console.log('✅ [CRITÉRIO 1] Pontos dados pessoais:', score, '/', 15);

    // 2. OBJETIVO PROFISSIONAL (10 pontos) - ANÁLISE DE CLAREZA
    console.log('📋 [CRITÉRIO 2] Objetivo:', objective);

    if (objective && objective.trim().length >= 100) {
      score += 10;
      strengths.push('Objetivo profissional claro e detalhado');
    } else if (objective && objective.trim().length >= 50) {
      score += 6;
      issues.push('⚠️ Expanda seu objetivo: mencione cargo desejado, principais qualificações e diferenciais');
    } else if (objective) {
      score += 3;
      issues.push('⚠️ Detalhe seu objetivo: especifique o cargo que busca e suas competências-chave');
    } else {
      issues.push('❌ CRÍTICO: Adicione um objetivo profissional para indicar sua área de interesse');
    }

    console.log('✅ [CRITÉRIO 2] Pontos objetivo:', score - 15, '/', 10);

    // 3. EXPERIÊNCIA PROFISSIONAL (35 pontos) - CRITÉRIO MAIS IMPORTANTE
    console.log('📋 [CRITÉRIO 3] Experiências:', experiences.length);

    // ANÁLISE PROGRESSIVA: Quantidade vs. Qualidade
    if (experiences.length === 0) {
      issues.push('❌ CRÍTICO: Adicione suas experiências profissionais - fundamental para recrutadores avaliarem seu perfil');
    } else if (experiences.length === 1) {
      score += 8;
      issues.push('⚠️ Adicione mais experiências: inclua trabalhos anteriores, estágios ou projetos freelance');
      issues.push('💡 Dica: Profissionais júnior devem ter 2-3 experiências, pleno/sênior 4-6 experiências');
    } else if (experiences.length === 2) {
      score += 12;
      issues.push('⚠️ Continue adicionando: inclua outras experiências relevantes para mostrar sua trajetória completa');
    } else if (experiences.length >= 3 && experiences.length <= 5) {
      score += 18;
      strengths.push(`${experiences.length} experiências - boa demonstração de trajetória profissional`);
    } else if (experiences.length > 5) {
      score += 15;
      strengths.push(`${experiences.length} experiências cadastradas`);
      issues.push('💡 Otimize: foque nas 5-6 experiências mais relevantes para a vaga desejada');
    }

    // ANÁLISE TÉCNICA: Qualidade das descrições (17 pontos)
    let detailedCount = 0;
    let shortCount = 0;
    let emptyCount = 0;

    experiences.forEach((exp, index) => {
      const desc = exp.description || '';
      if (desc.length >= 150) detailedCount++;
      else if (desc.length >= 50) shortCount++;
      else emptyCount++;

      // Log individual
      console.log(`  📄 Exp ${index + 1}: ${exp.position || exp.title || '?'} - ${desc.length} chars`);
    });

    if (experiences.length > 0) {
      const avgQuality = detailedCount / experiences.length;

      if (avgQuality >= 0.8) {
        score += 17;
        strengths.push('Descrições detalhadas e profissionais em todas experiências');
      } else if (avgQuality >= 0.5) {
        score += 12;
        strengths.push('Maioria das experiências bem descritas');
        issues.push('⚠️ Expanda algumas descrições: adicione responsabilidades específicas e resultados alcançados');
      } else if (avgQuality >= 0.3) {
        score += 7;
        issues.push('⚠️ Detalhe suas experiências: descreva responsabilidades, conquistas e resultados mensuráveis');
      } else {
        score += 3;
        issues.push('❌ IMPORTANTE: Adicione descrições detalhadas (mínimo 150 caracteres por experiência)');
      }

      if (emptyCount > 0) {
        issues.push(`❌ Complete ${emptyCount} experiência(s): adicione descrição das atividades e resultados obtidos`);
      }
    }

    console.log('✅ [CRITÉRIO 3] Pontos experiência:', score - 25, '/', 35);

    // 4. EDUCAÇÃO (20 pontos) - FORMAÇÃO ACADÊMICA
    console.log('📋 [CRITÉRIO 4] Educação:', education.length);

    if (education.length === 0) {
      issues.push('⚠️ Adicione sua formação acadêmica: inclua cursos técnicos, graduação ou especializações');
      score += 0;
    } else if (education.length >= 2) {
      score += 12;
      strengths.push(`${education.length} formações acadêmicas - demonstra investimento em educação`);
    } else {
      score += 8;
      strengths.push('Formação acadêmica presente');
    }

    const completeEducation = education.filter(edu =>
      edu.institution && edu.course && (edu.level || edu.degree)
    );

    if (completeEducation.length === education.length && education.length > 0) {
      score += 8;
      strengths.push('Todas as formações com dados completos (instituição, curso, nível)');
    } else if (education.length > 0) {
      score += 4;
      issues.push('⚠️ Complete os dados: adicione instituição, nome do curso e nível de formação');
    }

    console.log('✅ [CRITÉRIO 4] Pontos educação:', score - 60, '/', 20);

    // 5. HABILIDADES (15 pontos) - COMPETÊNCIAS TÉCNICAS
    console.log('📋 [CRITÉRIO 5] Habilidades:', skills.length);

    if (skills.length === 0) {
      issues.push('❌ CRÍTICO: Adicione suas habilidades técnicas e comportamentais - essencial para destacar suas competências');
    } else if (skills.length < 3) {
      score += 3;
      issues.push('⚠️ Adicione mais habilidades: inclua competências técnicas, ferramentas e soft skills (ideal: 6-10)');
    } else if (skills.length >= 3 && skills.length < 5) {
      score += 7;
      issues.push('💡 Expanda suas habilidades: adicione outras competências relevantes para sua área (ideal: 6-10)');
    } else if (skills.length >= 5 && skills.length <= 12) {
      score += 15;
      strengths.push(`${skills.length} habilidades - quantidade adequada para destacar competências`);
    } else {
      score += 12;
      strengths.push(`${skills.length} habilidades cadastradas`);
      issues.push('💡 Otimize: selecione as 8-10 habilidades mais relevantes para seu objetivo profissional');
    }

    console.log('✅ [CRITÉRIO 5] Pontos habilidades:', score - 80, '/', 15);

    // 6. IDIOMAS (5 pontos) - DIFERENCIAL COMPETITIVO
    console.log('📋 [CRITÉRIO 6] Idiomas:', languages.length);

    if (languages.length >= 2) {
      score += 5;
      strengths.push(`${languages.length} idiomas - diferencial competitivo no mercado`);
    } else if (languages.length === 1) {
      score += 2;
      issues.push('💡 Adicione outros idiomas: inglês, espanhol ou outros que você conheça');
    } else {
      issues.push('⚠️ Adicione idiomas: comece pelo português e inclua outros que você domina');
    }

    console.log('✅ [CRITÉRIO 6] Pontos idiomas:', score - 95, '/', 5);

    // ============================================
    // CRITÉRIOS AVANÇADOS DE RH (15 pontos)
    // ============================================

    // 7. OTIMIZAÇÃO ATS (5 pontos) - Applicant Tracking System
    let atsScore = 0;

    // Verifica uso de palavras-chave relevantes
    const allText = [
      objective,
      ...experiences.map(exp => `${exp.position || ''} ${exp.description || ''}`),
      ...skills.map(s => typeof s === 'string' ? s : s.name || ''),
      ...education.map(edu => `${edu.course || ''} ${edu.institution || ''}`)
    ].join(' ').toLowerCase();

    // Palavras-chave profissionais comuns
    const professionalKeywords = ['experiência', 'responsável', 'desenvolvimento', 'gestão', 'análise', 'projeto', 'equipe', 'resultado', 'implementação'];
    const keywordCount = professionalKeywords.filter(keyword => allText.includes(keyword)).length;

    if (keywordCount >= 6) {
      atsScore += 2;
      strengths.push('Bom uso de palavras-chave profissionais');
    } else if (keywordCount >= 3) {
      atsScore += 1;
    } else {
      issues.push('💡 ATS: Use mais palavras-chave profissionais nas descrições (ex: gestão, análise, desenvolvimento)');
    }

    // Verifica estrutura clara de seções
    const hasBasicSections = experiences.length > 0 && education.length > 0 && skills.length > 0;
    if (hasBasicSections) {
      atsScore += 2;
    } else {
      issues.push('💡 ATS: Complete todas as seções básicas (experiência, educação, habilidades) para melhor rastreamento');
    }

    // Verifica presença de informações quantificáveis
    const hasNumbers = /\d+/.test(allText);
    if (hasNumbers) {
      atsScore += 1;
      strengths.push('Presença de dados quantificáveis nas descrições');
    } else {
      issues.push('💡 ATS: Adicione números e métricas (ex: "aumentei vendas em 30%", "gerenciei equipe de 5 pessoas")');
    }

    score += atsScore;
    console.log('✅ [CRITÉRIO 7] Pontos ATS:', atsScore, '/', 5);

    // 8. FORMATAÇÃO E CONSISTÊNCIA (5 pontos)
    let formatScore = 0;

    // Verifica consistência de datas nas experiências
    const experiencesWithDates = experiences.filter(exp => exp.startDate || exp.endDate);
    if (experiencesWithDates.length === experiences.length && experiences.length > 0) {
      formatScore += 2;
      strengths.push('Todas experiências com datas informadas');
    } else if (experiences.length > 0) {
      issues.push('⚠️ Formatação: Adicione datas de início e término em todas as experiências');
    }

    // Verifica consistência nas formações
    const educationWithDates = education.filter(edu => edu.startYear || edu.endYear || edu.year);
    if (educationWithDates.length === education.length && education.length > 0) {
      formatScore += 1;
      strengths.push('Formações com períodos informados');
    } else if (education.length > 0) {
      issues.push('⚠️ Formatação: Adicione anos/períodos em todas as formações');
    }

    // Verifica tamanho adequado do objetivo
    if (objective.length >= 80 && objective.length <= 250) {
      formatScore += 1;
    } else if (objective.length > 250) {
      issues.push('💡 Formatação: Objetivo muito extenso - mantenha entre 80-250 caracteres para melhor leitura');
    }

    // Verifica distribuição equilibrada de conteúdo
    if (experiences.length >= 2 && education.length >= 1 && skills.length >= 5) {
      formatScore += 1;
      strengths.push('Distribuição equilibrada de conteúdo entre seções');
    }

    score += formatScore;
    console.log('✅ [CRITÉRIO 8] Pontos Formatação:', formatScore, '/', 5);

    // 9. PROFISSIONALISMO (5 pontos)
    let professionalismScore = 0;

    // Verifica tom profissional (ausência de gírias e informalidades)
    const informalWords = ['cara', 'galera', 'tipo assim', 'etc', 'coisa', 'legal'];
    const hasInformalWords = informalWords.some(word => allText.includes(word));
    if (!hasInformalWords && allText.length > 100) {
      professionalismScore += 2;
      strengths.push('Tom profissional e formal mantido em todo currículo');
    } else if (hasInformalWords) {
      issues.push('⚠️ Profissionalismo: Evite linguagem informal - use termos técnicos e profissionais');
    }

    // Verifica uso de verbos de ação
    const actionVerbs = ['desenvolvi', 'implementei', 'gerenciei', 'coordenei', 'analisei', 'criei', 'otimizei', 'liderei'];
    const actionVerbCount = actionVerbs.filter(verb => allText.includes(verb)).length;
    if (actionVerbCount >= 3) {
      professionalismScore += 2;
      strengths.push('Bom uso de verbos de ação nas descrições');
    } else if (actionVerbCount >= 1) {
      professionalismScore += 1;
    } else {
      issues.push('💡 Profissionalismo: Use verbos de ação (desenvolvi, implementei, gerenciei, coordenei)');
    }

    // Verifica completude geral do currículo
    const completenessPercentage = ((score + professionalismScore) / maxScore) * 100;
    if (completenessPercentage >= 70) {
      professionalismScore += 1;
    }

    score += professionalismScore;
    console.log('✅ [CRITÉRIO 9] Pontos Profissionalismo:', professionalismScore, '/', 5);

    // PONTUAÇÃO FINAL E CLASSIFICAÇÃO PROGRESSIVA
    const percentage = Math.round((score / maxScore) * 100);

    console.log('═══════════════════════════════════════');
    console.log('🏆 [AVALIAÇÃO FINAL]');
    console.log(`   Pontuação: ${score}/${maxScore} pontos (${percentage}%)`);
    console.log(`   Pontos Fortes: ${strengths.length}`);
    console.log(`   Problemas: ${issues.length}`);
    console.log('═══════════════════════════════════════');

    // Classificação PROGRESSIVA por estrelas (padrão RH profissional atualizado)
    let stars = 1;
    let status = 'Começando';
    let statusColor = 'blue';

    if (percentage >= 90) {
      stars = 5;
      status = 'Excelente';
      statusColor = 'blue';
    } else if (percentage >= 80) {
      stars = 4;
      status = 'Muito Bom';
      statusColor = 'green';
    } else if (percentage >= 65) {
      stars = 3;
      status = 'Bom';
      statusColor = 'teal';
    } else if (percentage >= 50) {
      stars = 2;
      status = 'Regular';
      statusColor = 'yellow';
    } else if (percentage >= 30) {
      stars = 1;
      status = 'Precisa Melhorar';
      statusColor = 'orange';
    } else if (percentage >= 15) {
      stars = 1;
      status = 'Em Desenvolvimento';
      statusColor = 'amber';
    } else {
      stars = 1;
      status = 'Começando';
      statusColor = 'sky';
    }

    console.log(`   Status: ${stars}⭐ - ${status}`);

    return {
      score,
      maxScore,
      percentage,
      stars,
      status,
      statusColor,
      strengths: strengths.slice(0, 8), // Máximo 8 pontos fortes
      issues: issues.slice(0, 8), // Máximo 8 problemas
      curriculumData
    };
  };

  const generateFullReport = async () => {
    setIsGeneratingReport(true);

    try {
      // Analisar currículo (sempre funciona, mesmo com dados vazios)
      const analysis = analyzeCurriculum(curriculumDataFromHook);

      const { curriculumData, percentage, strengths, issues } = analysis;

      // Preparar dados para IA
      const personalInfo = curriculumData.personalInfo || {};
      const experiences = curriculumData.experience || [];
      const education = curriculumData.education || [];
      const skills = curriculumData.skills || [];
      const languages = curriculumData.languages || [];
      const courses = curriculumData.courses || [];
      const objective = curriculumData.objective || '';

      // Construir resumo do currículo para IA
      const fullName = personalInfo.fullName || personalInfo.name || 'Não informado';
      const curriculumSummary = `
DADOS DO CURRÍCULO:

Nome: ${fullName}
Email: ${personalInfo.email || 'Não informado'}
Telefone: ${personalInfo.phone || 'Não informado'}
Localização: ${personalInfo.city || personalInfo.location || 'Não informado'}

Objetivo Profissional: ${objective || 'Não informado'}

Experiências Profissionais (${experiences.length}):
${experiences.map((exp, i) => `${i + 1}. ${exp.position || exp.title || 'Sem cargo'} na ${exp.company || 'Sem empresa'} (${exp.startDate || '?'} - ${exp.endDate || 'Atual'})
   Descrição: ${exp.description || 'Sem descrição'}`).join('\n') || 'Nenhuma experiência cadastrada'}

Formação Acadêmica (${education.length}):
${education.map((edu, i) => `${i + 1}. ${edu.course || 'Sem curso'} - ${edu.institution || 'Sem instituição'} (${edu.level || 'Sem nível'})`).join('\n') || 'Nenhuma formação cadastrada'}

Habilidades (${skills.length}): ${skills.map(s => s.name || s).join(', ') || 'Nenhuma habilidade'}

Idiomas (${languages.length}): ${languages.map(l => `${l.language || l.name} (${l.level || 'N/A'})`).join(', ') || 'Nenhum idioma'}

Cursos/Certificações (${courses.length}): ${courses.map(c => c.name || c).join(', ') || 'Nenhum curso'}

PONTUAÇÃO ATUAL: ${percentage}%

PONTOS FORTES IDENTIFICADOS:
${strengths.map(s => `• ${s}`).join('\n')}

PROBLEMAS IDENTIFICADOS:
${issues.map(i => `• ${i}`).join('\n')}
      `;

      // Prompt para IA
      const prompt = `Você é um Especialista Sênior de RH com 15 anos de experiência em recrutamento e seleção, tendo avaliado mais de 10.000 currículos. Analise o currículo abaixo com rigor profissional e gere um relatório COMPLETO e DETALHADO em português do Brasil.

${curriculumSummary}

Como um profissional de RH experiente, forneça uma análise honesta, precisa e construtiva. Identifique:
- Erros de português, gramática e concordância
- Inconsistências em datas, formatação e informações
- Falta de clareza, objetividade ou detalhamento inadequado
- Pontos que impressionariam positivamente um recrutador
- Aspectos que fariam o currículo ser descartado

Gere o relatório seguindo EXATAMENTE este formato:

🎯 AVALIAÇÃO ESPECIALISTA DE RH - ANÁLISE IA PREMIUM

📊 PONTUAÇÃO GERAL: ${percentage}% (${analysis.stars}/5 ⭐)

🟢 PONTOS FORTES:
[Liste de forma OBJETIVA e ESPECÍFICA os pontos que impressionam positivamente]
• Exemplo: "Nome completo está correto e bem formatado"
• Exemplo: "Descrições de experiência com verbos de ação e resultados quantificados"

🟡 PONTOS DE MELHORIA:
[Liste CLARAMENTE o que precisa ser corrigido ou melhorado]
• Seja específico sobre ONDE está o problema
• Indique exatamente COMO corrigir
• Exemplo: "Objetivo profissional muito genérico - especifique cargo desejado e principais qualificações"

🔴 PONTOS CRÍTICOS (URGENTE):
[Liste problemas GRAVES que impedem o currículo de ser aprovado]
• Erros de português e gramática
• Informações faltantes obrigatórias
• Inconsistências que geram desconfiança

✍️ CORREÇÕES DE PORTUGUÊS E GRAMÁTICA:
[Aponte TODOS os erros encontrados]
• Indique a frase/palavra incorreta
• Forneça a correção adequada
• Exemplo: "Erro: 'responsavel' → Correto: 'responsável' (falta acento)"

🚀 RECOMENDAÇÕES ESTRATÉGICAS:

1. OTIMIZAÇÃO PARA ATS (Applicant Tracking Systems):
   [3 recomendações técnicas específicas para passar pelos sistemas automáticos]

2. ADEQUAÇÃO AO MERCADO:
   [3 sugestões baseadas no perfil e área de atuação do candidato]

3. DIFERENCIAÇÃO COMPETITIVA:
   [3 formas de se destacar dos demais candidatos]

📈 PARECER FINAL DO ESPECIALISTA RH:
[Avaliação profissional honesta sobre as chances reais deste currículo]
• Probabilidade de aprovação em triagem: [X%]
• Principais riscos de eliminação: [lista específica]
• Próximos passos recomendados: [ações concretas e priorizadas]

💡 CONCLUSÃO:
[Feedback construtivo, honesto e motivador baseado na análise real]

---
✨ Análise gerada por Especialista IA Premium em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}

CRITÉRIOS DE ANÁLISE:
- Seja BRUTALMENTE HONESTO sobre erros e problemas
- Aponte TODOS os erros de português encontrados
- Use os dados REAIS do currículo fornecido
- Dê feedback ACIONÁVEL e ESPECÍFICO
- Mantenha tom profissional, mas direto e construtivo
- Priorize o que é CRÍTICO vs. o que é apenas sugestão`;

      // Tentar gerar com IA real
      const aiService = new AIService();
      let report = '';

      try {
        const aiResponse = await aiService.generateText(prompt);
        if (aiResponse && aiResponse.trim().length > 100) {
          report = aiResponse;
          console.log('✅ Relatório gerado com IA');
        } else {
          throw new Error('Resposta da IA muito curta');
        }
      } catch (aiError) {
        console.error('❌ Erro ao gerar com IA, usando fallback:', aiError);

        // Fallback: gerar relatório local detalhado
        report = `🎯 AVALIAÇÃO ESPECIALISTA DE RH - ANÁLISE IA PREMIUM

📊 PONTUAÇÃO GERAL: ${percentage}% (${analysis.stars}/5 ${'⭐'.repeat(analysis.stars)})

🟢 PONTOS FORTES:
${strengths.map(s => `• ${s}`).join('\n') || '• Nenhum ponto forte identificado ainda'}

🟡 PONTOS DE MELHORIA:
${issues.map(i => `• ${i}`).join('\n') || '• Continue melhorando seu currículo'}

🔴 PONTOS CRÍTICOS (URGENTE):
${percentage < 50 ? '• Currículo necessita de preenchimento urgente em várias seções\n• Faltam informações essenciais para avaliação por recrutadores\n• Completude insuficiente para aprovação em processos seletivos' : percentage < 70 ? '• Algumas seções importantes precisam de mais detalhes\n• Revise e complete as informações faltantes\n• Descrições carecem de maior profundidade' : '• Refine detalhes específicos das experiências\n• Quantifique resultados e conquistas quando possível'}

✍️ CORREÇÕES DE PORTUGUÊS E GRAMÁTICA:
${percentage >= 80 ? '• Nenhum erro grave identificado na análise automática\n• Recomenda-se revisão final antes do envio' : '• Realize revisão ortográfica completa\n• Verifique acentuação e concordância\n• Atenção especial para descrições das experiências'}

🚀 RECOMENDAÇÕES ESTRATÉGICAS:

1. OTIMIZAÇÃO PARA ATS (Applicant Tracking Systems):
   • Use palavras-chave específicas da sua área em descrições
   • Mantenha formatação consistente em datas e títulos
   • Evite abreviações não-padrão e símbolos especiais

2. ADEQUAÇÃO AO MERCADO:
   • Adapte o objetivo profissional para cada posição
   • Destaque experiências mais relevantes no topo
   • Use verbos de ação e resultados quantificados

3. DIFERENCIAÇÃO COMPETITIVA:
   • Mantenha LinkedIn atualizado com as mesmas informações
   • Adicione certificações e cursos recentes da área
   • Participe de comunidades profissionais relevantes

📈 PARECER FINAL DO ESPECIALISTA RH:
• Probabilidade de aprovação em triagem: ${percentage >= 85 ? '85-95%' : percentage >= 70 ? '70-85%' : percentage >= 50 ? '50-70%' : '30-50%'}
• Principais riscos: ${percentage < 70 ? 'Incompletude de dados e falta de detalhamento' : 'Necessidade de refinamento em detalhes específicos'}
• Próximos passos: ${percentage < 70 ? 'Complete urgentemente as seções faltantes e detalhe experiências' : 'Refine descrições e adicione conquistas quantificadas'}

💡 CONCLUSÃO:
${percentage >= 85
  ? 'Excelente trabalho! Seu currículo está muito bem estruturado e tem altas chances de impressionar recrutadores. Continue refinando detalhes específicos e mantenha-o sempre atualizado.'
  : percentage >= 70
  ? 'Seu currículo está no caminho certo! Com os ajustes sugeridos acima, você pode atingir um nível de excelência e se destacar no mercado.'
  : percentage >= 50
  ? 'Seu currículo tem uma base sólida, mas precisa de melhorias importantes. Foque nos pontos críticos identificados para aumentar suas chances.'
  : 'Seu currículo precisa de atenção urgente. Complete as informações essenciais e detalhe suas experiências para ter chances reais no mercado.'}

---
✨ Análise gerada por Especialista IA Premium em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`;

        toast.warning('Relatório gerado localmente (IA temporariamente indisponível)');
      }

      setFullReport(report);
      setReportModalOpen(true);

    } catch (error) {
      console.error('❌ Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  if (!selectedTemplate || isCheckingAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4 animate-pulse" />
          <h1 className="text-xl font-bold mb-4">
            {isCheckingAccess ? 'Verificando acesso ao template premium...' : 'Carregando Editor Premium...'}
          </h1>
          <div className="space-y-2 text-sm text-gray-600">
            <p>🔍 Template ID na URL: <strong>{templateId || 'não encontrado'}</strong></p>
            <p>🔗 URL atual: <strong>{window.location.pathname + window.location.search}</strong></p>
            {isCheckingAccess && (
              <div className="mt-4 flex items-center justify-center gap-2 text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Validando compra no servidor...</span>
              </div>
            )}
            <p className="text-xs mt-4">📋 Abra o Console (F12) para mais detalhes</p>
          </div>
        </div>
      </div>
    );
  }


  try {
  return (
    <ErrorBoundary errorType="page">
      <CombinedProvider>
        <style>{`
          /* Barra de rolagem customizada para preview premium */
          .premium-preview-scrollbar::-webkit-scrollbar {
            width: 12px;
          }
          .premium-preview-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 6px;
          }
          .premium-preview-scrollbar::-webkit-scrollbar-thumb {
            background: #94a3b8;
            border-radius: 6px;
            border: 3px solid #f1f5f9;
          }
          .premium-preview-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #64748b;
          }
        `}</style>
        <div className="h-screen bg-gray-50 overflow-hidden flex flex-col">

        {/* 🎯 Badge flutuante de conclusão */}
        <CompletionBadgeWithTooltip
          downloadCompleted={completion.state.downloadCompleted}
          printCompleted={completion.state.printCompleted}
          isComplete={completion.isComplete}
          onClick={() => setCompletionModalOpen(true)}
        />

        {/* Header Fixo */}
        <header className="bg-white shadow-sm border-b flex-shrink-0 z-10">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="default" size="sm" onClick={handleBackToEditing} className="bg-blue-600 hover:bg-blue-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Voltar Edição
                </Button>
                
                <div>
                  <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    Editor Premium
                  </h1>
                  <p className="text-sm text-gray-600">
                    {selectedTemplate.name} - Customização em Tempo Real
                  </p>
                  <div className="mt-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-xs text-blue-700 flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      Template premium adquirido - Configure à vontade suas preferências
                  </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePrintWithCheck}>
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir
                </Button>
                
                <Button variant="outline" size="sm" onClick={handleDownloadWithCheck}>
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>

                {/* Botão de Email removido para simplicidade */}

                {/* Modal de Email removido para simplicidade */}

                {/* Modal de WhatsApp removido para simplicidade */}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Flexível */}
        <div className="flex-1 flex overflow-hidden">
            
          {/* Sidebar Fixa Esquerda - Controles */}
          <div className="w-80 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
            <div className="p-4 space-y-4">
              
              {/* TEXTO */}
              <Card>
                <CardHeader className="pb-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-3 h-auto bg-gray-100"
                    onClick={() => setActiveTab(activeTab === 'texto' ? '' : 'texto')}
                  >
                    <div className="flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      <span className="font-medium">Texto</span>
                    </div>
                  </Button>
                </CardHeader>
                
                {activeTab === 'texto' && (
                  <CardContent className="space-y-6">
                    {/* Estilo */}
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Estilo</label>
                      <Select value={fontStyle} onValueChange={(value) => {
                        setFontStyle(value);
                        setHasUserCustomizations(true);
                      }}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FONT_STYLES.map((style) => (
                            <SelectItem key={style.id} value={style.id}>
                              {style.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tamanho */}
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Tamanho</label>
                      <div className="flex gap-1">
                        {FONT_SIZES.map((size) => (
                          <Button
                            key={size.id}
                            variant={fontSize === size.id ? "default" : "outline"}
                            size="sm"
                            className="flex-1 h-12 flex flex-col items-center justify-center"
                            onClick={() => {
                              setFontSize(size.id);
                              setHasUserCustomizations(true);
                            }}
                          >
                            <span style={{ fontSize: size.id === 'pequeno' ? '12px' : size.id === 'medio' ? '14px' : '16px' }}>
                              {size.name}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Espaçamento */}
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Espaçamento</label>
                      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => {
                            const currentIndex = LINE_SPACINGS.findIndex(l => l.id === lineSpacing);
                            if (currentIndex > 0) {
                              setLineSpacing(LINE_SPACINGS[currentIndex - 1].id);
                              setHasUserCustomizations(true);
                            }
                          }}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        
                        <span className="font-medium text-lg">
                          {LINE_SPACINGS.find(l => l.id === lineSpacing)?.name}
                        </span>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => {
                            const currentIndex = LINE_SPACINGS.findIndex(l => l.id === lineSpacing);
                            if (currentIndex < LINE_SPACINGS.length - 1) {
                              setLineSpacing(LINE_SPACINGS[currentIndex + 1].id);
                              setHasUserCustomizations(true);
                            }
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* COR */}
              <Card>
                <CardHeader className="pb-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-3 h-auto bg-gray-100"
                    onClick={() => setActiveTab(activeTab === 'cor' ? '' : 'cor')}
                  >
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      <span className="font-medium">Cor</span>
                    </div>
                  </Button>
                </CardHeader>
                
                {activeTab === 'cor' && (
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      {COLOR_PALETTE.map((color) => (
                        <div key={color.id} className="flex flex-col items-center gap-1">
                        <button
                            className={`w-12 h-12 rounded-full border-4 transition-all flex items-center justify-center ${
                            selectedColor === color.id 
                              ? 'border-gray-800 scale-110' 
                              : 'border-gray-300 hover:scale-105'
                          }`}
                            style={{ 
                              backgroundColor: color.isOriginal ? '#f3f4f6' : color.primary,
                              backgroundImage: color.isOriginal ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 'none',
                              backgroundSize: color.isOriginal ? '8px 8px' : 'auto',
                              backgroundPosition: color.isOriginal ? '0 0, 0 4px, 4px -4px, -4px 0px' : 'initial'
                            }}
                            onClick={() => {
                              setSelectedColor(color.id);
                              setHasUserCustomizations(true);
                            }}
                          >
                            {color.isOriginal && (
                              <span className="text-xs font-bold text-gray-600">ORIG</span>
                            )}
                          </button>
                          <span className="text-xs text-gray-600 text-center">{color.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* AVALIAÇÃO */}
              <Card>
                <CardHeader className="pb-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-3 h-auto bg-gray-100"
                    onClick={() => setActiveTab(activeTab === 'avaliacao' ? '' : 'avaliacao')}
                  >
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span className="font-medium">Avaliação</span>
                    </div>
                  </Button>
                </CardHeader>

                {activeTab === 'avaliacao' && (() => {
                  // Sempre analisa, mesmo que os dados sejam nulos
                  const analysis = analyzeCurriculum(curriculumDataFromHook);
                  const { stars, status, statusColor, percentage, strengths, issues } = analysis;

                  return (
                    <CardContent className="space-y-4">
                      {/* Nota Geral */}
                      <div className={`text-center p-4 bg-${statusColor}-50 rounded-lg border border-${statusColor}-200`}>
                        <div className="flex items-center justify-center gap-1 mb-2">
                          {[1,2,3,4,5].map((starNum) => (
                            <Star
                              key={starNum}
                              className={`w-5 h-5 ${starNum <= stars ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <h3 className={`font-bold text-lg text-${statusColor}-900`}>{status}</h3>
                        <p className={`text-sm text-${statusColor}-700`}>Pontuação: {percentage}%</p>
                      </div>

                      {/* Pontos Positivos */}
                      {strengths.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-green-700 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Pontos Positivos ({strengths.length})
                          </h4>
                          <ul className="text-sm space-y-1 text-gray-600">
                            {strengths.map((strength, index) => (
                              <li key={index}>• {strength}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Melhorias */}
                      {issues.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-orange-700 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Sugestões de Melhoria ({issues.length})
                          </h4>
                          <ul className="text-sm space-y-1 text-gray-600">
                            {issues.map((issue, index) => (
                              <li key={index}>• {issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <Button
                        onClick={generateFullReport}
                        disabled={isGeneratingReport}
                        className="w-full mt-4"
                        size="sm"
                      >
                        {isGeneratingReport ? (
                          <>
                            <Brain className="w-4 h-4 mr-2 animate-spin" />
                            Analisando com IA...
                          </>
                        ) : (
                          <>
                            <Award className="w-4 h-4 mr-2" />
                            Gerar Relatório Completo com IA
                          </>
                        )}
                      </Button>
                    </CardContent>
                  );
                })()}
              </Card>

              {/* GERADOR DE CARTA DE APRESENTAÇÃO */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    Carta de Apresentação IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-600 mb-3">
                    Gere uma carta de apresentação profissional usando IA com base no seu currículo atual.
                  </p>
                  <Button
                    onClick={() => setCoverLetterOpen(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Gerar Carta
                  </Button>
                </CardContent>
              </Card>

              {/* ASSISTENTE DE CARREIRA - IA ESPECIALISTA EM RH */}
              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-purple-600" />
                    Assistente RH Premium
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-700 mb-3 font-medium">
                    🎯 Converse com nossa IA especializada em:
                  </p>
                  <ul className="text-xs text-gray-600 mb-3 space-y-1">
                    <li>✓ Dúvidas sobre contratação e RH</li>
                    <li>✓ Preparação para entrevistas</li>
                    <li>✓ Dicas de carreira personalizadas</li>
                    <li>✓ Análise de seu perfil profissional</li>
                  </ul>
                  <Button
                    onClick={() => setAiChatOpen(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg py-3 px-4 h-auto whitespace-normal"
                  >
                    <BrainCircuit className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span className="text-sm font-medium">Conversar com Especialista IA</span>
                  </Button>
                </CardContent>
              </Card>

              {/* CAREER AI CHAT */}
              <CareerAIChat
                open={aiChatOpen}
                onOpenChange={setAiChatOpen}
              />

            </div>
            </div>

          {/* Área do Preview Scrollável */}
          <div className="flex-1 flex flex-col bg-gray-50">
            {/* Header do Preview */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Preview - Mudanças Aplicadas Automaticamente</h2>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium bg-green-50 px-3 py-1 rounded-full border border-green-200 text-green-700">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        Aplicando formatação em tempo real
                </div>
                      </div>
                    </div>
                    
            {/* Preview Scrollável */}
            <div
              className="flex-1 overflow-y-auto px-6 py-6 premium-preview-scrollbar"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#94a3b8 #f1f5f9'
              }}
            >
              <div className="flex justify-center">
                <div className="transform scale-90 origin-top border rounded bg-white shadow-lg max-w-4xl">
                  {selectedTemplate ? (
                    <TemplateErrorBoundary templateName={selectedTemplate.name}>
                      <TemplateRenderer
                        template={selectedTemplate}
                        forExport={true}
                        className="template-premium-preview"
                      />
                    </TemplateErrorBoundary>
                  ) : (
                    <div className="flex items-center justify-center h-96 text-gray-500">
                      <div className="text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p>Carregando template...</p>
                    </div>
                  </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verificador de Currículo - REATIVADO */}
        {pendingAction && (
          <CurriculumCheckerWrapper
            open={checkerOpen}
            onOpenChange={setCheckerOpen}
            onContinueAction={executePendingAction}
            actionType={pendingAction}
          />
        )}

        {/* Modal Relatório Completo */}
        <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-blue-500" />
                Relatório Completo de Análise - IA Premium
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border">
                <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">
                  {fullReport}
                </pre>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => {
                  navigator.clipboard.writeText(fullReport);
                  toast.success('Relatório copiado para área de transferência!');
                }} variant="outline" className="flex-1">
                  📋 Copiar Relatório
                </Button>
                <Button onClick={() => {
                  const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(fullReport);
                  const downloadAnchorNode = document.createElement('a');
                  downloadAnchorNode.setAttribute("href", dataStr);
                  downloadAnchorNode.setAttribute("download", "relatorio-curriculo-ia.txt");
                  document.body.appendChild(downloadAnchorNode);
                  downloadAnchorNode.click();
                  downloadAnchorNode.remove();
                  toast.success('Relatório baixado!');
                }} variant="outline" className="flex-1">
                  💾 Baixar Relatório
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* GERADOR DE CARTA DE APRESENTAÇÃO */}
        <CoverLetterGeneratorWrapper
          open={coverLetterOpen}
          onOpenChange={setCoverLetterOpen}
        />

        {/* Modal de Aviso de Saída */}
        <Dialog open={exitWarningOpen} onOpenChange={setExitWarningOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="w-6 h-6" />
                ⚠️ Aviso Importante
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <p className="text-orange-800 text-sm leading-relaxed">
                  <strong>Não há sistema de login!</strong> Se você sair desta página sem baixar o PDF, 
                  perderá acesso ao template premium e precisará pagar novamente.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800">Recomendamos:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Download className="w-4 h-4 text-blue-500" />
                    <span>Baixar o currículo em PDF</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Printer className="w-4 h-4 text-green-500" />
                    <span>Imprimir o currículo</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4 text-purple-500" />
                    <span>Gerar carta de apresentação</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setExitWarningOpen(false)}
                className="flex-1"
              >
                Continuar Editando
              </Button>
              <Button 
                onClick={() => {
                  setExitWarningOpen(false);
                  handleDownloadWithCheck();
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 🎯 Modal de conclusão */}
        <CompletionModal
          open={completionModalOpen}
          onOpenChange={setCompletionModalOpen}
          completedActions={completion.completedActions}
          pendingActions={completion.pendingActions}
          isComplete={completion.isComplete}
          onConfirmClean={handleConfirmClean}
          onReview={handleReviewAgain}
          onContinue={() => setCompletionModalOpen(false)}
        />

            </div>
      </CombinedProvider>
    </ErrorBoundary>
  );
  } catch (error) {
    console.error('🚨 RENDER: Erro fatal na renderização:', error);
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4 text-red-600">Erro no Editor Premium</h1>
          <p className="text-red-700 mb-4">Ocorreu um erro durante o carregamento.</p>
          <pre className="text-xs text-gray-600 bg-white p-4 rounded border">
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Recarregar Página
          </button>
          </div>
      </div>
  );
  }
} 
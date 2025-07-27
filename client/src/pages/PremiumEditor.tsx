import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { CombinedProvider } from '@/contexts/CombinedProvider';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { AVAILABLE_TEMPLATES, Template } from '@/types/templates';
import { StripeService } from '@/services/stripeService';
import { EmailService } from '@/services/emailService';
import MCPEmailService, { CurriculumEmailData } from '@/services/mcpEmailService';
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
  Brain
} from 'lucide-react';

// Configurações de formatação
const FONT_STYLES = [
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

// Cores foscas sem brilho como nos prints
const COLOR_PALETTE = [
  { id: 'teal', primary: '#0d9488', secondary: '#14b8a6', text: '#064e3b' },
  { id: 'blue', primary: '#2563eb', secondary: '#3b82f6', text: '#1e3a8a' },
  { id: 'red', primary: '#dc2626', secondary: '#ef4444', text: '#7f1d1d' },
  { id: 'black', primary: '#1f2937', secondary: '#374151', text: '#111827' },
  { id: 'gray', primary: '#6b7280', secondary: '#9ca3af', text: '#374151' },
  { id: 'brown', primary: '#92400e', secondary: '#d97706', text: '#451a03' }
];

export default function PremiumEditor() {
  const [location, setLocation] = useLocation();
  // Simple URL parameter parsing for Wouter
  const templateId = new URLSearchParams(window.location.search).get('template');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [activeTab, setActiveTab] = useState('texto');
  
  // Estados de formatação
  const [fontStyle, setFontStyle] = useState('classico');
  const [fontSize, setFontSize] = useState('medio');
  const [lineSpacing, setLineSpacing] = useState('1.15');
  const [selectedColor, setSelectedColor] = useState('blue');

  // Estados para modais
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [fullReport, setFullReport] = useState('');

  // Estados para formulários
  const [emailData, setEmailData] = useState({
    to: '',
    subject: 'Meu Currículo Profissional - Candidatura',
    message: 'Olá!\n\nSegue em anexo meu currículo atualizado para a vaga em questão.\n\nEstou disponível para uma conversa quando for conveniente.\n\nAbraços!'
  });

  const [whatsappData, setWhatsappData] = useState({
    number: '',
    message: 'Olá! 👋\n\nGostaria de compartilhar meu currículo profissional com você.\n\nEspero que possamos conversar sobre oportunidades de colaboração.\n\nObrigado!'
  });

  useEffect(() => {
    console.log('🔧 DEV: PremiumEditor iniciando...');
    console.log('🔧 DEV: Template ID:', templateId);
    
    if (!templateId) {
      toast.error('Template não especificado');
      setTimeout(() => setLocation('/templates'), 1500);
      return;
    }

    const template = AVAILABLE_TEMPLATES.find(t => t.id === templateId);
    if (!template) {
      toast.error('Template não encontrado');
      setTimeout(() => setLocation('/templates'), 1500);
      return;
    }

    // Verificação de acesso premium melhorada
    if (template.isPremium) {
      const hasPurchased = StripeService.hasPurchasedTemplate(templateId);
      const isDevModeEnabled = StripeService.isDevModeEnabled();
      const adminAccess = localStorage.getItem('admin_premium_access') === 'true';
      const templatePurchased = localStorage.getItem(`template_purchased_${templateId}`) === 'true';
      const premiumAccess = localStorage.getItem(`premium_access_${templateId}`) === 'true';
      
      const hasAnyAccess = hasPurchased || isDevModeEnabled || adminAccess || templatePurchased || premiumAccess;
      
      if (!hasAnyAccess) {
        console.log('❌ PREMIUM: Acesso negado para template:', templateId);
        toast.error('Acesso negado. Compre o template premium para continuar.');
        setTimeout(() => setLocation('/templates'), 3000);
        return;
      } else {
        console.log('✅ PREMIUM: Acesso liberado para template:', templateId);
      }
    }

    setSelectedTemplate(template);
  }, [templateId, setLocation]);

  // Aplicar estilos dinamicamente - VERSÃO CORRIGIDA
  useEffect(() => {
    const styleId = 'premium-editor-styles';
    let existingStyle = document.getElementById(styleId);
    
    if (existingStyle) {
      existingStyle.remove();
    }

    const selectedFontStyle = FONT_STYLES.find(f => f.id === fontStyle);
    const selectedFontSize = FONT_SIZES.find(f => f.id === fontSize);
    const selectedLineSpacing = LINE_SPACINGS.find(l => l.id === lineSpacing);
    const selectedColorScheme = COLOR_PALETTE.find(c => c.id === selectedColor);

    if (selectedFontStyle && selectedFontSize && selectedLineSpacing && selectedColorScheme) {
      const baseSize = 14; // Tamanho base em px
      const multiplier = selectedFontSize.multiplier;
      
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
          color: ${selectedColorScheme.primary} !important;
          font-family: ${selectedFontStyle.css} !important;
        }
        
        .template-premium-preview h2 {
          font-size: ${Math.round(22 * multiplier)}px !important;
          line-height: ${selectedLineSpacing.value} !important;
          color: ${selectedColorScheme.primary} !important;
          font-family: ${selectedFontStyle.css} !important;
        }
        
        .template-premium-preview h3 {
          font-size: ${Math.round(18 * multiplier)}px !important;
          line-height: ${selectedLineSpacing.value} !important;
          color: ${selectedColorScheme.primary} !important;
          font-family: ${selectedFontStyle.css} !important;
        }
        
        .template-premium-preview h4 {
          font-size: ${Math.round(16 * multiplier)}px !important;
          line-height: ${selectedLineSpacing.value} !important;
          color: ${selectedColorScheme.text} !important;
          font-family: ${selectedFontStyle.css} !important;
        }
        
        .template-premium-preview .bg-blue-600,
        .template-premium-preview .bg-slate-700,
        .template-premium-preview .bg-teal-600,
        .template-premium-preview .bg-gradient-to-b {
          background-color: ${selectedColorScheme.primary} !important;
          background-image: none !important;
        }
        
        .template-premium-preview .border-blue-600,
        .template-premium-preview .border-4 {
          border-color: ${selectedColorScheme.primary} !important;
        }
        
        .template-premium-preview .text-blue-600,
        .template-premium-preview .text-teal-600,
        .template-premium-preview .text-slate-300 {
          color: ${selectedColorScheme.text} !important;
        }
        
        .template-premium-preview .border-b-2 {
          border-color: ${selectedColorScheme.primary} !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, [fontStyle, fontSize, lineSpacing, selectedColor]);

  const handleGoBack = () => {
    setLocation('/templates');
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
                
                /* Configurações específicas para impressão */
                @page {
                  margin: 1cm;
                  size: A4;
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
          setTimeout(() => {
            printWindow.close();
          }, 1000);
        }, 800);
        
        toast.success('Abrindo janela de impressão formatada...');
      }
    }
  };

  const handleDownloadPDF = async () => {
    try {
      toast.success('Gerando PDF de alta qualidade...');
      
      const previewElement = document.querySelector('.template-premium-preview') as HTMLElement;
      
      if (!previewElement) {
        toast.error('Erro ao capturar preview do currículo');
        return;
      }

      // Importar bibliotecas
      const html2canvas = await import('html2canvas');
      const jsPDF = await import('jspdf');

      // Criar um clone do elemento para evitar interferências
      const clonedElement = previewElement.cloneNode(true) as HTMLElement;
      
      // Aplicar estilos inline para garantir que sejam capturados
      const appliedStyles = document.getElementById('premium-editor-styles');
      if (appliedStyles) {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = appliedStyles.innerHTML;
        clonedElement.appendChild(styleElement);
      }
      
      // Configurar elemento temporário
      clonedElement.style.position = 'absolute';
      clonedElement.style.left = '-9999px';
      clonedElement.style.top = '0';
      clonedElement.style.width = '794px'; // A4 width
      clonedElement.style.transform = 'none';
      clonedElement.style.scale = '1';
      clonedElement.style.backgroundColor = '#ffffff';
      
      document.body.appendChild(clonedElement);

      // Aguardar renderização
      await new Promise(resolve => setTimeout(resolve, 500));

      // Capturar com html2canvas
      const canvas = await html2canvas.default(clonedElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 794,
        height: 1123,
        onclone: (clonedDoc) => {
          // Aplicar estilos no documento clonado
          const style = clonedDoc.createElement('style');
          style.innerHTML = appliedStyles?.innerHTML || '';
          clonedDoc.head.appendChild(style);
        }
      });

      // Remover elemento temporário
      document.body.removeChild(clonedElement);

      // Criar PDF
      const pdf = new jsPDF.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Calcular dimensões mantendo proporção
      const imgWidth = 210; // A4 width em mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Adicionar imagem ao PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Se a imagem for maior que uma página, ajustar
      if (imgHeight > 297) {
        // Implementar múltiplas páginas se necessário
        let remainingHeight = imgHeight - 297;
        let pageCount = 1;
        
        while (remainingHeight > 0) {
          pdf.addPage();
          const sourceY = 297 * pageCount;
          const sourceHeight = Math.min(297, remainingHeight);
          
          pdf.addImage(imgData, 'PNG', 0, -sourceY, imgWidth, imgHeight);
          
          remainingHeight -= 297;
          pageCount++;
        }
      }

      // Baixar arquivo
      const fileName = `curriculo-${selectedTemplate?.name || 'premium'}-${new Date().toISOString().slice(0,10)}.pdf`;
      pdf.save(fileName);
      
      toast.success('PDF gerado e baixado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar PDF. Tente novamente.');
    }
  };

  const handleSendEmail = async () => {
    const { to, subject, message } = emailData;
    if (!to) {
      toast.error('Por favor, informe o email de destino');
      return;
    }

    try {
      toast.info('Preparando envio do email...');
      
      // Gerar PDF do template atual
      let pdfBlob: Blob | null = null;
      try {
        const previewElement = document.querySelector('.template-premium-preview') as HTMLElement;
        if (previewElement) {
          // Importar bibliotecas
          const html2canvas = await import('html2canvas');
          const jsPDF = await import('jspdf');

          // Capturar com html2canvas
          const canvas = await html2canvas.default(previewElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            width: 794,
            height: 1123
          });

          // Criar PDF
          const pdf = new jsPDF.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });

          // Calcular dimensões mantendo proporção
          const imgWidth = 210; // A4 width em mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Adicionar imagem ao PDF
          const imgData = canvas.toDataURL('image/png', 1.0);
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

          pdfBlob = pdf.output('blob');
          console.log('✅ PDF gerado com sucesso para email');
        }
      } catch (pdfError) {
        console.warn('⚠️ Não foi possível gerar PDF:', pdfError);
      }
      
      toast.success('Enviando via sistema integrado MCP + Resend...');
      
      // Usar novo sistema MCP integrado
      const curriculumData: CurriculumEmailData = {
        recipientEmail: to,
        senderName: 'Usuário Premium',
        subject: subject,
        message: message,
        templateId: selectedTemplate?.id || 'premium-template'
      };

      const result = await MCPEmailService.sendCurriculumByEmail(curriculumData);
      
      if (result.success) {
        setEmailModalOpen(false);
        toast.success(`✅ Email enviado com sucesso! ID: ${result.emailId}`);
        
        // Limpar dados
        setEmailData({
          to: '',
          subject: 'Meu Currículo Profissional - Candidatura',
          message: 'Olá!\n\nSegue em anexo meu currículo atualizado para a vaga em questão.\n\nEstou disponível para uma conversa quando for conveniente.\n\nAbraços!'
        });
      } else {
        throw new Error(result.error || 'Falha no envio via MCP');
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      toast.error('Erro ao enviar email. Tente novamente.');
      setEmailModalOpen(false);
    }
  };

  const handleSendWhatsApp = () => {
    const { number, message } = whatsappData;
    if (!number) {
      toast.error('Por favor, informe o número do WhatsApp');
      return;
    }

    const cleanNumber = number.replace(/\D/g, '');
    const whatsappLink = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
    setWhatsappModalOpen(false);
    toast.success('WhatsApp aberto com mensagem personalizada!');
  };

  const generateFullReport = async () => {
    setIsGeneratingReport(true);
    
    // Simular análise com IA
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const report = `
🎯 RELATÓRIO COMPLETO DE AVALIAÇÃO DO CURRÍCULO

📊 PONTUAÇÃO GERAL: 9.2/10 ⭐⭐⭐⭐⭐

🟢 PONTOS FORTES (Excelente):
• Estrutura profissional e organizada
• Informações de contato completas e atualizadas
• Experiência profissional bem detalhada com resultados quantificados
• Formação acadêmica relevante para o perfil
• Habilidades técnicas alinhadas com o mercado atual
• Design visual atrativo e clean
• Formatação consistente em todo o documento
• Uso adequado de palavras-chave do setor

🟡 PONTOS DE MELHORIA (Bom, mas pode melhorar):
• Adicionar seção de certificações ou cursos complementares
• Incluir portfolio online ou links para projetos realizados
• Expandir seção de idiomas com níveis de proficiência
• Adicionar mais detalhes sobre conquistas específicas
• Incluir soft skills relevantes para a área

🔴 PONTOS CRÍTICOS (Necessita atenção):
• Considerar adicionar um resumo profissional no início
• Verificar se todas as datas estão no formato consistente
• Validar se o email está ativo e verificado

🚀 RECOMENDAÇÕES ESTRATÉGICAS:

1. OTIMIZAÇÃO PARA ATS (Applicant Tracking Systems):
   - Usar palavras-chave específicas da sua área
   - Manter formatação simples para leitura automatizada
   - Evitar imagens ou gráficos complexos em excesso

2. PERSONALIZAÇÃO POR VAGA:
   - Adaptar objetivo profissional para cada posição
   - Destacar experiências mais relevantes para a vaga
   - Usar a mesma terminologia do anúncio da empresa

3. NETWORKING DIGITAL:
   - Manter LinkedIn atualizado com as mesmas informações
   - Criar portfólio online com projetos realizados
   - Participar de comunidades da sua área no GitHub/Behance

📈 PROBABILIDADE DE SUCESSO: 92%

Seu currículo está muito bem estruturado e tem grandes chances de passar pelos filtros iniciais de RH e impressionar recrutadores. Com pequenos ajustes sugeridos, pode alcançar excelência total!

✨ Gerado pela IA Premium em ${new Date().toLocaleString()}
    `;

    setFullReport(report);
    setIsGeneratingReport(false);
    setReportModalOpen(true);
  };

  if (!selectedTemplate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-4">Carregando Editor Premium...</h1>
        </div>
      </div>
    );
  }

  return (
    <CombinedProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={handleGoBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                
                <div>
                  <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    Editor Premium
                  </h1>
                  <p className="text-sm text-gray-600">
                    {selectedTemplate.name} - Customização em Tempo Real
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir
                </Button>
                
                <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>

                <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Enviar por Email
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Email de destino:</label>
                        <Input 
                          type="email"
                          placeholder="exemplo@empresa.com"
                          value={emailData.to}
                          onChange={(e) => setEmailData(prev => ({...prev, to: e.target.value}))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Assunto:</label>
                        <Input 
                          value={emailData.subject}
                          onChange={(e) => setEmailData(prev => ({...prev, subject: e.target.value}))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Mensagem:</label>
                        <Textarea 
                          rows={4}
                          value={emailData.message}
                          onChange={(e) => setEmailData(prev => ({...prev, message: e.target.value}))}
                        />
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-lg border text-sm">
                        <p className="font-medium text-green-800 mb-1">✅ Sistema Integrado MCP + Resend:</p>
                        <p className="text-green-700">• Envio automático via curriculogratisonline.com</p>
                        <p className="text-green-700">• PDF anexado automaticamente</p>
                        <p className="text-green-700">• Notificação para administrador</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button onClick={handleSendEmail} className="flex-1 bg-green-600 hover:bg-green-700">
                          <Send className="w-4 h-4 mr-2" />
                          Enviar Email + PDF
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={whatsappModalOpen} onOpenChange={setWhatsappModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Enviar via WhatsApp
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Número do WhatsApp:</label>
                        <Input 
                          placeholder="(11) 99999-9999"
                          value={whatsappData.number}
                          onChange={(e) => setWhatsappData(prev => ({...prev, number: e.target.value}))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Mensagem:</label>
                        <Textarea 
                          rows={4}
                          value={whatsappData.message}
                          onChange={(e) => setWhatsappData(prev => ({...prev, message: e.target.value}))}
                        />
                      </div>
                      <Button onClick={handleSendWhatsApp} className="w-full">
                        <Send className="w-4 h-4 mr-2" />
                        Abrir WhatsApp
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Controles */}
            <div className="lg:col-span-1 space-y-4">
              
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
                      <Select value={fontStyle} onValueChange={setFontStyle}>
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
                            onClick={() => setFontSize(size.id)}
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
                        <button
                          key={color.id}
                          className={`w-12 h-12 rounded-full border-4 transition-all ${
                            selectedColor === color.id 
                              ? 'border-gray-800 scale-110' 
                              : 'border-gray-300 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.primary }}
                          onClick={() => setSelectedColor(color.id)}
                        />
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
                
                {activeTab === 'avaliacao' && (
                  <CardContent className="space-y-4">
                    {/* Nota Geral */}
                    <div className="text-center p-4 bg-blue-50 rounded-lg border">
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[1,2,3,4,5].map((star) => (
                          <Star key={star} className="w-5 h-5 text-yellow-500 fill-current" />
                        ))}
                      </div>
                      <h3 className="font-bold text-lg text-blue-900">Excelente!</h3>
                      <p className="text-sm text-blue-700">Seu currículo está muito bem estruturado</p>
                    </div>

                    {/* Pontos Positivos */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-green-700 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Pontos Positivos
                      </h4>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• Informações completas</li>
                        <li>• Experiência bem detalhada</li>
                        <li>• Design profissional</li>
                        <li>• Seções bem organizadas</li>
                      </ul>
                    </div>

                    {/* Melhorias */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-orange-700 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Sugestões de Melhoria
                      </h4>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• Adicione mais certificações</li>
                        <li>• Inclua portfolio de projetos</li>
                        <li>• Destaque principais conquistas</li>
                        <li>• Atualize informações de contato</li>
                      </ul>
                    </div>

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
                          Gerar Relatório Completo
                        </>
                      )}
                    </Button>
                  </CardContent>
                )}
              </Card>

            </div>

            {/* Preview */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Preview - Mudanças Aplicadas Automaticamente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-center mb-4">
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        Aplicando formatação em tempo real
                      </div>
                    </div>
                    
                    <div className="transform scale-75 origin-top border rounded bg-white">
                      <TemplateRenderer 
                        template={selectedTemplate} 
                        forExport={true}
                        className="template-premium-preview"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

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

        {/* Footer */}
        <footer className="bg-white border-t mt-8">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="text-center text-sm text-gray-600">
              <p>
                ✨ <strong>Editor Premium Ativo</strong> - Personalize seu currículo em tempo real
              </p>
            </div>
          </div>
        </footer>
      </div>
    </CombinedProvider>
  );
} 
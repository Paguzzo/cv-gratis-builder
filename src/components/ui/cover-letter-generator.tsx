import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Loader2,
  Download,
  Copy,
  Sparkles,
  Building,
  Briefcase,
  Mail
} from "lucide-react";
import { toast } from 'sonner';
import { useCurriculum } from '@/contexts/CurriculumContext';
import { AIService } from '@/services/aiService';

interface CoverLetterForm {
  companyName: string;
  position: string;
  jobDescription: string;
}

interface CoverLetterGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  curriculumData?: any;
}

export function CoverLetterGenerator({ open, onOpenChange, curriculumData }: CoverLetterGeneratorProps) {
  const { state: curriculumState } = useCurriculum();
  const [formData, setFormData] = useState<CoverLetterForm>({
    companyName: '',
    position: '',
    jobDescription: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');

  const handleInputChange = (field: keyof CoverLetterForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateCoverLetter = async () => {
    if (!formData.companyName || !formData.position) {
      toast.error('Preencha pelo menos empresa e cargo');
      return;
    }

    setIsGenerating(true);

    try {
      // Buscar dados do currículo de TODAS as fontes possíveis
      let cvData = curriculumState?.data || curriculumData || {};

      // Se não houver dados, buscar do localStorage diretamente
      if (!cvData.personalInfo || !cvData.personalInfo.name) {
        const savedData = localStorage.getItem('cvgratis-curriculum-data');
        const finalizedData = localStorage.getItem('cvgratis-curriculum-finalized');

        if (savedData) {
          try {
            cvData = JSON.parse(savedData);
          } catch (e) {
            console.error('Erro ao parsear dados do localStorage:', e);
          }
        } else if (finalizedData) {
          try {
            cvData = JSON.parse(finalizedData);
          } catch (e) {
            console.error('Erro ao parsear dados finalizados:', e);
          }
        }
      }

      const experiences = cvData.experience || [];
      const skills = cvData.skills || [];
      const personalInfo = cvData.personalInfo || {};
      const objective = cvData.objective || '';

      // Verificar se há dados mínimos do currículo
      if (!personalInfo.name && !objective && experiences.length === 0 && skills.length === 0) {
        toast.error('Nenhum dado de currículo encontrado. Crie ou edite seu currículo primeiro em "Criar Currículo".');
        setIsGenerating(false);
        return;
      }

      // Construir contexto do currículo completo
      const experiencesSummary = experiences
        .map(exp => `${exp.title || 'Cargo'} na ${exp.company || 'Empresa'}: ${exp.description || 'Descrição não informada'}`)
        .join('\n');

      const skillsSummary = skills.join(', ');

      // Construir perfil completo do candidato para o prompt com TODOS os dados
      const candidateProfile = `DADOS PESSOAIS:
Nome: ${personalInfo.name || 'Nome não informado'}
Email: ${personalInfo.email || 'Email não informado'}
Telefone: ${personalInfo.phone || 'Telefone não informado'}
Cidade/Estado: ${personalInfo.location || 'Localização não informada'}

OBJETIVO PROFISSIONAL:
${objective || 'Objetivo profissional não informado'}

EXPERIÊNCIAS PROFISSIONAIS:
${experiencesSummary || 'Nenhuma experiência profissional informada'}

HABILIDADES TÉCNICAS:
${skillsSummary || 'Habilidades não informadas'}

EDUCAÇÃO:
${cvData.education?.map(edu => `${edu.degree || 'Formação'} em ${edu.institution || 'Instituição'} (${edu.year || 'Ano'})`).join('\n') || 'Educação não informada'}`;

      // Usar o método estático correto da AIService que está preparado para cover_letter
      const response = await AIService.generateText(
        'cover_letter',
        candidateProfile,
        formData.jobDescription || 'Sem descrição adicional',
        formData.position,
        formData.companyName,
        new Date().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })
      );

      // Verificar se a resposta é válida
      if (response && typeof response === 'string' && response.trim().length > 100) {
        setGeneratedLetter(response);
        toast.success('Carta gerada com sucesso! 🎉');
      } else {
        throw new Error('Resposta da IA muito curta ou vazia');
      }
    } catch (error) {
      console.error('Erro ao gerar carta:', error);

      // Usar fallback em caso de erro - buscar dados do localStorage se necessário
      let cvData = curriculumState?.data || curriculumData || {};

      if (!cvData.personalInfo || !cvData.personalInfo.name) {
        const savedData = localStorage.getItem('cvgratis-curriculum-data');
        const finalizedData = localStorage.getItem('cvgratis-curriculum-finalized');

        if (savedData) {
          try {
            cvData = JSON.parse(savedData);
          } catch (e) {
            console.error('Erro ao parsear dados do localStorage:', e);
          }
        } else if (finalizedData) {
          try {
            cvData = JSON.parse(finalizedData);
          } catch (e) {
            console.error('Erro ao parsear dados finalizados:', e);
          }
        }
      }

      const fallbackLetter = generateFallbackLetter(formData, cvData);
      setGeneratedLetter(fallbackLetter);
      toast.warning('Carta gerada com template local');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast.success('Carta copiada para área de transferência!');
  };

  const downloadAsText = () => {
    const blob = new Blob([generatedLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `carta-apresentacao-${formData.companyName.toLowerCase().replace(/\s+/g, '-')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Carta baixada!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-green-600" />
            Gerador de Carta de Apresentação com IA
          </DialogTitle>
        </DialogHeader>
        <div className="pt-4">
        <div className="space-y-6">
          {/* Aviso sobre ter currículo criado */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <p className="font-medium">💡 Dica importante:</p>
            <p className="mt-1">Para gerar uma carta personalizada com seus dados, certifique-se de ter criado ou editado seu currículo em <strong>"Criar Currículo"</strong> antes.</p>
          </div>

          {/* Formulário */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="companyName" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Nome da Empresa *
              </Label>
              <Input
                id="companyName"
                placeholder="Ex: Google Brasil"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="position" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Cargo Desejado *
              </Label>
              <Input
                id="position"
                placeholder="Ex: Desenvolvedor Full Stack"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="jobDescription" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Descrição da Vaga (opcional)
              </Label>
              <Textarea
                id="jobDescription"
                placeholder="Cole aqui a descrição da vaga para uma carta mais personalizada..."
                rows={4}
                value={formData.jobDescription}
                onChange={(e) => handleInputChange('jobDescription', e.target.value)}
              />
            </div>
          </div>

          {/* Botão de Gerar */}
          <Button
            onClick={generateCoverLetter}
            disabled={isGenerating || !formData.companyName || !formData.position}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
            type="button"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Gerando Carta...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Gerar Carta com IA
              </>
            )}
          </Button>

          {/* Carta Gerada */}
          {generatedLetter ? (
            <div className="space-y-4">
              <div className="border rounded-lg p-6 bg-white">
                <div className="whitespace-pre-wrap text-sm font-serif">
                  {generatedLetter}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </Button>
                <Button
                  onClick={downloadAsText}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar .txt
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-400 text-center p-4 border border-dashed rounded">
              {isGenerating ? '⏳ Aguardando geração...' : 'A carta aparecerá aqui após gerar'}
            </div>
          )}
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Função de fallback para gerar carta localmente usando DADOS REAIS do currículo
function generateFallbackLetter(formData: CoverLetterForm, cvData: any): string {
  const today = new Date();
  const dateStr = today.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // Extrair TODOS os dados pessoais do currículo
  const personalInfo = cvData.personalInfo || {};

  // Usar dados reais ou valores mínimos aceitáveis
  const name = personalInfo.name || '[Seu Nome]';
  const email = personalInfo.email || '[seu.email@exemplo.com]';
  const phone = personalInfo.phone || '[Seu Telefone]';
  const location = personalInfo.location || '[Sua Cidade - Estado]';

  // Extrair experiências
  const experiences = cvData.experience || [];
  const latestExperience = experiences[0];

  // Extrair habilidades de forma SEGURA (pode ser array ou string)
  let skillsSummary = '';
  const skills = cvData.skills || [];

  if (skills.length > 0) {
    let skillsList: string[] = [];

    if (typeof skills === 'string') {
      // Se for string, fazer split
      skillsList = skills.split(',').map(s => s.trim()).filter(s => s.length > 2);
    } else if (Array.isArray(skills)) {
      // Se for array, converter cada item para string corretamente
      skillsList = skills
        .map(s => {
          // Se for string, retornar direto
          if (typeof s === 'string') return s.trim();
          // Se for objeto, tentar extrair propriedade relevante
          if (typeof s === 'object' && s !== null) {
            const skillStr = s.name || s.skill || s.title || s.skillName || '';
            return typeof skillStr === 'string' ? skillStr.trim() : '';
          }
          // Converter qualquer outro tipo para string
          return String(s).trim();
        })
        .filter(s => s && s.length > 2 && s !== '[object Object]');
    }

    if (skillsList.length > 0) {
      skillsSummary = skillsList.slice(0, 4).join(', ');
    }
  }

  // Extrair objetivo profissional
  const objective = cvData.objective || '';

  // Montar cabeçalho com dados reais
  let carta = `${name}\n`;
  if (email) carta += `${email}`;
  if (phone) carta += ` | ${phone}`;
  carta += `\n${location}\n\n${dateStr}\n\nPrezado(a) Time de Recrutamento e Seleção da ${formData.companyName}\n\nPrezado(a) Senhor(a),\n\n`;

  // Parágrafo 1 - Usar objetivo profissional se disponível
  if (objective && objective.trim().length > 20) {
    carta += `${objective} Demonstro grande interesse na posição de ${formData.position} na ${formData.companyName}, empresa cuja reputação e compromisso com a excelência me motivam a contribuir para seu crescimento contínuo.\n\n`;
  } else {
    carta += `É com grande entusiasmo que me candidato à vaga de ${formData.position} em sua estimada empresa. Através desta carta, gostaria de expressar meu interesse e demonstrar como minhas experiências e competências se alinham perfeitamente com os requisitos desta oportunidade.\n\n`;
  }

  // Parágrafo 2 - Experiências reais com TEXTO FLUIDO E COERENTE usando objetivo e experiências
  if (latestExperience && latestExperience.title && latestExperience.company) {
    const expVerb = latestExperience.current ? 'atuo' : 'atuei';
    const expDesc = latestExperience.description ? latestExperience.description.substring(0, 200) : 'desenvolvi competências essenciais para a área';

    // Criar narrativa fluida sobre a experiência
    carta += `${latestExperience.current ? 'Atualmente' : 'Em minha trajetória profissional'}, ${expVerb} como ${latestExperience.title} na ${latestExperience.company}, onde ${expDesc}. `;

    // Adicionar habilidades de forma contextualizada
    if (skillsSummary) {
      carta += `Ao longo dessa jornada, aprimorei minhas competências em áreas como ${skillsSummary}, desenvolvendo uma base sólida de conhecimentos que considero diretamente aplicáveis aos desafios propostos nesta oportunidade`;
    } else {
      carta += `Essa experiência me permitiu desenvolver competências técnicas e comportamentais que considero fundamentais para o sucesso na posição de ${formData.position}`;
    }

    // Adicionar conexão com descrição da vaga se houver
    if (formData.jobDescription && formData.jobDescription.length > 20) {
      carta += `. Essa combinação de experiência prática e conhecimento técnico me capacita para atender aos requisitos específicos mencionados na descrição da vaga, especialmente considerando os desafios relacionados ao desenvolvimento de soluções eficientes e inovadoras`;
    } else {
      carta += `. Essa combinação de experiência prática e conhecimento técnico me posiciona para contribuir ativamente desde o primeiro dia, agregando valor aos resultados da equipe`;
    }

    carta += `.\n\n`;
  } else if (skillsSummary) {
    // Caso tenha habilidades mas não experiência detalhada - usar objetivo profissional
    if (objective && objective.trim().length > 30) {
      carta += `${objective} `;
      carta += `Para isso, desenvolvi competências em ${skillsSummary}, áreas que considero fundamentais para o sucesso nesta posição. `;
    } else {
      carta += `Ao longo de minha formação e experiências profissionais, desenvolvi expertise em ${skillsSummary}, competências que considero fundamentais para o sucesso no desenvolvimento das atividades propostas para esta vaga. `;
    }
    carta += `Minha capacidade de aprendizado rápido e adaptação a novos desafios me permite contribuir efetivamente desde o início, gerando resultados positivos em colaboração com a equipe.\n\n`;
  } else if (objective && objective.trim().length > 30) {
    // Usar objetivo profissional quando disponível
    carta += `${objective} `;
    carta += `Minha formação e dedicação ao desenvolvimento profissional contínuo me capacitam para enfrentar os desafios inerentes ao cargo de ${formData.position}. `;
    carta += `Possuo habilidade comprovada em trabalho colaborativo, resolução de problemas e adaptação a novos contextos, características que considero essenciais para contribuir efetivamente com os objetivos da ${formData.companyName}.\n\n`;
  } else {
    // Fallback genérico mas profissional
    carta += `Minha formação acadêmica e experiências profissionais me proporcionaram visão estratégica e capacidade analítica para enfrentar desafios complexos em ambientes dinâmicos. `;
    carta += `Possuo comprovada habilidade em trabalho colaborativo, resolução de problemas e adaptação a novos contextos, características que considero essenciais para o sucesso no cargo de ${formData.position}. `;
    carta += `Estou preparado para aplicar minha dedicação, conhecimentos e comprometimento para gerar impacto positivo e contribuir ativamente para o crescimento e sucesso da ${formData.companyName}.\n\n`;
  }

  // Parágrafo 3 - Fechamento
  carta += `Tenho grande admiração pela ${formData.companyName} e acredito firmemente que posso contribuir significativamente para o sucesso da equipe e os objetivos estratégicos da organização. Coloco-me à disposição para uma entrevista, onde poderei demonstrar detalhadamente minhas qualificações e como posso agregar valor à empresa.\n\n`;

  carta += `Atenciosamente,\n\n${name}`;

  return carta;
}

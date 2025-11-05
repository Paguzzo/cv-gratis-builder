import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Award,
  TrendingUp,
  FileText,
  Target,
  Zap,
  ArrowLeft,
  Download,
  Printer
} from "lucide-react";
import { toast } from 'sonner';
import { CurriculumData } from '@/types/curriculum';

interface CheckResult {
  category: string;
  status: 'good' | 'warning' | 'error';
  message: string;
  suggestion?: string;
}

interface AnalysisResult {
  score: number;
  checks: CheckResult[];
  summary: string;
}

interface CurriculumCheckerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  curriculumData: CurriculumData | null;
  onContinueAction?: () => void;
  actionType?: 'download' | 'print';
}

export function CurriculumChecker({
  open = true,
  onOpenChange,
  curriculumData,
  onContinueAction,
  actionType = 'download'
}: CurriculumCheckerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Auto-analisar quando o modal abrir e limpar quando fechar
  useEffect(() => {
    if (open && !analysisResult) {
      analyzeCurriculum();
    } else if (!open) {
      // Limpar análise quando fechar para forçar nova análise na próxima abertura
      setAnalysisResult(null);
    }
  }, [open]);

  const analyzeCurriculum = async () => {
    setIsAnalyzing(true);

    try {
      if (!curriculumData) {
        toast.error('Dados do currículo não encontrados');
        setIsAnalyzing(false);
        return;
      }

      const checks: CheckResult[] = [];
      let score = 0;
      const maxScore = 100;

      console.log('🔍 Analisando currículo:', curriculumData);

      // 1. Verificar informações pessoais
      const hasName = curriculumData.personalInfo?.name || curriculumData.personalInfo?.fullName;
      const hasEmail = curriculumData.personalInfo?.email;
      const hasPhone = curriculumData.personalInfo?.phone;

      if (hasName && hasEmail && hasPhone) {
        checks.push({
          category: 'Informações Pessoais',
          status: 'good',
          message: 'Informações básicas completas'
        });
        score += 10;
      } else {
        const missing = [];
        if (!hasName) missing.push('nome');
        if (!hasEmail) missing.push('email');
        if (!hasPhone) missing.push('telefone');

        checks.push({
          category: 'Informações Pessoais',
          status: hasName && hasEmail ? 'warning' : 'error',
          message: hasName && hasEmail ? 'Informações incompletas' : 'Informações básicas incompletas',
          suggestion: `Preencha: ${missing.join(', ')}`
        });
        score += hasName && hasEmail ? 5 : 0;
      }

      // 2. Verificar objetivo/resumo
      const objective = curriculumData.personalInfo?.objective || curriculumData.objective;
      if (objective && objective.length > 50) {
        checks.push({
          category: 'Objetivo Profissional',
          status: 'good',
          message: 'Objetivo bem definido'
        });
        score += 15;
      } else if (objective && objective.length > 0) {
        checks.push({
          category: 'Objetivo Profissional',
          status: 'warning',
          message: 'Objetivo muito curto',
          suggestion: 'Expanda seu objetivo para pelo menos 50 caracteres'
        });
        score += 7;
      } else {
        checks.push({
          category: 'Objetivo Profissional',
          status: 'error',
          message: 'Sem objetivo definido',
          suggestion: 'Adicione um objetivo profissional claro'
        });
      }

      // 3. Verificar experiências
      const experiences = curriculumData.experience || [];
      if (experiences.length >= 2) {
        checks.push({
          category: 'Experiência Profissional',
          status: 'good',
          message: `${experiences.length} experiências listadas`
        });
        score += 20;
      } else if (experiences.length === 1) {
        checks.push({
          category: 'Experiência Profissional',
          status: 'warning',
          message: 'Apenas uma experiência listada',
          suggestion: 'Adicione mais experiências relevantes'
        });
        score += 10;
      } else {
        checks.push({
          category: 'Experiência Profissional',
          status: 'error',
          message: 'Nenhuma experiência listada',
          suggestion: 'Adicione suas experiências profissionais'
        });
      }

      // 4. Verificar descrições de experiência
      const hasDetailedExperiences = experiences.some(
        exp => exp.description && exp.description.length > 100
      );
      if (hasDetailedExperiences) {
        checks.push({
          category: 'Descrições',
          status: 'good',
          message: 'Experiências bem detalhadas'
        });
        score += 15;
      } else if (experiences.length > 0) {
        checks.push({
          category: 'Descrições',
          status: 'warning',
          message: 'Descrições muito curtas',
          suggestion: 'Detalhe melhor suas responsabilidades e conquistas'
        });
        score += 5;
      }

      // 5. Verificar educação
      const education = curriculumData.education || [];
      if (education.length > 0) {
        checks.push({
          category: 'Educação',
          status: 'good',
          message: 'Formação acadêmica presente'
        });
        score += 15;
      } else {
        checks.push({
          category: 'Educação',
          status: 'warning',
          message: 'Sem formação acadêmica',
          suggestion: 'Adicione sua formação acadêmica'
        });
      }

      // 6. Verificar habilidades
      const skills = curriculumData.skills || [];
      if (skills.length >= 5) {
        checks.push({
          category: 'Habilidades',
          status: 'good',
          message: `${skills.length} habilidades listadas`
        });
        score += 15;
      } else if (skills.length > 0) {
        checks.push({
          category: 'Habilidades',
          status: 'warning',
          message: 'Poucas habilidades listadas',
          suggestion: 'Adicione mais habilidades relevantes (ideal: 5-10)'
        });
        score += 7;
      } else {
        checks.push({
          category: 'Habilidades',
          status: 'error',
          message: 'Nenhuma habilidade listada',
          suggestion: 'Adicione suas principais habilidades'
        });
      }

      // 7. Verificar idiomas
      const languages = curriculumData.languages || [];
      if (languages.length > 0) {
        checks.push({
          category: 'Idiomas',
          status: 'good',
          message: 'Idiomas incluídos'
        });
        score += 10;
      }

      // Gerar resumo baseado na pontuação
      let summary = '';
      if (score >= 80) {
        summary = 'Excelente! Seu currículo está muito bem estruturado e completo.';
      } else if (score >= 60) {
        summary = 'Bom! Seu currículo tem uma boa base, mas pode ser melhorado.';
      } else if (score >= 40) {
        summary = 'Regular. Seu currículo precisa de mais informações e detalhes.';
      } else {
        summary = 'Atenção! Seu currículo precisa de melhorias significativas.';
      }

      const result: AnalysisResult = {
        score: Math.min(score, maxScore),
        checks,
        summary
      };

      console.log('✅ Análise concluída:', result);
      setAnalysisResult(result);
      toast.success('Análise concluída!');
    } catch (error) {
      console.error('Erro ao analisar currículo:', error);
      toast.error('Erro ao analisar currículo');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    if (score >= 40) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getStatusIcon = (status: CheckResult['status']) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-gradient-to-r from-purple-50 to-blue-50 -mx-6 -mt-6 px-6 py-4 rounded-t-lg">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Award className="w-6 h-6 text-purple-600" />
            Avaliação de Currículo com IA
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            Analise a qualidade do seu currículo e receba sugestões de melhoria
          </p>
        </DialogHeader>

        <div className="pt-4">
          {!analysisResult ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 mx-auto mb-4 text-purple-600 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Pronto para Analisar?</h3>
              <p className="text-gray-600 mb-6">
                Nossa IA irá avaliar seu currículo e dar uma nota de 0 a 100,
                além de sugestões específicas de melhoria.
              </p>
              <Button
                onClick={analyzeCurriculum}
                disabled={isAnalyzing}
                className="bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Analisar Meu Currículo
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className={`${getScoreBgColor(analysisResult.score)} rounded-lg p-6 text-center`}>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Award className={`w-8 h-8 ${getScoreColor(analysisResult.score)}`} />
                  <span className={`text-5xl font-black ${getScoreColor(analysisResult.score)}`}>
                    {analysisResult.score}
                  </span>
                  <span className="text-3xl font-bold text-gray-600">/100</span>
                </div>
                <p className="text-lg font-semibold text-gray-700">
                  {analysisResult.summary}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Detalhes da Análise
                </h3>
                {analysisResult.checks.map((check, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {getStatusIcon(check.status)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold">{check.category}</span>
                          <Badge
                            variant={
                              check.status === 'good'
                                ? 'default'
                                : check.status === 'warning'
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {check.status === 'good'
                              ? 'OK'
                              : check.status === 'warning'
                              ? 'Atenção'
                              : 'Erro'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{check.message}</p>
                        {check.suggestion && (
                          <p className="text-sm text-blue-600 mt-1">
                            💡 {check.suggestion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={analyzeCurriculum}
                variant="outline"
                className="w-full"
                disabled={isAnalyzing}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Analisar Novamente
              </Button>

              <div className="flex gap-3 pt-4 border-t mt-6">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange?.(false)}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar para Editar
                </Button>
                <Button
                  onClick={() => {
                    onContinueAction?.();
                    onOpenChange?.(false);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {actionType === 'print' ? (
                    <>
                      <Printer className="w-4 h-4 mr-2" />
                      Imprimir
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Baixar PDF
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useCurriculumData } from '@/hooks/useCurriculumData';
import { EvaluationService } from '@/services/evaluationService';
import { CurriculumEvaluation, ImprovementSuggestion } from '@/types/evaluation';
import { Star, TrendingUp, CheckCircle, AlertCircle, RefreshCw, Award } from 'lucide-react';

export function EvaluationPanel() {
  const { data } = useCurriculumData();
  const [evaluation, setEvaluation] = useState<CurriculumEvaluation | null>(null);
  const [suggestions, setSuggestions] = useState<ImprovementSuggestion[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const evaluateNow = async () => {
    setIsEvaluating(true);
    
    // Simular delay para dar feedback visual
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newEvaluation = EvaluationService.evaluateCurriculum(data);
    const newSuggestions = EvaluationService.generateImprovementSuggestions(data);
    
    setEvaluation(newEvaluation);
    setSuggestions(newSuggestions);
    setIsEvaluating(false);
  };

  // Avaliar automaticamente quando dados mudarem
  useEffect(() => {
    evaluateNow();
  }, [data]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-blue-50 border-blue-200';
    if (score >= 40) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  if (!evaluation) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Avaliação do Currículo
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Avaliando seu currículo...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          Avaliação do Currículo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nota Geral */}
        <div className={`text-center p-6 rounded-lg border-2 ${getScoreBackground(evaluation.overallScore)}`}>
          <div className={`text-4xl font-bold mb-2 ${getScoreColor(evaluation.overallScore)}`}>
            {evaluation.overallScore}
          </div>
          <div className="text-lg font-medium text-gray-700 mb-3">
            {evaluation.overallScore >= 80 ? 'Excelente!' :
             evaluation.overallScore >= 60 ? 'Muito Bom!' :
             evaluation.overallScore >= 40 ? 'Bom' : 'Pode Melhorar'}
          </div>
          {renderStars(evaluation.starRating)}
          <div className="text-sm text-gray-600 mt-2">
            {evaluation.starRating} de 5 estrelas
          </div>
        </div>

        {/* Categorias Detalhadas */}
        <div>
          <h3 className="font-medium text-gray-800 mb-3">Análise Detalhada</h3>
          <div className="space-y-3">
            {Object.entries(evaluation.categories).map(([key, category]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className={`text-sm font-bold ${getScoreColor(category.score)}`}>
                    {category.score}%
                  </span>
                </div>
                <Progress value={category.score} className="h-2" />
                <p className="text-xs text-gray-600">{category.feedback}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pontos Positivos */}
        {evaluation.positivePoints.length > 0 && (
          <div>
            <h3 className="font-medium text-green-700 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Pontos Fortes
            </h3>
            <div className="space-y-2">
              {evaluation.positivePoints.map((point, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Melhorias */}
        {evaluation.improvements.length > 0 && (
          <div>
            <h3 className="font-medium text-amber-700 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Oportunidades de Melhoria
            </h3>
            <div className="space-y-2">
              {evaluation.improvements.map((improvement, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{improvement}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sugestões Inteligentes */}
        {suggestions.length > 0 && (
          <div>
            <h3 className="font-medium text-blue-700 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Sugestões Prioritárias
            </h3>
            <div className="space-y-3">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-3 border rounded-lg bg-blue-50">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-blue-900 text-sm">
                      {suggestion.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          suggestion.priority === 'alta' ? 'border-red-300 text-red-700' :
                          suggestion.priority === 'media' ? 'border-yellow-300 text-yellow-700' :
                          'border-gray-300 text-gray-700'
                        }`}
                      >
                        {suggestion.priority}
                      </Badge>
                      <span className="text-xs text-blue-600 font-medium">
                        +{suggestion.potentialImpact}pts
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-blue-700">{suggestion.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="pt-4 border-t">
          <Button 
            onClick={evaluateNow} 
            disabled={isEvaluating}
            className="w-full"
            variant="outline"
          >
            {isEvaluating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Reavaliando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reavaliar Currículo
              </>
            )}
          </Button>
          
          <div className="text-center mt-3">
            <p className="text-xs text-gray-500">
              Última avaliação: {evaluation.lastEvaluated.toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Wand2, Copy, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { AIService, AIRequest } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

interface AIAssistantProps {
  type: 'objective' | 'experience';
  currentText: string;
  onTextGenerated: (text: string) => void;
  position?: string;
  company?: string;
  className?: string;
}

export function AIAssistant({
  type,
  currentText,
  onTextGenerated,
  position = '',
  company = '',
  className = ''
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const aiService = AIService.getInstance();

  const handleGenerate = async () => {
    if (!currentText.trim()) {
      toast({
        title: "Texto necessário",
        description: "Digite um texto base para que a IA possa melhorá-lo.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    const request: AIRequest = {
      type,
      userInput: currentText,
      keywords,
      position,
      company
    };

    try {
      const response = await aiService.generateText(request);
      
      if (response.success) {
        setGeneratedText(response.generatedText);
        setSuggestions(response.suggestions || []);
        toast({
          title: "Texto gerado com sucesso!",
          description: "A IA criou uma versão otimizada do seu texto.",
        });
      } else {
        toast({
          title: "Erro na geração",
          description: response.error || "Tente novamente em alguns instantes.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Não foi possível conectar com a IA. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generatedText);
    toast({
      title: "Texto copiado!",
      description: "O texto foi copiado para sua área de transferência.",
    });
  };

  const handleUseText = () => {
    onTextGenerated(generatedText);
    setIsOpen(false);
    toast({
      title: "Texto aplicado!",
      description: "O texto gerado pela IA foi aplicado ao seu currículo.",
    });
  };

  const getTitle = () => {
    return type === 'objective' ? 'IA para Objetivo Profissional' : 'IA para Experiência Profissional';
  };

  const getDescription = () => {
    return type === 'objective' 
      ? 'Nossa IA especializada criará um objetivo profissional estratégico e otimizado para ATS'
      : 'Transforme sua experiência em descrições impactantes com foco em resultados';
  };

  if (!isOpen) {
    return (
      <div className={className}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="border-blue-200 text-blue-700 hover:bg-blue-50"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Melhorar com IA
        </Button>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <Wand2 className="w-5 h-5" />
          {getTitle()}
        </CardTitle>
        <CardDescription>
          {getDescription()}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Input de palavras-chave */}
        <div>
          <Label htmlFor="keywords" className="text-sm font-medium">
            Palavras-chave importantes (opcional)
          </Label>
          <Input
            id="keywords"
            placeholder="Ex: liderança, React, gestão de projetos, inovação..."
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Inclua tecnologias, habilidades ou termos relevantes da área
          </p>
        </div>

        {/* Texto atual para análise */}
        <div>
          <Label className="text-sm font-medium">Texto atual:</Label>
          <div className="mt-1 p-3 bg-gray-50 rounded border text-sm">
            {currentText || 'Nenhum texto inserido ainda...'}
          </div>
        </div>

        {/* Botão de geração */}
        <Button 
          onClick={handleGenerate} 
          disabled={isLoading || !currentText.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Gerando texto estratégico...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Gerar Texto com IA
            </>
          )}
        </Button>

        {/* Texto gerado */}
        {generatedText && (
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Texto otimizado pela IA:
              </Label>
              <Textarea
                value={generatedText}
                onChange={(e) => setGeneratedText(e.target.value)}
                className="mt-1 min-h-[120px]"
                placeholder="Texto gerado aparecerá aqui..."
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleUseText} size="sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                Usar Este Texto
              </Button>
              <Button onClick={handleCopyText} variant="outline" size="sm">
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </Button>
            </div>
          </div>
        )}

        {/* Sugestões */}
        {suggestions.length > 0 && (
          <div>
            <Label className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Dicas da IA:
            </Label>
            <div className="mt-2 space-y-2">
              {suggestions.map((suggestion, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs p-2 h-auto bg-amber-50 text-amber-800 border-amber-200"
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Fechar */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsOpen(false)}
          className="w-full"
        >
          Fechar Assistente IA
        </Button>
      </CardContent>
    </Card>
  );
} 
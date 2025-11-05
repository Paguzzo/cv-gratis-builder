import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, Send, Loader2, BrainCircuit, Sparkles } from "lucide-react";
import { toast } from 'sonner';
import { AIService } from '@/services/aiService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface CareerAIChatProps {
  className?: string;
}

export function CareerAIChat({ className = '' }: CareerAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    // Mensagem de boas-vindas
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou seu assistente de carreira inteligente. Posso ajudar você com:\n\n• Otimização de currículo\n• Preparação para entrevistas\n• Dicas de carreira\n• Análise de perfil profissional\n• Estratégias de contratação\n\nComo posso ajudar você hoje?',
      timestamp: new Date()
    }]);
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Integração com IA
      const aiService = new AIService();
      const systemPrompt = `Você é um assistente especializado em carreiras, RH e recrutamento. Você é experiente em:
      - Otimização de currículos e perfis profissionais
      - Preparação para entrevistas de emprego
      - Estratégias de desenvolvimento de carreira
      - Tendências do mercado de trabalho
      - Processos de contratação e seleção

      Seja sempre útil, profissional e dê dicas práticas. Use uma linguagem clara e objetiva.`;

      const response = await aiService.generateText(inputMessage, systemPrompt);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || generateFallbackResponse(inputMessage),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Erro na IA:', error);

      // Fallback para resposta local
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateFallbackResponse(inputMessage),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      toast.error('Erro ao conectar com IA. Resposta gerada localmente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-blue-600" />
          Career AI - Assistente de Carreira
        </CardTitle>
        <CardDescription>
          Converse com nossa IA especializada em carreiras e RH
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {/* Área de mensagens */}
        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className={message.role === 'user' ? 'bg-blue-100' : 'bg-purple-100'}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Bot className="w-4 h-4 text-purple-600" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div
                className={`flex-1 max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-100 text-blue-900'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs opacity-50 mt-1">
                  {message.timestamp.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-purple-100">
                  <Bot className="w-4 h-4 text-purple-600" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 rounded-lg p-3">
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input de mensagem */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Digite sua mensagem..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Função de resposta local (fallback)
function generateFallbackResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('currículo') || lowerMessage.includes('curriculo') || lowerMessage.includes('cv')) {
    return `Sobre currículos, aqui vão algumas dicas importantes:\n\n✅ Mantenha-o objetivo (máximo 2 páginas)\n✅ Use verbos de ação (desenvolvi, gerenciei, implementei)\n✅ Quantifique resultados sempre que possível\n✅ Adapte para cada vaga específica\n✅ Revise erros de português\n\nO que você gostaria de saber especificamente sobre seu currículo?`;
  }

  if (lowerMessage.includes('entrevista')) {
    return `Para se preparar para entrevistas:\n\n1️⃣ Pesquise sobre a empresa\n2️⃣ Prepare exemplos do método STAR (Situação, Tarefa, Ação, Resultado)\n3️⃣ Vista-se adequadamente\n4️⃣ Chegue com 10-15 minutos de antecedência\n5️⃣ Prepare perguntas para fazer ao entrevistador\n\nQuer dicas sobre alguma etapa específica?`;
  }

  if (lowerMessage.includes('salário') || lowerMessage.includes('salario')) {
    return `Sobre negociação salarial:\n\n💰 Pesquise a média do mercado para sua posição\n💰 Considere benefícios além do salário base\n💰 Seja flexível mas conheça seu valor mínimo\n💰 Aguarde a empresa fazer a primeira oferta\n💰 Negocie com dados, não com emoção\n\nPosso ajudar com mais alguma coisa?`;
  }

  if (lowerMessage.includes('carreira') || lowerMessage.includes('crescimento')) {
    return `Para desenvolvimento de carreira:\n\n🎯 Defina objetivos claros de curto e longo prazo\n🎯 Invista em educação continuada\n🎯 Faça networking ativo\n🎯 Busque feedback regularmente\n🎯 Considere um mentor\n\nQue aspecto da sua carreira você gostaria de desenvolver?`;
  }

  return `Interessante pergunta! Para te ajudar melhor, pode ser mais específico? Estou aqui para ajudar com:\n\n• Otimização de currículo\n• Preparação para entrevistas\n• Dicas de carreira\n• Análise de perfil profissional\n• Estratégias de contratação`;
}

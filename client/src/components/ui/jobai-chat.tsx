import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, Send, Loader2, BrainCircuit } from "lucide-react";
import { toast } from 'sonner';
import { AIService } from '@/services/aiService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UserData {
  name: string;
  email: string;
  whatsapp: string;
}

interface JobAIChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JobAIChat({ open, onOpenChange }: JobAIChatProps) {
  const [hasUserData, setHasUserData] = useState(false);
  const [userData, setUserData] = useState<UserData>({ name: '', email: '', whatsapp: '' });
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
    if (open && !hasUserData) {
      // Inicializar com mensagem de boas-vindas
      setMessages([{
        id: '1',
        role: 'assistant',
        content: 'Olá! Eu sou a JobIA, sua especialista em RH e carreiras! 🎯\n\nPosso te ajudar com:\n• Otimização de currículo\n• Preparação para entrevistas\n• Dicas de carreira\n• Análise de perfil profissional\n• Estratégias de contratação\n\nPara começarmos, preciso de alguns dados seus:',
        timestamp: new Date()
      }]);
    }
  }, [open, hasUserData]);

  const handleUserDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData.name.trim() || !userData.email.trim() || !userData.whatsapp.trim()) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      toast.error('Por favor, insira um email válido');
      return;
    }

    try {
      // Salvar dados do usuário premium
      const premiumUserData = {
        ...userData,
        timestamp: new Date().toISOString(),
        source: 'jobai-user-data',
        feature: 'ai-chat-specialist'
      };
      
      localStorage.setItem('jobai-user-data', JSON.stringify(premiumUserData));
      
      setHasUserData(true);
      
      // Adicionar mensagem de confirmação
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Perfeito, ${userData.name}! 👋\n\nAgora posso te ajudar com todas suas dúvidas sobre carreira, currículo, entrevistas e contratação.\n\nO que você gostaria de saber?`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, welcomeMessage]);
      
      toast.success('Dados salvos! Agora você pode conversar com a JobIA');
    } catch (error) {
      toast.error('Erro ao salvar dados. Tente novamente.');
    }
  };

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
      // Integração real com OpenAI
      const aiService = new AIService();
      const systemPrompt = `Você é a JobIA, uma especialista em RH, carreiras e recrutamento. Você é experiente em:
      - Otimização de currículos e perfis profissionais
      - Preparação para entrevistas de emprego
      - Estratégias de desenvolvimento de carreira
      - Tendências do mercado de trabalho
      - Processos de contratação e seleção
      
      Seja sempre útil, profissional e dê dicas práticas. Use emojis moderadamente e seja concisa mas completa nas respostas.
      Usuário: ${userData.name}`;

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
      
      // Fallback para resposta local se OpenAI falhar
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateFallbackResponse(inputMessage),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('currículo') || input.includes('cv')) {
      return `📄 Sobre currículos:\n\n• Use um formato limpo e profissional\n• Destaque suas principais conquistas\n• Adapte o conteúdo para cada vaga\n• Mantenha entre 1-2 páginas\n• Use palavras-chave da área\n\nPrecisa de alguma dica específica sobre seu currículo?`;
    }
    
    if (input.includes('entrevista')) {
      return `🎯 Dicas para entrevistas:\n\n• Pesquise sobre a empresa antes\n• Prepare exemplos do método STAR\n• Vista-se adequadamente\n• Chegue com 10-15 min de antecedência\n• Prepare perguntas para fazer ao entrevistador\n\nQual tipo de entrevista você vai fazer?`;
    }
    
    if (input.includes('carreira') || input.includes('profissional')) {
      return `🚀 Desenvolvimento de carreira:\n\n• Defina objetivos claros de médio/longo prazo\n• Invista em capacitação constante\n• Construa uma rede de networking\n• Mantenha-se atualizado no mercado\n• Busque feedback regularmente\n\nEm que área você quer crescer?`;
    }
    
    return `Entendo sua pergunta! Como especialista em RH, posso te ajudar com:\n\n• Análise e otimização de currículo\n• Preparação para processos seletivos\n• Estratégias de carreira\n• Dicas de networking\n• Tendências do mercado de trabalho\n\nPode ser mais específico sobre o que precisa?`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[700px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold">JobIA</div>
              <div className="text-sm text-gray-500 font-normal">Especialista em RH & Carreiras</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {!hasUserData ? (
          // Formulário de dados do usuário
          <form onSubmit={handleUserDataSubmit} className="space-y-4 flex-1 flex flex-col justify-center">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome completo *</Label>
                <Input
                  id="name"
                  value={userData.name}
                  onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="seu@email.com"
                />
              </div>
              
              <div>
                <Label htmlFor="whatsapp">WhatsApp *</Label>
                <Input
                  id="whatsapp"
                  value={userData.whatsapp}
                  onChange={(e) => setUserData(prev => ({ ...prev, whatsapp: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full">
              Começar conversa com JobIA
            </Button>
          </form>
        ) : (
          // Interface de chat
          <>
            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`max-w-[80%] p-3 rounded-lg whitespace-pre-line ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-800 border'
                    }`}
                  >
                    {message.content}
                  </div>
                  
                  {message.role === 'user' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-500 text-white text-xs">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white p-3 rounded-lg border">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <div className="flex gap-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua pergunta sobre carreira, currículo, entrevistas..."
                className="flex-1 resize-none"
                rows={2}
              />
              <Button 
                onClick={sendMessage} 
                disabled={!inputMessage.trim() || isLoading}
                className="self-end"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
} 
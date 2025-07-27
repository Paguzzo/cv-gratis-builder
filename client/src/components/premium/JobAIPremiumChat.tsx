import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bot, 
  Send, 
  X, 
  Crown, 
  Clock,
  User
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface JobAIPremiumChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SUGGESTED_QUESTIONS = [
  "Como melhorar meu currículo?",
  "Dicas para entrevista",
  "Como destacar competências?",
  "Palavras-chave importantes",
  "Personalizar para cada vaga",
  "O que recrutadores procuram?"
];

export function JobAIPremiumChat({ open, onOpenChange }: JobAIPremiumChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState('');
  const [conversationStep, setConversationStep] = useState<'greeting' | 'name' | 'helping' | 'waiting'>('greeting');
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [inactivityWarningShown, setInactivityWarningShown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Iniciar conversa quando abrir
  useEffect(() => {
    if (open && messages.length === 0) {
      initializeConversation();
    }
  }, [open]);

  // Monitorar inatividade
  useEffect(() => {
    if (open && conversationStep === 'waiting') {
      const checkInactivity = () => {
        const now = Date.now();
        const timeSinceLastActivity = now - lastActivityTime;
        
        // Aviso após 30 segundos
        if (timeSinceLastActivity > 30000 && !inactivityWarningShown) {
          setInactivityWarningShown(true);
          addAssistantMessage(
            `${userName ? userName : 'Amigo(a)'}, você ainda está aí? 😊\n\nSe não tiver mais dúvidas, posso finalizar nosso atendimento. Ou se precisar de mais alguma coisa, é só me avisar!`
          );
        }
        
        // Finalizar após 60 segundos
        if (timeSinceLastActivity > 60000) {
          addAssistantMessage(
            `Foi um prazer te ajudar hoje, ${userName ? userName : 'amigo(a)'}! 😊\n\nEspero que tenha conseguido as informações que precisava. Estou sempre aqui no seu editor premium quando precisar!\n\n✨ **Boa sorte com seu currículo!**`
          );
          
          setTimeout(() => {
            resetConversation();
            onOpenChange(false);
          }, 3000);
        }
      };

      inactivityTimerRef.current = setInterval(checkInactivity, 5000);
      
      return () => {
        if (inactivityTimerRef.current) {
          clearInterval(inactivityTimerRef.current);
        }
      };
    }
  }, [open, conversationStep, lastActivityTime, inactivityWarningShown, userName]);

  const resetConversation = () => {
    setMessages([]);
    setUserName('');
    setConversationStep('greeting');
    setLastActivityTime(Date.now());
    setInactivityWarningShown(false);
    setInputValue('');
    setIsTyping(false);
  };

  const addAssistantMessage = (content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      content,
      role: 'assistant',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const initializeConversation = () => {
    resetConversation();
    setTimeout(() => {
      addAssistantMessage(
        `👋 Olá! Eu sou a **Marina**, sua consultora pessoal de RH aqui na JobAI Premium!\n\nÉ um prazer falar com você! 😊\n\nPara que eu possa te ajudar de forma mais personalizada, qual é o seu nome?`
      );
      setConversationStep('name');
    }, 500);
  };

  const generatePersonalizedResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    const greeting = userName ? `${userName}, ` : '';
    
    // Respostas sobre currículo
    if (message.includes('currículo') || message.includes('cv') || message.includes('melhorar')) {
      return `${greeting}excelente pergunta! 📝\n\nVou te dar algumas dicas valiosas para melhorar seu currículo:\n\n**🎯 Estrutura que funciona:**\n• Objetivo profissional claro (2-3 linhas)\n• Experiências em ordem cronológica inversa\n• Competências técnicas relevantes\n• Formação acadêmica\n\n**⚡ Palavras-chave poderosas:**\n• Use termos da sua área\n• Inclua soft skills como "liderança" e "trabalho em equipe"\n• Mencione ferramentas específicas\n\n**✨ Formatação profissional:**\n• Máximo 2 páginas\n• Fonte limpa (Arial, Calibri)\n• Informações de contato visíveis\n\n💡 O template premium que você está usando já segue essas práticas!\n\n${userName ? `${userName}, ` : ''}tem alguma área específica do currículo que gostaria de melhorar?`;
    }

    // Respostas sobre entrevista
    if (message.includes('entrevista') || message.includes('emprego') || message.includes('vaga')) {
      return `${greeting}ótima pergunta! Preparação é fundamental! 💼\n\n**🎯 Antes da entrevista:**\n• Pesquise a empresa (missão, valores, produtos)\n• Prepare respostas para perguntas comuns\n• Tenha perguntas para fazer sobre a vaga\n• Vista-se adequadamente\n\n**⚡ Perguntas frequentes:**\n• "Fale sobre você" → Resumo profissional em 2min\n• "Pontos fortes/fracos" → Seja honesto mas estratégico\n• "Por que trabalhar aqui?" → Conecte seus objetivos aos da empresa\n\n**🌟 Durante a entrevista:**\n• Mantenha contato visual\n• Demonstre entusiasmo genuíno\n• Use exemplos concretos (método STAR)\n\n${userName ? `${userName}, ` : ''}para que tipo de vaga você está se preparando?`;
    }

    // Respostas sobre competências
    if (message.includes('competência') || message.includes('habilidade') || message.includes('destac')) {
      return `${greeting}essa é uma estratégia essencial! 🎯\n\n**⚡ Competências técnicas (Hard Skills):**\n• Ferramentas específicas (Excel avançado, Python, SAP)\n• Certificações relevantes (PMP, Scrum Master)\n• Idiomas com nível específico\n• Conhecimentos técnicos da sua área\n\n**🌟 Competências comportamentais (Soft Skills):**\n• Liderança - quantifique ("liderei equipe de 10 pessoas")\n• Comunicação - apresentações, negociação\n• Resolução de problemas com exemplos\n• Adaptabilidade\n\n**📈 Como evidenciar:**\n• Use números - "aumentei vendas em 25%"\n• Conte histórias - situação → ação → resultado\n• Conecte com a vaga\n\n${userName ? `${userName}, ` : ''}qual área você gostaria de destacar mais no seu currículo?`;
    }

    // Respostas sobre palavras-chave
    if (message.includes('palavra') || message.includes('chave') || message.includes('keyword')) {
      return `${greeting}estratégia fundamental! 📈\n\n**🎯 Como identificar:**\n• Leia vagas similares - note termos repetidos\n• Analise descrições da função desejada\n• Use LinkedIn - veja perfis de profissionais da área\n• Consulte sites especializados\n\n**⚡ Categorias essenciais:**\n• Área técnica - "análise financeira", "gestão de projetos"\n• Ferramentas - "Power BI", "Salesforce", "Adobe Creative"\n• Metodologias - "Scrum", "Lean Six Sigma"\n• Soft skills - "liderança", "comunicação"\n\n**🔍 Onde incluir:**\n• Objetivo profissional (2-3 principais)\n• Experiências (integradas naturalmente)\n• Seção de competências\n\n${userName ? `${userName}, ` : ''}para qual área ou cargo você está otimizando seu currículo?`;
    }

    // Respostas sobre recrutadores
    if (message.includes('recrutador') || message.includes('rh') || message.includes('procur')) {
      return `${greeting}vou te contar alguns segredos! 🔍\n\n**⏱️ Primeiros 6 segundos:**\n• Nome e cargo claramente visíveis\n• Contatos atualizados e profissionais\n• Layout limpo e organizado\n• Objetivo claro e alinhado à vaga\n\n**🎯 Após primeira triagem:**\n• Experiências relevantes para a posição\n• Resultados quantificados - números, percentuais\n• Progressão de carreira lógica\n• Competências alinhadas ao job description\n\n**❌ O que eles NÃO querem ver:**\n• Informações pessoais desnecessárias\n• Erros de português/formatação\n• Fotos inadequadas\n• Currículos genéricos\n\n${userName ? `${userName}, ` : ''}você tem alguma dúvida específica sobre o que os recrutadores da sua área procuram?`;
    }

    // Respostas sobre personalização
    if (message.includes('personaliz') || message.includes('adaptar') || message.includes('cada vaga')) {
      return `${greeting}essa é a estratégia que mais funciona! ⭐\n\n**🎯 Análise da vaga:**\n• Leia atentamente o job description\n• Destaque requisitos obrigatórios vs desejáveis\n• Identifique palavras-chave importantes\n• Pesquise a cultura da empresa\n\n**⚡ Personalização estratégica:**\n• Objetivo profissional - ajuste para a posição\n• Ordem das experiências - destaque as relevantes\n• Descrição das funções - use termos similares\n• Competências - priorize as mencionadas\n\n**📝 Exemplo prático:**\n**Vaga:** Analista de Marketing Digital\n**Adapte:** Destaque Google Ads, métricas de conversão, redes sociais\n\n${userName ? `${userName}, ` : ''}você tem alguma vaga específica em mente para personalizar seu currículo?`;
    }

    // Resposta padrão personalizada
    return `${greeting}entendi! 😊\n\nComo sua consultora de RH, posso te ajudar com várias questões:\n\n📝 **Otimização de currículo**\n💼 **Preparação para entrevistas**\n🎯 **Estratégias de carreira**\n📈 **Desenvolvimento profissional**\n\n💡 **Dica:** Seja mais específico! Por exemplo:\n• "Como destacar experiência em vendas?"\n• "Dicas para entrevista de TI"\n• "Palavras-chave para área financeira"\n\n${userName ? `${userName}, ` : ''}qual dessas áreas te interessaria mais agora?`;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setLastActivityTime(Date.now());
    setInactivityWarningShown(false);

    // Lógica conversacional
    setTimeout(() => {
      let response = '';

      if (conversationStep === 'name') {
        // Primeira interação - capturar nome
        const name = inputValue.trim().split(' ')[0]; // Pegar primeiro nome
        setUserName(name);
        setConversationStep('helping');
        
        response = `${name}, que nome lindo! 😊\n\nÉ um prazer te conhecer! Agora me conta, como posso te ajudar hoje? Estou aqui para te dar as melhores dicas de carreira!\n\n💡 **Posso te ajudar com:**\n• Melhorar seu currículo\n• Preparação para entrevistas\n• Destacar suas competências\n• Palavras-chave estratégicas\n• Personalização para vagas específicas\n\nO que você gostaria de saber?`;
      } else {
        // Conversa normal
        response = generatePersonalizedResponse(inputValue);
        setConversationStep('waiting');
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Delay variável para parecer mais humano
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    // Não chamar handleSendMessage automaticamente, deixar o usuário enviar
  };

  const handleClose = () => {
    if (inactivityTimerRef.current) {
      clearInterval(inactivityTimerRef.current);
    }
    resetConversation();
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 overflow-hidden">
        <CardHeader className="border-b bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Marina - JobAI Premium
                  <Crown className="w-4 h-4 text-yellow-300" />
                </CardTitle>
                <p className="text-sm text-purple-100">
                  {userName ? `Olá, ${userName}! ` : ''}Consultora de RH & Carreiras
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 flex flex-col min-h-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(600px - 140px)' }}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 break-words ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border border-purple-200 text-gray-800'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    <div className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-purple-200 rounded-lg p-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <span className="text-xs text-purple-600 ml-2">Marina está digitando...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions - apenas mostrar quando apropriado */}
          {conversationStep === 'helping' && !isTyping && (
            <div className="border-t border-purple-200 p-3 bg-purple-50/50">
              <div className="text-xs text-purple-600 mb-2 font-medium">💡 Sugestões rápidas:</div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-xs border-purple-300 text-purple-700 hover:bg-purple-100"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-purple-200 p-4 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={
                  conversationStep === 'name' 
                    ? "Digite seu nome..." 
                    : "Digite sua pergunta..."
                }
                className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
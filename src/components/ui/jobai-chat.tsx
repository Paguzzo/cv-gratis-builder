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
        content: 'Oi! Que BOM te ver aqui!\n\nEu sou a **JobIA**, sua COACH DE CARREIRA pessoal!\n\nVoce acabou de ganhar uma parceira que vai te ajudar a CONQUISTAR o emprego que voce merece!\n\n**To aqui pra te ajudar com:**\n\n- **Curriculo matador** - o que colocar, tirar, destacar\n- **Preparacao pra entrevistas** - online/presencial, perguntas dificeis\n- **Recolocacao** - estrategia completa se voce ta procurando emprego\n- **Onde deixar curriculo** - todos os sites + empresas que contratam\n- **Negociacao salarial** - como pedir o que voce vale\n- **Crescimento** - promocao, mudanca de area, LinkedIn\n\n**Meu jeito de trabalhar:**\nSou DIRETA, PRATICA e focada em RESULTADO! Sem enrolacao, so dicas que FUNCIONAM de verdade.\n\nVamos comecar? Me conta seus dados rapidinho pra gente personalizar tudo:',
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

    // Validacao basica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      toast.error('Por favor, insira um email valido');
      return;
    }

    try {
      // Salvar dados do usuario premium
      const premiumUserData = {
        ...userData,
        timestamp: new Date().toISOString(),
        source: 'jobai-user-data',
        feature: 'ai-chat-specialist'
      };
      
      localStorage.setItem('jobai-user-data', JSON.stringify(premiumUserData));
      
      setHasUserData(true);
      
      // Adicionar mensagem de confirmacao
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Show, ${userData.name}! Vamos nessa!\n\nAgora posso te ajudar com TUDO sobre sua carreira!\n\n**Me conte o que voce precisa AGORA:**\n\n- "Como melhorar meu curriculo?"\n- "Tenho entrevista, como me preparar?"\n- "Onde deixo meu curriculo?"\n- "Estou procurando emprego, por onde comecar?"\n- "Como negociar salario?"\n- "Dicas de LinkedIn?"\n\nOu fala direto qual seu desafio que eu te ajudo! Sem frescura, to aqui pra isso!`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, welcomeMessage]);
      
      toast.success('Dados salvos! Agora voce pode conversar com a JobIA');
    } catch (error) {
      toast.error('Erro ao salvar dados. Tente novamente.');
    }
  };

  // Função para limpar respostas indesejadas da IA
  const cleanAIResponse = (text: string): string => {
    let cleaned = text;

    // Remover blocos de apresentação como "Percebi que você mencionou..."
    cleaned = cleaned.replace(/^.*?Percebi que você mencionou.*?(\*\*|$)/s, '');

    // Remover blocos de "Sou especialista em..." ou "Posso te ajudar com..."
    cleaned = cleaned.replace(/✨\s*\*\*Sou especialista.*?\*\*/gs, '');
    cleaned = cleaned.replace(/🎯\s*\*\*Mas primeiro.*?\*\*/gs, '');

    // Remover listas de "posso te ajudar"
    cleaned = cleaned.replace(/•\s*(Currículos|Preparação|Estratégias|LinkedIn|Negociação|Transição).*?\n/g, '');

    // Remover perguntas no final (parágrafos que terminam com ?)
    const lines = cleaned.split('\n');
    const filteredLines = lines.filter((line, index) => {
      const isLastLines = index >= lines.length - 3;
      const hasQuestion = line.includes('?');
      const isQuestionBlock = line.match(/^(•|\*\*)\s*(Qual|Está|Me conta|Gostaria)/);

      // Remove últimas 3 linhas se tiverem perguntas
      if (isLastLines && (hasQuestion || isQuestionBlock)) {
        return false;
      }
      return true;
    });

    cleaned = filteredLines.join('\n');

    // Remover emojis excessivos (mais de 2 seguidos)
    cleaned = cleaned.replace(/([\u{1F300}-\u{1F9FF}]){3,}/gu, '');

    // Limpar múltiplas linhas vazias
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

    return cleaned.trim();
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
      // Usar AIService com método específico para chat
      const aiServiceInstance = AIService.getInstance();
      const systemPrompt = `Você é consultora sênior de RH respondendo a ${userData.name}.

⚠️ REGRAS CRÍTICAS:
1. RESPONDA DIRETO A PERGUNTA - sem apresentações, sem contexto extra
2. ZERO PERGUNTAS - nunca termine com "?", "Qual", "Quer", "Precisa", etc
3. SEM texto de "posso te ajudar com", "me conta", "gostaria de saber"
4. Apenas: RESPOSTA DIRETA + AÇÕES PRÁTICAS + FIM

FORMATO OBRIGATÓRIO:

**[RESPOSTA DIRETA EM 2-3 LINHAS]**

---

**AÇÃO PRÁTICA:**
• [ponto 1]
• [ponto 2]
• [ponto 3]

PROIBIDO:
❌ Perguntas no final
❌ "Posso te ajudar com..."
❌ "Me conta sobre..."
❌ "Qual sua área?"
❌ Texto de apresentação
❌ Emojis excessivos

PERMITIDO:
✅ Resposta direta
✅ Bullet points práticos
✅ Informações objetivas
✅ Acabar sem perguntas`;

      // Preparar histórico da conversa (últimas 10 mensagens, excluindo mensagem inicial)
      const conversationHistory = messages
        .slice(1) // Pula mensagem de boas-vindas inicial
        .slice(-10) // Pega últimas 10 mensagens
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      // Usar o novo método de chat com histórico
      let responseText = await aiServiceInstance.generateChatResponse(
        inputMessage,
        systemPrompt,
        conversationHistory
      );

      // Limpar resposta removendo textos indesejados
      responseText = cleanAIResponse(responseText || '');

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText || generateFallbackResponse(inputMessage),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Erro na IA:', error);

      // Fallback para resposta local se falhar
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

    // ENTREVISTA ONLINE/VIRTUAL/CAMERA
    if (input.includes('online') || input.includes('virtual') || input.includes('camera') || input.includes('video') || input.includes('zoom') || input.includes('meet') || input.includes('teams')) {
      return `**Entrevista online: foque em setup técnico e postura profissional.**

---

**AÇÃO PRÁTICA:**
• Câmera na altura dos olhos, iluminação frontal
• Fundo neutro e organizado
• Teste conexão 15 min antes
• Vestuário formal da cintura pra cima
• Olhe para câmera, não para sua imagem`;
    }

    // ROUPA/VESTUARIO
    if (input.includes('vestir') || input.includes('roupa') || input.includes('traje')) {
      return `**Vista-se um nível acima do dress code da empresa.**

---

**AÇÃO PRÁTICA:**
• Corporativo (banco): terno completo, cores sóbrias
• Business casual (tech): calça social + camisa
• Casual (design): jeans limpo + camisa boa
• Sempre: roupa limpa, passada, higiene impecável`;
    }

    // PRIMEIRA FASE/TRIAGEM/INICIO
    if (input.includes('primeira') || input.includes('1') || input.includes('triagem') || input.includes('inicial') || input.includes('comeco')) {
      return `**Primeira fase: 20-40min com RH para filtrar candidatos.**

---

**AÇÃO PRÁTICA - Respostas-chave:**
• "Fale sobre você": formação + experiência + conquista + por que a vaga (2min)
• "Por que sair?": foco em crescimento, nunca fale mal
• "Defeito": real + o que fez para melhorar
• Salário: pergunte a faixa deles primeiro
• Sempre prepare 2-3 perguntas sobre a vaga`;
    }

    if (input.includes('curriculo') || input.includes('cv') || input.includes('resume')) {
      return `**Currículo: ordem cronológica reversa, resultados quantificados, palavras-chave da vaga.**

---

**AÇÃO PRÁTICA:**
• Use verbos de ação ("Desenvolvi", "Implementei")
• Quantifique resultados ("↑35% vendas", "↓R$50k custos")
• Adapte palavras-chave para cada vaga (ATS)
• 1 página (júnior/pleno), 2 páginas (sênior)
• Evite: erros português, email informal, objetivo genérico`;
    }

    if (input.includes('entrevista') || input.includes('selecao') || input.includes('processo')) {
      return ` **PREPARACAO PARA ENTREVISTAS** - Metodo Aprovado:

 **METODO STAR** (Use em TODAS as perguntas comportamentais):
- **S**ituacao: Contexto breve
- **T**arefa: Seu papel/desafio
- **A**cao: O que VOCE fez especificamente
- **R**esultado: Impacto mensuravel

 **PERGUNTAS MAIS COMUNS:**
1. "Fale sobre voce" > Resumo profissional em 2 min
2. "Seu maior defeito" > Honestidade + acao de melhoria
3. "Conflito com colega" > Resolucao + aprendizado
4. "Por que essa empresa?" > Pesquisa + fit cultural
5. "Pretensao salarial" > Pesquise media + faixa aberta

 **ANTES DA ENTREVISTA:**
- Pesquise empresa (site, LinkedIn, noticias)
- Releia a vaga e seu curriculo
- Prepare 3-4 exemplos STAR
- Liste 2-3 perguntas para fazer
- Teste camera/microfone (se online)
- Chegue 10-15min antes

 **NEGOCIACAO SALARIAL:**
- Nunca de numero primeiro (se possivel)
- Responda: "Qual a faixa prevista para a posicao?"
- Se pressionado: de FAIXA, nao valor fixo
- Considere: salario + bonus + beneficios + crescimento

 **CUIDADO:** Falar mal de empresa anterior = eliminacao automatica!`;
    }

    if (input.includes('carreira') || input.includes('profissional') || input.includes('crescimento')) {
      return ` **ESTRATEGIA DE CARREIRA** - Plano de Acao:

 **AUTOAVALIACAO (Comece aqui!):**
1. Onde estou? (cargo, senioridade, salario)
2. Onde quero estar? (3 anos, 5 anos)
3. Gap de competencias? (hard + soft skills)
4. Mercado favoravel? (pesquise vagas)

 **PLANO DE DESENVOLVIMENTO (PDI):**
- **Curto prazo (6-12 meses):**
  - 1-2 cursos/certificacoes estrategicas
  - Assumir projeto desafiador atual
  - Expandir network (3+ novos contatos/mes)

- **Medio prazo (1-3 anos):**
  - Especializacao ou MBA
  - Mentor/Mentoria
  - Transicao de nivel (junior>pleno>senior)

 **NETWORKING EFETIVO:**
- LinkedIn otimizado (foto profissional, sobre, posts)
- Conecte com: recrutadores, lideres da area, colegas
- Comente posts (nao so like!)
- Eventos da area (online/presencial)
- Contribua: artigos, palestras, comunidades

 **TRANSICAO DE CARREIRA:**
1. Identifique competencias transferiveis
2. Faca cursos de transicao (bootcamp, etc)
3. Projetos paralelos/freelance na nova area
4. Network intensivo no setor-alvo
5. Candidate-se a vagas junior (se necessario)

 **INDICADORES DE SUCESSO:**
- Aumento salarial anual?
- Novas responsabilidades?
- Chamadas de recrutadores?
- Ofertass competitivas?`;
    }

    if (input.includes('linkedin') || input.includes('rede') || input.includes('network')) {
      return ` **LINKEDIN & NETWORKING ESTRATEGICO:**

 **PERFIL IDEAL:**
- Foto: profissional, fundo neutro, sorrindo
- Banner: area de atuacao ou marca pessoal
- Titulo: nao copie cargo! Use: "Cargo | Especialidade | Valor"
  Ex: "Desenvolvedor Full Stack | React & Node | Transformando ideias em produtos"
- Sobre: 3 paragrafos (quem e, o que faz, para onde vai)
- Experiencias: use bullet points com resultados
- Recomendacoes: peca a ex-gestores (credibilidade 10x)

 **ESTRATEGIA DE CONTEUDO:**
- Poste 2-3x/semana (minimo)
- Mix: aprendizados, conquistas, insights do mercado
- Comente em posts de lideres da area
- Compartilhe com opiniao propria (nao so repost)
- Use hashtags relevantes (#DevBrasil #RHtech)

 **NETWORKING ATIVO:**
1. Conecte com pedido personalizado (nao generico!)
2. Mensagem primeiro contato: interesse genuino
3. Apos conectar: agradeca + inicie conversa
4. Mantenha contato: comente posts, parabenize conquistas
5. Peca ajuda com tato: "Gostaria de um conselho sobre..."

 **VISIBILIDADE PARA RECRUTADORES:**
- "Disponivel para oportunidades" LIGADO
- Palavras-chave do cargo-alvo no perfil
- Participe de grupos da area
- Siga empresas-alvo e interaja com posts`;
    }

    // RECOLOCACAO/DESEMPREGO/PROCURANDO EMPREGO
    if (input.includes('desempregad') || input.includes('procurando') || input.includes('recoloca') || input.includes('sem emprego') || input.includes('demitid') || input.includes('busca')) {
      return `**PLANO DE RECOLOCACAO - ACAO IMEDIATA!**

Vou te dar o passo a passo EXATO pra voce voltar pro mercado rapido:

**ROTINA DIARIA (siga religiosamente!):**

**MANHA (3h):**
- 8h-9h: Atualizar LinkedIn + buscar 10 vagas
- 9h-10h: Candidatar-se a 5 vagas (curriculo adaptado!)
- 10h-11h: Networking - mensagens pra 5 contatos

**TARDE (3h):**
- 14h-15h: Curso/atualizacao profissional
- 15h-16h: Mais 5 candidaturas
- 16h-17h: LinkedIn - postar, comentar, conectar

**ONDE DEIXAR CURRICULO (faca HOJE!):**

**Sites Principais:**
- LinkedIn - perfil completo + "Disponivel pra oportunidades"
- Catho, InfoJobs, Indeed, Vagas.com
- Trampos.co, Gupy, Revelo
- Site das empresas (secao "Carreiras")

**Estrategias Extras:**
- Grupos Facebook/WhatsApp da sua area
- Empresas de recrutamento (Robert Half, Michael Page, etc)
- Eventos de networking (Meetup, Eventbrite)
- Indicacao - conte pra TODO MUNDO que ta procurando!

**EMPRESAS QUE MAIS CONTRATAM:**
- Tech: Mercado Livre, Nubank, iFood, Magalu
- Varejo: Magazine Luiza, Carrefour, Americanas
- Servicos: Uber, 99, Rappi, Loggi
- Call Center: Atento, Almaviva, Contax (contratacao rapida!)
- Temporario: Randstad, Adecco, ManpowerGroup

**ACELERE A RECOLOCACAO:**
1. **Freela enquanto busca** - Workana, 99Freelas, GetNinjas
2. **Atualize habilidades** - cursos rapidos (Google, Fundacao Bradesco - gratis!)
3. **Flexibilize** - aceite cargo menor temporariamente se precisar
4. **Network INTENSO** - 80% das vagas sao por indicacao!
5. **Preparacao** - estude entrevistas TODO DIA (30min)

**ERROS QUE ATRASAM:**
- Esperar "vaga perfeita" - candidate-se mesmo que nao tenha 100% dos requisitos
- Curriculo generico - ADAPTE pra cada vaga!
- Desanimar cedo - media sao 3-6 meses, mas com metodo certo pode ser 1-2 meses!
- Nao fazer networking - ESSENCIAL!

**PRECISA DE GRANA AGORA?**
- Uber/99 (motorista, entrega)
- iFood, Rappi (entregador)
- Freelancer.com, Workana
- Aulas particulares (Profes, Superprof)
- Venda online (Mercado Livre, OLX)

Voce VAI conseguir! Foco na rotina diaria e nao desiste!`;    }    // ONDE DEIXAR CURRICULO
    if (input.includes('onde') && (input.includes('curriculo') || input.includes('curriculo') || input.includes('deixar') || input.includes('enviar') || input.includes('cadastrar'))) {
      return `**ONDE DEIXAR SEU CURRICULO - LISTA COMPLETA!**

Vou te dar TODOS os lugares + estrategia pra cada um:

**SITES DE EMPREGO (cadastre em TODOS!):**

**Principais (obrigatorios!):**
1. **LinkedIn** - O MAIS IMPORTANTE!
   - Perfil completo (foto, sobre, experiencias)
   - Ative "Disponivel pra oportunidades"
   - Candidate-se E envie mensagem pro recrutador

2. **Catho** - Maior do Brasil
   - Atualize semanalmente (sobe no ranking)
   - Use palavras-chave da sua area

3. **Indeed** - Internacional, muitas vagas
4. **InfoJobs** - Bom pra inicio de carreira
5. **Vagas.com** - Variedade de setores

**Sites Especializados:**
- **Tech**: Trampos.co, GeekHunter, Revelo, GPTW
- **Executivo**: Catho, Manager, LinkedIn
- **Estagio**: Vagas.com, CIEE, Nube, IEL
- **Temporario**: Randstad, Adecco, ManpowerGroup

**DIRETO NAS EMPRESAS:**

**Como fazer:**
1. Liste 20 empresas que quer trabalhar
2. Acesse site > secao "Trabalhe Conosco" ou "Carreiras"
3. Cadastre curriculo no banco de talentos
4. Siga no LinkedIn e interaja com posts

**Empresas que mais contratam:**
- **Varejo**: Magazine Luiza, Carrefour, Lojas Americanas
- **Tech**: Mercado Livre, Nubank, iFood, Magalu
- **Logistica**: Correios, Loggi, Total Express
- **Servicos**: Uber, 99, Rappi, iFood
- **Call Center**: Atento, Almaviva, Contax (contratacao rapida!)

**RECRUTADORAS/CONSULTORIAS:**
- Robert Half
- Michael Page
- Page Personnel
- Randstad
- Manpower
- Adecco

**NETWORKING (80% das vagas!):**
- Grupos no Facebook da sua area
- Grupos no WhatsApp/Telegram
- Eventos no Meetup/Eventbrite
- Ex-colegas - AVISE que esta procurando!
- Familiares e amigos - peca indicacao

**ESTRATEGIA MATADORA:**

**Semana 1:**
Dia 1-2: Cadastre em TODOS os sites
Dia 3-4: Perfil LinkedIn impecavel
Dia 5: Entre em 10 grupos da area

**A partir da Semana 2:**
- 5 candidaturas/dia (curriculo adaptado!)
- 5 mensagens de networking/dia
- Atualizar perfis 1x/semana (LinkedIn, Catho)
- Postar no LinkedIn 2x/semana

**DICA DE OURO:**
Nao so candidate - MENSAGEM PRO RECRUTADOR!
"Oi [nome], vi a vaga de [cargo] e me identifiquei muito. Minha experiencia em [area] pode agregar porque [motivo]. Meu curriculo esta anexo. Podemos conversar?"`;    }    // MUDANCA DE AREA/TRANSICAO DE CARREIRA
    if (input.includes('mudar') || input.includes('transicao') || input.includes('trocar de area') || input.includes('mudar de area') || input.includes('nova carreira')) {
      return `**TRANSICAO DE CARREIRA - PLANO DE ACAO!**

Vou te mostrar o caminho pra mudar de area SEM comecar do zero:

**PASSO 1: MAPEAMENTO (faca HOJE!):**

**Onde voce esta:**
- Area atual:
- Habilidades que tem:
- O que NAO quer mais fazer:

**Onde quer chegar:**
- Nova area desejada:
- Por que? (seja honesto!):
- Habilidades que faltam:

**PASSO 2: HABILIDADES TRANSFERIVEIS**

Voce TEM valor! Identifique o que e aproveitavel:

**Exemplos:**
- Vendas > Marketing: comunicacao, negociacao, CRM
- Professor > RH: didatica, gestao de pessoas, apresentacao
- Engenheiro > Gestao: analise, resolucao de problemas, projetos
- Admin > Produtos: organizacao, processos, stakeholders

**PASSO 3: PLANO DE 90 DIAS**

**MES 1 - IMERSAO:**
- Semana 1-2: 2 cursos online da area (Coursera, Udemy)
- Semana 3-4: Entre em 5 grupos/comunidades da area
- Durante: Siga 20 profissionais no LinkedIn
- Leia: 1 livro referencia da area

**MES 2 - PRATICA:**
- Projeto pessoal relacionado (portfolio!)
- Freela pequeno (Workana, 99Freelas)
- Voluntariado na area (experiencia!)
- Networking: 3 cafes virtuais com profissionais

**MES 3 - TRANSICAO:**
- LinkedIn atualizado (destaque habilidades transferiveis!)
- Curriculo reformulado (foco na nova area)
- Candidaturas: vagas junior/trainee da nova area
- Entrevistas: conte sua historia de transicao!

**CURSOS/CERTIFICACOES RAPIDAS:**

**Gratuitos:**
- Google (Marketing, Analise de Dados, Suporte TI)
- Fundacao Bradesco (diversos)
- LinkedIn Learning (1 mes gratis)
- Coursera (bolsas disponiveis)

**Pagos (valem o investimento!):**
- Udemy (R$30-50 em promocao)
- Alura (assinatura)
- Rocketseat (pra tech)

**ESTRATEGIAS QUE FUNCIONAM:**

**1. Cargo hibrido primeiro:**
Em vez de saltar direto, busque funcao que una as duas areas
Ex: Vendedor > Analista de Marketing (usa background comercial!)

**2. Empresa menor/startup:**
Mais flexivel pra aceitar transicao
Pode usar "flexibilidade salarial" como argumento

**3. Projeto paralelo:**
Mantenha emprego atual + desenvolva skills a noite/fim de semana
Quando tiver portfolio > transicao segura!

**4. Network e TUDO:**
80% das transicoes sao por indicacao de quem acreditou em voce!

**ERROS FATAIS:**
- Pedir demissao antes de se preparar
- Nao ter portfolio/projetos
- Esconder experiencia anterior (DESTAQUE as habilidades transferiveis!)
- Desanimar com "nao" - voce esta mudando de area, e normal!

**COMO VENDER SUA TRANSICAO NA ENTREVISTA:**

"Trabalhei X anos em [area antiga] onde desenvolvi [habilidades]. Percebi que minha paixao esta em [nova area] e nos ultimos meses me especializei atraves de [cursos/projetos]. Minha experiencia em [area antiga] me diferencia porque [vantagem unica]!"

**EXEMPLO REAL:**
"Fui professor por 5 anos, onde desenvolvi comunicacao e didatica. Descobri paixao por RH e fiz certificacao em Gestao de Pessoas. Minha experiencia educacional me diferencia no T&D - sei como as pessoas aprendem!"`;    }    // COMPORTAMENTO EM ENTREVISTA
    if (input.includes('comportamento') || input.includes('como agir') || input.includes('postura') || input.includes('atitude')) {
      return `**COMPORTAMENTO EM ENTREVISTA - GUIA COMPLETO!**

**O QUE FAZER (Checklist!):**

**ANTES:**
- Chegue 10-15min ANTES (nunca atrasado!)
- Pesquise a empresa (site, LinkedIn, noticias)
- Releia a vaga e SEU curriculo
- Desligue celular (ou modo silencioso)
- Banheiro antes (aparencia ok?)

**LINGUAGEM CORPORAL:**
- **Aperto de mao:** Firme (nao frouxo, nem esmagador)
- **Postura:** Costas retas, ombros relaxados
- **Olhar:** Contato visual constante (sem encarar!)
- **Sorriso:** Natural, simpatico
- **Maos:** Sobre mesa ou colo (nao cruzar bracos!)
- **Gestos:** Naturais ao falar (sem exagero)

**TOM DE VOZ:**
- Volume adequado (nem baixo, nem alto)
- Ritmo calmo (nao atropele!)
- Pausas pra pensar = ok!
- Entusiasmo na medida (mostre interesse!)

**DURANTE A CONVERSA:**

**FACA:**
- Chame pelo nome ("Como o senhor mencionou, [nome]...")
- Ouca ATIVAMENTE (nao interrompa)
- Faca anotacoes (mostra interesse)
- Responda de forma ESTRUTURADA (inicio-meio-fim)
- De exemplos praticos (metodo STAR)
- Mostre entusiasmo pela vaga
- Faca perguntas inteligentes no final

**NAO FACA:**
- Falar MAL de empresa/chefe anterior (NUNCA!)
- Mentir (sempre descobrem)
- Interromper o entrevistador
- Olhar pro celular
- Mexer no cabelo, roer unha, cocar
- Cruzar bracos (defensivo)
- Falar demais ou pouco demais
- Parecer desesperado

**SITUACOES ESPECIFICAS:**

**1. Quando nao sabe responder:**
- "Excelente pergunta! Posso pensar um momento?"
- "Nao tenho experiencia especifica nisso, mas ja enfrentei [situacao similar]..."
- Nao invente! Seja honesto.

**2. Pergunta sobre defeito:**
- Defeito REAL + o que esta fazendo pra melhorar
"Sou perfeccionista demais, as vezes perco tempo em detalhes. Aprendi a priorizar usando [metodo/ferramenta] e melhorei muito."

**3. Pergunta sobre pretensao salarial:**
- "Qual a faixa prevista pra posicao?"
- Se insistirem: "Entre R$ X e R$ Y, dependendo do pacote completo"

**4. Quando fazem silencio (testando voce):**
- Mantenha calma, sorria, espere
- Pode complementar resposta se tiver algo relevante

**PERGUNTAS PRA FAZER NO FINAL:**

Quando perguntarem "Tem alguma duvida?":

**SEMPRE faca 2-3 perguntas! Mostra interesse!**

- "Como e o dia a dia da equipe?"
- "Quais os principais desafios da posicao nos primeiros 3 meses?"
- "Como voces medem sucesso nessa funcao?"
- "Quais as oportunidades de crescimento?"
- "Proximos passos do processo?"

**NAO pergunte logo de cara sobre:**
- Salario (espere eles falarem primeiro)
- Beneficios (primeira fase nao)
- Home office/horarios (so se oferecerem)

**FECHAMENTO:**

- Agradeca a oportunidade
- Reforce interesse: "Adorei conhecer mais, me identifiquei muito com [algo especifico]"
- Pergunte proximos passos
- Aperto de mao firme + sorriso
- Depois: Envie email de agradecimento (diferencial!)

**EMAIL POS-ENTREVISTA (envie no mesmo dia!):**

Assunto: Obrigado pela oportunidade - [Seu Nome]

"Ola [Nome],

Obrigado pela conversa hoje sobre a vaga de [cargo]. Fiquei ainda mais entusiasmado com a oportunidade de [algo especifico que discutiram].

Minha experiencia em [area] pode contribuir especialmente em [desafio que mencionaram].

Fico a disposicao para proximas etapas!

Abraco,
[Seu nome]"

**RED FLAGS QUE ELIMINAM:**
- Atraso
- Celular tocando/olhando
- Falar mal de outros
- Aparecer despreparado
- Excesso de confianca/arrogancia
- Postura desleixada

Voce vai mandar bem! Qualquer duvida especifica, to aqui!`;    }    if (input.includes('salario') || input.includes('salario') || input.includes('negociar') || input.includes('proposta')) {
      return `**NEGOCIACAO SALARIAL - Guia Pratico:**

**PESQUISA DE MERCADO (OBRIGATORIO!):**
- Glassdoor Brasil
- Catho (Guia Salarial)
- LinkedIn Salary
- Comunidades da area (Discord, Telegram)
- Conversas com colegas

**ESTRATEGIA DE NEGOCIACAO:**

**1. QUANDO PERGUNTAREM PRETENSAO:**
- NAO diga: "Ah, qualquer valor esta bom"
- NAO de valor unico: "R$ 5.000"
- DIGA: "Qual a faixa prevista para a posicao?"
- SE PRESSIONADO: "Baseado no mercado, entre R$ X e R$ Y"

**2. CALCULANDO SUA FAIXA:**
- Minimo: abaixo NAO aceita
- Ideal: mercado + seu valor
- Teto: sem perder credibilidade
  Ex: R$ 6k (min) - R$ 7,5k (ideal) - R$ 8,5k (teto)

**3. ALEM DO SALARIO (NEGOCIE!):**
- Bonus/PLR
- Vale alimentacao/refeicao
- Plano saude (% empresa paga)
- Home office (dias/semana)
- Horario flexivel
- Budget para cursos
- Stock options (startups)
- Dia de aniversario
- Ferias (30 dias desde inicio?)

**4. COMO PEDIR AUMENTO (EMPREGO ATUAL):**
1. Documente resultados (numeros!)
2. Pesquise mercado
3. Marque 1:1 com gestor
4. Apresente: valor entregue + pesquisa + pedido
5. Se negado: peca plano claro para conseguir
6. Prazo? Busque mercado externamente

**NUNCA FACA:**
- Mentir sobre proposta concorrente
- Exigir sem mostrar valor
- Ameacar sair sem intencao
- Aceitar imediatamente primeira oferta`;
    }

    // Resposta padrao PROATIVA - nao pede reformulacao, oferece ajuda direta
    return `Oi! Vejo que voce esta buscando ajuda com sua carreira - deixa eu te dar umas dicas rapidas que podem te ajudar AGORA mesmo!

**ACOES PRATICAS QUE VOCE PODE FAZER HOJE:**

**Curriculo matador?**
Seu curriculo PRECISA ter: resultados quantificados (numeros!), verbos de acao, palavras-chave da vaga. Formato PDF, maximo 2 paginas. SEM erros de portugues!

**Onde deixar curriculo?**
- LinkedIn (otimizado!)
- Catho, Indeed, Vagas.com
- Site das empresas (aba "Trabalhe Conosco")
- Grupos no Facebook/WhatsApp da sua area
- Networking - conte pra TODOS que esta procurando!

**Preparacao express pra entrevista?**
1. Pesquise a empresa (15min no site + LinkedIn)
2. Releia a vaga e seu curriculo
3. Prepare resposta pra "fale sobre voce" (2 minutos)
4. Tenha 2 perguntas pra fazer
5. Roupa: sempre um nivel acima do dress code

**Recolocacao rapida?**
- Atualize LinkedIn HOJE
- Avise 10 contatos que esta buscando
- Candidate-se a 5 vagas/dia
- Entre em grupos da area
- Considere freela enquanto busca CLT

**Me conte especificamente:**
"Preciso melhorar meu curriculo"
"Tenho entrevista amanha"
"Onde deixo curriculo pra [area]?"
"Estou desempregado, e agora?"
"Como negocio salario?"

To aqui pra te dar o caminho exato!`;
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
          // Formulario de dados do usuario
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
              Comecar conversa com JobIA
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
                placeholder="Me conta seu desafio... (curriculo, entrevista, recolocacao, salario...)"
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

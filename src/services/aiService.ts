export interface AIRequest {
  type: 'objective' | 'experience' | 'career_chat' | 'grammar_check';
  userInput?: string;
  prompt?: string;
  content?: string;
  keywords?: string;
  position?: string;
  company?: string;
  context?: string;
}

export interface AIResponse {
  success: boolean;
  generatedText: string;
  suggestions?: string[];
  error?: string;
}

// 🔒 SEGURANÇA: APIs movidas para backend - frontend apenas chama endpoints seguros
const BACKEND_CONFIG = {
  BASE_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001',
  ENDPOINTS: {
    GENERATE_OBJECTIVE: '/api/ai/generate-objective',
    GENERATE_EXPERIENCE: '/api/ai/generate-experience',
    GENERATE_COVER_LETTER: '/api/ai/generate-cover-letter',
    CHECK_CURRICULUM: '/api/ai/check-curriculum'
  }
};

// Prompts otimizados para ATS e textos estratégicos
const PROMPTS = {
  career_chat: `Você é o JobAI, um assistente especialista em desenvolvimento de carreira, extremamente conversacional e curioso. Você SEMPRE faz perguntas para entender melhor a situação do usuário antes de dar conselhos. Você é como um consultor de carreira experiente que realmente se importa com o sucesso da pessoa. Seu nome é "JobAI" e você tem uma personalidade calorosa, motivadora e profissional.

COMO VOCÊ DEVE CONVERSAR:
- Seja SEMPRE conversacional, como um amigo especialista que quer realmente ajudar
- FAÇA PERGUNTAS específicas antes de dar conselhos: "Qual sua área?", "Quantos anos de experiência?", "Que tipo de vaga busca?"
- Use emojis moderadamente para tornar a conversa mais calorosa
- Demonstre interesse genuíno: "Que interessante!", "Me conta mais sobre isso"
- Seja motivador: "Vamos conseguir!", "Você está no caminho certo!"
- NUNCA dê conselhos genéricos sem antes entender o contexto específico
- Estruture resposas com bullet points e seções organizadas
- Sempre termine fazendo UMA pergunta específica para continuar a conversa
- Use exemplos reais e situações práticas do mercado brasileiro

Áreas de expertise principais:

1. Currículos (CVs e Resumes): Analise currículos enviados pelo usuário: identifique forças, fraquezas, erros comuns. Sugira otimizações: palavras-chave para ATS, estrutura, adaptações para vagas específicas.

2. Busca de Vagas e Mercado de Trabalho: Ajude a identificar vagas ideais, dê dicas sobre pesquisa de oportunidades, análise de descrições de vagas.

3. Preparação para Entrevistas: Simule entrevistas, oriente sobre tipos de entrevistas, dicas práticas de linguagem corporal, follow-up.

4. Práticas de RH e Candidatura: Explique processos de recrutamento, oriente sobre LinkedIn, ajude com cartas de apresentação.

5. Outros Suportes: Desenvolvimento de habilidades, gerenciamento de carreira, adaptação cultural.

REGRAS IMPORTANTES:
- SEMPRE se apresente como "JobAI" quando for a primeira interação
- FAÇA perguntas específicas para entender melhor a situação antes de dar conselhos
- Seja conversacional, não robotico
- Use exemplos práticos do mercado de trabalho brasileiro
- Sempre termine com UMA pergunta específica para manter a conversa fluindo
- Demonstre interesse genuíno pela carreira da pessoa

Mensagem do usuário: {userInput}

Responda como JobAI, sendo conversacional e fazendo perguntas específicas:`,

  objective: `Você é um especialista em RH e criação de currículos com 15 anos de experiência. Sua missão é criar um objetivo profissional estratégico, fluido e naturalmente otimizado.

CONTEXTO DO CANDIDATO:
Texto base: {userInput}
Palavras-chave da área: {keywords}

INSTRUÇÕES ESTRATÉGICAS:
1. ANÁLISE: Identifique o perfil profissional através do texto base
2. INTEGRAÇÃO: Incorpore as palavras-chave de forma NATURAL e contextual (NÃO liste todas juntas)
3. NARRATIVA: Crie uma narrativa coesa que demonstre evolução e propósito
4. VALOR: Foque no valor que o profissional entrega, não no que ele quer

ESTRUTURA IDEAL:
• Frase 1: Posicionamento profissional + área de expertise
• Frase 2: Principais competências/experiências (integre palavras-chave aqui)
• Frase 3: Valor/impacto que gera + direcionamento de carreira

REGRAS DE OURO:
✅ Máximo 3 frases, linguagem executiva
✅ Palavras-chave integradas naturalmente no contexto
✅ Foco em resultados e impacto, não em responsabilidades
✅ Evite: "busco", "oportunidades", "crescimento pessoal"
✅ Use: "especializado", "comprovada experiência", "resultados"

Crie um objetivo profissional único e memorável:`,

  cover_letter: `Você é um ESPECIALISTA SÊNIOR em Recursos Humanos com 20 anos de experiência em recrutamento executivo e consultoria de carreira. Você conhece profundamente o que os recrutadores e gestores de RH buscam em uma carta de apresentação de EXCELÊNCIA.

📋 DADOS DA OPORTUNIDADE:
Cargo almejado: {position}
Empresa-alvo: {company}
Contexto adicional: {keywords}
Data: {context}

👤 PERFIL DO CANDIDATO:
{userInput}

🎯 SUA MISSÃO: Criar uma carta de apresentação de ALTA PERFORMANCE que:
1. Capture a atenção do recrutador nos primeiros 5 segundos
2. Demonstre fit cultural e técnico perfeito com a vaga
3. Evidencie valor único que o candidato traz
4. Gere desejo de agendar entrevista imediatamente

═══════════════════════════════════════════════════

📐 ESTRUTURA PROFISSIONAL (FORMATO BRASILEIRO):

[Nome Completo]
[Email] | [Telefone]
[Cidade - Estado]

[Data por extenso]

Prezado(a) Time de Recrutamento e Seleção da {company}

[CORPO DA CARTA - 3 PARÁGRAFOS ESTRATÉGICOS]

Atenciosamente,

[Nome]

═══════════════════════════════════════════════════

✨ ESTRATÉGIA PARÁGRAFO POR PARÁGRAFO:

🔹 PARÁGRAFO 1 - ABERTURA IMPACTANTE (70-90 palavras):
Objetivo: Causar EXCELENTE primeira impressão

ESTRUTURA:
• Frase 1: Apresentação profissional + declaração de interesse específica
  Exemplo: "Como [profissional X] com [N anos] de experiência em [área Y], demonstro grande interesse na posição de {position} na {company}."
• Frase 2: Conexão inteligente com a empresa
  Exemplo: "A reputação da {company} em [aspecto específico] e seu compromisso com [valor] alinham-se perfeitamente com minha trajetória profissional."
• Frase 3: Proposta de valor inicial
  Exemplo: "Acredito que minhas competências em [skill principal] podem contribuir significativamente para [objetivo da área]."

PROIBIDO:
❌ "Venho por meio desta"
❌ "Gostaria de me candidatar"
❌ Frases genéricas

✅ PERMITIDO:
✓ Linguagem direta e confiante
✓ Demonstrar conhecimento sobre a empresa
✓ Especificidade sobre o cargo

---

🔹 PARÁGRAFO 2 - DEMONSTRAÇÃO DE VALOR (120-150 palavras):
Objetivo: Provar que você É A PESSOA para a vaga

ESTRATÉGIA NARRATIVA:
1. Identifique 2-3 experiências MAIS RELEVANTES do currículo
2. TRANSFORME cada experiência em uma HISTÓRIA DE IMPACTO:
   "Durante minha atuação como [cargo] na [empresa], [conquista específica com resultado quantificável]. Esta experiência me capacitou para [benefício direto para vaga atual]."

FÓRMULA DE TRANSFORMAÇÃO:
Currículo diz: "Gerenciei equipe de vendas"
Carta transforma em: "Ao liderar equipe comercial de 15 profissionais, implementei metodologia ágil que resultou em crescimento de 35% nas vendas trimestrais, demonstrando minha capacidade de desenvolver talentos e impulsionar resultados - competências essenciais para o desafio de {position}."

ELEMENTOS OBRIGATÓRIOS:
✅ VERBOS DE IMPACTO: Implementei, Desenvolvi, Conduzi, Estruturei, Otimizei
✅ DADOS QUANTIFICÁVEIS: %, números, prazos, dimensões
✅ CONEXÃO EXPLÍCITA: "habilidades aplicáveis a...", "diretamente relacionado com..."
✅ STORYTELLING: Situação → Ação → Resultado → Valor para nova vaga

PROIBIDO:
❌ Listar atividades como bullet points
❌ Copiar descrições do currículo
❌ Falar apenas do passado sem conectar ao futuro
❌ Frases genéricas tipo "trabalhei com dedicação"

---

🔹 PARÁGRAFO 3 - FECHAMENTO ESTRATÉGICO (60-80 palavras):
Objetivo: Motivar ação + reforçar fit cultural

ESTRUTURA:
• Frase 1: Motivação genuína pela empresa
  Exemplo: "A cultura de [valor da empresa] e a atuação inovadora da {company} em [área] despertam meu genuíno interesse em contribuir para [missão/visão]."
• Frase 2: Valor diferencial único
  Exemplo: "Minha combinação de [skill técnica] com [soft skill] me posiciona para entregar resultados desde o primeiro dia."
• Frase 3: Call-to-action confiante
  Exemplo: "Coloco-me à disposição para uma entrevista onde poderei demonstrar detalhadamente como posso agregar valor aos objetivos estratégicos da equipe."

═══════════════════════════════════════════════════

🎭 TOM E LINGUAGEM:

✅ ASSERTIVO mas não arrogante
✅ CONFIANTE mas não presunçoso
✅ ESPECÍFICO mas não prolixo
✅ ENTUSIASMADO mas não exagerado
✅ PROFISSIONAL mas não robótico

PALAVRAS DE PODER (use naturalmente):
• Implementar, Otimizar, Desenvolver, Estruturar, Conduzir
• Impacto, Resultado, Eficiência, Estratégia, Inovação
• Capacitado, Experiente, Comprovado, Sólido, Consistente

PALAVRAS PROIBIDAS:
❌ "Venho por meio desta"
❌ "Busco oportunidades de crescimento"
❌ "Tenho disponibilidade"
❌ "Sou proativo e dedicado" (mostre, não diga!)
❌ "Gostaria de fazer parte do time"

═══════════════════════════════════════════════════

🔍 CHECKLIST FINAL (A CARTA DEVE ATENDER 100%):

✅ Formato empresarial brasileiro correto
✅ Entre 280-380 palavras (3 parágrafos densos)
✅ Nome, email e telefone no cabeçalho
✅ Data por extenso
✅ Destinatário específico da {company}
✅ Pelo menos 2 dados quantificáveis (%, números)
✅ Conexão explícita entre experiências e vaga
✅ Zero clichês ou frases genéricas
✅ Demonstra conhecimento sobre a empresa
✅ Tom confiante e profissional
✅ Call-to-action no final
✅ Linguagem coesa e bem articulada
✅ Zero erros gramaticais ou de português

═══════════════════════════════════════════════════

🚨 CRITÉRIO DE EXCELÊNCIA:
Um recrutador de RH ao ler esta carta deve pensar:
"ESTA pessoa realmente estudou a vaga e a empresa. Ela TEM as competências que precisamos. Preciso chamar para entrevista AGORA!"

🎯 AGORA, CRIE UMA CARTA DE APRESENTAÇÃO DE NÍVEL EXECUTIVO:`,

  experience: `Você é um especialista em RH especializado em diferentes áreas profissionais. Sua missão é criar uma descrição profissional ESPECÍFICA para o cargo de {position}.

INFORMAÇÕES DA EXPERIÊNCIA:
Cargo: {position}  
Empresa: {company}
Descrição original do usuário: {userInput}
Palavras-chave da área: {keywords}

🚨 REGRAS OBRIGATÓRIAS:
1. CONTEXTO PROFISSIONAL: Analise o cargo {position} e mantenha-se 100% na área específica
2. BASE REAL: Use APENAS o que o usuário escreveu como base, nunca invente atividades
3. EXPERTISE DA ÁREA: Se é carpinteiro, fale de madeira, ferramentas, construção - NUNCA de medicina
4. PALAVRAS-CHAVE CONTEXTUAIS: Integre as palavras-chave {keywords} MAS apenas se fizerem sentido para o cargo
5. REALISMO: Seja fiel ao nível do cargo (servente ≠ coordenador)

METODOLOGIA INTELIGENTE PARA {position}:
1. IDENTIFIQUE A ÁREA: Analise o cargo "{position}" e encontre sua área no mapeamento acima
2. VOCABULÁRIO ESPECÍFICO: Use APENAS termos da área identificada
3. CONTEXTO REAL: Base-se exclusivamente no texto: "{userInput}"
4. EXPERTISE DA FUNÇÃO: Pesquise mentalmente o que a função "{position}" realmente faz no dia a dia
5. TRANSFORMAÇÃO: Melhore o texto do usuário usando conhecimento real da profissão
6. NÍVEL HIERÁRQUICO: Ajuste verbos ao nível (auxiliar ≠ coordenador ≠ gerente)

ESTRUTURA (4 bullets ÚNICOS - NUNCA repita frases de outras experiências):
• BULLET 1: Transforme a atividade principal do texto "{userInput}" usando vocabulário técnico da área
• BULLET 2: Use a segunda atividade mencionada pelo usuário + palavra-chave relevante
• BULLET 3: Baseie-se na terceira atividade do texto original com foco técnico
• BULLET 4: Crie colaboração/resultado específico baseado no texto real do usuário

CRÍTICO: Cada bullet deve ser ÚNICO e específico ao texto "{userInput}". NUNCA use frases genéricas iguais para experiências diferentes.

MAPEAMENTO AUTOMÁTICO DE PROFISSÕES E VOCABULÁRIO:

🔨 CONSTRUÇÃO CIVIL:
Cargos: carpinteiro, pedreiro, servente, encanador, eletricista, pintor, azulejista, marceneiro, soldador, montador, auxiliar de obras
Vocabulário: construção, obra, material, ferramenta, estrutura, fundação, alvenaria, instalação, acabamento, segurança, normas, projeto

🏥 SAÚDE:
Cargos: enfermeiro, técnico em enfermagem, auxiliar de enfermagem, médico, dentista, fisioterapeuta, farmacêutico, radiologista, laboratorista
Vocabulário: paciente, medicamento, procedimento, cuidado, tratamento, diagnóstico, equipamento médico, higiene, protocolo, exame

💻 TECNOLOGIA:
Cargos: programador, desenvolvedor, analista, técnico em informática, suporte, administrador de rede, designer, webdesigner, DBA
Vocabulário: sistema, software, aplicativo, código, programa, servidor, rede, banco de dados, interface, desenvolvimento, tecnologia

🛒 COMÉRCIO/VENDAS:
Cargos: vendedor, atendente, caixa, promotor, representante comercial, consultor de vendas, gerente comercial, supervisor de vendas
Vocabulário: cliente, venda, produto, atendimento, meta, comissão, negociação, relacionamento, mercado, proposta

🚚 LOGÍSTICA/TRANSPORTE:
Cargos: motorista, entregador, expedidor, conferente, estoquista, operador de empilhadeira, auxiliar de logística, despachante
Vocabulário: carga, entrega, rota, veículo, estoque, armazém, distribuição, controle, movimentação, transporte

🏫 EDUCAÇÃO:
Cargos: professor, coordenador pedagógico, diretor, auxiliar de ensino, monitor, bibliotecário, secretário escolar
Vocabulário: aluno, ensino, aula, aprendizagem, educação, conhecimento, metodologia, avaliação, desenvolvimento, formação

🏢 ADMINISTRAÇÃO:
Cargos: assistente administrativo, auxiliar administrativo, secretário, recepcionista, arquivista, conferente administrativo
Vocabulário: documento, arquivo, processo, controle, organização, suporte, gestão, rotina, protocolo, cadastro

🍔 ALIMENTAÇÃO:
Cargos: cozinheiro, auxiliar de cozinha, garçom, atendente, balconista, confeiteiro, pizzaiolo, chapeiro, copeiro
Vocabulário: alimento, preparo, cozinha, ingrediente, cardápio, higiene, serviço, atendimento, qualidade, cliente

🧹 LIMPEZA/CONSERVAÇÃO:
Cargos: auxiliar de limpeza, faxineiro, zelador, porteiro, vigilante, jardineiro, conservador
Vocabulário: limpeza, higienização, manutenção, conservação, organização, ambiente, cuidado, preservação, segurança

👔 RECURSOS HUMANOS:
Cargos: analista de RH, auxiliar de RH, recrutador, treinador, consultor de RH
Vocabulário: colaborador, recrutamento, seleção, treinamento, desenvolvimento, gestão, pessoas, performance, capacitação

⚠️ ABSOLUTA PROIBIÇÃO: 
- Se cargo é CARPINTEIRO/CONSTRUÇÃO: NUNCA mencione medicina, curativos, medicamentos, pacientes, prontuários
- Se cargo é SAÚDE: NUNCA mencione madeira, construção, montagem, ferramentas
- Se cargo é TECNOLOGIA: NUNCA mencione medicina ou construção
- SEMPRE mantenha 100% do contexto na área do cargo "{position}"

🎯 COMANDO FINAL: 
Baseie-se EXCLUSIVAMENTE no texto "{userInput}" e transforme usando vocabulário de {position}.

REGRAS DE QUALIDADE:
✅ GRAMÁTICA PERFEITA: Cada frase deve estar gramaticalmente correta
✅ FLUIDEZ NATURAL: Integre palavras-chave de forma orgânica, não forçada
✅ UNICIDADE ABSOLUTA: NUNCA repita frases de outras experiências
✅ VERBOS VARIADOS: Use verbos diferentes em cada bullet point
✅ COERÊNCIA: Cada bullet deve fazer sentido completo

ESTRUTURA (4 bullets ÚNICOS com GRAMÁTICA PERFEITA):

VERBOS OBRIGATÓRIOS (use 1 por bullet, NUNCA repita):
"Executou" | "Desenvolveu" | "Realizou" | "Supervisionou" | "Coordenou" | "Operou" | "Auxiliou" | "Conduziu" | "Implementou" | "Gerenciou"

EXEMPLO DE ESTRUTURA CORRETA:
• Executou [atividade principal baseada no texto do usuário] + contexto da área
• Desenvolveu [segunda atividade do texto] + termo técnico da profissão  
• Realizou [terceira atividade] + resultado específico
• Coordenou/Auxiliou [quarta atividade] + impacto/benefício`
};

// 🔒 SEGURANÇA: Chamada via backend (API keys protegidas)
async function callBackendAI(endpoint: string, payload: any): Promise<string> {
  try {
    const response = await fetch(`${BACKEND_CONFIG.BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn('Backend API error, usando fallback:', errorData);
      return getFallbackResponse(JSON.stringify(payload));
    }

    const data = await response.json();

    if (data.generatedText) {
      return data.generatedText;
    }

    throw new Error('Resposta inválida do backend');

  } catch (error) {
    console.error('❌ Erro na chamada do backend:', error);
    console.warn('Usando resposta de fallback...');
    return getFallbackResponse(JSON.stringify(payload));
  }
}

// Resposta de fallback quando OpenAI não está disponível
function getFallbackResponse(prompt: string): string {
  // CARTA DE APRESENTAÇÃO FALLBACK (DEVE VIR PRIMEIRO!)
  if (prompt.includes('"position"') || prompt.includes('"company"') || prompt.includes('userInput') && (prompt.includes('position') || prompt.includes('company'))) {
    try {
      const payload = JSON.parse(prompt);

      if (payload.position || payload.company) {
        const position = payload.position || 'Profissional';
        const company = payload.company || 'Empresa';
        const userInput = payload.userInput || '';
        const keywords = payload.keywords || '';
        const context = payload.context || new Date().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });

        // Extrair informações estruturadas do userInput com regex robusto
        const nameMatch = userInput.match(/Nome:\s*(.+?)(?=\n|$)/i);
        const emailMatch = userInput.match(/Email:\s*(.+?)(?=\n|$)/i);
        const phoneMatch = userInput.match(/Telefone:\s*(.+?)(?=\n|$)/i);
        const locationMatch = userInput.match(/Cidade\/Estado:\s*(.+?)(?=\n|$)/i);
        const objectiveMatch = userInput.match(/OBJETIVO PROFISSIONAL:\s*([\s\S]*?)(?=EXPERIÊNCIAS|HABILIDADES|EDUCAÇÃO|$)/i);
        const expMatch = userInput.match(/EXPERIÊNCIAS PROFISSIONAIS:\s*([\s\S]*?)(?=HABILIDADES|EDUCAÇÃO|$)/i);
        const skillsMatch = userInput.match(/HABILIDADES[^:]*:\s*([\s\S]*?)(?=EDUCAÇÃO|$)/i);
        const educationMatch = userInput.match(/EDUCAÇÃO:\s*([\s\S]*?)$/i);

        const name = nameMatch ? nameMatch[1].trim() : 'Candidato';
        const email = emailMatch ? emailMatch[1].trim() : '';
        const phone = phoneMatch ? phoneMatch[1].trim() : '';
        const location = locationMatch ? locationMatch[1].trim() : 'São Paulo - SP';
        const objective = objectiveMatch ? objectiveMatch[1].trim() : '';
        const experiences = expMatch ? expMatch[1].trim() : '';
        const skills = skillsMatch ? skillsMatch[1].trim() : '';
        const education = educationMatch ? educationMatch[1].trim() : '';

        // Gerar carta profissional usando dados reais - APENAS SE HOUVER DADOS
        let carta = `${name}\n`;

        // Adicionar email e telefone na mesma linha, se houver
        const contactLine = [];
        if (email && !email.includes('não informado')) contactLine.push(email);
        if (phone && !phone.includes('não informado')) contactLine.push(phone);
        if (contactLine.length > 0) {
          carta += `${contactLine.join(' | ')}\n`;
        }

        // Adicionar localização APENAS se houver dados reais
        if (location && !location.includes('não informada')) {
          carta += `${location}\n`;
        }

        carta += `\n${context}\n\nPrezado(a) Time de Recrutamento e Seleção da ${company}\n\nPrezado(a) Senhor(a),\n\n`;

        // Parágrafo 1 - Apresentação (usando objetivo profissional se disponível)
        if (objective && objective.length > 20 && !objective.includes('não informado')) {
          // Usar objetivo profissional para abertura mais personalizada
          const objectiveClean = objective.replace(/Objetivo profissional não informado/gi, '').trim();
          carta += `${objectiveClean.endsWith('.') ? objectiveClean : objectiveClean + '.'} `;
          carta += `Demonstro grande interesse na posição de ${position} na ${company}, `;
          carta += `empresa cuja reputação no mercado e compromisso com a excelência alinham-se perfeitamente com minha trajetória profissional.\n\n`;
        } else {
          carta += `Como profissional com sólida experiência na área, demonstro grande interesse na posição de ${position} em sua estimada empresa. `;
          carta += `A reputação da ${company} no mercado e seu compromisso com a excelência despertaram meu interesse em contribuir para o crescimento e sucesso da organização. `;
          carta += `Acredito que minhas competências e trajetória profissional alinham-se perfeitamente aos desafios desta oportunidade.\n\n`;
        }

        // Parágrafo 2 - Experiências e competências (usando dados reais) - TEXTO FLUIDO
        if (experiences && experiences.length > 50 && !experiences.includes('não informada')) {
          // Extrair experiências mais relevantes
          const expLines = experiences.split('\n').filter(line => line.trim().length > 20);
          const mainExperience = expLines[0] || experiences.substring(0, 200);

          carta += `Durante minha trajetória profissional, `;

          // Mencionar experiência principal de forma contextualizada
          if (mainExperience.includes('na ')) {
            carta += `${mainExperience.substring(0, 150)}. `;
          } else {
            carta += `desenvolvi competências estratégicas em gestão, análise e otimização de processos, destacando-se ${mainExperience.substring(0, 120)}. `;
          }

          // Adicionar habilidades de forma SEGURA (pode ser array ou string)
          if (skills && skills.length > 0 && !String(skills).includes('não informada')) {
            let skillsList: string[] = [];

            // Verificar se skills é array ou string
            if (typeof skills === 'string') {
              skillsList = skills.split(',').map(s => s.trim()).filter(s => s.length > 2 && !s.includes('[object'));
            } else if (Array.isArray(skills)) {
              // Se for array, converter para string de forma ROBUSTA (evitar [object Object])
              skillsList = skills
                .map(s => {
                  if (typeof s === 'string') return s.trim();
                  if (typeof s === 'object' && s !== null) {
                    return s.name || s.skill || s.skillName || s.title || '';
                  }
                  return String(s).trim();
                })
                .filter(s => s && s.length > 2 && !s.includes('[object'));
            }

            if (skillsList.length > 0) {
              const mainSkills = skillsList.slice(0, 3).join(', ');
              carta += `Ao longo dessa jornada, aprimorei minha expertise em ${mainSkills}, desenvolvendo competências diretamente aplicáveis aos desafios propostos nesta oportunidade. `;
            }
          }

          // Conectar com a vaga de forma fluida
          if (keywords && keywords.length > 10 && keywords !== 'Sem descrição adicional') {
            carta += `Essa combinação de experiência prática e conhecimento técnico me capacita para contribuir ativamente desde o primeiro dia, especialmente considerando os requisitos relacionados a ${keywords.substring(0, 100)}.\n\n`;
          } else {
            carta += `Esta sólida base de experiência prática aliada às competências técnicas me posiciona para agregar valor imediato e contribuir significativamente para os objetivos da organização.\n\n`;
          }
        } else {
          // Fallback caso não tenha experiências detalhadas - TEXTO FLUIDO
          carta += `Minha formação acadêmica e experiências práticas me proporcionaram visão estratégica e capacidade analítica para enfrentar desafios complexos em ambientes dinâmicos. `;

          if (skills && skills.length > 0 && !String(skills).includes('não informada')) {
            let skillsList: string[] = [];

            // Verificar se skills é array ou string - PROTEÇÃO TOTAL CONTRA [object Object]
            if (typeof skills === 'string') {
              skillsList = skills.split(',').map(s => s.trim()).filter(s => s.length > 2 && !s.includes('[object'));
            } else if (Array.isArray(skills)) {
              skillsList = skills
                .map(s => {
                  if (typeof s === 'string') return s.trim();
                  if (typeof s === 'object' && s !== null) {
                    return s.name || s.skill || s.skillName || s.title || '';
                  }
                  return String(s).trim();
                })
                .filter(s => s && s.length > 2 && !s.includes('[object'));
            }

            if (skillsList.length > 0) {
              const mainSkills = skillsList.slice(0, 3).join(', ');
              carta += `Ao longo de minha trajetória, desenvolvi comprovada habilidade em ${mainSkills}, `;
            } else {
              carta += `Possuo comprovada habilidade em trabalho em equipe, resolução de problemas e gestão de projetos, `;
            }
          } else {
            carta += `Possuo comprovada habilidade em trabalho em equipe, resolução de problemas e gestão de projetos, `;
          }

          carta += `competências que considero essenciais para o sucesso no cargo de ${position}. Esta base sólida de conhecimentos, aliada à minha dedicação e comprometimento, me prepara para gerar resultados de impacto e contribuir efetivamente para o crescimento da organização.\n\n`;
        }

        // Parágrafo 3 - Fechamento estratégico
        carta += `A cultura inovadora da ${company} e sua atuação destacada no setor despertam meu genuíno interesse em fazer parte desta equipe de excelência. `;
        carta += `Minha combinação de experiência técnica, habilidades interpessoais e comprometimento com resultados me posiciona para colaborar efetivamente com diferentes áreas e contribuir para os objetivos estratégicos da organização. `;
        carta += `Coloco-me à disposição para uma entrevista, onde poderei demonstrar detalhadamente como posso agregar valor à ${company}.\n\n`;

        carta += `Atenciosamente,\n\n${name}`;

        return carta;
      }
    } catch (e) {
      console.error('❌ Erro ao parsear payload para carta:', e);
    }
  }

  // CAREER CHAT FALLBACK - JobAI conversacional
  if (prompt.includes('JobAI') || prompt.includes('career_chat') || prompt.includes('Mensagem do usuário:')) {
    const userMessageMatch = prompt.match(/Mensagem do usuário: (.+?)(?=\n|$)/);
    const userMessage = userMessageMatch ? userMessageMatch[1].trim().toLowerCase() : prompt.toLowerCase();
    
    if (userMessage.includes('currículo') || userMessage.includes('cv')) {
      return `📄 **Ótimo! Vamos turbinar seu currículo!** 

Que legal que quer melhorar seu CV! 😊 Sou apaixonado por ajudar pessoas a destacarem seus talentos no papel.

🎯 **Primeiro, me conta:**
• Qual sua área de atuação? (Tech? Saúde? Vendas?)
• Quantos anos de experiência você tem?
• Está buscando uma vaga específica ou quer deixar o CV "pronto para qualquer oportunidade"?

💡 **Enquanto você pensa nisso, uma dica valiosa:**
O maior erro que vejo é currículo "genérico". Cada vaga tem sua "linguagem" específica - usar as palavras certas faz TODA diferença para passar pelos sistemas de triagem (ATS).

**Me manda essas informações que vou te dar dicas super específicas para sua área! Qual sua profissão mesmo?** 🚀`;
    }

    if (userMessage.includes('entrevista')) {
      return `🎤 **Ah, entrevista! Meu tópico favorito!** 

Cara, entrevista pode parecer assustadora, mas é só uma conversa onde você mostra o quanto é incrível! 😊

🔥 **Me conta primeiro:**
• Para que área/vaga é a entrevista?
• É presencial ou online?
• É primeira fase (RH) ou já é com o gestor?
• Qual sua maior preocupação: nervosismo, perguntas técnicas ou se expressar bem?

💡 **Dica de ouro enquanto você responde:**
A maioria das pessoas se prepara para "responder perguntas", mas o segredo é se preparar para ter uma CONVERSA. O entrevistador quer te conhecer, não te "pegar".

**Então, me fala: qual entrevista você tem pela frente?** 🚀`;
    }

    if (userMessage.includes('vaga') || userMessage.includes('emprego')) {
      return `🔍 **Ah, procurando emprego! Vamos nessa!** 

Cara, o mercado está cheio de oportunidades, mas tem que saber onde e como procurar! 😊

🚀 **Antes de te dar as melhores estratégias, me conta:**
• Qual área você atua ou quer atuar?
• Está procurando mudança de área ou evolução na atual?
• Prefere remoto, presencial ou tanto faz?
• Qual região/cidade te interessa?

💡 **Dica enquanto você pensa:**
80% das vagas nunca são publicadas! Elas são preenchidas por indicação ou networking. Por isso, a estratégia vai muito além de só "enviar currículo".

**Me fala da sua área que vou te mostrar os melhores lugares para procurar!** 🎯`;
    }

    if (userMessage.includes('salário') || userMessage.includes('negociar')) {
      return `💰 **Opa! Negociação salarial - meu tema favorito!** 

Cara, 90% das pessoas deixam dinheiro na mesa por medo de negociar! Mas vou te ensinar a fazer isso como um profissional. 😎

🔥 **Primeiro, me conta:**
• Está em processo seletivo ou já trabalha na empresa?
• Qual sua área e nível de experiência?
• Você tem uma proposta em mãos ou está se preparando?
• Qual sua faixa salarial atual (se se sentir confortável)?

💡 **Segredo que poucos sabem:**
Negociação não é só sobre salário! Às vezes a empresa não pode mexer no valor, mas pode oferece benefícios, flexibilidade, crescimento, cursos...

**Me fala da sua situação que vou te dar uma estratégia específica!** 🎯`;
    }

    // Resposta padrão personalizada para career_chat
    return `🤖 **Oi! Sou o JobAI e adorei sua pergunta!**

Percebi que você mencionou "${userMessage}" - que interessante! 😊

✨ **Sou especialista em carreira e posso te ajudar com:**
• Currículos que chamam atenção dos recrutadores
• Preparação para entrevistas (inclusive simulações!)
• Estratégias para encontrar vagas incríveis
• LinkedIn e networking profissional
• Negociação salarial
• Transição de carreira

🎯 **Mas primeiro, me conta:**
• Qual sua área profissional?
• Está empregado ou buscando oportunidades?
• Qual seu maior desafio na carreira agora?

Gosto de conhecer a pessoa antes de dar conselhos - cada carreira é única! 

**Então, me fala mais sobre você e o que está buscando?** 🚀`;
  }
  
  // OBJETIVO PROFISSIONAL
  if (prompt.includes('objetivo profissional')) {
    // NOVA LÓGICA: Análise inteligente das palavras-chave
    const keywordsMatch = prompt.match(/Palavras-chave da área: (.+)/);
    const userTextMatch = prompt.match(/Texto base: (.+?)(?=\n|$)/);
    
    const keywords = keywordsMatch ? keywordsMatch[1].split(',').map(k => k.trim()).filter(k => k) : [];
    const userText = userTextMatch ? userTextMatch[1] : '';
    
    // Separar tipos de informação
    const experienceYears = keywords.find(k => k.match(/\d+\s*anos?/i)) || '';
    const technicalSkills = keywords.filter(k => !k.match(/\d+\s*anos?/i) && k.length > 2).slice(0, 3);
    
    // Construir texto estratégico
    let objectiveText = '';
    
    if (experienceYears && technicalSkills.length > 0) {
      const years = experienceYears.match(/\d+/)?.[0] || '5';
      const mainArea = technicalSkills[0];
      const specializations = technicalSkills.slice(1);
      
      objectiveText = `Profissional com ${years} anos de experiência em ${mainArea}, especializado em ${specializations.join(' e ')}. `;
    } else if (technicalSkills.length > 0) {
      objectiveText = `Especialista em ${technicalSkills[0]} com comprovada expertise em ${technicalSkills.slice(1).join(', ')}. `;
    } else {
      objectiveText = 'Profissional experiente com sólida formação técnica. ';
    }
    
    objectiveText += 'Histórico de transformar desafios complexos em soluções estratégicas, entregando resultados mensuráveis e agregando valor aos indicadores organizacionais. ';
    objectiveText += 'Foco na otimização de processos e desenvolvimento de equipes de alta performance para acelerar o crescimento sustentável da empresa.';
    
    return objectiveText;
  } 
  
  // EXPERIÊNCIA PROFISSIONAL (apenas se contém os campos específicos)
  if (prompt.includes('Cargo:') || prompt.includes('Empresa:') || prompt.includes('Competências-chave:')) {
    // NOVA LÓGICA MELHORADA: IA de Experiência - Personalizada e Única
    const positionMatch = prompt.match(/Cargo: (.+)/);
    const companyMatch = prompt.match(/Empresa: (.+)/);
    const keywordsMatch = prompt.match(/Competências-chave: (.+)/);
    const userTextMatch = prompt.match(/Descrição atual: (.+?)(?=\n|$)/);
    
    const position = positionMatch ? positionMatch[1].trim() : 'Profissional';
    const company = companyMatch ? companyMatch[1].trim() : '';
    const keywords = keywordsMatch ? keywordsMatch[1].split(',').map(k => k.trim()).filter(k => k) : [];
    const userText = userTextMatch ? userTextMatch[1] : '';
    
    // CRIAR ID ÚNICO PARA EXPERIÊNCIA (evitar repetição)
    const experienceId = `${position}_${company}_${Date.now()}`.replace(/[^a-zA-Z0-9_]/g, '');
    
    // Mapear contextos específicos por tipo de cargo
    const cargoContexts = {
      'auxiliar': {
        actions: ['Executou', 'Realizou', 'Desenvolveu', 'Acompanhou', 'Colaborou'],
        focuses: ['atividades operacionais', 'procedimentos técnicos', 'rotinas de trabalho', 'protocolos de segurança', 'atendimento direto'],
        achievements: ['agilidade operacional', 'qualidade dos serviços', 'satisfação dos pacientes', 'eficiência dos processos', 'conformidade']
      },
      'tecnico': {
        actions: ['Operou', 'Monitorou', 'Implementou', 'Executou', 'Coordenou'],
        focuses: ['equipamentos especializados', 'procedimentos técnicos', 'protocolos de qualidade', 'sistemas operacionais', 'rotinas técnicas'],
        achievements: ['precisão técnica', 'eficiência operacional', 'redução de tempo', 'melhoria da qualidade', 'otimização de recursos']
      },
      'enfermagem': {
        actions: ['Prestou', 'Administrou', 'Monitorou', 'Executou', 'Assistiu'],
        focuses: ['cuidados diretos aos pacientes', 'medicamentos e tratamentos', 'sinais vitais', 'procedimentos de enfermagem', 'protocolos médicos'],
        achievements: ['qualidade do atendimento', 'satisfação dos pacientes', 'agilidade nos cuidados', 'precisão na medicação', 'bem-estar geral']
      },
      'analista': {
        actions: ['Analisou', 'Desenvolveu', 'Implementou', 'Otimizou', 'Coordenou'],
        focuses: ['dados e informações', 'processos organizacionais', 'sistemas e ferramentas', 'indicadores de performance', 'estratégias operacionais'],
        achievements: ['assertividade das análises', 'eficiência dos processos', 'qualidade das informações', 'produtividade da equipe', 'resultados organizacionais']
      },
      'coordenador': {
        actions: ['Coordenou', 'Supervisionou', 'Planejou', 'Organizou', 'Liderou'],
        focuses: ['equipes multidisciplinares', 'projetos estratégicos', 'operações diárias', 'processos organizacionais', 'metas departamentais'],
        achievements: ['performance da equipe', 'cumprimento de prazos', 'qualidade dos resultados', 'motivação dos colaboradores', 'eficiência operacional']
      }
    };
    
    // Identificar contexto mais específico
    const cargoKey = Object.keys(cargoContexts).find(key => 
      position.toLowerCase().includes(key)
    ) || 'analista';
    const context = cargoContexts[cargoKey];
    
    // Gerar bullets ÚNICOS baseados no texto do usuário e contexto
    const bullets = [];
    const usedPhrases = new Set(); // Evitar repetições
    
    // Palavras específicas para enfermagem se não houver keywords
    const defaultNursingWords = [
      'cuidados básicos', 'administração de medicamentos', 'sinais vitais', 
      'curativos', 'prontuários', 'higienização', 'observação clínica'
    ];
    
    // Extrair palavras relevantes do texto do usuário
    const userWords = userText.toLowerCase()
      .split(/[,.\s]+/)
      .filter(word => word.length > 3 && !['para', 'como', 'com', 'dos', 'das', 'nos', 'nas'].includes(word));
    
    // Combinar palavras-chave, palavras do usuário e defaults
    const allKeywords = [
      ...keywords,
      ...userWords.slice(0, 3),
      ...defaultNursingWords
    ].filter(Boolean);
    
    // Função para gerar bullet único
    const generateUniqueBullet = (index) => {
      const action = context.actions[index % context.actions.length];
      const focus = context.focuses[index % context.focuses.length];
      const achievement = context.achievements[index % context.achievements.length];
      
      // Selecionar palavra-chave específica para este bullet
      const keyword = allKeywords[index] || focus.split(' ')[0];
      
      let bullet = `• ${action} ${focus} com foco em ${keyword}, contribuindo para melhoria da ${achievement}`;
      
      // Verificar se já foi usado (evitar repetição)
      if (usedPhrases.has(bullet)) {
        bullet = `• ${action} atividades relacionadas a ${keyword} visando ${achievement}`;
      }
      
      usedPhrases.add(bullet);
      return bullet;
    };
    
    // Gerar 4-5 bullets únicos
    for (let i = 0; i < Math.max(4, Math.min(allKeywords.length, 5)); i++) {
      bullets.push(generateUniqueBullet(i));
    }
    
    return bullets.join('\n');
  }

  // FALLBACK PADRÃO - se nenhuma condição acima foi atendida
  return 'Desculpe, não consegui processar sua solicitação. Tente reformular sua pergunta ou entre em contato com o suporte.';
}

export class AIService {
  private static instance: AIService;
  
  private constructor() {}
  
  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }
  
  // Verificar configuração do backend
  static checkConfiguration(): {configured: boolean, backendUrl: string, hasBackend: boolean} {
    return {
      configured: !!BACKEND_CONFIG.BASE_URL,
      backendUrl: BACKEND_CONFIG.BASE_URL,
      hasBackend: !!BACKEND_CONFIG.BASE_URL
    };
  }

  // Testar conexão com backend
  static async testConnection(): Promise<{success: boolean, backend?: string, error?: string}> {
    try {
      const response = await fetch(`${BACKEND_CONFIG.BASE_URL}/health`);

      if (!response.ok) {
        return { success: false, error: `Backend error: ${response.status}` };
      }

      return { success: true, backend: BACKEND_CONFIG.BASE_URL };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // Método estático simplificado para uso direto - agora via backend seguro
  static async generateText(type: 'objective' | 'experience' | 'cover_letter', userInput: string, keywords: string, position?: string, company?: string, context?: string): Promise<string> {
    try {
      let endpoint = '';
      let payload: any = {};

      if (type === 'objective') {
        endpoint = BACKEND_CONFIG.ENDPOINTS.GENERATE_OBJECTIVE;
        payload = { userInput, keywords };
      } else if (type === 'cover_letter') {
        endpoint = BACKEND_CONFIG.ENDPOINTS.GENERATE_COVER_LETTER;
        payload = {
          userInput,
          keywords,
          position: position || 'Profissional',
          company: company || 'Empresa',
          context: context || new Date().toLocaleDateString('pt-BR')
        };
      } else if (type === 'experience') {
        endpoint = BACKEND_CONFIG.ENDPOINTS.GENERATE_EXPERIENCE;
        payload = {
          userInput,
          keywords,
          position: position || 'Profissional',
          company: company || 'Empresa'
        };

        console.log('🔍 IA DEBUG - Gerando para:', payload);
      }

      const generatedText = await callBackendAI(endpoint, payload);
      
      // 🚨 VALIDAÇÃO INTELIGENTE: Verificar se o conteúdo está na área correta
      if (type === 'experience' && position) {
        const positionLower = position.toLowerCase();
        let invalidTerms = [];
        let invalidContext = '';
        
        // Detectar área da profissão
        const isHealth = positionLower.includes('enferm') || positionLower.includes('médic') || positionLower.includes('saúde');
        const isConstruction = positionLower.includes('carpint') || positionLower.includes('pedreiro') || positionLower.includes('servente') || positionLower.includes('obra');
        const isTech = positionLower.includes('programador') || positionLower.includes('desenvolvedor') || positionLower.includes('analista') || positionLower.includes('suporte');
        const isSales = positionLower.includes('vendedor') || positionLower.includes('atendente') || positionLower.includes('comercial');
        
        // Termos específicos por área que NÃO devem aparecer em outras
        if (!isHealth) {
          const medicalTerms = ['curativo', 'medicamento', 'prontuário', 'paciente', 'sinais vitais', 'administração de medicamentos', 'cuidados básicos', 'equipamentos médicos', 'higienização', 'procedimentos médicos', 'hospital', 'clínica', 'enfermagem', 'tratamento', 'diagnóstico', 'terapia'];
          invalidTerms = medicalTerms.filter(term => generatedText.toLowerCase().includes(term));
          if (invalidTerms.length > 0) invalidContext = 'médico';
        }
        
        if (!isConstruction) {
          const constructionTerms = ['madeira', 'serra', 'furadeira', 'pregos', 'parafusos', 'construção civil', 'alvenaria', 'fundação', 'obra'];
          const foundTerms = constructionTerms.filter(term => generatedText.toLowerCase().includes(term));
          if (foundTerms.length > 0 && !invalidTerms.length) {
            invalidTerms = foundTerms;
            invalidContext = 'construção';
          }
        }
        
        if (!isTech) {
          const techTerms = ['programação', 'código', 'servidor', 'banco de dados', 'software', 'sistema operacional', 'rede', 'desenvolvimento'];
          const foundTerms = techTerms.filter(term => generatedText.toLowerCase().includes(term));
          if (foundTerms.length > 0 && !invalidTerms.length) {
            invalidTerms = foundTerms;
            invalidContext = 'tecnologia';
          }
        }
        
        if (invalidTerms.length > 0) {
          console.error(`🚨 IA gerou conteúdo de ${invalidContext} para cargo de outra área!`, {
            cargo: position,
            termosEncontrados: invalidTerms,
            resposta: generatedText.substring(0, 300)
          });
          
          // Retornar fallback contextualizado
          return this.generateContextualFallback(position, userInput, keywords);
        }
      }
      
      return generatedText;
      
    } catch (error) {
      console.error('Erro ao gerar texto:', error);
      if (type === 'experience' && position) {
        return this.generateContextualFallback(position, userInput, keywords);
      }
      throw new Error('Erro ao gerar texto com IA. Tente novamente.');
    }
  }
  
  // Gerar fallback contextualizado por área profissional
  static generateContextualFallback(position: string, userInput: string, keywords: string): string {
    const cleanKeywords = keywords.split(',').map(k => k.trim()).filter(k => k);
    const positionLower = position.toLowerCase();
    
    // Identificar área profissional
    if (positionLower.includes('carpint') || positionLower.includes('marceneiro') || positionLower.includes('servente')) {
      // Sistema de verbos únicos para cada bullet
      const verbs = ['Executou', 'Desenvolveu', 'Realizou', 'Supervisionou', 'Coordenou', 'Operou', 'Auxiliou', 'Conduziu'];
      const getUniqueVerbs = () => {
        const shuffled = [...verbs].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 4);
      };
      const [verb1, verb2, verb3, verb4] = getUniqueVerbs();
      
      if (positionLower.includes('servente')) {
        return `• ${verb1} atividades de apoio à carpintaria, organizando ${cleanKeywords[0] || 'materiais'} e preparando o ambiente de trabalho
• ${verb2} transporte de ${cleanKeywords[1] || 'peças de madeira'} e ferramentas, mantendo a logística eficiente
• ${verb3} na ${cleanKeywords[2] || 'montagem'} de estruturas junto aos carpinteiros, seguindo orientações técnicas
• ${verb4} limpeza e organização do canteiro, assegurando ${cleanKeywords[3] || 'segurança'} e produtividade`;
      } else if (positionLower.includes('auxiliar')) {
        return `• ${verb1} cortes precisos em ${cleanKeywords[0] || 'madeira'}, utilizando ferramentas manuais e elétricas
• ${verb2} montagem de ${cleanKeywords[1] || 'estruturas'} seguindo projetos e especificações técnicas
• ${verb3} acabamentos em ${cleanKeywords[2] || 'móveis'}, aplicando vernizes e tratamentos adequados
• ${verb4} manutenção preventiva de ${cleanKeywords[3] || 'equipamentos'}, garantindo funcionamento adequado`;
      } else {
        return `• ${verb1} projetos complexos de carpintaria, supervisionando a execução de ${cleanKeywords[0] || 'móveis sob medida'}
• ${verb2} técnicas avançadas de ${cleanKeywords[1] || 'marcenaria'}, garantindo precisão e qualidade superior
• ${verb3} equipes na instalação de ${cleanKeywords[2] || 'esquadrias'}, coordenando prazos e recursos
• ${verb4} controle de qualidade em ${cleanKeywords[3] || 'acabamentos'}, assegurando padrões profissionais`;
      }
    }
    
    if (positionLower.includes('vendedor') || positionLower.includes('atendente') || positionLower.includes('comercial')) {
      return `• Executou atendimento personalizado com foco em ${cleanKeywords[0] || 'relacionamento'}, superando expectativas dos clientes
• Desenvolveu estratégias de ${cleanKeywords[1] || 'vendas'} e apresentação de produtos, maximizando conversões
• Colaborou com equipe comercial na busca de ${cleanKeywords[2] || 'metas'} e objetivos estabelecidos
• Gerenciou carteira de clientes através de ${cleanKeywords[3] || 'follow-up'} e acompanhamento pós-venda`;
    }
    
    if (positionLower.includes('motorista') || positionLower.includes('entregador')) {
      return `• Executou entregas seguindo rotas otimizadas com foco em ${cleanKeywords[0] || 'logística'}, garantindo pontualidade
• Realizou controle de ${cleanKeywords[1] || 'cargas'} e documentação de transporte, mantendo organização
• Colaborou com equipe de expedição para ${cleanKeywords[2] || 'distribuição'} eficiente
• Inspecionou veículos e equipamentos, assegurando ${cleanKeywords[3] || 'segurança'} nas operações`;
    }
    
    if (positionLower.includes('cozinheir') || positionLower.includes('garçom') || positionLower.includes('copeiro')) {
      return `• Preparou alimentos seguindo receitas e padrões com foco em ${cleanKeywords[0] || 'qualidade'}, garantindo sabor
• Executou atividades de ${cleanKeywords[1] || 'preparo'} e organização da cozinha, mantendo higiene
• Colaborou com equipe no ${cleanKeywords[2] || 'atendimento'} e serviço aos clientes
• Controlou ${cleanKeywords[3] || 'ingredientes'} e estoque, evitando desperdícios`;
    }
    
    if (positionLower.includes('faxineir') || positionLower.includes('limpeza') || positionLower.includes('zelador')) {
      return `• Executou serviços de limpeza e conservação com foco em ${cleanKeywords[0] || 'higienização'}, mantendo padrões
• Realizou ${cleanKeywords[1] || 'manutenção'} preventiva de ambientes e equipamentos
• Colaborou na ${cleanKeywords[2] || 'organização'} e preservação dos espaços
• Aplicou produtos e técnicas de ${cleanKeywords[3] || 'limpeza'} seguindo normas de segurança`;
    }
    
    if (positionLower.includes('professor') || positionLower.includes('coordenador') || positionLower.includes('monitor')) {
      return `• Desenvolveu atividades de ensino com foco em ${cleanKeywords[0] || 'aprendizagem'}, promovendo conhecimento
• Executou ${cleanKeywords[1] || 'metodologias'} pedagógicas adaptadas ao perfil dos alunos
• Colaborou com equipe na ${cleanKeywords[2] || 'formação'} e desenvolvimento estudantil
• Avaliou progresso através de ${cleanKeywords[3] || 'avaliações'} e feedback construtivo`;
    }
    
    // Fallback genérico baseado no texto do usuário
    return `• Executou atividades relacionadas a ${cleanKeywords[0] || 'área de atuação'}, contribuindo para resultados da equipe
• Realizou tarefas operacionais com foco em ${cleanKeywords[1] || 'qualidade'}, mantendo padrões estabelecidos
• Colaborou com colegas na execução de ${cleanKeywords[2] || 'processos'} e rotinas de trabalho
• Aplicou conhecimentos técnicos em ${cleanKeywords[3] || 'área específica'}, agregando valor aos projetos`;
  }
  
  async generateText(request: AIRequest): Promise<AIResponse> {
    try {
      let prompt = '';
      
      if (request.type === 'objective') {
        prompt = PROMPTS.objective
          .replace('{userInput}', request.userInput || '')
          .replace('{keywords}', request.keywords || '');
      } else if (request.type === 'experience') {
        prompt = PROMPTS.experience
          .replace('{position}', request.position || '')
          .replace('{company}', request.company || '')
          .replace('{userInput}', request.userInput || '')
          .replace('{keywords}', request.keywords || '');
      } else if (request.type === 'career_chat') {
        prompt = PROMPTS.career_chat
          .replace('{userInput}', request.userInput || '');
      } else if (request.type === 'grammar_check') {
        // Para grammar_check, usamos o prompt diretamente do request
        prompt = request.prompt || '';
      } else {
        throw new Error(`Tipo de prompt não suportado: ${request.type}`);
      }
      
      console.log('🔧 DEV: Prompt montado para:', request.type);
      
      const generatedText = await callOpenAI(prompt);
      
      return {
        success: true,
        generatedText,
        suggestions: this.generateSuggestions(request.type)
      };
      
    } catch (error) {
      return {
        success: false,
        generatedText: '',
        error: 'Erro ao gerar texto com IA. Tente novamente.'
      };
    }
  }
  
  private generateSuggestions(type: 'objective' | 'experience' | 'career_chat' | 'grammar_check'): string[] {
    if (type === 'objective') {
      return [
        'Inclua métricas específicas de resultados alcançados',
        'Mencione tecnologias e metodologias relevantes',
        'Foque no valor que você agrega à empresa',
        'Use palavras-chave da descrição da vaga'
      ];
    } else if (type === 'career_chat') {
      return [
        'Continue fazendo perguntas para obter conselhos mais específicos',
        'Compartilhe mais detalhes sobre sua experiência para dicas personalizadas',
        'Pergunte sobre áreas específicas: currículos, entrevistas, LinkedIn',
        'Solicite simulação de entrevistas ou análise de vagas'
      ];
    } else {
      return [
        'Comece com verbos de ação impactantes',
        'Quantifique resultados sempre que possível',
        'Destaque liderança e trabalho em equipe',
        'Inclua tecnologias e ferramentas utilizadas',
        'Mencione reconhecimentos e conquistas'
      ];
    }
  }
  
  // Análise de palavras-chave para otimização ATS
  analyzeKeywords(text: string): string[] {
    const commonKeywords = [
      'liderança', 'gestão', 'estratégico', 'inovação', 'resultados',
      'otimização', 'eficiência', 'produtividade', 'crescimento',
      'desenvolvimento', 'implementação', 'coordenação', 'análise'
    ];
    
    return commonKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  }
  
  // Sugestões de melhoria baseadas em análise de texto
  getSuggestions(text: string): string[] {
    const suggestions: string[] = [];
    
    if (text.length < 50) {
      suggestions.push('Texto muito curto. Adicione mais detalhes sobre suas responsabilidades e conquistas.');
    }
    
    if (!text.match(/\d+/)) {
      suggestions.push('Inclua números e métricas para demonstrar resultados quantificáveis.');
    }
    
    if (!text.match(/\b(lider|gerenci|coorden|implement|desenvolv)/i)) {
      suggestions.push('Use verbos de ação que demonstrem liderança e proatividade.');
    }
    
    return suggestions;
  }
}

// Função de conveniência para uso direto
export const aiService = AIService.getInstance();

// Função wrapper para fácil importação
export async function generateAIContent(request: AIRequest): Promise<AIResponse> {
  return aiService.generateText(request);
} 
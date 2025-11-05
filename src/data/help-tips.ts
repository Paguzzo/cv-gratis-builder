interface HelpTip {
  text: string;
  highlight?: boolean;
}

interface StepHelp {
  title: string;
  mainTip: string;
  tips: HelpTip[];
}

export const HELP_TIPS: Record<string, StepHelp> = {
  'personal-info': {
    title: 'Informações Pessoais',
    mainTip: 'Diga aos futuros empregadores qual a melhor maneira de entrar em contato com você, listando suas informações de contato atuais.',
    tips: [
      {
        text: 'Em currículos para o Reino Unido, Estados Unidos e Canadá, é recomendável que você NÃO insira uma foto.',
        highlight: true
      },
      {
        text: 'Lembre que seu e-mail e site devem ser apropriados para que qualquer empregador em potencial possa ver.'
      },
      {
        text: 'O formato padrão de e-mail usado por muitas pessoas que estão procurando emprego é sobrenome.nome@provedordoemail.com ou sobrenome.nome@provedordoemail.com.br'
      },
      {
        text: 'Use números de telefone atuais e um endereço de e-mail profissional.'
      },
      {
        text: 'Evite apelidos ou e-mails muito informais como "gatinha123@email.com".'
      }
    ]
  },

  'objective': {
    title: 'Objetivo Profissional',
    mainTip: 'Um depoimento curto e impactante de seus objetivos profissionais e da área em que você gostaria de atuar.',
    tips: [
      {
        text: 'Depois do seu nome, esta é a primeira seção que um potencial empregador irá ler. Tente ser claro e forneça uma declaração impactante, breve e objetiva que descreva o cargo que você almeja e o setor em que gostaria de trabalhar.',
        highlight: true
      },
      {
        text: 'Se você prefere fazer um resumo de sua declaração, certifique-se de passar uma visão geral de sua trajetória, para facilitar a compreensão do seu perfil profissional.'
      }
    ]
  },

  'education': {
    title: 'Formação Acadêmica',
    mainTip: 'Liste sua formação e cursos para mostrar aos futuros empregadores que você é qualificado para o trabalho.',
    tips: [
      {
        text: 'Lembre-se de dar mais importância aos estudos que têm maior relevância para o trabalho que você está procurando.',
        highlight: true
      },
      {
        text: 'Na seção de educação, você pode incluir também cursos extra curriculares ou de treinamento profissional, se forem relevantes para seu histórico.'
      }
    ]
  },

  'experience': {
    title: 'Experiência Profissional',
    mainTip: 'Descreva suas experiências de trabalho focando em conquistas e resultados, não apenas em responsabilidades. Use números e métricas sempre que possível.',
    tips: [
      {
        text: 'Transforme tarefas em conquistas mensuráveis usando nossa IA.',
        highlight: true
      },
      {
        text: 'Liste as experiências em ordem cronológica inversa.'
      },
      {
        text: 'Inclua empresa, cargo, período e principais responsabilidades.'
      },
      {
        text: 'Use verbos de ação no passado para descrever suas atividades.'
      },
      {
        text: 'Quantifique seus resultados sempre que possível (%, números, valores).'
      },
      {
        text: 'Adapte as descrições para destacar experiências relevantes à vaga.'
      },
      {
        text: 'Mantenha entre 3-5 pontos por experiência para não ficar extenso.'
      }
    ]
  },

  'skills': {
    title: 'Habilidades e Competências',
    mainTip: 'Quais habilidades relevantes você possui que o fazem o melhor candidato para este trabalho?',
    tips: [
      {
        text: 'Empregadores em potencial querem saber quais são suas habilidades relevantes que fazem de você um candidato ideal.',
        highlight: true
      },
      {
        text: 'Liste outras habilidades que você considere relevantes para o trabalho que você está se candidatando, em ordem de importância para o potencial empregador.'
      },
      {
        text: 'Aqui você também pode usar palavras-chave utilizadas na descrição do cargo e especificações de candidato, mas apenas se elas realmente se aplicam a você.'
      }
    ]
  },

  'languages': {
    title: 'Idiomas',
    mainTip: 'Informe os idiomas que você domina e seja preciso sobre seu nível de proficiência em cada um deles.',
    tips: [
      {
        text: 'Seja honesto sobre seu nível real de conhecimento.',
        highlight: true
      },
      {
        text: 'Use os níveis padrão: Básico, Intermediário, Avançado, Fluente ou Nativo.'
      },
      {
        text: 'Considere mencionar certificações como TOEFL, IELTS, DELE, etc.'
      },
      {
        text: 'Priorize idiomas relevantes para sua área de atuação.'
      },
      {
        text: 'Se possível, especifique as competências: fala, escrita, leitura.'
      }
    ]
  },

  'courses': {
    title: 'Cursos e Certificações',
    mainTip: 'Liste cursos complementares, certificações e treinamentos que agregam valor ao seu perfil profissional.',
    tips: [
      {
        text: 'Priorize cursos recentes e relevantes para sua área.',
        highlight: true
      },
      {
        text: 'Inclua nome do curso, instituição e ano de conclusão.'
      },
      {
        text: 'Mencione a carga horária se for significativa (acima de 20h).'
      },
      {
        text: 'Destaque certificações reconhecidas no mercado.'
      },
      {
        text: 'Inclua cursos online de plataformas respeitadas (Coursera, Udemy, etc.).'
      },
      {
        text: 'Organize por relevância ou cronologia, do mais importante ao menos.'
      }
    ]
  },

  'projects-achievements': {
    title: 'Projetos e Conquistas',
    mainTip: 'Destaque projetos importantes e conquistas profissionais que demonstrem seu impacto e capacidade de entrega.',
    tips: [
      {
        text: 'Inclua o ano para contextualizar temporalmente suas conquistas.',
        highlight: true
      },
      {
        text: 'Descreva projetos que mostrem suas habilidades técnicas.'
      },
      {
        text: 'Mencione tecnologias, ferramentas e metodologias utilizadas.'
      },
      {
        text: 'Quantifique os resultados e impactos dos projetos.'
      },
      {
        text: 'Inclua prêmios, reconhecimentos e premiações relevantes.'
      },
      {
        text: 'Adicione links para portfolios online ou repositórios, se aplicável.'
      },
      {
        text: 'Foque em projetos que sejam relevantes para a vaga desejada.'
      }
    ]
  }
};

export function getHelpForStep(stepId: string): StepHelp | null {
  return HELP_TIPS[stepId] || null;
}

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Clock, Sparkles, Bot, FileText, Target, Palette, ChevronRight, Home } from "lucide-react";
import Logo from "@/components/Logo";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";

// ===== DADOS DOS ARTIGOS COM SEO OTIMIZADO =====
export const blogArticles = [
  {
    id: 1,
    slug: "criador-de-curriculo-com-ia",
    // SEO Title (até 60 caracteres)
    seoTitle: "Criador de Currículo com IA Grátis | CVGratis 2025",
    // Título completo para H1
    title: "Criador de Currículo com IA: Como a Inteligência Artificial Revoluciona sua Carreira",
    // Meta description (até 155 caracteres)
    metaDescription: "Crie currículo profissional com IA grátis. Nossa inteligência artificial gera descrições impactantes em segundos. +127.000 currículos criados!",
    excerpt: "Descubra como a inteligência artificial pode transformar seu currículo em uma ferramenta poderosa para conquistar o emprego dos sonhos.",
    // Keywords
    focusKeyword: "criador de currículo com ia",
    secondaryKeywords: ["currículo com inteligência artificial", "criar currículo ia grátis", "currículo ia online", "gerador de currículo ia"],
    // Categorias e Tags
    category: "Tecnologia",
    tags: ["IA", "Currículo", "Tecnologia", "Carreira"],
    icon: Bot,
    image: "/Blog_imagens/materia01.jfif",
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    readTime: "5 min",
    publishDate: "2025-01-15",
    modifiedDate: "2025-01-21",
    author: "Equipe CVGratis",
    // Conteúdo estruturado com headings H2/H3
    contentSections: [
      {
        type: "intro",
        content: "A busca por emprego mudou completamente com a chegada da inteligência artificial. Hoje, criar um currículo profissional não precisa mais ser uma tarefa demorada e frustrante. Com ferramentas como o CVGratis, você tem acesso a uma IA poderosa que transforma suas experiências em descrições impactantes."
      },
      {
        type: "h2",
        title: "Por que Usar IA para Criar seu Currículo?",
        content: "A grande vantagem de usar um criador de currículo com IA é a personalização inteligente. Nossa tecnologia analisa suas informações e gera descrições profissionais que destacam suas competências de forma estratégica. Enquanto você levaria horas pensando nas melhores palavras, a IA faz isso em segundos."
      },
      {
        type: "h2",
        title: "Como a IA do CVGratis Funciona",
        content: "O CVGratis utiliza modelos de linguagem avançados para entender o contexto da sua carreira. Se você trabalhou como vendedor, por exemplo, a IA sabe exatamente como destacar suas habilidades de negociação, comunicação e metas alcançadas. Isso aumenta significativamente suas chances de passar pelos filtros automáticos de RH."
      },
      {
        type: "h3",
        title: "Atualizada com o Mercado Brasileiro",
        content: "Outro diferencial é que nossa IA está sempre atualizada com as melhores práticas do mercado de trabalho brasileiro. Ela conhece os termos mais buscados pelos recrutadores e adapta seu currículo para ser encontrado. Com mais de 127.000 currículos criados, temos dados reais sobre o que funciona."
      },
      {
        type: "h2",
        title: "100% Grátis: Sem Pegadinhas",
        content: "O melhor de tudo? No CVGratis, a IA é 100% gratuita. Você não precisa pagar nada para ter acesso a essa tecnologia que empresas gastam milhões para desenvolver. Comece agora e veja a diferença que a inteligência artificial pode fazer na sua carreira!"
      }
    ],
    // Links internos sugeridos
    internalLinks: [
      { text: "Criar currículo grátis agora", url: "/criar-curriculo" },
      { text: "Ver templates disponíveis", url: "/showcase" },
      { text: "Ferramenta de currículo grátis", url: "/blog/ferramenta-de-curriculo-gratis" }
    ]
  },
  {
    id: 2,
    slug: "ferramenta-de-curriculo-gratis",
    seoTitle: "Ferramenta de Currículo Grátis Online | CVGratis",
    title: "Ferramenta de Currículo Grátis: Por que Pagar se Você Pode Ter o Melhor de Graça?",
    metaDescription: "Ferramenta grátis para criar currículo profissional. Templates premium, IA integrada, PDF ilimitado. Sem cadastro obrigatório!",
    excerpt: "Conheça os recursos profissionais que o CVGratis oferece sem cobrar nada. Templates premium, IA integrada e muito mais.",
    focusKeyword: "ferramenta de currículo grátis",
    secondaryKeywords: ["criar currículo grátis", "currículo online grátis", "gerador de currículo free", "fazer currículo de graça"],
    category: "Recursos",
    tags: ["Grátis", "Ferramentas", "Templates", "PDF"],
    icon: Sparkles,
    image: "/Blog_imagens/materia02.jfif",
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    readTime: "4 min",
    publishDate: "2025-01-14",
    modifiedDate: "2025-01-21",
    author: "Equipe CVGratis",
    contentSections: [
      {
        type: "intro",
        content: "No mercado existem dezenas de sites que prometem criar currículos profissionais, mas quase todos cobram valores absurdos por recursos básicos. O CVGratis nasceu com uma missão diferente: democratizar o acesso a ferramentas profissionais de carreira."
      },
      {
        type: "h2",
        title: "O que Você Ganha de Graça no CVGratis",
        content: "Nossa plataforma oferece gratuitamente o que outras cobram R$ 30, R$ 50 ou até mais. Você tem acesso a templates modernos desenvolvidos por designers profissionais, sem marca d'água e sem limitações irritantes. Baixe seu PDF quantas vezes quiser, imprima quando precisar."
      },
      {
        type: "h2",
        title: "IA Integrada Sem Custo Extra",
        content: "A inteligência artificial integrada é outro recurso que normalmente só está disponível em planos pagos de outras plataformas. No CVGratis, você usa a IA para gerar descrições de experiências, criar objetivos profissionais impactantes e receber sugestões de melhorias. Tudo isso sem gastar um centavo."
      },
      {
        type: "h3",
        title: "Salvamento Automático e Seguro",
        content: "O salvamento automático garante que você nunca perca seu trabalho. Seus dados ficam seguros no seu navegador e você pode continuar editando quando quiser. Nada de criar contas obrigatórias ou verificar emails infinitos."
      },
      {
        type: "h2",
        title: "Por que o CVGratis é Gratuito?",
        content: "Por que somos gratuitos? Porque acreditamos que todo profissional merece ter um currículo de qualidade, independente da sua situação financeira. Quem está desempregado e buscando oportunidades não deveria ter que pagar para criar um documento básico. Experimente o CVGratis e descubra que qualidade e gratuidade podem andar juntas. Mais de 127.000 pessoas já comprovaram isso!"
      }
    ],
    internalLinks: [
      { text: "Experimentar grátis agora", url: "/criar-curriculo" },
      { text: "Conhecer os templates", url: "/showcase" },
      { text: "Como criar currículo poderoso", url: "/blog/como-construir-curriculo-poderoso" }
    ]
  },
  {
    id: 3,
    slug: "como-construir-curriculo-poderoso",
    seoTitle: "Como Fazer Currículo: 7 Dicas para se Destacar | 2025",
    title: "Como Construir um Currículo Poderoso: 7 Dicas Essenciais para se Destacar",
    metaDescription: "Aprenda 7 dicas essenciais para criar currículo que impressiona recrutadores em 6 segundos. Técnicas comprovadas por +127.000 usuários!",
    excerpt: "Aprenda as estratégias que fazem a diferença na hora de conquistar a atenção dos recrutadores em apenas 6 segundos.",
    focusKeyword: "como fazer currículo",
    secondaryKeywords: ["dicas currículo", "currículo que destaca", "como montar currículo", "currículo para primeiro emprego"],
    category: "Dicas",
    tags: ["Dicas", "Carreira", "RH", "Emprego"],
    icon: Target,
    image: "/Blog_imagens/materia03.jfif",
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    readTime: "6 min",
    publishDate: "2025-01-13",
    modifiedDate: "2025-01-21",
    author: "Equipe CVGratis",
    contentSections: [
      {
        type: "intro",
        content: "Você sabia que um recrutador leva apenas 6 segundos para decidir se vai ler seu currículo? Por isso, construir um documento poderoso é essencial para se destacar entre centenas de candidatos."
      },
      {
        type: "h2",
        title: "1. Seja Objetivo e Direto",
        content: "Nada de currículos com 5 páginas contando toda sua história. O ideal é ter no máximo 2 páginas com informações relevantes para a vaga. O CVGratis ajuda você a organizar tudo de forma concisa e impactante."
      },
      {
        type: "h2",
        title: "2. Use Números e Resultados",
        content: "Em vez de \"aumentei as vendas\", escreva \"aumentei as vendas em 35% em 6 meses\". Números provam resultados e chamam atenção imediatamente."
      },
      {
        type: "h2",
        title: "3. Adapte para Cada Vaga",
        content: "Com o CVGratis, você pode criar múltiplas versões e ajustar o objetivo profissional conforme a oportunidade. Nossa IA ajuda a identificar as palavras-chave certas."
      },
      {
        type: "h2",
        title: "4. Escolha um Template Profissional",
        content: "A aparência do seu currículo comunica muito sobre você antes mesmo da leitura. Nossos templates foram desenvolvidos seguindo padrões internacionais de design."
      },
      {
        type: "h2",
        title: "5. Revise Várias Vezes",
        content: "Erros de português são eliminatórios. Use ferramentas de correção e peça para alguém revisar antes de enviar."
      },
      {
        type: "h2",
        title: "6. Inclua Habilidades Relevantes",
        content: "Nossa plataforma sugere competências baseadas na sua área de atuação, aumentando suas chances de passar pelos filtros automáticos."
      },
      {
        type: "h2",
        title: "7. Mantenha Sempre Atualizado",
        content: "Um currículo desatualizado transmite desleixo. Com o CVGratis, atualizar é rápido e fácil!"
      }
    ],
    internalLinks: [
      { text: "Aplicar as dicas agora", url: "/criar-curriculo" },
      { text: "Escolher template ideal", url: "/blog/templates-de-curriculo-qual-escolher" },
      { text: "Usar IA para melhorar", url: "/blog/criador-de-curriculo-com-ia" }
    ]
  },
  {
    id: 4,
    slug: "criar-curriculo-perfeito-2025",
    seoTitle: "Criar Currículo Online 2025: Guia Completo | CVGratis",
    title: "O que Você Precisa Online para Criar um Currículo Perfeito em 2025",
    metaDescription: "Guia completo para criar currículo online em 2025. Ferramentas essenciais, IA, templates e exportação PDF. Tudo grátis no CVGratis!",
    excerpt: "Descubra as ferramentas e recursos essenciais que você precisa ter acesso na internet para criar um currículo competitivo.",
    focusKeyword: "criar currículo online",
    secondaryKeywords: ["currículo online 2025", "fazer currículo pela internet", "melhor site para currículo", "currículo digital"],
    category: "Guia",
    tags: ["Guia", "2025", "Online", "Ferramentas"],
    icon: FileText,
    image: "/Blog_imagens/materia04.jfif",
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    readTime: "5 min",
    publishDate: "2025-01-12",
    modifiedDate: "2025-01-21",
    author: "Equipe CVGratis",
    contentSections: [
      {
        type: "intro",
        content: "Criar um currículo perfeito em 2025 exige mais do que apenas um editor de texto. O mercado de trabalho evoluiu e você precisa de ferramentas que acompanhem essa evolução. Veja o que é essencial ter online."
      },
      {
        type: "h2",
        title: "Plataforma de Criação Intuitiva",
        content: "Primeiro, você precisa de uma plataforma de criação intuitiva. Esqueça o Word e suas formatações que desconfigurem a cada salvamento. O CVGratis oferece um editor visual onde você vê exatamente como seu currículo ficará no PDF final."
      },
      {
        type: "h2",
        title: "Templates Profissionais Modernos",
        content: "Segundo, acesso a templates profissionais é fundamental. Não adianta ter conteúdo excelente em um design amador. Nossos modelos foram criados por especialistas em UX e seguem as melhores práticas de legibilidade e organização visual."
      },
      {
        type: "h2",
        title: "Inteligência Artificial para Auxiliar",
        content: "Terceiro, inteligência artificial para auxiliar na escrita. Nem todo mundo tem facilidade com palavras, e está tudo bem. A IA do CVGratis transforma suas experiências em descrições profissionais que impressionam recrutadores."
      },
      {
        type: "h2",
        title: "Exportação PDF de Alta Qualidade",
        content: "Quarto, exportação em PDF de alta qualidade. Muitas ferramentas gratuitas geram arquivos de baixa resolução ou com erros de formatação. Nosso sistema garante PDFs perfeitos, prontos para impressão ou envio digital."
      },
      {
        type: "h2",
        title: "Privacidade e Segurança",
        content: "Por fim, você precisa de uma plataforma que respeite sua privacidade. Não vendemos seus dados e você não precisa criar conta para usar. Simples, seguro e eficiente. Isso é o CVGratis!"
      }
    ],
    internalLinks: [
      { text: "Começar a criar agora", url: "/criar-curriculo" },
      { text: "Ver todos os templates", url: "/showcase" },
      { text: "Conhecer a ferramenta grátis", url: "/blog/ferramenta-de-curriculo-gratis" }
    ]
  },
  {
    id: 5,
    slug: "templates-de-curriculo-qual-escolher",
    seoTitle: "Modelos de Currículo 2025: Qual Template Escolher?",
    title: "Templates de Currículo: Qual Modelo Escolher para Sua Profissão?",
    metaDescription: "Guia completo de templates de currículo por profissão. Descubra o modelo ideal para sua área: TI, corporativo, criativo, executivo. Grátis!",
    excerpt: "Guia completo para escolher o template ideal de acordo com sua área de atuação e nível de experiência.",
    focusKeyword: "modelo de currículo",
    secondaryKeywords: ["template currículo", "currículo pronto para preencher", "modelo currículo profissional", "layout currículo"],
    category: "Templates",
    tags: ["Templates", "Design", "Profissões", "Modelos"],
    icon: Palette,
    image: "/Blog_imagens/materia05.jfif",
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    readTime: "5 min",
    publishDate: "2025-01-11",
    modifiedDate: "2025-01-21",
    author: "Equipe CVGratis",
    contentSections: [
      {
        type: "intro",
        content: "A escolha do template certo pode ser decisiva para o sucesso do seu currículo. Cada área profissional tem expectativas diferentes, e o design precisa refletir isso. Vamos explorar as melhores opções."
      },
      {
        type: "h2",
        title: "Templates para Área Corporativa",
        content: "Para áreas corporativas como finanças, direito e administração, templates clássicos e formais são ideais. O CVGratis oferece modelos elegantes com tipografia séria e cores neutras que transmitem profissionalismo e confiança."
      },
      {
        type: "h2",
        title: "Templates para Tecnologia e TI",
        content: "Profissionais de tecnologia podem ousar um pouco mais. Nosso template Tech foi desenvolvido especialmente para desenvolvedores, designers e profissionais de TI. Ele destaca habilidades técnicas e projetos de forma moderna e organizada."
      },
      {
        type: "h2",
        title: "Templates para Área Criativa",
        content: "Na área criativa, como design, marketing e publicidade, você pode escolher templates mais ousados. Nossos modelos Creative e Modern permitem mostrar sua personalidade sem perder a organização das informações."
      },
      {
        type: "h2",
        title: "Templates para Executivos",
        content: "Para cargos executivos e de gestão, o template Executive é perfeito. Ele enfatiza realizações e experiência de liderança, com um design sofisticado que transmite autoridade."
      },
      {
        type: "h2",
        title: "Templates para Primeiro Emprego",
        content: "Recém-formados e profissionais em início de carreira devem focar em templates que valorizem educação e habilidades. Nosso modelo Minimal é excelente para quem tem menos experiência mas quer transmitir potencial."
      },
      {
        type: "h2",
        title: "Todos Otimizados para ATS",
        content: "O mais importante é que todos os templates do CVGratis são otimizados para sistemas ATS (rastreamento de candidatos). Isso significa que seu currículo será lido corretamente pelos softwares que as empresas usam para filtrar candidatos. Explore nossa galeria de templates e encontre o modelo perfeito para sua carreira!"
      }
    ],
    internalLinks: [
      { text: "Ver galeria de templates", url: "/showcase" },
      { text: "Criar currículo agora", url: "/criar-curriculo" },
      { text: "Dicas para currículo poderoso", url: "/blog/como-construir-curriculo-poderoso" }
    ]
  }
];

// ===== PÁGINA PRINCIPAL DO BLOG =====
const Blog = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Blog CVGratis - Dicas de Currículo e Carreira | 2025"
        description="Dicas profissionais para criar currículo perfeito. Aprenda sobre IA, templates, estratégias de RH e conquiste seu emprego dos sonhos. Grátis!"
        keywords="blog currículo, dicas currículo, como fazer currículo, currículo com ia, templates currículo, currículo grátis"
        canonicalUrl="https://curriculogratisonline.com/blog"
      />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Início', url: 'https://curriculogratisonline.com/' },
          { name: 'Blog', url: 'https://curriculogratisonline.com/blog' }
        ]}
      />

      {/* Schema CollectionPage para o Blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Blog CVGratis - Dicas de Currículo e Carreira",
            "description": "Artigos e dicas profissionais para criar o currículo perfeito e conquistar seu emprego dos sonhos.",
            "url": "https://curriculogratisonline.com/blog",
            "isPartOf": {
              "@type": "WebSite",
              "name": "CVGratis",
              "url": "https://curriculogratisonline.com"
            },
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": blogArticles.map((article, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `https://curriculogratisonline.com/blog/${article.slug}`
              }))
            }
          })
        }}
      />

      {/* Header */}
      <header className="py-4 px-4 border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Logo size="sm" />
          </Link>
          <nav className="flex items-center gap-3" aria-label="Navegação do blog">
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700">
              <Link to="/criar-curriculo">
                <Sparkles className="w-4 h-4 mr-2" />
                Criar Currículo
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Breadcrumb Visual */}
      <nav className="max-w-6xl mx-auto px-4 py-3" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-gray-600">
          <li>
            <Link to="/" className="hover:text-emerald-600 flex items-center gap-1">
              <Home className="w-4 h-4" />
              Início
            </Link>
          </li>
          <li><ChevronRight className="w-4 h-4" /></li>
          <li className="text-gray-900 font-medium">Blog</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-violet-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-white/20 text-white border-white/30 mb-4">
            Blog CVGratis
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black mb-4">
            Dicas para Criar o <span className="text-emerald-300">Currículo Perfeito</span>
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
            Aprenda estratégias comprovadas para se destacar no mercado de trabalho e conquistar o emprego dos seus sonhos. Tudo grátis!
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 px-4" aria-label="Lista de artigos">
        <div className="max-w-6xl mx-auto">
          {/* Categorias rápidas */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {["Todos", "Tecnologia", "Recursos", "Dicas", "Guia", "Templates"].map(cat => (
              <Badge
                key={cat}
                variant={cat === "Todos" ? "default" : "outline"}
                className="cursor-pointer hover:bg-emerald-100"
              >
                {cat}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogArticles.map((article) => (
              <article key={article.id}>
                <Card
                  className={`${article.bgColor} ${article.borderColor} border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full`}
                >
                  <Link to={`/blog/${article.slug}`}>
                    <CardContent className="p-0">
                      {/* Card Header with Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          loading="lazy"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${article.color} opacity-20`}></div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="text-xs">
                            {article.category}
                          </Badge>
                          <span className="text-gray-500 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.readTime}
                          </span>
                        </div>

                        <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                          {article.title}
                        </h2>

                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                          {article.excerpt}
                        </p>

                        <div className="flex items-center text-sm font-semibold text-gray-700 group">
                          Ler artigo completo
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Links Internos Section */}
      <section className="py-8 px-4 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Navegue pelo CVGratis</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <Link to="/criar-curriculo" className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
              <Sparkles className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">Criar Currículo</span>
            </Link>
            <Link to="/showcase" className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
              <Palette className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Ver Templates</span>
            </Link>
            <Link to="/premium-editor" className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
              <Target className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Editor Premium</span>
            </Link>
            <Link to="/" className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
              <Home className="w-6 h-6 mx-auto mb-2 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">Página Inicial</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-emerald-500 to-green-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-2xl sm:text-4xl font-black mb-4">
            Pronto para Aplicar o que Aprendeu?
          </h2>
          <p className="text-lg text-emerald-100 mb-8">
            Crie seu currículo profissional agora mesmo usando as dicas do nosso blog!
          </p>
          <Button asChild size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold text-lg px-8">
            <Link to="/criar-curriculo">
              <Sparkles className="w-5 h-5 mr-2" />
              CRIAR CURRÍCULO GRÁTIS
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Logo size="sm" />
              <span className="text-gray-400">|</span>
              <span className="text-gray-400 text-sm">Blog</span>
            </div>
            <nav className="flex gap-4 text-sm text-gray-400" aria-label="Links do rodapé">
              <Link to="/politica-privacidade" className="hover:text-white">Privacidade</Link>
              <Link to="/termos-uso" className="hover:text-white">Termos</Link>
              <Link to="/" className="hover:text-white">Início</Link>
            </nav>
          </div>
          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-500 text-sm">
            <p>&copy; 2025 CVGratis Online - Produções ComPG. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Blog;

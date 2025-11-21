import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Clock, User, Sparkles, Bot, FileText, Target, Palette } from "lucide-react";
import Logo from "@/components/Logo";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";

// Dados dos artigos do blog
const blogArticles = [
  {
    id: 1,
    slug: "criador-curriculo-com-ia",
    title: "Criador de Currículo com IA: Como a Inteligência Artificial Revoluciona sua Carreira",
    excerpt: "Descubra como a inteligência artificial pode transformar seu currículo em uma ferramenta poderosa para conquistar o emprego dos sonhos.",
    icon: Bot,
    image: "/Blog_imagens/materia01.jfif",
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    readTime: "5 min",
    category: "Tecnologia",
    content: `A busca por emprego mudou completamente com a chegada da inteligência artificial. Hoje, criar um currículo profissional não precisa mais ser uma tarefa demorada e frustrante. Com ferramentas como o CVGratis, você tem acesso a uma IA poderosa que transforma suas experiências em descrições impactantes.

A grande vantagem de usar um criador de currículo com IA é a personalização inteligente. Nossa tecnologia analisa suas informações e gera descrições profissionais que destacam suas competências de forma estratégica. Enquanto você levaria horas pensando nas melhores palavras, a IA faz isso em segundos.

O CVGratis utiliza modelos de linguagem avançados para entender o contexto da sua carreira. Se você trabalhou como vendedor, por exemplo, a IA sabe exatamente como destacar suas habilidades de negociação, comunicação e metas alcançadas. Isso aumenta significativamente suas chances de passar pelos filtros automáticos de RH.

Outro diferencial é que nossa IA está sempre atualizada com as melhores práticas do mercado de trabalho brasileiro. Ela conhece os termos mais buscados pelos recrutadores e adapta seu currículo para ser encontrado. Com mais de 127.000 currículos criados, temos dados reais sobre o que funciona.

O melhor de tudo? No CVGratis, a IA é 100% gratuita. Você não precisa pagar nada para ter acesso a essa tecnologia que empresas gastam milhões para desenvolver. Comece agora e veja a diferença que a inteligência artificial pode fazer na sua carreira!`
  },
  {
    id: 2,
    slug: "ferramenta-curriculo-gratis",
    title: "Ferramenta de Currículo Grátis: Por que Pagar se Você Pode Ter o Melhor de Graça?",
    excerpt: "Conheça os recursos profissionais que o CVGratis oferece sem cobrar nada. Templates premium, IA integrada e muito mais.",
    icon: Sparkles,
    image: "/Blog_imagens/materia02.jfif",
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    readTime: "4 min",
    category: "Recursos",
    content: `No mercado existem dezenas de sites que prometem criar currículos profissionais, mas quase todos cobram valores absurdos por recursos básicos. O CVGratis nasceu com uma missão diferente: democratizar o acesso a ferramentas profissionais de carreira.

Nossa plataforma oferece gratuitamente o que outras cobram R$ 30, R$ 50 ou até mais. Você tem acesso a templates modernos desenvolvidos por designers profissionais, sem marca d'água e sem limitações irritantes. Baixe seu PDF quantas vezes quiser, imprima quando precisar.

A inteligência artificial integrada é outro recurso que normalmente só está disponível em planos pagos de outras plataformas. No CVGratis, você usa a IA para gerar descrições de experiências, criar objetivos profissionais impactantes e receber sugestões de melhorias. Tudo isso sem gastar um centavo.

O salvamento automático garante que você nunca perca seu trabalho. Seus dados ficam seguros no seu navegador e você pode continuar editando quando quiser. Nada de criar contas obrigatórias ou verificar emails infinitos.

Por que somos gratuitos? Porque acreditamos que todo profissional merece ter um currículo de qualidade, independente da sua situação financeira. Quem está desempregado e buscando oportunidades não deveria ter que pagar para criar um documento básico.

Experimente o CVGratis e descubra que qualidade e gratuidade podem andar juntas. Mais de 127.000 pessoas já comprovaram isso!`
  },
  {
    id: 3,
    slug: "como-construir-curriculo-poderoso",
    title: "Como Construir um Currículo Poderoso: 7 Dicas Essenciais para se Destacar",
    excerpt: "Aprenda as estratégias que fazem a diferença na hora de conquistar a atenção dos recrutadores em apenas 6 segundos.",
    icon: Target,
    image: "/Blog_imagens/materia02.jfif",
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    readTime: "6 min",
    category: "Dicas",
    content: `Você sabia que um recrutador leva apenas 6 segundos para decidir se vai ler seu currículo? Por isso, construir um documento poderoso é essencial para se destacar entre centenas de candidatos.

Primeira dica: seja objetivo. Nada de currículos com 5 páginas contando toda sua história. O ideal é ter no máximo 2 páginas com informações relevantes para a vaga. O CVGratis ajuda você a organizar tudo de forma concisa e impactante.

Segunda dica: use números sempre que possível. Em vez de "aumentei as vendas", escreva "aumentei as vendas em 35% em 6 meses". Números provam resultados e chamam atenção imediatamente.

Terceira dica: adapte seu currículo para cada vaga. Com o CVGratis, você pode criar múltiplas versões e ajustar o objetivo profissional conforme a oportunidade. Nossa IA ajuda a identificar as palavras-chave certas.

Quarta dica: escolha um template profissional. A aparência do seu currículo comunica muito sobre você antes mesmo da leitura. Nossos templates foram desenvolvidos seguindo padrões internacionais de design.

Quinta dica: revise várias vezes. Erros de português são eliminatórios. Use ferramentas de correção e peça para alguém revisar antes de enviar.

Sexta dica: inclua habilidades relevantes. Nossa plataforma sugere competências baseadas na sua área de atuação, aumentando suas chances de passar pelos filtros automáticos.

Sétima dica: mantenha atualizado. Um currículo desatualizado transmite desleixo. Com o CVGratis, atualizar é rápido e fácil!`
  },
  {
    id: 4,
    slug: "o-que-precisa-online-criar-curriculo",
    title: "O que Você Precisa Online para Criar um Currículo Perfeito em 2025",
    excerpt: "Descubra as ferramentas e recursos essenciais que você precisa ter acesso na internet para criar um currículo competitivo.",
    icon: FileText,
    image: "/Blog_imagens/materia04.jfif",
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    readTime: "5 min",
    category: "Guia",
    content: `Criar um currículo perfeito em 2025 exige mais do que apenas um editor de texto. O mercado de trabalho evoluiu e você precisa de ferramentas que acompanhem essa evolução. Veja o que é essencial ter online.

Primeiro, você precisa de uma plataforma de criação intuitiva. Esqueça o Word e suas formatações que desconfigurem a cada salvamento. O CVGratis oferece um editor visual onde você vê exatamente como seu currículo ficará no PDF final.

Segundo, acesso a templates profissionais é fundamental. Não adianta ter conteúdo excelente em um design amador. Nossos modelos foram criados por especialistas em UX e seguem as melhores práticas de legibilidade e organização visual.

Terceiro, inteligência artificial para auxiliar na escrita. Nem todo mundo tem facilidade com palavras, e está tudo bem. A IA do CVGratis transforma suas experiências em descrições profissionais que impressionam recrutadores.

Quarto, exportação em PDF de alta qualidade. Muitas ferramentas gratuitas geram arquivos de baixa resolução ou com erros de formatação. Nosso sistema garante PDFs perfeitos, prontos para impressão ou envio digital.

Quinto, salvamento automático e seguro. Imagine perder horas de trabalho por uma queda de internet. Com o CVGratis, seus dados são salvos automaticamente no seu navegador.

Por fim, você precisa de uma plataforma que respeite sua privacidade. Não vendemos seus dados e você não precisa criar conta para usar. Simples, seguro e eficiente. Isso é o CVGratis!`
  },
  {
    id: 5,
    slug: "templates-curriculo-qual-escolher",
    title: "Templates de Currículo: Qual Modelo Escolher para Sua Profissão?",
    excerpt: "Guia completo para escolher o template ideal de acordo com sua área de atuação e nível de experiência.",
    icon: Palette,
    image: "/Blog_imagens/materia05.jfif",
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    readTime: "5 min",
    category: "Templates",
    content: `A escolha do template certo pode ser decisiva para o sucesso do seu currículo. Cada área profissional tem expectativas diferentes, e o design precisa refletir isso. Vamos explorar as melhores opções.

Para áreas corporativas como finanças, direito e administração, templates clássicos e formais são ideais. O CVGratis oferece modelos elegantes com tipografia séria e cores neutras que transmitem profissionalismo e confiança.

Profissionais de tecnologia podem ousar um pouco mais. Nosso template Tech foi desenvolvido especialmente para desenvolvedores, designers e profissionais de TI. Ele destaca habilidades técnicas e projetos de forma moderna e organizada.

Na área criativa, como design, marketing e publicidade, você pode escolher templates mais ousados. Nossos modelos Creative e Modern permitem mostrar sua personalidade sem perder a organização das informações.

Para cargos executivos e de gestão, o template Executive é perfeito. Ele enfatiza realizações e experiência de liderança, com um design sofisticado que transmite autoridade.

Recém-formados e profissionais em início de carreira devem focar em templates que valorizem educação e habilidades. Nosso modelo Minimal é excelente para quem tem menos experiência mas quer transmitir potencial.

O mais importante é que todos os templates do CVGratis são otimizados para sistemas ATS (rastreamento de candidatos). Isso significa que seu currículo será lido corretamente pelos softwares que as empresas usam para filtrar candidatos.

Explore nossa galeria de templates e encontre o modelo perfeito para sua carreira!`
  }
];

const Blog = () => {
  const [selectedArticle, setSelectedArticle] = useState<typeof blogArticles[0] | null>(null);

  // Se um artigo está selecionado, mostrar o artigo completo
  if (selectedArticle) {
    const IconComponent = selectedArticle.icon;
    return (
      <div className="min-h-screen bg-gray-50">
        <SEOHead
          title={`${selectedArticle.title} | Blog CVGratis`}
          description={selectedArticle.excerpt}
          canonicalUrl={`https://curriculogratisonline.com/blog/${selectedArticle.slug}`}
        />

        {/* Header */}
        <header className="py-4 px-4 border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <Logo size="sm" />
            </Link>
            <Button variant="outline" onClick={() => setSelectedArticle(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Blog
            </Button>
          </div>
        </header>

        {/* Article Content */}
        <article className="max-w-4xl mx-auto py-8 px-4">
          {/* Article Header */}
          <div className={`${selectedArticle.bgColor} ${selectedArticle.borderColor} border-2 rounded-2xl p-6 sm:p-8 mb-8`}>
            <div className="flex items-center gap-3 mb-4">
              <Badge className={`bg-gradient-to-r ${selectedArticle.color} text-white`}>
                {selectedArticle.category}
              </Badge>
              <span className="text-gray-500 text-sm flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {selectedArticle.readTime} de leitura
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-gray-900 mb-4">
              {selectedArticle.title}
            </h1>
            <p className="text-lg text-gray-600">
              {selectedArticle.excerpt}
            </p>
          </div>

          {/* Article Body */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10">
            <div className="prose prose-lg max-w-none">
              {selectedArticle.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* CTA Box */}
            <div className="mt-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-6 sm:p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-3">
                Pronto para Criar seu Currículo?
              </h3>
              <p className="text-emerald-100 mb-6">
                Use tudo que você aprendeu neste artigo e crie um currículo profissional em minutos!
              </p>
              <Button asChild size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold">
                <Link to="/criar-curriculo">
                  <Sparkles className="w-5 h-5 mr-2" />
                  CRIAR CURRÍCULO GRÁTIS
                </Link>
              </Button>
            </div>
          </div>

          {/* Related Articles */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Outros Artigos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {blogArticles
                .filter(a => a.id !== selectedArticle.id)
                .slice(0, 2)
                .map(article => {
                  const Icon = article.icon;
                  return (
                    <Card
                      key={article.id}
                      className={`${article.bgColor} ${article.borderColor} border-2 cursor-pointer hover:shadow-lg transition-all`}
                      onClick={() => setSelectedArticle(article)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${article.color} flex items-center justify-center`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {article.category}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-gray-900 line-clamp-2">
                          {article.title}
                        </h3>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>
        </article>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 px-4 mt-12">
          <div className="max-w-4xl mx-auto text-center">
            <Logo size="sm" className="justify-center mb-4" />
            <p className="text-gray-400 text-sm">
              &copy; 2024 CVGratis Online - Produções ComPG. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Lista de artigos
  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Blog CVGratis - Dicas para Criar o Currículo Perfeito"
        description="Aprenda a criar currículos profissionais com dicas de especialistas. IA, templates, estratégias e muito mais para conquistar seu emprego dos sonhos."
        canonicalUrl="https://curriculogratisonline.com/blog"
      />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Início', url: 'https://curriculogratisonline.com/' },
          { name: 'Blog', url: 'https://curriculogratisonline.com/blog' }
        ]}
      />

      {/* Header */}
      <header className="py-4 px-4 border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-3">
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
          </div>
        </div>
      </header>

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
            Aprenda estratégias comprovadas para se destacar no mercado de trabalho e conquistar o emprego dos seus sonhos.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogArticles.map((article) => {
              return (
                <Card
                  key={article.id}
                  className={`${article.bgColor} ${article.borderColor} border-2 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
                  onClick={() => setSelectedArticle(article)}
                >
                  <CardContent className="p-0">
                    {/* Card Header with Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
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
                </Card>
              );
            })}
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
            <div className="flex gap-4 text-sm text-gray-400">
              <Link to="/politica-privacidade" className="hover:text-white">Privacidade</Link>
              <Link to="/termos-uso" className="hover:text-white">Termos</Link>
              <Link to="/" className="hover:text-white">Início</Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-500 text-sm">
            <p>&copy; 2024 CVGratis Online - Produções ComPG. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Blog;

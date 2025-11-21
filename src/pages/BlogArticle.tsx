import { useParams, Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, Sparkles, ChevronRight, Home, ArrowRight, Calendar, User } from "lucide-react";
import Logo from "@/components/Logo";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";
import { blogArticles } from "./Blog";

// ===== PÁGINA INDIVIDUAL DO ARTIGO COM SEO COMPLETO =====
const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();

  // Encontrar o artigo pelo slug
  const article = blogArticles.find(a => a.slug === slug);

  // Se não encontrar, redirecionar para o blog
  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  const IconComponent = article.icon;

  // Encontrar artigos relacionados (mesma categoria ou aleatórios)
  const relatedArticles = blogArticles
    .filter(a => a.id !== article.id)
    .sort((a, b) => {
      // Priorizar mesma categoria
      if (a.category === article.category && b.category !== article.category) return -1;
      if (b.category === article.category && a.category !== article.category) return 1;
      return 0;
    })
    .slice(0, 3);

  // Schema BlogPosting para SEO
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://curriculogratisonline.com/blog/${article.slug}`
    },
    "headline": article.title,
    "description": article.metaDescription,
    "image": `https://curriculogratisonline.com${article.image}`,
    "author": {
      "@type": "Organization",
      "name": article.author,
      "url": "https://curriculogratisonline.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "CVGratis Online - Produções ComPG",
      "logo": {
        "@type": "ImageObject",
        "url": "https://curriculogratisonline.com/android-chrome-512x512.png"
      }
    },
    "datePublished": article.publishDate,
    "dateModified": article.modifiedDate,
    "keywords": [article.focusKeyword, ...article.secondaryKeywords].join(", "),
    "articleSection": article.category,
    "wordCount": article.contentSections.reduce((acc, section) => acc + section.content.split(' ').length, 0),
    "inLanguage": "pt-BR"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Head com meta tags otimizadas */}
      <SEOHead
        title={article.seoTitle}
        description={article.metaDescription}
        keywords={[article.focusKeyword, ...article.secondaryKeywords].join(", ")}
        canonicalUrl={`https://curriculogratisonline.com/blog/${article.slug}`}
      />

      {/* Breadcrumb Schema */}
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Início', url: 'https://curriculogratisonline.com/' },
          { name: 'Blog', url: 'https://curriculogratisonline.com/blog' },
          { name: article.title, url: `https://curriculogratisonline.com/blog/${article.slug}` }
        ]}
      />

      {/* BlogPosting Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />

      {/* Header */}
      <header className="py-4 px-4 border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Logo size="sm" />
          </Link>
          <nav className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Voltar ao Blog</span>
                <span className="sm:hidden">Blog</span>
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700">
              <Link to="/criar-curriculo">
                <Sparkles className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Criar Currículo</span>
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Breadcrumb Visual */}
      <nav className="max-w-4xl mx-auto px-4 py-3" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
          <li>
            <Link to="/" className="hover:text-emerald-600 flex items-center gap-1">
              <Home className="w-4 h-4" />
              Início
            </Link>
          </li>
          <li><ChevronRight className="w-4 h-4" /></li>
          <li>
            <Link to="/blog" className="hover:text-emerald-600">Blog</Link>
          </li>
          <li><ChevronRight className="w-4 h-4" /></li>
          <li className="text-gray-900 font-medium truncate max-w-[200px]">{article.category}</li>
        </ol>
      </nav>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto py-6 px-4">
        {/* Article Header */}
        <header className={`${article.bgColor} ${article.borderColor} border-2 rounded-2xl p-6 sm:p-8 mb-8`}>
          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className={`bg-gradient-to-r ${article.color} text-white`}>
              {article.category}
            </Badge>
            <span className="text-gray-500 text-sm flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {article.readTime} de leitura
            </span>
            <span className="text-gray-500 text-sm flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(article.publishDate).toLocaleDateString('pt-BR')}
            </span>
          </div>

          {/* H1 - Título principal */}
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 mb-4">
            {article.title}
          </h1>

          {/* Excerpt/Lead */}
          <p className="text-lg text-gray-600 mb-4">
            {article.excerpt}
          </p>

          {/* Author */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <User className="w-4 h-4" />
            <span>Por {article.author}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {article.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-64 sm:h-96 object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10">
          <div className="prose prose-lg max-w-none">
            {article.contentSections.map((section, index) => {
              if (section.type === "intro") {
                return (
                  <p key={index} className="text-gray-700 leading-relaxed mb-6 text-lg font-medium">
                    {section.content}
                  </p>
                );
              }
              if (section.type === "h2") {
                return (
                  <div key={index} className="mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 mt-8">
                      {section.title}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                );
              }
              if (section.type === "h3") {
                return (
                  <div key={index} className="mb-6 ml-4 border-l-4 border-emerald-500 pl-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                      {section.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                );
              }
              return null;
            })}
          </div>

          {/* Internal Links Box */}
          <div className="mt-10 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Continue Lendo
            </h3>
            <div className="flex flex-wrap gap-3">
              {article.internalLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition-colors text-sm font-medium"
                >
                  {link.text}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ))}
            </div>
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
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Artigos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedArticles.map(relatedArticle => {
              const Icon = relatedArticle.icon;
              return (
                <Card
                  key={relatedArticle.id}
                  className={`${relatedArticle.bgColor} ${relatedArticle.borderColor} border-2 hover:shadow-lg transition-all overflow-hidden`}
                >
                  <Link to={`/blog/${relatedArticle.slug}`}>
                    <CardContent className="p-0">
                      <div className="relative h-32 overflow-hidden">
                        <img
                          src={relatedArticle.image}
                          alt={relatedArticle.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {relatedArticle.category}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-gray-900 line-clamp-2 text-sm">
                          {relatedArticle.title}
                        </h3>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>
        </section>

        {/* All Articles Link */}
        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
            <Link to="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ver Todos os Artigos
            </Link>
          </Button>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 mt-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Logo size="sm" />
              <span className="text-gray-400">|</span>
              <span className="text-gray-400 text-sm">Blog</span>
            </div>
            <nav className="flex gap-4 text-sm text-gray-400">
              <Link to="/politica-privacidade" className="hover:text-white">Privacidade</Link>
              <Link to="/termos-uso" className="hover:text-white">Termos</Link>
              <Link to="/blog" className="hover:text-white">Blog</Link>
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

export default BlogArticle;

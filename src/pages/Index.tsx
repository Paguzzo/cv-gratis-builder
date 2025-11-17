import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, FileText, Zap, Users, Award, ChevronDown, Play, Quote, User, CheckCircle, Clock, Sparkles, Crown, Target, TrendingUp, Shield, Gift, Rocket } from "lucide-react";
import Logo from "@/components/Logo";
import BonusPopup from "@/components/ui/bonus-popup";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";
import AnimatedCounter from "@/components/AnimatedCounter";
import LiveActivityFeed from "@/components/LiveActivityFeed";
import "@/styles/homepage-premium.css";

const Index = () => {
  const [bonusPopupOpen, setBonusPopupOpen] = useState(false);

  // Verificar se usuário já se cadastrou no bônus
  const hasUserSignedUp = () => {
    return localStorage.getItem('user-signed-up-bonus') === 'true';
  };

  // Verificar se pode mostrar popup
  const canShowPopup = () => {
    // Se já se cadastrou, não mostrar mais
    if (hasUserSignedUp()) {
      return false;
    }

    // Verificar se já mostrou hoje
    const lastShown = localStorage.getItem('bonus-popup-last-shown');
    if (!lastShown) {
      return true; // Primeira vez
    }

    const today = new Date().toDateString();
    return lastShown !== today;
  };

  // Mostrar popup após 10 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      if (canShowPopup()) {
        setBonusPopupOpen(true);
        localStorage.setItem('bonus-popup-last-shown', new Date().toDateString());
      }
    }, 10000); // 10 segundos

    return () => clearTimeout(timer);
  }, []);

  // Exit Intent - detectar quando usuário vai sair
  useEffect(() => {
    let hasTriggeredExitIntent = false;

    const handleMouseLeave = (e: MouseEvent) => {
      // Se mouse sair pela parte superior da tela
      if (e.clientY <= 0 && !hasTriggeredExitIntent && canShowPopup()) {
        hasTriggeredExitIntent = true;
        setBonusPopupOpen(true);
        localStorage.setItem('bonus-popup-last-shown', new Date().toDateString());
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Detectar Ctrl+W, Alt+F4, etc.
      if (((e.ctrlKey || e.metaKey) && e.key === 'w') || 
          (e.altKey && e.key === 'F4') ||
          ((e.ctrlKey || e.metaKey) && e.key === 'q')) {
        if (!hasTriggeredExitIntent && canShowPopup()) {
          hasTriggeredExitIntent = true;
          setBonusPopupOpen(true);
          localStorage.setItem('bonus-popup-last-shown', new Date().toDateString());
        }
      }
    };

    // Adicionar eventos
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* SEO e Structured Data */}
      <SEOHead
        title="CVGratis - Criador de Currículos Profissionais | Templates Premium com IA"
        description="Crie seu currículo profissional gratuitamente! Templates modernos, IA integrada, exportação PDF. Mais de 127.000 pessoas já conseguiram emprego. Destaque-se no mercado de trabalho!"
        keywords="currículo grátis, criar currículo online, curriculum vitae, templates profissionais, currículo moderno, CV premium, gerador de currículo, currículo ATS, emprego, carreira"
        canonicalUrl="https://www.curriculogratisonline.com/"
        ogImage="https://www.curriculogratisonline.com/og-image.jpg"
      />
      <StructuredData type="all" />

      {/* Header com Logo */}
      <header className="py-3 sm:py-6 px-3 sm:px-4 border-b bg-white/95 backdrop-blur-sm sticky top-0 z-40" role="banner" aria-label="Cabeçalho principal">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <Logo size="md" />
          </div>
          <nav className="flex gap-2 sm:gap-4" aria-label="Navegação principal">
            <Button variant="outline" asChild className="text-xs sm:text-sm px-2 sm:px-4 hidden sm:inline-flex">
              <Link to="/showcase" aria-label="Ver galeria de templates disponíveis">Ver Templates</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="w-7 h-7 sm:w-8 sm:h-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors hidden sm:inline-flex"
              title="Área Administrativa"
            >
              <Link to="/admin-login" aria-label="Acesso à área administrativa">A</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-xs sm:text-sm px-3 sm:px-4">
              <Link to="/criar-curriculo" aria-label="Começar a criar currículo gratuitamente agora">
                <Gift className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" aria-hidden="true" />
                <span className="hidden xs:inline">GRÁTIS</span>
                <span className="xs:hidden">CRIAR</span>
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section - Premium 2025 */}
      <section className="relative py-12 sm:py-20 px-3 sm:px-4 text-center bg-gradient-hero-subtle overflow-hidden" role="region" aria-label="Seção principal - Hero">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-violet-600/5"></div>

        <div className="max-w-6xl mx-auto relative">
          {/* Badge de destaque com animação */}
          <div className="flex justify-center mb-4 sm:mb-6 animate-fade-in-up">
            <Badge variant="success" className="px-4 sm:px-8 py-2 sm:py-3 text-xs sm:text-base font-bold shadow-emerald hover:scale-105 transition-transform">
              100% GRATUITO
            </Badge>
          </div>

          <div className="mb-6 sm:mb-8">
            <Logo size="lg" className="justify-center mb-4 sm:mb-6" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-7xl font-black mb-4 sm:mb-6 text-slate-800 leading-tight animate-fade-in-up px-2" style={{ animationDelay: '0.1s' }}>
            Crie Seu Currículo{" "}
            <span className="text-gradient">
              PERFEITO
            </span>{" "}
            em 3 Minutos
          </h1>

          {/* Subheadline persuasivo */}
          <div className="max-w-4xl mx-auto mb-6 sm:mb-8 animate-fade-in-up px-2" style={{ animationDelay: '0.2s' }}>
            <p className="text-lg sm:text-2xl md:text-3xl text-slate-700 font-semibold mb-3 sm:mb-4">
              IA Poderosa + Templates Profissionais
            </p>
            <p className="text-base sm:text-xl text-slate-600">
              Junte-se a <strong className="text-emerald-600 font-bold">127.000+ profissionais</strong>
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>que já conquistaram o emprego dos sonhos
            </p>
          </div>

          {/* Social Proof */}
          <div className="flex justify-center items-center gap-2 mb-6 sm:mb-8">
            <div className="flex -space-x-2">
              {[
                { id: 1, name: "Ana Silva" },
                { id: 2, name: "Bruno Costa" },
                { id: 3, name: "Carla Souza" },
                { id: 4, name: "Daniel Lima" },
                { id: 5, name: "Eduarda Mendes" }
              ].map((person) => (
                <Avatar key={person.id} className="w-10 h-10 border-2 border-white">
                  <AvatarImage
                    src={`https://i.pravatar.cc/150?img=${person.id + 10}`}
                    alt={person.name}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-blue-400 to-green-400 text-white font-bold">
                    {person.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className="text-left ml-4">
              <div className="flex text-yellow-400 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                <strong>4.9/5</strong> • Mais de 50.000 avaliações
              </p>
            </div>
          </div>

          {/* CTA Principal */}
          <div className="space-y-3 sm:space-y-4 animate-fade-in-up px-2" style={{ animationDelay: '0.4s' }}>
            <Button asChild variant="emerald" size="xl" className="text-base sm:text-xl px-6 sm:px-12 rounded-2xl w-full sm:w-auto">
              <a href="/criar-curriculo">
                <Rocket className="mr-2 sm:mr-3 w-5 h-5 sm:w-6 sm:h-6" />
                CRIAR CURRÍCULO GRÁTIS
              </a>
            </Button>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Sem cadastro • Sem cartão • Download imediato
            </p>
          </div>

          {/* Urgência */}
          <div className="mt-6 sm:mt-8 bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 max-w-2xl mx-auto">
            <p className="text-red-700 font-semibold text-sm sm:text-base">
              <strong>ATENÇÃO:</strong> Mais de 400 pessoas criaram currículo hoje!
            </p>
          </div>
        </div>
      </section>

      {/* Seção GRATUITO vs PREMIUM - Comparativo */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 bg-white" role="region" aria-labelledby="pricing-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-16 px-2">
            <h2 id="pricing-heading" className="text-2xl sm:text-5xl font-black mb-3 sm:mb-4">GRÁTIS vs PREMIUM</h2>
            <p className="text-base sm:text-xl text-gray-600">
              Comece grátis e desbloqueie recursos quando quiser
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* GRÁTIS */}
            <Card className="p-4 sm:p-8 border-2 border-emerald-200 bg-emerald-50 relative overflow-hidden hover-lift shadow-card hover:shadow-card-hover">
              <div className="absolute top-4 right-4">
                <Badge className="bg-emerald-600 text-white border-0 text-sm px-4 py-1.5 shadow-lg">
                  <Gift className="w-3.5 h-3.5 mr-1" />
                  100% GRÁTIS
                </Badge>
              </div>
              <CardContent className="p-0">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <Gift className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800">VERSÃO GRATUITA</h3>
                  <p className="text-emerald-700 font-semibold text-lg">Para sempre, sem pegadinhas</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-800">✨ <strong>IA integrada</strong> para descrições profissionais</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-800">🎨 <strong>2 templates</strong> modernos e elegantes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-800">📄 <strong>Download PDF</strong> ilimitado</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-800">🖨️ <strong>Impressão</strong> otimizada</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-800">💾 <strong>Salvamento automático</strong></span>
                  </li>
                </ul>

                <Button asChild size="lg" className="w-full text-lg bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold shadow-xl hover:shadow-2xl transition-all">
                  <a href="/criar-curriculo">
                    <Sparkles className="w-5 h-5 mr-2" />
                    COMEÇAR GRÁTIS AGORA
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* PREMIUM */}
            <Card className="p-8 border-2 border-violet-300 bg-gradient-to-br from-violet-50 to-purple-50 relative overflow-visible hover-lift shadow-card hover:shadow-premium pt-12">
              {/* Badge "MAIS POPULAR" */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm px-6 py-2 shadow-lg animate-pulse-glow font-bold">
                  🔥 MAIS POPULAR
                </Badge>
              </div>
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-purple-600 to-violet-600 text-white border-0 text-sm px-4 py-1.5 relative overflow-hidden shadow-lg">
                  <Crown className="w-3.5 h-3.5 mr-1" />
                  PREMIUM
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                </Badge>
              </div>
              <CardContent className="p-0 pt-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <Crown className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800">VERSÃO PREMIUM</h3>
                  <div className="mt-2">
                    <p className="text-slate-400 line-through text-sm">De R$ 29,90</p>
                    <p className="text-violet-700 font-bold text-2xl">Apenas R$ 4,90</p>
                    <p className="text-xs text-amber-600 font-semibold mt-1">⚡ Últimas 47 vagas neste preço!</p>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    </div>
                    <span className="text-gray-800">🏆 <strong>Tudo do GRÁTIS +</strong></span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    </div>
                    <span className="text-gray-800">🎨 <strong>10 templates exclusivos</strong> premium</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    </div>
                    <span className="text-gray-800">🤖 <strong>JobAI integrado</strong> - tira dúvidas de RH</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    </div>
                    <span className="text-gray-800">⭐ <strong>Avaliação IA</strong> com nota 9.2/10</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    </div>
                    <span className="text-gray-800">📊 <strong>Relatório completo</strong> de melhorias</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    </div>
                    <span className="text-gray-800">🤖 <strong>Avaliação de qualidade</strong> do currículo por IA</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    </div>
                    <span className="text-gray-800">📝 <strong>Carta de Apresentação com IA</strong> - Geração automática personalizada</span>
                  </li>
                </ul>

                <Button asChild size="lg" className="w-full text-lg bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all">
                  <a href="/showcase">
                    <Crown className="w-5 h-5 mr-2" />
                    VER TEMPLATES PREMIUM
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Destaque da JobAI */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center shadow-xl">
            <div className="flex justify-center items-center gap-4 mb-4">
              <div className="flex text-yellow-300 text-2xl">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-8 h-8 fill-current" />
                ))}
              </div>
              <span className="text-4xl font-black text-white">JobAI</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              🤖 Sua IA Pessoal para Dúvidas de RH
            </h3>
            <p className="text-lg text-blue-100">
              Exclusivo para usuários PREMIUM! Nossa inteligência artificial responde suas dúvidas sobre
              processos seletivos, entrevistas e mercado de trabalho em tempo real.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h4 className="font-bold mb-2 text-gray-800">Dúvidas de RH</h4>
                <p className="text-sm text-gray-600">Respostas instantâneas sobre processos seletivos</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h4 className="font-bold mb-2 text-gray-800">Dicas de Entrevista</h4>
                <p className="text-sm text-gray-600">Prepare-se para qualquer tipo de entrevista</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h4 className="font-bold mb-2 text-gray-800">Mercado de Trabalho</h4>
                <p className="text-sm text-gray-600">Insights sobre tendências e oportunidades</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gatilhos de Urgência e Escassez */}
      <section className="py-10 sm:py-16 px-3 sm:px-4 bg-red-50 border-y-2 border-red-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl sm:text-3xl font-black text-red-700 mb-4 px-2">
            Não Deixe Suas Oportunidades Escaparem!
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white p-4 sm:p-6 rounded-lg border-2 border-red-200">
              <TrendingUp className="w-8 h-8 sm:w-12 sm:h-12 text-red-600 mx-auto mb-2 sm:mb-3" />
              <h3 className="font-bold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">Mercado Competitivo</h3>
              <p className="text-gray-600 text-xs sm:text-base">Cada vaga recebe mais de <strong>200 currículos</strong>.</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg border-2 border-red-200">
              <Clock className="w-8 h-8 sm:w-12 sm:h-12 text-red-600 mx-auto mb-2 sm:mb-3" />
              <h3 className="font-bold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">Tempo é Dinheiro</h3>
              <p className="text-gray-600 text-xs sm:text-base">Cada dia sem emprego = <strong>R$ 100+ perdidos</strong>.</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg border-2 border-red-200">
              <Target className="w-8 h-8 sm:w-12 sm:h-12 text-red-600 mx-auto mb-2 sm:mb-3" />
              <h3 className="font-bold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">Primeiras Impressões</h3>
              <p className="text-gray-600 text-xs sm:text-base">RH decide em <strong>6 segundos</strong> se vai ler seu CV!</p>
            </div>
          </div>
          <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-base sm:text-xl px-6 sm:px-8 py-4 sm:py-6 animate-bounce w-full sm:w-auto">
            <a href="/criar-curriculo">
              NÃO PERDER OPORTUNIDADES
            </a>
          </Button>
        </div>
      </section>

      {/* Como Funciona - Otimizado */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 bg-gray-50" role="region" aria-labelledby="how-it-works-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-16 px-2">
            <h2 id="how-it-works-heading" className="text-2xl sm:text-4xl font-black mb-3 sm:mb-4">3 Passos Para Seu Emprego</h2>
            <p className="text-base sm:text-xl text-gray-600">
              Simples, rápido e <strong>eficaz</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            <div className="text-center bg-white p-4 sm:p-8 rounded-2xl shadow-lg">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-white text-xl sm:text-3xl font-black">
                1
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4">Preencha em 3 Min</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                Nossa <strong>IA</strong> ajuda você a escrever descrições profissionais.
              </p>
              <Badge className="bg-green-100 text-green-800 text-xs sm:text-sm">IA Integrada</Badge>
            </div>

            <div className="text-center bg-white p-4 sm:p-8 rounded-2xl shadow-lg">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-white text-xl sm:text-3xl font-black">
                2
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4">Escolha o Design</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                Templates <strong>aprovados</strong> por profissionais de RH.
              </p>
              <Badge className="bg-blue-100 text-blue-800 text-xs sm:text-sm">Aprovado por RH</Badge>
            </div>

            <div className="text-center bg-white p-4 sm:p-8 rounded-2xl shadow-lg">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-white text-xl sm:text-3xl font-black">
                3
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4">Conquiste a Vaga</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                Download instantâneo e <strong>envie para empresas</strong>.
              </p>
              <Badge className="bg-purple-100 text-purple-800 text-xs sm:text-sm">Sucesso Garantido</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos com Credibilidade */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 bg-white" role="region" aria-labelledby="testimonials-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-16 px-2">
            <h2 id="testimonials-heading" className="text-xl sm:text-4xl font-black mb-3 sm:mb-4">Quem Usou, Aprovou!</h2>
            <p className="text-base sm:text-xl text-gray-600">
              Histórias reais • <strong>Resultados comprovados</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            <Card className="p-6 bg-green-50 border-green-200">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <Badge className="ml-2 bg-green-100 text-green-800">CONTRATADA</Badge>
                </div>
                <Quote className="w-8 h-8 text-green-600 mb-4" />
                <p className="text-gray-700 mb-4 font-medium">
                  "Em <strong>2 semanas</strong> já estava empregada! O currículo ficou lindo e a IA me ajudou muito. 
                  <strong>Recomendo 100%!</strong>"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    M
                  </div>
                  <div>
                    <p className="font-bold">Maria Silva</p>
                    <p className="text-sm text-gray-600">Desenvolvedora → Google</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <Badge className="ml-2 bg-blue-100 text-blue-800">PROMOVIDO</Badge>
                </div>
                <Quote className="w-8 h-8 text-blue-600 mb-4" />
                <p className="text-gray-700 mb-4 font-medium">
                  "Fui promovido a <strong>gerente</strong> usando este currículo! A avaliação IA me deu nota 9.8. 
                  <strong>Mudou minha carreira!</strong>"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    J
                  </div>
                  <div>
                    <p className="font-bold">João Santos</p>
                    <p className="text-sm text-gray-600">Analista → Gerente</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 bg-purple-50 border-purple-200">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <Badge className="ml-2 bg-purple-100 text-purple-800">+80% SALÁRIO</Badge>
                </div>
                <Quote className="w-8 h-8 text-purple-600 mb-4" />
                <p className="text-gray-700 mb-4 font-medium">
                  "Consegui <strong>aumentar meu salário em 80%</strong> mudando de empresa! 
                  O template premium fez toda diferença. <strong>Investimento que se paga!</strong>"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    A
                  </div>
                  <div>
                    <p className="font-bold">Ana Costa</p>
                    <p className="text-sm text-gray-600">Marketing → Multinacional</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Estatísticas Persuasivas */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 px-2">
            <h2 className="text-2xl sm:text-4xl font-black mb-3 sm:mb-4">Números Que Falam Por Si</h2>
            <p className="text-base sm:text-xl opacity-90">Resultados reais que FUNCIONAM</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6">
              <div className="text-2xl sm:text-5xl font-black mb-1 sm:mb-2">127K+</div>
              <p className="text-blue-100 font-semibold text-xs sm:text-base">Currículos criados</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6">
              <div className="text-2xl sm:text-5xl font-black mb-1 sm:mb-2">96%</div>
              <p className="text-blue-100 font-semibold text-xs sm:text-base">Taxa contratação</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6">
              <div className="text-2xl sm:text-5xl font-black mb-1 sm:mb-2">3min</div>
              <p className="text-blue-100 font-semibold text-xs sm:text-base">Tempo médio</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6">
              <div className="text-2xl sm:text-5xl font-black mb-1 sm:mb-2">9.2</div>
              <p className="text-blue-100 font-semibold text-xs sm:text-base">Nota média IA</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Poderoso */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 text-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 sm:p-12 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-green-200">
            <Sparkles className="w-12 h-12 sm:w-20 sm:h-20 text-green-600 mx-auto mb-4 sm:mb-6" />
            <h2 className="text-2xl sm:text-5xl font-black mb-4 sm:mb-6 text-gray-800 px-2">
              Sua Nova Carreira Começa AGORA!
            </h2>
            <p className="text-base sm:text-2xl text-gray-600 mb-6 sm:mb-8 font-semibold px-2">
              Milhares já conseguiram o emprego dos sonhos.
              <br />
              <span className="text-green-600">Sua vez chegou!</span>
            </p>

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <Button asChild size="lg" className="text-base sm:text-2xl px-6 sm:px-12 py-6 sm:py-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transform hover:scale-105 w-full sm:w-auto">
                <a href="/criar-curriculo">
                  <Rocket className="mr-2 sm:mr-3 w-5 h-5 sm:w-8 sm:h-8" />
                  CRIAR MEU CURRÍCULO AGORA
                </a>
              </Button>
              <p className="text-sm sm:text-lg text-gray-500">
                100% Gratuito • Sem pegadinhas • Resultado garantido
              </p>
            </div>

            <div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl p-4 sm:p-6">
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <p className="text-yellow-800 font-bold text-sm sm:text-lg text-center">
                  <strong>BÔNUS:</strong> Guia Secreto de Entrevistas (R$ 97) - GRÁTIS!
                </p>
                <Button
                  onClick={() => setBonusPopupOpen(true)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 whitespace-nowrap text-sm sm:text-base w-full sm:w-auto"
                >
                  QUERO MEU BÔNUS!
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 px-3 sm:px-4" role="contentinfo" aria-label="Rodapé do site">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2">
              <Logo size="md" className="mb-3 sm:mb-4" />
              <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                A plataforma de criação de currículos mais eficaz do Brasil.
              </p>
              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <p><strong>Produções ComPG</strong></p>
                <p>Minas Gerais, MG</p>
                <p>+55 (31) 97105-2200</p>
                <p>contato@compg.com.br</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Produtos</h4>
              <ul className="space-y-1 sm:space-y-2 text-gray-300 text-xs sm:text-base">
                <li><a href="/criar-curriculo" className="hover:text-white transition-colors">Criar Currículo</a></li>
                <li><a href="/templates" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="/premium-editor" className="hover:text-white transition-colors">Editor</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
              <ul className="space-y-1 sm:space-y-2 text-gray-300 text-xs sm:text-base">
                <li><a href="/politica-privacidade" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="/termos-uso" className="hover:text-white transition-colors">Termos</a></li>
                <li><a href="/politica-cookies" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400">
            <p className="text-xs sm:text-base">&copy; 2024 CVGratis Online - Produções ComPG.</p>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm">
              Feito em Minas Gerais para profissionais que querem se destacar.
            </p>
          </div>
        </div>
      </footer>

      {/* Popup de Bônus */}
      <BonusPopup 
        open={bonusPopupOpen} 
        onOpenChange={setBonusPopupOpen} 
      />
    </div>
  );
};

export default Index;

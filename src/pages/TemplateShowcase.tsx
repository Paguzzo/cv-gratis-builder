import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  ArrowRight,
  Crown,
  Star,
  Zap,
  Gift,
  Sparkles,
  Check,
  Eye,
  Download,
  Filter,
  Layout,
  Palette,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AVAILABLE_TEMPLATES } from '@/types/templates';

type FilterType = 'all' | 'free' | 'premium';

export default function TemplateShowcase() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  // Filtrar templates
  const filteredTemplates = AVAILABLE_TEMPLATES.filter(template => {
    if (filter === 'all') return true;
    if (filter === 'free') return !template.isPremium;
    if (filter === 'premium') return template.isPremium;
    return true;
  });

  // Auto-play do carrossel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % AVAILABLE_TEMPLATES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + AVAILABLE_TEMPLATES.length) % AVAILABLE_TEMPLATES.length);
    setIsAutoPlaying(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % AVAILABLE_TEMPLATES.length);
    setIsAutoPlaying(false);
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = AVAILABLE_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    navigate('/criar-curriculo');

    if (template.isPremium) {
      toast.info(`Template Premium: ${template.name}`, {
        description: 'Recursos avançados e IA integrada disponíveis!'
      });
    } else {
      toast.success(`Template selecionado: ${template.name}`);
    }
  };

  const currentTemplate = AVAILABLE_TEMPLATES[currentIndex];
  const isPremium = currentTemplate.isPremium;

  const freeCount = AVAILABLE_TEMPLATES.filter(t => !t.isPremium).length;
  const premiumCount = AVAILABLE_TEMPLATES.filter(t => t.isPremium).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header Moderno */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 hover:bg-blue-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Voltar</span>
              </Button>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  CurriculoGratisOnline
                </div>
                <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
              </div>
            </div>
            <Button
              onClick={() => navigate('/criar-curriculo')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Zap className="w-4 h-4 mr-2" />
              Criar Currículo
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section com Gradiente */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-50" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            {/* Badge de Novidade */}
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6 animate-bounce">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">12 Templates Profissionais Atualizados</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
              Templates de
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                Currículo Premium
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
              Escolha entre nossos templates profissionais cuidadosamente desenvolvidos.
              <span className="font-semibold text-blue-600"> Gratuitos para começar</span>,
              <span className="font-semibold text-purple-600"> Premium com IA para se destacar</span>.
            </p>

            {/* Stats Cards */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="bg-white rounded-2xl shadow-xl p-6 min-w-[140px] transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Gift className="w-6 h-6 text-green-600" />
                  <div className="text-4xl font-bold text-green-600">{freeCount}</div>
                </div>
                <div className="text-sm font-medium text-gray-600">Gratuitos</div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 min-w-[140px] transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Crown className="w-6 h-6 text-purple-600" />
                  <div className="text-4xl font-bold text-purple-600">{premiumCount}</div>
                </div>
                <div className="text-sm font-medium text-gray-600">Premium</div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 min-w-[140px] transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Palette className="w-6 h-6 text-blue-600" />
                  <div className="text-4xl font-bold text-blue-600">100%</div>
                </div>
                <div className="text-sm font-medium text-gray-600">Personalizáveis</div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 min-w-[140px] transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                  <div className="text-4xl font-bold text-indigo-600">ATS</div>
                </div>
                <div className="text-sm font-medium text-gray-600">Compatível</div>
              </div>
            </div>
          </div>

          {/* Carrossel de Destaque */}
          <div className="relative max-w-6xl mx-auto mb-20">
            <Card className="overflow-hidden shadow-2xl bg-white/95 backdrop-blur-sm border-2 border-gray-100 hover:shadow-3xl transition-shadow">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2 gap-0 min-h-[650px]">
                  {/* Imagem do Template */}
                  <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden p-8">
                    <div className="relative w-full h-full max-w-[420px]">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl" />

                      <img
                        src={currentTemplate.preview}
                        alt={currentTemplate.name}
                        className="relative w-full h-full object-contain drop-shadow-2xl rounded-lg transform hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />

                      {/* Badge de categoria */}
                      <div className="absolute top-0 left-0 z-10">
                        {isPremium ? (
                          <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 flex items-center gap-2 shadow-lg text-sm font-semibold">
                            <Crown className="w-4 h-4" />
                            Premium
                          </Badge>
                        ) : (
                          <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 flex items-center gap-2 shadow-lg text-sm font-semibold">
                            <Gift className="w-4 h-4" />
                            Gratuito
                          </Badge>
                        )}
                      </div>

                      {/* Controles do carrossel */}
                      <div className="absolute inset-y-0 left-0 flex items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handlePrevious}
                          className="bg-white/90 hover:bg-white text-gray-900 shadow-xl ml-0 h-12 w-12 rounded-full"
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </Button>
                      </div>

                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleNext}
                          className="bg-white/90 hover:bg-white text-gray-900 shadow-xl mr-0 h-12 w-12 rounded-full"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Informações do Template */}
                  <div className="p-10 lg:p-14 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50">
                    <div className="mb-8">
                      <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                        {currentTemplate.name}
                      </h2>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        {currentTemplate.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                        {isPremium ? (
                          <>
                            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                            <span>Recursos Premium</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-6 h-6 text-green-500 fill-green-500" />
                            <span>Recursos Inclusos</span>
                          </>
                        )}
                      </h3>
                      <ul className="space-y-3">
                        {currentTemplate.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3 text-gray-700">
                            <div className="mt-1">
                              <Check className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-base">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Premium Features Highlight */}
                    {isPremium && (
                      <div className="mb-8 p-5 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-purple-600 rounded-lg">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-bold text-purple-900 text-lg">IA Integrada</span>
                        </div>
                        <p className="text-sm text-purple-700 mb-4 leading-relaxed">
                          Inteligência artificial especializada para otimizar seu currículo automaticamente e criar cartas de apresentação personalizadas.
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <Layout className="w-4 h-4 text-purple-600" />
                          <span className="font-semibold text-purple-900">Personalização Total</span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4">
                      <Button
                        onClick={() => handleTemplateSelect(currentTemplate.id)}
                        className={`flex-1 ${
                          isPremium
                            ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700'
                            : 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700'
                        } text-white font-semibold py-4 shadow-lg hover:shadow-xl transition-all text-base`}
                      >
                        {isPremium ? (
                          <>
                            <Crown className="w-5 h-5 mr-2" />
                            Usar Template Premium
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5 mr-2" />
                            Usar Template Gratuito
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleTemplateSelect(currentTemplate.id)}
                        className="px-6 py-4 hover:bg-blue-50 border-2 transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Indicadores do Carrossel */}
            <div className="flex justify-center mt-8 gap-2">
              {AVAILABLE_TEMPLATES.map((template, index) => (
                <button
                  key={template.id}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 w-12'
                      : 'bg-gray-300 hover:bg-gray-400 w-2'
                  }`}
                  aria-label={`Ir para template ${template.name}`}
                />
              ))}
            </div>
          </div>

          {/* Filtros */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-3 bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
              <Button
                variant={filter === 'all' ? 'default' : 'ghost'}
                onClick={() => setFilter('all')}
                className={`rounded-xl font-semibold ${filter === 'all' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : ''}`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Todos ({AVAILABLE_TEMPLATES.length})
              </Button>
              <Button
                variant={filter === 'free' ? 'default' : 'ghost'}
                onClick={() => setFilter('free')}
                className={`rounded-xl font-semibold ${filter === 'free' ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' : ''}`}
              >
                <Gift className="w-4 h-4 mr-2" />
                Gratuitos ({freeCount})
              </Button>
              <Button
                variant={filter === 'premium' ? 'default' : 'ghost'}
                onClick={() => setFilter('premium')}
                className={`rounded-xl font-semibold ${filter === 'premium' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : ''}`}
              >
                <Crown className="w-4 h-4 mr-2" />
                Premium ({premiumCount})
              </Button>
            </div>
          </div>

          {/* Grid de Todos os Templates */}
          <div className="mb-20">
            <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-4">
              Galeria de Templates
            </h2>
            <p className="text-center text-gray-600 mb-12 text-lg">
              Todos os nossos templates são 100% personalizáveis e otimizados para ATS
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map((template, index) => (
                <Card
                  key={template.id}
                  className={`group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 ${
                    currentIndex === AVAILABLE_TEMPLATES.indexOf(template)
                      ? 'ring-4 ring-blue-500 border-blue-500'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setCurrentIndex(AVAILABLE_TEMPLATES.indexOf(template))}
                  onMouseEnter={() => setHoveredTemplate(template.id)}
                  onMouseLeave={() => setHoveredTemplate(null)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                      <img
                        src={template.preview}
                        alt={template.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />

                      {/* Overlay on Hover */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
                        hoveredTemplate === template.id ? 'opacity-100' : 'opacity-0'
                      }`}>
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <p className="text-sm mb-3 line-clamp-2">
                            {template.description}
                          </p>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTemplateSelect(template.id);
                            }}
                            className={`w-full ${
                              template.isPremium
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600'
                                : 'bg-gradient-to-r from-green-600 to-emerald-600'
                            } hover:opacity-90`}
                            size="sm"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Template
                          </Button>
                        </div>
                      </div>

                      <div className="absolute top-3 left-3 z-10">
                        {template.isPremium ? (
                          <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        ) : (
                          <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
                            <Gift className="w-3 h-3 mr-1" />
                            Gratuito
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-white">
                      <h3 className="font-bold text-gray-900 mb-1 text-base group-hover:text-blue-600 transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {template.style.charAt(0).toUpperCase() + template.style.slice(1)} · {template.isPremium ? 'R$ 4,90' : 'Grátis'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Final */}
          <div className="text-center">
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 lg:p-16 text-white shadow-2xl">
              <div className="absolute inset-0 bg-grid-pattern opacity-10" />
              <div className="relative z-10">
                <Sparkles className="w-12 h-12 mx-auto mb-6 animate-pulse" />
                <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
                  Pronto para Criar seu Currículo?
                </h2>
                <p className="text-xl lg:text-2xl mb-10 opacity-95 max-w-3xl mx-auto leading-relaxed">
                  Escolha um template e comece a construir seu futuro profissional agora mesmo com nossa plataforma gratuita.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={() => navigate('/criar-curriculo')}
                    className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-10 py-6 text-lg shadow-xl hover:shadow-2xl transition-all"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Começar Grátis Agora
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setFilter('premium')}
                    className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold px-10 py-6 text-lg"
                  >
                    <Crown className="w-5 h-5 mr-2" />
                    Ver Templates Premium
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .bg-grid-pattern {
          background-image:
            linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}

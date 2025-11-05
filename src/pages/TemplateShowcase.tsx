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
  Brain,
  Settings,
  Download,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Templates disponíveis com suas imagens
const SHOWCASE_TEMPLATES = [
  {
    id: 'gratuito-1',
    name: 'Profissional Clássico',
    category: 'gratuito',
    image: '/Templates/template_gratuito_1.webp',
    description: 'Template limpo e profissional, ideal para a maioria das áreas',
    features: ['Layout clássico', 'Fácil leitura', 'Compatível ATS'],
    color: 'blue'
  },
  {
    id: 'gratuito-2', 
    name: 'Moderno Simples',
    category: 'gratuito',
    image: '/Templates/template_gratuito_2.webp',
    description: 'Design moderno e minimalista para profissionais jovens',
    features: ['Design atual', 'Layout otimizado', 'Destaque visual'],
    color: 'green'
  },
  {
    id: 'premium-executivo',
    name: 'Executivo Premium',
    category: 'premium',
    image: '/Templates/template_premium_executivo.webp',
    description: 'Para altos executivos e líderes empresariais',
    features: ['IA Integrada', 'Personalização avançada', 'Layout sofisticado', 'Carta de Apresentação com IA'],
    color: 'purple'
  },
  {
    id: 'premium-tech',
    name: 'Tech Professional',
    category: 'premium', 
    image: '/Templates/template_premium_tech.webp',
    description: 'Especializado para profissionais de tecnologia',
    features: ['IA especializada', 'Seções técnicas', 'Design inovador', 'Carta de Apresentação com IA'],
    color: 'indigo'
  },
  {
    id: 'premium-criativo',
    name: 'Criativo Premium',
    category: 'premium',
    image: '/Templates/template_premium_criativo.webp',
    description: 'Para designers, artistas e profissionais criativos',
    features: ['IA criativa', 'Layout único', 'Cores vibrantes', 'Carta de Apresentação com IA'],
    color: 'pink'
  },
  {
    id: 'premium-elegante',
    name: 'Elegante & Sofisticado',
    category: 'premium',
    image: '/Templates/template_premium_elegante.webp',
    description: 'Elegância e sofisticação para executivos seniores',
    features: ['IA avançada', 'Design premium', 'Impressão profissional', 'Carta de Apresentação com IA'],
    color: 'amber'
  },
  {
    id: 'premium-formal',
    name: 'Formal Corporativo',
    category: 'premium',
    image: '/Templates/template_premium_formal.webp',
    description: 'Ideal para ambientes corporativos conservadores',
    features: ['IA corporativa', 'Layout tradicional', 'Máxima seriedade', 'Carta de Apresentação com IA'],
    color: 'slate'
  },
  {
    id: 'premium-minimalista',
    name: 'Minimalista Pro',
    category: 'premium',
    image: '/Templates/template_premium_minimalista.webp',
    description: 'Menos é mais - design ultra-limpo e eficiente',
    features: ['IA minimalista', 'Máxima clareza', 'Foco no conteúdo', 'Carta de Apresentação com IA'],
    color: 'gray'
  },
  {
    id: 'premium-profissional',
    name: 'Profissional Premium',
    category: 'premium',
    image: '/Templates/template_premium_profissional.webp',
    description: 'O equilíbrio perfeito entre profissionalismo e modernidade',
    features: ['IA adaptativa', 'Versatilidade', 'Alta performance', 'Carta de Apresentação com IA'],
    color: 'emerald'
  }
];

export default function TemplateShowcase() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play do carrossel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SHOWCASE_TEMPLATES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + SHOWCASE_TEMPLATES.length) % SHOWCASE_TEMPLATES.length);
    setIsAutoPlaying(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SHOWCASE_TEMPLATES.length);
    setIsAutoPlaying(false);
  };

  const handleTemplateSelect = (template: typeof SHOWCASE_TEMPLATES[0]) => {
    if (template.category === 'gratuito') {
      navigate('/template-selector');
      toast.success(`Template gratuito selecionado: ${template.name}`);
    } else {
      navigate('/template-selector');
      toast.info(`Template premium: ${template.name} - Recursos avançados disponíveis!`);
    }
  };

  const currentTemplate = SHOWCASE_TEMPLATES[currentIndex];
  const isPremium = currentTemplate.category === 'premium';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CurriculoGratisOnline.com
              </div>
            </div>
            <Button
              onClick={() => navigate('/template-selector')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Criar Currículo
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Templates de 
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}Currículo
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Escolha entre nossos templates profissionais cuidadosamente desenvolvidos. 
              Gratuitos para começar, Premium com IA para se destacar.
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">2</div>
                <div className="text-sm text-gray-500">Gratuitos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">7</div>
                <div className="text-sm text-gray-500">Premium</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">100%</div>
                <div className="text-sm text-gray-500">Personalizáveis</div>
              </div>
            </div>
          </div>

          {/* Carrossel Principal */}
          <div className="relative max-w-6xl mx-auto">
            <Card className="overflow-hidden shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2 gap-0 min-h-[600px]">
                  {/* Imagem do Template */}
                  <div className="relative bg-gray-100 flex items-center justify-center overflow-hidden">
                    <div className="relative w-full h-full max-w-[400px] max-h-[600px]">
                      <img
                        src={currentTemplate.image}
                        alt={currentTemplate.name}
                        className="w-full h-full object-cover object-top rounded-lg shadow-lg"
                        style={{ aspectRatio: '210/297' }} // Proporção A4
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                      
                      {/* Badge de categoria */}
                      <div className="absolute top-4 left-4">
                        {isPremium ? (
                          <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            Premium
                          </Badge>
                        ) : (
                          <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 flex items-center gap-1">
                            <Gift className="w-3 h-3" />
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
                          className="bg-white/80 hover:bg-white text-gray-900 shadow-lg ml-2"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleNext}
                          className="bg-white/80 hover:bg-white text-gray-900 shadow-lg mr-2"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Informações do Template */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="mb-6">
                      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        {currentTemplate.name}
                      </h2>
                      <p className="text-lg text-gray-600 mb-6">
                        {currentTemplate.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        {isPremium ? (
                          <Star className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <Zap className="w-5 h-5 text-green-500" />
                        )}
                        Recursos Inclusos
                      </h3>
                      <ul className="space-y-2">
                        {currentTemplate.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-3 text-gray-700">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Premium Features Highlight */}
                    {isPremium && (
                      <div className="mb-8 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-5 h-5 text-purple-600" />
                          <span className="font-semibold text-purple-900">IA Integrada</span>
                        </div>
                        <p className="text-sm text-purple-700 mb-3">
                          Inteligência artificial especializada para otimizar seu currículo automaticamente.
                        </p>
                        <div className="flex items-center gap-2">
                          <Settings className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-900">Personalização Avançada</span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4">
                      <Button
                        onClick={() => handleTemplateSelect(currentTemplate)}
                        className={`flex-1 ${
                          isPremium 
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700' 
                            : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700'
                        } text-white font-medium py-3`}
                      >
                        {isPremium ? (
                          <>
                            <Crown className="w-4 h-4 mr-2" />
                            Usar Template Premium
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Usar Template Gratuito
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => handleTemplateSelect(currentTemplate)}
                        className="px-6"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Indicadores */}
            <div className="flex justify-center mt-8 gap-2">
              {SHOWCASE_TEMPLATES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'bg-blue-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Grid de Todos os Templates */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Todos os Templates Disponíveis
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SHOWCASE_TEMPLATES.map((template, index) => (
                <Card
                  key={template.id}
                  className={`overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${
                    index === currentIndex ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setCurrentIndex(index)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={template.image}
                        alt={template.name}
                        className="w-full h-full object-cover object-top transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                      
                      <div className="absolute top-3 left-3">
                        {template.category === 'premium' ? (
                          <Badge className="bg-purple-600 text-white">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        ) : (
                          <Badge className="bg-green-600 text-white">
                            <Gift className="w-3 h-3 mr-1" />
                            Gratuito
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {template.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Final */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 lg:p-12 text-white">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Pronto para Criar seu Currículo?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Escolha um template e comece a construir seu futuro profissional agora mesmo.
              </p>
              <Button
                size="lg"
                onClick={() => navigate('/template-selector')}
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3"
              >
                Começar Agora - É Grátis!
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

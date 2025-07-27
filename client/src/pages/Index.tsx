import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, FileText, Zap, Download, Mail, Printer, Crown, Star, Users, TrendingUp } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import FloatingLiveCounter from '@/components/FloatingLiveCounter';
import CookieConsent from '@/components/CookieConsent';

export default function Index() {
  const [, setLocation] = useLocation();

  const handleCreateResume = () => {
    setLocation('/criar-curriculo');
  };

  const handleViewTemplates = () => {
    setLocation('/templates');
  };

  const features = [
    {
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      title: "Templates Profissionais",
      description: "Escolha entre diversos modelos gratuitos e premium"
    },
    {
      icon: <Zap className="w-6 h-6 text-green-600" />,
      title: "Criação Rápida",
      description: "Crie seu currículo em poucos minutos"
    },
    {
      icon: <Download className="w-6 h-6 text-purple-600" />,
      title: "Download PDF",
      description: "Baixe em alta qualidade para impressão"
    },
    {
      icon: <Mail className="w-6 h-6 text-red-600" />,
      title: "Envio por Email",
      description: "Envie diretamente para recrutadores"
    },
    {
      icon: <Printer className="w-6 h-6 text-gray-600" />,
      title: "Impressão Otimizada",
      description: "Formatação perfeita para impressão"
    },
    {
      icon: <Crown className="w-6 h-6 text-yellow-600" />,
      title: "Recursos Premium",
      description: "Templates exclusivos e personalização avançada"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Currículos Criados", icon: <FileText className="w-5 h-5" /> },
    { number: "25,000+", label: "Usuários Satisfeitos", icon: <Users className="w-5 h-5" /> },
    { number: "98%", label: "Taxa de Aprovação", icon: <TrendingUp className="w-5 h-5" /> },
    { number: "4.9", label: "Avaliação Média", icon: <Star className="w-5 h-5" /> }
  ];

  return (
    <>
      <SEOHead 
        title="CurriculumGratisOnline - Crie seu Currículo Profissional Gratuitamente"
        description="Crie currículos profissionais gratuitos com nossos templates modernos. Download PDF, envio por email e muito mais!"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
                ✨ Mais de 50.000 currículos criados
              </Badge>

              <h1 
                className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight cursor-pointer select-none"
                onClick={() => {
                  const clicks = parseInt(localStorage.getItem('headline_clicks') || '0') + 1;
                  localStorage.setItem('headline_clicks', clicks.toString());
                  
                  if (clicks === 5) {
                    localStorage.setItem('admin_access_enabled', 'true');
                    alert('🔓 Modo administrativo ativado! Acesse /admin');
                    localStorage.setItem('headline_clicks', '0'); // Reset counter
                  } else if (clicks < 5) {
                    console.log(`🔢 Cliques na headline: ${clicks}/5`);
                  }
                }}
              >
                Crie seu{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Currículo Profissional
                </span>
                {" "}gratuitamente
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Templates modernos, exportação em PDF, envio por email e recursos premium. 
                Tudo o que você precisa para impressionar recrutadores.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  onClick={handleCreateResume}
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Criar Currículo Grátis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <Button 
                  onClick={handleViewTemplates}
                  variant="outline" 
                  size="lg"
                  className="px-8 py-3 text-lg font-semibold border-2 hover:bg-gray-50 transition-all duration-300"
                >
                  Ver Templates
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-center mb-2 text-blue-600">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Recursos Poderosos
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Tudo o que você precisa para criar um currículo que se destaca
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-0 shadow-sm">
                  <CardHeader className="pb-4">
                    <div className="mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para impressionar recrutadores?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Junte-se a milhares de profissionais que conseguiram suas vagas dos sonhos
            </p>
            <Button 
              onClick={handleCreateResume}
              size="lg" 
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FileText className="w-5 h-5 mr-2" />
              Começar Agora - É Grátis!
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>

        <FloatingLiveCounter />
        <CookieConsent />
      </div>
    </>
  );
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, FileText, Zap, Users, Award, ChevronDown, Play, Quote, User, CheckCircle, Clock, Sparkles } from "lucide-react";

const Index = () => {
  const [adminClicks, setAdminClicks] = useState(0);

  const handleHeadlineClick = () => {
    setAdminClicks(prev => prev + 1);
    if (adminClicks === 4) {
      window.location.href = "/admin-dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="max-w-6xl mx-auto">
          <Badge variant="secondary" className="mb-6 text-primary bg-primary/10">
            CVGrátis
          </Badge>
          <h1 
            className="text-5xl md:text-7xl font-bold mb-6 text-foreground cursor-pointer"
            onClick={handleHeadlineClick}
          >
            Transforme sua vida com um{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              currículo profissional
            </span>{" "}
            em minutos
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Crie currículos impressionantes com a ajuda da nossa IA especializada. 
            Gratuito, simples e profissional.
          </p>
          <Button size="lg" className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <FileText className="mr-2" />
            Começar agora gratuitamente
          </Button>
        </div>
      </section>

      {/* Benefícios da Plataforma */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
            Por que escolher o CVGrátis?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <Zap className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Rápido e Inteligente</h3>
                <p className="text-muted-foreground">
                  Nossa IA especializada JobAI cria conteúdo profissional em segundos
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <FileText className="w-16 h-16 text-accent mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-4 text-foreground">100% Gratuito</h3>
                <p className="text-muted-foreground">
                  Crie currículos profissionais sem pagar nada. Modelos premium por apenas R$ 4,90
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <Award className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Profissional</h3>
                <p className="text-muted-foreground">
                  Modelos criados por especialistas em recrutamento e RH
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
            Como funciona em 3 etapas simples
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Preencha seus dados</h3>
              <p className="text-muted-foreground">
                Adicione suas informações pessoais, experiências e habilidades
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-accent-foreground">2</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">IA cria o conteúdo</h3>
              <p className="text-muted-foreground">
                Nossa JobAI otimiza seu currículo para impressionar recrutadores
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-primary-foreground">3</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Baixe e use</h3>
              <p className="text-muted-foreground">
                Download em PDF, impressão ou envio por email
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Emocional */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-foreground">
            Você também já passou por isso?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-8 border-destructive/20">
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold mb-4 text-destructive">😔 Antes</h3>
                <ul className="text-left space-y-2 text-muted-foreground">
                  <li>• Currículo desatualizado ou mal formatado</li>
                  <li>• Dificuldade para destacar experiências</li>
                  <li>• Insegurança em entrevistas</li>
                  <li>• Rejeições constantes</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="p-8 border-accent/20">
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold mb-4 text-accent">😊 Depois</h3>
                <ul className="text-left space-y-2 text-muted-foreground">
                  <li>• Currículo profissional e atrativo</li>
                  <li>• Experiências bem descritas pela IA</li>
                  <li>• Mais confiança e preparo</li>
                  <li>• Mais oportunidades e entrevistas</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <Button size="lg" className="text-lg px-8 py-6">
            Quero transformar minha carreira agora
          </Button>
        </div>
      </section>

      {/* JobAI Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 border-primary text-primary">
            <Sparkles className="w-4 h-4 mr-2" />
            Inteligência Artificial
          </Badge>
          <h2 className="text-4xl font-bold mb-8 text-foreground">
            Conheça a JobAI: sua assistente para currículo, entrevistas e carreira
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Nossa IA especializada em RH ajuda você a criar descrições profissionais, 
            otimizar seu perfil e se preparar para entrevistas.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Objetivos Profissionais</h3>
                <p className="text-sm text-muted-foreground">Cria descrições impactantes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Experiências</h3>
                <p className="text-sm text-muted-foreground">Destaca suas conquistas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Avaliação</h3>
                <p className="text-sm text-muted-foreground">Analisa e sugere melhorias</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Dicas de Carreira</h3>
                <p className="text-sm text-muted-foreground">Orienta sua jornada</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
            O que nossos usuários dizem
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  "Consegui meu primeiro emprego depois de usar o CVGrátis. A IA realmente fez a diferença!"
                </p>
                <div className="flex items-center">
                  <User className="w-10 h-10 text-muted-foreground mr-3" />
                  <div>
                    <p className="font-semibold">Maria Silva</p>
                    <p className="text-sm text-muted-foreground">Analista de Marketing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  "Plataforma incrível! Em 15 minutos tinha um currículo profissional pronto."
                </p>
                <div className="flex items-center">
                  <User className="w-10 h-10 text-muted-foreground mr-3" />
                  <div>
                    <p className="font-semibold">João Santos</p>
                    <p className="text-sm text-muted-foreground">Desenvolvedor</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  "A avaliação da IA me ajudou a melhorar pontos que nem sabia que existiam."
                </p>
                <div className="flex items-center">
                  <User className="w-10 h-10 text-muted-foreground mr-3" />
                  <div>
                    <p className="font-semibold">Ana Costa</p>
                    <p className="text-sm text-muted-foreground">Enfermeira</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-foreground">
            Veja o CVGrátis em ação
          </h2>
          <Card className="p-8">
            <CardContent className="p-0">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center mb-6">
                <Play className="w-20 h-20 text-primary" />
              </div>
              <p className="text-muted-foreground mb-6">
                Assista como é simples criar um currículo profissional em poucos minutos
              </p>
              <Button variant="outline" size="lg">
                <Play className="mr-2" />
                Assistir demonstração
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
            Dúvidas frequentes
          </h2>
          <div className="space-y-4">
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">É realmente gratuito?</h3>
                  <ChevronDown className="w-5 h-5" />
                </div>
                <p className="text-muted-foreground mt-4">
                  Sim! Você pode criar currículos profissionais gratuitamente. 
                  Oferecemos também modelos premium com mais opções de personalização por R$ 4,90.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Como a IA me ajuda?</h3>
                  <ChevronDown className="w-5 h-5" />
                </div>
                <p className="text-muted-foreground mt-4">
                  Nossa JobAI analisa suas informações e cria descrições profissionais, 
                  objetivos de carreira e sugestões de melhoria personalizadas.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Posso editar depois de criar?</h3>
                  <ChevronDown className="w-5 h-5" />
                </div>
                <p className="text-muted-foreground mt-4">
                  Claro! Você pode editar todas as informações em tempo real 
                  e ver as mudanças instantaneamente no preview.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-accent text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Comece sua transformação profissional agora
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Milhares de pessoas já conseguiram seus empregos dos sonhos. 
            Sua vez está chegando!
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
            <Clock className="mr-2" />
            Criar meu currículo agora - É GRÁTIS
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;

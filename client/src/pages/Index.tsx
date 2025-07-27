import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, FileText, Zap, Users, Award, ChevronDown, Play, Quote, User, CheckCircle, Clock, Sparkles, Crown, Target, TrendingUp, Shield, Gift, Rocket } from "lucide-react";
import Logo from "@/components/Logo";
import { useAdminAccess } from "@/hooks/useAdminAccess";

const Index = () => {
  const { handleHeadlineClick } = useAdminAccess();

  return (
    <div className="min-h-screen bg-background">
      {/* Header com Logo */}
      <header className="py-6 px-4 border-b bg-white/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Logo size="md" />
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <a href="/templates">Ver Templates</a>
            </Button>
            <Button asChild className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
              <a href="/criar-curriculo">
                <Gift className="w-4 h-4 mr-2" />
                GRÁTIS AGORA
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Super Persuasivo */}
      <section className="relative py-16 px-4 text-center bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-green-600/5"></div>
        
        <div className="max-w-6xl mx-auto relative">
          {/* Badge de destaque */}
          <div className="flex justify-center mb-6">
            <Badge className="bg-green-100 text-green-800 border-green-200 px-6 py-2 text-lg font-semibold">
              🎉 100% GRATUITO - SEM CARTÃO DE CRÉDITO
            </Badge>
          </div>

          <div className="mb-8">
            <Logo size="lg" className="justify-center mb-6" />
          </div>

          {/* Headline clicável para acesso admin (5 cliques) */}
          <h1 
            className="text-4xl md:text-7xl font-black mb-6 text-foreground cursor-pointer leading-tight select-none transition-all duration-200 hover:text-blue-600"
            onClick={handleHeadlineClick}
            title="Clique 5 vezes para acessar painel administrativo"
          >
            Crie Seu Currículo{" "}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              PERFEITO
            </span>{" "}
            em 3 Minutos
          </h1>

          {/* Subheadline persuasivo */}
          <div className="max-w-4xl mx-auto mb-8">
            <p className="text-2xl md:text-3xl text-gray-700 font-semibold mb-4">
              ⚡ IA Poderosa + Templates Profissionais = SEU EMPREGO DOS SONHOS
            </p>
            <p className="text-xl text-gray-600">
              Mais de <strong className="text-green-600">127.000 pessoas</strong> já conseguiram emprego usando nossos currículos. 
              <br />Sua vez chegou! 🚀
            </p>
          </div>

          {/* Social Proof */}
          <div className="flex justify-center items-center gap-2 mb-8">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-green-400 border-2 border-white flex items-center justify-center text-white font-bold">
                  {String.fromCharCode(65 + i)}
                </div>
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
          <div className="space-y-4">
            <Button asChild size="lg" className="text-xl px-12 py-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transform hover:scale-105">
              <a href="/criar-curriculo">
                <Rocket className="mr-3 w-6 h-6" />
                CRIAR MEU CURRÍCULO GRÁTIS AGORA
              </a>
            </Button>
            <p className="text-sm text-gray-500">
              ✅ Sem cadastro • ✅ Sem cartão • ✅ Download imediato
            </p>
          </div>

          {/* Urgência */}
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-red-700 font-semibold">
              ⏰ <strong>ATENÇÃO:</strong> Mais de 400 pessoas criaram currículo hoje!
              <br />Não perca mais oportunidades de emprego.
            </p>
          </div>
        </div>
      </section>

      {/* Seção GRATUITO vs PREMIUM - Comparativo */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">GRÁTIS Para Sempre vs PREMIUM</h2>
            <p className="text-xl text-gray-600">
              Comece grátis e desbloqueie recursos profissionais quando quiser
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* GRÁTIS */}
            <Card className="p-8 border-2 border-green-200 bg-green-50 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-green-500 text-white">100% GRÁTIS</Badge>
              </div>
              <CardContent className="p-0">
                <div className="text-center mb-6">
                  <Gift className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-green-800">VERSÃO GRATUITA</h3>
                  <p className="text-green-600 font-semibold">Para sempre, sem pegadinhas</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>✨ <strong>IA integrada</strong> para descrições profissionais</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>🎨 <strong>2 templates</strong> modernos e elegantes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>📄 <strong>Download PDF</strong> ilimitado</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>🖨️ <strong>Impressão</strong> otimizada</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>💾 <strong>Salvamento automático</strong></span>
                  </li>
                </ul>

                <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
                  <a href="/criar-curriculo">
                    COMEÇAR GRÁTIS AGORA
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* PREMIUM */}
            <Card className="p-8 border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  <Crown className="w-4 h-4 mr-1" />
                  PREMIUM
                </Badge>
              </div>
              <CardContent className="p-0">
                <div className="text-center mb-6">
                  <Crown className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-yellow-800">VERSÃO PREMIUM</h3>
                  <p className="text-yellow-600 font-semibold">Apenas R$ 4,90 por template</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-yellow-600" />
                    <span>🏆 <strong>Tudo do GRÁTIS +</strong></span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-yellow-600" />
                    <span>🎨 <strong>5 templates exclusivos</strong> premium</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-yellow-600" />
                    <span>✏️ <strong>Editor avançado</strong> - fontes e cores</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-yellow-600" />
                    <span>⭐ <strong>Avaliação IA</strong> com nota 9.2/10</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-yellow-600" />
                    <span>📊 <strong>Relatório completo</strong> de melhorias</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-yellow-600" />
                    <span>📧 <strong>Envio automático</strong> por email</span>
                  </li>
                </ul>

                <Button asChild className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-lg py-6">
                  <a href="/templates">
                    VER TEMPLATES PREMIUM
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Destaque da avaliação IA */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
            <div className="flex justify-center items-center gap-4 mb-4">
              <div className="flex text-yellow-400 text-2xl">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-8 h-8 fill-current" />
                ))}
              </div>
              <span className="text-4xl font-black text-blue-600">9.2/10</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              🤖 Sua IA Pessoal Avalia Seu Currículo
            </h3>
            <p className="text-lg text-gray-600">
              Nossa inteligência artificial analisa seu currículo e dá uma <strong>nota profissional</strong>, 
              além de sugestões personalizadas para você se destacar no mercado!
            </p>
          </div>
        </div>
      </section>

      {/* Gatilhos de Urgência e Escassez */}
      <section className="py-16 px-4 bg-red-50 border-y-2 border-red-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black text-red-700 mb-4">
            ⚠️ ATENÇÃO: Não Deixe Suas Oportunidades Escaparem!
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border-2 border-red-200">
              <TrendingUp className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">Mercado Competitivo</h3>
              <p className="text-gray-600">Cada vaga recebe mais de <strong>200 currículos</strong>. O seu precisa se destacar!</p>
            </div>
            <div className="bg-white p-6 rounded-lg border-2 border-red-200">
              <Clock className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">Tempo é Dinheiro</h3>
              <p className="text-gray-600">Cada dia sem emprego = <strong>R$ 100+ perdidos</strong>. Acelere sua busca!</p>
            </div>
            <div className="bg-white p-6 rounded-lg border-2 border-red-200">
              <Target className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">Primeiras Impressões</h3>
              <p className="text-gray-600">RH decide em <strong>6 segundos</strong> se vai ler seu currículo completo!</p>
            </div>
          </div>
          <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-xl px-8 py-6 animate-bounce">
            <a href="/criar-curriculo">
              NÃO PERDER MAIS OPORTUNIDADES
            </a>
          </Button>
        </div>
      </section>

      {/* Como Funciona - Otimizado */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">3 Passos Para Seu Emprego dos Sonhos</h2>
            <p className="text-xl text-gray-600">
              Simples, rápido e <strong>comprovadamente eficaz</strong>
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-black">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4">📝 Preencha em 3 Min</h3>
              <p className="text-gray-600 mb-4">
                Nossa <strong>IA inteligente</strong> ajuda você a escrever descrições profissionais que impressionam RH.
              </p>
              <Badge className="bg-green-100 text-green-800">IA Integrada</Badge>
            </div>

            <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-black">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4">🎨 Escolha o Design</h3>
              <p className="text-gray-600 mb-4">
                Templates <strong>testados e aprovados</strong> por profissionais de RH das maiores empresas.
              </p>
              <Badge className="bg-blue-100 text-blue-800">Aprovado por RH</Badge>
            </div>

            <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-black">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4">🚀 Conquiste a Vaga</h3>
              <p className="text-gray-600 mb-4">
                Download instantâneo e <strong>envie para centenas</strong> de empresas. Seu próximo emprego está a um clique!
              </p>
              <Badge className="bg-purple-100 text-purple-800">Sucesso Garantido</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos com Credibilidade */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">💬 Quem Usou, Aprovou e CONSEGUIU EMPREGO!</h2>
            <p className="text-xl text-gray-600">
              Histórias reais de sucesso • <strong>Resultados comprovados</strong>
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
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
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">🏆 Números Que Falam Por Si</h2>
            <p className="text-xl opacity-90">Resultados reais de uma plataforma que FUNCIONA</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-5xl font-black mb-2">127K+</div>
              <p className="text-blue-100 font-semibold">Currículos criados</p>
              <p className="text-sm opacity-75">E contando...</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-5xl font-black mb-2">96%</div>
              <p className="text-blue-100 font-semibold">Taxa de contratação</p>
              <p className="text-sm opacity-75">Em até 30 dias</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-5xl font-black mb-2">3min</div>
              <p className="text-blue-100 font-semibold">Tempo médio</p>
              <p className="text-sm opacity-75">Para criar currículo</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-5xl font-black mb-2">9.2</div>
              <p className="text-blue-100 font-semibold">Nota média IA</p>
              <p className="text-sm opacity-75">Avaliação profissional</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Poderoso */}
      <section className="py-20 px-4 text-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-12 rounded-3xl shadow-2xl border-2 border-green-200">
            <Sparkles className="w-20 h-20 text-green-600 mx-auto mb-6" />
            <h2 className="text-5xl font-black mb-6 text-gray-800">
              Sua Nova Carreira Começa AGORA!
            </h2>
            <p className="text-2xl text-gray-600 mb-8 font-semibold">
              Não espere mais! Milhares já conseguiram o emprego dos sonhos.
              <br />
              <span className="text-green-600">Sua vez chegou! 🚀</span>
            </p>
            
            <div className="space-y-4 mb-8">
              <Button asChild size="lg" className="text-2xl px-12 py-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transform hover:scale-105">
                <a href="/criar-curriculo">
                  <Rocket className="mr-3 w-8 h-8" />
                  CRIAR MEU CURRÍCULO VENCEDOR AGORA
                </a>
              </Button>
              <p className="text-lg text-gray-500">
                ✅ 100% Gratuito • ✅ Sem pegadinhas • ✅ Resultado garantido
              </p>
            </div>

            <div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl p-6">
              <p className="text-yellow-800 font-bold text-lg">
                🎁 <strong>BÔNUS EXCLUSIVO:</strong> Quem criar hoje ganha acesso ao 
                <strong> Guia Secreto de Entrevistas</strong> (valor R$ 97) - GRÁTIS!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <Logo size="md" className="mb-4" />
              <p className="text-gray-300 mb-4">
                A plataforma de criação de currículos mais eficaz do Brasil. 
                <strong>Comprovadamente aprovada por RH</strong> das maiores empresas.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <p><strong>Produções ComPG</strong></p>
                <p>Minas Gerais, MG</p>
                <p>📞 +55 (31) 97105-2200</p>
                <p>✉️ contato@compg.com.br</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">🚀 Produtos</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/criar-curriculo" className="hover:text-white transition-colors">Criar Currículo GRÁTIS</a></li>
                <li><a href="/templates" className="hover:text-white transition-colors">Templates Premium</a></li>
                <li><a href="/premium-editor" className="hover:text-white transition-colors">Editor Avançado</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">⚖️ Legal</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/politica-privacidade" className="hover:text-white transition-colors">Política de Privacidade</a></li>
                <li><a href="/termos-uso" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="/politica-cookies" className="hover:text-white transition-colors">Política de Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CVGratis Online - Produções ComPG. Todos os direitos reservados.</p>
            <p className="mt-2 text-sm">
              🇧🇷 Feito em Minas Gerais com ❤️ para profissionais que querem se destacar no mercado.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

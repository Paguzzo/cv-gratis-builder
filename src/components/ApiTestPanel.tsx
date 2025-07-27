import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  Mail, 
  Zap, 
  CreditCard,
  Eye,
  Send,
  Sparkles
} from 'lucide-react';
import { EmailService } from '@/services/emailService';
import { AIService } from '@/services/aiService';
// import { StripeService } from '@/services/stripeService'; // 🚨 REMOVIDO
import { useToast } from '@/hooks/use-toast';

interface ApiStatus {
  name: string;
  status: 'loading' | 'success' | 'error' | 'not-configured';
  message: string;
  details?: any;
}

export default function ApiTestPanel() {
  const [apiStatuses, setApiStatuses] = useState<Record<string, ApiStatus>>({
    resend: { name: 'Resend Email', status: 'loading', message: 'Verificando...' },
    emailjs: { name: 'EmailJS', status: 'loading', message: 'Verificando...' },
    openai: { name: 'OpenAI', status: 'loading', message: 'Verificando...' },
    stripe: { name: 'Stripe', status: 'loading', message: 'Verificando...' }
  });

  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [isTestingAI, setIsTestingAI] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testPrompt, setTestPrompt] = useState('Desenvolver software, liderança, 5 anos experiência');

  const { toast } = useToast();

  useEffect(() => {
    checkAllApis();
  }, []);

  const checkAllApis = async () => {
    // Verificar Email Service
    try {
      const emailConfig = EmailService.checkConfiguration();
      const emailTest = await EmailService.testConnection();
      
      setApiStatuses(prev => ({
        ...prev,
        resend: {
          name: 'Resend Email',
          status: emailConfig.resend ? 'success' : 'not-configured',
          message: emailConfig.resend ? 'Configurado e pronto' : 'API key não configurada',
          details: emailTest.details.resend
        },
        emailjs: {
          name: 'EmailJS Fallback',
          status: emailConfig.emailjs ? 'success' : 'not-configured',
          message: emailConfig.emailjs ? 'Configurado como fallback' : 'Não configurado',
          details: emailTest.details.emailjs
        }
      }));
    } catch (error) {
      setApiStatuses(prev => ({
        ...prev,
        resend: { name: 'Resend Email', status: 'error', message: 'Erro na verificação' },
        emailjs: { name: 'EmailJS Fallback', status: 'error', message: 'Erro na verificação' }
      }));
    }

    // Verificar OpenAI
    try {
      const aiConfig = AIService.checkConfiguration();
      const aiTest = await AIService.testConnection();
      
      setApiStatuses(prev => ({
        ...prev,
        openai: {
          name: 'OpenAI',
          status: aiTest.success ? 'success' : (aiConfig.hasApiKey ? 'error' : 'not-configured'),
          message: aiTest.success ? `Conectado (${aiTest.model})` : (aiTest.error || 'API key não configurada'),
          details: { ...aiConfig, ...aiTest }
        }
      }));
    } catch (error) {
      setApiStatuses(prev => ({
        ...prev,
        openai: { name: 'OpenAI', status: 'error', message: 'Erro na verificação' }
      }));
    }

    // Verificar Stripe
    try {
      // 🚨 CORREÇÃO: Teste simples sem StripeService  
      const stripeConfig = { configured: false, hasPublishableKey: false };
      const stripeTest = { success: false, message: 'Stripe desabilitado', error: 'Desabilitado' };
      
      setApiStatuses(prev => ({
        ...prev,
        stripe: {
          name: 'Stripe',
          status: stripeTest.success ? 'success' : (stripeConfig.hasPublishableKey ? 'error' : 'not-configured'),
          message: stripeTest.success ? 'Conectado e inicializado' : (stripeTest.error || 'Publishable key não configurada'),
          details: { ...stripeConfig, ...stripeTest }
        }
      }));
    } catch (error) {
      setApiStatuses(prev => ({
        ...prev,
        stripe: { name: 'Stripe', status: 'error', message: 'Erro na verificação' }
      }));
    }
  };

  const testEmailSending = async () => {
    if (!testEmail) {
      toast({
        title: "Email necessário",
        description: "Digite um email para teste.",
        variant: "destructive"
      });
      return;
    }

    setIsTestingEmail(true);
    try {
      const result = await EmailService.sendEmailWithFallback({
        to_email: testEmail,
        subject: 'Teste CVGratis - API Funcionando!',
        message: 'Este é um email de teste para verificar se a API está funcionando corretamente.\n\nEnviado automaticamente pelo sistema CVGratis.',
        from_name: 'CVGratis Test'
      });

      setTestResults(prev => ({
        ...prev,
        email: result
      }));

      if (result.success) {
        toast({
          title: "Email enviado!",
          description: `Email teste enviado via ${result.method} para ${testEmail}`,
        });
      } else {
        toast({
          title: "Falha no envio",
          description: "Não foi possível enviar o email de teste.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro no teste",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsTestingEmail(false);
    }
  };

  const testAIGeneration = async () => {
    if (!testPrompt) {
      toast({
        title: "Prompt necessário",
        description: "Digite palavras-chave para teste da IA.",
        variant: "destructive"
      });
      return;
    }

    setIsTestingAI(true);
    try {
      const result = await AIService.generateText(
        'objective',
        'Profissional experiente em desenvolvimento de software',
        testPrompt
      );

      setTestResults(prev => ({
        ...prev,
        ai: { text: result, keywords: testPrompt }
      }));

      toast({
        title: "IA funcionando!",
        description: "Texto gerado com sucesso pela IA.",
      });
    } catch (error) {
      toast({
        title: "Erro na IA",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsTestingAI(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'not-configured': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default: return <Loader2 className="w-5 h-5 animate-spin text-blue-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success': return <Badge className="bg-green-100 text-green-800">Funcionando</Badge>;
      case 'error': return <Badge className="bg-red-100 text-red-800">Erro</Badge>;
      case 'not-configured': return <Badge className="bg-yellow-100 text-yellow-800">Não Configurado</Badge>;
      default: return <Badge className="bg-blue-100 text-blue-800">Verificando...</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🔧 Painel de Teste das APIs
        </h1>
        <p className="text-gray-600">
          Verifique se todas as APIs estão configuradas e funcionando corretamente
        </p>
      </div>

      {/* Status das APIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(apiStatuses).map(([key, api]) => (
          <Card key={key}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {key === 'resend' && <Mail className="w-4 h-4" />}
                  {key === 'emailjs' && <Mail className="w-4 h-4" />}
                  {key === 'openai' && <Sparkles className="w-4 h-4" />}
                  {key === 'stripe' && <CreditCard className="w-4 h-4" />}
                  <span className="font-medium text-sm">{api.name}</span>
                </div>
                {getStatusIcon(api.status)}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {getStatusBadge(api.status)}
              <p className="text-xs text-gray-600 mt-2">{api.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Testes Funcionais */}
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="email">Teste Email</TabsTrigger>
          <TabsTrigger value="ai">Teste IA</TabsTrigger>
          <TabsTrigger value="config">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Teste de Envio de Email
              </CardTitle>
              <CardDescription>
                Teste real de envio de email via Resend ou EmailJS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite seu email para teste"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  type="email"
                  className="flex-1"
                />
                <Button 
                  onClick={testEmailSending} 
                  disabled={isTestingEmail || !testEmail}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isTestingEmail ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Enviar Teste
                </Button>
              </div>
              
              {testResults.email && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {testResults.email.success ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="font-medium">
                      {testResults.email.success ? 'Sucesso' : 'Falha'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Método: {testResults.email.method} | Status: {testResults.email.success ? 'Enviado' : 'Erro'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Teste de Geração de IA
              </CardTitle>
              <CardDescription>
                Teste real da API OpenAI para geração de texto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Palavras-chave de teste:</label>
                <Input
                  placeholder="Ex: liderança, gestão, 5 anos, desenvolvimento"
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={testAIGeneration} 
                disabled={isTestingAI || !testPrompt}
                className="bg-purple-600 hover:bg-purple-700 w-full"
              >
                {isTestingAI ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Zap className="w-4 h-4 mr-2" />
                )}
                Gerar Objetivo Profissional
              </Button>
              
              {testResults.ai && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Texto Gerado pela IA:</span>
                  </div>
                  <div className="bg-white p-3 rounded border text-sm leading-relaxed">
                    {testResults.ai.text}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Baseado nas palavras-chave: {testResults.ai.keywords}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Configurações das APIs
              </CardTitle>
              <CardDescription>
                Detalhes das configurações e variáveis de ambiente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(apiStatuses).map(([key, api]) => (
                  <div key={key} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{api.name}</h4>
                      {getStatusBadge(api.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{api.message}</p>
                    
                    {api.details && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                          Ver detalhes técnicos
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-100 rounded overflow-x-auto">
                          {JSON.stringify(api.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 Como corrigir problemas:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Verifique se as chaves de API estão corretas no arquivo .env</li>
                  <li>• Reinicie o servidor após alterar variáveis de ambiente</li>
                  <li>• Confirme se as chaves têm as permissões necessárias</li>
                  <li>• Verifique sua conexão com a internet</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Ações Rápidas */}
      <div className="flex gap-2 justify-center">
        <Button onClick={checkAllApis} variant="outline">
          <Loader2 className="w-4 h-4 mr-2" />
          Verificar Novamente
        </Button>
      </div>
    </div>
  );
} 
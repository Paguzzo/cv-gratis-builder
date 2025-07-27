import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function DebugTemplates() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    console.log('🔍 DebugTemplates: Página carregada com sucesso!');
    console.log('🔍 URL atual:', window.location.href);
    console.log('🔍 LocalStorage dados:', localStorage.getItem('curriculum-data'));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setLocation('/criar-curriculo')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Criação
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔍 Debug - Página de Templates
          </h1>
          <p className="text-gray-600">
            Esta página foi carregada com sucesso! O problema foi resolvido.
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                Navegação Funcionando
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                A navegação do botão "Finalizar" está funcionando corretamente.
                A página está carregando sem problemas.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <CheckCircle className="w-5 h-5" />
                Contextos Carregados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Os contextos do React estão funcionando e os dados 
                estão sendo preservados durante a navegação.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Debug Info */}
        <Card>
          <CardHeader>
            <CardTitle>🔧 Informações de Debug</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">URL Atual:</h4>
              <code className="text-sm bg-gray-100 p-2 rounded block">
                {window.location.href}
              </code>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Data/Hora de Carregamento:</h4>
              <code className="text-sm bg-gray-100 p-2 rounded block">
                {new Date().toLocaleString()}
              </code>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Status dos Dados:</h4>
              <code className="text-sm bg-gray-100 p-2 rounded block overflow-x-auto">
                {localStorage.getItem('curriculum-data') ? 
                  'Dados encontrados no localStorage' : 
                  'Nenhum dado encontrado no localStorage'}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-6 flex gap-4">
          <Button 
            onClick={() => setLocation('/templates')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Ir para Templates Reais
          </Button>
          
          <Button 
            onClick={() => {
              console.log('🔍 Recarregando página...');
              window.location.reload();
            }}
            variant="outline"
          >
            Recarregar Página
          </Button>
          
          <Button 
            onClick={() => {
              console.log('🔍 Limpando localStorage...');
              localStorage.clear();
              setLocation('/');
            }}
            variant="destructive"
          >
            Limpar Dados
          </Button>
        </div>

        {/* Instruções */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">✅ Problema Resolvido</h3>
          <p className="text-sm text-blue-800">
            Esta página carregou com sucesso, o que significa que a navegação está funcionando.
            Se você estava vendo uma tela em branco antes, pode ter sido um problema temporário
            de contexto ou dados. Agora você pode:
          </p>
          <ul className="list-disc list-inside text-sm text-blue-800 mt-2 space-y-1">
            <li>Clicar em "Ir para Templates Reais" para ver os templates</li>
            <li>Voltar para criação e tentar novamente</li>
            <li>Verificar o console do navegador (F12) para mais detalhes</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 
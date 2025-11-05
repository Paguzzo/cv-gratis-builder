import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AVAILABLE_TEMPLATES } from '@/types/templates';
import { Crown, Settings, Eye, ArrowLeft, ExternalLink } from 'lucide-react';

export default function AdminPremium() {
  const navigate = useNavigate();

  // Filtrar apenas templates premium
  const premiumTemplates = AVAILABLE_TEMPLATES.filter(template => template.isPremium);

  const handleAccessTemplate = (templateId: string) => {
    console.log('🔧 ADMIN: Acessando template premium:', templateId);
    navigate(`/premium-editor?template=${templateId}`);
  };

  const handlePreviewTemplate = (templateId: string) => {
    console.log('🔧 ADMIN: Preview do template:', templateId);
    // Navegar para template-selector com o template selecionado
    navigate(`/template-selector?selected=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
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
              
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-yellow-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Área Administrativa Premium</h1>
                  <p className="text-sm text-gray-600">Acesso direto aos templates premium para avaliação</p>
                </div>
              </div>
            </div>

            <Badge variant="secondary" className="flex items-center gap-2">
              <Settings className="w-3 h-3" />
              Admin Mode
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Templates Premium Disponíveis</h2>
          <p className="text-gray-600">
            Clique em "Configurar" para acessar a página de configuração premium de cada template.
          </p>
        </div>

        {/* Grid de Templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {premiumTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-600" />
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="text-xs"
                    style={{ 
                      borderColor: template.colors.primary,
                      color: template.colors.primary 
                    }}
                  >
                    R$ {template.price?.toFixed(2)}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Recursos:</h4>
                  <div className="grid grid-cols-1 gap-1">
                    {template.features?.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                        <div 
                          className="w-1.5 h-1.5 rounded-full" 
                          style={{ backgroundColor: template.colors.accent }}
                        />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {template.features && template.features.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{template.features.length - 3} recursos
                      </div>
                    )}
                  </div>
                </div>

                {/* Color Palette */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Paleta de Cores:</h4>
                  <div className="flex gap-2">
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: template.colors.primary }}
                      title="Primary"
                    />
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: template.colors.secondary }}
                      title="Secondary"
                    />
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: template.colors.accent }}
                      title="Accent"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleAccessTemplate(template.id)}
                    className="flex-1 text-sm"
                    style={{ 
                      backgroundColor: template.colors.primary,
                      color: 'white'
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configurar
                  </Button>
                  
                  <Button
                    onClick={() => handlePreviewTemplate(template.id)}
                    variant="outline"
                    size="sm"
                    className="px-3"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>

                {/* Template ID */}
                <div className="text-xs text-gray-400 font-mono">
                  ID: {template.id}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Footer */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Crown className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Sobre esta Área Administrativa</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• Esta página permite acesso direto aos templates premium para avaliação e melhorias.</p>
                <p>• O botão "Configurar" leva diretamente para a página de configuração premium.</p>
                <p>• O botão "Preview" leva para a página de seleção com o template pré-selecionado.</p>
                <p>• Total de templates premium: <strong>{premiumTemplates.length}</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

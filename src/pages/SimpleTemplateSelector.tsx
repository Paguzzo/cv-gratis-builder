import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SimpleProvider, useSimpleContext } from '@/contexts/SimpleContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Eye } from 'lucide-react';

const SIMPLE_TEMPLATES = [
  {
    id: 'simple-modern',
    name: 'Moderno Simples',
    description: 'Template limpo e profissional',
    preview: '📄',
    isPremium: false
  },
  {
    id: 'simple-creative',
    name: 'Criativo Simples',
    description: 'Com toque de cor e design',
    preview: '🎨',
    isPremium: false
  }
];

function SimpleTemplateSelectorContent() {
  const navigate = useNavigate();
  const { curriculumData, hasValidData, setSelectedTemplate } = useSimpleContext();

  // Verificar se temos dados
  if (!hasValidData()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Dados não encontrados
          </h2>
          <p className="text-gray-600 mb-6">
            Você precisa preencher os dados básicos antes de escolher um template.
          </p>
          <Button onClick={() => navigate('/criar-curriculo')}>
            Preencher Dados
          </Button>
        </div>
      </div>
    );
  }

  const handleTemplateSelect = (templateId: string) => {
    console.log('🔧 Selecionando template:', templateId);
    setSelectedTemplate(templateId);
  };

  const handleDownload = () => {
    // Simulação de download
    alert('Em breve: Download do PDF!\nPor enquanto, apenas demonstração.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/criar-curriculo')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Edição
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Escolha seu Template
          </h1>
          <p className="text-gray-600">
            Selecione o design que mais combina com você
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Templates */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Templates Disponíveis</h2>
            
            <div className="space-y-4">
              {SIMPLE_TEMPLATES.map((template) => (
                <Card 
                  key={template.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300"
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <span className="text-3xl">{template.preview}</span>
                      <div>
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTemplateSelect(template.id);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTemplateSelect(template.id);
                        }}
                      >
                        Selecionar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Preview do Currículo</h2>
            
            <Card className="p-6">
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 min-h-[600px]">
                
                {/* Header do Currículo */}
                <div className="text-center mb-6 pb-4 border-b">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {curriculumData?.personalInfo?.name || 'Seu Nome'}
                  </h1>
                  <div className="text-sm text-gray-600 mt-2 space-y-1">
                    <p>{curriculumData?.personalInfo?.email || 'seu@email.com'}</p>
                    <p>{curriculumData?.personalInfo?.phone || '(11) 99999-9999'}</p>
                    {curriculumData?.personalInfo?.address && (
                      <p>{curriculumData.personalInfo.address}</p>
                    )}
                  </div>
                </div>

                {/* Objetivo */}
                {curriculumData?.extras?.objective?.description && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b pb-1">
                      Objetivo Profissional
                    </h2>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {curriculumData.extras.objective.description}
                    </p>
                  </div>
                )}

                {/* Placeholder para outras seções */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b pb-1">
                      Experiência Profissional
                    </h2>
                    <p className="text-sm text-gray-500">
                      (Será preenchido conforme você adicionar experiências)
                    </p>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b pb-1">
                      Formação Acadêmica
                    </h2>
                    <p className="text-sm text-gray-500">
                      (Será preenchido conforme você adicionar formações)
                    </p>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b pb-1">
                      Habilidades
                    </h2>
                    <p className="text-sm text-gray-500">
                      {curriculumData?.extras?.objective?.keywords || '(Será preenchido conforme você adicionar habilidades)'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-4">
                <Button 
                  onClick={handleDownload}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar PDF
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm">
          <h3 className="font-semibold mb-2">Status dos Dados:</h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <strong>Nome:</strong> {curriculumData?.personalInfo?.name || 'Não preenchido'}
            </div>
            <div>
              <strong>Email:</strong> {curriculumData?.personalInfo?.email || 'Não preenchido'}
            </div>
            <div>
              <strong>Telefone:</strong> {curriculumData?.personalInfo?.phone || 'Não preenchido'}
            </div>
            <div>
              <strong>Objetivo:</strong> {curriculumData?.extras?.objective?.description ? 'Preenchido' : 'Não preenchido'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SimpleTemplateSelector() {
  return (
    <SimpleProvider>
      <SimpleTemplateSelectorContent />
    </SimpleProvider>
  );
} 
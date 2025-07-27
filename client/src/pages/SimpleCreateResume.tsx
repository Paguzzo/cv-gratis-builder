import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { SimpleProvider, useSimpleContext } from '@/contexts/SimpleContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

function SimpleCreateResumeContent() {
  const [, setLocation] = useLocation();
  const { curriculumData, updateCurriculumData, hasValidData } = useSimpleContext();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 'personal', title: 'Dados Pessoais', icon: '👤' },
    { id: 'objective', title: 'Objetivo', icon: '🎯' },
    { id: 'experience', title: 'Experiência', icon: '💼' },
    { id: 'education', title: 'Educação', icon: '🎓' },
    { id: 'skills', title: 'Habilidades', icon: '⚡' }
  ];

  const handlePersonalInfoChange = (field: string, value: string) => {
    updateCurriculumData({
      personalInfo: {
        ...curriculumData?.personalInfo,
        [field]: value
      }
    });
  };

  const handleObjectiveChange = (field: string, value: string) => {
    updateCurriculumData({
      extras: {
        ...curriculumData?.extras,
        objective: {
          ...curriculumData?.extras?.objective,
          [field]: value
        }
      }
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finalizar
      console.log('🎯 Finalizando e navegando para templates...');
      setLocation('/templates');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Dados Pessoais
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome Completo *</label>
              <Input
                value={curriculumData?.personalInfo?.name || ''}
                onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                placeholder="Seu nome completo"
                className="w-full"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <Input
                  type="email"
                  value={curriculumData?.personalInfo?.email || ''}
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Telefone *</label>
                <Input
                  value={curriculumData?.personalInfo?.phone || ''}
                  onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Endereço</label>
              <Input
                value={curriculumData?.personalInfo?.address || ''}
                onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                placeholder="Cidade, Estado"
              />
            </div>
          </div>
        );

      case 1: // Objetivo
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Palavras-chave da sua área</label>
              <Input
                value={curriculumData?.extras?.objective?.keywords || ''}
                onChange={(e) => handleObjectiveChange('keywords', e.target.value)}
                placeholder="Ex: liderança, gestão, desenvolvimento, 5 anos experiência"
              />
              <p className="text-sm text-gray-500 mt-1">
                Separe as palavras-chave por vírgula
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Objetivo Profissional</label>
              <Textarea
                value={curriculumData?.extras?.objective?.description || ''}
                onChange={(e) => handleObjectiveChange('description', e.target.value)}
                placeholder="Descreva seu objetivo profissional ou deixe em branco para gerar com IA..."
                rows={4}
              />
            </div>
          </div>
        );

      case 2: // Experiência (simplificado)
        return (
          <div className="space-y-4">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Experiência Profissional
              </h3>
              <p className="text-gray-600 mb-4">
                Por simplicidade, vamos para os templates. Você pode adicionar experiências lá.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  ✅ Dados básicos salvos! Você pode continuar nos templates.
                </p>
              </div>
            </div>
          </div>
        );

      case 3: // Educação (simplificado)
        return (
          <div className="space-y-4">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Educação
              </h3>
              <p className="text-gray-600 mb-4">
                Você pode adicionar sua formação nos templates.
              </p>
            </div>
          </div>
        );

      case 4: // Habilidades (simplificado)
        return (
          <div className="space-y-4">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Habilidades
              </h3>
              <p className="text-gray-600 mb-4">
                Você pode adicionar suas habilidades nos templates.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  🎯 Pronto! Vamos escolher um template para seu currículo.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    if (currentStep === 0) {
      return !!(curriculumData?.personalInfo?.name && curriculumData?.personalInfo?.email);
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => setLocation('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Início
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Criar Currículo - Versão Simples
          </h1>
          <p className="text-gray-600">
            Preencha as informações básicas para começar
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={`flex items-center ${
                  index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                <span className="ml-2 text-sm hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{steps[currentStep].icon}</span>
              {steps[currentStep].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {currentStep === steps.length - 1 ? 'Escolher Template' : 'Próximo'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Debug Info */}
        {hasValidData() && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">
              ✅ Dados válidos encontrados: {curriculumData?.personalInfo?.name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SimpleCreateResume() {
  return (
    <SimpleProvider>
      <SimpleCreateResumeContent />
    </SimpleProvider>
  );
} 
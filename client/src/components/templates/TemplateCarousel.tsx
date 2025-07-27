import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Crown, Check } from 'lucide-react';
import { Template } from '@/types/templates';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TemplateRenderer } from './TemplateRenderer';
import { useNavigate } from 'react-router-dom';

interface TemplateCarouselProps {
  templates: Template[];
  selectedTemplateId: string;
  onTemplateSelect: (templateId: string) => void;
  onDownload?: (templateId: string) => void;
  isExporting?: boolean;
  hasData?: boolean;
}

export function TemplateCarousel({
  templates,
  selectedTemplateId,
  onTemplateSelect,
  onDownload,
  isExporting = false,
  hasData = false
}: TemplateCarouselProps) {
  const navigate = useNavigate();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    containScroll: 'trimSnaps',
    dragFree: true,
    loop: false
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const handleTemplateClick = (templateId: string) => {
    onTemplateSelect(templateId);
    // Auto-scroll para o template selecionado
    const index = templates.findIndex(t => t.id === templateId);
    if (emblaApi && index !== -1) {
      emblaApi.scrollTo(index);
    }
  };

  const handleDownloadClick = (e: React.MouseEvent, templateId: string) => {
    console.log('🎯 CLIQUE DEFINITIVO - PREMIUM');
    console.log('🎯 Template ID:', templateId);
    
    e.preventDefault();
    e.stopPropagation();
    
    const template = templates.find(t => t.id === templateId);
    console.log('🎯 Template:', template?.name);
    console.log('🎯 Premium?:', template?.isPremium);
    
    if (template?.isPremium) {
      console.log('🎯 PREMIUM DETECTADO - REDIRECIONAMENTO DEFINITIVO');
      
      // SOLUÇÃO DEFINITIVA: REDIRECIONAMENTO GARANTIDO
      const targetUrl = `/premium-editor?template=${templateId}`;
      console.log('🎯 REDIRECIONANDO PARA:', targetUrl);
      
      // MÉTODO DEFINITIVO: FORÇAR NAVEGAÇÃO
      try {
        // Método 1: Imediato
        window.location.href = targetUrl;
        console.log('🎯 MÉTODO 1 EXECUTADO: href');
        
        // Método 2: Backup imediato
        setTimeout(() => {
          window.location.replace(targetUrl);
          console.log('🎯 MÉTODO 2 EXECUTADO: replace');
        }, 50);
        
        // Método 3: Último recurso
        setTimeout(() => {
          window.open(targetUrl, '_self');
          console.log('🎯 MÉTODO 3 EXECUTADO: open');
        }, 150);
        
      } catch (error) {
        console.error('🎯 ERRO NO REDIRECIONAMENTO:', error);
        // Forçar navegação mesmo com erro
        window.location.href = targetUrl;
      }
      
      return false;
    }
    
    // Se for gratuito, usar função normal
    if (onDownload) {
      onDownload(templateId);
    }
  };

  return (
    <div className="relative">
      {/* Header do Carrossel */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Galeria de Templates Profissionais
          </h2>
          <p className="text-gray-600">
            {templates.filter(t => !t.isPremium).length} gratuitos • {templates.filter(t => t.isPremium).length} premium
          </p>
        </div>
        
        {/* Navegação - DESTACADA */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="h-12 w-12 p-0 border-2 border-blue-300 hover:border-blue-500 hover:bg-blue-50 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-30"
          >
            <ChevronLeft className="h-6 w-6 text-blue-600" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="h-12 w-12 p-0 border-2 border-blue-300 hover:border-blue-500 hover:bg-blue-50 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-30"
          >
            <ChevronRight className="h-6 w-6 text-blue-600" />
          </Button>
        </div>
      </div>

      {/* Carrossel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {templates.map((template) => (
            <div key={template.id} className="flex-[0_0_400px] min-w-0">
              <Card 
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedTemplateId === template.id 
                    ? template.isPremium
                      ? 'ring-4 ring-yellow-400/50 border-yellow-400 shadow-xl shadow-yellow-100' 
                      : 'ring-4 ring-blue-400/50 border-blue-400 shadow-xl shadow-blue-100'
                    : template.isPremium
                      ? 'border-yellow-200 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-50'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50'
                } ${template.isPremium ? 'bg-gradient-to-br from-yellow-50/50 to-orange-50/50' : 'bg-white'}`}
                onClick={() => handleTemplateClick(template.id)}
              >
                {/* Header do Card */}
                <div className={`p-4 border-b ${template.isPremium ? 'bg-gradient-to-r from-yellow-100 to-orange-100' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      {template.name}
                      {template.isPremium && <Crown className="w-4 h-4 text-yellow-600" />}
                    </h3>
                    {selectedTemplateId === template.id && (
                      <div className={`rounded-full p-1 ${template.isPremium ? 'bg-yellow-500' : 'bg-blue-500'}`}>
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <p className={`text-sm ${template.isPremium ? 'text-yellow-800' : 'text-gray-600'}`}>
                    {template.description}
                  </p>
                  
                  {template.isPremium && (
                    <div className="flex items-center justify-between mt-3">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white border-0">
                        R$ {template.price?.toFixed(2)}
                      </Badge>
                      <span className="text-xs text-yellow-700 font-medium">Premium</span>
                    </div>
                  )}
                </div>

                {/* Preview do Template */}
                <CardContent className="p-4">
                  <div className={`aspect-[3/4] rounded-xl border-2 mb-4 overflow-hidden relative group ${
                    template.isPremium ? 'border-yellow-200' : 'border-gray-200'
                  }`}>
                    {/* Overlay Premium */}
                    {template.isPremium && (
                      <div className="absolute top-3 right-3 z-10">
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white border-0 shadow-lg">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      </div>
                    )}

                    {/* Overlay de Hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Badge variant="secondary" className="bg-white/90 text-gray-800">
                          {selectedTemplateId === template.id ? 'Selecionado' : 'Clique para selecionar'}
                        </Badge>
                      </div>
                    </div>

                    {/* Miniatura do Template */}
                    <div className="transform scale-90 origin-top-left w-[111%] h-[111%]">
                      <TemplateRenderer template={template} />
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {template.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <Check className={`w-3 h-3 mr-2 flex-shrink-0 ${
                          template.isPremium ? 'text-yellow-500' : 'text-green-500'
                        }`} />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Botão de Download */}
                  {hasData && onDownload && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => handleDownloadClick(e, template.id)}
                      disabled={isExporting}
                      className={`w-full ${
                        template.isPremium 
                          ? 'border-yellow-300 text-yellow-700 hover:bg-yellow-50' 
                          : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                      }`}
                    >
                      {template.isPremium ? (
                        <>
                          <Crown className="w-3 h-3 mr-2" />
                          Comprar Premium
                        </>
                      ) : (
                        <>
                          <Check className="w-3 h-3 mr-2" />
                          Baixar Gratuito
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Indicadores de posição */}
      <div className="flex justify-center gap-2 mt-6">
        {templates.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex 
                ? 'bg-blue-500 w-6' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
} 
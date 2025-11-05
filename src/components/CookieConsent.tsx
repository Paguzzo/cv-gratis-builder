import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Settings, Cookie } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    functional: false,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cv-gratis-cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cv-gratis-cookie-consent', JSON.stringify(allAccepted));
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptSelected = () => {
    const selected = {
      ...preferences,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cv-gratis-cookie-consent', JSON.stringify(selected));
    setShowBanner(false);
    setShowSettings(false);
  };

  const rejectOptional = () => {
    const essential = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cv-gratis-cookie-consent', JSON.stringify(essential));
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg">
        <Card className="max-w-6xl mx-auto">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Cookie className="w-5 h-5 text-amber-600" />
                  <h3 className="font-semibold text-gray-900">
                    Cookies e Privacidade
                  </h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Utilizamos cookies para melhorar sua experiência, analisar nosso tráfego e personalizar conteúdo. 
                  Você pode gerenciar suas preferências ou aceitar todos os cookies. 
                  <a href="/politica-cookies" className="text-blue-600 hover:underline ml-1">
                    Saiba mais sobre nossa Política de Cookies
                  </a>
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={acceptAll} className="bg-blue-600 hover:bg-blue-700">
                    ✅ Aceitar Todos
                  </Button>
                  <Button onClick={rejectOptional} variant="outline">
                    ❌ Apenas Essenciais
                  </Button>
                  <Dialog open={showSettings} onOpenChange={setShowSettings}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        Configurar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Configurações de Cookies</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        {/* Essential Cookies */}
                        <div className="flex items-start justify-between p-4 bg-blue-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">Cookies Essenciais</h4>
                            <p className="text-sm text-gray-600">
                              Necessários para funcionamento básico do site. Não podem ser desabilitados.
                            </p>
                          </div>
                          <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium">
                            Obrigatório
                          </div>
                        </div>

                        {/* Functional Cookies */}
                        <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">Cookies de Funcionalidade</h4>
                            <p className="text-sm text-gray-600 mb-2">
                              Melhoram a experiência lembrando suas preferências de formatação e configurações.
                            </p>
                          </div>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={preferences.functional}
                              onChange={(e) => setPreferences(prev => ({ ...prev, functional: e.target.checked }))}
                              className="sr-only"
                            />
                            <div className={`w-12 h-6 rounded-full ${preferences.functional ? 'bg-green-500' : 'bg-gray-300'} relative transition-colors`}>
                              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${preferences.functional ? 'translate-x-6' : 'translate-x-0.5'}`} />
                            </div>
                          </label>
                        </div>

                        {/* Analytics Cookies */}
                        <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">Cookies de Análise</h4>
                            <p className="text-sm text-gray-600 mb-2">
                              Ajudam-nos a entender como você usa o site para melhorarmos nossos serviços.
                            </p>
                          </div>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={preferences.analytics}
                              onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                              className="sr-only"
                            />
                            <div className={`w-12 h-6 rounded-full ${preferences.analytics ? 'bg-green-500' : 'bg-gray-300'} relative transition-colors`}>
                              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${preferences.analytics ? 'translate-x-6' : 'translate-x-0.5'}`} />
                            </div>
                          </label>
                        </div>

                        {/* Marketing Cookies */}
                        <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">Cookies de Marketing</h4>
                            <p className="text-sm text-gray-600 mb-2">
                              Usados para personalizar anúncios e medir a eficácia de campanhas publicitárias.
                            </p>
                          </div>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={preferences.marketing}
                              onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                              className="sr-only"
                            />
                            <div className={`w-12 h-6 rounded-full ${preferences.marketing ? 'bg-green-500' : 'bg-gray-300'} relative transition-colors`}>
                              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${preferences.marketing ? 'translate-x-6' : 'translate-x-0.5'}`} />
                            </div>
                          </label>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button onClick={acceptSelected} className="flex-1">
                            Salvar Preferências
                          </Button>
                          <Button onClick={acceptAll} variant="outline">
                            Aceitar Todos
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBanner(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 
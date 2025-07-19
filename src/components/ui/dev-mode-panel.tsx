import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StripeService } from "@/services/stripeService";
import { Badge } from "@/components/ui/badge";
import { Crown, Settings, ToggleLeft, ToggleRight, TestTube } from "lucide-react";

export function DevModePanel() {
  const [isPremiumEnabled, setIsPremiumEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Só mostrar em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
      
      // FORÇAR ativação automática do premium
      StripeService.enableDevPremium();
      setIsPremiumEnabled(true);
      console.log('🔧 DEV MODE: Premium FORÇADO automaticamente');
    }
  }, []);

  const togglePremiumAccess = () => {
    if (isPremiumEnabled) {
      StripeService.disableDevPremium();
      setIsPremiumEnabled(false);
      console.log('🔧 DEV MODE: Premium desabilitado');
    } else {
      StripeService.enableDevPremium();
      setIsPremiumEnabled(true);
      console.log('🔧 DEV MODE: Premium habilitado');
    }
    
    // Navegar para templates e recarregar
    navigate('/templates');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const testPremiumPage = () => {
    // Garantir que o modo dev está ativo
    StripeService.enableDevPremium();
    
    // Navegar para uma página premium de teste
    const testUrl = '/premium-editor?template=premium-executive';
    console.log('🔧 DEV: Testando página premium:', testUrl);
    navigate(testUrl);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 bg-gray-900 text-white border-orange-500">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Settings className="w-4 h-4" />
            🔧 Modo Desenvolvedor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-yellow-500" />
              <span className="text-sm">Acesso Premium</span>
            </div>
            <Button
              variant={isPremiumEnabled ? "default" : "outline"}
              size="sm"
              onClick={togglePremiumAccess}
              className="h-8"
            >
              {isPremiumEnabled ? (
                <>
                  <ToggleRight className="w-4 h-4 mr-1" />
                  ON
                </>
              ) : (
                <>
                  <ToggleLeft className="w-4 h-4 mr-1" />
                  OFF
                </>
              )}
            </Button>
          </div>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={testPremiumPage}
            className="w-full h-8"
          >
            <TestTube className="w-4 h-4 mr-1" />
            Testar Página Premium
          </Button>
          
          <div className="text-xs text-gray-300 space-y-1">
            <div>• Status: {isPremiumEnabled ? '✅ Premium Ativo' : '❌ Premium Inativo'}</div>
            <div>• Email: 🔧 Modo simulado</div>
            <div>• Pagamento: 🔧 Bypass ativo</div>
          </div>

          {isPremiumEnabled && (
            <Badge variant="secondary" className="w-full justify-center bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
              Todos os templates premium desbloqueados
            </Badge>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
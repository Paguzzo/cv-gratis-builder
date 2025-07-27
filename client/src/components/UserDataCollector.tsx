import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Gift, Download, Printer, Mail, CheckCircle, Phone, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { userDataService } from '@/services/userDataService';

interface UserData {
  name: string;
  email: string;
  whatsapp: string;
}

interface UserDataCollectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: UserData) => void;
  actionType: 'download' | 'print' | 'email';
  templateType: 'free' | 'premium';
}

export default function UserDataCollector({ 
  isOpen, 
  onClose, 
  onSubmit, 
  actionType,
  templateType 
}: UserDataCollectorProps) {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    whatsapp: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Se for premium, não mostra o modal
  if (templateType === 'premium') {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData.name.trim() || !userData.email.trim() || !userData.whatsapp.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos para continuar.",
        variant: "destructive"
      });
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      return;
    }

    // Validação básica de WhatsApp (apenas números)
    const whatsappClean = userData.whatsapp.replace(/\D/g, '');
    if (whatsappClean.length < 10) {
      toast({
        title: "WhatsApp inválido",
        description: "Por favor, insira um número de WhatsApp válido.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Salvar dados no userDataService
      await userDataService.saveUser(userData, actionType);
      
      // Marcar que usuário já forneceu dados para não pedir novamente
      localStorage.setItem('cvgratis-user-data-collected', 'true');
      localStorage.setItem('cvgratis-user-data', JSON.stringify(userData));
      
      toast({
        title: "Dados salvos!",
        description: "Obrigado! Seus dados foram salvos com segurança.",
      });

      onSubmit(userData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getActionIcon = () => {
    switch (actionType) {
      case 'download': return <Download className="w-5 h-5" />;
      case 'print': return <Printer className="w-5 h-5" />;
      case 'email': return <Mail className="w-5 h-5" />;
      default: return <Gift className="w-5 h-5" />;
    }
  };

  const getActionText = () => {
    switch (actionType) {
      case 'download': return 'baixar seu currículo';
      case 'print': return 'imprimir seu currículo';
      case 'email': return 'enviar por email';
      default: return 'continuar';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Gift className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">Currículo 100% Grátis!</DialogTitle>
              <DialogDescription>
                Apenas seus dados para continuar
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Garantias da CVGratis:</span>
          </div>
          <ul className="text-sm text-green-700 mt-2 space-y-1">
            <li>✅ Seus dados ficam seguros conosco</li>
            <li>✅ Não enviamos spam</li>
            <li>✅ Você pode se descadastrar quando quiser</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Nome completo *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome completo"
              value={userData.name}
              onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              E-mail *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={userData.email}
              onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              WhatsApp *
            </Label>
            <Input
              id="whatsapp"
              type="tel"
              placeholder="(31) 99999-9999"
              value={userData.whatsapp}
              onChange={(e) => {
                // Formatação automática do WhatsApp
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 11) {
                  value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                  value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                  setUserData(prev => ({ ...prev, whatsapp: value }));
                }
              }}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Salvando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {getActionIcon()}
                  {getActionText()}
                </div>
              )}
            </Button>
          </div>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          Ao continuar, você concorda com nossa{' '}
          <a href="/politica-privacidade" className="text-blue-600 hover:underline">
            Política de Privacidade
          </a>
        </p>
      </DialogContent>
    </Dialog>
  );
} 
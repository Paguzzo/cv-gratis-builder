import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift, Mail, CheckCircle, X, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendEbookToLead, isEbookConfigured } from "@/services/ebookService";

interface BonusPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BonusPopup: React.FC<BonusPopupProps> = ({ open, onOpenChange }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !name) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha seu nome e email.",
        variant: "destructive"
      });
      return;
    }

    // Verificar se ebook está configurado
    if (!isEbookConfigured()) {
      toast({
        title: "⚠️ Ebook não disponível",
        description: "O ebook ainda não foi configurado. Tente novamente mais tarde.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('📧 Iniciando envio do ebook para:', email);

      // Enviar ebook via serviço
      const result = await sendEbookToLead(name, email);

      if (result.success) {
        // Marcar que o usuário se cadastrou
        localStorage.setItem('user-signed-up-bonus', 'true');

        // Salvar dados do usuário no formato correto para o admin ver
        const userData = {
          email,
          name,
          timestamp: new Date().toISOString()
        };
        const userKey = `bonus-user-${Date.now()}`;
        localStorage.setItem(userKey, JSON.stringify(userData));

        toast({
          title: "✅ Bônus garantido! 🎉",
          description: `Enviamos o Guia Secreto de Entrevistas para ${email}. Verifique sua caixa de entrada!`,
          duration: 6000
        });

        console.log('✅ Ebook enviado com sucesso!');

        onOpenChange(false);
        setEmail('');
        setName('');
      } else {
        // Erro no envio
        console.error('❌ Erro ao enviar ebook:', result.message);

        toast({
          title: "❌ Erro ao enviar ebook",
          description: result.message || "Tente novamente mais tarde.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Erro ao processar envio:', error);

      toast({
        title: "❌ Erro ao processar",
        description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] max-h-[90vh] overflow-hidden bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 p-0">
        <div className="overflow-y-auto max-h-[90vh] p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
            🎁 BÔNUS EXCLUSIVO GRÁTIS!
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Receba o <strong>Guia Secreto de Entrevistas</strong> (valor R$ 97) GRÁTIS no seu email!
          </DialogDescription>
        </DialogHeader>

        <div className="bg-white p-3 sm:p-4 rounded-lg border-2 border-yellow-200 my-3">
          <h3 className="font-bold text-base mb-2 text-gray-800">
            O que você vai receber:
          </h3>
          <ul className="space-y-1.5">
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>✨ 50+ Perguntas e Respostas de Entrevista</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>🎯 Técnicas de Persuasão para Impressionar</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>💼 Checklist Completo do Candidato Perfeito</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>🚀 Bônus: Template de Follow-up Pós-Entrevista</span>
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid gap-1.5">
            <Label htmlFor="bonus-name" className="text-sm">Seu Nome *</Label>
            <Input
              id="bonus-name"
              placeholder="Digite seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-10"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="bonus-email" className="text-sm">Seu Melhor Email *</Label>
            <Input
              id="bonus-email"
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10"
            />
          </div>

          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-2.5 text-xs sm:text-sm text-yellow-800">
            ⏰ <strong>ATENÇÃO:</strong> Esta oferta é por tempo limitado!
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-base sm:text-lg py-5 sm:py-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-pulse" />
                Enviando seu bônus...
              </>
            ) : (
              <>
                <Gift className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                QUERO MEU BÔNUS GRÁTIS AGORA!
              </>
            )}
          </Button>

          <p className="text-xs text-center text-gray-500">
            Seus dados estão seguros. Não compartilhamos com terceiros.
          </p>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BonusPopup;

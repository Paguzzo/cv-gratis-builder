import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift, Mail, CheckCircle, X, AlertTriangle, Loader2 } from "lucide-react";
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
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !name) {
      toast({
        title: "❌ Campos obrigatórios",
        description: "Por favor, preencha seu nome e email.",
        variant: "destructive",
        duration: 4000
      });
      return;
    }

    // Verificar se ebook está configurado
    if (!isEbookConfigured()) {
      toast({
        title: "⚠️ Ebook não disponível",
        description: "O ebook ainda não foi configurado. Tente novamente mais tarde.",
        variant: "destructive",
        duration: 5000
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError('');

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

        setSubmitSuccess(true);
        console.log('✅ Ebook enviado com sucesso!');

        // Aguardar 4 segundos antes de fechar para o usuário ver o feedback
        setTimeout(() => {
          onOpenChange(false);
          setEmail('');
          setName('');
          setSubmitSuccess(false);
        }, 4000);
      } else {
        // Erro no envio
        console.error('❌ Erro ao enviar ebook:', result.message);
        setSubmitError(result.message || "Não foi possível enviar o ebook. Tente novamente.");
      }
    } catch (error) {
      console.error('❌ Erro ao processar envio:', error);
      setSubmitError("Erro ao processar. Por favor, tente novamente ou entre em contato conosco.");
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

          {/* Alerta de Sucesso */}
          {submitSuccess && (
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-green-800 text-base mb-1">
                    ✅ Bônus Garantido! 🎉
                  </h4>
                  <p className="text-sm text-green-700">
                    Enviamos o <strong>Guia Secreto de Entrevistas</strong> para <strong>{email}</strong>
                  </p>
                  <p className="text-xs text-green-600 mt-2">
                    📬 Verifique sua caixa de entrada (e também a pasta de spam)!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Alerta de Erro */}
          {submitError && !submitSuccess && (
            <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-800 text-base mb-1">
                    ❌ Erro no Envio
                  </h4>
                  <p className="text-sm text-red-700">{submitError}</p>
                  <button
                    onClick={() => setSubmitError('')}
                    className="text-xs text-red-600 underline mt-2 hover:text-red-800"
                  >
                    Tentar novamente
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-2.5 text-xs sm:text-sm text-yellow-800">
            ⏰ <strong>ATENÇÃO:</strong> Esta oferta é por tempo limitado!
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-base sm:text-lg font-bold py-6 h-auto"
            disabled={isSubmitting || submitSuccess}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Enviando...
              </span>
            ) : submitSuccess ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Enviado com Sucesso!
              </span>
            ) : (
              <span>QUERO MEU BÔNUS GRÁTIS!</span>
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

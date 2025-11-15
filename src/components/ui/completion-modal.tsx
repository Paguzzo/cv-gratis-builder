import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertTriangle, Sparkles } from 'lucide-react';

interface CompletionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  completedActions: string[];
  pendingActions: string[];
  isComplete: boolean;
  onConfirmClean: () => void;
  onReview: () => void;
  onContinue?: () => void;
}

export function CompletionModal({
  open,
  onOpenChange,
  completedActions,
  pendingActions,
  isComplete,
  onConfirmClean,
  onReview,
  onContinue
}: CompletionModalProps) {

  // Modal de conclusão completa
  if (isComplete) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <DialogTitle className="text-2xl">Currículo Completo!</DialogTitle>
            </div>
            <DialogDescription className="text-base">
              Parabéns! Você completou todas as etapas necessárias.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Lista de ações completadas */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Ações Completadas
              </h4>
              <ul className="space-y-2">
                {completedActions.map((action, index) => (
                  <li key={index} className="flex items-center gap-2 text-green-800">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Aviso de limpeza */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Por segurança e privacidade</p>
                  <p>Seus dados serão automaticamente limpos do navegador. Certifique-se de que salvou todos os arquivos necessários!</p>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={onReview}
                className="flex-1"
              >
                Revisar Novamente
              </Button>
              <Button
                onClick={onConfirmClean}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Concluir e Limpar Dados
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Modal de ações pendentes (quando tenta sair)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-2xl">Atenção!</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Você ainda não completou todas as ações necessárias.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Ações completadas */}
          {completedActions.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Completado
              </h4>
              <ul className="space-y-2">
                {completedActions.map((action, index) => (
                  <li key={index} className="flex items-center gap-2 text-green-800 text-sm">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Ações pendentes */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Ainda faltam
            </h4>
            <ul className="space-y-2">
              {pendingActions.map((action, index) => (
                <li key={index} className="flex items-center gap-2 text-orange-800 text-sm">
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Aviso */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-900">
                <p className="font-semibold mb-1">Se sair agora</p>
                <p>Seus dados serão perdidos e você precisará recomeçar do zero!</p>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
            >
              Sair Mesmo
            </Button>
            <Button
              onClick={() => {
                onOpenChange(false);
                onContinue?.();
              }}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Voltar e Completar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

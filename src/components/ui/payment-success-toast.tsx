import React, { useEffect } from 'react';
import { CheckCircle, Crown, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentSuccessToastProps {
  templateName?: string;
  show?: boolean;
}

export const PaymentSuccessToast: React.FC<PaymentSuccessToastProps> = ({
  templateName = 'Premium',
  show = false
}) => {
  useEffect(() => {
    if (show) {
      toast.success(
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <div className="font-bold text-lg mb-1">
              Pagamento Confirmado!
            </div>
            <div className="text-sm text-gray-600">
              Template <span className="font-semibold text-yellow-600">
                <Crown className="w-3 h-3 inline mr-1" />
                {templateName}
              </span> desbloqueado com sucesso!
            </div>
          </div>
        </div>,
        {
          duration: 5000,
          position: 'top-center',
          className: 'payment-success-toast',
        }
      );
    }
  }, [show, templateName]);

  return null;
};

export const showPaymentSuccessToast = (templateName: string) => {
  toast.success(
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 relative">
        <CheckCircle className="w-8 h-8 text-green-600" />
        <Sparkles className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
      </div>
      <div>
        <div className="font-bold text-lg mb-1 flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-600" />
          Pagamento Confirmado!
        </div>
        <div className="text-sm text-gray-600">
          Template <span className="font-semibold text-yellow-600">{templateName}</span> desbloqueado!
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Você pode baixar quantas vezes quiser
        </div>
      </div>
    </div>,
    {
      duration: 6000,
      position: 'top-center',
      className: 'payment-success-toast shadow-2xl',
      style: {
        background: 'linear-gradient(to right, #f0fdf4, #fef3c7)',
        border: '2px solid #22c55e',
        borderRadius: '12px',
        padding: '16px',
      }
    }
  );
};

export const showPaymentErrorToast = (errorMessage?: string) => {
  toast.error(
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0">
        <X className="w-6 h-6 text-red-600" />
      </div>
      <div>
        <div className="font-bold text-lg mb-1">
          Erro no Pagamento
        </div>
        <div className="text-sm text-gray-600">
          {errorMessage || 'Não foi possível processar o pagamento. Tente novamente.'}
        </div>
      </div>
    </div>,
    {
      duration: 5000,
      position: 'top-center',
    }
  );
};

// Ícone de erro
const X: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

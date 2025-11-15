import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { FeedbackDialog } from './FeedbackDialog';

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Botão Flutuante com Label */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {/* Label que aparece ao passar o mouse */}
        <div
          className={`
            bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg
            transition-all duration-300 ease-in-out whitespace-nowrap
            ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}
          `}
        >
          <span className="text-sm font-medium">💬 Sugestões e Melhorias</span>
        </div>

        {/* Botão */}
        <button
          onClick={() => setOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="
            h-14 w-14 rounded-full shadow-lg hover:shadow-xl
            transition-all duration-300
            bg-gradient-to-br from-blue-500 to-blue-600
            hover:from-blue-600 hover:to-blue-700
            flex items-center justify-center
            group relative
            animate-pulse hover:animate-none
          "
          aria-label="Sugestões e Melhorias"
          title="Sugestões e Melhorias"
        >
          <MessageCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />

          {/* Badge de notificação (pulso) */}
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>
      </div>

      {/* Dialog de Feedback */}
      <FeedbackDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

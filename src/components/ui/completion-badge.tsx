import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Download, Printer, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompletionBadgeProps {
  downloadCompleted: boolean;
  printCompleted: boolean;
  isComplete: boolean;
  onClick?: () => void;
  className?: string;
}

export function CompletionBadge({
  downloadCompleted,
  printCompleted,
  isComplete,
  onClick,
  className
}: CompletionBadgeProps) {

  // Se tudo completo
  if (isComplete) {
    return (
      <div
        onClick={onClick}
        className={cn(
          "fixed top-32 lg:top-20 right-4 z-50 cursor-pointer",
          "animate-in fade-in slide-in-from-top-5 duration-500",
          className
        )}
      >
        <Badge
          variant="default"
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 shadow-lg hover:shadow-xl transition-shadow"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          <span className="font-semibold">Tudo Completo!</span>
        </Badge>
      </div>
    );
  }

  // Progresso parcial
  return (
    <div
      onClick={onClick}
      className={cn(
        "fixed top-32 lg:top-20 right-4 z-50 cursor-pointer",
        "animate-in fade-in slide-in-from-top-5 duration-500",
        className
      )}
    >
      <Badge
        variant="default"
        className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 shadow-lg hover:shadow-xl transition-shadow"
      >
        <AlertCircle className="w-4 h-4 mr-2 animate-pulse" />
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="flex items-center gap-1">
            {downloadCompleted ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <Download className="w-3.5 h-3.5 opacity-60" />
            )}
            <span className={downloadCompleted ? "opacity-100" : "opacity-60"}>
              PDF
            </span>
          </span>
          <span className="opacity-50">·</span>
          <span className="flex items-center gap-1">
            {printCompleted ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <Printer className="w-3.5 h-3.5 opacity-60" />
            )}
            <span className={printCompleted ? "opacity-100" : "opacity-60"}>
              Imprimir
            </span>
          </span>
        </div>
      </Badge>
    </div>
  );
}

// Versão expandida com tooltip
interface CompletionBadgeWithTooltipProps extends CompletionBadgeProps {
  showTooltip?: boolean;
}

export function CompletionBadgeWithTooltip({
  downloadCompleted,
  printCompleted,
  isComplete,
  onClick,
  className,
  showTooltip = true
}: CompletionBadgeWithTooltipProps) {

  if (!showTooltip) {
    return (
      <CompletionBadge
        downloadCompleted={downloadCompleted}
        printCompleted={printCompleted}
        isComplete={isComplete}
        onClick={onClick}
        className={className}
      />
    );
  }

  return (
    <div className="relative group">
      <CompletionBadge
        downloadCompleted={downloadCompleted}
        printCompleted={printCompleted}
        isComplete={isComplete}
        onClick={onClick}
        className={className}
      />

      {/* Tooltip */}
      <div className="fixed top-44 lg:top-32 right-4 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl max-w-[200px]">
          <p className="font-semibold mb-1">
            {isComplete ? 'Tudo pronto!' : 'Checklist de conclusão'}
          </p>
          <ul className="space-y-1">
            <li className="flex items-center gap-2">
              {downloadCompleted ? (
                <CheckCircle2 className="w-3 h-3 text-green-400" />
              ) : (
                <Download className="w-3 h-3 text-gray-400" />
              )}
              <span className={downloadCompleted ? "text-green-400" : "text-gray-400"}>
                Baixar PDF
              </span>
            </li>
            <li className="flex items-center gap-2">
              {printCompleted ? (
                <CheckCircle2 className="w-3 h-3 text-green-400" />
              ) : (
                <Printer className="w-3 h-3 text-gray-400" />
              )}
              <span className={printCompleted ? "text-green-400" : "text-gray-400"}>
                Imprimir
              </span>
            </li>
          </ul>
          {!isComplete && (
            <p className="text-gray-400 mt-2 text-[10px]">
              Complete ambos antes de sair
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

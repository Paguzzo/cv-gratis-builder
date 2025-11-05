import React, { useEffect, useState } from 'react';
import { useCurriculum } from '@/contexts/CurriculumContext';
import { AlertTriangle, X, Download, Upload, RotateCcw, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Componente que monitora e notifica sobre dados corrompidos
 * Oferece opções de recuperação e backup
 */
export function DataCorruptionAlert() {
  const {
    state,
    clearCorruptionWarning,
    restoreFromBackup,
    exportData,
    importData,
    resetCurriculum,
  } = useCurriculum();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importJson, setImportJson] = useState('');

  // Mostra notificação quando dados corrompidos são detectados
  useEffect(() => {
    if (state.dataCorrupted && state.recoveredFields.length > 0) {
      toast.warning('Dados parcialmente corrompidos detectados', {
        description: `${state.recoveredFields.length} campo(s) foram recuperados. Clique para ver detalhes.`,
        duration: 10000,
        action: {
          label: 'Ver Detalhes',
          onClick: () => setIsExpanded(true),
        },
      });
    }
  }, [state.dataCorrupted, state.recoveredFields.length]);

  // Se não há corrupção, não mostra nada
  if (!state.dataCorrupted) {
    return null;
  }

  const handleExportData = () => {
    try {
      const jsonData = exportData();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `curriculo-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Backup exportado com sucesso', {
        description: 'Seus dados foram salvos em um arquivo JSON',
      });
    } catch (error) {
      toast.error('Erro ao exportar dados', {
        description: 'Não foi possível criar o arquivo de backup',
      });
    }
  };

  const handleImportData = () => {
    try {
      if (!importJson.trim()) {
        toast.error('Nenhum dado para importar', {
          description: 'Cole o conteúdo do backup JSON',
        });
        return;
      }

      const success = importData(importJson);

      if (success) {
        toast.success('Dados importados com sucesso', {
          description: 'Seu currículo foi restaurado',
        });
        setShowImportDialog(false);
        setImportJson('');
        clearCorruptionWarning();
      } else {
        toast.error('Erro ao importar dados', {
          description: 'O arquivo de backup é inválido',
        });
      }
    } catch (error) {
      toast.error('Erro ao importar dados', {
        description: 'Formato de backup inválido',
      });
    }
  };

  const handleRestoreBackup = () => {
    try {
      const success = restoreFromBackup();

      if (success) {
        toast.success('Backup restaurado com sucesso', {
          description: 'Seus dados foram recuperados',
        });
        clearCorruptionWarning();
      } else {
        toast.error('Nenhum backup encontrado', {
          description: 'Não há backups disponíveis para restaurar',
        });
      }
    } catch (error) {
      toast.error('Erro ao restaurar backup', {
        description: 'Não foi possível restaurar os dados',
      });
    }
  };

  const handleResetData = () => {
    if (confirm('Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.')) {
      resetCurriculum();
      clearCorruptionWarning();
      toast.info('Dados resetados', {
        description: 'Seu currículo foi limpo e você pode começar do zero',
      });
    }
  };

  return (
    <>
      {/* Alerta de corrupção fixado no topo */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-50 border-b border-yellow-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-yellow-900">
                  Dados Parcialmente Corrompidos Detectados
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Alguns dados foram recuperados automaticamente, mas pode haver informações perdidas.
                </p>

                {/* Campos recuperados */}
                {isExpanded && state.recoveredFields.length > 0 && (
                  <div className="mt-3 p-3 bg-white rounded-md border border-yellow-200">
                    <p className="text-xs font-medium text-yellow-900 mb-2">
                      Campos recuperados:
                    </p>
                    <ul className="space-y-1">
                      {state.recoveredFields.map((field, index) => (
                        <li key={index} className="text-xs text-yellow-700 flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          {field}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Erros de validação */}
                {isExpanded && state.validationErrors.length > 0 && (
                  <div className="mt-3 p-3 bg-white rounded-md border border-yellow-200">
                    <p className="text-xs font-medium text-yellow-900 mb-2">
                      Erros detectados ({state.validationErrors.length}):
                    </p>
                    <ul className="space-y-1 max-h-32 overflow-y-auto">
                      {state.validationErrors.slice(0, 5).map((error, index) => (
                        <li key={index} className="text-xs text-red-600">
                          <span className="font-medium">{error.field}:</span> {error.message}
                        </li>
                      ))}
                      {state.validationErrors.length > 5 && (
                        <li className="text-xs text-yellow-600 italic">
                          +{state.validationErrors.length - 5} erros adicionais...
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Ações de recuperação */}
                {isExpanded && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={handleRestoreBackup}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Restaurar Backup Automático
                    </button>

                    <button
                      onClick={handleExportData}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Exportar Dados Atuais
                    </button>

                    <button
                      onClick={() => setShowImportDialog(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Importar Backup
                    </button>

                    <button
                      onClick={handleResetData}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      Resetar Dados
                    </button>

                    <button
                      onClick={clearCorruptionWarning}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Continuar com Dados Atuais
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-medium text-yellow-700 hover:text-yellow-900 transition-colors"
              >
                {isExpanded ? 'Recolher' : 'Expandir'}
              </button>
              <button
                onClick={clearCorruptionWarning}
                className="p-1 text-yellow-600 hover:text-yellow-800 transition-colors"
                aria-label="Fechar alerta"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Diálogo de importação */}
      {showImportDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Importar Backup</h2>
              <p className="text-sm text-gray-600 mt-1">
                Cole o conteúdo do arquivo de backup JSON abaixo
              </p>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              <textarea
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                className="w-full h-64 p-3 text-sm font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder='{"version": 1, "timestamp": "...", "data": {...}}'
              />
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowImportDialog(false);
                  setImportJson('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleImportData}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Importar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Espaçador para compensar o alerta fixo */}
      <div className="h-20" />
    </>
  );
}

import JSZip from 'jszip';
import { AdvancedExportService, ExportFormat, ExportQualityConfig, PageConfig, ExportResult } from './advancedExportService';

/**
 * Configuração para exportação em lote
 */
export interface BatchExportConfig {
  formats: ExportFormat[];
  qualityConfigs: Record<ExportFormat, ExportQualityConfig>;
  pageConfig: PageConfig;
  baseFileName: string;
  includeInZip: boolean;
}

/**
 * Progresso da exportação em lote
 */
export interface BatchExportProgress {
  currentFormat: ExportFormat;
  currentIndex: number;
  total: number;
  percentage: number;
  currentFile: string;
  completed: ExportFormat[];
  failed: ExportFormat[];
}

/**
 * Callback para progresso
 */
export type ProgressCallback = (progress: BatchExportProgress) => void;

/**
 * Resultado da exportação em lote
 */
export interface BatchExportResult {
  success: boolean;
  results: ExportResult[];
  zipBlob?: Blob;
  error?: string;
  totalFiles: number;
  successfulFiles: number;
  failedFiles: number;
}

/**
 * Serviço de exportação em lote
 * Permite exportar o currículo em múltiplos formatos simultaneamente
 */
export class BatchExportService {
  private static instance: BatchExportService;
  private exportService: AdvancedExportService;

  private constructor() {
    this.exportService = AdvancedExportService.getInstance();
  }

  public static getInstance(): BatchExportService {
    if (!BatchExportService.instance) {
      BatchExportService.instance = new BatchExportService();
    }
    return BatchExportService.instance;
  }

  /**
   * Exporta elemento em múltiplos formatos
   */
  public async exportInMultipleFormats(
    elementId: string,
    config: BatchExportConfig,
    onProgress?: ProgressCallback
  ): Promise<BatchExportResult> {
    const results: ExportResult[] = [];
    const completed: ExportFormat[] = [];
    const failed: ExportFormat[] = [];
    const total = config.formats.length;

    try {
      // Exportar cada formato
      for (let i = 0; i < config.formats.length; i++) {
        const format = config.formats[i];
        const qualityConfig = config.qualityConfigs[format];

        // Atualizar progresso
        if (onProgress) {
          onProgress({
            currentFormat: format,
            currentIndex: i,
            total,
            percentage: Math.round((i / total) * 100),
            currentFile: `${config.baseFileName}.${format}`,
            completed: [...completed],
            failed: [...failed]
          });
        }

        // Exportar formato
        const fileName = `${config.baseFileName}.${format}`;
        const result = await this.exportService.exportElement(
          elementId,
          fileName,
          qualityConfig,
          config.pageConfig
        );

        results.push(result);

        if (result.success) {
          completed.push(format);
        } else {
          failed.push(format);
        }
      }

      // Atualizar progresso final
      if (onProgress) {
        onProgress({
          currentFormat: config.formats[config.formats.length - 1],
          currentIndex: total,
          total,
          percentage: 100,
          currentFile: 'Concluído',
          completed,
          failed
        });
      }

      // Se solicitado, criar ZIP
      let zipBlob: Blob | undefined;
      if (config.includeInZip) {
        zipBlob = await this.createZipFromResults(results, config.baseFileName);
      }

      return {
        success: failed.length === 0,
        results,
        zipBlob,
        totalFiles: total,
        successfulFiles: completed.length,
        failedFiles: failed.length
      };

    } catch (error) {
      console.error('Erro na exportação em lote:', error);
      return {
        success: false,
        results,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        totalFiles: total,
        successfulFiles: completed.length,
        failedFiles: failed.length
      };
    }
  }

  /**
   * Cria arquivo ZIP com todos os resultados
   */
  private async createZipFromResults(
    results: ExportResult[],
    baseFileName: string
  ): Promise<Blob> {
    const zip = new JSZip();

    // Adicionar cada arquivo ao ZIP
    for (const result of results) {
      if (result.success && result.blob) {
        zip.file(result.fileName, result.blob);
      }
    }

    // Gerar ZIP
    return await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9 // Máxima compressão
      }
    });
  }

  /**
   * Exporta e faz download individual de cada formato
   */
  public async exportAndDownloadAll(
    elementId: string,
    config: BatchExportConfig,
    onProgress?: ProgressCallback
  ): Promise<BatchExportResult> {
    const result = await this.exportInMultipleFormats(elementId, config, onProgress);

    if (config.includeInZip && result.zipBlob) {
      // Download do ZIP
      this.exportService.downloadBlob(result.zipBlob, `${config.baseFileName}.zip`);
    } else {
      // Download individual de cada arquivo
      for (const exportResult of result.results) {
        if (exportResult.success && exportResult.blob) {
          this.exportService.downloadBlob(exportResult.blob, exportResult.fileName);
        }
      }
    }

    return result;
  }

  /**
   * Cria configuração padrão para exportação em lote
   */
  public createDefaultConfig(
    formats: ExportFormat[],
    baseFileName: string = 'curriculo'
  ): BatchExportConfig {
    const qualityConfigs: Record<ExportFormat, ExportQualityConfig> = {
      pdf: {
        format: 'pdf',
        quality: 95,
        resolution: 150,
        backgroundColor: '#ffffff'
      },
      docx: {
        format: 'docx',
        quality: 100,
        resolution: 150,
        backgroundColor: '#ffffff'
      },
      png: {
        format: 'png',
        quality: 100,
        resolution: 150,
        backgroundColor: '#ffffff',
        transparentBackground: false
      },
      jpg: {
        format: 'jpg',
        quality: 90,
        resolution: 150,
        backgroundColor: '#ffffff'
      }
    };

    return {
      formats,
      qualityConfigs,
      pageConfig: {
        size: 'A4',
        orientation: 'portrait',
        margins: {
          top: 8,
          right: 8,
          bottom: 8,
          left: 8
        }
      },
      baseFileName,
      includeInZip: formats.length > 1
    };
  }

  /**
   * Estima tempo total de exportação em lote
   */
  public estimateTotalTime(config: BatchExportConfig): number {
    let totalTime = 0;

    for (const format of config.formats) {
      const qualityConfig = config.qualityConfigs[format];
      totalTime += this.exportService.estimateExportTime(format, qualityConfig.resolution);
    }

    // Adicionar tempo para criar ZIP se necessário
    if (config.includeInZip) {
      totalTime += 1000; // 1 segundo para criar ZIP
    }

    return totalTime;
  }

  /**
   * Valida configuração de exportação em lote
   */
  public validateConfig(config: BatchExportConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.formats || config.formats.length === 0) {
      errors.push('Nenhum formato selecionado');
    }

    if (!config.baseFileName || config.baseFileName.trim() === '') {
      errors.push('Nome do arquivo não especificado');
    }

    for (const format of config.formats) {
      if (!config.qualityConfigs[format]) {
        errors.push(`Configuração de qualidade ausente para formato: ${format}`);
      }
    }

    if (config.pageConfig.size === 'CUSTOM') {
      if (!config.pageConfig.customWidth || !config.pageConfig.customHeight) {
        errors.push('Dimensões customizadas não especificadas');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Exporta em todos os formatos disponíveis
   */
  public async exportAllFormats(
    elementId: string,
    baseFileName: string = 'curriculo',
    onProgress?: ProgressCallback
  ): Promise<BatchExportResult> {
    const allFormats: ExportFormat[] = ['pdf', 'docx', 'png', 'jpg'];
    const config = this.createDefaultConfig(allFormats, baseFileName);

    return await this.exportAndDownloadAll(elementId, config, onProgress);
  }

  /**
   * Exporta apenas formatos de imagem
   */
  public async exportImageFormats(
    elementId: string,
    baseFileName: string = 'curriculo',
    onProgress?: ProgressCallback
  ): Promise<BatchExportResult> {
    const imageFormats: ExportFormat[] = ['png', 'jpg'];
    const config = this.createDefaultConfig(imageFormats, baseFileName);

    return await this.exportAndDownloadAll(elementId, config, onProgress);
  }

  /**
   * Exporta apenas formatos de documento
   */
  public async exportDocumentFormats(
    elementId: string,
    baseFileName: string = 'curriculo',
    onProgress?: ProgressCallback
  ): Promise<BatchExportResult> {
    const documentFormats: ExportFormat[] = ['pdf', 'docx'];
    const config = this.createDefaultConfig(documentFormats, baseFileName);

    return await this.exportAndDownloadAll(elementId, config, onProgress);
  }

  /**
   * Obtém tamanho estimado dos arquivos
   */
  public estimateFileSize(
    format: ExportFormat,
    resolution: 72 | 150 | 300
  ): { min: number; max: number; unit: string } {
    // Estimativas aproximadas em KB
    const estimates = {
      pdf: {
        72: { min: 100, max: 300 },
        150: { min: 200, max: 600 },
        300: { min: 500, max: 1500 }
      },
      docx: {
        72: { min: 50, max: 200 },
        150: { min: 100, max: 400 },
        300: { min: 200, max: 800 }
      },
      png: {
        72: { min: 150, max: 500 },
        150: { min: 300, max: 1000 },
        300: { min: 800, max: 2500 }
      },
      jpg: {
        72: { min: 50, max: 200 },
        150: { min: 100, max: 400 },
        300: { min: 250, max: 800 }
      }
    };

    return {
      ...estimates[format][resolution],
      unit: 'KB'
    };
  }
}

export default BatchExportService;

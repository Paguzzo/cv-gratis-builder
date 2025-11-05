import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { FileDown, FileText, Image, File, Settings2, Eye } from 'lucide-react';
import { AdvancedExportService, ExportFormat, ExportQualityConfig, PageConfig } from '@/services/advancedExportService';

interface ExportConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  elementId: string;
  defaultFileName?: string;
  onExport?: (result: any) => void;
}

export function ExportConfigDialog({
  open,
  onOpenChange,
  elementId,
  defaultFileName = 'curriculo',
  onExport
}: ExportConfigDialogProps) {
  const [format, setFormat] = useState<ExportFormat>('pdf');
  const [quality, setQuality] = useState(90);
  const [resolution, setResolution] = useState<72 | 150 | 300>(150);
  const [pageSize, setPageSize] = useState<'A4' | 'LETTER' | 'CUSTOM'>('A4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [transparentBg, setTransparentBg] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [margins, setMargins] = useState({ top: 8, right: 8, bottom: 8, left: 8 });
  const [customWidth, setCustomWidth] = useState(210);
  const [customHeight, setCustomHeight] = useState(297);
  const [fileName, setFileName] = useState(defaultFileName);
  const [isExporting, setIsExporting] = useState(false);

  const exportService = AdvancedExportService.getInstance();

  useEffect(() => {
    setFileName(defaultFileName);
  }, [defaultFileName]);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const qualityConfig: ExportQualityConfig = {
        format,
        quality,
        resolution,
        backgroundColor: format === 'png' && transparentBg ? undefined : backgroundColor,
        transparentBackground: format === 'png' ? transparentBg : false
      };

      const pageConfig: PageConfig = {
        size: pageSize,
        orientation,
        margins,
        customWidth: pageSize === 'CUSTOM' ? customWidth : undefined,
        customHeight: pageSize === 'CUSTOM' ? customHeight : undefined
      };

      const estimatedTime = exportService.estimateExportTime(format, resolution);

      toast.info('Iniciando exportação...', {
        description: `Tempo estimado: ${Math.round(estimatedTime / 1000)}s`
      });

      const result = await exportService.exportElement(
        elementId,
        fileName,
        qualityConfig,
        pageConfig
      );

      if (result.success && result.blob) {
        exportService.downloadBlob(result.blob, result.fileName);

        toast.success('Exportação concluída!', {
          description: `Arquivo ${result.fileName} gerado com sucesso`
        });

        if (onExport) {
          onExport(result);
        }

        onOpenChange(false);
      } else {
        toast.error('Erro na exportação', {
          description: result.error || 'Erro desconhecido'
        });
      }
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast.error('Erro ao exportar', {
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getFormatIcon = (fmt: ExportFormat) => {
    switch (fmt) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'docx':
        return <FileText className="h-4 w-4" />;
      case 'png':
        return <Image className="h-4 w-4" />;
      case 'jpg':
        return <Image className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getFormatDescription = (fmt: ExportFormat) => {
    switch (fmt) {
      case 'pdf':
        return 'Formato universal para impressão e compartilhamento';
      case 'docx':
        return 'Editável no Microsoft Word';
      case 'png':
        return 'Imagem de alta qualidade com suporte a transparência';
      case 'jpg':
        return 'Imagem comprimida, ideal para web';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Configurações de Exportação
          </DialogTitle>
          <DialogDescription>
            Configure as opções de exportação do seu currículo
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="format" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="format">Formato</TabsTrigger>
            <TabsTrigger value="quality">Qualidade</TabsTrigger>
            <TabsTrigger value="page">Página</TabsTrigger>
          </TabsList>

          {/* Aba de Formato */}
          <TabsContent value="format" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Formato de Exportação</CardTitle>
                <CardDescription>Escolha o formato do arquivo</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
                  <div className="grid grid-cols-2 gap-4">
                    {(['pdf', 'docx', 'png', 'jpg'] as ExportFormat[]).map((fmt) => (
                      <Label
                        key={fmt}
                        htmlFor={fmt}
                        className={`flex flex-col items-start space-y-2 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                          format === fmt ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center space-x-2 w-full">
                          <RadioGroupItem value={fmt} id={fmt} />
                          <div className="flex items-center gap-2">
                            {getFormatIcon(fmt)}
                            <span className="font-semibold uppercase">{fmt}</span>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {getFormatDescription(fmt)}
                        </span>
                      </Label>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nome do Arquivo</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="curriculo"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Arquivo final: {fileName}.{format}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Qualidade */}
          <TabsContent value="quality" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Resolução (DPI)</CardTitle>
                <CardDescription>
                  Maior resolução = melhor qualidade, mas arquivo maior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={resolution.toString()} onValueChange={(v) => setResolution(parseInt(v) as 72 | 150 | 300)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="72">72 DPI - Baixa (Web)</SelectItem>
                    <SelectItem value="150">150 DPI - Média (Padrão)</SelectItem>
                    <SelectItem value="300">300 DPI - Alta (Impressão)</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {(format === 'jpg' || format === 'png') && (
              <Card>
                <CardHeader>
                  <CardTitle>Qualidade</CardTitle>
                  <CardDescription>
                    Ajuste a qualidade da imagem ({quality}%)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Slider
                    value={[quality]}
                    onValueChange={(v) => setQuality(v[0])}
                    min={50}
                    max={100}
                    step={5}
                  />
                </CardContent>
              </Card>
            )}

            {format === 'png' && (
              <Card>
                <CardHeader>
                  <CardTitle>Fundo Transparente</CardTitle>
                  <CardDescription>
                    Ativar transparência no fundo da imagem
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={transparentBg}
                      onCheckedChange={setTransparentBg}
                    />
                    <Label>Usar fundo transparente</Label>
                  </div>
                </CardContent>
              </Card>
            )}

            {!transparentBg && (format === 'jpg' || format === 'png' || format === 'pdf') && (
              <Card>
                <CardHeader>
                  <CardTitle>Cor de Fundo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      placeholder="#ffffff"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Aba de Página */}
          <TabsContent value="page" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tamanho da Página</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={pageSize} onValueChange={(v) => setPageSize(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A4">A4 (210 x 297 mm)</SelectItem>
                    <SelectItem value="LETTER">Letter (216 x 279 mm)</SelectItem>
                    <SelectItem value="CUSTOM">Personalizado</SelectItem>
                  </SelectContent>
                </Select>

                {pageSize === 'CUSTOM' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Largura (mm)</Label>
                      <Input
                        type="number"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(parseInt(e.target.value))}
                        min={100}
                        max={500}
                      />
                    </div>
                    <div>
                      <Label>Altura (mm)</Label>
                      <Input
                        type="number"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(parseInt(e.target.value))}
                        min={100}
                        max={1000}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Orientação</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={orientation} onValueChange={(v) => setOrientation(v as any)}>
                  <div className="grid grid-cols-2 gap-4">
                    <Label
                      htmlFor="portrait"
                      className={`flex items-center space-x-2 rounded-lg border-2 p-4 cursor-pointer ${
                        orientation === 'portrait' ? 'border-primary bg-primary/5' : 'border-muted'
                      }`}
                    >
                      <RadioGroupItem value="portrait" id="portrait" />
                      <span>Retrato</span>
                    </Label>
                    <Label
                      htmlFor="landscape"
                      className={`flex items-center space-x-2 rounded-lg border-2 p-4 cursor-pointer ${
                        orientation === 'landscape' ? 'border-primary bg-primary/5' : 'border-muted'
                      }`}
                    >
                      <RadioGroupItem value="landscape" id="landscape" />
                      <span>Paisagem</span>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Margens (mm)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Superior</Label>
                    <Input
                      type="number"
                      value={margins.top}
                      onChange={(e) => setMargins({ ...margins, top: parseInt(e.target.value) })}
                      min={0}
                      max={50}
                    />
                  </div>
                  <div>
                    <Label>Inferior</Label>
                    <Input
                      type="number"
                      value={margins.bottom}
                      onChange={(e) => setMargins({ ...margins, bottom: parseInt(e.target.value) })}
                      min={0}
                      max={50}
                    />
                  </div>
                  <div>
                    <Label>Esquerda</Label>
                    <Input
                      type="number"
                      value={margins.left}
                      onChange={(e) => setMargins({ ...margins, left: parseInt(e.target.value) })}
                      min={0}
                      max={50}
                    />
                  </div>
                  <div>
                    <Label>Direita</Label>
                    <Input
                      type="number"
                      value={margins.right}
                      onChange={(e) => setMargins({ ...margins, right: parseInt(e.target.value) })}
                      min={0}
                      max={50}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>
            Cancelar
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            <FileDown className="mr-2 h-4 w-4" />
            {isExporting ? 'Exportando...' : 'Exportar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

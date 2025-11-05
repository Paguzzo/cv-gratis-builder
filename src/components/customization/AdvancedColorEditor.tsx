import React, { useState, useCallback } from 'react';
import { ColorScheme, defaultColorPalettes } from '@/types/customTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Palette, Plus, Save, Trash2, Wand2, Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface AdvancedColorEditorProps {
  selectedColors: ColorScheme;
  onColorChange: (colors: ColorScheme) => void;
  showPreview?: boolean;
}

export function AdvancedColorEditor({
  selectedColors,
  onColorChange,
  showPreview = true
}: AdvancedColorEditorProps) {
  const [customPalettes, setCustomPalettes] = useState<ColorScheme[]>([]);
  const [editingColor, setEditingColor] = useState<string | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [newPaletteName, setNewPaletteName] = useState('');

  // Converter HEX para RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Converter RGB para HEX
  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  // Converter HEX para HSL
  const hexToHsl = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return { h: 0, s: 0, l: 0 };

    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // Atualizar cor individual
  const updateColor = useCallback((colorKey: keyof ColorScheme, value: string) => {
    onColorChange({
      ...selectedColors,
      [colorKey]: value
    });
  }, [selectedColors, onColorChange]);

  // Gerar paleta automática baseada em cor principal
  const generatePalette = useCallback(() => {
    const baseColor = selectedColors.primary;
    const hsl = hexToHsl(baseColor);

    // Gerar variações
    const secondary = hslToHex(
      hsl.h,
      Math.min(100, hsl.s + 10),
      Math.min(100, hsl.l + 10)
    );

    const textDark = hslToHex(
      hsl.h,
      Math.max(0, hsl.s - 20),
      Math.max(0, hsl.l - 40)
    );

    const textLight = hslToHex(
      hsl.h,
      Math.max(0, hsl.s - 10),
      Math.min(100, hsl.l + 30)
    );

    const accent = hslToHex(
      (hsl.h + 30) % 360,
      hsl.s,
      hsl.l
    );

    const background = '#ffffff';
    const backgroundLight = hslToHex(hsl.h, 10, 98);

    onColorChange({
      ...selectedColors,
      secondary,
      text: textDark,
      textDark,
      textLight,
      accent,
      background,
      backgroundLight,
      link: textDark,
      highlight: textLight,
      border: textLight
    });

    toast.success('Paleta gerada automaticamente!');
  }, [selectedColors, onColorChange]);

  // Helper para converter HSL para HEX
  const hslToHex = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    const red = Math.round((r + m) * 255);
    const green = Math.round((g + m) * 255);
    const blue = Math.round((b + m) * 255);

    return rgbToHex(red, green, blue);
  };

  // Salvar paleta customizada
  const saveCustomPalette = () => {
    if (!newPaletteName.trim()) {
      toast.error('Digite um nome para a paleta');
      return;
    }

    const newPalette: ColorScheme = {
      ...selectedColors,
      id: `custom-${Date.now()}`,
      name: newPaletteName
    };

    setCustomPalettes([...customPalettes, newPalette]);
    localStorage.setItem('custom-color-palettes', JSON.stringify([...customPalettes, newPalette]));

    toast.success(`Paleta "${newPaletteName}" salva!`);
    setNewPaletteName('');
    setSaveDialogOpen(false);
  };

  // Remover paleta customizada
  const removeCustomPalette = (id: string) => {
    const updated = customPalettes.filter(p => p.id !== id);
    setCustomPalettes(updated);
    localStorage.setItem('custom-color-palettes', JSON.stringify(updated));
    toast.success('Paleta removida');
  };

  // Copiar código HEX
  const copyColorCode = (color: string) => {
    navigator.clipboard.writeText(color);
    toast.success('Código copiado!');
  };

  // Componente de seletor de cor individual
  const ColorPicker = ({
    label,
    colorKey,
    value
  }: {
    label: string;
    colorKey: keyof ColorScheme;
    value: string
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="color"
            value={value}
            onChange={(e) => updateColor(colorKey, e.target.value)}
            className="h-10 cursor-pointer"
          />
        </div>
        <Input
          type="text"
          value={value}
          onChange={(e) => updateColor(colorKey, e.target.value)}
          className="flex-1 font-mono text-xs"
          placeholder="#000000"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyColorCode(value)}
          className="px-3"
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Editor de Cores Avançado
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={generatePalette}
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Gerar Paleta
              </Button>
              <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Salvar Paleta Personalizada</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Nome da Paleta</Label>
                      <Input
                        value={newPaletteName}
                        onChange={(e) => setNewPaletteName(e.target.value)}
                        placeholder="Minha Paleta Incrível"
                      />
                    </div>
                    <Button onClick={saveCustomPalette} className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Paleta
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="palettes" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="palettes">Paletas</TabsTrigger>
              <TabsTrigger value="custom">Personalizar</TabsTrigger>
              <TabsTrigger value="advanced">Avançado</TabsTrigger>
            </TabsList>

            {/* Paletas Pré-definidas */}
            <TabsContent value="palettes" className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {defaultColorPalettes.map((palette) => (
                  <button
                    key={palette.id}
                    onClick={() => onColorChange(palette)}
                    className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                      selectedColors.id === palette.id
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex gap-2 mb-2">
                      <div
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: palette.primary }}
                      />
                      <div
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: palette.secondary }}
                      />
                      <div
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: palette.text }}
                      />
                    </div>
                    <p className="text-xs font-medium text-left">{palette.name}</p>
                  </button>
                ))}
              </div>

              {/* Paletas Customizadas */}
              {customPalettes.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Minhas Paletas</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {customPalettes.map((palette) => (
                      <div
                        key={palette.id}
                        className="relative group"
                      >
                        <button
                          onClick={() => onColorChange(palette)}
                          className={`w-full p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                            selectedColors.id === palette.id
                              ? 'border-blue-500 ring-2 ring-blue-200'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex gap-2 mb-2">
                            <div
                              className="w-8 h-8 rounded"
                              style={{ backgroundColor: palette.primary }}
                            />
                            <div
                              className="w-8 h-8 rounded"
                              style={{ backgroundColor: palette.secondary }}
                            />
                            <div
                              className="w-8 h-8 rounded"
                              style={{ backgroundColor: palette.text }}
                            />
                          </div>
                          <p className="text-xs font-medium text-left">{palette.name}</p>
                        </button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeCustomPalette(palette.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Personalização de Cores */}
            <TabsContent value="custom" className="space-y-4">
              <ColorPicker
                label="Cor Primária"
                colorKey="primary"
                value={selectedColors.primary}
              />
              <ColorPicker
                label="Cor Secundária"
                colorKey="secondary"
                value={selectedColors.secondary}
              />
              <ColorPicker
                label="Cor de Texto"
                colorKey="text"
                value={selectedColors.text}
              />
              <ColorPicker
                label="Cor de Background"
                colorKey="background"
                value={selectedColors.background || '#ffffff'}
              />
              <ColorPicker
                label="Cor de Link"
                colorKey="link"
                value={selectedColors.link || selectedColors.primary}
              />
              <ColorPicker
                label="Cor de Destaque"
                colorKey="highlight"
                value={selectedColors.highlight || selectedColors.secondary}
              />
            </TabsContent>

            {/* Cores Avançadas */}
            <TabsContent value="advanced" className="space-y-4">
              <ColorPicker
                label="Texto Claro"
                colorKey="textLight"
                value={selectedColors.textLight || selectedColors.text}
              />
              <ColorPicker
                label="Texto Escuro"
                colorKey="textDark"
                value={selectedColors.textDark || selectedColors.text}
              />
              <ColorPicker
                label="Background Claro"
                colorKey="backgroundLight"
                value={selectedColors.backgroundLight || '#f9fafb'}
              />
              <ColorPicker
                label="Cor de Acento"
                colorKey="accent"
                value={selectedColors.accent || selectedColors.secondary}
              />
              <ColorPicker
                label="Cor de Borda"
                colorKey="border"
                value={selectedColors.border || '#e5e7eb'}
              />
            </TabsContent>
          </Tabs>

          {/* Preview das cores */}
          {showPreview && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
              <h4 className="text-sm font-semibold mb-3">Preview da Paleta</h4>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(selectedColors)
                  .filter(([key]) => key !== 'id' && key !== 'name' && key !== 'gradient')
                  .map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div
                        className="w-full h-12 rounded border mb-1"
                        style={{ backgroundColor: value as string }}
                      />
                      <p className="text-xs text-gray-600 truncate">{key}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

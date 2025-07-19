import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useFormatting } from '@/contexts/FormattingContext';
import { ColorPalette, COLOR_PALETTES } from '@/types/formatting';
import { Palette, Check } from 'lucide-react';

export function ColorPalettePanel() {
  const { formatting, updateColorPalette } = useFormatting();
  const { colorPalette } = formatting;

  const handlePaletteChange = (palette: ColorPalette) => {
    updateColorPalette(palette);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Paleta de Cores
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Paleta Atual */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Paleta Selecionada</Label>
          <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
            <div className="flex gap-1">
              <div
                className="w-6 h-6 rounded border-2 border-white shadow-sm"
                style={{ backgroundColor: colorPalette.primary }}
                title="Cor Primária"
              />
              <div
                className="w-6 h-6 rounded border-2 border-white shadow-sm"
                style={{ backgroundColor: colorPalette.secondary }}
                title="Cor Secundária"
              />
              <div
                className="w-6 h-6 rounded border-2 border-white shadow-sm"
                style={{ backgroundColor: colorPalette.accent }}
                title="Cor de Destaque"
              />
              <div
                className="w-6 h-6 rounded border-2 border-white shadow-sm"
                style={{ backgroundColor: colorPalette.background }}
                title="Cor de Fundo"
              />
            </div>
            <div>
              <div className="font-medium text-sm">{colorPalette.name}</div>
              <div className="text-xs text-gray-500">
                {colorPalette.primary}
              </div>
            </div>
          </div>
        </div>

        {/* Paletas Disponíveis */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Escolher Paleta</Label>
          <div className="grid grid-cols-1 gap-3">
            {COLOR_PALETTES.map((palette) => (
              <button
                key={palette.id}
                onClick={() => handlePaletteChange(palette)}
                className={`
                  flex items-center gap-3 p-3 border-2 rounded-lg transition-all hover:scale-105
                  ${colorPalette.id === palette.id 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                {/* Quadradinhos de Cores */}
                <div className="flex gap-1">
                  <div
                    className="w-5 h-5 rounded border border-gray-300"
                    style={{ backgroundColor: palette.primary }}
                  />
                  <div
                    className="w-5 h-5 rounded border border-gray-300"
                    style={{ backgroundColor: palette.secondary }}
                  />
                  <div
                    className="w-5 h-5 rounded border border-gray-300"
                    style={{ backgroundColor: palette.accent }}
                  />
                  <div
                    className="w-5 h-5 rounded border border-gray-300"
                    style={{ backgroundColor: palette.background }}
                  />
                </div>

                {/* Nome da Paleta */}
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{palette.name}</div>
                  <div className="text-xs text-gray-500">
                    {palette.primary} • {palette.secondary}
                  </div>
                </div>

                {/* Check se selecionado */}
                {colorPalette.id === palette.id && (
                  <Check className="w-5 h-5 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Preview com a Paleta */}
        <div 
          className="border rounded-lg p-4 transition-colors"
          style={{ 
            backgroundColor: colorPalette.background,
            color: colorPalette.text 
          }}
        >
          <Label className="text-sm font-medium mb-2 block">Preview das Cores</Label>
          <div>
            <div 
              className="font-bold text-lg mb-1"
              style={{ color: colorPalette.primary }}
            >
              Nome do Profissional
            </div>
            <div 
              className="font-medium mb-2"
              style={{ color: colorPalette.secondary }}
            >
              Cargo ou Área de Atuação
            </div>
            <div 
              className="inline-block px-2 py-1 text-xs rounded"
              style={{ 
                backgroundColor: colorPalette.accent,
                color: 'white'
              }}
            >
              Habilidade
            </div>
            <div className="mt-2 text-sm">
              Este é um exemplo de como as cores ficam aplicadas no currículo.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useFormatting } from '@/contexts/FormattingContext';
import { FontFamily, FontSize, LineHeight, FONT_FAMILIES, FONT_SIZES, LINE_HEIGHTS } from '@/types/formatting';
import { Type, AlignLeft, RotateCcw } from 'lucide-react';

export function TypographyPanel() {
  const { formatting, updateTypography, resetFormatting } = useFormatting();
  const { typography } = formatting;

  const handleFontFamilyChange = (fontFamily: FontFamily) => {
    updateTypography({ fontFamily });
  };

  const handleFontSizeChange = (fontSize: FontSize) => {
    updateTypography({ fontSize });
  };

  const handleLineHeightChange = (lineHeight: LineHeight) => {
    updateTypography({ lineHeight });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="w-5 h-5" />
          Tipografia
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tipos de Letra */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Tipo de Letra</Label>
          <div className="grid gap-2">
            {Object.entries(FONT_FAMILIES).map(([key, font]) => (
              <Button
                key={key}
                variant={typography.fontFamily === key ? "default" : "outline"}
                size="sm"
                onClick={() => handleFontFamilyChange(key as FontFamily)}
                className="justify-start text-left h-auto py-3"
              >
                <div>
                  <div className="font-medium" style={{ fontFamily: font.css }}>
                    {font.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {font.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Tamanho da Fonte */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Tamanho da Fonte</Label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(FONT_SIZES).map(([key, size]) => (
              <Button
                key={key}
                variant={typography.fontSize === key ? "default" : "outline"}
                size="sm"
                onClick={() => handleFontSizeChange(key as FontSize)}
                className="flex flex-col items-center py-3"
              >
                <div className="text-lg" style={{ fontSize: size.baseSize }}>
                  Aa
                </div>
                <div className="text-xs">
                  {size.name}
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Espaçamento entre Linhas */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Espaçamento entre Linhas</Label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(LINE_HEIGHTS).map(([key, height]) => (
              <Button
                key={key}
                variant={typography.lineHeight === Number(key) ? "default" : "outline"}
                size="sm"
                onClick={() => handleLineHeightChange(Number(key) as LineHeight)}
                className="flex flex-col items-center py-3"
              >
                <AlignLeft className="w-4 h-4 mb-1" />
                <div className="text-xs">
                  {height.name}
                </div>
                <div className="text-xs text-gray-500">
                  {key}
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Preview da Tipografia */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <Label className="text-sm font-medium mb-2 block">Preview</Label>
          <div 
            style={{
              fontFamily: FONT_FAMILIES[typography.fontFamily].css,
              fontSize: FONT_SIZES[typography.fontSize].baseSize,
              lineHeight: typography.lineHeight
            }}
          >
            <div 
              className="font-bold mb-2"
              style={{ fontSize: FONT_SIZES[typography.fontSize].titleSize }}
            >
              João Silva
            </div>
            <div 
              className="font-medium mb-2"
              style={{ fontSize: FONT_SIZES[typography.fontSize].subtitleSize }}
            >
              Desenvolvedor Full Stack
            </div>
            <div>
              Profissional experiente em desenvolvimento web com foco em tecnologias modernas e melhores práticas de desenvolvimento.
            </div>
          </div>
        </div>

        {/* Reset */}
        <Button
          variant="outline"
          size="sm"
          onClick={resetFormatting}
          className="w-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Restaurar Padrão
        </Button>
      </CardContent>
    </Card>
  );
} 
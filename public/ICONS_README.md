# Ícones PWA - CVGratis

## Ícones Criados (SVG)

Os seguintes ícones SVG foram criados para o PWA:

- `icon.svg` - Ícone base (512x512)
- `favicon-32x32.svg` - Favicon 32x32
- `apple-touch-icon.svg` - Apple Touch Icon (180x180)
- `android-chrome-192x192.svg` - Android Chrome 192x192
- `android-chrome-512x512.svg` - Android Chrome 512x512

## Conversão para PNG (Opcional)

Para melhor compatibilidade com navegadores mais antigos, você pode converter os SVGs para PNG usando uma das ferramentas abaixo:

### Opção 1: Online (Recomendado)
- https://cloudconvert.com/svg-to-png
- https://convertio.co/svg-png/

### Opção 2: CLI com ImageMagick
```bash
# Instalar ImageMagick
# Windows: https://imagemagick.org/script/download.php
# Mac: brew install imagemagick
# Linux: sudo apt-get install imagemagick

# Converter cada arquivo
magick favicon-32x32.svg -resize 32x32 favicon-32x32.png
magick apple-touch-icon.svg -resize 180x180 apple-touch-icon.png
magick android-chrome-192x192.svg -resize 192x192 android-chrome-192x192.png
magick android-chrome-512x512.svg -resize 512x512 android-chrome-512x512.png
```

### Opção 3: Node.js com sharp
```bash
npm install sharp

# criar script convert-icons.js:
const sharp = require('sharp');

const icons = [
  { input: 'favicon-32x32.svg', output: 'favicon-32x32.png', size: 32 },
  { input: 'favicon-16x16.svg', output: 'favicon-16x16.png', size: 16 },
  { input: 'apple-touch-icon.svg', output: 'apple-touch-icon.png', size: 180 },
  { input: 'android-chrome-192x192.svg', output: 'android-chrome-192x192.png', size: 192 },
  { input: 'android-chrome-512x512.svg', output: 'android-chrome-512x512.png', size: 512 }
];

icons.forEach(({ input, output, size }) => {
  sharp(input)
    .resize(size, size)
    .png()
    .toFile(output)
    .then(() => console.log(`✅ ${output} criado`))
    .catch(err => console.error(`❌ Erro em ${output}:`, err));
});
```

## Nota
Os navegadores modernos suportam SVG diretamente, então as versões PNG são opcionais para compatibilidade retroativa.

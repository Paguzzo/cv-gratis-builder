const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'ui', 'jobai-chat.tsx');

// Ler arquivo
let content = fs.readFileSync(filePath, 'utf8');

// Remover emojis
content = content.replace(/[\u{1F300}-\u{1F9FF}]/gu, '');
content = content.replace(/[\u{2600}-\u{26FF}]/gu, '');
content = content.replace(/[\u{2700}-\u{27BF}]/gu, '');
content = content.replace(/[\u{FE00}-\u{FE0F}]/gu, '');
content = content.replace(/[\u{20E3}]/gu, '');
content = content.replace(/[\u{E0100}-\u{E01EF}]/gu, '');

// Remover símbolos específicos
content = content.replace(/□/g, '-');
content = content.replace(/→/g, '>');
content = content.replace(/↑/g, '');
content = content.replace(/•/g, '-');

// Substituir acentos minúsculos
content = content.replace(/á/g, 'a');
content = content.replace(/à/g, 'a');
content = content.replace(/â/g, 'a');
content = content.replace(/ã/g, 'a');
content = content.replace(/é/g, 'e');
content = content.replace(/ê/g, 'e');
content = content.replace(/í/g, 'i');
content = content.replace(/ó/g, 'o');
content = content.replace(/ô/g, 'o');
content = content.replace(/õ/g, 'o');
content = content.replace(/ú/g, 'u');
content = content.replace(/ü/g, 'u');
content = content.replace(/ç/g, 'c');

// Substituir acentos maiúsculos
content = content.replace(/Á/g, 'A');
content = content.replace(/À/g, 'A');
content = content.replace(/Â/g, 'A');
content = content.replace(/Ã/g, 'A');
content = content.replace(/É/g, 'E');
content = content.replace(/Ê/g, 'E');
content = content.replace(/Í/g, 'I');
content = content.replace(/Ó/g, 'O');
content = content.replace(/Ô/g, 'O');
content = content.replace(/Õ/g, 'O');
content = content.replace(/Ú/g, 'U');
content = content.replace(/Ü/g, 'U');
content = content.replace(/Ç/g, 'C');

// Salvar
fs.writeFileSync(filePath, content, 'utf8');

console.log('Arquivo corrigido com sucesso!');

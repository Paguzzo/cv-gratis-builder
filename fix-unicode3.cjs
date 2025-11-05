const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'ui', 'jobai-chat.tsx');

// Ler arquivo
let content = fs.readFileSync(filePath, 'utf8');

// Remove TODOS os caracteres não-ASCII (exceto os básicos necessários)
content = content.replace(/[^\x00-\x7F]/g, function(char) {
  const code = char.charCodeAt(0);

  // Caracteres acentuados
  if (code === 225 || code === 224 || code === 226 || code === 227) return 'a';
  if (code === 233 || code === 234) return 'e';
  if (code === 237) return 'i';
  if (code === 243 || code === 244 || code === 245) return 'o';
  if (code === 250 || code === 252) return 'u';
  if (code === 231) return 'c';
  if (code === 193 || code === 192 || code === 194 || code === 195) return 'A';
  if (code === 201 || code === 202) return 'E';
  if (code === 205) return 'I';
  if (code === 211 || code === 212 || code === 213) return 'O';
  if (code === 218 || code === 220) return 'U';
  if (code === 199) return 'C';

  // Remove todos os outros caracteres não-ASCII
  return '';
});

// Salvar
fs.writeFileSync(filePath, content, 'utf8');

console.log('Arquivo limpo! Todos os caracteres nao-ASCII foram removidos ou substituidos.');

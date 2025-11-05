const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'ui', 'jobai-chat.tsx');

// Ler arquivo
let content = fs.readFileSync(filePath, 'utf8');

// Remove TODOS os caracteres não-ASCII (exceto os básicos necessários)
content = content.replace(/[^\x00-\x7F]/g, function(char) {
  // Mapear caracteres específicos
  const map = {
    'á': 'a', 'à': 'a', 'â': 'a', 'ã': 'a',
    'é': 'e', 'ê': 'e',
    'í': 'i',
    'ó': 'o', 'ô': 'o', 'õ': 'o',
    'ú': 'u', 'ü': 'u',
    'ç': 'c',
    'Á': 'A', 'À': 'A', 'Â': 'A', 'Ã': 'A',
    'É': 'E', 'Ê': 'E',
    'Í': 'I',
    'Ó': 'O', 'Ô': 'O', 'Õ': 'O',
    'Ú': 'U', 'Ü': 'U',
    'Ç': 'C',
    '□': '-',
    '→': '>',
    '↑': '',
    '•': '-',
    '"': '"',
    '"': '"',
    ''': "'",
    ''': "'"
  };

  return map[char] || ''; // Remove qualquer caractere não mapeado
});

// Salvar
fs.writeFileSync(filePath, content, 'utf8');

console.log('Arquivo corrigido com sucesso - TODOS os caracteres não-ASCII removidos!');

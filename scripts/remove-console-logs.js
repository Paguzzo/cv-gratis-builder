#!/usr/bin/env node

/**
 * Script para remover console.log/warn/error de produção
 * Mantém em desenvolvimento para debugging
 */

const fs = require('fs');
const path = require('path');

// Diretórios para processar
const DIRS_TO_PROCESS = ['src'];

// Extensões de arquivo para processar
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

// Padrões de console a remover
const CONSOLE_PATTERNS = [
  /console\.log\([^)]*\);?\n?/g,
  /console\.warn\([^)]*\);?\n?/g,
  /console\.error\([^)]*\);?\n?/g,
  /console\.info\([^)]*\);?\n?/g,
  /console\.debug\([^)]*\);?\n?/g,
];

let filesProcessed = 0;
let consolesRemoved = 0;

function shouldProcessFile(filePath) {
  return EXTENSIONS.some(ext => filePath.endsWith(ext));
}

function removeConsoleLogs(content) {
  let modified = content;
  let removedCount = 0;

  CONSOLE_PATTERNS.forEach(pattern => {
    const matches = modified.match(pattern);
    if (matches) {
      removedCount += matches.length;
      modified = modified.replace(pattern, '');
    }
  });

  return { content: modified, removed: removedCount };
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { content: newContent, removed } = removeConsoleLogs(content);

    if (removed > 0) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ ${filePath}: ${removed} console(s) removido(s)`);
      consolesRemoved += removed;
    }

    filesProcessed++;
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
  }
}

function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    // Ignorar node_modules e dist
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') {
      continue;
    }

    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && shouldProcessFile(entry.name)) {
      processFile(fullPath);
    }
  }
}

// Executar script
console.log('🚀 Iniciando remoção de console.log...\n');

DIRS_TO_PROCESS.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    console.log(`📁 Processando diretório: ${dir}`);
    processDirectory(dirPath);
  }
});

console.log('\n✨ Processo concluído!');
console.log(`📊 Arquivos processados: ${filesProcessed}`);
console.log(`🗑️  Console.log removidos: ${consolesRemoved}`);

if (consolesRemoved === 0) {
  console.log('✅ Nenhum console.log encontrado!');
} else {
  console.log('⚠️  IMPORTANTE: Revise as mudanças antes de commitar!');
}

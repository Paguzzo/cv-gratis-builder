#!/usr/bin/env node

/**
 * 🧹 SCRIPT SIMPLES DE REMOÇÃO DE CONSOLE.LOGS DEBUG
 *
 * Remove console.logs de debug mantendo apenas os importantes
 */

const fs = require('fs');
const path = require('path');

function findFiles(dir, extension) {
  const files = [];

  function walkDir(currentPath) {
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
      const itemPath = path.join(currentPath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.git')) {
        walkDir(itemPath);
      } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx'))) {
        files.push(itemPath);
      }
    }
  }

  walkDir(dir);
  return files;
}

function cleanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let modifiedLines = [];
  let removedCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Padrões específicos para remover (debug logs com emojis)
    const debugPatterns = [
      /console\.log\(['"`]🔍.*?['"`]\);?/,
      /console\.log\(['"`]📝.*?['"`]\);?/,
      /console\.log\(['"`]✅.*?['"`]\);?/,
      /console\.log\(['"`]🎯.*?['"`]\);?/,
      /console\.log\(['"`]🚨.*?['"`]\);?/,
      /console\.log\(['"`]🔧.*?['"`]\);?/,
      /console\.log\(['"`]💡.*?['"`]\);?/,
      /console\.log\(['"`]🔄.*?['"`]\);?/,
      /console\.log\(['"`]📊.*?['"`]\);?/,
      /console\.log\(['"`]STRIPE.*?['"`]\);?/,
      /console\.log\(['"`]PAYMENT.*?['"`]\);?/,
      /console\.log\(['"`]DEBUG.*?['"`]\);?/,
      /console\.log\(['"`]ADMIN DEBUG.*?['"`]\);?/,
    ];

    let shouldRemove = false;

    // Verificar se é um console.log de debug
    for (const pattern of debugPatterns) {
      if (pattern.test(line)) {
        shouldRemove = true;
        break;
      }
    }

    // Não remover se:
    // 1. Estiver em catch block
    // 2. For console.error, console.warn
    // 3. Tiver palavra "error" próxima
    const context = lines.slice(Math.max(0, i - 1), i + 2).join(' ').toLowerCase();
    if (context.includes('catch') ||
        context.includes('error') ||
        line.includes('console.error') ||
        line.includes('console.warn')) {
      shouldRemove = false;
    }

    if (shouldRemove) {
      removedCount++;
      // Pular esta linha
      continue;
    } else {
      modifiedLines.push(line);
    }
  }

  // Salvar apenas se houve mudanças
  const newContent = modifiedLines.join('\n');
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent);
    return removedCount;
  }

  return 0;
}

function main() {
  console.log('🧹 Removendo console.logs de debug...\n');

  const srcPath = path.join(process.cwd(), 'src');
  const files = findFiles(srcPath);

  let totalRemoved = 0;
  let filesModified = 0;

  files.forEach(file => {
    // Pular arquivos de teste
    if (file.includes('test') || file.includes('spec') || file.includes('debug')) {
      return;
    }

    const removed = cleanFile(file);
    if (removed > 0) {
      const relativePath = path.relative(process.cwd(), file);
      console.log(`📝 ${relativePath}: ${removed} logs removidos`);
      totalRemoved += removed;
      filesModified++;
    }
  });

  console.log('\n📊 RESUMO:');
  console.log(`📁 Arquivos modificados: ${filesModified}`);
  console.log(`❌ Console.logs removidos: ${totalRemoved}`);

  if (totalRemoved > 0) {
    console.log('\n✅ Limpeza concluída!');
  } else {
    console.log('\n💡 Nenhum console.log de debug encontrado para remover.');
  }
}

main();
#!/usr/bin/env node

/**
 * 🧹 SCRIPT DE LIMPEZA DE CONSOLE.LOGS PARA PRODUÇÃO
 *
 * Remove console.logs desnecessários mantendo apenas os críticos
 * para logs de erro e debugging importante.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Padrões de console.log que devem ser preservados
const PRESERVE_PATTERNS = [
  /console\.error\(/,
  /console\.warn\(/,
  /console\.trace\(/,
  // Preservar console.logs em catch blocks ou error handling
  /catch.*\{[\s\S]*?console\.log/,
  /error.*console\.log/,
  // Preservar console.logs críticos comentados
  /\/\*.*console\.log.*\*\//,
  /\/\/.*CRITICAL.*console\.log/,
  /\/\/.*IMPORTANT.*console\.log/,
  /\/\/.*PRODUCTION.*console\.log/,
];

// Padrões de console.log que devem ser removidos
const REMOVE_PATTERNS = [
  // Debug logs óbvios
  /console\.log\(['"`]🔍.*?\);?\s*$/gm,
  /console\.log\(['"`]📝.*?\);?\s*$/gm,
  /console\.log\(['"`]✅.*?\);?\s*$/gm,
  /console\.log\(['"`]🎯.*?\);?\s*$/gm,
  /console\.log\(['"`]🚨.*?\);?\s*$/gm,
  /console\.log\(['"`]🔧.*?\);?\s*$/gm,
  /console\.log\(['"`]💡.*?\);?\s*$/gm,
  // Debug básicos
  /console\.log\(['"`]DEBUG.*?\);?\s*$/gm,
  /console\.log\(['"`]ADMIN DEBUG.*?\);?\s*$/gm,
  /console\.log\(['"`]STRIPE.*?\);?\s*$/gm,
  /console\.log\(['"`]PAYMENT.*?\);?\s*$/gm,
  // Console.logs simples de variáveis
  /^\s*console\.log\([^,)]+\);\s*$/gm,
];

function shouldPreserveLog(line, context) {
  // Verificar se deve preservar este log
  for (const pattern of PRESERVE_PATTERNS) {
    if (pattern.test(line) || pattern.test(context)) {
      return true;
    }
  }

  // Preservar se estiver em bloco try-catch
  if (context.includes('catch') && context.includes('error')) {
    return true;
  }

  return false;
}

function cleanConsoleLogsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let modifiedLines = [];
  let removedCount = 0;
  let preservedCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const context = lines.slice(Math.max(0, i - 2), i + 3).join('\n');

    // Verificar se a linha contém console.log
    if (line.includes('console.log') || line.includes('console.debug')) {
      if (shouldPreserveLog(line, context)) {
        // Preservar mas adicionar comentário indicando revisão
        modifiedLines.push(line.replace(/^(\s*)/, '$1// TODO: Review for production - '));
        preservedCount++;
      } else {
        // Tentar aplicar padrões de remoção automática
        let shouldRemove = false;
        for (const pattern of REMOVE_PATTERNS) {
          if (pattern.test(line)) {
            shouldRemove = true;
            break;
          }
        }

        if (shouldRemove) {
          // Remover completamente
          removedCount++;
          continue; // Pula esta linha
        } else {
          // Comentar para revisão manual
          modifiedLines.push(line.replace(/^(\s*)/, '$1// TODO: Remove for production - '));
          preservedCount++;
        }
      }
    } else {
      modifiedLines.push(line);
    }
  }

  // Escrever arquivo apenas se houve mudanças
  const newContent = modifiedLines.join('\n');
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent);
    return { removed: removedCount, preserved: preservedCount };
  }

  return { removed: 0, preserved: 0 };
}

function main() {
  console.log('🧹 Iniciando limpeza de console.logs...\n');

  // Encontrar todos os arquivos TypeScript/JavaScript
  const patterns = [
    'src/**/*.ts',
    'src/**/*.tsx',
    'src/**/*.js',
    'src/**/*.jsx'
  ];

  let totalRemoved = 0;
  let totalPreserved = 0;
  let filesModified = 0;

  patterns.forEach(pattern => {
    const files = glob.sync(pattern);

    files.forEach(file => {
      // Pular arquivos de teste e node_modules
      if (file.includes('node_modules') ||
          file.includes('.test.') ||
          file.includes('.spec.') ||
          file.includes('test-') ||
          file.includes('debug-')) {
        return;
      }

      try {
        const result = cleanConsoleLogsInFile(file);
        if (result.removed > 0 || result.preserved > 0) {
          console.log(`📝 ${file}:`);
          if (result.removed > 0) {
            console.log(`   ❌ Removidos: ${result.removed}`);
          }
          if (result.preserved > 0) {
            console.log(`   ⚠️  Preservados para revisão: ${result.preserved}`);
          }

          totalRemoved += result.removed;
          totalPreserved += result.preserved;
          filesModified++;
        }
      } catch (error) {
        console.error(`❌ Erro ao processar ${file}:`, error.message);
      }
    });
  });

  console.log('\n📊 RESUMO DA LIMPEZA:');
  console.log(`📁 Arquivos modificados: ${filesModified}`);
  console.log(`❌ Console.logs removidos: ${totalRemoved}`);
  console.log(`⚠️  Console.logs preservados para revisão: ${totalPreserved}`);

  if (totalRemoved > 0) {
    console.log('\n✅ Limpeza concluída! Execute npm run lint para verificar.');
  } else {
    console.log('\n💡 Nenhum console.log foi removido automaticamente.');
  }

  if (totalPreserved > 0) {
    console.log('\n🔍 PRÓXIMOS PASSOS:');
    console.log('1. Revisar console.logs marcados com "TODO: Review for production"');
    console.log('2. Remover ou converter em logging apropriado');
    console.log('3. Executar este script novamente se necessário');
  }
}

if (require.main === module) {
  main();
}

module.exports = { cleanConsoleLogsInFile, shouldPreserveLog };
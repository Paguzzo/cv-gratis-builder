#!/usr/bin/env node

/**
 * 🔐 GERADOR DE HASH BCRYPT PARA SENHA ADMIN
 *
 * Script para gerar hash de senha bcrypt para uso no .env
 *
 * Uso:
 * node generate-password-hash.js [senha]
 *
 * Exemplo:
 * node generate-password-hash.js MinhaS3nhaS3gur@!
 */

const bcrypt = require('bcrypt');
const readline = require('readline');

const SALT_ROUNDS = 10;

async function generateHash(password) {
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
  } catch (error) {
    console.error('❌ Erro ao gerar hash:', error);
    process.exit(1);
  }
}

async function main() {
  // Obter senha do argumento ou prompt
  const password = process.argv[2];

  if (password) {
    // Senha fornecida como argumento
    console.log('🔐 Gerando hash bcrypt...\n');
    const hash = await generateHash(password);

    console.log('✅ Hash gerado com sucesso!\n');
    console.log('Adicione esta linha ao seu arquivo .env:\n');
    console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
    console.log('⚠️  IMPORTANTE: Mantenha este hash em segredo!');
    console.log('⚠️  Não compartilhe o hash ou a senha original.\n');

  } else {
    // Prompt interativo
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Digite a senha admin que deseja usar: ', async (password) => {
      if (!password || password.length < 6) {
        console.error('❌ Senha deve ter no mínimo 6 caracteres');
        rl.close();
        process.exit(1);
      }

      console.log('\n🔐 Gerando hash bcrypt...\n');
      const hash = await generateHash(password);

      console.log('✅ Hash gerado com sucesso!\n');
      console.log('Adicione esta linha ao seu arquivo .env:\n');
      console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
      console.log('⚠️  IMPORTANTE: Mantenha este hash em segredo!');
      console.log('⚠️  Não compartilhe o hash ou a senha original.\n');

      rl.close();
    });
  }
}

main();

#!/usr/bin/env node

/**
 * 🧪 SCRIPT DE TESTE DE AUTENTICAÇÃO
 *
 * Testa o fluxo completo de autenticação JWT
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';
const USERNAME = 'admin';
const PASSWORD = 'Admin@2024!';

async function testHealthCheck() {
  console.log('\n🏥 Testando Health Check...');
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Health Check OK:', data);
    return true;
  } catch (error) {
    console.error('❌ Health Check falhou:', error.message);
    return false;
  }
}

async function testLogin() {
  console.log('\n🔑 Testando Login Admin...');
  try {
    const response = await fetch(`${BASE_URL}/api/secure/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: USERNAME,
        password: PASSWORD
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log('✅ Login bem-sucedido!');
      console.log('   Token recebido:', data.token.substring(0, 50) + '...');
      console.log('   Usuário:', data.user.username);
      console.log('   Role:', data.user.role);
      console.log('   Expira em:', data.expiresIn, 'segundos');
      return data.token;
    } else {
      console.error('❌ Login falhou:', data.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro no login:', error.message);
    return null;
  }
}

async function testVerifyToken(token) {
  console.log('\n🔐 Testando Verificação de Token...');
  try {
    const response = await fetch(`${BASE_URL}/api/secure/admin/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok && data.valid) {
      console.log('✅ Token válido!');
      console.log('   Usuário:', data.user.username);
      console.log('   Permissões:', data.user.permissions);
      return true;
    } else {
      console.error('❌ Token inválido:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao verificar token:', error.message);
    return false;
  }
}

async function testInvalidToken() {
  console.log('\n🚫 Testando Token Inválido...');
  try {
    const response = await fetch(`${BASE_URL}/api/secure/admin/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token_invalido_123'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.log('✅ Token inválido corretamente rejeitado');
      return true;
    } else {
      console.error('❌ Token inválido foi aceito (PROBLEMA DE SEGURANÇA!)');
      return false;
    }
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    return false;
  }
}

async function testWrongPassword() {
  console.log('\n🔒 Testando Senha Incorreta...');
  try {
    const response = await fetch(`${BASE_URL}/api/secure/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: USERNAME,
        password: 'senha_errada'
      })
    });

    const data = await response.json();

    if (!response.ok && !data.success) {
      console.log('✅ Senha incorreta corretamente rejeitada');
      return true;
    } else {
      console.error('❌ Senha incorreta foi aceita (PROBLEMA DE SEGURANÇA!)');
      return false;
    }
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    return false;
  }
}

async function testLogout(token) {
  console.log('\n👋 Testando Logout...');
  try {
    const response = await fetch(`${BASE_URL}/api/secure/admin/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log('✅ Logout bem-sucedido!');
      return true;
    } else {
      console.error('❌ Logout falhou:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro no logout:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🧪 INICIANDO TESTES DE AUTENTICAÇÃO JWT\n');
  console.log('='.repeat(50));

  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Health Check
  totalTests++;
  if (await testHealthCheck()) passedTests++;

  // Test 2: Login com credenciais corretas
  totalTests++;
  const token = await testLogin();
  if (token) passedTests++;

  if (token) {
    // Test 3: Verificar token válido
    totalTests++;
    if (await testVerifyToken(token)) passedTests++;

    // Test 4: Logout
    totalTests++;
    if (await testLogout(token)) passedTests++;
  }

  // Test 5: Token inválido
  totalTests++;
  if (await testInvalidToken()) passedTests++;

  // Test 6: Senha incorreta
  totalTests++;
  if (await testWrongPassword()) passedTests++;

  // Resumo
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 RESUMO DOS TESTES\n');
  console.log(`   Total de testes: ${totalTests}`);
  console.log(`   ✅ Passou: ${passedTests}`);
  console.log(`   ❌ Falhou: ${totalTests - passedTests}`);
  console.log(`   Taxa de sucesso: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  if (passedTests === totalTests) {
    console.log('\n🎉 TODOS OS TESTES PASSARAM! Sistema de autenticação está funcionando corretamente.\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  ALGUNS TESTES FALHARAM. Verifique os erros acima.\n');
    process.exit(1);
  }
}

// Executar testes
runAllTests().catch(error => {
  console.error('❌ Erro fatal nos testes:', error);
  process.exit(1);
});

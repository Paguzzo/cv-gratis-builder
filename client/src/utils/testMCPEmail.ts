import MCPEmailService from '@/services/mcpEmailService';

/**
 * Utilitário para testar o sistema de email MCP integrado ao CV Grátis
 */
export class MCPEmailTester {
  
  /**
   * Teste básico de conectividade
   */
  static async testBasicConnectivity(): Promise<void> {
    console.log('🧪 Iniciando teste básico do sistema MCP Email...');
    
    try {
      const result = await MCPEmailService.testEmailConfiguration();
      
      if (result.success) {
        console.log('✅ TESTE BÁSICO APROVADO:', result.details);
      } else {
        console.error('❌ TESTE BÁSICO FALHOU:', result.details);
      }
    } catch (error) {
      console.error('💥 ERRO NO TESTE BÁSICO:', error);
    }
  }

  /**
   * Teste de envio de currículo completo
   */
  static async testCurriculumSending(): Promise<void> {
    console.log('🧪 Testando envio completo de currículo...');
    
    try {
      const testData = {
        recipientEmail: 'compg.oficial@gmail.com',
        recipientName: 'Teste Recebedor',
        senderName: 'João Silva Teste',
        subject: '🧪 TESTE - Meu Currículo Via MCP',
        message: 'Olá!\n\nEste é um teste do sistema de envio de currículos integrado com MCP + Resend.\n\nSe você recebeu este email, o sistema está funcionando corretamente!\n\nAtenciosamente,\nJoão Silva',
        templateId: 'test-template-001'
      };

      const result = await MCPEmailService.sendCurriculumByEmail(testData);
      
      if (result.success) {
        console.log('✅ TESTE DE CURRÍCULO APROVADO:', result.emailId);
      } else {
        console.error('❌ TESTE DE CURRÍCULO FALHOU:', result.error);
      }
    } catch (error) {
      console.error('💥 ERRO NO TESTE DE CURRÍCULO:', error);
    }
  }

  /**
   * Executar bateria completa de testes
   */
  static async runAllTests(): Promise<void> {
    console.log('🚀 INICIANDO BATERIA COMPLETA DE TESTES MCP EMAIL');
    console.log('================================================');
    
    // Teste 1: Conectividade básica
    await this.testBasicConnectivity();
    
    // Aguardar um pouco entre testes
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Teste 2: Envio de currículo
    await this.testCurriculumSending();
    
    console.log('================================================');
    console.log('🏁 BATERIA DE TESTES CONCLUÍDA');
  }

  /**
   * Verificar configuração do ambiente
   */
  static checkEnvironment(): void {
    console.log('🔍 Verificando ambiente para MCP Email...');
    
         const checks = [
       {
         name: 'Browser Environment',
         condition: typeof window !== 'undefined',
         message: 'Executando no browser'
       },
       {
         name: 'MCP Email Function',
         condition: typeof window?.mcp_Email_sending_send_email === 'function',
         message: 'Função MCP Email disponível'
       },
       {
         name: 'Template Premium',
         condition: !!document.querySelector('.template-premium-preview'),
         message: 'Template premium detectado'
       },
       {
         name: 'Template Gratuito',
         condition: !!document.getElementById('template-preview-container'),
         message: 'Template gratuito detectado'
       },
       {
         name: 'Algum Template',
         condition: !!(document.querySelector('.template-premium-preview') || 
                      document.getElementById('template-preview-container') ||
                      document.querySelector('[class*="template"]')),
         message: 'Sistema de templates disponível'
       }
     ];

    checks.forEach(check => {
      const status = check.condition ? '✅' : '❌';
      console.log(`${status} ${check.name}: ${check.message}`);
    });
  }
}

// Função utilitária para executar teste rápido no console
export const testMCPEmailQuick = async () => {
  MCPEmailTester.checkEnvironment();
  await MCPEmailTester.runAllTests();
};

// Para usar no console do navegador:
// import { testMCPEmailQuick } from './utils/testMCPEmail';
// testMCPEmailQuick(); 
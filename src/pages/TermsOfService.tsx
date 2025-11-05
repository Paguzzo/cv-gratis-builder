import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Início
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Termos de Uso</h1>
          <p className="text-gray-600">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
            <p className="text-gray-700 mb-4">
              Ao acessar e usar o CV Grátis Builder ("Serviço"), você concorda em ficar vinculado a estes Termos de Uso 
              ("Termos"). Se você não concordar com qualquer parte destes termos, não deverá usar nosso serviço.
            </p>
            <p className="text-gray-700">
              Estes Termos aplicam-se a todos os visitantes, usuários e outras pessoas que acessam ou usam o Serviço.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Descrição do Serviço</h2>
            <p className="text-gray-700 mb-4">
              O CV Grátis Builder é uma plataforma online que permite aos usuários criar currículos profissionais 
              utilizando templates gratuitos e premium. O serviço inclui:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Templates gratuitos para criação de currículos</li>
              <li>Templates premium com funcionalidades avançadas</li>
              <li>Editor de customização e formatação</li>
              <li>Exportação em PDF, impressão e avaliação por IA</li>
              <li>Sistema de avaliação inteligente</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Conta de Usuário</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">3.1 Responsabilidades do Usuário</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Fornecer informações precisas e atualizadas</li>
              <li>Manter a segurança de suas credenciais de acesso</li>
              <li>Ser responsável por todas as atividades que ocorrem em sua conta</li>
              <li>Notificar-nos imediatamente sobre uso não autorizado</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">3.2 Elegibilidade</h3>
            <p className="text-gray-700 mb-4">
              Você deve ter pelo menos 18 anos para usar este serviço. Ao usar o serviço, você declara e garante 
              que tem pelo menos 18 anos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Uso Aceitável</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">4.1 Uso Permitido</h3>
            <p className="text-gray-700 mb-4">Você pode usar nosso serviço para:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Criar currículos para uso pessoal e profissional</li>
              <li>Exportar e compartilhar seus currículos</li>
              <li>Utilizar templates conforme nossa licença</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">4.2 Uso Proibido</h3>
            <p className="text-gray-700 mb-4">Você NÃO pode:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Violar qualquer lei ou regulamento aplicável</li>
              <li>Enviar conteúdo ofensivo, difamatório ou inadequado</li>
              <li>Tentar acessar sistemas não autorizados</li>
              <li>Usar o serviço para spam ou atividades maliciosas</li>
              <li>Revender ou redistribuir nossos templates sem autorização</li>
              <li>Fazer engenharia reversa ou copiar nosso código</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Pagamentos e Assinaturas</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">5.1 Templates Premium</h3>
            <p className="text-gray-700 mb-4">
              Templates premium estão disponíveis mediante pagamento de taxa única de R$ 4,90 por template. 
              O pagamento garante acesso vitalício ao template específico adquirido.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3">5.2 Processamento de Pagamentos</h3>
            <p className="text-gray-700 mb-4">
              Todos os pagamentos são processados através do Stripe. Não armazenamos informações de cartão de crédito 
              em nossos servidores.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3">5.3 Política de Reembolso</h3>
            <p className="text-gray-700 mb-4">
              Devido à natureza digital do produto, não oferecemos reembolsos após a compra e acesso ao template premium. 
              Em casos excepcionais, analisaremos solicitações individualmente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Propriedade Intelectual</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">6.1 Nossos Direitos</h3>
            <p className="text-gray-700 mb-4">
              O CV Grátis Builder e todo seu conteúdo, recursos e funcionalidades são propriedade nossa e são 
              protegidos por direitos autorais, marcas comerciais e outras leis de propriedade intelectual.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3">6.2 Seus Direitos</h3>
            <p className="text-gray-700 mb-4">
              Você mantém todos os direitos sobre o conteúdo que cria usando nosso serviço. Concedemos a você 
              uma licença limitada para usar nossos templates conforme estes termos.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3">6.3 Licença de Templates</h3>
            <p className="text-gray-700 mb-4">
              Templates gratuitos: Uso pessoal e comercial permitido.<br/>
              Templates premium: Uso pessoal e comercial permitido após compra. Redistribuição proibida.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Privacidade e Proteção de Dados</h2>
            <p className="text-gray-700 mb-4">
              Sua privacidade é importante para nós. Nossa coleta e uso de informações pessoais é regida por nossa 
              Política de Privacidade, que está incorporada a estes Termos por referência.
            </p>
            <p className="text-gray-700">
              Ao usar o serviço, você concorda com a coleta e uso de informações de acordo com nossa Política de Privacidade.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitação de Responsabilidade</h2>
            <p className="text-gray-700 mb-4">
              O serviço é fornecido "como está" e "conforme disponível". Não garantimos que o serviço será 
              ininterrupto, seguro ou livre de erros.
            </p>
            <p className="text-gray-700 mb-4">
              Em nenhuma circunstância seremos responsáveis por danos indiretos, incidentais, especiais, 
              consequenciais ou punitivos resultantes do uso ou incapacidade de usar o serviço.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Disponibilidade do Serviço</h2>
            <p className="text-gray-700 mb-4">
              Nos esforçamos para manter o serviço disponível 24/7, mas não podemos garantir operação ininterrupta. 
              Podemos suspender temporariamente o serviço para manutenção ou atualizações.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Suspensão e Encerramento</h2>
            <p className="text-gray-700 mb-4">
              Podemos suspender ou encerrar sua conta e acesso ao serviço imediatamente, sem aviso prévio, 
              por qualquer motivo, incluindo violação destes Termos.
            </p>
            <p className="text-gray-700">
              Você pode encerrar sua conta a qualquer momento, cessando o uso do serviço.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Modificações dos Termos</h2>
            <p className="text-gray-700 mb-4">
              Reservamo-nos o direito de modificar estes Termos a qualquer momento. Notificaremos sobre mudanças 
              significativas através do serviço ou por email.
            </p>
            <p className="text-gray-700">
              O uso continuado do serviço após as modificações constitui aceitação dos novos Termos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Lei Aplicável</h2>
            <p className="text-gray-700">
              Estes Termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será 
              resolvida nos tribunais competentes do Brasil.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contato</h2>
            <p className="text-gray-700 mb-4">
              Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700"><strong>Email:</strong> suporte@cvgratisbuilder.com</p>
              <p className="text-gray-700"><strong>Termos:</strong> termos@cvgratisbuilder.com</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
} 
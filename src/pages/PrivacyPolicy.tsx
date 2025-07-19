import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Início
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de Privacidade</h1>
          <p className="text-gray-600">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introdução</h2>
            <p className="text-gray-700 mb-4">
              O CVGratis Online ("nós", "nosso" ou "aplicação") está comprometido em proteger a privacidade dos nossos usuários. 
              Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você 
              utiliza nosso serviço de criação de currículos online.
            </p>
            <p className="text-gray-700">
              Esta política está em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018) e 
              outras legislações aplicáveis de proteção de dados.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Informações que Coletamos</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">2.1 Informações Fornecidas Voluntariamente</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Dados pessoais para criação do currículo (nome, contato, experiência profissional, educação)</li>
              <li>Informações de pagamento para templates premium (processadas via Stripe)</li>
              <li>Preferências de formatação e personalização</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">2.2 Informações Coletadas Automaticamente</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Dados de uso da aplicação (páginas visitadas, tempo de sessão)</li>
              <li>Informações técnicas (endereço IP, tipo de navegador, sistema operacional)</li>
              <li>Cookies e tecnologias similares</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Como Utilizamos suas Informações</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Para fornecer e operar nossos serviços de criação de currículos</li>
              <li>Para processar pagamentos de templates premium</li>
              <li>Para personalizar sua experiência na aplicação</li>
              <li>Para gerar avaliações e sugestões de melhoria do currículo</li>
              <li>Para melhorar nossos serviços e desenvolver novos recursos</li>
              <li>Para comunicações técnicas e administrativas necessárias</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Armazenamento e Proteção de Dados</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">4.1 Armazenamento Local</h3>
            <p className="text-gray-700 mb-4">
              Seus dados de currículo são armazenados localmente no seu navegador (LocalStorage) para sua conveniência. 
              Estes dados permanecem no seu dispositivo e são controlados por você.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3">4.2 Segurança</h3>
            <p className="text-gray-700 mb-4">
              Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger suas informações 
              contra acesso não autorizado, alteração, divulgação ou destruição.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Compartilhamento de Informações</h2>
            <p className="text-gray-700 mb-4">
              Não vendemos, trocamos ou transferimos suas informações pessoais para terceiros, exceto nas seguintes situações:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Com seu consentimento explícito</li>
              <li>Para processamento de pagamentos (via Stripe, que possui suas próprias políticas de privacidade)</li>
              <li>Quando exigido por lei ou ordem judicial</li>
              <li>Para proteger nossos direitos legais ou segurança dos usuários</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Seus Direitos (LGPD)</h2>
            <p className="text-gray-700 mb-4">De acordo com a LGPD, você tem os seguintes direitos:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Acesso:</strong> Obter informações sobre como seus dados são tratados</li>
              <li><strong>Correção:</strong> Solicitar correção de dados incompletos ou incorretos</li>
              <li><strong>Exclusão:</strong> Solicitar a exclusão dos seus dados pessoais</li>
              <li><strong>Portabilidade:</strong> Solicitar a transferência dos seus dados</li>
              <li><strong>Revogação:</strong> Revogar o consentimento a qualquer momento</li>
              <li><strong>Informação:</strong> Obter informações sobre compartilhamento de dados</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Para exercer esses direitos, entre em contato conosco através do email: <strong>contato@compg.com.br</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies e Tecnologias Similares</h2>
            <p className="text-gray-700 mb-4">
              Utilizamos cookies e tecnologias similares para melhorar sua experiência. Você pode gerenciar suas 
              preferências de cookies através das configurações do seu navegador.
            </p>
            <p className="text-gray-700">
              Para mais informações, consulte nossa <strong>Política de Cookies</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Menores de Idade</h2>
            <p className="text-gray-700">
              Nossos serviços não são destinados a menores de 18 anos. Não coletamos intencionalmente informações 
              pessoais de menores. Se tomarmos conhecimento de que coletamos dados de um menor, tomaremos medidas 
              para excluir essas informações.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Alterações nesta Política</h2>
            <p className="text-gray-700">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre mudanças significativas 
              através da aplicação ou por email. O uso continuado dos nossos serviços após as alterações constitui 
              aceitação da nova política.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contato</h2>
            <p className="text-gray-700 mb-4">
              Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer seus direitos, entre em contato:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700"><strong>Empresa:</strong> Produções ComPG</p>
              <p className="text-gray-700"><strong>Localização:</strong> Minas Gerais, MG</p>
              <p className="text-gray-700"><strong>Telefone:</strong> +55 (31) 97105-2200</p>
              <p className="text-gray-700"><strong>Email:</strong> contato@compg.com.br</p>
              <p className="text-gray-700"><strong>Encarregado de Dados:</strong> DPO - Produções ComPG</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
} 
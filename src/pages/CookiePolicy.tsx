import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CookiePolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Início
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de Cookies</h1>
          <p className="text-gray-600">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. O que são Cookies?</h2>
            <p className="text-gray-700 mb-4">
              Cookies são pequenos arquivos de texto que são armazenados no seu dispositivo (computador, tablet ou celular) 
              quando você visita nosso site. Eles nos ajudam a fornecer uma melhor experiência de usuário e entender como 
              nosso site é utilizado.
            </p>
            <p className="text-gray-700">
              Esta política explica como o CV Grátis Builder utiliza cookies e tecnologias similares.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Como Utilizamos Cookies</h2>
            <p className="text-gray-700 mb-4">Utilizamos cookies para:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Manter você logado durante sua sessão</li>
              <li>Lembrar suas preferências e configurações</li>
              <li>Salvar o progresso do seu currículo</li>
              <li>Analisar como nosso site é usado</li>
              <li>Melhorar nossos serviços</li>
              <li>Personalizar sua experiência</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Tipos de Cookies que Utilizamos</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">3.1 Cookies Essenciais</h3>
            <p className="text-gray-700 mb-4">
              <strong>Obrigatórios</strong> - Estes cookies são necessários para o funcionamento básico do site.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-blue-800"><strong>Exemplos:</strong></p>
              <ul className="text-sm text-blue-700 mt-2">
                <li>• Manter sessão do usuário</li>
                <li>• Lembrar dados do currículo durante a criação</li>
                <li>• Configurações de segurança</li>
              </ul>
            </div>

            <h3 className="text-xl font-medium text-gray-800 mb-3">3.2 Cookies de Funcionalidade</h3>
            <p className="text-gray-700 mb-4">
              <strong>Opcionais</strong> - Melhoram a experiência do usuário.
            </p>
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-green-800"><strong>Exemplos:</strong></p>
              <ul className="text-sm text-green-700 mt-2">
                <li>• Preferências de idioma</li>
                <li>• Configurações de formatação</li>
                <li>• Templates favoritos</li>
              </ul>
            </div>

            <h3 className="text-xl font-medium text-gray-800 mb-3">3.3 Cookies de Performance</h3>
            <p className="text-gray-700 mb-4">
              <strong>Opcionais</strong> - Coletam informações sobre como o site é usado.
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-yellow-800"><strong>Exemplos:</strong></p>
              <ul className="text-sm text-yellow-700 mt-2">
                <li>• Google Analytics</li>
                <li>• Tempo de carregamento de páginas</li>
                <li>• Páginas mais visitadas</li>
              </ul>
            </div>

            <h3 className="text-xl font-medium text-gray-800 mb-3">3.4 Cookies de Marketing</h3>
            <p className="text-gray-700 mb-4">
              <strong>Opcionais</strong> - Usados para personalizar anúncios e medir eficácia.
            </p>
            <div className="bg-purple-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-purple-800"><strong>Exemplos:</strong></p>
              <ul className="text-sm text-purple-700 mt-2">
                <li>• Facebook Pixel</li>
                <li>• Google Ads</li>
                <li>• Remarketing</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. LocalStorage e SessionStorage</h2>
            <p className="text-gray-700 mb-4">
              Além dos cookies, utilizamos tecnologias de armazenamento local:
            </p>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">4.1 LocalStorage</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Armazena dados do seu currículo localmente</li>
              <li>Mantém informações mesmo após fechar o navegador</li>
              <li>Informações de templates premium adquiridos</li>
              <li>Preferências de formatação</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">4.2 SessionStorage</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Dados temporários da sessão atual</li>
              <li>Progresso do formulário em andamento</li>
              <li>Configurações temporárias</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookies de Terceiros</h2>
            <p className="text-gray-700 mb-4">Utilizamos serviços de terceiros que podem definir cookies:</p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-3 text-left">Serviço</th>
                    <th className="border border-gray-300 p-3 text-left">Finalidade</th>
                    <th className="border border-gray-300 p-3 text-left">Mais Informações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-3">Google Analytics</td>
                    <td className="border border-gray-300 p-3">Análise de uso do site</td>
                    <td className="border border-gray-300 p-3">
                      <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        Política do Google
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3">Stripe</td>
                    <td className="border border-gray-300 p-3">Processamento de pagamentos</td>
                    <td className="border border-gray-300 p-3">
                      <a href="https://stripe.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        Política do Stripe
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3">EmailJS</td>
                    <td className="border border-gray-300 p-3">Envio de emails</td>
                    <td className="border border-gray-300 p-3">
                      <a href="https://www.emailjs.com/legal/privacy-policy/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        Política do EmailJS
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Gerenciamento de Cookies</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">6.1 Configurações do Navegador</h3>
            <p className="text-gray-700 mb-4">
              Você pode controlar cookies através das configurações do seu navegador:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Chrome:</strong> Configurações → Privacidade e segurança → Cookies</li>
              <li><strong>Firefox:</strong> Configurações → Privacidade e Segurança → Cookies</li>
              <li><strong>Safari:</strong> Preferências → Privacidade → Cookies</li>
              <li><strong>Edge:</strong> Configurações → Cookies e permissões do site</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">6.2 Nossas Configurações</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 font-medium mb-2">Gerencie suas preferências de cookies:</p>
              <div className="space-y-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mr-2">
                  ⚙️ Configurar Cookies
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 mr-2">
                  ✅ Aceitar Todos
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                  ❌ Recusar Opcionais
                </button>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Duração dos Cookies</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Cookies de Sessão</h4>
                <p className="text-sm text-gray-600">Expiram quando você fecha o navegador</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Cookies Persistentes</h4>
                <p className="text-sm text-gray-600">Permanecem por até 2 anos ou até serem excluídos</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Impacto de Desabilitar Cookies</h2>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-amber-800 font-medium mb-2">⚠️ Atenção:</p>
              <p className="text-amber-700 text-sm">
                Desabilitar cookies essenciais pode impactar negativamente sua experiência, incluindo:
              </p>
              <ul className="text-amber-700 text-sm mt-2 space-y-1">
                <li>• Perda de dados do currículo em progresso</li>
                <li>• Necessidade de refazer configurações</li>
                <li>• Problemas no processo de pagamento</li>
                <li>• Funcionalidades limitadas do editor</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Atualizações desta Política</h2>
            <p className="text-gray-700 mb-4">
              Esta Política de Cookies pode ser atualizada periodicamente para refletir mudanças em nossas práticas 
              ou por motivos operacionais, legais ou regulamentares.
            </p>
            <p className="text-gray-700">
              Recomendamos revisar esta página regularmente para se manter informado sobre como utilizamos cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contato</h2>
            <p className="text-gray-700 mb-4">
              Se você tiver dúvidas sobre nossa Política de Cookies, entre em contato:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700"><strong>Email:</strong> cookies@cvgratisbuilder.com</p>
              <p className="text-gray-700"><strong>Privacidade:</strong> privacidade@cvgratisbuilder.com</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
} 
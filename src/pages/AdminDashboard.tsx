import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { ShieldCheck, LogOut, Eye, CreditCard, Crown, CheckCircle2 } from 'lucide-react';
import { AVAILABLE_TEMPLATES } from '@/types/templates';

export default function AdminDashboard() {
  const { isAdmin, logout } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const handleLogout = () => {
    // Limpar flags administrativas
    localStorage.removeItem('admin-mode-enabled');
    localStorage.removeItem('admin-viewing-premium');
    logout();
    navigate('/');
  };

  const handleViewTemplate = (templateId: string) => {
    // 👑 CRÍTICO: Marcar modo administrativo (usado pelo PremiumEditor)
    localStorage.setItem('admin-mode-enabled', 'true');
    localStorage.setItem('admin-viewing-premium', 'true');

    // Salvar template selecionado diretamente no localStorage
    const template = AVAILABLE_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    localStorage.setItem('selected-template-id', templateId);

    if (template.isPremium) {
      // Template PREMIUM: Vai para página de configuração premium
      localStorage.setItem('selected-premium-template', JSON.stringify(template));
      localStorage.setItem('is-premium-session', 'true');
      localStorage.setItem(`premium_access_${templateId}`, 'true');
      localStorage.setItem(`template_purchased_${templateId}`, 'true');

      console.log('👑 ADMIN: Modo admin ativado + Redirecionando para:', template.name);
      navigate(`/premium-editor?template=${templateId}`);
    } else {
      // Template GRATUITO: Vai para visualização no template-selector
      console.log('👑 ADMIN: Redirecionando para visualização gratuita:', template.name);
      navigate('/template-selector');
    }
  };

  const premiumTemplates = AVAILABLE_TEMPLATES.filter(t => t.isPremium);
  const freeTemplates = AVAILABLE_TEMPLATES.filter(t => !t.isPremium);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-sm text-gray-600">CVGrátis - Acesso Total</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Info Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-start gap-4">
            <Crown className="w-8 h-8 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold mb-2">Acesso Administrativo Ativo</h2>
              <p className="text-indigo-100">
                Você pode visualizar e testar todos os templates premium sem necessidade de pagamento.
                Clique em "Visualizar" para testar qualquer template com os dados do currículo.
              </p>
            </div>
          </div>
        </div>

        {/* Premium Templates */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Crown className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Templates Premium ({premiumTemplates.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-purple-200 overflow-hidden"
              >
                {/* Template Preview */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="absolute top-3 right-3 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    PREMIUM
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-2">👔</div>
                    <p className="text-gray-600 font-medium">{template.name}</p>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {template.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-purple-600" />
                      <span className="text-lg font-bold text-purple-600">
                        R$ {(template.price || 4.90).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Liberado
                    </div>
                  </div>

                  <Button
                    onClick={() => handleViewTemplate(template.id)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Visualizar Template
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Free Templates */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Templates Gratuitos ({freeTemplates.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freeTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 overflow-hidden"
              >
                {/* Template Preview */}
                <div className="relative h-48 bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                  <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    GRÁTIS
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-2">📄</div>
                    <p className="text-gray-600 font-medium">{template.name}</p>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {template.description}
                  </p>

                  <div className="flex items-center gap-2 mb-4 text-green-600 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sempre gratuito</span>
                  </div>

                  <Button
                    onClick={() => handleViewTemplate(template.id)}
                    variant="outline"
                    className="w-full"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Visualizar Template
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

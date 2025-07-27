import React, { Suspense } from 'react';
import { Router, Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import CookieConsent from '@/components/CookieConsent';
import FloatingLiveCounter from '@/components/FloatingLiveCounter';
import { LoadingProvider, LoadingSystemCSS } from '@/components/ui/loading-system';
import { Loader2 } from 'lucide-react';
import './App.css';
import '@/styles/mobile-optimizations.css';

// 📦 CODE SPLITTING: Páginas carregadas apenas quando acessadas
const Index = React.lazy(() => import('@/pages/Index'));
const CreateResume = React.lazy(() => import('@/pages/CreateResume'));
const TemplateSelector = React.lazy(() => import('@/pages/TemplateSelector'));
const PremiumEditor = React.lazy(() => import('@/pages/PremiumEditor'));
const PrivacyPolicy = React.lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('@/pages/TermsOfService'));
const CookiePolicy = React.lazy(() => import('@/pages/CookiePolicy'));
const AdminPanel = React.lazy(() => import('@/pages/AdminPanel'));
const ApiTestPanel = React.lazy(() => import('@/components/ApiTestPanel'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

// 🎨 LOADING: Componente de loading global otimizado
const PageLoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center space-y-4">
      <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600" />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">Carregando página...</h3>
        <p className="text-sm text-gray-600">Aguarde um momento</p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <LoadingProvider>
      <LoadingSystemCSS />
        <div className="min-h-screen bg-gray-50">
          {/* 📦 SUSPENSE: Loading state para todas as rotas */}
          <Suspense fallback={<PageLoadingSpinner />}>
            <Switch>
              <Route path="/" component={Index} />
              <Route path="/criar-curriculo" component={CreateResume} />
              <Route path="/templates" component={TemplateSelector} />
              <Route path="/premium-editor" component={PremiumEditor} />
              <Route path="/politica-privacidade" component={PrivacyPolicy} />
              <Route path="/termos-uso" component={TermsOfService} />
              <Route path="/politica-cookies" component={CookiePolicy} />
              <Route path="/admin" component={AdminPanel} />
              <Route path="/test-apis" component={ApiTestPanel} />
              <Route component={NotFound} />
            </Switch>
          </Suspense>
          
          {/* 🎯 COMPONENTES GLOBAIS: Sempre carregados */}
          <Toaster />
          <CookieConsent />
          <FloatingLiveCounter />
        </div>
    </LoadingProvider>
  );
}

export default App;

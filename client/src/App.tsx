import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
      <Router>
        <div className="min-h-screen bg-gray-50">
          {/* 📦 SUSPENSE: Loading state para todas as rotas */}
          <Suspense fallback={<PageLoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/criar-curriculo" element={<CreateResume />} />
              <Route path="/templates" element={<TemplateSelector />} />
              <Route path="/premium-editor" element={<PremiumEditor />} />
              <Route path="/politica-privacidade" element={<PrivacyPolicy />} />
              <Route path="/termos-uso" element={<TermsOfService />} />
              <Route path="/politica-cookies" element={<CookiePolicy />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/test-apis" element={<ApiTestPanel />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          
          {/* 🎯 COMPONENTES GLOBAIS: Sempre carregados */}
          <Toaster />
          <CookieConsent />
          <FloatingLiveCounter />
        </div>
      </Router>
    </LoadingProvider>
  );
}

export default App;

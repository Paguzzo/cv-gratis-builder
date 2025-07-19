import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import CookieConsent from '@/components/CookieConsent';
import FloatingLiveCounter from '@/components/FloatingLiveCounter';
import Index from '@/pages/Index';
import CreateResume from '@/pages/CreateResume';
import TemplateSelector from '@/pages/TemplateSelector';
import PremiumEditor from '@/pages/PremiumEditor';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import CookiePolicy from '@/pages/CookiePolicy';
import AdminPanel from '@/pages/AdminPanel';
import ApiTestPanel from '@/components/ApiTestPanel';
import NotFound from '@/pages/NotFound';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
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
        <Toaster />
        <CookieConsent />
        <FloatingLiveCounter />
      </div>
    </Router>
  );
}

export default App;

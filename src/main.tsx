import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/mobile-optimizations.css'

// 🔧 Inicializar Supabase
import './lib/supabase';

createRoot(document.getElementById("root")!).render(<App />);

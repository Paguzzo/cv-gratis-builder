// 🔧 CONFIGURAÇÃO DO SUPABASE
// Cliente Supabase para integração com Resend

import { createClient } from '@supabase/supabase-js';

// 📋 Configurações do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase não configurado. Verifique as variáveis de ambiente.');
}

// 🚀 Criar cliente Supabase
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// 🌐 Disponibilizar globalmente para compatibilidade
if (typeof window !== 'undefined' && supabase) {
  (window as any).supabase = supabase;
} else if (typeof window !== 'undefined') {
  console.warn('❌ Supabase não pôde ser inicializado - verifique as variáveis de ambiente');
}

// 🔧 Função para verificar se o Supabase está configurado
export const isSupabaseConfigured = (): boolean => {
  return !!supabase;
};

// 📊 Função para obter informações de configuração
export const getSupabaseConfig = () => {
  return {
    configured: !!supabase,
    url: supabaseUrl ? '✅ Configurada' : '❌ Não configurada',
    anonKey: supabaseAnonKey ? '✅ Configurada' : '❌ Não configurada',
    client: supabase ? '✅ Inicializado' : '❌ Não inicializado'
  };
};

export default supabase;
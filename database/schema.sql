-- Schema para CV Grátis Builder
-- Execute este script no Neon Database Console

-- Tabela de usuários (para autenticação futura)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Tabela de coleta de dados de usuários (leads)
CREATE TABLE IF NOT EXISTS user_data_collection (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  action_type TEXT NOT NULL, -- 'download', 'email', 'print', 'premium'
  template_type TEXT NOT NULL, -- 'free', 'premium'
  template_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Tabela de currículos salvos
CREATE TABLE IF NOT EXISTS curriculums (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  personal_info JSONB,
  professional_objective TEXT,
  education JSONB, -- Array de entradas de educação
  experience JSONB, -- Array de entradas de experiência
  skills TEXT[],
  languages JSONB, -- Array de idiomas
  courses JSONB, -- Array de cursos
  projects JSONB, -- Array de projetos
  selected_template_id TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Tabela de compras premium
CREATE TABLE IF NOT EXISTS premium_purchases (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  template_id TEXT NOT NULL,
  stripe_payment_id TEXT,
  amount INTEGER, -- em centavos
  currency TEXT DEFAULT 'BRL',
  status TEXT NOT NULL, -- 'pending', 'completed', 'failed'
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_data_email ON user_data_collection(email);
CREATE INDEX IF NOT EXISTS idx_premium_purchases_email ON premium_purchases(email);
CREATE INDEX IF NOT EXISTS idx_premium_purchases_template ON premium_purchases(template_id);
CREATE INDEX IF NOT EXISTS idx_curriculums_user ON curriculums(user_id);

-- Função para atualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at em curriculums
DROP TRIGGER IF EXISTS update_curriculums_updated_at ON curriculums;
CREATE TRIGGER update_curriculums_updated_at
  BEFORE UPDATE ON curriculums
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

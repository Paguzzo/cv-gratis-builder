-- ==========================================
-- SETUP COMPLETO SUPABASE PARA VALIDAÇÃO PREMIUM
-- ==========================================

-- 1. CRIAR TABELA DE PURCHASES
-- ==========================================
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  template_id TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'BRL' NOT NULL,
  status TEXT DEFAULT 'completed' NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE, -- NULL = vitalício
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  metadata JSONB DEFAULT '{}', -- Dados adicionais (nome template, etc)

  -- Constraints
  CONSTRAINT unique_user_template UNIQUE(user_email, template_id),
  CONSTRAINT valid_email CHECK (user_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_amount CHECK (amount > 0)
);

-- 2. CRIAR ÍNDICES PARA PERFORMANCE
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_purchases_email ON purchases(user_email);
CREATE INDEX IF NOT EXISTS idx_purchases_template ON purchases(template_id);
CREATE INDEX IF NOT EXISTS idx_purchases_stripe_session ON purchases(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(status);
CREATE INDEX IF NOT EXISTS idx_purchases_created_at ON purchases(created_at DESC);

-- Índice composto para consultas comuns
CREATE INDEX IF NOT EXISTS idx_purchases_email_template_status
  ON purchases(user_email, template_id, status);

-- 3. CRIAR FUNÇÃO PARA ATUALIZAR updated_at AUTOMATICAMENTE
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS set_updated_at ON purchases;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON purchases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. CRIAR FUNÇÃO PARA VERIFICAR ACESSO PREMIUM
-- ==========================================
CREATE OR REPLACE FUNCTION check_premium_access(
  p_user_email TEXT,
  p_template_id TEXT
)
RETURNS TABLE(
  has_access BOOLEAN,
  expires_at TIMESTAMP WITH TIME ZONE,
  purchase_id UUID,
  purchased_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (p.status = 'completed' AND (p.expires_at IS NULL OR p.expires_at > NOW())) AS has_access,
    p.expires_at,
    p.id AS purchase_id,
    p.created_at AS purchased_at
  FROM purchases p
  WHERE
    p.user_email = p_user_email
    AND p.template_id = p_template_id
  ORDER BY p.created_at DESC
  LIMIT 1;

  -- Se não encontrou compra, retornar FALSE
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::TIMESTAMP WITH TIME ZONE, NULL::UUID, NULL::TIMESTAMP WITH TIME ZONE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Habilitar RLS na tabela
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem VER apenas suas próprias compras
CREATE POLICY "Users can view own purchases"
  ON purchases
  FOR SELECT
  USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Policy: Apenas service_role pode INSERIR (backend via webhook)
CREATE POLICY "Service role can insert purchases"
  ON purchases
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Policy: Apenas service_role pode ATUALIZAR
CREATE POLICY "Service role can update purchases"
  ON purchases
  FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Policy: Apenas service_role pode DELETAR (soft delete recomendado)
CREATE POLICY "Service role can delete purchases"
  ON purchases
  FOR DELETE
  USING (auth.role() = 'service_role');

-- 6. CRIAR VIEW PARA ESTATÍSTICAS (OPCIONAL)
-- ==========================================
CREATE OR REPLACE VIEW purchase_statistics AS
SELECT
  template_id,
  COUNT(*) AS total_purchases,
  COUNT(DISTINCT user_email) AS unique_users,
  SUM(amount) AS total_revenue,
  AVG(amount) AS avg_amount,
  MIN(created_at) AS first_purchase,
  MAX(created_at) AS last_purchase
FROM purchases
WHERE status = 'completed'
GROUP BY template_id;

-- 7. DADOS DE EXEMPLO PARA DESENVOLVIMENTO (OPCIONAL)
-- ==========================================
-- Descomentar para adicionar dados de teste
/*
INSERT INTO purchases (user_email, template_id, stripe_session_id, amount, currency, status, metadata)
VALUES
  ('test@example.com', 'premium-executive', 'cs_test_12345', 4.90, 'BRL', 'completed', '{"template_name": "Executive Premium"}'),
  ('test@example.com', 'premium-tech', 'cs_test_67890', 4.90, 'BRL', 'completed', '{"template_name": "Tech Premium"}'),
  ('user2@example.com', 'premium-creative', 'cs_test_54321', 4.90, 'BRL', 'completed', '{"template_name": "Creative Premium"}');
*/

-- 8. COMENTÁRIOS PARA DOCUMENTAÇÃO
-- ==========================================
COMMENT ON TABLE purchases IS 'Armazena todas as compras de templates premium com validação server-side';
COMMENT ON COLUMN purchases.user_email IS 'Email do usuário que comprou (sem autenticação, identificação por email)';
COMMENT ON COLUMN purchases.template_id IS 'ID do template comprado (ex: premium-executive)';
COMMENT ON COLUMN purchases.stripe_session_id IS 'ID da sessão Stripe para rastreamento';
COMMENT ON COLUMN purchases.expires_at IS 'Data de expiração do acesso (NULL = vitalício)';
COMMENT ON COLUMN purchases.metadata IS 'Dados adicionais em JSON (nome template, informações extras)';

-- ==========================================
-- FIM DO SETUP
-- ==========================================
-- Para executar este script:
-- 1. Acesse o Supabase Dashboard
-- 2. Vá em SQL Editor
-- 3. Cole e execute este script
-- 4. Verifique se a tabela foi criada com sucesso
-- ==========================================

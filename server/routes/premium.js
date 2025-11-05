/**
 * ROTAS DE VALIDAÇÃO PREMIUM - SERVER-SIDE
 *
 * Endpoints seguros para verificar e gerenciar acesso a templates premium
 */

const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const { createClient } = require('@supabase/supabase-js');

// Configuração Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Service key, não anon key!

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ AVISO: Supabase não configurado para validação premium!');
}

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// ==========================================
// GET /api/premium/check/:templateId
// Verifica se um email tem acesso a um template premium
// ==========================================
router.get('/check/:templateId', [
  param('templateId').isString().notEmpty().withMessage('Template ID inválido'),
  query('email').isEmail().withMessage('Email inválido'),
], async (req, res) => {
  try {
    // Validar entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        hasAccess: false,
        errors: errors.array()
      });
    }

    const { templateId } = req.params;
    const { email } = req.query;

    // Verificar se Supabase está configurado
    if (!supabase) {
      console.error('❌ Supabase não configurado');
      return res.status(500).json({
        success: false,
        hasAccess: false,
        error: 'Serviço de validação não disponível'
      });
    }

    // Buscar compra no Supabase usando a função SQL
    const { data, error } = await supabase
      .rpc('check_premium_access', {
        p_user_email: email.toLowerCase(),
        p_template_id: templateId
      });

    if (error) {
      console.error('❌ Erro ao verificar acesso:', error);
      return res.status(500).json({
        success: false,
        hasAccess: false,
        error: 'Erro ao verificar acesso premium'
      });
    }

    // Se não encontrou ou acesso expirado
    if (!data || data.length === 0) {
      return res.json({
        success: true,
        hasAccess: false,
        message: 'Nenhuma compra encontrada para este template'
      });
    }

    const accessInfo = data[0];

    // Retornar informações de acesso
    return res.json({
      success: true,
      hasAccess: accessInfo.has_access,
      expiresAt: accessInfo.expires_at,
      purchaseId: accessInfo.purchase_id,
      purchasedAt: accessInfo.purchased_at
    });

  } catch (error) {
    console.error('❌ Erro no endpoint /check:', error);
    return res.status(500).json({
      success: false,
      hasAccess: false,
      error: 'Erro interno do servidor'
    });
  }
});

// ==========================================
// POST /api/premium/grant
// Concede acesso premium (chamado após pagamento confirmado)
// ==========================================
router.post('/grant', [
  body('email').isEmail().withMessage('Email inválido'),
  body('templateId').isString().notEmpty().withMessage('Template ID inválido'),
  body('stripeSessionId').optional().isString().withMessage('Stripe Session ID inválido'),
  body('amount').isFloat({ min: 0 }).withMessage('Valor inválido'),
  body('currency').optional().isString().isLength({ min: 3, max: 3 }).withMessage('Moeda inválida'),
], async (req, res) => {
  try {
    // Validar entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, templateId, stripeSessionId, amount, currency = 'BRL', metadata = {} } = req.body;

    // Verificar se Supabase está configurado
    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: 'Serviço de validação não disponível'
      });
    }

    // Inserir compra no Supabase
    const { data, error } = await supabase
      .from('purchases')
      .insert({
        user_email: email.toLowerCase(),
        template_id: templateId,
        stripe_session_id: stripeSessionId,
        amount: amount,
        currency: currency,
        status: 'completed',
        expires_at: null, // Vitalício por padrão
        metadata: {
          ...metadata,
          granted_at: new Date().toISOString(),
          granted_by: 'stripe_webhook'
        }
      })
      .select()
      .single();

    if (error) {
      // Se for erro de duplicate key, considerar sucesso (compra já existe)
      if (error.code === '23505') { // Postgres unique violation
        console.log('ℹ️ Compra já existe para este email/template');
        return res.json({
          success: true,
          message: 'Acesso premium já concedido anteriormente',
          alreadyExists: true
        });
      }

      console.error('❌ Erro ao conceder acesso:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro ao conceder acesso premium'
      });
    }

    console.log(`✅ Acesso premium concedido: ${email} -> ${templateId}`);

    return res.json({
      success: true,
      message: 'Acesso premium concedido com sucesso',
      purchaseId: data.id,
      expiresAt: data.expires_at
    });

  } catch (error) {
    console.error('❌ Erro no endpoint /grant:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// ==========================================
// GET /api/premium/purchases
// Lista todas as compras de um usuário
// ==========================================
router.get('/purchases', [
  query('email').isEmail().withMessage('Email inválido'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email } = req.query;

    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: 'Serviço de validação não disponível'
      });
    }

    // Buscar todas as compras do usuário
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_email', email.toLowerCase())
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erro ao buscar compras:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro ao buscar compras'
      });
    }

    // Filtrar apenas compras ativas (não expiradas)
    const activePurchases = data.filter(purchase => {
      return !purchase.expires_at || new Date(purchase.expires_at) > new Date();
    });

    return res.json({
      success: true,
      purchases: activePurchases,
      total: activePurchases.length
    });

  } catch (error) {
    console.error('❌ Erro no endpoint /purchases:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// ==========================================
// POST /api/premium/revoke
// Revoga acesso premium (admin only)
// ==========================================
router.post('/revoke', [
  body('email').isEmail().withMessage('Email inválido'),
  body('templateId').isString().notEmpty().withMessage('Template ID inválido'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, templateId } = req.body;

    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: 'Serviço de validação não disponível'
      });
    }

    // Atualizar status para 'refunded'
    const { data, error } = await supabase
      .from('purchases')
      .update({ status: 'refunded' })
      .eq('user_email', email.toLowerCase())
      .eq('template_id', templateId)
      .select();

    if (error) {
      console.error('❌ Erro ao revogar acesso:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro ao revogar acesso'
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Compra não encontrada'
      });
    }

    console.log(`🔒 Acesso revogado: ${email} -> ${templateId}`);

    return res.json({
      success: true,
      message: 'Acesso premium revogado com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro no endpoint /revoke:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;

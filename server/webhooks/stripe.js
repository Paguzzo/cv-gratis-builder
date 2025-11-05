/**
 * WEBHOOK HANDLER DO STRIPE
 *
 * Recebe eventos do Stripe e salva compras no Supabase
 * IMPORTANTE: Este endpoint deve ser configurado no Stripe Dashboard
 */

const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Configuração Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Configuração Stripe
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = process.env.STRIPE_SECRET_KEY
  ? require('stripe')(process.env.STRIPE_SECRET_KEY)
  : null;

// ==========================================
// POST /api/webhooks/stripe
// Recebe eventos do Stripe webhook
// ==========================================
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verificar assinatura do webhook
    if (!stripe || !STRIPE_WEBHOOK_SECRET) {
      console.error('❌ Stripe não configurado');
      return res.status(500).json({ error: 'Stripe não configurado' });
    }

    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('❌ Erro na verificação de assinatura do webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Log do evento recebido
  console.log('📨 Webhook recebido:', event.type, event.id);

  // Processar evento
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'checkout.session.async_payment_succeeded':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object);
        break;

      default:
        console.log(`ℹ️ Evento não tratado: ${event.type}`);
    }

    // Retornar sucesso ao Stripe
    res.json({ received: true });

  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
    res.status(500).json({ error: 'Erro ao processar webhook' });
  }
});

// ==========================================
// HANDLERS DE EVENTOS ESPECÍFICOS
// ==========================================

/**
 * Processa checkout session completado
 */
async function handleCheckoutSessionCompleted(session) {
  console.log('✅ Checkout session completado:', session.id);

  if (!supabase) {
    console.error('❌ Supabase não configurado');
    return;
  }

  try {
    // Extrair informações do session
    const {
      id: sessionId,
      customer_email,
      amount_total,
      currency,
      metadata
    } = session;

    // Metadata deve conter templateId e templateName
    const templateId = metadata?.templateId || metadata?.template_id;
    const templateName = metadata?.templateName || metadata?.template_name || 'Template Premium';

    if (!customer_email || !templateId) {
      console.error('❌ Email ou template ID não encontrado no metadata');
      return;
    }

    // Converter amount_total (em centavos) para valor decimal
    const amount = amount_total / 100;

    // Inserir compra no Supabase
    const { data, error } = await supabase
      .from('purchases')
      .insert({
        user_email: customer_email.toLowerCase(),
        template_id: templateId,
        stripe_session_id: sessionId,
        amount: amount,
        currency: currency.toUpperCase(),
        status: 'completed',
        expires_at: null, // Vitalício
        metadata: {
          template_name: templateName,
          stripe_session_id: sessionId,
          completed_at: new Date().toISOString(),
          source: 'stripe_webhook'
        }
      })
      .select()
      .single();

    if (error) {
      // Se já existe, apenas logar
      if (error.code === '23505') {
        console.log('ℹ️ Compra já registrada:', customer_email, templateId);
        return;
      }

      console.error('❌ Erro ao salvar compra:', error);
      throw error;
    }

    console.log(`✅ Compra registrada com sucesso: ${customer_email} -> ${templateId}`);
    console.log(`💰 Valor: ${currency.toUpperCase()} ${amount.toFixed(2)}`);

  } catch (error) {
    console.error('❌ Erro ao processar checkout session:', error);
    throw error;
  }
}

/**
 * Processa pagamento intent bem-sucedido
 */
async function handlePaymentIntentSucceeded(paymentIntent) {
  console.log('✅ Payment intent succeeded:', paymentIntent.id);

  // Similar ao checkout session, mas com estrutura diferente
  // Implementar se necessário
}

/**
 * Processa reembolso
 */
async function handleChargeRefunded(charge) {
  console.log('🔄 Charge refunded:', charge.id);

  if (!supabase) {
    console.error('❌ Supabase não configurado');
    return;
  }

  try {
    // Buscar purchase pelo stripe_session_id (se disponível)
    // E atualizar status para 'refunded'
    const { error } = await supabase
      .from('purchases')
      .update({ status: 'refunded' })
      .eq('stripe_session_id', charge.payment_intent);

    if (error) {
      console.error('❌ Erro ao atualizar status de reembolso:', error);
      throw error;
    }

    console.log('✅ Status atualizado para refunded');

  } catch (error) {
    console.error('❌ Erro ao processar reembolso:', error);
    throw error;
  }
}

// ==========================================
// ROTA DE TESTE (REMOVER EM PRODUÇÃO)
// ==========================================
router.post('/stripe/test', async (req, res) => {
  try {
    const { email, templateId } = req.body;

    if (!email || !templateId) {
      return res.status(400).json({
        error: 'Email e templateId são obrigatórios'
      });
    }

    // Simular checkout session completo
    await handleCheckoutSessionCompleted({
      id: `cs_test_${Date.now()}`,
      customer_email: email,
      amount_total: 490, // R$ 4,90
      currency: 'brl',
      metadata: {
        templateId: templateId,
        templateName: 'Template Premium (Test)'
      }
    });

    res.json({
      success: true,
      message: 'Compra de teste registrada com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro no teste:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

#!/usr/bin/env node

/**
 * 🔒 BACKEND SEGURO PARA CV GRÁTIS BUILDER
 *
 * Este servidor Node.js fornece endpoints seguros para:
 * - Envio de emails (Resend API)
 * - IA (GROK, OpenAI)
 * - Pagamentos (Stripe)
 * - Autenticação admin (JWT)
 *
 * IMPORTANTE: Todas as chaves de API ficam APENAS no servidor
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

// Importar middlewares e controllers
const authMiddleware = require('./middleware/auth');
const adminController = require('./controllers/adminController');

// Importar rotas
const premiumRoutes = require('./routes/premium');
const stripeWebhook = require('./webhooks/stripe');

const app = express();
const PORT = process.env.PORT || 3001;

// 🛡️ MIDDLEWARES DE SEGURANÇA
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 🚦 RATE LIMITING
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    error: 'Muitas requisições. Tente novamente em 15 minutos.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas de login por IP
  message: {
    error: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  },
});

app.use('/api/secure', apiLimiter);
app.use('/api/secure/admin/login', authLimiter);

// 🚀 REGISTRAR ROTAS
app.use('/api/premium', premiumRoutes);
app.use('/api/webhooks', stripeWebhook);

// 🔐 CONFIGURAÇÕES SEGURAS
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2b$10$example-hash'; // bcrypt hash

// 📧 CONFIGURAÇÕES DE EMAIL
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'contato@curriculogratisonline.com';

// 🤖 CONFIGURAÇÕES DE IA
const GROK_API_KEY = process.env.GROK_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// 💳 CONFIGURAÇÕES DE PAGAMENTO
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// 🔒 MIDDLEWARE DE AUTENTICAÇÃO JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido ou expirado' });
    }
    req.user = user;
    next();
  });
}

// 🏥 HEALTH CHECK
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'CV Gratis Builder - Secure Backend'
  });
});

// 📧 ENDPOINT SEGURO PARA ENVIO DE EMAIL
app.post('/api/secure/send-email', [
  body('to').isEmail().withMessage('Email destinatário inválido'),
  body('subject').isLength({ min: 1, max: 200 }).withMessage('Assunto obrigatório'),
  body('html').isLength({ min: 1, max: 50000 }).withMessage('Conteúdo HTML obrigatório'),
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

    const { to, subject, html, from } = req.body;

    if (!RESEND_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Serviço de email não configurado'
      });
    }

    // Chamar API do Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: from || FROM_EMAIL,
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Resend API error: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();

    res.json({
      success: true,
      messageId: result.id,
    });

  } catch (error) {
    console.error('❌ Email sending error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    });
  }
});

// 🤖 ENDPOINT SEGURO PARA GROK AI
app.post('/api/secure/ai/grok', [
  body('prompt').isLength({ min: 1, max: 10000 }).withMessage('Prompt obrigatório'),
  body('maxTokens').optional().isInt({ min: 1, max: 4000 }).withMessage('Max tokens inválido'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { prompt, maxTokens = 2000 } = req.body;

    if (!GROK_API_KEY) {
      return res.status(500).json({
        error: 'Serviço GROK AI não configurado'
      });
    }

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.GROK_MODEL || 'grok-beta',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em RH e criação de currículos profissionais brasileiros. Sempre responda em português do Brasil de forma clara, profissional e objetiva.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`GROK API error: ${errorData.error?.message || response.statusText}`);
    }

    const result = await response.json();

    res.json({
      content: result.choices[0].message.content,
      usage: result.usage
    });

  } catch (error) {
    console.error('❌ GROK AI error:', error);
    res.status(500).json({
      error: error.message || 'Erro interno do servidor'
    });
  }
});

// 🧠 ENDPOINT SEGURO PARA OPENAI
app.post('/api/secure/ai/openai', [
  body('prompt').isLength({ min: 1, max: 10000 }).withMessage('Prompt obrigatório'),
  body('maxTokens').optional().isInt({ min: 1, max: 4000 }).withMessage('Max tokens inválido'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { prompt, maxTokens = 2000 } = req.body;

    if (!OPENAI_API_KEY) {
      return res.status(500).json({
        error: 'Serviço OpenAI não configurado'
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em RH e criação de currículos profissionais.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const result = await response.json();

    res.json({
      content: result.choices[0].message.content,
      usage: result.usage
    });

  } catch (error) {
    console.error('❌ OpenAI error:', error);
    res.status(500).json({
      error: error.message || 'Erro interno do servidor'
    });
  }
});

// 💳 ENDPOINT SEGURO PARA PAGAMENTOS
app.post('/api/secure/payments/create-intent', [
  body('amount').isInt({ min: 1 }).withMessage('Valor inválido'),
  body('currency').optional().isLength({ min: 3, max: 3 }).withMessage('Moeda inválida'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, currency = 'brl', metadata = {} } = req.body;

    if (!STRIPE_SECRET_KEY) {
      return res.status(500).json({
        error: 'Serviço de pagamento não configurado'
      });
    }

    // Aqui você integraria com a API do Stripe
    // Por segurança, não implementando aqui sem as dependências
    res.json({
      clientSecret: 'mock_payment_intent_client_secret',
      message: 'Stripe integration would be implemented here'
    });

  } catch (error) {
    console.error('❌ Payment error:', error);
    res.status(500).json({
      error: error.message || 'Erro interno do servidor'
    });
  }
});

// 🔑 ROTAS DE AUTENTICAÇÃO ADMIN
app.post('/api/secure/admin/login', adminController.loginValidation, adminController.login);
app.post('/api/secure/admin/verify', authMiddleware.authenticateToken, adminController.verifyAuth);
app.post('/api/secure/admin/refresh', adminController.refreshToken);
app.post('/api/secure/admin/logout', authMiddleware.authenticateToken, adminController.logout);
app.get('/api/secure/admin/me', authMiddleware.authenticateToken, adminController.getCurrentUser);

// ❌ TRATAMENTO DE ERROS
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Erro interno do servidor'
  });
});

// 404 HANDLER
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint não encontrado'
  });
});

// 🚀 INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log('🔒 Servidor seguro iniciado!');
  console.log(`📡 Porta: ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log('🛡️ Configurações de segurança ativas');

  // Verificar configurações críticas
  if (!JWT_SECRET || JWT_SECRET === 'your-super-secret-jwt-key-change-in-production') {
    console.warn('⚠️ AVISO: JWT_SECRET não configurado para produção!');
  }
  if (!RESEND_API_KEY) {
    console.warn('⚠️ AVISO: RESEND_API_KEY não configurado!');
  }
  if (!GROK_API_KEY) {
    console.warn('⚠️ AVISO: GROK_API_KEY não configurado!');
  }
});

module.exports = app;
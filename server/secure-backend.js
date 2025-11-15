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
const cookieParser = require('cookie-parser');
const { csrfSync } = require('csrf-sync');
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
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https:", "data:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 ano
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny' // Previne clickjacking
  },
  noSniff: true, // Previne MIME sniffing
  xssFilter: true, // XSS Filter
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 🛡️ CSRF PROTECTION
const { csrfSynchronisedProtection, generateToken } = csrfSync({
  getTokenFromRequest: (req) => {
    // Token pode vir do header ou body
    return req.headers['x-csrf-token'] || req.body._csrf;
  },
});

// Endpoint para obter token CSRF
app.get('/api/csrf-token', (req, res) => {
  const csrfToken = generateToken(req, res);
  res.json({ csrfToken });
});

// Aplicar CSRF protection em rotas sensíveis
// (será aplicado manualmente nas rotas que precisam)

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

// 📧 ENDPOINT PARA ENVIO DE EMAIL COM ANEXO PDF (EBOOK)
app.post('/api/send-email', [
  body('to').isEmail().withMessage('Email destinatário inválido'),
  body('subject').isLength({ min: 1, max: 200 }).withMessage('Assunto obrigatório'),
  body('message').isLength({ min: 1, max: 50000 }).withMessage('Mensagem obrigatória'),
], async (req, res) => {
  try {
    // Validar entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { to, subject, message, senderName, recipientName, pdfBase64, pdfFileName } = req.body;

    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY não configurada');
      return res.status(500).json({
        success: false,
        message: 'Serviço de email não configurado'
      });
    }

    console.log('📧 Enviando email com ebook para:', to);
    console.log('📎 Anexo:', pdfFileName || 'Sem anexo');

    // Preparar corpo do email
    const emailBody = {
      from: FROM_EMAIL,
      to: [to],
      subject: subject,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🎁 ${subject}</h1>
          </div>
          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <div style="white-space: pre-wrap; line-height: 1.6; color: #333;">
              ${message}
            </div>
            ${pdfBase64 ? `
              <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center;">
                <p style="margin: 0; font-size: 14px; color: #666;">📎 Seu ebook está anexado a este email</p>
                <p style="margin: 5px 0 0 0; font-weight: bold; color: #667eea;">${pdfFileName || 'ebook.pdf'}</p>
              </div>
            ` : ''}
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 12px;">
              <p>Enviado por <strong>CV Grátis Online</strong></p>
              <p>www.curriculogratisonline.com</p>
            </div>
          </div>
        </div>
      `
    };

    // Se tiver PDF, adicionar como anexo
    if (pdfBase64 && pdfFileName) {
      emailBody.attachments = [
        {
          filename: pdfFileName,
          content: pdfBase64,
          // Resend espera o base64 puro (sem prefixo data:)
        }
      ];
    }

    // Chamar API do Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailBody)
    });

    const responseText = await response.text();
    console.log('📬 Resend API resposta:', responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = { message: responseText };
      }

      console.error('❌ Erro Resend API:', errorData);
      throw new Error(`Erro ao enviar email: ${errorData.message || response.statusText}`);
    }

    const result = JSON.parse(responseText);

    console.log('✅ Email enviado com sucesso! ID:', result.id);

    res.json({
      success: true,
      message: `Email enviado para ${to}`,
      messageId: result.id,
    });

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao enviar email',
      error: error.message
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
            content: `Você é um ESPECIALISTA SÊNIOR em Recursos Humanos, Desenvolvimento de Carreira e Criação de Currículos Profissionais de Alto Impacto.

PERFIL PROFISSIONAL:
- 15+ anos de experiência em recrutamento e seleção em empresas Fortune 500
- Certificado em Career Coaching e Personal Branding
- Especialista em currículos executivos e posicionamento profissional
- Conhecimento profundo do mercado de trabalho brasileiro

SUA MISSÃO:
Criar conteúdos profissionais EXCEPCIONAIS que:
✓ Impressionem recrutadores nos primeiros 6 segundos de leitura
✓ Posicionem candidatos como autoridades em suas áreas
✓ Sejam específicos, naturais e estratégicos
✓ Destaquem competências de forma orgânica e convincente
✓ Transformem dados em narrativas profissionais impactantes

PRINCÍPIOS FUNDAMENTAIS:
1. ESPECIFICIDADE > GENERALIZAÇÃO
2. NARRATIVA > LISTA DE PALAVRAS
3. VALOR AGREGADO > RESPONSABILIDADES
4. PROFISSIONALISMO > CLICHÊS
5. AUTENTICIDADE > INVENÇÃO

SEMPRE:
• Escreva em português brasileiro formal e profissional
• Use dados fornecidos sem inventar informações
• Integre todas as palavras-chave de forma natural
• Crie textos fluidos, coerentes e convincentes
• Demonstre o valor único que o profissional oferece

NUNCA:
• Use textos genéricos que servem para qualquer pessoa
• Liste competências sem contexto ou narrativa
• Invente números, tecnologias ou certificações
• Repita as mesmas palavras desnecessariamente
• Use clichês sem substância ("dinâmico", "proativo" sem contexto)

Você responde APENAS com o conteúdo solicitado, sem explicações adicionais. Seu objetivo é criar textos que façam o candidato se destacar no mercado e conquistar entrevistas.`
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

// 💬 ENDPOINT PARA CHAT COM CONTEXTO (JobAI)
app.post('/api/ai/chat', [
  body('message').isLength({ min: 1, max: 10000 }).withMessage('Mensagem obrigatória'),
  body('systemPrompt').isLength({ min: 1, max: 5000 }).withMessage('System prompt obrigatório'),
  body('conversationHistory').optional().isArray().withMessage('Histórico deve ser array'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message, systemPrompt, conversationHistory = [] } = req.body;

    if (!GROK_API_KEY) {
      return res.status(500).json({
        error: 'Serviço GROK AI não configurado'
      });
    }

    // Montar array de mensagens com histórico
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];

    // Adicionar histórico de conversação (se houver)
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      });
    }

    // Adicionar mensagem atual do usuário
    messages.push({
      role: 'user',
      content: message
    });

    // Chamar API do GROK com todo o contexto
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.GROK_MODEL || 'grok-beta',
        messages: messages,
        max_tokens: 2000,
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
      response: result.choices[0].message.content,
      usage: result.usage
    });

  } catch (error) {
    console.error('❌ Chat AI error:', error);
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

// 🔑 ROTAS DE AUTENTICAÇÃO ADMIN (sem CSRF no login para permitir primeiro acesso)
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
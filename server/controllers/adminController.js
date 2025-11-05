/**
 * 🔐 CONTROLLER DE AUTENTICAÇÃO ADMIN
 *
 * Gerencia login, validação e operações administrativas.
 *
 * FUNCIONALIDADES:
 * - Login com credenciais
 * - Geração de JWT tokens
 * - Validação de tokens
 * - Refresh de tokens
 *
 * SEGURANÇA:
 * - Senhas com bcrypt (hash + salt)
 * - Tokens JWT com expiração
 * - Rate limiting protege contra brute force
 */

const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const { generateToken, verifyToken } = require('../middleware/auth');

// Configurações de ambiente
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@curriculogratisonline.com';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

// Se não houver hash, criar um padrão (INSEGURO - apenas para desenvolvimento)
const DEFAULT_PASSWORD_HASH = '$2b$10$rKjQZ5YQ9xGvH5k5mHqKDeG5vJ3Xq3Xq3Xq3Xq3Xq3Xq3Xq3Xq3X'; // "admin123"

/**
 * 🔑 Login Administrativo
 *
 * POST /api/secure/admin/login
 * Body: { username, password }
 * Returns: { success, token }
 */
const loginValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Nome de usuário deve ter entre 3 e 50 caracteres'),
  body('password')
    .isLength({ min: 6, max: 100 })
    .withMessage('Senha deve ter entre 6 e 100 caracteres')
];

async function login(req, res) {
  try {
    // Validar entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const { username, password } = req.body;

    // Verificar se credenciais foram configuradas
    if (!ADMIN_PASSWORD_HASH || ADMIN_PASSWORD_HASH === '$2b$10$example-hash') {
      console.error('⚠️ ADMIN_PASSWORD_HASH não configurado corretamente!');
      return res.status(500).json({
        success: false,
        error: 'Sistema de autenticação não configurado. Contate o administrador.'
      });
    }

    // Verificar username
    if (username !== ADMIN_USERNAME) {
      // Log de tentativa falhada (sem revelar se o usuário existe)
      console.warn(`🚨 Tentativa de login com usuário inválido: ${username} - IP: ${req.ip}`);

      // Delay artificial para dificultar brute force
      await new Promise(resolve => setTimeout(resolve, 2000));

      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      });
    }

    // Verificar senha com bcrypt
    const isPasswordValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

    if (!isPasswordValid) {
      console.warn(`🚨 Tentativa de login com senha inválida para usuário: ${username} - IP: ${req.ip}`);

      // Delay artificial para dificultar brute force
      await new Promise(resolve => setTimeout(resolve, 2000));

      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      });
    }

    // Login bem-sucedido - gerar token JWT
    const payload = {
      id: 'admin-001',
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      role: 'admin',
      permissions: ['*'] // Permissão total
    };

    const token = generateToken(payload, '24h');
    const refreshToken = generateToken(payload, '7d'); // Token de refresh válido por 7 dias

    console.log(`✅ Login admin bem-sucedido: ${username} - IP: ${req.ip}`);

    return res.status(200).json({
      success: true,
      token,
      refreshToken,
      user: {
        id: payload.id,
        username: payload.username,
        email: payload.email,
        role: payload.role,
        permissions: payload.permissions
      },
      expiresIn: 86400 // 24 horas em segundos
    });

  } catch (error) {
    console.error('❌ Erro no login admin:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno no servidor de autenticação'
    });
  }
}

/**
 * 🔐 Verificar Token
 *
 * POST /api/secure/admin/verify
 * Headers: Authorization: Bearer <token>
 * Returns: { valid, user }
 */
async function verifyAuth(req, res) {
  try {
    // O middleware authenticateToken já validou e adicionou req.user
    if (!req.user) {
      return res.status(401).json({
        valid: false,
        error: 'Token inválido ou expirado'
      });
    }

    return res.status(200).json({
      valid: true,
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email || ADMIN_EMAIL,
        role: req.user.role,
        permissions: req.user.permissions
      }
    });

  } catch (error) {
    console.error('❌ Erro ao verificar autenticação:', error);
    return res.status(500).json({
      valid: false,
      error: 'Erro interno no servidor'
    });
  }
}

/**
 * 🔄 Refresh Token
 *
 * POST /api/secure/admin/refresh
 * Body: { refreshToken }
 * Returns: { success, token }
 */
async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token não fornecido'
      });
    }

    // Verificar refresh token
    const decoded = await verifyToken(refreshToken);

    // Gerar novo access token
    const newToken = generateToken({
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role,
      permissions: decoded.permissions
    }, '24h');

    console.log(`🔄 Token renovado para usuário: ${decoded.username}`);

    return res.status(200).json({
      success: true,
      token: newToken,
      expiresIn: 86400
    });

  } catch (error) {
    console.error('❌ Erro ao renovar token:', error);
    return res.status(403).json({
      success: false,
      error: 'Refresh token inválido ou expirado'
    });
  }
}

/**
 * 🚪 Logout
 *
 * POST /api/secure/admin/logout
 * Headers: Authorization: Bearer <token>
 * Returns: { success }
 *
 * Nota: Com JWT stateless, logout é feito no cliente.
 * Este endpoint é mantido para logging e possível blacklist futura.
 */
async function logout(req, res) {
  try {
    if (req.user) {
      console.log(`👋 Logout admin: ${req.user.username} - IP: ${req.ip}`);
    }

    return res.status(200).json({
      success: true,
      message: 'Logout realizado com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro no logout:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao realizar logout'
    });
  }
}

/**
 * 📊 Obter informações do usuário autenticado
 *
 * GET /api/secure/admin/me
 * Headers: Authorization: Bearer <token>
 * Returns: { user }
 */
async function getCurrentUser(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Não autenticado'
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email || ADMIN_EMAIL,
        role: req.user.role,
        permissions: req.user.permissions
      }
    });

  } catch (error) {
    console.error('❌ Erro ao obter usuário atual:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno no servidor'
    });
  }
}

module.exports = {
  login,
  loginValidation,
  verifyAuth,
  refreshToken,
  logout,
  getCurrentUser
};

/**
 * 🔒 MIDDLEWARE DE AUTENTICAÇÃO JWT
 *
 * Este middleware valida tokens JWT em requisições protegidas.
 * Extrai informações do usuário e adiciona ao objeto de requisição.
 *
 * SEGURANÇA:
 * - Valida assinatura do token
 * - Verifica expiração
 * - Bloqueia requisições sem token válido
 */

const jwt = require('jsonwebtoken');

// Obter JWT secret do ambiente
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

/**
 * Middleware para verificar token JWT
 *
 * Uso:
 * app.get('/api/protected', authenticateToken, (req, res) => {
 *   // req.user contém os dados do token
 * });
 */
function authenticateToken(req, res, next) {
  try {
    // Extrair token do header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token de acesso não fornecido',
        code: 'NO_TOKEN'
      });
    }

    // Verificar e decodificar token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('❌ JWT verification failed:', err.message);

        // Identificar tipo de erro
        if (err.name === 'TokenExpiredError') {
          return res.status(403).json({
            success: false,
            error: 'Token expirado. Faça login novamente.',
            code: 'TOKEN_EXPIRED'
          });
        }

        if (err.name === 'JsonWebTokenError') {
          return res.status(403).json({
            success: false,
            error: 'Token inválido',
            code: 'INVALID_TOKEN'
          });
        }

        return res.status(403).json({
          success: false,
          error: 'Falha na autenticação',
          code: 'AUTH_FAILED'
        });
      }

      // Token válido - adicionar dados do usuário à requisição
      req.user = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
        permissions: decoded.permissions || []
      };

      // Continuar para próximo middleware/rota
      next();
    });
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno de autenticação',
      code: 'INTERNAL_ERROR'
    });
  }
}

/**
 * Middleware para verificar se usuário é admin
 * Deve ser usado APÓS authenticateToken
 */
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Autenticação necessária',
      code: 'NO_USER'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Acesso negado. Permissões de administrador necessárias.',
      code: 'NOT_ADMIN'
    });
  }

  next();
}

/**
 * Middleware para verificar permissão específica
 *
 * Uso:
 * app.get('/api/users', authenticateToken, requirePermission('users.read'), handler);
 */
function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Autenticação necessária',
        code: 'NO_USER'
      });
    }

    const hasPermission =
      req.user.permissions.includes('*') || // Admin total
      req.user.permissions.includes(permission);

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: `Permissão necessária: ${permission}`,
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
}

/**
 * Função auxiliar para gerar tokens JWT
 */
function generateToken(payload, expiresIn = '24h') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Função auxiliar para verificar token (assíncrona)
 */
function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
}

module.exports = {
  authenticateToken,
  requireAdmin,
  requirePermission,
  generateToken,
  verifyToken,
  JWT_SECRET
};

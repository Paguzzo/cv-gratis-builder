import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash } from 'crypto';
import { SignJWT } from 'jose';

// Simple password verification using SHA256 (for demo purposes)
// In production, use bcrypt
function verifyPassword(password: string, hash: string): boolean {
  const inputHash = createHash('sha256').update(password).digest('hex');
  return inputHash === hash || password === hash;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: username, password'
      });
    }

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminUsername || !adminPasswordHash || !jwtSecret) {
      return res.status(500).json({
        success: false,
        error: 'Admin credentials not configured'
      });
    }

    // Verify credentials
    if (username !== adminUsername || !verifyPassword(password, adminPasswordHash)) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Create JWT token
    const secret = new TextEncoder().encode(jwtSecret);
    const token = await new SignJWT({
      sub: username,
      role: 'admin',
      iat: Math.floor(Date.now() / 1000)
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret);

    return res.status(200).json({
      success: true,
      token: token,
      user: {
        id: '1',
        username: username,
        role: 'admin',
        permissions: ['read', 'write', 'delete', 'admin']
      }
    });
  } catch (error: any) {
    console.error('Error in admin login:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Authentication failed'
    });
  }
}

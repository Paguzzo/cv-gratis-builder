import type { VercelRequest, VercelResponse } from '@vercel/node';
import { jwtVerify } from 'jose';

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
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        valid: false,
        error: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({
        valid: false,
        error: 'JWT secret not configured'
      });
    }

    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jwtVerify(token, secret);

    return res.status(200).json({
      valid: true,
      user: {
        id: '1',
        username: payload.sub,
        role: payload.role || 'admin',
        permissions: ['read', 'write', 'delete', 'admin']
      }
    });
  } catch (error: any) {
    console.error('Error verifying token:', error);
    return res.status(401).json({
      valid: false,
      error: 'Invalid or expired token'
    });
  }
}

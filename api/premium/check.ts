import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Support both GET (query params) and POST (body)
    let templateId: string;
    let email: string;

    if (req.method === 'GET') {
      // Extract templateId from URL path: /api/premium/check/[templateId]
      const pathParts = req.url?.split('/') || [];
      templateId = pathParts[pathParts.length - 1]?.split('?')[0] || '';
      email = (req.query.email as string) || '';
    } else {
      templateId = req.body.templateId;
      email = req.body.userEmail || req.body.email;
    }

    if (!templateId || !email) {
      return res.status(400).json({
        success: false,
        hasAccess: false,
        error: 'Missing required fields: templateId, email'
      });
    }

    if (!process.env.DATABASE_URL) {
      // If no database configured, return no access (fail safe)
      console.warn('DATABASE_URL not configured, denying premium access');
      return res.status(200).json({
        success: true,
        hasAccess: false,
        hasPremiumAccess: false
      });
    }

    const sql = neon(process.env.DATABASE_URL);

    const result = await sql`
      SELECT * FROM premium_purchases
      WHERE email = ${email}
      AND template_id = ${templateId}
      AND status = 'completed'
      ORDER BY created_at DESC
      LIMIT 1
    `;

    const hasPremiumAccess = result.length > 0;
    const purchaseData = hasPremiumAccess ? result[0] : null;

    return res.status(200).json({
      success: true,
      hasAccess: hasPremiumAccess,
      hasPremiumAccess: hasPremiumAccess,
      purchaseData: purchaseData,
      expiresAt: null // Lifetime access for now
    });
  } catch (error: any) {
    console.error('Error checking premium access:', error);
    return res.status(500).json({
      success: false,
      hasAccess: false,
      error: error.message || 'Internal server error'
    });
  }
}

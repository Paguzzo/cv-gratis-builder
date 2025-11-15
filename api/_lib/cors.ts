import { VercelRequest, VercelResponse } from '@vercel/node';

export function cors(req: VercelRequest, res: VercelResponse): boolean {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }

  return false;
}

export function jsonResponse(res: VercelResponse, data: any, status: number = 200) {
  res.status(status).json(data);
}

export function errorResponse(res: VercelResponse, message: string, status: number = 500) {
  res.status(status).json({ success: false, error: message });
}

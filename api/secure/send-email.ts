import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const { to, subject, html, from } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, html'
      });
    }

    const fromEmail = from || process.env.FROM_EMAIL || 'CV Grátis <noreply@app.curriculogratisonline.com>';

    const data = await resend.emails.send({
      from: fromEmail,
      to: Array.isArray(to) ? to : [to],
      subject: subject,
      html: html,
    });

    console.log('Secure email sent:', data);

    return res.status(200).json({
      success: true,
      messageId: data.data?.id
    });
  } catch (error: any) {
    console.error('Error sending secure email:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email'
    });
  }
}

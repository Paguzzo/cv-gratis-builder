import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
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
    const { to, subject, message, senderName, recipientName, pdfBase64, pdfFileName } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, message'
      });
    }

    const fromEmail = process.env.FROM_EMAIL || 'CV Grátis <noreply@app.curriculogratisonline.com>';

    // Build email HTML
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Olá${recipientName ? ` ${recipientName}` : ''},</h2>
        <div style="white-space: pre-wrap;">${message}</div>
        ${senderName ? `<p style="margin-top: 20px;">Atenciosamente,<br/><strong>${senderName}</strong></p>` : ''}
        <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />
        <p style="color: #888; font-size: 12px;">
          Enviado via CV Grátis Builder - curriculogratisonline.com
        </p>
      </div>
    `;

    // Prepare email options
    const emailOptions: any = {
      from: fromEmail,
      to: [to],
      subject: subject,
      html: htmlContent,
    };

    // Add PDF attachment if provided
    if (pdfBase64 && pdfFileName) {
      emailOptions.attachments = [
        {
          filename: pdfFileName,
          content: pdfBase64,
        },
      ];
    }

    const data = await resend.emails.send(emailOptions);

    console.log('Email sent successfully:', data);

    return res.status(200).json({
      success: true,
      emailId: data.data?.id,
      message: 'Email sent successfully'
    });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email'
    });
  }
}

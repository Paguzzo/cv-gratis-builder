import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

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
    const { amount, currency = 'brl', metadata = {} } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount. Minimum is 100 cents (R$ 1,00)'
      });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Stripe not configured'
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      metadata: metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to create payment intent'
    });
  }
}

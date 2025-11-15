import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { neon } from '@neondatabase/serverless';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Stripe webhook secret not configured');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event: Stripe.Event;

  try {
    // Get raw body for signature verification
    const rawBody = JSON.stringify(req.body);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Received Stripe webhook event:', event.type);

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_details?.email;
      const templateId = session.metadata?.templateId || 'premium_template';

      console.log('Payment completed for:', customerEmail);

      if (customerEmail && process.env.DATABASE_URL) {
        try {
          const sql = neon(process.env.DATABASE_URL);

          await sql`
            INSERT INTO premium_purchases (
              email,
              template_id,
              stripe_payment_id,
              amount,
              currency,
              status,
              created_at
            ) VALUES (
              ${customerEmail},
              ${templateId},
              ${session.payment_intent as string},
              ${session.amount_total || 0},
              ${session.currency || 'brl'},
              'completed',
              NOW()
            )
          `;

          console.log('Premium purchase saved to database');
        } catch (dbError) {
          console.error('Database error:', dbError);
        }
      }
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment intent succeeded:', paymentIntent.id);
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment failed:', paymentIntent.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return res.status(200).json({ received: true });
}

export const config = {
  api: {
    bodyParser: true,
  },
};

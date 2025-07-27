import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { db } from "./db";
import { user } from "../shared/schema";
import { Resend } from 'resend';

// Assume RESEND_API_KEY is set in your environment variables.
const resend = new Resend(process.env.RESEND_API_KEY);

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Email sending endpoint
  app.post("/api/send-email", async (req: Request, res: Response) => {
    try {
      const { to, subject, html } = req.body;

      const sendResult = await resend.emails.send({
        from: 'CV Grátis <noreply@app.curriculogratisonline.com>',
        to: to,
        subject: subject,
        html: html,
      });

      console.log("Email sent successfully:", sendResult);
      res.status(200).json({ message: "Email sent!", data: sendResult });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Failed to send email", error: error });
    }
  });

  // Stripe webhook handler
  app.post("/webhook-test/stripe-assinatura", async (req: Request, res: Response) => {
    try {
      console.log('🔔 WEBHOOK: Recebido evento do Stripe:', req.body);
      
      const event = req.body;
      
      // Verificar se é um evento de checkout completado
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const clientReferenceId = session.client_reference_id;
        const customerEmail = session.customer_details?.email;
        
        console.log('✅ WEBHOOK: Pagamento confirmado para:', customerEmail);
        
        // Salvar compra premium no banco
        if (customerEmail) {
          const purchase = await storage.savePremiumPurchase({
            email: customerEmail,
            templateId: 'premium_template', // Pode ser extraído dos metadados
            stripePaymentId: session.payment_intent,
            amount: session.amount_total,
            currency: session.currency,
            status: 'completed'
          });
          
          console.log('💾 WEBHOOK: Compra salva no banco:', purchase);
        }
      }
      
      res.status(200).json({ received: true });
    } catch (error) {
      console.error('❌ WEBHOOK: Erro ao processar:', error);
      res.status(500).json({ error: 'Erro no webhook' });
    }
  });

  // Verificar acesso premium
  app.post("/api/check-premium-access", async (req: Request, res: Response) => {
    try {
      const { templateId, userEmail } = req.body;
      
      // Verificar no banco se o usuário tem acesso premium
      const purchase = await storage.getPremiumPurchase(userEmail, templateId);
      
      if (purchase && purchase.status === 'completed') {
        res.json({ 
          success: true, 
          hasPremiumAccess: true,
          purchaseData: purchase 
        });
      } else {
        res.json({ 
          success: true, 
          hasPremiumAccess: false 
        });
      }
    } catch (error) {
      console.error('Erro ao verificar acesso premium:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }
  });

  // Premium template configuration endpoint
  app.get("/api/configure-premium", (req: Request, res: Response) => {
    // Redirect to the premium template configuration page
    res.redirect("/premium-editor");
  });

  const httpServer = createServer(app);

  return httpServer;
}
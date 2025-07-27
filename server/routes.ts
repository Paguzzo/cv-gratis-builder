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
        from: 'Acme <onboarding@resend.dev>', // Replace with your verified Resend "from" address
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

  // Premium template configuration endpoint
  app.get("/api/configure-premium", (req: Request, res: Response) => {
    // Redirect to the premium template configuration page
    // Replace with the actual URL of the configuration page
    res.redirect("https://app.curriculogratisonline.com/premium-template-config");
  });

  const httpServer = createServer(app);

  return httpServer;
}
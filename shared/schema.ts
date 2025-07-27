import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userDataCollection = pgTable("user_data_collection", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  whatsapp: text("whatsapp"),
  actionType: text("action_type").notNull(), // 'download', 'email', 'print', 'premium'
  templateType: text("template_type").notNull(), // 'free', 'premium'
  templateId: text("template_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const curriculums = pgTable("curriculums", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  personalInfo: jsonb("personal_info"),
  professionalObjective: text("professional_objective"),
  education: jsonb("education"), // Array of education entries
  experience: jsonb("experience"), // Array of experience entries
  skills: text("skills").array(),
  languages: jsonb("languages"), // Array of language entries
  courses: jsonb("courses"), // Array of course entries
  projects: jsonb("projects"), // Array of project entries
  selectedTemplateId: text("selected_template_id"),
  isPremium: boolean("is_premium").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const premiumPurchases = pgTable("premium_purchases", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  templateId: text("template_id").notNull(),
  stripePaymentId: text("stripe_payment_id"),
  amount: integer("amount"), // in cents
  currency: text("currency").default("BRL"),
  status: text("status").notNull(), // 'pending', 'completed', 'failed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  curriculums: many(curriculums),
}));

export const curriculumsRelations = relations(curriculums, ({ one }) => ({
  user: one(users, {
    fields: [curriculums.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertUserDataCollectionSchema = createInsertSchema(userDataCollection).pick({
  name: true,
  email: true,
  whatsapp: true,
  actionType: true,
  templateType: true,
  templateId: true,
  ipAddress: true,
  userAgent: true,
});

export const insertCurriculumSchema = createInsertSchema(curriculums).pick({
  userId: true,
  personalInfo: true,
  professionalObjective: true,
  education: true,
  experience: true,
  skills: true,
  languages: true,
  courses: true,
  projects: true,
  selectedTemplateId: true,
  isPremium: true,
});

export const insertPremiumPurchaseSchema = createInsertSchema(premiumPurchases).pick({
  email: true,
  templateId: true,
  stripePaymentId: true,
  amount: true,
  currency: true,
  status: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertUserDataCollection = z.infer<typeof insertUserDataCollectionSchema>;
export type UserDataCollection = typeof userDataCollection.$inferSelect;

export type InsertCurriculum = z.infer<typeof insertCurriculumSchema>;
export type Curriculum = typeof curriculums.$inferSelect;

export type InsertPremiumPurchase = z.infer<typeof insertPremiumPurchaseSchema>;
export type PremiumPurchase = typeof premiumPurchases.$inferSelect;

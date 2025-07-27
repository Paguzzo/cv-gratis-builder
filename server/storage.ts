import { users, userDataCollection, curriculums, premiumPurchases, 
         type User, type InsertUser, type UserDataCollection, type InsertUserDataCollection,
         type Curriculum, type InsertCurriculum, type PremiumPurchase, type InsertPremiumPurchase } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  
  // User data collection (for analytics)
  saveUserData(insertUserData: InsertUserDataCollection): Promise<UserDataCollection>;
  getUserDataByEmail(email: string): Promise<UserDataCollection[]>;
  
  // Curriculum management
  saveCurriculum(insertCurriculum: InsertCurriculum): Promise<Curriculum>;
  getCurriculum(id: number): Promise<Curriculum | undefined>;
  getCurriculumsByUser(userId: number): Promise<Curriculum[]>;
  updateCurriculum(id: number, updates: Partial<InsertCurriculum>): Promise<Curriculum | undefined>;
  
  // Premium purchases
  savePremiumPurchase(insertPurchase: InsertPremiumPurchase): Promise<PremiumPurchase>;
  getPremiumPurchase(email: string, templateId: string): Promise<PremiumPurchase | undefined>;
  updatePremiumPurchaseStatus(id: number, status: string): Promise<PremiumPurchase | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // User data collection
  async saveUserData(insertUserData: InsertUserDataCollection): Promise<UserDataCollection> {
    const [userData] = await db
      .insert(userDataCollection)
      .values(insertUserData)
      .returning();
    return userData;
  }

  async getUserDataByEmail(email: string): Promise<UserDataCollection[]> {
    return await db.select().from(userDataCollection).where(eq(userDataCollection.email, email));
  }

  // Curriculum management
  async saveCurriculum(insertCurriculum: InsertCurriculum): Promise<Curriculum> {
    const [curriculum] = await db
      .insert(curriculums)
      .values({
        ...insertCurriculum,
        updatedAt: new Date(),
      })
      .returning();
    return curriculum;
  }

  async getCurriculum(id: number): Promise<Curriculum | undefined> {
    const [curriculum] = await db.select().from(curriculums).where(eq(curriculums.id, id));
    return curriculum || undefined;
  }

  async getCurriculumsByUser(userId: number): Promise<Curriculum[]> {
    return await db.select().from(curriculums).where(eq(curriculums.userId, userId));
  }

  async updateCurriculum(id: number, updates: Partial<InsertCurriculum>): Promise<Curriculum | undefined> {
    const [curriculum] = await db
      .update(curriculums)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(curriculums.id, id))
      .returning();
    return curriculum || undefined;
  }

  // Premium purchases
  async savePremiumPurchase(insertPurchase: InsertPremiumPurchase): Promise<PremiumPurchase> {
    const [purchase] = await db
      .insert(premiumPurchases)
      .values(insertPurchase)
      .returning();
    return purchase;
  }

  async getPremiumPurchase(email: string, templateId: string): Promise<PremiumPurchase | undefined> {
    const [purchase] = await db
      .select()
      .from(premiumPurchases)
      .where(eq(premiumPurchases.email, email))
      .where(eq(premiumPurchases.templateId, templateId));
    return purchase || undefined;
  }

  async updatePremiumPurchaseStatus(id: number, status: string): Promise<PremiumPurchase | undefined> {
    const [purchase] = await db
      .update(premiumPurchases)
      .set({ status })
      .where(eq(premiumPurchases.id, id))
      .returning();
    return purchase || undefined;
  }
}

export const storage = new DatabaseStorage();

import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const lawyers = pgTable("lawyers", {
  id: serial("id").primaryKey(),
  cnic: text("cnic").notNull().unique(),
  letterId: text("letter_id").notNull().unique(),
  fullName: text("full_name").notNull(),
  verified: boolean("verified").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const verificationRequests = pgTable("verification_requests", {
  id: serial("id").primaryKey(),
  cnic: text("cnic").notNull(),
  letterId: text("letter_id").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: text("reviewed_by"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertLawyerSchema = createInsertSchema(lawyers).omit({
  id: true,
  verified: true,
  createdAt: true,
});

export const insertVerificationRequestSchema = createInsertSchema(verificationRequests).omit({
  id: true,
  status: true,
  submittedAt: true,
  reviewedAt: true,
  reviewedBy: true,
});

export const verificationSchema = z.object({
  cnic: z.string()
    .regex(/^[0-9]{5}-[0-9]{7}-[0-9]{1}$/, "CNIC must be in format: 12345-1234567-1"),
  letterId: z.string()
    .regex(/^LTR-[0-9]{5}$/, "Letter ID must be in format: LTR-12345"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Lawyer = typeof lawyers.$inferSelect;
export type InsertLawyer = z.infer<typeof insertLawyerSchema>;
export type VerificationRequest = typeof verificationRequests.$inferSelect;
export type InsertVerificationRequest = z.infer<typeof insertVerificationRequestSchema>;
export type VerificationInput = z.infer<typeof verificationSchema>;

import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const knowledgeItems = pgTable("live_russia_knowledge_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array().notNull(),
  isPremium: boolean("is_premium").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const assistantAccounts = pgTable("live_russia_accounts", {
  id: serial("id").primaryKey(),
  accountNumber: text("account_number").notNull().unique(),
  displayName: text("display_name").notNull(),
  username: text("username").notNull(),
  role: text("role").notNull().default("assistant"),
  isPremium: boolean("is_premium").notNull().default(false),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
});

export type KnowledgeItem = typeof knowledgeItems.$inferSelect;
export type AssistantAccount = typeof assistantAccounts.$inferSelect;
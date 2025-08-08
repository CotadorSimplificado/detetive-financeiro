import { 
  pgTable, 
  text, 
  serial, 
  integer, 
  boolean, 
  varchar, 
  decimal, 
  date, 
  timestamp, 
  uuid,
  jsonb,
  index
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// ===============================
// USERS & SESSIONS
// ===============================

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table with email/password authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  password: varchar("password"), // bcrypt hash - temporariamente nullable para migração
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ===============================
// CATEGORIES
// ===============================

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id), // null = categoria padrão do sistema
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // INCOME, EXPENSE
  icon: varchar("icon"),
  color: varchar("color"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ===============================
// ACCOUNTS
// ===============================

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // CHECKING, SAVINGS, INVESTMENT, CASH
  balance: decimal("balance", { precision: 12, scale: 2 }).notNull().default('0'),
  bankName: varchar("bank_name"),
  accountNumber: varchar("account_number"),
  agency: varchar("agency"),
  color: varchar("color"),
  isDefault: boolean("is_default").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ===============================
// CREDIT CARDS
// ===============================

export const creditCards = pgTable("credit_cards", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  brand: varchar("brand").notNull(), // VISA, MASTERCARD, ELO, AMERICAN_EXPRESS, HIPERCARD, DINERS
  type: varchar("type").notNull(), // CREDIT, DEBIT, PREPAID, VIRTUAL
  limit: decimal("limit", { precision: 12, scale: 2 }).notNull(),
  availableLimit: decimal("available_limit", { precision: 12, scale: 2 }).notNull(),
  closingDay: integer("closing_day").notNull(),
  dueDay: integer("due_day").notNull(),
  lastFourDigits: varchar("last_four_digits", { length: 4 }),
  color: varchar("color"),
  isDefault: boolean("is_default").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ===============================
// TRANSACTIONS
// ===============================

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => users.id),
  description: varchar("description").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  type: varchar("type").notNull(), // INCOME, EXPENSE, TRANSFER, CREDIT_CARD_EXPENSE
  date: date("date").notNull(),
  competenceMonth: integer("competence_month").notNull(),
  competenceYear: integer("competence_year").notNull(),
  accountId: uuid("account_id").references(() => accounts.id),
  categoryId: uuid("category_id").references(() => categories.id),
  creditCardId: uuid("credit_card_id").references(() => creditCards.id),
  // Para transferências
  transferFromAccountId: uuid("transfer_from_account_id").references(() => accounts.id),
  transferToAccountId: uuid("transfer_to_account_id").references(() => accounts.id),
  isTransfer: boolean("is_transfer").default(false),
  notes: text("notes"),
  isPaid: boolean("is_paid").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ===============================
// CREDIT CARD BILLS
// ===============================

export const creditCardBills = pgTable("credit_card_bills", {
  id: uuid("id").primaryKey().defaultRandom(),
  creditCardId: uuid("credit_card_id").notNull().references(() => creditCards.id),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull().default('0'),
  dueDate: date("due_date").notNull(),
  closingDate: date("closing_date").notNull(),
  isPaid: boolean("is_paid").default(false),
  paidAt: timestamp("paid_at"),
  paidAmount: decimal("paid_amount", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ===============================
// MONTHLY PLANS (BUDGETS)
// ===============================

export const monthlyPlans = pgTable("monthly_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => users.id),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  totalBudget: decimal("total_budget", { precision: 12, scale: 2 }).notNull(),
  totalSpent: decimal("total_spent", { precision: 12, scale: 2 }).notNull().default('0'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const categoryBudgets = pgTable("category_budgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  monthlyPlanId: uuid("monthly_plan_id").notNull().references(() => monthlyPlans.id, { onDelete: 'cascade' }),
  categoryId: uuid("category_id").notNull().references(() => categories.id),
  budgetAmount: decimal("budget_amount", { precision: 12, scale: 2 }).notNull(),
  spentAmount: decimal("spent_amount", { precision: 12, scale: 2 }).notNull().default('0'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ===============================
// RELATIONS
// ===============================

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  transactions: many(transactions),
  creditCards: many(creditCards),
  categories: many(categories),
  monthlyPlans: many(monthlyPlans),
}));

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
  transfersFrom: many(transactions, { relationName: "transferFrom" }),
  transfersTo: many(transactions, { relationName: "transferTo" }),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
  categoryBudgets: many(categoryBudgets),
}));

export const creditCardsRelations = relations(creditCards, ({ one, many }) => ({
  user: one(users, {
    fields: [creditCards.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
  bills: many(creditCardBills),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
  creditCard: one(creditCards, {
    fields: [transactions.creditCardId],
    references: [creditCards.id],
  }),
  transferFromAccount: one(accounts, {
    fields: [transactions.transferFromAccountId],
    references: [accounts.id],
    relationName: "transferFrom",
  }),
  transferToAccount: one(accounts, {
    fields: [transactions.transferToAccountId],
    references: [accounts.id],
    relationName: "transferTo",
  }),
}));

export const creditCardBillsRelations = relations(creditCardBills, ({ one }) => ({
  creditCard: one(creditCards, {
    fields: [creditCardBills.creditCardId],
    references: [creditCards.id],
  }),
}));

export const monthlyPlansRelations = relations(monthlyPlans, ({ one, many }) => ({
  user: one(users, {
    fields: [monthlyPlans.userId],
    references: [users.id],
  }),
  categoryBudgets: many(categoryBudgets),
}));

export const categoryBudgetsRelations = relations(categoryBudgets, ({ one }) => ({
  monthlyPlan: one(monthlyPlans, {
    fields: [categoryBudgets.monthlyPlanId],
    references: [monthlyPlans.id],
  }),
  category: one(categories, {
    fields: [categoryBudgets.categoryId],
    references: [categories.id],
  }),
}));

// ===============================
// ZOD SCHEMAS FOR VALIDATION
// ===============================

// User schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const upsertUserSchema = insertUserSchema.partial({ id: true });

// Account schemas
export const insertAccountSchema = createInsertSchema(accounts).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export const selectAccountSchema = createSelectSchema(accounts);
export const updateAccountSchema = insertAccountSchema.partial();

// Category schemas
export const insertCategorySchema = createInsertSchema(categories).omit({ 
  id: true, 
  createdAt: true 
});
export const selectCategorySchema = createSelectSchema(categories);

// Transaction schemas
export const insertTransactionSchema = createInsertSchema(transactions).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export const selectTransactionSchema = createSelectSchema(transactions);
export const updateTransactionSchema = insertTransactionSchema.partial();

// Credit card schemas
export const insertCreditCardSchema = createInsertSchema(creditCards).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export const selectCreditCardSchema = createSelectSchema(creditCards);
export const updateCreditCardSchema = insertCreditCardSchema.partial();

// Credit card bill schemas
export const insertCreditCardBillSchema = createInsertSchema(creditCardBills).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export const selectCreditCardBillSchema = createSelectSchema(creditCardBills);

// Monthly plan schemas
export const insertMonthlyPlanSchema = createInsertSchema(monthlyPlans).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export const selectMonthlyPlanSchema = createSelectSchema(monthlyPlans);

export const insertCategoryBudgetSchema = createInsertSchema(categoryBudgets).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export const selectCategoryBudgetSchema = createSelectSchema(categoryBudgets);

// ===============================
// TYPESCRIPT TYPES
// ===============================

// User types
export type User = typeof users.$inferSelect;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Account types
export type Account = typeof accounts.$inferSelect;
export type CreateAccount = z.infer<typeof insertAccountSchema>;
export type UpdateAccount = z.infer<typeof updateAccountSchema>;

// Category types
export type Category = typeof categories.$inferSelect;
export type CreateCategory = z.infer<typeof insertCategorySchema>;

// Transaction types
export type Transaction = typeof transactions.$inferSelect;
export type CreateTransaction = z.infer<typeof insertTransactionSchema>;
export type UpdateTransaction = z.infer<typeof updateTransactionSchema>;

// Credit card types
export type CreditCard = typeof creditCards.$inferSelect;
export type CreateCreditCard = z.infer<typeof insertCreditCardSchema>;
export type UpdateCreditCard = z.infer<typeof updateCreditCardSchema>;

// Credit card bill types
export type CreditCardBill = typeof creditCardBills.$inferSelect;
export type CreateCreditCardBill = z.infer<typeof insertCreditCardBillSchema>;

// Monthly plan types
export type MonthlyPlan = typeof monthlyPlans.$inferSelect;
export type CreateMonthlyPlan = z.infer<typeof insertMonthlyPlanSchema>;

export type CategoryBudget = typeof categoryBudgets.$inferSelect;
export type CreateCategoryBudget = z.infer<typeof insertCategoryBudgetSchema>;

// ===============================
// FILTER TYPES
// ===============================

export interface TransactionFilters {
  type?: string;
  competenceMonth?: number;
  competenceYear?: number;
  accountId?: string;
  categoryId?: string;
  creditCardId?: string;
}

export interface AccountFilters {
  type?: string;
  isActive?: boolean;
}

export interface CategoryFilters {
  type?: string;
  userId?: string | null;
}

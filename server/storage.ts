import { 
  users, 
  accounts, 
  categories, 
  transactions, 
  creditCards, 
  creditCardBills,
  monthlyPlans,
  categoryBudgets,
  type User,
  type UpsertUser,
  type Account, 
  type CreateAccount, 
  type UpdateAccount,
  type Category, 
  type CreateCategory,
  type Transaction, 
  type CreateTransaction, 
  type UpdateTransaction,
  type CreditCard, 
  type CreateCreditCard, 
  type UpdateCreditCard,
  type CreditCardBill, 
  type CreateCreditCardBill,
  type MonthlyPlan, 
  type CreateMonthlyPlan,
  type CategoryBudget, 
  type CreateCategoryBudget,
  type TransactionFilters,
  type AccountFilters,
  type CategoryFilters
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, isNull, or } from "drizzle-orm";

// Interface para operações de storage
export interface IStorage {
  // User operations (Replit Auth compatible)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Account operations
  getAccounts(userId: string, filters?: AccountFilters): Promise<Account[]>;
  getAccount(id: string, userId: string): Promise<Account | undefined>;
  createAccount(account: CreateAccount): Promise<Account>;
  updateAccount(id: string, userId: string, account: UpdateAccount): Promise<Account>;
  deleteAccount(id: string, userId: string): Promise<void>;
  
  // Category operations
  getCategories(filters?: CategoryFilters): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: CreateCategory): Promise<Category>;
  
  // Transaction operations
  getTransactions(userId: string, filters?: TransactionFilters): Promise<Transaction[]>;
  getTransaction(id: string, userId: string): Promise<Transaction | undefined>;
  createTransaction(transaction: CreateTransaction): Promise<Transaction>;
  updateTransaction(id: string, userId: string, transaction: UpdateTransaction): Promise<Transaction>;
  deleteTransaction(id: string, userId: string): Promise<void>;
  
  // Credit card operations
  getCreditCards(userId: string): Promise<CreditCard[]>;
  getCreditCard(id: string, userId: string): Promise<CreditCard | undefined>;
  createCreditCard(creditCard: CreateCreditCard): Promise<CreditCard>;
  updateCreditCard(id: string, userId: string, creditCard: UpdateCreditCard): Promise<CreditCard>;
  deleteCreditCard(id: string, userId: string): Promise<void>;
  
  // Credit card bill operations
  getCreditCardBills(creditCardId: string, userId: string): Promise<CreditCardBill[]>;
  getCreditCardBill(id: string, userId: string): Promise<CreditCardBill | undefined>;
  createCreditCardBill(bill: CreateCreditCardBill): Promise<CreditCardBill>;
  
  // Monthly plan operations
  getMonthlyPlans(userId: string): Promise<MonthlyPlan[]>;
  getMonthlyPlan(userId: string, month: number, year: number): Promise<MonthlyPlan | undefined>;
  createMonthlyPlan(plan: CreateMonthlyPlan): Promise<MonthlyPlan>;
  
  // Category budget operations
  getCategoryBudgets(monthlyPlanId: string): Promise<CategoryBudget[]>;
  createCategoryBudget(budget: CreateCategoryBudget): Promise<CategoryBudget>;
}

export class DatabaseStorage implements IStorage {
  
  // ===============================
  // USER OPERATIONS
  // ===============================
  
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // ===============================
  // ACCOUNT OPERATIONS
  // ===============================
  
  async getAccounts(userId: string, filters?: AccountFilters): Promise<Account[]> {
    let conditions = [eq(accounts.userId, userId)];
    
    if (filters?.type) {
      conditions.push(eq(accounts.type, filters.type));
    }
    
    if (filters?.isActive !== undefined) {
      conditions.push(eq(accounts.isActive, filters.isActive));
    }
    
    return await db
      .select()
      .from(accounts)
      .where(and(...conditions))
      .orderBy(desc(accounts.createdAt));
  }

  async getAccount(id: string, userId: string): Promise<Account | undefined> {
    const [account] = await db
      .select()
      .from(accounts)
      .where(and(eq(accounts.id, id), eq(accounts.userId, userId)));
    return account;
  }

  async createAccount(account: CreateAccount): Promise<Account> {
    const [newAccount] = await db.insert(accounts).values(account).returning();
    return newAccount;
  }

  async updateAccount(id: string, userId: string, account: UpdateAccount): Promise<Account> {
    const [updatedAccount] = await db
      .update(accounts)
      .set({ ...account, updatedAt: new Date() })
      .where(and(eq(accounts.id, id), eq(accounts.userId, userId)))
      .returning();
    return updatedAccount;
  }

  async deleteAccount(id: string, userId: string): Promise<void> {
    await db
      .delete(accounts)
      .where(and(eq(accounts.id, id), eq(accounts.userId, userId)));
  }

  // ===============================
  // CATEGORY OPERATIONS
  // ===============================
  
  async getCategories(filters?: CategoryFilters): Promise<Category[]> {
    let conditions = [];
    
    if (filters?.userId !== undefined) {
      if (filters.userId === null) {
        conditions.push(isNull(categories.userId));
      } else {
        conditions.push(or(eq(categories.userId, filters.userId), isNull(categories.userId)));
      }
    }
    
    if (filters?.type) {
      conditions.push(eq(categories.type, filters.type));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    return await db
      .select()
      .from(categories)
      .where(whereClause)
      .orderBy(categories.name);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(category: CreateCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  // ===============================
  // TRANSACTION OPERATIONS
  // ===============================
  
  async getTransactions(userId: string, filters?: TransactionFilters): Promise<Transaction[]> {
    let conditions = [eq(transactions.userId, userId)];
    
    if (filters?.type) {
      conditions.push(eq(transactions.type, filters.type));
    }
    
    if (filters?.competenceMonth) {
      conditions.push(eq(transactions.competenceMonth, filters.competenceMonth));
    }
    
    if (filters?.competenceYear) {
      conditions.push(eq(transactions.competenceYear, filters.competenceYear));
    }
    
    if (filters?.accountId) {
      conditions.push(eq(transactions.accountId, filters.accountId));
    }
    
    if (filters?.categoryId) {
      conditions.push(eq(transactions.categoryId, filters.categoryId));
    }
    
    if (filters?.creditCardId) {
      conditions.push(eq(transactions.creditCardId, filters.creditCardId));
    }
    
    return await db
      .select()
      .from(transactions)
      .where(and(...conditions))
      .orderBy(desc(transactions.date), desc(transactions.createdAt));
  }

  async getTransaction(id: string, userId: string): Promise<Transaction | undefined> {
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)));
    return transaction;
  }

  async createTransaction(transaction: CreateTransaction): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions).values(transaction).returning();
    return newTransaction;
  }

  async updateTransaction(id: string, userId: string, transaction: UpdateTransaction): Promise<Transaction> {
    const [updatedTransaction] = await db
      .update(transactions)
      .set({ ...transaction, updatedAt: new Date() })
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
      .returning();
    return updatedTransaction;
  }

  async deleteTransaction(id: string, userId: string): Promise<void> {
    await db
      .delete(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)));
  }

  // ===============================
  // CREDIT CARD OPERATIONS
  // ===============================
  
  async getCreditCards(userId: string): Promise<CreditCard[]> {
    return await db
      .select()
      .from(creditCards)
      .where(eq(creditCards.userId, userId))
      .orderBy(desc(creditCards.createdAt));
  }

  async getCreditCard(id: string, userId: string): Promise<CreditCard | undefined> {
    const [creditCard] = await db
      .select()
      .from(creditCards)
      .where(and(eq(creditCards.id, id), eq(creditCards.userId, userId)));
    return creditCard;
  }

  async createCreditCard(creditCard: CreateCreditCard): Promise<CreditCard> {
    const [newCreditCard] = await db.insert(creditCards).values(creditCard).returning();
    return newCreditCard;
  }

  async updateCreditCard(id: string, userId: string, creditCard: UpdateCreditCard): Promise<CreditCard> {
    const [updatedCreditCard] = await db
      .update(creditCards)
      .set({ ...creditCard, updatedAt: new Date() })
      .where(and(eq(creditCards.id, id), eq(creditCards.userId, userId)))
      .returning();
    return updatedCreditCard;
  }

  async deleteCreditCard(id: string, userId: string): Promise<void> {
    await db
      .delete(creditCards)
      .where(and(eq(creditCards.id, id), eq(creditCards.userId, userId)));
  }

  // ===============================
  // CREDIT CARD BILL OPERATIONS
  // ===============================
  
  async getCreditCardBills(creditCardId: string, userId: string): Promise<CreditCardBill[]> {
    // Verifica se o cartão pertence ao usuário
    const cardExists = await this.getCreditCard(creditCardId, userId);
    if (!cardExists) return [];
    
    return await db
      .select()
      .from(creditCardBills)
      .where(eq(creditCardBills.creditCardId, creditCardId))
      .orderBy(desc(creditCardBills.year), desc(creditCardBills.month));
  }

  async getCreditCardBill(id: string, userId: string): Promise<CreditCardBill | undefined> {
    const [bill] = await db
      .select()
      .from(creditCardBills)
      .innerJoin(creditCards, eq(creditCardBills.creditCardId, creditCards.id))
      .where(and(eq(creditCardBills.id, id), eq(creditCards.userId, userId)));
    
    return bill?.credit_card_bills;
  }

  async createCreditCardBill(bill: CreateCreditCardBill): Promise<CreditCardBill> {
    const [newBill] = await db.insert(creditCardBills).values(bill).returning();
    return newBill;
  }

  // ===============================
  // MONTHLY PLAN OPERATIONS
  // ===============================
  
  async getMonthlyPlans(userId: string): Promise<MonthlyPlan[]> {
    return await db
      .select()
      .from(monthlyPlans)
      .where(eq(monthlyPlans.userId, userId))
      .orderBy(desc(monthlyPlans.year), desc(monthlyPlans.month));
  }

  async getMonthlyPlan(userId: string, month: number, year: number): Promise<MonthlyPlan | undefined> {
    const [plan] = await db
      .select()
      .from(monthlyPlans)
      .where(and(
        eq(monthlyPlans.userId, userId),
        eq(monthlyPlans.month, month),
        eq(monthlyPlans.year, year)
      ));
    return plan;
  }

  async createMonthlyPlan(plan: CreateMonthlyPlan): Promise<MonthlyPlan> {
    const [newPlan] = await db.insert(monthlyPlans).values(plan).returning();
    return newPlan;
  }

  // ===============================
  // CATEGORY BUDGET OPERATIONS
  // ===============================
  
  async getCategoryBudgets(monthlyPlanId: string): Promise<CategoryBudget[]> {
    return await db
      .select()
      .from(categoryBudgets)
      .where(eq(categoryBudgets.monthlyPlanId, monthlyPlanId))
      .orderBy(categoryBudgets.createdAt);
  }

  async createCategoryBudget(budget: CreateCategoryBudget): Promise<CategoryBudget> {
    const [newBudget] = await db.insert(categoryBudgets).values(budget).returning();
    return newBudget;
  }
}

// Manter MemStorage para compatibilidade durante a migração
export class MemStorage implements IStorage {
  // Legacy implementation - será removido após migração completa
  async getUser(id: string): Promise<User | undefined> {
    throw new Error("MemStorage deprecated - use DatabaseStorage");
  }
  
  async upsertUser(user: UpsertUser): Promise<User> {
    throw new Error("MemStorage deprecated - use DatabaseStorage");
  }
  
  // Implementar métodos básicos para evitar quebrar a aplicação
  async getAccounts(): Promise<Account[]> { return []; }
  async getAccount(): Promise<Account | undefined> { return undefined; }
  async createAccount(): Promise<Account> { throw new Error("Use DatabaseStorage"); }
  async updateAccount(): Promise<Account> { throw new Error("Use DatabaseStorage"); }
  async deleteAccount(): Promise<void> { throw new Error("Use DatabaseStorage"); }
  
  async getCategories(): Promise<Category[]> { return []; }
  async getCategory(): Promise<Category | undefined> { return undefined; }
  async createCategory(): Promise<Category> { throw new Error("Use DatabaseStorage"); }
  
  async getTransactions(): Promise<Transaction[]> { return []; }
  async getTransaction(): Promise<Transaction | undefined> { return undefined; }
  async createTransaction(): Promise<Transaction> { throw new Error("Use DatabaseStorage"); }
  async updateTransaction(): Promise<Transaction> { throw new Error("Use DatabaseStorage"); }
  async deleteTransaction(): Promise<void> { throw new Error("Use DatabaseStorage"); }
  
  async getCreditCards(): Promise<CreditCard[]> { return []; }
  async getCreditCard(): Promise<CreditCard | undefined> { return undefined; }
  async createCreditCard(): Promise<CreditCard> { throw new Error("Use DatabaseStorage"); }
  async updateCreditCard(): Promise<CreditCard> { throw new Error("Use DatabaseStorage"); }
  async deleteCreditCard(): Promise<void> { throw new Error("Use DatabaseStorage"); }
  
  async getCreditCardBills(): Promise<CreditCardBill[]> { return []; }
  async getCreditCardBill(): Promise<CreditCardBill | undefined> { return undefined; }
  async createCreditCardBill(): Promise<CreditCardBill> { throw new Error("Use DatabaseStorage"); }
  
  async getMonthlyPlans(): Promise<MonthlyPlan[]> { return []; }
  async getMonthlyPlan(): Promise<MonthlyPlan | undefined> { return undefined; }
  async createMonthlyPlan(): Promise<MonthlyPlan> { throw new Error("Use DatabaseStorage"); }
  
  async getCategoryBudgets(): Promise<CategoryBudget[]> { return []; }
  async createCategoryBudget(): Promise<CategoryBudget> { throw new Error("Use DatabaseStorage"); }
}

// Export the storage instance - mudará para DatabaseStorage na migração final
export const storage = new DatabaseStorage();

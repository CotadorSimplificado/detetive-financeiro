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
import { 
  encryptObjectFields, 
  decryptObjectFields, 
  SENSITIVE_FIELDS,
  validateEncryptionSetup 
} from "./encryption";

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
  
  constructor() {
    // Validar configuração de criptografia na inicialização
    if (!validateEncryptionSetup()) {
      throw new Error('Encryption setup validation failed - check ENCRYPTION_KEY environment variable');
    }
  }
  
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
    
    const accountsData = await db
      .select()
      .from(accounts)
      .where(and(...conditions))
      .orderBy(desc(accounts.createdAt));
    
    // Descriptografar dados sensíveis
    return accountsData.map(account => 
      decryptObjectFields(account, SENSITIVE_FIELDS.ACCOUNT)
    );
  }

  async getAccount(id: string, userId: string): Promise<Account | undefined> {
    const [account] = await db
      .select()
      .from(accounts)
      .where(and(eq(accounts.id, id), eq(accounts.userId, userId)));
    
    return account ? decryptObjectFields(account, SENSITIVE_FIELDS.ACCOUNT) : undefined;
  }

  async createAccount(account: CreateAccount): Promise<Account> {
    // Criptografar dados sensíveis antes de inserir
    const encryptedAccount = encryptObjectFields(account, SENSITIVE_FIELDS.ACCOUNT);
    const [newAccount] = await db.insert(accounts).values(encryptedAccount).returning();
    
    // Retornar dados descriptografados
    return decryptObjectFields(newAccount, SENSITIVE_FIELDS.ACCOUNT);
  }

  async updateAccount(id: string, userId: string, account: UpdateAccount): Promise<Account> {
    // Criptografar apenas os campos sensíveis que estão sendo atualizados
    const encryptedUpdates = encryptObjectFields(account, SENSITIVE_FIELDS.ACCOUNT);
    const [updatedAccount] = await db
      .update(accounts)
      .set({ ...encryptedUpdates, updatedAt: new Date() })
      .where(and(eq(accounts.id, id), eq(accounts.userId, userId)))
      .returning();
    
    // Retornar dados descriptografados
    return decryptObjectFields(updatedAccount, SENSITIVE_FIELDS.ACCOUNT);
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
    
    const transactionsData = await db
      .select()
      .from(transactions)
      .where(and(...conditions))
      .orderBy(desc(transactions.date), desc(transactions.createdAt));
    
    // Descriptografar dados sensíveis
    return transactionsData.map(transaction => 
      decryptObjectFields(transaction, SENSITIVE_FIELDS.TRANSACTION)
    );
  }

  async getTransaction(id: string, userId: string): Promise<Transaction | undefined> {
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)));
    
    return transaction ? decryptObjectFields(transaction, SENSITIVE_FIELDS.TRANSACTION) : undefined;
  }

  async createTransaction(transaction: CreateTransaction): Promise<Transaction> {
    // Criptografar dados sensíveis antes de inserir
    const encryptedTransaction = encryptObjectFields(transaction, SENSITIVE_FIELDS.TRANSACTION);
    const [newTransaction] = await db.insert(transactions).values(encryptedTransaction).returning();
    
    // Retornar dados descriptografados
    return decryptObjectFields(newTransaction, SENSITIVE_FIELDS.TRANSACTION);
  }

  async updateTransaction(id: string, userId: string, transaction: UpdateTransaction): Promise<Transaction> {
    // Criptografar apenas os campos sensíveis que estão sendo atualizados
    const encryptedUpdates = encryptObjectFields(transaction, SENSITIVE_FIELDS.TRANSACTION);
    const [updatedTransaction] = await db
      .update(transactions)
      .set({ ...encryptedUpdates, updatedAt: new Date() })
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
      .returning();
    
    // Retornar dados descriptografados
    return decryptObjectFields(updatedTransaction, SENSITIVE_FIELDS.TRANSACTION);
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
    const creditCardsData = await db
      .select()
      .from(creditCards)
      .where(eq(creditCards.userId, userId))
      .orderBy(desc(creditCards.createdAt));
    
    // Descriptografar dados sensíveis
    return creditCardsData.map(creditCard => 
      decryptObjectFields(creditCard, SENSITIVE_FIELDS.CREDIT_CARD)
    );
  }

  async getCreditCard(id: string, userId: string): Promise<CreditCard | undefined> {
    const [creditCard] = await db
      .select()
      .from(creditCards)
      .where(and(eq(creditCards.id, id), eq(creditCards.userId, userId)));
    
    return creditCard ? decryptObjectFields(creditCard, SENSITIVE_FIELDS.CREDIT_CARD) : undefined;
  }

  async createCreditCard(creditCard: CreateCreditCard): Promise<CreditCard> {
    // Criptografar dados sensíveis antes de inserir
    const encryptedCreditCard = encryptObjectFields(creditCard, SENSITIVE_FIELDS.CREDIT_CARD);
    const [newCreditCard] = await db.insert(creditCards).values(encryptedCreditCard).returning();
    
    // Retornar dados descriptografados
    return decryptObjectFields(newCreditCard, SENSITIVE_FIELDS.CREDIT_CARD);
  }

  async updateCreditCard(id: string, userId: string, creditCard: UpdateCreditCard): Promise<CreditCard> {
    try {
      console.log("🔧 Storage: updateCreditCard called with:", {
        id,
        userId,
        creditCard,
        creditCardKeys: Object.keys(creditCard),
        creditCardTypes: Object.fromEntries(
          Object.entries(creditCard).map(([key, value]) => [key, typeof value])
        )
      });

      // Criptografar apenas os campos sensíveis que estão sendo atualizados
      const encryptedUpdates = encryptObjectFields(creditCard, SENSITIVE_FIELDS.CREDIT_CARD);
      
      console.log("🔒 After encryption:", {
        original: creditCard,
        encrypted: encryptedUpdates,
        sensitiveFields: SENSITIVE_FIELDS.CREDIT_CARD
      });

      const updateData = { ...encryptedUpdates, updatedAt: new Date() };
      console.log("📝 Final update data:", updateData);

      const [updatedCreditCard] = await db
        .update(creditCards)
        .set(updateData)
        .where(and(eq(creditCards.id, id), eq(creditCards.userId, userId)))
        .returning();
      
      if (!updatedCreditCard) {
        throw new Error(`Credit card not found or user not authorized: ${id}`);
      }

      console.log("✅ Card updated in database:", updatedCreditCard);

      // Retornar dados descriptografados
      const result = decryptObjectFields(updatedCreditCard, SENSITIVE_FIELDS.CREDIT_CARD);
      console.log("🔓 Final decrypted result:", result);
      
      return result;
    } catch (error) {
      console.error("❌ Storage updateCreditCard error:", {
        error: error.message,
        stack: error.stack,
        id,
        userId,
        creditCard
      });
      throw error;
    }
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
    
    const billsData = await db
      .select()
      .from(creditCardBills)
      .where(eq(creditCardBills.creditCardId, creditCardId))
      .orderBy(desc(creditCardBills.year), desc(creditCardBills.month));
    
    // Descriptografar dados sensíveis
    return billsData.map(bill => 
      decryptObjectFields(bill, SENSITIVE_FIELDS.CREDIT_CARD_BILL)
    );
  }

  async getCreditCardBill(id: string, userId: string): Promise<CreditCardBill | undefined> {
    const [bill] = await db
      .select()
      .from(creditCardBills)
      .innerJoin(creditCards, eq(creditCardBills.creditCardId, creditCards.id))
      .where(and(eq(creditCardBills.id, id), eq(creditCards.userId, userId)));
    
    const billData = bill?.credit_card_bills;
    return billData ? decryptObjectFields(billData, SENSITIVE_FIELDS.CREDIT_CARD_BILL) : undefined;
  }

  async createCreditCardBill(bill: CreateCreditCardBill): Promise<CreditCardBill> {
    // Criptografar dados sensíveis antes de inserir
    const encryptedBill = encryptObjectFields(bill, SENSITIVE_FIELDS.CREDIT_CARD_BILL);
    const [newBill] = await db.insert(creditCardBills).values(encryptedBill).returning();
    
    // Retornar dados descriptografados
    return decryptObjectFields(newBill, SENSITIVE_FIELDS.CREDIT_CARD_BILL);
  }

  // ===============================
  // MONTHLY PLAN OPERATIONS
  // ===============================
  
  async getMonthlyPlans(userId: string): Promise<MonthlyPlan[]> {
    const plansData = await db
      .select()
      .from(monthlyPlans)
      .where(eq(monthlyPlans.userId, userId))
      .orderBy(desc(monthlyPlans.year), desc(monthlyPlans.month));
    
    // Descriptografar dados sensíveis
    return plansData.map(plan => 
      decryptObjectFields(plan, SENSITIVE_FIELDS.MONTHLY_PLAN)
    );
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
    
    return plan ? decryptObjectFields(plan, SENSITIVE_FIELDS.MONTHLY_PLAN) : undefined;
  }

  async createMonthlyPlan(plan: CreateMonthlyPlan): Promise<MonthlyPlan> {
    // Criptografar dados sensíveis antes de inserir
    const encryptedPlan = encryptObjectFields(plan, SENSITIVE_FIELDS.MONTHLY_PLAN);
    const [newPlan] = await db.insert(monthlyPlans).values(encryptedPlan).returning();
    
    // Retornar dados descriptografados
    return decryptObjectFields(newPlan, SENSITIVE_FIELDS.MONTHLY_PLAN);
  }

  // ===============================
  // CATEGORY BUDGET OPERATIONS
  // ===============================
  
  async getCategoryBudgets(monthlyPlanId: string): Promise<CategoryBudget[]> {
    const budgetsData = await db
      .select()
      .from(categoryBudgets)
      .where(eq(categoryBudgets.monthlyPlanId, monthlyPlanId))
      .orderBy(categoryBudgets.createdAt);
    
    // Descriptografar dados sensíveis
    return budgetsData.map(budget => 
      decryptObjectFields(budget, SENSITIVE_FIELDS.CATEGORY_BUDGET)
    );
  }

  async createCategoryBudget(budget: CreateCategoryBudget): Promise<CategoryBudget> {
    // Criptografar dados sensíveis antes de inserir
    const encryptedBudget = encryptObjectFields(budget, SENSITIVE_FIELDS.CATEGORY_BUDGET);
    const [newBudget] = await db.insert(categoryBudgets).values(encryptedBudget).returning();
    
    // Retornar dados descriptografados
    return decryptObjectFields(newBudget, SENSITIVE_FIELDS.CATEGORY_BUDGET);
  }
}

// Export the storage instance - using DatabaseStorage with encryption
export const storage = new DatabaseStorage();

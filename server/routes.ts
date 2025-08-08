import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCategorySchema,
  insertAccountSchema,
  insertTransactionSchema,
  insertCreditCardSchema,
  insertCreditCardBillSchema,
  insertMonthlyPlanSchema,
  updateAccountSchema,
  updateTransactionSchema,
  updateCreditCardSchema
} from "@shared/schema";
import { z } from "zod";

// Middleware de autenticação simulado para desenvolvimento
// TODO: Substituir por autenticação real na Fase 4
const mockAuth = (req: any, res: any, next: any) => {
  req.user = { id: 'mock-user' }; // Usuário mock para desenvolvimento
  next();
};

// Tipo para request com user
interface AuthenticatedRequest extends Express.Request {
  user: { id: string };
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ===============================
  // ACCOUNTS ROUTES
  // ===============================
  
  // GET /api/accounts - Lista contas do usuário
  app.get("/api/accounts", mockAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user.id;
      const { type, isActive } = req.query;
      
      const filters: any = {};
      if (type) filters.type = type as string;
      if (isActive !== undefined) filters.isActive = isActive === 'true';
      
      const accounts = await storage.getAccounts(userId, filters);
      res.json(accounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      res.status(500).json({ error: "Failed to fetch accounts" });
    }
  });

  // GET /api/accounts/:id - Busca conta específica
  app.get("/api/accounts/:id", mockAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      const account = await storage.getAccount(id, userId);
      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }
      
      res.json(account);
    } catch (error) {
      console.error("Error fetching account:", error);
      res.status(500).json({ error: "Failed to fetch account" });
    }
  });

  // POST /api/accounts - Cria nova conta
  app.post("/api/accounts", mockAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user.id;
      const accountData = insertAccountSchema.parse({
        ...req.body,
        userId,
      });
      
      const account = await storage.createAccount(accountData);
      res.status(201).json(account);
    } catch (error: any) {
      console.error("Error creating account:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid account data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  // PUT /api/accounts/:id - Atualiza conta
  app.put("/api/accounts/:id", mockAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const updateData = updateAccountSchema.parse(req.body);
      
      const account = await storage.updateAccount(id, userId, updateData);
      res.json(account);
    } catch (error: any) {
      console.error("Error updating account:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid account data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update account" });
    }
  });

  // DELETE /api/accounts/:id - Deleta conta
  app.delete("/api/accounts/:id", mockAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      await storage.deleteAccount(id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting account:", error);
      res.status(500).json({ error: "Failed to delete account" });
    }
  });

  // ===============================
  // TRANSACTIONS ROUTES
  // ===============================
  
  // GET /api/transactions - Lista transações do usuário
  app.get("/api/transactions", mockAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user.id;
      const { 
        type, 
        competenceMonth, 
        competenceYear, 
        accountId, 
        categoryId, 
        creditCardId 
      } = req.query;
      
      const filters: any = {};
      if (type) filters.type = type as string;
      if (competenceMonth) filters.competenceMonth = Number(competenceMonth);
      if (competenceYear) filters.competenceYear = Number(competenceYear);
      if (accountId) filters.accountId = accountId as string;
      if (categoryId) filters.categoryId = categoryId as string;
      if (creditCardId) filters.creditCardId = creditCardId as string;
      
      const transactions = await storage.getTransactions(userId, filters);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  // GET /api/transactions/:id - Busca transação específica
  app.get("/api/transactions/:id", mockAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      const transaction = await storage.getTransaction(id, userId);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      
      res.json(transaction);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      res.status(500).json({ error: "Failed to fetch transaction" });
    }
  });

  // POST /api/transactions - Cria nova transação
  app.post("/api/transactions", mockAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user.id;
      const transactionData = insertTransactionSchema.parse({
        ...req.body,
        userId,
      });
      
      const transaction = await storage.createTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error: any) {
      console.error("Error creating transaction:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid transaction data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create transaction" });
    }
  });

  // PUT /api/transactions/:id - Atualiza transação
  app.put("/api/transactions/:id", mockAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const updateData = updateTransactionSchema.parse(req.body);
      
      const transaction = await storage.updateTransaction(id, userId, updateData);
      res.json(transaction);
    } catch (error: any) {
      console.error("Error updating transaction:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid transaction data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update transaction" });
    }
  });

  // DELETE /api/transactions/:id - Deleta transação
  app.delete("/api/transactions/:id", mockAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      await storage.deleteTransaction(id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      res.status(500).json({ error: "Failed to delete transaction" });
    }
  });

  // ===============================
  // CATEGORIES ROUTES
  // ===============================
  
  // GET /api/categories - Lista todas as categorias (padrão + do usuário)
  app.get("/api/categories", async (req, res) => {
    try {
      const { type, userId } = req.query;
      
      const filters: any = {};
      if (type) filters.type = type as string;
      if (userId) filters.userId = userId as string;
      
      const categories = await storage.getCategories(filters);
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // GET /api/categories/:id - Busca categoria específica
  app.get("/api/categories/:id", async (req, res) => {
    try {
      const category = await storage.getCategory(req.params.id);
      
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });

  // POST /api/categories - Cria nova categoria personalizada
  app.post("/api/categories", mockAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user.id;
      const validatedData = insertCategorySchema.parse({
        ...req.body,
        userId,
      });
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error: any) {
      console.error("Error creating category:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid category data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  // ===============================
  // CREDIT CARDS ROUTES
  // ===============================
  
  // GET /api/credit-cards - Lista cartões de crédito do usuário
  app.get("/api/credit-cards", mockAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user.id;
      const { isActive } = req.query;
      
      const filters: any = {};
      if (isActive !== undefined) filters.isActive = isActive === 'true';
      
      const cards = await storage.getCreditCards(userId, filters);
      res.json(cards);
    } catch (error) {
      console.error("Error fetching credit cards:", error);
      res.status(500).json({ error: "Failed to fetch credit cards" });
    }
  });

  // GET /api/credit-cards/:id - Busca cartão específico
  app.get("/api/credit-cards/:id", mockAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      const card = await storage.getCreditCard(id, userId);
      if (!card) {
        return res.status(404).json({ error: "Credit card not found" });
      }
      
      res.json(card);
    } catch (error) {
      console.error("Error fetching credit card:", error);
      res.status(500).json({ error: "Failed to fetch credit card" });
    }
  });

  // POST /api/credit-cards - Cria novo cartão
  app.post("/api/credit-cards", mockAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user.id;
      const cardData = insertCreditCardSchema.parse({
        ...req.body,
        userId,
      });
      
      const card = await storage.createCreditCard(cardData);
      res.status(201).json(card);
    } catch (error: any) {
      console.error("Error creating credit card:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid credit card data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create credit card" });
    }
  });

  // PUT /api/credit-cards/:id - Atualiza cartão
  app.put("/api/credit-cards/:id", mockAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const updateData = updateCreditCardSchema.parse(req.body);
      
      const card = await storage.updateCreditCard(id, userId, updateData);
      res.json(card);
    } catch (error: any) {
      console.error("Error updating credit card:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid credit card data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update credit card" });
    }
  });

  // DELETE /api/credit-cards/:id - Deleta cartão
  app.delete("/api/credit-cards/:id", mockAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      await storage.deleteCreditCard(id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting credit card:", error);
      res.status(500).json({ error: "Failed to delete credit card" });
    }
  });

  // ===============================
  // MONTHLY PLANS ROUTES
  // ===============================
  
  // GET /api/monthly-plans/:month/:year - Busca plano mensal específico
  app.get("/api/monthly-plans/:month/:year", mockAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user.id;
      const { month, year } = req.params;
      
      const plan = await storage.getMonthlyPlan(userId, Number(month), Number(year));
      res.json(plan || null);
    } catch (error) {
      console.error("Error fetching monthly plan:", error);
      res.status(500).json({ error: "Failed to fetch monthly plan" });
    }
  });

  // POST /api/monthly-plans - Cria plano mensal
  app.post("/api/monthly-plans", mockAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user.id;
      const planData = insertMonthlyPlanSchema.parse({
        ...req.body,
        userId,
      });
      
      const plan = await storage.createMonthlyPlan(planData);
      res.status(201).json(plan);
    } catch (error: any) {
      console.error("Error creating monthly plan:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid monthly plan data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create monthly plan" });
    }
  });

  // ===============================
  // SUMMARY ROUTES
  // ===============================
  
  // GET /api/transactions/summary - Resumo financeiro
  app.get("/api/transactions/summary", mockAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user.id;
      const { competenceMonth, competenceYear } = req.query;
      
      const filters: any = {};
      if (competenceMonth) filters.competenceMonth = Number(competenceMonth);
      if (competenceYear) filters.competenceYear = Number(competenceYear);
      
      const transactions = await storage.getTransactions(userId, filters);
      
      const summary = {
        income: transactions
          .filter(t => t.type === 'INCOME')
          .reduce((sum, t) => sum + Number(t.amount), 0),
        expenses: transactions
          .filter(t => t.type === 'EXPENSE' || t.type === 'CREDIT_CARD_EXPENSE')
          .reduce((sum, t) => sum + Number(t.amount), 0),
        balance: 0,
      };
      
      summary.balance = summary.income - summary.expenses;
      
      res.json(summary);
    } catch (error) {
      console.error("Error calculating summary:", error);
      res.status(500).json({ error: "Failed to calculate summary" });
    }
  });

  // ===============================
  // HEALTH CHECK
  // ===============================
  
  // GET /api/health - Health check
  app.get("/api/health", async (req, res) => {
    try {
      // Verificar conexão com banco de dados
      const categories = await storage.getCategories({});
      const categoriesCount = categories.length;
      
      res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        database: {
          connected: true,
          categoriesCount,
        },
        version: "1.0.0",
        environment: process.env.NODE_ENV || "development"
      });
    } catch (error) {
      console.error("Health check failed:", error);
      res.status(500).json({
        status: "error",
        timestamp: new Date().toISOString(),
        database: {
          connected: false,
        },
        error: "Database connection failed"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

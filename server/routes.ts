import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCategorySchema,
  insertAccountSchema,
  insertTransactionSchema,
  insertCreditCardSchema,
  updateAccountSchema,
  updateTransactionSchema,
  updateCreditCardSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
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
  app.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error: any) {
      console.error("Error creating category:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid category data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  // ===============================
  // ACCOUNTS ROUTES (preparadas para migração futura)
  // ===============================
  
  // GET /api/accounts
  app.get("/api/accounts", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      
      const accounts = await storage.getAccounts(userId);
      res.json(accounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      res.status(500).json({ error: "Failed to fetch accounts" });
    }
  });

  // POST /api/accounts
  app.post("/api/accounts", async (req, res) => {
    try {
      const validatedData = insertAccountSchema.parse(req.body);
      const account = await storage.createAccount(validatedData);
      res.status(201).json(account);
    } catch (error: any) {
      console.error("Error creating account:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid account data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  // PUT /api/accounts/:id
  app.put("/api/accounts/:id", async (req, res) => {
    try {
      const userId = req.body.userId || req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      
      const validatedData = updateAccountSchema.parse(req.body);
      const account = await storage.updateAccount(req.params.id, userId, validatedData);
      res.json(account);
    } catch (error: any) {
      console.error("Error updating account:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid account data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update account" });
    }
  });

  // DELETE /api/accounts/:id
  app.delete("/api/accounts/:id", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      
      await storage.deleteAccount(req.params.id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting account:", error);
      res.status(500).json({ error: "Failed to delete account" });
    }
  });

  // ===============================
  // TRANSACTIONS ROUTES (preparadas para migração futura)
  // ===============================
  
  // GET /api/transactions
  app.get("/api/transactions", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      
      const { type, competenceMonth, competenceYear, accountId, categoryId, creditCardId } = req.query;
      
      const filters: any = {};
      if (type) filters.type = type as string;
      if (competenceMonth) filters.competenceMonth = parseInt(competenceMonth as string);
      if (competenceYear) filters.competenceYear = parseInt(competenceYear as string);
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

  // POST /api/transactions
  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error: any) {
      console.error("Error creating transaction:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid transaction data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create transaction" });
    }
  });

  // ===============================
  // CREDIT CARDS ROUTES (preparadas para migração futura)
  // ===============================
  
  // GET /api/credit-cards
  app.get("/api/credit-cards", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      
      const creditCards = await storage.getCreditCards(userId);
      res.json(creditCards);
    } catch (error) {
      console.error("Error fetching credit cards:", error);
      res.status(500).json({ error: "Failed to fetch credit cards" });
    }
  });

  // POST /api/credit-cards
  app.post("/api/credit-cards", async (req, res) => {
    try {
      const validatedData = insertCreditCardSchema.parse(req.body);
      const creditCard = await storage.createCreditCard(validatedData);
      res.status(201).json(creditCard);
    } catch (error: any) {
      console.error("Error creating credit card:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid credit card data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create credit card" });
    }
  });

  // ===============================
  // HEALTH CHECK
  // ===============================
  
  app.get("/api/health", async (req, res) => {
    try {
      // Testa conectividade com banco
      const categories = await storage.getCategories();
      res.json({ 
        status: "ok", 
        database: "connected",
        categories: categories.length,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({ 
        status: "error", 
        database: "disconnected",
        error: error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

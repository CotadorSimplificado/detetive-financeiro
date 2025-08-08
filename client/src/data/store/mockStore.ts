import { 
  User, 
  Account, 
  Category, 
  Transaction, 
  CreditCard, 
  CreditCardBill,
  Budget,
  FamilyGroup,
  FamilyGroupMember,
  MockUser,
  MockSession,
  CreateAccount,
  UpdateAccount,
  CreateCategory,
  UpdateCategory,
  CreateTransaction,
  UpdateTransaction,
  CreateCreditCard,
  UpdateCreditCard,
  CreateCreditCardBill,
  UpdateCreditCardBill,
  CreateBudget,
  UpdateBudget,
  TransactionFilters,
  AccountFilters,
  CategoryFilters
} from '../types';

import {
  mockUsers,
  defaultUser,
  findUserById,
  findUserByEmail,
  createMockUser
} from '../mock/users';

import {
  mockAccounts,
  findAccountsByUserId,
  findAccountById,
  findDefaultAccountByUserId,
  createMockAccount,
  updateMockAccount,
  deleteMockAccount,
  calculateTotalBalance
} from '../mock/accounts';

import {
  mockCategories,
  findCategoriesByUserId,
  findCategoryById,
  findCategoriesByType,
  findChildCategories,
  findRootCategories,
  createMockCategory,
  updateMockCategory,
  deleteMockCategory
} from '../mock/categories';

import {
  mockTransactions,
  findTransactionsByUserId,
  findTransactionById,
  findTransactionsByAccountId,
  findTransactionsByCategoryId,
  findTransactionsByDateRange,
  findTransactionsByType,
  createMockTransaction,
  updateMockTransaction,
  deleteMockTransaction,
  calculateBalanceByPeriod,
  findRecurringTransactions
} from '../mock/transactions';

import {
  mockCreditCards,
  findCreditCardsByUserId,
  findCreditCardById,
  findDefaultCreditCardByUserId,
  findVirtualCreditCards,
  findCreditCardsByBrand,
  findCreditCardsByType,
  createMockCreditCard,
  updateMockCreditCard,
  deleteMockCreditCard,
  setDefaultCreditCard,
  calculateTotalAvailableLimit,
  calculateTotalCreditLimit
} from '../mock/creditCards';

import {
  mockCreditCardBills,
  findBillsByCardId,
  findBillById,
  findBillsByUserId,
  findOpenBills,
  findPaidBills,
  findBillsByPeriod,
  findCurrentBill,
  findNextDueBill,
  findOverdueBills,
  createMockBill,
  updateMockBill,
  markBillAsPaid,
  calculateTotalOpenBills,
  calculateTotalPaidBills
} from '../mock/bills';

// Store principal para gerenciar dados mock
export class MockStore {
  private currentUser: MockUser | null = null;
  private currentSession: MockSession | null = null;
  private readonly SESSION_KEY = 'detetive_financeiro_mock_session';

  constructor() {
    // Desabilitado auto login - usando autenticação Replit
    // Tentar recuperar sessão do localStorage na inicialização
    // this.loadSessionFromStorage();
    
    // Se não há sessão válida, fazer login automático com usuário exemplo
    // if (!this.currentSession) {
    //   this.autoLoginWithDefaultUser();
    // }
  }

  // ===== SEGURANÇA - GERAÇÃO DE TOKENS =====

  // Gerar token seguro usando crypto.getRandomValues
  private generateSecureToken(): string {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    } else {
      // Fallback para ambientes que não suportam crypto (muito raro)
      console.warn('[SECURITY] crypto.getRandomValues not available, using fallback');
      return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }
  }

  // ===== PERSISTÊNCIA DE SESSÃO =====

  // Salvar sessão no localStorage
  private saveSessionToStorage(): void {
    // SEGURANÇA: NÃO salvar tokens/sessões em localStorage
    // Autenticação agora é gerenciada via httpOnly cookies seguros
    console.log('[SECURITY] Session storage to localStorage disabled - using secure httpOnly cookies');
  }

  // SEGURANÇA: NÃO carregar sessão do localStorage
  private loadSessionFromStorage(): void {
    // SEGURANÇA: NÃO carregar tokens/sessões do localStorage inseguro
    // Autenticação real via cookies httpOnly é gerenciada pelo backend
    console.log('[SECURITY] Session loading from localStorage disabled - using secure API authentication');
    
    // Limpar qualquer sessão antiga por segurança
    try {
      localStorage.removeItem(this.SESSION_KEY);
      console.log('[SECURITY] Removed old session tokens from localStorage');
    } catch (error) {
      console.warn('[SECURITY] Error removing old session tokens:', error);
    }
  }

  // SEGURANÇA: Limpar qualquer sessão insegura remanescente
  private clearSessionFromStorage(): void {
    try {
      localStorage.removeItem(this.SESSION_KEY);
      console.log('[SECURITY] Cleared legacy session tokens from localStorage');
    } catch (error) {
      console.warn('[SECURITY] Error clearing legacy session tokens:', error);
    }
  }

  // Login automático com usuário padrão para desenvolvimento
  private autoLoginWithDefaultUser(): void {
    try {
      const defaultUser = findUserByEmail('usuario@exemplo.com');
      if (defaultUser) {
        this.currentUser = defaultUser;
        this.currentSession = {
          user: defaultUser,
          access_token: 'mock-auto-login-token-' + this.generateSecureToken(),
          refresh_token: 'mock-auto-refresh-token-' + this.generateSecureToken(),
          expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
        };
        
        // Salvar sessão no localStorage
        this.saveSessionToStorage();
        
        console.log('Login automático realizado com usuário:', defaultUser.full_name);
      }
    } catch (error) {
      console.warn('Erro durante login automático:', error);
    }
  }

  // ===== AUTENTICAÇÃO =====
  
  // Simular login
  async signIn(email: string, password: string): Promise<{ user: MockUser | null; error: any }> {
    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = findUserByEmail(email);
      if (!user) {
        return { user: null, error: { message: 'Email ou senha incorretos.' } };
      }
      
      // Simular validação de senha (sempre aceita para mock)
      this.currentUser = user;
      this.currentSession = {
        user,
        access_token: 'mock-access-token-' + this.generateSecureToken(),
        refresh_token: 'mock-refresh-token-' + this.generateSecureToken(),
        expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
      };
      
      // Salvar sessão no localStorage
      this.saveSessionToStorage();
      
      return { user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  }

  // Simular cadastro
  async signUp(email: string, password: string, fullName: string): Promise<{ user: MockUser | null; error: any }> {
    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const existingUser = findUserByEmail(email);
      if (existingUser) {
        return { user: null, error: { message: 'Este email já está cadastrado.' } };
      }
      
      const newUser = createMockUser(email, fullName);
      this.currentUser = newUser;
      this.currentSession = {
        user: newUser,
        access_token: 'mock-access-token-' + this.generateSecureToken(),
        refresh_token: 'mock-refresh-token-' + this.generateSecureToken(),
        expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
      };
      
      // Salvar sessão no localStorage
      this.saveSessionToStorage();
      
      return { user: newUser, error: null };
    } catch (error) {
      return { user: null, error };
    }
  }

  // Simular logout
  async signOut(): Promise<void> {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    
    this.currentUser = null;
    this.currentSession = null;
    
    // Limpar sessão do localStorage
    this.clearSessionFromStorage();
  }

  // Obter usuário atual
  getCurrentUser(): MockUser | null {
    return this.currentUser;
  }

  // Obter sessão atual
  getCurrentSession(): MockSession | null {
    return this.currentSession;
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    if (!this.currentUser || !this.currentSession) {
      return false;
    }
    
    // Verificar se a sessão não expirou
    if (this.currentSession.expires_at <= Date.now()) {
      // Sessão expirada, limpar dados
      this.currentUser = null;
      this.currentSession = null;
      this.clearSessionFromStorage();
      return false;
    }
    
    return true;
  }

  // Renovar sessão (estender tempo de expiração)
  async refreshSession(): Promise<boolean> {
    if (!this.currentSession) {
      return false;
    }
    
    // Estender sessão por mais 24 horas
    this.currentSession.expires_at = Date.now() + (24 * 60 * 60 * 1000);
    this.currentSession.access_token = 'mock-access-token-' + this.generateSecureToken();
    
    // Salvar sessão atualizada no localStorage
    this.saveSessionToStorage();
    
    return true;
  }

  // Verificar se a sessão está próxima de expirar (últimas 2 horas)
  isSessionExpiringSoon(): boolean {
    if (!this.currentSession) {
      return false;
    }
    
    const twoHoursFromNow = Date.now() + (2 * 60 * 60 * 1000);
    return this.currentSession.expires_at <= twoHoursFromNow;
  }

  // ===== CONTAS =====

  // Buscar contas do usuário
  async getAccounts(userId: string, filters?: AccountFilters): Promise<Account[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    let accounts = findAccountsByUserId(userId);
    
    if (filters) {
      if (filters.isActive !== undefined) {
        accounts = accounts.filter(account => account.is_active === filters.isActive);
      }
      if (filters.includeInTotal !== undefined) {
        accounts = accounts.filter(account => account.include_in_total === filters.includeInTotal);
      }
      if (filters.type) {
        accounts = accounts.filter(account => account.type === filters.type);
      }
    }
    
    return accounts;
  }

  // Buscar conta por ID
  async getAccount(id: string): Promise<Account | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return findAccountById(id) || null;
  }

  // Criar nova conta
  async createAccount(accountData: CreateAccount): Promise<Account> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return createMockAccount(accountData);
  }

  // Atualizar conta
  async updateAccount(id: string, updates: UpdateAccount): Promise<Account | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return updateMockAccount(id, updates);
  }

  // Deletar conta
  async deleteAccount(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return deleteMockAccount(id);
  }

  // Calcular saldo total
  async getTotalBalance(userId: string): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return calculateTotalBalance(userId);
  }

  // ===== CATEGORIAS =====

  // Buscar categorias do usuário
  async getCategories(userId: string, filters?: CategoryFilters): Promise<Category[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    let categories = findCategoriesByUserId(userId);
    
    if (filters) {
      if (filters.isActive !== undefined) {
        categories = categories.filter(category => category.is_active === filters.isActive);
      }
      if (filters.type) {
        categories = categories.filter(category => category.type === filters.type);
      }
      if (filters.parentId) {
        categories = categories.filter(category => category.parent_id === filters.parentId);
      }
    }
    
    return categories;
  }

  // Buscar categoria por ID
  async getCategory(id: string): Promise<Category | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return findCategoryById(id) || null;
  }

  // Buscar categorias por tipo
  async getCategoriesByType(userId: string, type: string): Promise<Category[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return findCategoriesByType(type as any, userId);
  }

  // Criar nova categoria
  async createCategory(categoryData: CreateCategory): Promise<Category> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return createMockCategory(categoryData);
  }

  // Atualizar categoria
  async updateCategory(id: string, updates: UpdateCategory): Promise<Category | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return updateMockCategory(id, updates);
  }

  // Deletar categoria
  async deleteCategory(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return deleteMockCategory(id);
  }

  // ===== TRANSAÇÕES =====

  // Buscar transações do usuário
  async getTransactions(userId: string, filters?: TransactionFilters): Promise<Transaction[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let transactions = findTransactionsByUserId(userId);
    
    if (filters) {
      if (filters.startDate && filters.endDate) {
        transactions = transactions.filter(transaction => 
          transaction.date >= filters.startDate! && 
          transaction.date <= filters.endDate!
        );
      }
      if (filters.accountId) {
        transactions = transactions.filter(transaction => transaction.account_id === filters.accountId);
      }
      if (filters.categoryId) {
        transactions = transactions.filter(transaction => transaction.category_id === filters.categoryId);
      }
      if (filters.type) {
        transactions = transactions.filter(transaction => transaction.type === filters.type);
      }
      if (filters.minAmount !== undefined) {
        transactions = transactions.filter(transaction => transaction.amount >= filters.minAmount!);
      }
      if (filters.maxAmount !== undefined) {
        transactions = transactions.filter(transaction => transaction.amount <= filters.maxAmount!);
      }
      if (filters.description) {
        transactions = transactions.filter(transaction => 
          transaction.description.toLowerCase().includes(filters.description!.toLowerCase())
        );
      }
    }
    
    // Ordenar por data (mais recente primeiro)
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Buscar transação por ID
  async getTransaction(id: string): Promise<Transaction | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return findTransactionById(id) || null;
  }

  // Criar nova transação
  async createTransaction(transactionData: CreateTransaction): Promise<Transaction> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return createMockTransaction(transactionData);
  }

  // Atualizar transação
  async updateTransaction(id: string, updates: UpdateTransaction): Promise<Transaction | null> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return updateMockTransaction(id, updates);
  }

  // Deletar transação
  async deleteTransaction(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return deleteMockTransaction(id);
  }

  // Calcular saldo por período
  async getBalanceByPeriod(userId: string, startDate: string, endDate: string): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return calculateBalanceByPeriod(userId, startDate, endDate);
  }

  // ===== CARTÕES DE CRÉDITO =====

  // Buscar cartões do usuário
  async getCreditCards(userId: string): Promise<CreditCard[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return findCreditCardsByUserId(userId);
  }

  // Buscar cartão por ID
  async getCreditCard(id: string): Promise<CreditCard | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return findCreditCardById(id) || null;
  }

  // Criar novo cartão
  async createCreditCard(cardData: CreateCreditCard): Promise<CreditCard> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return createMockCreditCard(cardData);
  }

  // Atualizar cartão
  async updateCreditCard(id: string, updates: UpdateCreditCard): Promise<CreditCard | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return updateMockCreditCard(id, updates);
  }

  // Deletar cartão
  async deleteCreditCard(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return deleteMockCreditCard(id);
  }

  // Definir cartão como padrão
  async setDefaultCreditCard(userId: string, cardId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return setDefaultCreditCard(userId, cardId);
  }

  // ===== FATURAS =====

  // Buscar faturas do usuário
  async getCreditCardBills(userId: string, cardIds: string[]): Promise<CreditCardBill[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return findBillsByUserId(userId, cardIds);
  }

  // Buscar fatura por ID
  async getCreditCardBill(id: string): Promise<CreditCardBill | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return findBillById(id) || null;
  }

  // Buscar faturas em aberto
  async getOpenBills(cardIds: string[]): Promise<CreditCardBill[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return findOpenBills(cardIds);
  }

  // Buscar próxima fatura a vencer
  async getNextDueBill(cardIds: string[]): Promise<CreditCardBill | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return findNextDueBill(cardIds) || null;
  }

  // Marcar fatura como paga
  async markBillAsPaid(id: string, paymentTransactionId?: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return markBillAsPaid(id, paymentTransactionId);
  }

  // Calcular total de faturas em aberto
  async getTotalOpenBills(cardIds: string[]): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return calculateTotalOpenBills(cardIds);
  }

  // ===== UTILITÁRIOS =====

  // Simular delay de rede
  async delay(ms: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  // Resetar dados (para testes)
  reset(): void {
    this.currentUser = null;
    this.currentSession = null;
    this.clearSessionFromStorage();
  }

  // Obter estatísticas gerais
  async getStats(userId: string): Promise<{
    totalBalance: number;
    totalCreditLimit: number;
    totalAvailableLimit: number;
    totalOpenBills: number;
    monthlyIncome: number;
    monthlyExpenses: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userCards = findCreditCardsByUserId(userId).map(card => card.id);
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const startDate = currentMonth + '-01';
    const endDate = currentMonth + '-31';
    
    const [totalBalance, totalCreditLimit, totalAvailableLimit, totalOpenBills, monthlyIncome, monthlyExpenses] = await Promise.all([
      this.getTotalBalance(userId),
      calculateTotalCreditLimit(userId),
      calculateTotalAvailableLimit(userId),
      this.getTotalOpenBills(userCards),
      this.getBalanceByPeriod(userId, startDate, endDate),
      this.getBalanceByPeriod(userId, startDate, endDate)
    ]);
    
    return {
      totalBalance,
      totalCreditLimit,
      totalAvailableLimit,
      totalOpenBills,
      monthlyIncome: Math.max(0, monthlyIncome),
      monthlyExpenses: Math.abs(Math.min(0, monthlyExpenses))
    };
  }
}

// Instância singleton do store
export const mockStore = new MockStore();

// Exportar instância para uso global
export default mockStore;

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { mockStore } from './mockStore';
import { MockUser, MockSession } from '../types';
import {
  Account,
  Category,
  Transaction,
  CreditCard,
  CreditCardBill,
  Budget,
  FamilyGroup,
  FamilyGroupMember,
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

// ===== TIPOS DO CONTEXT =====

interface MockState {
  // Autenticação
  user: MockUser | null;
  session: MockSession | null;
  isAuthenticated: boolean;
  loading: boolean;
  
  // Dados
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  creditCards: CreditCard[];
  creditCardBills: CreditCardBill[];
  budgets: Budget[];
  familyGroups: FamilyGroup[];
  familyGroupMembers: FamilyGroupMember[];
  
  // Estados de loading
  accountsLoading: boolean;
  categoriesLoading: boolean;
  transactionsLoading: boolean;
  creditCardsLoading: boolean;
  billsLoading: boolean;
  budgetsLoading: boolean;
  
  // Estados de erro
  error: string | null;
}

type MockAction =
  // Autenticação
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: MockUser | null }
  | { type: 'SET_SESSION'; payload: MockSession | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  
  // Contas
  | { type: 'SET_ACCOUNTS_LOADING'; payload: boolean }
  | { type: 'SET_ACCOUNTS'; payload: Account[] }
  | { type: 'ADD_ACCOUNT'; payload: Account }
  | { type: 'UPDATE_ACCOUNT'; payload: Account }
  | { type: 'DELETE_ACCOUNT'; payload: string }
  
  // Categorias
  | { type: 'SET_CATEGORIES_LOADING'; payload: boolean }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  
  // Transações
  | { type: 'SET_TRANSACTIONS_LOADING'; payload: boolean }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  
  // Cartões de Crédito
  | { type: 'SET_CREDIT_CARDS_LOADING'; payload: boolean }
  | { type: 'SET_CREDIT_CARDS'; payload: CreditCard[] }
  | { type: 'ADD_CREDIT_CARD'; payload: CreditCard }
  | { type: 'UPDATE_CREDIT_CARD'; payload: CreditCard }
  | { type: 'DELETE_CREDIT_CARD'; payload: string }
  
  // Faturas
  | { type: 'SET_BILLS_LOADING'; payload: boolean }
  | { type: 'SET_CREDIT_CARD_BILLS'; payload: CreditCardBill[] }
  | { type: 'ADD_CREDIT_CARD_BILL'; payload: CreditCardBill }
  | { type: 'UPDATE_CREDIT_CARD_BILL'; payload: CreditCardBill }
  | { type: 'DELETE_CREDIT_CARD_BILL'; payload: string }
  
  // Orçamentos
  | { type: 'SET_BUDGETS_LOADING'; payload: boolean }
  | { type: 'SET_BUDGETS'; payload: Budget[] }
  | { type: 'ADD_BUDGET'; payload: Budget }
  | { type: 'UPDATE_BUDGET'; payload: Budget }
  | { type: 'DELETE_BUDGET'; payload: string }
  
  // Reset
  | { type: 'RESET_STATE' };

interface MockContextType extends MockState {
  // Autenticação
  signIn: (email: string, password: string) => Promise<{ user: MockUser | null; error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ user: MockUser | null; error: any }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  isSessionExpiringSoon: () => boolean;
  
  // Contas
  fetchAccounts: () => Promise<void>;
  createAccount: (data: CreateAccount) => Promise<Account | null>;
  updateAccount: (id: string, data: UpdateAccount) => Promise<Account | null>;
  deleteAccount: (id: string) => Promise<boolean>;
  getAccountById: (id: string) => Account | undefined;
  getDefaultAccount: () => Account | undefined;
  getTotalBalance: () => number;
  
  // Categorias
  fetchCategories: () => Promise<void>;
  createCategory: (data: CreateCategory) => Promise<Category | null>;
  updateCategory: (id: string, data: UpdateCategory) => Promise<Category | null>;
  deleteCategory: (id: string) => Promise<boolean>;
  getCategoryById: (id: string) => Category | undefined;
  getCategoriesByType: (type: string) => Category[];
  getRootCategories: () => Category[];
  
  // Transações
  fetchTransactions: (filters?: TransactionFilters) => Promise<void>;
  createTransaction: (data: CreateTransaction) => Promise<Transaction | null>;
  updateTransaction: (id: string, data: UpdateTransaction) => Promise<Transaction | null>;
  deleteTransaction: (id: string) => Promise<boolean>;
  getTransactionById: (id: string) => Transaction | undefined;
  getTransactionsByAccount: (accountId: string) => Transaction[];
  getTransactionsByCategory: (categoryId: string) => Transaction[];
  getTransactionsByDateRange: (startDate: string, endDate: string) => Transaction[];
  
  // Cartões de Crédito
  fetchCreditCards: () => Promise<void>;
  createCreditCard: (data: CreateCreditCard) => Promise<CreditCard | null>;
  updateCreditCard: (id: string, data: UpdateCreditCard) => Promise<CreditCard | null>;
  deleteCreditCard: (id: string) => Promise<boolean>;
  getCreditCardById: (id: string) => CreditCard | undefined;
  getDefaultCreditCard: () => CreditCard | undefined;
  setDefaultCreditCard: (id: string) => Promise<boolean>;
  getTotalCreditLimit: () => number;
  getTotalAvailableLimit: () => number;
  
  // Faturas
  fetchCreditCardBills: () => Promise<void>;
  createCreditCardBill: (data: CreateCreditCardBill) => Promise<CreditCardBill | null>;
  updateCreditCardBill: (id: string, data: UpdateCreditCardBill) => Promise<CreditCardBill | null>;
  deleteCreditCardBill: (id: string) => Promise<boolean>;
  getBillById: (id: string) => CreditCardBill | undefined;
  getBillsByCard: (cardId: string) => CreditCardBill[];
  getOpenBills: () => CreditCardBill[];
  getPaidBills: () => CreditCardBill[];
  markBillAsPaid: (id: string) => Promise<boolean>;
  getTotalOpenBills: () => number;
  getTotalPaidBills: () => number;
  
  // Orçamentos
  fetchBudgets: () => Promise<void>;
  createBudget: (data: CreateBudget) => Promise<Budget | null>;
  updateBudget: (id: string, data: UpdateBudget) => Promise<Budget | null>;
  deleteBudget: (id: string) => Promise<boolean>;
  getBudgetById: (id: string) => Budget | undefined;
  
  // Utilitários
  reset: () => void;
}

// ===== ESTADO INICIAL =====

const initialState: MockState = {
  // Autenticação
  user: null,
  session: null,
  isAuthenticated: false,
  loading: true,
  
  // Dados
  accounts: [],
  categories: [],
  transactions: [],
  creditCards: [],
  creditCardBills: [],
  budgets: [],
  familyGroups: [],
  familyGroupMembers: [],
  
  // Estados de loading
  accountsLoading: false,
  categoriesLoading: false,
  transactionsLoading: false,
  creditCardsLoading: false,
  billsLoading: false,
  budgetsLoading: false,
  
  // Estados de erro
  error: null,
};

// ===== REDUCER =====

const mockReducer = (state: MockState, action: MockAction): MockState => {
  switch (action.type) {
    // Autenticação
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_SESSION':
      return { ...state, session: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    // Contas
    case 'SET_ACCOUNTS_LOADING':
      return { ...state, accountsLoading: action.payload };
    case 'SET_ACCOUNTS':
      return { ...state, accounts: action.payload };
    case 'ADD_ACCOUNT':
      return { ...state, accounts: [...state.accounts, action.payload] };
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.map(account =>
          account.id === action.payload.id ? action.payload : account
        )
      };
    case 'DELETE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.filter(account => account.id !== action.payload)
      };
    
    // Categorias
    case 'SET_CATEGORIES_LOADING':
      return { ...state, categoriesLoading: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id ? action.payload : category
        )
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload)
      };
    
    // Transações
    case 'SET_TRANSACTIONS_LOADING':
      return { ...state, transactionsLoading: action.payload };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(transaction =>
          transaction.id === action.payload.id ? action.payload : transaction
        )
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction.id !== action.payload)
      };
    
    // Cartões de Crédito
    case 'SET_CREDIT_CARDS_LOADING':
      return { ...state, creditCardsLoading: action.payload };
    case 'SET_CREDIT_CARDS':
      return { ...state, creditCards: action.payload };
    case 'ADD_CREDIT_CARD':
      return { ...state, creditCards: [...state.creditCards, action.payload] };
    case 'UPDATE_CREDIT_CARD':
      return {
        ...state,
        creditCards: state.creditCards.map(card =>
          card.id === action.payload.id ? action.payload : card
        )
      };
    case 'DELETE_CREDIT_CARD':
      return {
        ...state,
        creditCards: state.creditCards.filter(card => card.id !== action.payload)
      };
    
    // Faturas
    case 'SET_BILLS_LOADING':
      return { ...state, billsLoading: action.payload };
    case 'SET_CREDIT_CARD_BILLS':
      return { ...state, creditCardBills: action.payload };
    case 'ADD_CREDIT_CARD_BILL':
      return { ...state, creditCardBills: [...state.creditCardBills, action.payload] };
    case 'UPDATE_CREDIT_CARD_BILL':
      return {
        ...state,
        creditCardBills: state.creditCardBills.map(bill =>
          bill.id === action.payload.id ? action.payload : bill
        )
      };
    case 'DELETE_CREDIT_CARD_BILL':
      return {
        ...state,
        creditCardBills: state.creditCardBills.filter(bill => bill.id !== action.payload)
      };
    
    // Orçamentos
    case 'SET_BUDGETS_LOADING':
      return { ...state, budgetsLoading: action.payload };
    case 'SET_BUDGETS':
      return { ...state, budgets: action.payload };
    case 'ADD_BUDGET':
      return { ...state, budgets: [...state.budgets, action.payload] };
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(budget =>
          budget.id === action.payload.id ? action.payload : budget
        )
      };
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(budget => budget.id !== action.payload)
      };
    
    // Reset
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
};

// ===== CONTEXT =====

const MockContext = createContext<MockContextType | undefined>(undefined);

// ===== PROVIDER =====

interface MockProviderProps {
  children: ReactNode;
}

export const MockProvider: React.FC<MockProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(mockReducer, initialState);

  // ===== PERSISTÊNCIA LOCAL =====
  
  // Carregar estado do localStorage na inicialização
  useEffect(() => {
    const loadPersistedState = () => {
      try {
        const persistedState = localStorage.getItem('detetive_financeiro_mock_state');
        if (persistedState) {
          const parsedState = JSON.parse(persistedState);
          
          // Restaurar apenas dados que devem persistir
          if (parsedState.accounts) {
            dispatch({ type: 'SET_ACCOUNTS', payload: parsedState.accounts });
          }
          if (parsedState.categories) {
            dispatch({ type: 'SET_CATEGORIES', payload: parsedState.categories });
          }
          if (parsedState.transactions) {
            dispatch({ type: 'SET_TRANSACTIONS', payload: parsedState.transactions });
          }
          if (parsedState.creditCards) {
            dispatch({ type: 'SET_CREDIT_CARDS', payload: parsedState.creditCards });
          }
          if (parsedState.creditCardBills) {
            dispatch({ type: 'SET_CREDIT_CARD_BILLS', payload: parsedState.creditCardBills });
          }
          if (parsedState.budgets) {
            dispatch({ type: 'SET_BUDGETS', payload: parsedState.budgets });
          }
        }
      } catch (error) {
        console.warn('Erro ao carregar estado persistido:', error);
      }
    };

    loadPersistedState();
  }, []);

  // Salvar estado no localStorage quando mudar
  useEffect(() => {
    const savePersistedState = () => {
      try {
        const stateToPersist = {
          accounts: state.accounts,
          categories: state.categories,
          transactions: state.transactions,
          creditCards: state.creditCards,
          creditCardBills: state.creditCardBills,
          budgets: state.budgets,
        };
        localStorage.setItem('detetive_financeiro_mock_state', JSON.stringify(stateToPersist));
      } catch (error) {
        console.warn('Erro ao salvar estado no localStorage:', error);
      }
    };

    // Salvar apenas se não estiver no estado inicial
    if (state.accounts.length > 0 || state.categories.length > 0 || state.transactions.length > 0) {
      savePersistedState();
    }
  }, [state.accounts, state.categories, state.transactions, state.creditCards, state.creditCardBills, state.budgets]);

  // ===== CARREGAMENTO AUTOMÁTICO DE DADOS =====
  
  // Carregar dados automaticamente após login bem-sucedido
  useEffect(() => {
    const loadInitialData = async () => {
      if (state.isAuthenticated && state.user) {
        // Só carregar se não houver dados persistidos
        const hasPersistedData = state.accounts.length > 0 || state.categories.length > 0;
        
        if (!hasPersistedData) {
          console.log('Carregando dados iniciais após login...');
          try {
            // Primeiro carregar categorias (sempre disponíveis)
            await fetchCategories();
            
            // Carregar contas do usuário
            await fetchAccounts();
            
            // Se o usuário não tiver contas, criar contas padrão
            const userAccounts = await mockStore.getAccounts(state.user.id);
            if (userAccounts.length === 0) {
              console.log('Criando contas padrão para novo usuário...');
              await createDefaultAccountsForUser(state.user.id);
              await fetchAccounts(); // Recarregar após criar
            }
            
            await Promise.all([
              fetchCreditCards(),
              fetchTransactions()
            ]);
          } catch (error) {
            console.error('Erro ao carregar dados iniciais:', error);
          }
        }
      }
    };

    loadInitialData();
  }, [state.isAuthenticated, state.user]);

  // ===== AUTENTICAÇÃO =====

  const signIn = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const result = await mockStore.signIn(email, password);
      
      if (result.user) {
        dispatch({ type: 'SET_USER', payload: result.user });
        dispatch({ type: 'SET_SESSION', payload: mockStore.getCurrentSession() });
        dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error?.message || 'Erro no login' });
      }
      
      return result;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro inesperado no login' });
      return { user: null, error };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const result = await mockStore.signUp(email, password, fullName);
      
      if (result.user) {
        dispatch({ type: 'SET_USER', payload: result.user });
        dispatch({ type: 'SET_SESSION', payload: mockStore.getCurrentSession() });
        dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error?.message || 'Erro no cadastro' });
      }
      
      return result;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro inesperado no cadastro' });
      return { user: null, error };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const signOut = async () => {
    await mockStore.signOut();
    dispatch({ type: 'RESET_STATE' });
  };

  const refreshSession = async () => {
    return await mockStore.refreshSession();
  };

  const isSessionExpiringSoon = () => {
    return mockStore.isSessionExpiringSoon();
  };

  // ===== CONTAS =====

  const fetchAccounts = async () => {
    if (!state.user) return;
    
    dispatch({ type: 'SET_ACCOUNTS_LOADING', payload: true });
    try {
      const accounts = await mockStore.getAccounts(state.user.id);
      dispatch({ type: 'SET_ACCOUNTS', payload: accounts });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar contas' });
    } finally {
      dispatch({ type: 'SET_ACCOUNTS_LOADING', payload: false });
    }
  };

  const createAccount = async (data: CreateAccount) => {
    if (!state.user) return null;
    
    try {
      const account = await mockStore.createAccount({ ...data, user_id: state.user.id });
      if (account) {
        dispatch({ type: 'ADD_ACCOUNT', payload: account });
      }
      return account;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao criar conta' });
      return null;
    }
  };

  const updateAccount = async (id: string, data: UpdateAccount) => {
    try {
      const account = await mockStore.updateAccount(id, data);
      if (account) {
        dispatch({ type: 'UPDATE_ACCOUNT', payload: account });
      }
      return account;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao atualizar conta' });
      return null;
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      const success = await mockStore.deleteAccount(id);
      if (success) {
        dispatch({ type: 'DELETE_ACCOUNT', payload: id });
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao deletar conta' });
      return false;
    }
  };

  const getAccountById = (id: string) => {
    return state.accounts.find(account => account.id === id);
  };

  const getDefaultAccount = () => {
    return state.accounts.find(account => account.is_default);
  };

  const getTotalBalance = () => {
    return state.accounts.reduce((total, account) => total + (account.current_balance || 0), 0);
  };

  // ===== CATEGORIAS =====

  const fetchCategories = async () => {
    if (!state.user) return;
    
    dispatch({ type: 'SET_CATEGORIES_LOADING', payload: true });
    try {
      const categories = await mockStore.getCategories(state.user.id);
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar categorias' });
    } finally {
      dispatch({ type: 'SET_CATEGORIES_LOADING', payload: false });
    }
  };

  const createCategory = async (data: CreateCategory) => {
    if (!state.user) return null;
    
    try {
      const category = await mockStore.createCategory({ ...data, user_id: state.user.id });
      if (category) {
        dispatch({ type: 'ADD_CATEGORY', payload: category });
      }
      return category;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao criar categoria' });
      return null;
    }
  };

  const updateCategory = async (id: string, data: UpdateCategory) => {
    try {
      const category = await mockStore.updateCategory(id, data);
      if (category) {
        dispatch({ type: 'UPDATE_CATEGORY', payload: category });
      }
      return category;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao atualizar categoria' });
      return null;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const success = await mockStore.deleteCategory(id);
      if (success) {
        dispatch({ type: 'DELETE_CATEGORY', payload: id });
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao deletar categoria' });
      return false;
    }
  };

  const getCategoryById = (id: string) => {
    return state.categories.find(category => category.id === id);
  };

  const getCategoriesByType = (type: string) => {
    return state.categories.filter(category => category.type === type);
  };

  const getRootCategories = () => {
    return state.categories.filter(category => !category.parent_id);
  };

  // ===== TRANSAÇÕES =====

  const fetchTransactions = async (filters?: TransactionFilters) => {
    if (!state.user) return;
    
    dispatch({ type: 'SET_TRANSACTIONS_LOADING', payload: true });
    try {
      const transactions = await mockStore.getTransactions(state.user.id, filters);
      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar transações' });
    } finally {
      dispatch({ type: 'SET_TRANSACTIONS_LOADING', payload: false });
    }
  };

  const createTransaction = async (data: CreateTransaction) => {
    if (!state.user) return null;
    
    try {
      const transaction = await mockStore.createTransaction({ ...data, user_id: state.user.id });
      if (transaction) {
        dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
      }
      return transaction;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao criar transação' });
      return null;
    }
  };

  const updateTransaction = async (id: string, data: UpdateTransaction) => {
    try {
      const transaction = await mockStore.updateTransaction(id, data);
      if (transaction) {
        dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
      }
      return transaction;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao atualizar transação' });
      return null;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const success = await mockStore.deleteTransaction(id);
      if (success) {
        dispatch({ type: 'DELETE_TRANSACTION', payload: id });
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao deletar transação' });
      return false;
    }
  };

  const getTransactionById = (id: string) => {
    return state.transactions.find(transaction => transaction.id === id);
  };

  const getTransactionsByAccount = (accountId: string) => {
    return state.transactions.filter(transaction => transaction.account_id === accountId);
  };

  const getTransactionsByCategory = (categoryId: string) => {
    return state.transactions.filter(transaction => transaction.category_id === categoryId);
  };

  const getTransactionsByDateRange = (startDate: string, endDate: string) => {
    return state.transactions.filter(transaction => 
      transaction.date >= startDate && transaction.date <= endDate
    );
  };

  // ===== CARTÕES DE CRÉDITO =====

  const fetchCreditCards = async () => {
    if (!state.user) return;
    
    dispatch({ type: 'SET_CREDIT_CARDS_LOADING', payload: true });
    try {
      const creditCards = await mockStore.getCreditCards(state.user.id);
      dispatch({ type: 'SET_CREDIT_CARDS', payload: creditCards });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar cartões' });
    } finally {
      dispatch({ type: 'SET_CREDIT_CARDS_LOADING', payload: false });
    }
  };

  const createCreditCard = async (data: CreateCreditCard) => {
    if (!state.user) return null;
    
    try {
      const creditCard = await mockStore.createCreditCard({ ...data, user_id: state.user.id });
      if (creditCard) {
        dispatch({ type: 'ADD_CREDIT_CARD', payload: creditCard });
      }
      return creditCard;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao criar cartão' });
      return null;
    }
  };

  const updateCreditCard = async (id: string, data: UpdateCreditCard) => {
    try {
      const creditCard = await mockStore.updateCreditCard(id, data);
      if (creditCard) {
        dispatch({ type: 'UPDATE_CREDIT_CARD', payload: creditCard });
      }
      return creditCard;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao atualizar cartão' });
      return null;
    }
  };

  const deleteCreditCard = async (id: string) => {
    try {
      const success = await mockStore.deleteCreditCard(id);
      if (success) {
        dispatch({ type: 'DELETE_CREDIT_CARD', payload: id });
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao deletar cartão' });
      return false;
    }
  };

  const getCreditCardById = (id: string) => {
    return state.creditCards.find(card => card.id === id);
  };

  const getDefaultCreditCard = () => {
    return state.creditCards.find(card => card.is_default);
  };

  const setDefaultCreditCard = async (id: string) => {
    try {
      const success = await mockStore.setDefaultCreditCard(id);
      if (success) {
        // Recarregar cartões para refletir mudanças
        await fetchCreditCards();
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao definir cartão padrão' });
      return false;
    }
  };

  const getTotalCreditLimit = () => {
    return state.creditCards.reduce((total, card) => total + (card.credit_limit || 0), 0);
  };

  const getTotalAvailableLimit = () => {
    return state.creditCards.reduce((total, card) => total + (card.available_limit || 0), 0);
  };

  // ===== FATURAS =====

  const fetchCreditCardBills = async () => {
    if (!state.user) return;
    
    dispatch({ type: 'SET_BILLS_LOADING', payload: true });
    try {
      const bills = await mockStore.getCreditCardBills(state.user.id);
      dispatch({ type: 'SET_CREDIT_CARD_BILLS', payload: bills });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar faturas' });
    } finally {
      dispatch({ type: 'SET_BILLS_LOADING', payload: false });
    }
  };

  const createCreditCardBill = async (data: CreateCreditCardBill) => {
    try {
      const bill = await mockStore.createCreditCardBill(data);
      if (bill) {
        dispatch({ type: 'ADD_CREDIT_CARD_BILL', payload: bill });
      }
      return bill;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao criar fatura' });
      return null;
    }
  };

  const updateCreditCardBill = async (id: string, data: UpdateCreditCardBill) => {
    try {
      const bill = await mockStore.updateCreditCardBill(id, data);
      if (bill) {
        dispatch({ type: 'UPDATE_CREDIT_CARD_BILL', payload: bill });
      }
      return bill;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao atualizar fatura' });
      return null;
    }
  };

  const deleteCreditCardBill = async (id: string) => {
    try {
      const success = await mockStore.deleteCreditCardBill(id);
      if (success) {
        dispatch({ type: 'DELETE_CREDIT_CARD_BILL', payload: id });
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao deletar fatura' });
      return false;
    }
  };

  const getBillById = (id: string) => {
    return state.creditCardBills.find(bill => bill.id === id);
  };

  const getBillsByCard = (cardId: string) => {
    return state.creditCardBills.filter(bill => bill.card_id === cardId);
  };

  const getOpenBills = () => {
    return state.creditCardBills.filter(bill => !bill.is_paid);
  };

  const getPaidBills = () => {
    return state.creditCardBills.filter(bill => bill.is_paid);
  };

  const markBillAsPaid = async (id: string) => {
    try {
      const success = await mockStore.markBillAsPaid(id);
      if (success) {
        // Recarregar faturas para refletir mudanças
        await fetchCreditCardBills();
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao marcar fatura como paga' });
      return false;
    }
  };

  const getTotalOpenBills = () => {
    return getOpenBills().reduce((total, bill) => total + (bill.total_amount || 0), 0);
  };

  const getTotalPaidBills = () => {
    return getPaidBills().reduce((total, bill) => total + (bill.total_amount || 0), 0);
  };

  // ===== ORÇAMENTOS =====

  const fetchBudgets = async () => {
    if (!state.user) return;
    
    dispatch({ type: 'SET_BUDGETS_LOADING', payload: true });
    try {
      const budgets = await mockStore.getBudgets(state.user.id);
      dispatch({ type: 'SET_BUDGETS', payload: budgets });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar orçamentos' });
    } finally {
      dispatch({ type: 'SET_BUDGETS_LOADING', payload: false });
    }
  };

  const createBudget = async (data: CreateBudget) => {
    if (!state.user) return null;
    
    try {
      const budget = await mockStore.createBudget({ ...data, user_id: state.user.id });
      if (budget) {
        dispatch({ type: 'ADD_BUDGET', payload: budget });
      }
      return budget;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao criar orçamento' });
      return null;
    }
  };

  const updateBudget = async (id: string, data: UpdateBudget) => {
    try {
      const budget = await mockStore.updateBudget(id, data);
      if (budget) {
        dispatch({ type: 'UPDATE_BUDGET', payload: budget });
      }
      return budget;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao atualizar orçamento' });
      return null;
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      const success = await mockStore.deleteBudget(id);
      if (success) {
        dispatch({ type: 'DELETE_BUDGET', payload: id });
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao deletar orçamento' });
      return false;
    }
  };

  const getBudgetById = (id: string) => {
    return state.budgets.find(budget => budget.id === id);
  };

  // ===== UTILITÁRIOS =====

  const createDefaultAccountsForUser = async (userId: string) => {
    try {
      // Criar conta principal padrão
      await createAccount({
        user_id: userId,
        name: 'Conta Principal',
        type: 'CHECKING',
        bank_name: 'Banco do Brasil',
        bank_code: '001',
        agency_number: '1234',
        account_number: '12345-6',
        current_balance: 5000.00,
        initial_balance: 5000.00,
        color: '#3B82F6',
        icon: '🏦',
        is_active: true,
        is_default: true,
        include_in_total: true,
        sync_enabled: false
      });

      // Criar conta poupança
      await createAccount({
        user_id: userId,
        name: 'Conta Poupança',
        type: 'SAVINGS',
        bank_name: 'Banco do Brasil',
        bank_code: '001',
        agency_number: '1234',
        account_number: '65432-1',
        current_balance: 15000.00,
        initial_balance: 10000.00,
        color: '#10B981',
        icon: '💰',
        is_active: true,
        is_default: false,
        include_in_total: true,
        sync_enabled: false
      });

      // Criar carteira
      await createAccount({
        user_id: userId,
        name: 'Carteira',
        type: 'CASH',
        current_balance: 500.00,
        initial_balance: 500.00,
        color: '#F59E0B',
        icon: '💵',
        is_active: true,
        is_default: false,
        include_in_total: true,
        sync_enabled: false
      });

      console.log('Contas padrão criadas com sucesso para o usuário:', userId);
    } catch (error) {
      console.error('Erro ao criar contas padrão:', error);
    }
  };

  const reset = () => {
    mockStore.reset();
    dispatch({ type: 'RESET_STATE' });
  };

  // ===== CONTEXT VALUE =====

  const contextValue: MockContextType = {
    ...state,
    
    // Autenticação
    signIn,
    signUp,
    signOut,
    refreshSession,
    isSessionExpiringSoon,
    
    // Contas
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    getAccountById,
    getDefaultAccount,
    getTotalBalance,
    
    // Categorias
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getCategoriesByType,
    getRootCategories,
    
    // Transações
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionById,
    getTransactionsByAccount,
    getTransactionsByCategory,
    getTransactionsByDateRange,
    
    // Cartões de Crédito
    fetchCreditCards,
    createCreditCard,
    updateCreditCard,
    deleteCreditCard,
    getCreditCardById,
    getDefaultCreditCard,
    setDefaultCreditCard,
    getTotalCreditLimit,
    getTotalAvailableLimit,
    
    // Faturas
    fetchCreditCardBills,
    createCreditCardBill,
    updateCreditCardBill,
    deleteCreditCardBill,
    getBillById,
    getBillsByCard,
    getOpenBills,
    getPaidBills,
    markBillAsPaid,
    getTotalOpenBills,
    getTotalPaidBills,
    
    // Orçamentos
    fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    getBudgetById,
    
    // Utilitários
    reset,
  };

  return (
    <MockContext.Provider value={contextValue}>
      {children}
    </MockContext.Provider>
  );
};

// ===== HOOK =====

export const useMockStore = () => {
  const context = useContext(MockContext);
  if (context === undefined) {
    throw new Error('useMockStore must be used within a MockProvider');
  }
  return context;
};

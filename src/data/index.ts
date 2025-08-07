// Exportações principais do sistema de dados mock

// Tipos
export * from './types';

// Store principal
export { default as mockStore, MockStore } from './store/mockStore';

// Dados mock (para referência e testes)
export { mockUsers, defaultUser } from './mock/users';
export { mockAccounts } from './mock/accounts';
export { mockCategories } from './mock/categories';
export { mockTransactions } from './mock/transactions';
export { mockCreditCards } from './mock/creditCards';
export { mockCreditCardBills } from './mock/bills';

// Funções utilitárias
export { generateUserId } from './mock/users';
export { generateAccountId } from './mock/accounts';
export { generateCategoryId } from './mock/categories';
export { generateTransactionId } from './mock/transactions';
export { generateCreditCardId } from './mock/creditCards';
export { generateBillId } from './mock/bills';

// Funções de busca
export { findUserById, findUserByEmail } from './mock/users';
export { 
  findAccountsByUserId, 
  findAccountById, 
  findDefaultAccountByUserId,
  calculateTotalBalance 
} from './mock/accounts';
export { 
  findCategoriesByUserId, 
  findCategoryById, 
  findCategoriesByType,
  findChildCategories,
  findRootCategories 
} from './mock/categories';
export { 
  findTransactionsByUserId, 
  findTransactionById, 
  findTransactionsByAccountId,
  findTransactionsByCategoryId,
  findTransactionsByDateRange,
  findTransactionsByType,
  calculateBalanceByPeriod,
  findRecurringTransactions 
} from './mock/transactions';
export { 
  findCreditCardsByUserId, 
  findCreditCardById, 
  findDefaultCreditCardByUserId,
  findVirtualCreditCards,
  findCreditCardsByBrand,
  findCreditCardsByType,
  calculateTotalAvailableLimit,
  calculateTotalCreditLimit 
} from './mock/creditCards';
export { 
  findBillsByCardId, 
  findBillById, 
  findBillsByUserId,
  findOpenBills,
  findPaidBills,
  findBillsByPeriod,
  findCurrentBill,
  findNextDueBill,
  findOverdueBills,
  calculateTotalOpenBills,
  calculateTotalPaidBills 
} from './mock/bills';

// Funções de criação
export { createMockUser } from './mock/users';
export { createMockAccount } from './mock/accounts';
export { createMockCategory } from './mock/categories';
export { createMockTransaction } from './mock/transactions';
export { createMockCreditCard } from './mock/creditCards';
export { createMockBill } from './mock/bills';

// Funções de atualização
export { updateMockAccount } from './mock/accounts';
export { updateMockCategory } from './mock/categories';
export { updateMockTransaction } from './mock/transactions';
export { updateMockCreditCard } from './mock/creditCards';
export { updateMockBill } from './mock/bills';

// Funções de exclusão
export { deleteMockAccount } from './mock/accounts';
export { deleteMockCategory } from './mock/categories';
export { deleteMockTransaction } from './mock/transactions';
export { deleteMockCreditCard } from './mock/creditCards';

// Funções específicas
export { setDefaultCreditCard } from './mock/creditCards';
export { markBillAsPaid } from './mock/bills';

// Métodos de sessão e autenticação
export const MockAuth = {
  // Verificar se está autenticado
  isAuthenticated: () => mockStore.isAuthenticated(),
  
  // Obter usuário atual
  getCurrentUser: () => mockStore.getCurrentUser(),
  
  // Obter sessão atual
  getCurrentSession: () => mockStore.getCurrentSession(),
  
  // Renovar sessão
  refreshSession: () => mockStore.refreshSession(),
  
  // Verificar se sessão está expirando
  isSessionExpiringSoon: () => mockStore.isSessionExpiringSoon(),
  
  // Resetar sessão
  reset: () => mockStore.reset()
};

// Configurações e constantes
export const MOCK_CONFIG = {
  // Delays simulados para operações
  DELAYS: {
    AUTH: 500,
    READ: 200,
    WRITE: 300,
    DELETE: 300,
    COMPLEX: 500
  },
  
  // Configurações de paginação
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100
  },
  
  // Configurações de cache
  CACHE: {
    TTL: 5 * 60 * 1000, // 5 minutos
    MAX_ITEMS: 1000
  }
};

// Utilitários para desenvolvimento
export const MockUtils = {
  // Resetar todos os dados mock
  resetAllData: () => {
    // Esta função seria implementada se necessário resetar os dados
    console.log('Mock data reset requested');
  },
  
  // Gerar dados de exemplo
  generateSampleData: (userId: string) => {
    console.log(`Generating sample data for user: ${userId}`);
    // Implementação futura para gerar dados de exemplo
  },
  
  // Exportar dados mock
  exportMockData: () => {
    return {
      users: mockUsers,
      accounts: mockAccounts,
      categories: mockCategories,
      transactions: mockTransactions,
      creditCards: mockCreditCards,
      bills: mockCreditCardBills
    };
  }
};

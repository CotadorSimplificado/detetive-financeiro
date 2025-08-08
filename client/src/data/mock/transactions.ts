import { Transaction, TransactionType } from '../types';

// Dados mock para transações
export const mockTransactions: Transaction[] = [
  // Receitas
  {
    id: '1',
    user_id: '1',
    account_id: '1',
    category_id: '1',
    description: 'Salário Janeiro 2024',
    amount: 5000.00,
    type: 'INCOME',
    date: '2024-01-05',
    notes: 'Salário mensal',
    is_recurring: true,
    recurrence_type: 'MONTHLY',
    recurrence_interval: 1,
    is_installment: false,
    is_transfer: false,
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z'
  },
  {
    id: '2',
    user_id: '1',
    account_id: '1',
    category_id: '2',
    description: 'Freelance - Desenvolvimento Web',
    amount: 1500.00,
    type: 'INCOME',
    date: '2024-01-15',
    notes: 'Projeto cliente ABC',
    is_recurring: false,
    is_installment: false,
    is_transfer: false,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '3',
    user_id: '1',
    account_id: '4',
    category_id: '3',
    description: 'Dividendos - Ações',
    amount: 300.00,
    type: 'INCOME',
    date: '2024-01-20',
    notes: 'Dividendos mensais',
    is_recurring: true,
    recurrence_type: 'MONTHLY',
    recurrence_interval: 1,
    is_installment: false,
    is_transfer: false,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  },

  // Despesas - Alimentação
  {
    id: '4',
    user_id: '1',
    account_id: '1',
    category_id: '6',
    description: 'Supermercado Extra',
    amount: -250.00,
    type: 'EXPENSE',
    date: '2024-01-08',
    notes: 'Compras da semana',
    location: 'Extra - Shopping Center',
    is_recurring: true,
    recurrence_type: 'WEEKLY',
    recurrence_interval: 1,
    is_installment: false,
    is_transfer: false,
    created_at: '2024-01-08T00:00:00Z',
    updated_at: '2024-01-08T00:00:00Z'
  },
  {
    id: '5',
    user_id: '1',
    account_id: '1',
    category_id: '7',
    description: 'Restaurante Italiano',
    amount: -85.00,
    type: 'EXPENSE',
    date: '2024-01-12',
    notes: 'Jantar com amigos',
    location: 'Restaurante Bella Italia',
    is_recurring: false,
    is_installment: false,
    is_transfer: false,
    created_at: '2024-01-12T00:00:00Z',
    updated_at: '2024-01-12T00:00:00Z'
  },
  {
    id: '6',
    user_id: '1',
    account_id: '1',
    category_id: '7',
    description: 'McDonald\'s',
    amount: -35.00,
    type: 'EXPENSE',
    date: '2024-01-18',
    notes: 'Almoço rápido',
    location: 'McDonald\'s - Centro',
    is_recurring: false,
    is_installment: false,
    is_transfer: false,
    created_at: '2024-01-18T00:00:00Z',
    updated_at: '2024-01-18T00:00:00Z'
  },

  // Despesas - Transporte
  {
    id: '7',
    user_id: '1',
    account_id: '1',
    category_id: '9',
    description: 'Combustível - Posto Ipiranga',
    amount: -120.00,
    type: 'EXPENSE',
    date: '2024-01-10',
    notes: 'Abastecimento completo',
    location: 'Posto Ipiranga - Av. Paulista',
    is_recurring: true,
    recurrence_type: 'WEEKLY',
    recurrence_interval: 2,
    is_installment: false,
    is_transfer: false,
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  },
  {
    id: '8',
    user_id: '1',
    account_id: '1',
    category_id: '10',
    description: 'Uber - Casa para Trabalho',
    amount: -25.00,
    type: 'EXPENSE',
    date: '2024-01-14',
    notes: 'Corrida matinal',
    location: 'Uber',
    is_recurring: false,
    is_installment: false,
    is_transfer: false,
    created_at: '2024-01-14T00:00:00Z',
    updated_at: '2024-01-14T00:00:00Z'
  },

  // Despesas - Moradia
  {
    id: '9',
    user_id: '1',
    account_id: '1',
    category_id: '12',
    description: 'Aluguel Apartamento',
    amount: -1800.00,
    type: 'EXPENSE',
    date: '2024-01-01',
    notes: 'Aluguel mensal',
    is_recurring: true,
    recurrence_type: 'MONTHLY',
    recurrence_interval: 1,
    is_installment: false,
    is_transfer: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '10',
    user_id: '1',
    account_id: '1',
    category_id: '13',
    description: 'Conta de Luz',
    amount: -150.00,
    type: 'EXPENSE',
    date: '2024-01-15',
    notes: 'Energia elétrica',
    is_recurring: true,
    recurrence_type: 'MONTHLY',
    recurrence_interval: 1,
    is_installment: false,
    is_transfer: false,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '11',
    user_id: '1',
    account_id: '1',
    category_id: '13',
    description: 'Conta de Água',
    amount: -80.00,
    type: 'EXPENSE',
    date: '2024-01-15',
    notes: 'Água e esgoto',
    is_recurring: true,
    recurrence_type: 'MONTHLY',
    recurrence_interval: 1,
    is_installment: false,
    is_transfer: false,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },

  // Despesas - Lazer
  {
    id: '12',
    user_id: '1',
    account_id: '1',
    category_id: '15',
    description: 'Cinema - Vingadores',
    amount: -45.00,
    type: 'EXPENSE',
    date: '2024-01-20',
    notes: 'Ingresso + pipoca',
    location: 'Cinemark - Shopping',
    is_recurring: false,
    is_installment: false,
    is_transfer: false,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  },
  {
    id: '13',
    user_id: '1',
    account_id: '1',
    category_id: '16',
    description: 'Viagem - São Paulo para Rio',
    amount: -800.00,
    type: 'EXPENSE',
    date: '2024-01-25',
    notes: 'Passagem aérea + hotel',
    location: 'Rio de Janeiro',
    is_recurring: false,
    is_installment: true,
    installment_number: 1,
    installment_total: 3,
    installment_group_id: 'viagem-rio-2024',
    is_transfer: false,
    created_at: '2024-01-25T00:00:00Z',
    updated_at: '2024-01-25T00:00:00Z'
  },

  // Despesas - Saúde
  {
    id: '14',
    user_id: '1',
    account_id: '1',
    category_id: '18',
    description: 'Farmácia - Medicamentos',
    amount: -65.00,
    type: 'EXPENSE',
    date: '2024-01-22',
    notes: 'Antibiótico + analgésico',
    location: 'Drogaria São Paulo',
    is_recurring: false,
    is_installment: false,
    is_transfer: false,
    created_at: '2024-01-22T00:00:00Z',
    updated_at: '2024-01-22T00:00:00Z'
  },

  // Transferências
  {
    id: '15',
    user_id: '1',
    account_id: '1',
    transfer_to_id: '2',
    category_id: '19',
    description: 'Transferência para Poupança',
    amount: -1000.00,
    type: 'TRANSFER',
    date: '2024-01-10',
    notes: 'Aporte mensal na poupança',
    is_recurring: true,
    recurrence_type: 'MONTHLY',
    recurrence_interval: 1,
    is_installment: false,
    is_transfer: true,
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  },
  {
    id: '16',
    user_id: '1',
    account_id: '2',
    transfer_from_id: '1',
    category_id: '19',
    description: 'Transferência da Conta Principal',
    amount: 1000.00,
    type: 'TRANSFER',
    date: '2024-01-10',
    notes: 'Aporte mensal na poupança',
    is_recurring: true,
    recurrence_type: 'MONTHLY',
    recurrence_interval: 1,
    is_installment: false,
    is_transfer: true,
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  }
];

// Função para gerar ID único
export const generateTransactionId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Função para buscar transações por usuário
export const findTransactionsByUserId = (userId: string): Transaction[] => {
  return mockTransactions.filter(transaction => 
    transaction.user_id === userId && 
    !transaction.deleted_at
  );
};

// Função para buscar transação por ID
export const findTransactionById = (id: string): Transaction | undefined => {
  return mockTransactions.find(transaction => 
    transaction.id === id && 
    !transaction.deleted_at
  );
};

// Função para buscar transações por conta
export const findTransactionsByAccountId = (accountId: string): Transaction[] => {
  return mockTransactions.filter(transaction => 
    transaction.account_id === accountId && 
    !transaction.deleted_at
  );
};

// Função para buscar transações por categoria
export const findTransactionsByCategoryId = (categoryId: string): Transaction[] => {
  return mockTransactions.filter(transaction => 
    transaction.category_id === categoryId && 
    !transaction.deleted_at
  );
};

// Função para buscar transações por período
export const findTransactionsByDateRange = (userId: string, startDate: string, endDate: string): Transaction[] => {
  return mockTransactions.filter(transaction => 
    transaction.user_id === userId &&
    transaction.date >= startDate &&
    transaction.date <= endDate &&
    !transaction.deleted_at
  );
};

// Função para buscar transações por tipo
export const findTransactionsByType = (userId: string, type: TransactionType): Transaction[] => {
  return mockTransactions.filter(transaction => 
    transaction.user_id === userId &&
    transaction.type === type &&
    !transaction.deleted_at
  );
};

// Função para criar nova transação
export const createMockTransaction = (transactionData: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Transaction => {
  const now = new Date().toISOString();
  const newTransaction: Transaction = {
    ...transactionData,
    id: generateTransactionId(),
    created_at: now,
    updated_at: now
  };
  
  mockTransactions.push(newTransaction);
  return newTransaction;
};

// Função para atualizar transação
export const updateMockTransaction = (id: string, updates: Partial<Omit<Transaction, 'id' | 'created_at' | 'user_id'>>): Transaction | null => {
  const index = mockTransactions.findIndex(transaction => transaction.id === id);
  if (index === -1) return null;
  
  mockTransactions[index] = {
    ...mockTransactions[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  return mockTransactions[index];
};

// Função para deletar transação (soft delete)
export const deleteMockTransaction = (id: string): boolean => {
  const index = mockTransactions.findIndex(transaction => transaction.id === id);
  if (index === -1) return false;
  
  mockTransactions[index].deleted_at = new Date().toISOString();
  mockTransactions[index].updated_at = new Date().toISOString();
  
  return true;
};

// Função para calcular saldo por período
export const calculateBalanceByPeriod = (userId: string, startDate: string, endDate: string): number => {
  return mockTransactions
    .filter(transaction => 
      transaction.user_id === userId &&
      transaction.date >= startDate &&
      transaction.date <= endDate &&
      !transaction.deleted_at
    )
    .reduce((total, transaction) => total + transaction.amount, 0);
};

// Função para buscar transações recorrentes
export const findRecurringTransactions = (userId: string): Transaction[] => {
  return mockTransactions.filter(transaction => 
    transaction.user_id === userId &&
    transaction.is_recurring &&
    !transaction.deleted_at
  );
};

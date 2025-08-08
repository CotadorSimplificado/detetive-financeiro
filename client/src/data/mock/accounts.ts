import { Account, AccountType } from '../types';

// Dados mock para contas bancárias
export const mockAccounts: Account[] = [
  {
    id: '1',
    user_id: '1',
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
    sync_enabled: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    user_id: '1',
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
    sync_enabled: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    user_id: '1',
    name: 'Carteira',
    type: 'CASH',
    current_balance: 500.00,
    initial_balance: 500.00,
    color: '#F59E0B',
    icon: '💵',
    is_active: true,
    is_default: false,
    include_in_total: true,
    sync_enabled: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    user_id: '1',
    name: 'Investimentos',
    type: 'INVESTMENT',
    bank_name: 'XP Investimentos',
    current_balance: 25000.00,
    initial_balance: 20000.00,
    color: '#8B5CF6',
    icon: '📈',
    is_active: true,
    is_default: false,
    include_in_total: false,
    sync_enabled: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Função para gerar ID único
export const generateAccountId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Função para buscar contas por usuário
export const findAccountsByUserId = (userId: string): Account[] => {
  return mockAccounts.filter(account => account.user_id === userId && !account.deleted_at);
};

// Função para buscar conta por ID
export const findAccountById = (id: string): Account | undefined => {
  return mockAccounts.find(account => account.id === id && !account.deleted_at);
};

// Função para buscar conta padrão do usuário
export const findDefaultAccountByUserId = (userId: string): Account | undefined => {
  return mockAccounts.find(account => 
    account.user_id === userId && 
    account.is_default && 
    account.is_active && 
    !account.deleted_at
  );
};

// Função para criar nova conta
export const createMockAccount = (accountData: Omit<Account, 'id' | 'created_at' | 'updated_at'>): Account => {
  const now = new Date().toISOString();
  const newAccount: Account = {
    ...accountData,
    id: generateAccountId(),
    created_at: now,
    updated_at: now
  };
  
  mockAccounts.push(newAccount);
  return newAccount;
};

// Função para atualizar conta
export const updateMockAccount = (id: string, updates: Partial<Omit<Account, 'id' | 'created_at' | 'user_id'>>): Account | null => {
  const index = mockAccounts.findIndex(account => account.id === id);
  if (index === -1) return null;
  
  mockAccounts[index] = {
    ...mockAccounts[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  return mockAccounts[index];
};

// Função para deletar conta (soft delete)
export const deleteMockAccount = (id: string): boolean => {
  const index = mockAccounts.findIndex(account => account.id === id);
  if (index === -1) return false;
  
  mockAccounts[index].deleted_at = new Date().toISOString();
  mockAccounts[index].updated_at = new Date().toISOString();
  
  return true;
};

// Função para calcular saldo total das contas ativas
export const calculateTotalBalance = (userId: string): number => {
  return mockAccounts
    .filter(account => 
      account.user_id === userId && 
      account.is_active && 
      account.include_in_total && 
      !account.deleted_at
    )
    .reduce((total, account) => total + account.current_balance, 0);
};

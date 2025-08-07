import { useMockStore } from '../store/mockContext';
import { CreateAccount, UpdateAccount } from '../types';

/**
 * Hook customizado para gerenciamento de contas mock
 * Fornece métodos CRUD e estado das contas
 */
export const useMockAccounts = () => {
  const {
    accounts,
    accountsLoading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    getAccountById,
    getDefaultAccount,
    getTotalBalance,
  } = useMockStore();

  return {
    // Estado
    accounts,
    loading: accountsLoading,
    error,
    
    // Métodos CRUD
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    
    // Métodos de busca
    getAccountById,
    getDefaultAccount,
    getTotalBalance,
    
    // Utilitários
    hasAccounts: accounts.length > 0,
    accountCount: accounts.length,
    activeAccounts: accounts.filter(account => account.is_active !== false),
    defaultAccount: getDefaultAccount(),
    totalBalance: getTotalBalance(),
  };
};

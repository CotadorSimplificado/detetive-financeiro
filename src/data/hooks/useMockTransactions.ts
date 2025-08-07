import { useMockStore } from '../store/mockContext';
import { CreateTransaction, UpdateTransaction, TransactionFilters } from '../types';

/**
 * Hook customizado para gerenciamento de transações mock
 * Fornece métodos CRUD e estado das transações
 */
export const useMockTransactions = () => {
  const {
    transactions,
    transactionsLoading,
    error,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionById,
    getTransactionsByAccount,
    getTransactionsByCategory,
    getTransactionsByDateRange,
  } = useMockStore();

  return {
    // Estado
    transactions,
    loading: transactionsLoading,
    error,
    
    // Métodos CRUD
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    
    // Métodos de busca
    getTransactionById,
    getTransactionsByAccount,
    getTransactionsByCategory,
    getTransactionsByDateRange,
    
    // Utilitários
    hasTransactions: transactions.length > 0,
    transactionCount: transactions.length,
    incomeTransactions: transactions.filter(t => t.type === 'INCOME'),
    expenseTransactions: transactions.filter(t => t.type === 'EXPENSE'),
    transferTransactions: transactions.filter(t => t.type === 'TRANSFER'),
    totalIncome: transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + (t.amount || 0), 0),
    totalExpenses: transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + (t.amount || 0), 0),
    netAmount: transactions.reduce((sum, t) => {
      if (t.type === 'INCOME') return sum + (t.amount || 0);
      if (t.type === 'EXPENSE') return sum - (t.amount || 0);
      return sum;
    }, 0),
  };
};

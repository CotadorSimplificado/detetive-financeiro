// Compatibilidade: Re-exporta o hook mock de transações
import { useMockTransactions } from '@/data/hooks/useMockTransactions';

export const useTransactions = (filters?: any) => {
  const mockResult = useMockTransactions();
  
  // Aplicar filtros se fornecidos
  let filteredTransactions = mockResult.transactions;
  if (filters) {
    if (filters.type && filters.type !== 'all') {
      filteredTransactions = filteredTransactions.filter(t => t.type === filters.type);
    }
    // Remove search filter for now as it's not in the interface
    // Filtros de competência podem ser implementados aqui se necessário
  }
  
  return {
    data: filteredTransactions,
    isLoading: mockResult.loading,
    error: mockResult.error,
    ...mockResult
  };
};

// Hooks individuais para compatibilidade
export const useCreateTransaction = () => {
  const { createTransaction } = useMockTransactions();
  return createTransaction;
};

export const useUpdateTransaction = () => {
  const { updateTransaction } = useMockTransactions();
  return updateTransaction;
};

export const useDeleteTransaction = () => {
  const { deleteTransaction } = useMockTransactions();
  return deleteTransaction;
};

export const useTransactionsSummary = (filters?: any) => {
  const { 
    totalIncome, 
    totalExpenses, 
    incomeTransactions, 
    expenseTransactions,
    transferTransactions 
  } = useMockTransactions();
  
  // Aplicar filtros aos cálculos se necessário
  let filteredIncome = incomeTransactions;
  let filteredExpenses = expenseTransactions;
  let filteredTransfers = transferTransactions;
  
  // Remove search filtering for now
  
  const income = filteredIncome.reduce((sum, t) => sum + (t.amount || 0), 0);
  const expenses = filteredExpenses.reduce((sum, t) => sum + (t.amount || 0), 0);
  
  return {
    data: {
      income,
      expenses,
      balance: income - expenses,
      incomeCount: filteredIncome.length,
      expenseCount: filteredExpenses.length,
      transferCount: filteredTransfers.length,
    },
    isLoading: false,
    error: null
  };
};

export type { 
  Transaction, 
  TransactionFilters,
  CreateTransaction,
  UpdateTransaction 
} from '@/data/types';

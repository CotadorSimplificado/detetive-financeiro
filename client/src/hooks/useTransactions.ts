// Hook de transações com migração gradual: Mock -> Real API
import { useMockTransactions } from '@/data/hooks/useMockTransactions';
import { useRealTransactionsAPI } from '@/hooks/api/useRealTransactions';
import { featureFlags } from '@/lib/featureFlags';
import type { TransactionFilters } from '@/data/types';

export const useTransactions = (userId: string = 'mock-user', filters?: TransactionFilters) => {
  const useRealAPI = featureFlags.isEnabled('useRealTransactions');
  
  // Selecionar implementação baseada na feature flag
  const mockResult = useMockTransactions();
  const realResult = useRealTransactionsAPI(userId, filters);
  
  // Retornar resultado baseado na configuração
  if (useRealAPI) {
    if (featureFlags.isEnabled('debugMode')) {
      console.log('🔄 useTransactions: usando API real', { 
        transactions: realResult.transactions.length,
        loading: realResult.loading 
      });
    }
    
    return {
      data: realResult.transactions,
      loading: realResult.loading,
      error: realResult.error,
      ...realResult
    };
  } else {
    if (featureFlags.isEnabled('debugMode')) {
      console.log('🎭 useTransactions: usando mock', { 
        transactions: mockResult.transactions.length,
        loading: mockResult.loading 
      });
    }
    
    return {
      data: mockResult.transactions,
      loading: mockResult.loading,
      error: mockResult.error,
      ...mockResult
    };
  }
};

// Hooks individuais para compatibilidade
export const useCreateTransaction = (userId: string = 'mock-user') => {
  const useRealAPI = featureFlags.isEnabled('useRealTransactions');
  const { createTransaction: mockCreate } = useMockTransactions();
  const { createTransaction: realCreate } = useRealTransactionsAPI(userId);
  
  return useRealAPI ? realCreate : mockCreate;
};

export const useUpdateTransaction = (userId: string = 'mock-user') => {
  const useRealAPI = featureFlags.isEnabled('useRealTransactions');
  const { updateTransaction: mockUpdate } = useMockTransactions();
  const { updateTransaction: realUpdate } = useRealTransactionsAPI(userId);
  
  return useRealAPI ? realUpdate : mockUpdate;
};

export const useDeleteTransaction = (userId: string = 'mock-user') => {
  const useRealAPI = featureFlags.isEnabled('useRealTransactions');
  const { deleteTransaction: mockDelete } = useMockTransactions();
  const { deleteTransaction: realDelete } = useRealTransactionsAPI(userId);
  
  return useRealAPI ? realDelete : mockDelete;
};

// Hook de resumo de transações (compatibilidade)
export const useTransactionsSummary = (userId: string = 'mock-user', filters?: TransactionFilters) => {
  const { transactions, totalIncome, totalExpenses, netAmount } = useTransactions(userId, filters);
  
  return {
    totalIncome,
    totalExpenses,
    netAmount,
    transactionsCount: transactions.length,
  };
};

export type { Transaction } from '@/data/types';
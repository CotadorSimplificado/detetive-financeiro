// Compatibilidade: Re-exporta o hook mock de transações
import { useMockTransactions } from '@/data/hooks/useMockTransactions';

export const useTransactions = useMockTransactions;

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

export const useTransactionsSummary = () => {
  const { 
    totalIncome, 
    totalExpenses, 
    incomeTransactions, 
    expenseTransactions,
    transferTransactions 
  } = useMockTransactions();
  
  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    incomeCount: incomeTransactions.length,
    expenseCount: expenseTransactions.length,
    transferCount: transferTransactions.length,
  };
};

export type { 
  Transaction, 
  TransactionWithRelations,
  TransactionFilters,
  CreateTransaction,
  UpdateTransaction 
} from '@/data/types';

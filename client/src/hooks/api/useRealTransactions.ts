import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Transaction } from '@shared/schema';
import type { CreateTransaction, UpdateTransaction, TransactionFilters } from '@/data/types';

// Key para cache do React Query
const TRANSACTIONS_QUERY_KEY = '/api/transactions';

/**
 * Hook para buscar transações de um usuário
 */
export const useRealTransactions = (userId: string, filters?: TransactionFilters) => {
  const queryKey = [TRANSACTIONS_QUERY_KEY, userId, filters];
  
  return useQuery({
    queryKey,
    queryFn: () => {
      const params = new URLSearchParams({ userId });
      
      if (filters?.type) params.append('type', filters.type);
      if ((filters as any)?.competenceMonth) params.append('competenceMonth', (filters as any).competenceMonth.toString());
      if ((filters as any)?.competenceYear) params.append('competenceYear', (filters as any).competenceYear.toString());
      if (filters?.accountId) params.append('accountId', filters.accountId);
      if (filters?.categoryId) params.append('categoryId', filters.categoryId);
      if ((filters as any)?.creditCardId) params.append('creditCardId', (filters as any).creditCardId);
      
      const url = `${TRANSACTIONS_QUERY_KEY}?${params.toString()}`;
      return apiRequest(url);
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutos - transações mudam mais frequentemente
  });
};

/**
 * Hook para buscar uma transação específica por ID
 */
export const useRealTransaction = (id: string, userId: string) => {
  return useQuery({
    queryKey: [`${TRANSACTIONS_QUERY_KEY}/${id}`],
    queryFn: () => apiRequest(`${TRANSACTIONS_QUERY_KEY}/${id}?userId=${userId}`),
    enabled: !!id && !!userId,
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Hook para criar nova transação
 */
export const useCreateRealTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (transaction: CreateTransaction) => 
      apiRequest(TRANSACTIONS_QUERY_KEY, {
        method: 'POST',
        body: transaction as any,
      }),
    onSuccess: () => {
      // Invalidar cache de transações e contas (balanço pode ter mudado)
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
    },
  });
};

/**
 * Hook para atualizar transação
 */
export const useUpdateRealTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userId, transaction }: { id: string; userId: string; transaction: UpdateTransaction }) => 
      apiRequest(`${TRANSACTIONS_QUERY_KEY}/${id}`, {
        method: 'PUT',
        body: { ...transaction, userId } as any,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
    },
  });
};

/**
 * Hook para deletar transação
 */
export const useDeleteRealTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) => 
      apiRequest(`${TRANSACTIONS_QUERY_KEY}/${id}?userId=${userId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
    },
  });
};

/**
 * Hook combinado que oferece a mesma interface do mock
 */
export const useRealTransactionsAPI = (userId: string, filters?: TransactionFilters) => {
  const queryClient = useQueryClient();
  
  // Buscar todas as transações do usuário
  const { data: allTransactions = [], isLoading, error } = useRealTransactions(userId, filters);
  
  const createTransactionMutation = useCreateRealTransaction();
  const updateTransactionMutation = useUpdateRealTransaction();
  const deleteTransactionMutation = useDeleteRealTransaction();
  
  // Métodos CRUD compatíveis com a interface mock
  const fetchTransactions = async () => {
    await queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] });
  };
  
  const createTransaction = async (transaction: CreateTransaction) => {
    return createTransactionMutation.mutateAsync(transaction);
  };
  
  const updateTransaction = async (id: string, transaction: UpdateTransaction) => {
    return updateTransactionMutation.mutateAsync({ id, userId, transaction });
  };
  
  const deleteTransaction = async (id: string) => {
    return deleteTransactionMutation.mutateAsync({ id, userId });
  };
  
  const getTransactionById = (id: string) => {
    return allTransactions.find((txn: Transaction) => txn.id === id);
  };
  
  const getTransactionsByAccount = (accountId: string) => {
    return allTransactions.filter((txn: Transaction) => txn.accountId === accountId);
  };
  
  const getTransactionsByCategory = (categoryId: string) => {
    return allTransactions.filter((txn: Transaction) => txn.categoryId === categoryId);
  };
  
  const getTransactionsByDateRange = (startDate: string, endDate: string) => {
    return allTransactions.filter((txn: Transaction) => 
      txn.date >= startDate && txn.date <= endDate
    );
  };
  
  // Calcular totais
  const incomeTransactions = allTransactions.filter((t: Transaction) => t.type === 'INCOME');
  const expenseTransactions = allTransactions.filter((t: Transaction) => t.type === 'EXPENSE');
  const transferTransactions = allTransactions.filter((t: Transaction) => t.type === 'TRANSFER');
  
  const totalIncome = incomeTransactions.reduce((sum: number, t: Transaction) => sum + parseFloat(t.amount || '0'), 0);
  const totalExpenses = expenseTransactions.reduce((sum: number, t: Transaction) => sum + parseFloat(t.amount || '0'), 0);
  const netAmount = totalIncome - totalExpenses;

  return {
    // Estado
    transactions: allTransactions,
    loading: isLoading,
    error: error?.message || null,
    
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
    
    // Utilitários compatíveis com mock
    hasTransactions: allTransactions.length > 0,
    transactionCount: allTransactions.length,
    incomeTransactions,
    expenseTransactions,
    transferTransactions,
    totalIncome,
    totalExpenses,
    netAmount,
  };
};
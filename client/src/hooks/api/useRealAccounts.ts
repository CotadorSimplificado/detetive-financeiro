import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Account } from '@shared/schema';
import type { CreateAccount, UpdateAccount } from '@/data/types';

// Key para cache do React Query
const ACCOUNTS_QUERY_KEY = '/api/accounts';

/**
 * Hook para buscar contas de um usuário
 */
export const useRealAccounts = (userId: string, filters?: { type?: string; isActive?: boolean }) => {
  const queryKey = [ACCOUNTS_QUERY_KEY, userId, filters];
  
  return useQuery({
    queryKey,
    queryFn: () => {
      const params = new URLSearchParams({ userId });
      if (filters?.type) params.append('type', filters.type);
      if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      
      const url = `${ACCOUNTS_QUERY_KEY}?${params.toString()}`;
      return apiRequest(url);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para buscar uma conta específica por ID
 */
export const useRealAccount = (id: string, userId: string) => {
  return useQuery({
    queryKey: [`${ACCOUNTS_QUERY_KEY}/${id}`],
    queryFn: () => apiRequest(`${ACCOUNTS_QUERY_KEY}/${id}?userId=${userId}`),
    enabled: !!id && !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook para criar nova conta
 */
export const useCreateRealAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (account: CreateAccount) => 
      apiRequest(ACCOUNTS_QUERY_KEY, {
        method: 'POST',
        body: account as any,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] });
    },
  });
};

/**
 * Hook para atualizar conta
 */
export const useUpdateRealAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userId, account }: { id: string; userId: string; account: UpdateAccount }) => 
      apiRequest(`${ACCOUNTS_QUERY_KEY}/${id}`, {
        method: 'PUT',
        body: { ...account, userId } as any,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] });
    },
  });
};

/**
 * Hook para deletar conta
 */
export const useDeleteRealAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) => 
      apiRequest(`${ACCOUNTS_QUERY_KEY}/${id}?userId=${userId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] });
    },
  });
};

/**
 * Hook combinado que oferece a mesma interface do mock
 */
export const useRealAccountsAPI = (userId: string) => {
  const queryClient = useQueryClient();
  
  // Buscar todas as contas do usuário
  const { data: allAccounts = [], isLoading, error } = useRealAccounts(userId);
  
  const createAccountMutation = useCreateRealAccount();
  const updateAccountMutation = useUpdateRealAccount();
  const deleteAccountMutation = useDeleteRealAccount();
  
  // Métodos CRUD compatíveis com a interface mock
  const fetchAccounts = async () => {
    await queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] });
  };
  
  const createAccount = async (account: CreateAccount) => {
    return createAccountMutation.mutateAsync(account);
  };
  
  const updateAccount = async (id: string, account: UpdateAccount) => {
    return updateAccountMutation.mutateAsync({ id, userId, account });
  };
  
  const deleteAccount = async (id: string) => {
    return deleteAccountMutation.mutateAsync({ id, userId });
  };
  
  const getAccountById = (id: string) => {
    return allAccounts.find((acc: Account) => acc.id === id);
  };
  
  const getDefaultAccount = () => {
    return allAccounts.find((acc: Account) => acc.isDefault);
  };
  
  const getTotalBalance = () => {
    return allAccounts.reduce((sum: number, acc: Account) => sum + parseFloat(acc.balance || '0'), 0);
  };

  return {
    // Estado
    accounts: allAccounts,
    loading: isLoading,
    error: error?.message || null,
    
    // Métodos CRUD
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    
    // Métodos de busca
    getAccountById,
    getDefaultAccount,
    getTotalBalance,
    
    // Utilitários compatíveis com mock
    hasAccounts: allAccounts.length > 0,
    accountCount: allAccounts.length,
    activeAccounts: allAccounts.filter((acc: Account) => acc.isActive !== false),
    defaultAccount: getDefaultAccount(),
    totalBalance: getTotalBalance(),
  };
};
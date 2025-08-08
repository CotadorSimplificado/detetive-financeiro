// Hook de contas com migração gradual: Mock -> Real API
import { useMockAccounts } from '@/data/hooks/useMockAccounts';
import { useRealAccounts, useCreateRealAccount, useUpdateRealAccount, useDeleteRealAccount } from '@/hooks/api/useRealAccounts';
import { featureFlags } from '@/lib/featureFlags';

export const useAccounts = (userId: string = 'mock-user') => {
  const useRealAPI = featureFlags.isEnabled('useRealAccounts');
  
  // Selecionar implementação baseada na feature flag
  const mockResult = useMockAccounts();
  const realQuery = useRealAccounts(userId);
  
  // Retornar resultado baseado na configuração
  if (useRealAPI) {
    if (featureFlags.isEnabled('debugMode')) {
      console.log('🔄 useAccounts: usando API real', { 
        accounts: realQuery.data?.length || 0,
        loading: realQuery.isLoading 
      });
    }
    
    return {
      accounts: realQuery.data || [],
      loading: realQuery.isLoading,
      error: realQuery.error,
      refetch: realQuery.refetch
    };
  } else {
    if (featureFlags.isEnabled('debugMode')) {
      console.log('🎭 useAccounts: usando mock', { 
        accounts: mockResult.accounts.length,
        loading: mockResult.loading 
      });
    }
    
    return mockResult;
  }
};

// Hooks individuais para compatibilidade
export const useCreateAccount = (userId: string = 'mock-user') => {
  const useRealAPI = featureFlags.isEnabled('useRealAccounts');
  const { createAccount: mockCreate } = useMockAccounts();
  const realCreate = useCreateRealAccount();
  
  if (useRealAPI) {
    return realCreate;
  } else {
    // Wrap mock function to match mutation interface
    return {
      mutateAsync: mockCreate,
      isPending: false
    };
  }
};

export const useUpdateAccount = (userId: string = 'mock-user') => {
  const useRealAPI = featureFlags.isEnabled('useRealAccounts');
  const { updateAccount: mockUpdate } = useMockAccounts();
  const realUpdate = useUpdateRealAccount();
  
  if (useRealAPI) {
    return realUpdate;
  } else {
    return {
      mutateAsync: (data: any) => mockUpdate(data.id, data),
      isPending: false
    };
  }
};

export const useDeleteAccount = (userId: string = 'mock-user') => {
  const useRealAPI = featureFlags.isEnabled('useRealAccounts');
  const { deleteAccount: mockDelete } = useMockAccounts();
  const realDelete = useDeleteRealAccount();
  
  if (useRealAPI) {
    return {
      mutateAsync: (id: string) => realDelete.mutateAsync({ id, userId }),
      isPending: realDelete.isPending
    };
  } else {
    return {
      mutateAsync: mockDelete,
      isPending: false
    };
  }
};

export type { Account } from '@/data/types';

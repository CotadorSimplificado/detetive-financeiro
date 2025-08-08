// Hook de contas com migração gradual: Mock -> Real API
import { useMockAccounts } from '@/data/hooks/useMockAccounts';
import { useRealAccountsAPI } from '@/hooks/api/useRealAccounts';
import { featureFlags } from '@/lib/featureFlags';

export const useAccounts = (userId: string = 'mock-user') => {
  const useRealAPI = featureFlags.isEnabled('useRealAccounts');
  
  // Selecionar implementação baseada na feature flag
  const mockResult = useMockAccounts();
  const realResult = useRealAccountsAPI(userId);
  
  // Retornar resultado baseado na configuração
  if (useRealAPI) {
    if (featureFlags.isEnabled('debugMode')) {
      console.log('🔄 useAccounts: usando API real', { 
        accounts: realResult.accounts.length,
        loading: realResult.loading 
      });
    }
    
    return {
      data: realResult.accounts,
      loading: realResult.loading,
      error: realResult.error,
      ...realResult
    };
  } else {
    if (featureFlags.isEnabled('debugMode')) {
      console.log('🎭 useAccounts: usando mock', { 
        accounts: mockResult.accounts.length,
        loading: mockResult.loading 
      });
    }
    
    return {
      data: mockResult.accounts,
      loading: mockResult.loading,
      error: mockResult.error,
      ...mockResult
    };
  }
};

// Hooks individuais para compatibilidade
export const useCreateAccount = () => {
  const { createAccount } = useMockAccounts();
  return createAccount;
};

export const useUpdateAccount = () => {
  const { updateAccount } = useMockAccounts();
  return updateAccount;
};

export const useDeleteAccount = () => {
  const { deleteAccount } = useMockAccounts();
  return deleteAccount;
};

export type { Account } from '@/data/types';

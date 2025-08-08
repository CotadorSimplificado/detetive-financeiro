// Compatibilidade: Re-exporta o hook mock de contas
import { useMockAccounts } from '@/data/hooks/useMockAccounts';

export const useAccounts = () => {
  const mockResult = useMockAccounts();
  return {
    data: mockResult.accounts,
    loading: mockResult.loading,
    error: mockResult.error,
    ...mockResult
  };
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

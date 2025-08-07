// Compatibilidade: Re-exporta o hook mock de contas
import { useMockAccounts } from '@/data/hooks/useMockAccounts';

export const useAccounts = useMockAccounts;

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

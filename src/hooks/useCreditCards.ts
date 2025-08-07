// Compatibilidade: Re-exporta o hook mock de cartões de crédito
import { useMockCreditCards } from '@/data/hooks/useMockCreditCards';

export const useCreditCards = () => {
  const mockResult = useMockCreditCards();
  return {
    data: mockResult.creditCards,
    loading: mockResult.loading,
    error: mockResult.error,
    ...mockResult
  };
};

// Hooks individuais para compatibilidade
export const useCreateCreditCard = () => {
  const { createCreditCard } = useMockCreditCards();
  return createCreditCard;
};

export const useUpdateCreditCard = () => {
  const { updateCreditCard } = useMockCreditCards();
  return updateCreditCard;
};

export const useDeleteCreditCard = () => {
  const { deleteCreditCard } = useMockCreditCards();
  return deleteCreditCard;
};

export type { CreditCard } from '@/data/types';

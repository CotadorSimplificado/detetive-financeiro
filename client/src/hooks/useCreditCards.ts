// Hook de cartões de crédito com migração gradual: Mock -> Real API
import { useMockCreditCards } from '@/data/hooks/useMockCreditCards';
import { useRealCreditCardsAPI } from '@/hooks/api/useRealCreditCards';
import { featureFlags } from '@/lib/featureFlags';

export const useCreditCards = (userId: string = 'mock-user') => {
  const useRealAPI = featureFlags.isEnabled('useRealCreditCards');
  
  // Selecionar implementação baseada na feature flag
  const mockResult = useMockCreditCards();
  const realResult = useRealCreditCardsAPI(userId);
  
  // Retornar resultado baseado na configuração
  if (useRealAPI) {
    if (featureFlags.isEnabled('debugMode')) {
      console.log('🔄 useCreditCards: usando API real', { 
        creditCards: realResult.creditCards.length,
        loading: realResult.loading 
      });
    }
    
    return {
      data: realResult.creditCards,
      loading: realResult.loading,
      error: realResult.error,
      ...realResult
    };
  } else {
    if (featureFlags.isEnabled('debugMode')) {
      console.log('🎭 useCreditCards: usando mock', { 
        creditCards: mockResult.creditCards.length,
        loading: mockResult.loading 
      });
    }
    
    return {
      data: mockResult.creditCards,
      loading: mockResult.loading,
      error: mockResult.error,
      ...mockResult
    };
  }
};

// Hooks individuais para compatibilidade
export const useCreateCreditCard = (userId: string = 'mock-user') => {
  const useRealAPI = featureFlags.isEnabled('useRealCreditCards');
  const { createCreditCard: mockCreate } = useMockCreditCards();
  const { createCreditCard: realCreate } = useRealCreditCardsAPI(userId);
  
  return useRealAPI ? realCreate : mockCreate;
};

export const useUpdateCreditCard = (userId: string = 'mock-user') => {
  const useRealAPI = featureFlags.isEnabled('useRealCreditCards');
  const { updateCreditCard: mockUpdate } = useMockCreditCards();
  const { updateCreditCard: realUpdate } = useRealCreditCardsAPI(userId);
  
  return useRealAPI ? realUpdate : mockUpdate;
};

export const useDeleteCreditCard = (userId: string = 'mock-user') => {
  const useRealAPI = featureFlags.isEnabled('useRealCreditCards');
  const { deleteCreditCard: mockDelete } = useMockCreditCards();
  const { deleteCreditCard: realDelete } = useRealCreditCardsAPI(userId);
  
  return useRealAPI ? realDelete : mockDelete;
};

export type { CreditCard } from '@/data/types';
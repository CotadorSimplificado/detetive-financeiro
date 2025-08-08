import { useMockStore } from '../store/mockContext';
import { CreateCreditCard, UpdateCreditCard } from '../types';

/**
 * Hook customizado para gerenciamento de cartões de crédito mock
 * Fornece métodos CRUD e estado dos cartões
 */
export const useMockCreditCards = () => {
  const {
    creditCards,
    creditCardsLoading,
    error,
    fetchCreditCards,
    createCreditCard,
    updateCreditCard,
    deleteCreditCard,
    getCreditCardById,
    getDefaultCreditCard,
    setDefaultCreditCard,
    getTotalCreditLimit,
    getTotalAvailableLimit,
  } = useMockStore();

  return {
    // Estado
    creditCards,
    loading: creditCardsLoading,
    error,
    
    // Métodos CRUD
    fetchCreditCards,
    createCreditCard,
    updateCreditCard,
    deleteCreditCard,
    
    // Métodos de busca
    getCreditCardById,
    getDefaultCreditCard,
    setDefaultCreditCard,
    getTotalCreditLimit,
    getTotalAvailableLimit,
    
    // Utilitários
    hasCreditCards: creditCards.length > 0,
    creditCardCount: creditCards.length,
    activeCards: creditCards.filter(card => card.is_active !== false),
    defaultCard: getDefaultCreditCard(),
    totalCreditLimit: getTotalCreditLimit(),
    totalAvailableLimit: getTotalAvailableLimit(),
    usedLimit: getTotalCreditLimit() - getTotalAvailableLimit(),
    usagePercentage: getTotalCreditLimit() > 0 
      ? ((getTotalCreditLimit() - getTotalAvailableLimit()) / getTotalCreditLimit()) * 100 
      : 0,
  };
};

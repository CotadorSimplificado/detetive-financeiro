import { useMockStore } from '../store/mockContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
    createCreditCard: createCreditCardMock,
    updateCreditCard: updateCreditCardMock,
    deleteCreditCard: deleteCreditCardMock,
    getCreditCardById,
    getDefaultCreditCard,
    setDefaultCreditCard,
    getTotalCreditLimit,
    getTotalAvailableLimit,
  } = useMockStore();

  const queryClient = useQueryClient();

  const createCreditCard = useMutation({
    mutationFn: createCreditCardMock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mockCreditCards'] });
    },
  });

  const updateCreditCard = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCreditCard }) => updateCreditCardMock(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mockCreditCards'] });
    },
  });

  const deleteCreditCard = useMutation({
    mutationFn: deleteCreditCardMock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mockCreditCards'] });
    },
  });

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

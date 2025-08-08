import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { CreditCard } from '@shared/schema';
import type { CreateCreditCard, UpdateCreditCard } from '@/data/types';

// Key para cache do React Query
const CREDIT_CARDS_QUERY_KEY = '/api/credit-cards';

/**
 * Hook para buscar cartões de crédito de um usuário
 */
export const useRealCreditCards = (userId: string) => {
  const queryKey = [CREDIT_CARDS_QUERY_KEY, userId];
  
  return useQuery({
    queryKey,
    queryFn: () => {
      const params = new URLSearchParams({ userId });
      const url = `${CREDIT_CARDS_QUERY_KEY}?${params.toString()}`;
      return apiRequest(url);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para buscar um cartão específico por ID
 */
export const useRealCreditCard = (id: string, userId: string) => {
  return useQuery({
    queryKey: [`${CREDIT_CARDS_QUERY_KEY}/${id}`],
    queryFn: () => apiRequest(`${CREDIT_CARDS_QUERY_KEY}/${id}?userId=${userId}`),
    enabled: !!id && !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook para criar novo cartão de crédito
 */
export const useCreateRealCreditCard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (creditCard: CreateCreditCard) => 
      apiRequest(CREDIT_CARDS_QUERY_KEY, {
        method: 'POST',
        body: creditCard as any,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CREDIT_CARDS_QUERY_KEY] });
    },
  });
};

/**
 * Hook para atualizar cartão de crédito
 */
export const useUpdateRealCreditCard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userId, creditCard }: { id: string; userId: string; creditCard: UpdateCreditCard }) => 
      apiRequest(`${CREDIT_CARDS_QUERY_KEY}/${id}`, {
        method: 'PUT',
        body: { ...creditCard, userId } as any,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CREDIT_CARDS_QUERY_KEY] });
    },
  });
};

/**
 * Hook para deletar cartão de crédito
 */
export const useDeleteRealCreditCard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) => 
      apiRequest(`${CREDIT_CARDS_QUERY_KEY}/${id}?userId=${userId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CREDIT_CARDS_QUERY_KEY] });
    },
  });
};

/**
 * Hook combinado que oferece a mesma interface do mock
 */
export const useRealCreditCardsAPI = (userId: string) => {
  const queryClient = useQueryClient();
  
  // Buscar todos os cartões do usuário
  const { data: allCreditCards = [], isLoading, error } = useRealCreditCards(userId);
  
  const createCreditCardMutation = useCreateRealCreditCard();
  const updateCreditCardMutation = useUpdateRealCreditCard();
  const deleteCreditCardMutation = useDeleteRealCreditCard();
  
  // Métodos CRUD compatíveis com a interface mock
  const fetchCreditCards = async () => {
    await queryClient.invalidateQueries({ queryKey: [CREDIT_CARDS_QUERY_KEY] });
  };
  
  const createCreditCard = async (creditCard: CreateCreditCard) => {
    return createCreditCardMutation.mutateAsync(creditCard);
  };
  
  const updateCreditCard = async (id: string, creditCard: UpdateCreditCard) => {
    return updateCreditCardMutation.mutateAsync({ id, userId, creditCard });
  };
  
  const deleteCreditCard = async (id: string) => {
    return deleteCreditCardMutation.mutateAsync({ id, userId });
  };
  
  const getCreditCardById = (id: string) => {
    return allCreditCards.find((card: CreditCard) => card.id === id);
  };
  
  const getDefaultCreditCard = () => {
    return allCreditCards.find((card: CreditCard) => card.isDefault);
  };
  
  const setDefaultCreditCard = async (id: string) => {
    // Primeiro, remover default de todos os cartões
    const updates = allCreditCards.map((card: CreditCard) => 
      updateCreditCard(card.id, { is_default: card.id === id } as any)
    );
    await Promise.all(updates);
  };
  
  const getTotalCreditLimit = () => {
    return allCreditCards.reduce((sum: number, card: CreditCard) => 
      sum + parseFloat(card.limit || '0'), 0
    );
  };
  
  const getTotalAvailableLimit = () => {
    return allCreditCards.reduce((sum: number, card: CreditCard) => 
      sum + parseFloat(card.availableLimit || card.limit || '0'), 0
    );
  };

  const totalCreditLimit = getTotalCreditLimit();
  const totalAvailableLimit = getTotalAvailableLimit();
  const usedLimit = totalCreditLimit - totalAvailableLimit;
  const usagePercentage = totalCreditLimit > 0 ? (usedLimit / totalCreditLimit) * 100 : 0;

  return {
    // Estado
    creditCards: allCreditCards,
    loading: isLoading,
    error: error?.message || null,
    
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
    
    // Utilitários compatíveis com mock
    hasCreditCards: allCreditCards.length > 0,
    creditCardCount: allCreditCards.length,
    activeCards: allCreditCards.filter((card: CreditCard) => card.isActive !== false),
    defaultCard: getDefaultCreditCard(),
    totalCreditLimit,
    totalAvailableLimit,
    usedLimit,
    usagePercentage,
  };
};
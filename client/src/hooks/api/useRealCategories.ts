import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Category } from '@shared/schema';
import type { CreateCategory } from '@/data/types';

// Key para cache do React Query
const CATEGORIES_QUERY_KEY = '/api/categories';

/**
 * Hook para buscar todas as categorias (padrão + do usuário)
 */
export const useRealCategories = (filters?: { type?: string; userId?: string }) => {
  const queryKey = [CATEGORIES_QUERY_KEY, filters];
  
  return useQuery({
    queryKey,
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.userId) params.append('userId', filters.userId);
      
      const url = params.toString() 
        ? `${CATEGORIES_QUERY_KEY}?${params.toString()}`
        : CATEGORIES_QUERY_KEY;
        
      return apiRequest(url);
    },
    staleTime: 10 * 60 * 1000, // 10 minutos - categorias não mudam muito
  });
};

/**
 * Hook para buscar uma categoria específica por ID
 */
export const useRealCategory = (id: string) => {
  return useQuery({
    queryKey: [`${CATEGORIES_QUERY_KEY}/${id}`],
    queryFn: () => apiRequest(`${CATEGORIES_QUERY_KEY}/${id}`),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Hook para criar nova categoria personalizada
 */
export const useCreateRealCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (category: CreateCategory) => 
      apiRequest(CATEGORIES_QUERY_KEY, {
        method: 'POST',
        body: category,
      }),
    onSuccess: () => {
      // Invalidar cache de categorias para recarregar
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
    },
  });
};

/**
 * Hook combinado que oferece a mesma interface do mock
 */
export const useRealCategoriesAPI = (userId?: string) => {
  const queryClient = useQueryClient();
  
  // Buscar todas as categorias (padrão + do usuário logado)
  const { data: allCategories = [], isLoading, error } = useRealCategories(
    userId ? { userId } : undefined
  );
  
  const createCategoryMutation = useCreateRealCategory();
  
  // Métodos CRUD compatíveis com a interface mock
  const fetchCategories = async () => {
    await queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
  };
  
  const createCategory = async (category: CreateCategory) => {
    return createCategoryMutation.mutateAsync(category);
  };
  
  const getCategoryById = (id: string) => {
    return allCategories.find((cat: Category) => cat.id === id);
  };
  
  const getCategoriesByType = (type: string) => {
    return allCategories.filter((cat: Category) => cat.type === type);
  };
  
  const getRootCategories = () => {
    // No novo schema, categorias sem userId são as padrão do sistema
    return allCategories.filter((cat: Category) => !cat.userId);
  };

  return {
    // Estado
    categories: allCategories,
    loading: isLoading,
    error: error?.message || null,
    
    // Métodos CRUD
    fetchCategories,
    createCategory,
    updateCategory: async () => { throw new Error('Update not implemented yet'); },
    deleteCategory: async () => { throw new Error('Delete not implemented yet'); },
    
    // Métodos de busca
    getCategoryById,
    getCategoriesByType,
    getRootCategories,
    
    // Utilitários compatíveis com mock
    hasCategories: allCategories.length > 0,
    categoryCount: allCategories.length,
    rootCategories: getRootCategories(),
    incomeCategories: getCategoriesByType('INCOME'),
    expenseCategories: getCategoriesByType('EXPENSE'),
    transferCategories: getCategoriesByType('TRANSFER'),
  };
};
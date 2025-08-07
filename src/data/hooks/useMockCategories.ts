import { useMockStore } from '../store/mockContext';
import { CreateCategory, UpdateCategory } from '../types';

/**
 * Hook customizado para gerenciamento de categorias mock
 * Fornece métodos CRUD e estado das categorias
 */
export const useMockCategories = () => {
  const {
    categories,
    categoriesLoading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getCategoriesByType,
    getRootCategories,
  } = useMockStore();

  return {
    // Estado
    categories,
    loading: categoriesLoading,
    error,
    
    // Métodos CRUD
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    
    // Métodos de busca
    getCategoryById,
    getCategoriesByType,
    getRootCategories,
    
    // Utilitários
    hasCategories: categories.length > 0,
    categoryCount: categories.length,
    rootCategories: getRootCategories(),
    incomeCategories: getCategoriesByType('INCOME'),
    expenseCategories: getCategoriesByType('EXPENSE'),
    transferCategories: getCategoriesByType('TRANSFER'),
  };
};

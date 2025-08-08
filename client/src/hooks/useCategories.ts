// Hook de categorias com migração gradual: Mock -> Real API
import { useMockCategories } from '@/data/hooks/useMockCategories';
import { useRealCategoriesAPI } from '@/hooks/api/useRealCategories';
import { featureFlags } from '@/lib/featureFlags';

export const useCategories = () => {
  const useRealAPI = featureFlags.isEnabled('useRealCategories');
  
  // Selecionar implementação baseada na feature flag
  const mockResult = useMockCategories();
  const realResult = useRealCategoriesAPI();
  
  // Retornar resultado baseado na configuração
  if (useRealAPI) {
    // Log para debug durante migração
    if (featureFlags.isEnabled('debugMode')) {
      console.log('🔄 useCategories: usando API real', { 
        categories: realResult.categories.length,
        loading: realResult.loading 
      });
    }
    
    return {
      data: realResult.categories,
      loading: realResult.loading,
      error: realResult.error,
      ...realResult
    };
  } else {
    // Log para debug durante migração
    if (featureFlags.isEnabled('debugMode')) {
      console.log('🎭 useCategories: usando mock', { 
        categories: mockResult.categories.length,
        loading: mockResult.loading 
      });
    }
    
    return {
      data: mockResult.categories,
      loading: mockResult.loading,
      error: mockResult.error,
      ...mockResult
    };
  }
};

// Função utilitária para sugestão de categoria baseada na descrição
export const suggestCategoryByDescription = (description: string, categories: any[]) => {
  const desc = description.toLowerCase();

  // Mapeamento simples de palavras-chave para nomes de categorias
  const categoryMappings = {
    'supermercado': 'Supermercado',
    'uber': 'Transporte',
    'taxi': 'Transporte',
    'gasolina': 'Combustível',
    'combustível': 'Combustível',
    'restaurante': 'Alimentação',
    'lanchonete': 'Alimentação',
    'pizza': 'Alimentação',
    'farmácia': 'Saúde',
    'médico': 'Saúde',
    'hospital': 'Saúde',
    'cinema': 'Entretenimento',
    'teatro': 'Entretenimento',
    'shopping': 'Compras',
    'roupas': 'Vestuário',
    'salário': 'Salário',
    'freelance': 'Freelance',
    'aluguel': 'Moradia',
    'conta de luz': 'Contas Básicas',
    'conta de água': 'Contas Básicas',
    'internet': 'Contas Básicas',
  };

  for (const [keyword, categoryName] of Object.entries(categoryMappings)) {
    if (desc.includes(keyword)) {
      // Procurar categoria pelo nome
      const category = categories.find(cat => 
        cat.name.toLowerCase().includes(categoryName.toLowerCase())
      );
      return category || null;
    }
  }

  return null; // Retorna null se não encontrar sugestão
};

export type { Category } from '@/data/types';
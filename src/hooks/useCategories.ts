// Compatibilidade: Re-exporta o hook mock de categorias
import { useMockCategories } from '@/data/hooks/useMockCategories';

export const useCategories = useMockCategories;

// Função utilitária para sugestão de categoria baseada na descrição
export const suggestCategoryByDescription = (description: string) => {
  const desc = description.toLowerCase();
  
  // Mapeamento simples de palavras-chave para categorias
  const categoryMappings = {
    'supermercado': 'groceries',
    'uber': 'transport',
    'taxi': 'transport',
    'gasolina': 'transport',
    'combustível': 'transport',
    'restaurante': 'food',
    'lanchonete': 'food',
    'pizza': 'food',
    'farmácia': 'health',
    'médico': 'health',
    'hospital': 'health',
    'cinema': 'entertainment',
    'teatro': 'entertainment',
    'shopping': 'shopping',
    'roupas': 'shopping',
    'salário': 'salary',
    'freelance': 'freelance',
    'aluguel': 'rent',
    'conta de luz': 'utilities',
    'conta de água': 'utilities',
    'internet': 'utilities',
  };
  
  for (const [keyword, categoryId] of Object.entries(categoryMappings)) {
    if (desc.includes(keyword)) {
      return categoryId;
    }
  }
  
  return null; // Retorna null se não encontrar sugestão
};

export type { Category } from '@/data/types';

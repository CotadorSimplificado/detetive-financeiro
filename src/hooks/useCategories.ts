import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Category {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  icon?: string;
  color?: string;
  is_system: boolean;
  parent_id?: string;
  user_id?: string;
}

// Categorias pré-definidas do sistema
export const systemCategories: Omit<Category, 'id' | 'user_id'>[] = [
  // Receitas
  { name: "Salário", type: "INCOME", icon: "💼", color: "#22c55e", is_system: true },
  { name: "Freelance", type: "INCOME", icon: "💻", color: "#22c55e", is_system: true },
  { name: "Investimentos", type: "INCOME", icon: "📈", color: "#22c55e", is_system: true },
  { name: "Vendas", type: "INCOME", icon: "🛒", color: "#22c55e", is_system: true },
  { name: "Outros", type: "INCOME", icon: "💰", color: "#22c55e", is_system: true },
  
  // Despesas
  { name: "Alimentação", type: "EXPENSE", icon: "🍽️", color: "#ef4444", is_system: true },
  { name: "Transporte", type: "EXPENSE", icon: "🚗", color: "#ef4444", is_system: true },
  { name: "Moradia", type: "EXPENSE", icon: "🏠", color: "#ef4444", is_system: true },
  { name: "Saúde", type: "EXPENSE", icon: "⚕️", color: "#ef4444", is_system: true },
  { name: "Educação", type: "EXPENSE", icon: "📚", color: "#ef4444", is_system: true },
  { name: "Lazer", type: "EXPENSE", icon: "🎉", color: "#ef4444", is_system: true },
  { name: "Compras", type: "EXPENSE", icon: "🛍️", color: "#ef4444", is_system: true },
  { name: "Contas", type: "EXPENSE", icon: "📋", color: "#ef4444", is_system: true },
  { name: "Outros", type: "EXPENSE", icon: "💸", color: "#ef4444", is_system: true },
];

export function useCategories(type?: 'INCOME' | 'EXPENSE') {
  return useQuery({
    queryKey: ['categories', type],
    queryFn: async () => {
      let query = supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as Category[];
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: Omit<Category, 'id' | 'user_id'>) => {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ 
          ...category, 
          user_id: (await supabase.auth.getUser()).data.user?.id,
          slug: category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Categoria criada",
        description: "A categoria foi criada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao criar categoria.",
        variant: "destructive",
      });
    },
  });
}

// Função para sugerir categoria baseada na descrição usando IA simples
export function suggestCategoryByDescription(description: string, categories: Category[]): Category | null {
  const desc = description.toLowerCase();
  
  // Mapeamento de palavras-chave para categorias
  const keywordMap: Record<string, string[]> = {
    'alimentação': ['comida', 'restaurante', 'lanche', 'supermercado', 'ifood', 'delivery', 'padaria'],
    'transporte': ['uber', 'gasolina', 'onibus', 'metro', 'taxi', 'combustivel', 'estacionamento'],
    'moradia': ['aluguel', 'financiamento', 'condominio', 'agua', 'luz', 'energia', 'gas', 'internet'],
    'saúde': ['farmacia', 'medicamento', 'hospital', 'medico', 'consulta', 'exame', 'plano'],
    'educação': ['escola', 'faculdade', 'curso', 'livro', 'material', 'mensalidade'],
    'lazer': ['cinema', 'show', 'festa', 'viagem', 'jogo', 'spotify', 'netflix'],
    'compras': ['shopping', 'roupa', 'calçado', 'eletronico', 'loja'],
    'salário': ['salario', 'pagamento', 'ordenado', 'vencimento'],
    'freelance': ['freelance', 'freela', 'projeto', 'consultoria'],
  };

  for (const [categoryName, keywords] of Object.entries(keywordMap)) {
    for (const keyword of keywords) {
      if (desc.includes(keyword)) {
        const category = categories.find(cat => 
          cat.name.toLowerCase().includes(categoryName)
        );
        if (category) {
          return category;
        }
      }
    }
  }

  return null;
}
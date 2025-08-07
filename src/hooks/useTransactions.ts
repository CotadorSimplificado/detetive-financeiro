import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { getMonthRange } from "@/lib/date-utils";

export interface Transaction {
  id: string;
  user_id: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: number;
  description: string;
  notes?: string;
  date: string;
  paid_at?: string;
  account_id?: string;
  card_id?: string;
  category_id: string;
  is_transfer: boolean;
  transfer_from_id?: string;
  transfer_to_id?: string;
  is_recurring: boolean;
  recurrence_type?: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'CUSTOM';
  recurrence_interval?: number;
  recurrence_end_date?: string;
  is_installment: boolean;
  installment_number?: number;
  installment_total?: number;
  installment_group_id?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  ai_categorized: boolean;
  ai_confidence?: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface TransactionWithRelations extends Transaction {
  account?: {
    id: string;
    name: string;
    color: string;
    icon?: string;
  };
  card?: {
    id: string;
    name: string;
    color: string;
    brand: string;
  };
  category: {
    id: string;
    name: string;
    color?: string;
    icon?: string;
    type: 'INCOME' | 'EXPENSE';
  };
  transfer_from_account?: {
    id: string;
    name: string;
    color: string;
  };
  transfer_to_account?: {
    id: string;
    name: string;
    color: string;
  };
}

export interface TransactionFilters {
  type?: 'INCOME' | 'EXPENSE' | 'TRANSFER' | 'all';
  category_id?: string;
  account_id?: string;
  card_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  competence_month?: number; // 1-12
  competence_year?: number;
}

export interface TransactionSummary {
  income: number;
  expenses: number;
  balance: number;
  total_transactions: number;
}

export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          account:accounts!transactions_account_id_fkey(id, name, color, icon),
          card:credit_cards(id, name, color, brand),
          category:categories(id, name, color, icon, type),
          transfer_from_account:accounts!transactions_transfer_from_id_fkey(id, name, color),
          transfer_to_account:accounts!transactions_transfer_to_id_fkey(id, name, color)
        `)
        .is('deleted_at', null)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters?.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }
      
      if (filters?.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      
      if (filters?.account_id) {
        query = query.eq('account_id', filters.account_id);
      }
      
      if (filters?.card_id) {
        query = query.eq('card_id', filters.card_id);
      }

      // Handle competence filter (month/year) - more efficient date range calculation
      if (filters?.competence_month && filters?.competence_year) {
        const competenceDate = new Date(filters.competence_year, filters.competence_month - 1, 1);
        const { start, end } = getMonthRange(competenceDate);
        
        query = query
          .gte('date', start)
          .lte('date', end);
      } else {
        // Fallback to date_from/date_to if competence not set
        if (filters?.date_from) {
          query = query.gte('date', filters.date_from);
        }
        
        if (filters?.date_to) {
          query = query.lte('date', filters.date_to);
        }
      }
      
      if (filters?.search) {
        query = query.or(`description.ilike.%${filters.search}%,notes.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useTransactionsSummary(filters?: Omit<TransactionFilters, 'type'>) {
  return useQuery({
    queryKey: ['transactions-summary', filters],
    queryFn: async () => {
      let baseQuery = supabase
        .from('transactions')
        .select('type, amount')
        .is('deleted_at', null);

      // Aplicar filtros (exceto type)
      if (filters?.category_id) {
        baseQuery = baseQuery.eq('category_id', filters.category_id);
      }
      
      if (filters?.account_id) {
        baseQuery = baseQuery.eq('account_id', filters.account_id);
      }
      
      if (filters?.card_id) {
        baseQuery = baseQuery.eq('card_id', filters.card_id);
      }

      // Handle competence filter (month/year) - more efficient date range calculation
      if (filters?.competence_month && filters?.competence_year) {
        const competenceDate = new Date(filters.competence_year, filters.competence_month - 1, 1);
        const { start, end } = getMonthRange(competenceDate);
        
        baseQuery = baseQuery
          .gte('date', start)
          .lte('date', end);
      } else {
        // Fallback to date_from/date_to if competence not set
        if (filters?.date_from) {
          baseQuery = baseQuery.gte('date', filters.date_from);
        }
        
        if (filters?.date_to) {
          baseQuery = baseQuery.lte('date', filters.date_to);
        }
      }
      
      if (filters?.search) {
        baseQuery = baseQuery.or(`description.ilike.%${filters.search}%,notes.ilike.%${filters.search}%`);
      }

      const { data, error } = await baseQuery;

      if (error) {
        throw error;
      }

      // Calcular sumários
      const income = data
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const expenses = data
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
      
      const balance = income - expenses;
      const total_transactions = data.length;

      return {
        income,
        expenses,
        balance,
        total_transactions
      } as TransactionSummary;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at'>) => {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{ 
          ...transaction, 
          user_id: (await supabase.auth.getUser()).data.user?.id 
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-summary'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast({
        title: "Transação criada",
        description: "A transação foi criada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao criar transação.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...transaction }: Partial<Transaction> & { id: string }) => {
      const { data, error } = await supabase
        .from('transactions')
        .update(transaction)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-summary'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast({
        title: "Transação atualizada",
        description: "A transação foi atualizada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar transação.",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transactions')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-summary'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast({
        title: "Transação removida",
        description: "A transação foi removida com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao remover transação.",
        variant: "destructive",
      });
    },
  });
}
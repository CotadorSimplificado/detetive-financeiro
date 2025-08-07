import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { TransactionWithRelations, TransactionFilters } from './useTransactions';

export const useCreditCardTransactions = (cardId: string, filters?: TransactionFilters) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['credit-card-transactions', cardId, filters],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
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
        .eq('card_id', cardId)
        .is('deleted_at', null)
        .order('date', { ascending: false });

      // Apply additional filters
      if (filters?.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }
      
      if (filters?.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      
      if (filters?.account_id) {
        query = query.eq('account_id', filters.account_id);
      }
      
      if (filters?.date_from) {
        query = query.gte('date', filters.date_from);
      }
      
      if (filters?.date_to) {
        query = query.lte('date', filters.date_to);
      }
      
      if (filters?.search) {
        query = query.ilike('description', `%${filters.search}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as TransactionWithRelations[];
    },
    enabled: !!user && !!cardId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};
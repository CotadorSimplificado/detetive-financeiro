import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface CreditCard {
  id: string;
  name: string;
  type: 'CREDIT' | 'DEBIT' | 'CREDIT_DEBIT' | 'PREPAID' | 'VIRTUAL';
  brand: 'VISA' | 'MASTERCARD' | 'ELO' | 'AMEX' | 'HIPERCARD' | 'OTHER';
  last_digits?: string;
  color: string;
  credit_limit?: number;
  available_limit?: number;
  closing_day?: number;
  due_day?: number;
  is_active: boolean;
  is_default: boolean;
  is_virtual: boolean;
  parent_card_id?: string;
  open_finance_id?: string;
  last_sync_at?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useCreditCards = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['credit-cards'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('credit_cards')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as CreditCard[];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateCreditCard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (cardData: Omit<CreditCard, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('credit_cards')
        .insert({
          ...cardData,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] });
      toast({
        title: "Sucesso",
        description: "Cartão criado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao criar cartão: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCreditCard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<CreditCard> & { id: string }) => {
      const { data, error } = await supabase
        .from('credit_cards')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] });
      toast({
        title: "Sucesso",
        description: "Cartão atualizado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar cartão: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteCreditCard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('credit_cards')
        .update({ 
          is_active: false,
          deleted_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] });
      toast({
        title: "Sucesso",
        description: "Cartão removido com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao remover cartão: " + error.message,
        variant: "destructive",
      });
    },
  });
};
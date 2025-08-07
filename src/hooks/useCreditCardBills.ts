import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface CreditCardBill {
  id: string;
  card_id: string;
  reference_month: string;
  closing_date: string;
  due_date: string;
  total_amount: number;
  is_paid: boolean;
  paid_at: string | null;
  payment_transaction_id: string | null;
  created_at: string;
  updated_at: string;
  credit_cards?: {
    name: string;
    brand: string;
    last_digits: string;
  };
}

export function useCreditCardBills() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['credit-card-bills'],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('credit_card_bills')
        .select(`
          *,
          credit_cards:card_id (
            name,
            brand,
            last_digits
          )
        `)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data as CreditCardBill[];
    },
    enabled: !!user,
  });
}

export function usePayCreditCardBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      billId: string;
      accountId: string;
      paidAt?: Date;
    }) => {
      const { billId, accountId, paidAt = new Date() } = params;

      // Get bill details
      const { data: bill, error: billError } = await supabase
        .from('credit_card_bills')
        .select('*')
        .eq('id', billId)
        .single();

      if (billError) throw billError;
      if (!bill) throw new Error('Fatura não encontrada');

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Create payment transaction
      const { data: paymentTransaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'EXPENSE',
          amount: bill.total_amount,
          description: `Pagamento Cartão - ${bill.reference_month}`,
          date: paidAt.toISOString().split('T')[0],
          account_id: accountId,
          category_id: '00000000-0000-0000-0000-000000000001', // Default category for card payments
          paid_at: paidAt.toISOString(),
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Update bill as paid
      const { error: updateError } = await supabase
        .from('credit_card_bills')
        .update({
          is_paid: true,
          paid_at: paidAt.toISOString(),
          payment_transaction_id: paymentTransaction.id,
        })
        .eq('id', billId);

      if (updateError) throw updateError;

      return { bill, paymentTransaction };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-card-bills'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-summary'] });
      toast.success('Fatura paga com sucesso!');
    },
    onError: (error) => {
      console.error('Error paying bill:', error);
      toast.error('Erro ao pagar fatura');
    },
  });
}

export function useCreateCreditCardBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (billData: {
      card_id: string;
      reference_month: string;
      closing_date: string;
      due_date: string;
      total_amount: number;
    }) => {
      const { data, error } = await supabase
        .from('credit_card_bills')
        .insert(billData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-card-bills'] });
      toast.success('Fatura criada com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating bill:', error);
      toast.error('Erro ao criar fatura');
    },
  });
}
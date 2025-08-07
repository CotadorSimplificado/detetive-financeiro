import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { TransactionForm } from "./TransactionForm";
import { incomeSchema, IncomeFormData } from "@/lib/validations/transaction";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAccounts } from "@/hooks/useAccounts";
import { useCategories } from "@/hooks/useCategories";
import { useFormContext } from "react-hook-form";

interface IncomeFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function IncomeForm({ onSuccess, onCancel }: IncomeFormProps) {
  const queryClient = useQueryClient();
  const { data: accounts = [] } = useAccounts();
  const { data: incomeCategories = [] } = useCategories('INCOME');

  const createIncome = useMutation({
    mutationFn: async (data: IncomeFormData) => {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error("Usuário não autenticado");
      }

      // Criar a transação
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          ...data,
          date: data.date.toISOString().split('T')[0], // Convert Date to string
          type: 'INCOME',
          user_id: user.user.id,
          is_transfer: false,
        }])
        .select()
        .single();

      if (transactionError) {
        throw transactionError;
      }

      // Atualizar saldo da conta manualmente
      const { data: account, error: fetchError } = await supabase
        .from('accounts')
        .select('current_balance')
        .eq('id', data.account_id)
        .single();

      if (fetchError) {
        await supabase.from('transactions').delete().eq('id', transaction.id);
        throw fetchError;
      }

      const { error: updateError } = await supabase
        .from('accounts')
        .update({ current_balance: account.current_balance + data.amount })
        .eq('id', data.account_id);

      if (updateError) {
        await supabase.from('transactions').delete().eq('id', transaction.id);
        throw updateError;
      }

      return transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Receita registrada",
        description: "A receita foi registrada com sucesso.",
      });
      onSuccess();
    },
    onError: (error) => {
      console.error('Erro ao criar receita:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar receita. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const AccountSelect = () => {
    const form = useFormContext();
    
    return (
      <FormField
        control={form.control}
        name="account_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Conta *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma conta" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center gap-2">
                      {account.icon && <span>{account.icon}</span>}
                      <span>{account.name}</span>
                      <span className="text-muted-foreground text-sm">
                        ({account.type === 'CHECKING' ? 'Corrente' : 
                          account.type === 'SAVINGS' ? 'Poupança' : 
                          account.type === 'INVESTMENT' ? 'Investimento' : 'Dinheiro'})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <TransactionForm
      schema={incomeSchema}
      onSubmit={createIncome.mutate}
      onCancel={onCancel}
      isLoading={createIncome.isPending}
      defaultValues={{
        category_id: incomeCategories.find(cat => cat.name === "Outros")?.id || "",
      }}
    >
      <AccountSelect />
    </TransactionForm>
  );
}
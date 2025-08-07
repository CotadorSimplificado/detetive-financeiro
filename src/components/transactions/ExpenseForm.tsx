import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { TransactionForm } from "./TransactionForm";
import { expenseSchema, ExpenseFormData } from "@/lib/validations/transaction";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccounts } from "@/hooks/useAccounts";
import { useCategories } from "@/hooks/useCategories";
import { useFormContext } from "react-hook-form";

interface ExpenseFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function ExpenseForm({ onSuccess, onCancel }: ExpenseFormProps) {
  const queryClient = useQueryClient();
  const { data: accounts = [] } = useAccounts();
  const { data: expenseCategories = [] } = useCategories('EXPENSE');

  const createExpense = useMutation({
    mutationFn: async (data: ExpenseFormData) => {
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
          type: 'EXPENSE',
          user_id: user.user.id,
          is_transfer: false,
        }])
        .select()
        .single();

      if (transactionError) {
        throw transactionError;
      }

      // Atualizar saldo da conta manualmente (se não for cartão de crédito)
      if (data.account_id) {
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
          .update({ current_balance: account.current_balance - data.amount })
          .eq('id', data.account_id);

        if (updateError) {
          await supabase.from('transactions').delete().eq('id', transaction.id);
          throw updateError;
        }
      }

      return transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['credit_cards'] });
      toast({
        title: "Despesa registrada",
        description: "A despesa foi registrada com sucesso.",
      });
      onSuccess();
    },
    onError: (error) => {
      console.error('Erro ao criar despesa:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar despesa. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const PaymentMethodSelect = () => {
    const form = useFormContext();
    
    return (
      <div>
        <FormLabel>Método de Pagamento *</FormLabel>
        <Tabs defaultValue="account" className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Conta</TabsTrigger>
            <TabsTrigger value="credit_card">Cartão de Crédito</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-2">
            <FormField
              control={form.control}
              name="account_id"
              render={({ field }) => (
                <FormItem>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("card_id", undefined);
                    }} 
                    value={field.value}
                  >
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
                              (R$ {account.current_balance.toFixed(2)})
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
          </TabsContent>
          
          <TabsContent value="credit_card" className="space-y-2">
            <FormField
              control={form.control}
              name="card_id"
              render={({ field }) => (
                <FormItem>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("account_id", undefined);
                    }} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cartão" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="no-cards">
                        <span className="text-muted-foreground">
                          Nenhum cartão cadastrado
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <TransactionForm
      schema={expenseSchema}
      onSubmit={createExpense.mutate}
      onCancel={onCancel}
      isLoading={createExpense.isPending}
      defaultValues={{
        category_id: expenseCategories.find(cat => cat.name === "Outros")?.id || "",
      }}
    >
      <PaymentMethodSelect />
    </TransactionForm>
  );
}
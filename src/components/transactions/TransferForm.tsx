import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { TransactionForm } from "./TransactionForm";
import { transferSchema, TransferFormData } from "@/lib/validations/transaction";
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
import { useFormContext } from "react-hook-form";

interface TransferFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function TransferForm({ onSuccess, onCancel }: TransferFormProps) {
  const queryClient = useQueryClient();
  const { data: accounts = [] } = useAccounts();

  const createTransfer = useMutation({
    mutationFn: async (data: TransferFormData) => {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error("Usuário não autenticado");
      }

      // Verificar se as contas existem e têm saldo suficiente
      const { data: fromAccount } = await supabase
        .from('accounts')
        .select('current_balance')
        .eq('id', data.transfer_from_id)
        .single();

      if (!fromAccount || fromAccount.current_balance < data.amount) {
        throw new Error("Saldo insuficiente na conta de origem");
      }

      // Criar as duas transações (saída e entrada)
      const { data: transactions, error: transactionError } = await supabase
        .from('transactions')
        .insert([
          {
            ...data,
            type: 'TRANSFER',
            user_id: user.user.id,
            is_transfer: true,
            account_id: data.transfer_from_id,
            amount: -data.amount, // Negativo para saída
          },
          {
            ...data,
            type: 'TRANSFER',
            user_id: user.user.id,
            is_transfer: true,
            account_id: data.transfer_to_id,
            amount: data.amount, // Positivo para entrada
          }
        ])
        .select();

      if (transactionError) {
        throw transactionError;
      }

      // Atualizar saldos das contas
      const { error: fromAccountError } = await supabase.rpc('update_account_balance', {
        account_id: data.transfer_from_id,
        amount_change: -data.amount
      });

      if (fromAccountError) {
        // Rollback em caso de erro
        await supabase.from('transactions').delete().in('id', transactions.map(t => t.id));
        throw fromAccountError;
      }

      const { error: toAccountError } = await supabase.rpc('update_account_balance', {
        account_id: data.transfer_to_id,
        amount_change: data.amount
      });

      if (toAccountError) {
        // Rollback em caso de erro
        await supabase.from('transactions').delete().in('id', transactions.map(t => t.id));
        await supabase.rpc('update_account_balance', {
          account_id: data.transfer_from_id,
          amount_change: data.amount // Reverter alteração anterior
        });
        throw toAccountError;
      }

      return transactions;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Transferência realizada",
        description: "A transferência foi realizada com sucesso.",
      });
      onSuccess();
    },
    onError: (error) => {
      console.error('Erro ao criar transferência:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao realizar transferência. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const AccountSelects = () => {
    const form = useFormContext();
    const fromAccountId = form.watch("transfer_from_id");
    
    return (
      <>
        <FormField
          control={form.control}
          name="transfer_from_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conta de Origem *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Conta que enviará o dinheiro" />
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

        <FormField
          control={form.control}
          name="transfer_to_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conta de Destino *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Conta que receberá o dinheiro" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {accounts
                    .filter(account => account.id !== fromAccountId)
                    .map((account) => (
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
      </>
    );
  };

  return (
    <TransactionForm
      schema={transferSchema}
      onSubmit={createTransfer.mutate}
      onCancel={onCancel}
      isLoading={createTransfer.isPending}
    >
      <AccountSelects />
    </TransactionForm>
  );
}
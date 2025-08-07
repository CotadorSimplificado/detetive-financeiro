import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useTransactions } from "@/hooks/useTransactions";
import { useFormContext } from "react-hook-form";

interface TransferFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function TransferForm({ onSuccess, onCancel }: TransferFormProps) {
  const queryClient = useQueryClient();
  const { accounts } = useAccounts();
  const { createTransaction } = useTransactions();

  const createTransfer = useMutation({
    mutationFn: async (data: TransferFormData) => {
      // Verificar se as contas existem e têm saldo suficiente
      const fromAccount = accounts.find(acc => acc.id === data.transfer_from_id);
      const toAccount = accounts.find(acc => acc.id === data.transfer_to_id);

      if (!fromAccount || !toAccount) {
        throw new Error("Conta de origem ou destino não encontrada");
      }

      if (fromAccount.current_balance < data.amount) {
        throw new Error("Saldo insuficiente na conta de origem");
      }

      // Criar transação de transferência usando o hook mock
      const transferTransaction = await createTransaction({
        type: 'TRANSFER',
        amount: data.amount,
        description: data.description,
        notes: data.notes,
        date: data.date.toISOString().split('T')[0],
        is_transfer: true,
        transfer_from_id: data.transfer_from_id,
        transfer_to_id: data.transfer_to_id,
        category_id: 'transfer', // Categoria especial para transferências
      });

      return transferTransaction;
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
              <Select onValueChange={field.onChange} value={field.value || ""}>
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
              <Select onValueChange={field.onChange} value={field.value || ""}>
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
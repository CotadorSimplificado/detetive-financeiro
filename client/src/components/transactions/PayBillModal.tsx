
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, CreditCard as CreditCardIcon, DollarSign } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useAccounts } from '@/hooks/useAccounts';
import { useTransactions } from '@/hooks/useTransactions';
import { useCreditCardBills } from '@/hooks/useCreditCardBills';
import { formatCurrency } from '@/lib/currency-utils';
import { Account, CreditCard, CreditCardBill } from '@/data/types';
import { toast } from 'sonner';

const payBillSchema = z.object({
  account_id: z.string().min(1, 'Selecione uma conta'),
  amount: z.number().min(0.01, 'Valor deve ser maior que zero'),
  payment_date: z.string().min(1, 'Data de pagamento é obrigatória'),
  installments: z.number().min(1).max(36).optional(),
  use_installments: z.boolean().default(false),
});

type PayBillForm = z.infer<typeof payBillSchema>;

interface PayBillModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bill: CreditCardBill;
  creditCard: CreditCard;
}

export function PayBillModal({ 
  open, 
  onOpenChange, 
  bill,
  creditCard 
}: PayBillModalProps) {
  const { accounts } = useAccounts();
  const { createTransaction } = useTransactions();
  const { updateBill } = useCreditCardBills();
  const [isLoading, setIsLoading] = useState(false);

  const availableAccounts = accounts.filter(account => 
    account.type !== 'investment'
  );

  const form = useForm<PayBillForm>({
    resolver: zodResolver(payBillSchema),
    defaultValues: {
      account_id: '',
      amount: bill.amount,
      payment_date: new Date().toISOString().split('T')[0],
      installments: 1,
      use_installments: false,
    },
  });

  const watchUseInstallments = form.watch('use_installments');
  const watchInstallments = form.watch('installments') || 1;
  const watchAmount = form.watch('amount') || 0;

  const installmentValue = watchUseInstallments ? watchAmount / watchInstallments : watchAmount;

  const onSubmit = async (data: PayBillForm) => {
    try {
      setIsLoading(true);

      if (data.use_installments && data.installments && data.installments > 1) {
        // Criar múltiplas transações para parcelamento
        const installmentAmount = data.amount / data.installments;
        
        for (let i = 0; i < data.installments; i++) {
          const installmentDate = new Date(data.payment_date);
          installmentDate.setMonth(installmentDate.getMonth() + i);
          
          await createTransaction({
            description: `Fatura ${creditCard.name} (${i + 1}/${data.installments})`,
            amount: installmentAmount,
            type: 'expense',
            date: installmentDate.toISOString(),
            account_id: data.account_id,
            category_id: 'cartao_credito',
            notes: `Parcelamento da fatura do cartão ${creditCard.name} - Parcela ${i + 1} de ${data.installments}`,
          });
        }
      } else {
        // Pagamento à vista
        await createTransaction({
          description: `Pagamento Fatura ${creditCard.name}`,
          amount: data.amount,
          type: 'expense',
          date: data.payment_date,
          account_id: data.account_id,
          category_id: 'cartao_credito',
          notes: `Pagamento da fatura do cartão ${creditCard.name}`,
        });
      }

      // Marcar fatura como paga
      await updateBill(bill.id, {
        ...bill,
        paid: true,
        paid_amount: data.amount,
        paid_date: data.payment_date,
      });

      toast.success(
        data.use_installments && data.installments && data.installments > 1
          ? `Fatura parcelada em ${data.installments}x com sucesso!`
          : 'Fatura paga com sucesso!'
      );
      
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error('Erro ao processar pagamento da fatura');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCardIcon className="h-5 w-5" />
            <span>Pagar Fatura</span>
          </DialogTitle>
        </DialogHeader>

        {/* Resumo da Fatura */}
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Cartão:</span>
                <span className="text-sm font-medium">{creditCard.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Valor da Fatura:</span>
                <span className="text-sm font-bold">{formatCurrency(bill.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Vencimento:</span>
                <span className="text-sm">{new Date(bill.due_date).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Conta de Débito */}
            <FormField
              control={form.control}
              name="account_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conta para Débito</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a conta" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{account.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              {formatCurrency(account.balance)}
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

            {/* Valor do Pagamento */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor do Pagamento</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Data do Pagamento */}
            <FormField
              control={form.control}
              name="payment_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data do Pagamento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* Opção de Parcelamento */}
            <FormField
              control={form.control}
              name="use_installments"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between space-y-0">
                  <div>
                    <FormLabel>Parcelar Pagamento</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Dividir o pagamento em parcelas mensais
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Número de Parcelas */}
            {watchUseInstallments && (
              <FormField
                control={form.control}
                name="installments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Parcelas</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione as parcelas" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 36 }, (_, i) => i + 1).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}x de {formatCurrency(watchAmount / num)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Resumo do Parcelamento */}
            {watchUseInstallments && watchInstallments > 1 && (
              <Card className="border-dashed bg-muted/50">
                <CardContent className="pt-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Valor total:</span>
                      <span>{formatCurrency(watchAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Parcelas:</span>
                      <span>{watchInstallments}x</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span>Valor por parcela:</span>
                      <span>{formatCurrency(installmentValue)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                <DollarSign className="mr-2 h-4 w-4" />
                {isLoading ? 'Processando...' : 
                 watchUseInstallments && watchInstallments > 1 ? 'Parcelar' : 'Pagar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

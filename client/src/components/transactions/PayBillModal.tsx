import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CreditCardBill, usePayCreditCardBill } from "@/hooks/useCreditCardBills";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccounts } from "@/hooks/useAccounts";

const payBillSchema = z.object({
  account_id: z.string().min(1, "Conta é obrigatória"),
  paid_date: z.date(),
});

type PayBillFormData = z.infer<typeof payBillSchema>;

interface PayBillModalProps {
  bill: CreditCardBill;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PayBillModal({ bill, open, onOpenChange }: PayBillModalProps) {
  const { data: accounts } = useAccounts();
  const markBillAsPaid = usePayCreditCardBill();
  const queryClient = useQueryClient();

  const payBillMutation = useMutation({
    mutationFn: async (vars: { billId: string; accountId: string; paidAt: Date }) => {
      // No mock atual, apenas marcamos como paga; poderia registrar transação aqui se necessário
      return await markBillAsPaid(vars.billId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creditCardBills"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    }
  });

  const form = useForm<PayBillFormData>({
    resolver: zodResolver(payBillSchema),
    defaultValues: {
      paid_date: new Date(),
    },
  });

  const handleSubmit = async (data: PayBillFormData) => {
    try {
      await payBillMutation.mutateAsync({
        billId: bill.id,
        accountId: data.account_id,
        paidAt: data.paid_date,
      });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error paying bill:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby="pay-bill-description">
        <DialogHeader>
          <DialogTitle>Pagar Fatura</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Fatura</h3>
                <p className="text-sm text-muted-foreground">
                  Fatura {bill.reference_month}
                </p>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  {formatCurrency(bill.total_amount)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Vence em {format(new Date(bill.due_date), "dd/MM/yyyy", { locale: ptBR })}
                </div>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <p id="pay-bill-description" className="sr-only">Informe a conta de débito e a data do pagamento da fatura selecionada.</p>
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
                        {accounts?.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: account.color || '#2196F3' }}
                              />
                              {account.name}
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
                name="paid_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data do Pagamento</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione a data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          locale={ptBR}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={payBillMutation.isPending}
                  className="flex-1"
                >
                  {payBillMutation.isPending ? "Processando..." : "Confirmar Pagamento"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
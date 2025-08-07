import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useCreditCards } from "@/hooks/useCreditCards";
import { useCategories } from "@/hooks/useCategories";
import { useCreateTransaction } from "@/hooks/useTransactions";
import { useCurrencyInput } from "@/hooks/useCurrencyInput";

const creditCardExpenseSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z.number().min(0.01, "Valor deve ser maior que zero"),
  date: z.date(),
  notes: z.string().optional(),
  category_id: z.string().uuid("Categoria é obrigatória"),
  card_id: z.string().uuid("Cartão é obrigatório"),
  transaction_type: z.enum(["single", "installment"]),
  installments: z.number().min(1).max(60).optional(),
  status: z.enum(["completed", "pending"]),
});

type CreditCardExpenseFormData = z.infer<typeof creditCardExpenseSchema>;

interface CreditCardExpenseFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreditCardExpenseForm({ onSuccess, onCancel }: CreditCardExpenseFormProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  
  const { data: cards } = useCreditCards();
  const { data: categories } = useCategories();
  const createTransactionMutation = useCreateTransaction();
  
  const {
    numericValue: amountValue,
    displayValue: amountDisplay,
    setValue: setAmountValue,
    handleChange: onAmountChange,
  } = useCurrencyInput();

  const form = useForm<CreditCardExpenseFormData>({
    resolver: zodResolver(creditCardExpenseSchema),
    defaultValues: {
      date: new Date(),
      transaction_type: "single",
      installments: 1,
      status: "completed",
    },
  });

  const transactionType = form.watch("transaction_type");
  const expenseCategories = categories?.filter(cat => cat.type === 'EXPENSE') || [];

  const handleSubmit = async (data: CreditCardExpenseFormData) => {
    try {
      if (data.transaction_type === "installment" && data.installments) {
        // Criar transações parceladas
        const installmentGroupId = crypto.randomUUID();
        const baseDate = new Date(data.date);
        
        for (let i = 0; i < data.installments; i++) {
          const installmentDate = new Date(baseDate);
          installmentDate.setMonth(installmentDate.getMonth() + i);
          
          const transactionData = {
            type: 'EXPENSE' as const,
            amount: amountValue / data.installments,
            description: `${data.description} (${i + 1}/${data.installments})`,
            notes: data.notes,
            date: installmentDate.toISOString().split('T')[0],
            card_id: data.card_id,
            category_id: data.category_id,
            is_installment: true,
            installment_number: i + 1,
            installment_total: data.installments,
            installment_group_id: installmentGroupId,
            is_transfer: false,
            is_recurring: false,
            recurrence_type: 'NONE' as const,
            ai_categorized: false,
            paid_at: data.status === "completed" ? new Date().toISOString() : undefined,
          };
          
          await createTransactionMutation.mutateAsync(transactionData);
        }
      } else {
        // Criar transação única
        const transactionData = {
          type: 'EXPENSE' as const,
          amount: amountValue,
          description: data.description,
          notes: data.notes,
          date: data.date.toISOString().split('T')[0],
          card_id: data.card_id,
          category_id: data.category_id,
          is_installment: false,
          is_transfer: false,
          is_recurring: false,
          recurrence_type: 'NONE' as const,
          ai_categorized: false,
          paid_at: data.status === "completed" ? new Date().toISOString() : undefined,
        };
        
        await createTransactionMutation.mutateAsync(transactionData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error creating credit card expense:', error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      {/* Header com botão voltar */}
      <div className="flex items-center gap-2 mb-4">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-medium">Nova Despesa no Cartão</h3>
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          placeholder="Ex: Compra no supermercado"
          {...form.register("description")}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
        )}
      </div>

      {/* Valor */}
      <div className="space-y-2">
        <Label htmlFor="amount">Valor</Label>
        <Input
          id="amount"
          placeholder="R$ 0,00"
          value={amountDisplay}
          onChange={onAmountChange}
        />
        {form.formState.errors.amount && (
          <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>
        )}
      </div>

      {/* Cartão */}
      <div className="space-y-2">
        <Label>Cartão de Crédito</Label>
        <Select onValueChange={(value) => form.setValue("card_id", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o cartão" />
          </SelectTrigger>
          <SelectContent>
            {cards?.map((card) => (
              <SelectItem key={card.id} value={card.id}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: card.color || '#FF9800' }}
                  />
                  {card.name}
                  {card.last_digits && <span className="text-muted-foreground">•••• {card.last_digits}</span>}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.card_id && (
          <p className="text-sm text-destructive">{form.formState.errors.card_id.message}</p>
        )}
      </div>

      {/* Categoria */}
      <div className="space-y-2">
        <Label>Categoria</Label>
        <Select onValueChange={(value) => form.setValue("category_id", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            {expenseCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center gap-2">
                  {category.icon && <span>{category.icon}</span>}
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.category_id && (
          <p className="text-sm text-destructive">{form.formState.errors.category_id.message}</p>
        )}
      </div>

      {/* Tipo de Lançamento */}
      <div className="space-y-2">
        <Label>Tipo de Lançamento</Label>
        <RadioGroup
          value={form.watch("transaction_type")}
          onValueChange={(value) => form.setValue("transaction_type", value as "single" | "installment")}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="single" id="single" />
            <Label htmlFor="single">Fixo</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="installment" id="installment" />
            <Label htmlFor="installment">Parcelado</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Número de Parcelas */}
      {transactionType === "installment" && (
        <div className="space-y-2">
          <Label htmlFor="installments">Número de Parcelas</Label>
          <Select onValueChange={(value) => form.setValue("installments", parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o número de parcelas" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 60 }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}x
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.installments && (
            <p className="text-sm text-destructive">{form.formState.errors.installments.message}</p>
          )}
        </div>
      )}

      {/* Status */}
      <div className="space-y-2">
        <Label>Status da Transação</Label>
        <RadioGroup
          value={form.watch("status")}
          onValueChange={(value) => form.setValue("status", value as "completed" | "pending")}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="completed" id="completed" />
            <Label htmlFor="completed">Efetivada</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pending" id="pending" />
            <Label htmlFor="pending">Pendente</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Data */}
      <div className="space-y-2">
        <Label>Data</Label>
        <Popover open={showCalendar} onOpenChange={setShowCalendar}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !form.watch("date") && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {form.watch("date") ? (
                format(form.watch("date"), "dd/MM/yyyy", { locale: ptBR })
              ) : (
                <span>Selecione a data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={form.watch("date")}
              onSelect={(date) => {
                if (date) {
                  form.setValue("date", date);
                  setShowCalendar(false);
                }
              }}
              locale={ptBR}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        {form.formState.errors.date && (
          <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>
        )}
      </div>

      {/* Observações */}
      <div className="space-y-2">
        <Label htmlFor="notes">Observações (opcional)</Label>
        <Textarea
          id="notes"
          placeholder="Informações adicionais"
          {...form.register("notes")}
        />
      </div>

      {/* Botões */}
      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={createTransactionMutation.isPending || !amountValue}
          className="flex-1"
        >
          {createTransactionMutation.isPending ? "Criando..." : "Criar Despesa"}
        </Button>
      </div>
    </form>
  );
}
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useCategories, suggestCategoryByDescription } from "@/hooks/useCategories";
import { useCurrencyInput } from "@/hooks/useCurrencyInput";

interface BaseTransactionFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
  schema: any;
  defaultValues?: any;
  children?: React.ReactNode;
}

export function TransactionForm({
  onSubmit,
  onCancel,
  isLoading = false,
  schema,
  defaultValues,
  children,
}: BaseTransactionFormProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { data: categories = [] } = useCategories();
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date(),
      description: "",
      amount: 0,
      notes: "",
      ...defaultValues,
    },
  });

  const description = form.watch("description");

  // Auto-sugestão de categoria baseada na descrição
  useEffect(() => {
    if (description && description.length > 3) {
      const suggestedCategory = suggestCategoryByDescription(description, categories);
      if (suggestedCategory && !form.getValues("category_id")) {
        form.setValue("category_id", suggestedCategory.id);
      }
    }
  }, [description, categories, form]);

  // Hook para input de moeda melhorado
  const currencyInput = useCurrencyInput({
    initialValue: defaultValues?.amount || 0,
    maxValue: 999999999.99,
    onChange: (value) => {
      form.setValue("amount", value, { shouldValidate: true });
    },
  });

  // Sincroniza o valor inicial
  useEffect(() => {
    if (defaultValues?.amount && defaultValues.amount !== currencyInput.numericValue) {
      currencyInput.setValue(defaultValues.amount);
    }
  }, [defaultValues?.amount]);

  // Remove a função handleAmountChange antiga pois agora usamos o hook

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Almoço no restaurante"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor *</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    R$
                  </span>
                  <Input 
                    placeholder="0,00"
                    className={cn(
                      "pl-10",
                      !currencyInput.isValid && currencyInput.displayValue && "border-destructive"
                    )}
                    value={currencyInput.displayValue}
                    onChange={currencyInput.handleChange}
                    onFocus={currencyInput.handleFocus}
                    onBlur={() => {
                      currencyInput.handleBlur();
                      field.onBlur();
                    }}
                    inputMode="numeric"
                    autoComplete="off"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data *</FormLabel>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
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
                        format(field.value, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      setCalendarOpen(false);
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo de categoria - apenas para receitas e despesas */}
        {schema._def?.typeName !== "ZodObject" || 
         !schema._def?.shape()?.transfer_from_id ? (
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          {category.icon && <span>{category.icon}</span>}
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        {/* Campos específicos do formulário (contas, cartões, etc.) */}
        {children}

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Observações adicionais (opcional)"
                  className="resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-primary hover:opacity-90"
          >
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
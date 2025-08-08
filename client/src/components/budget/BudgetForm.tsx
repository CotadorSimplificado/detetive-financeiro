import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Target, Percent, X } from "lucide-react";
import { formatCurrency } from "@/lib/currency-utils";
import { useCategories } from "@/hooks/useCategories";
import { useAccounts } from "@/hooks/useAccounts";
import { Budget, BudgetFormData } from "@/data/types/budget";
import { startOfMonth, endOfMonth, addMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

const budgetSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  description: z.string().optional(),
  amount: z.number().min(1, "Valor deve ser maior que zero").max(999999999, "Valor muito alto"),
  period: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY', 'CUSTOM']),
  start_date: z.string().min(1, "Data de início é obrigatória"),
  end_date: z.string().min(1, "Data de fim é obrigatória"),
  category_ids: z.array(z.string()).min(1, "Selecione pelo menos uma categoria"),
  account_ids: z.array(z.string()).optional(),
  alert_percentage: z.number().min(50).max(100).default(80),
  color: z.string().optional(),
  icon: z.string().optional(),
});

interface BudgetFormProps {
  budget?: Budget;
  onSubmit: (data: BudgetFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function BudgetForm({ budget, onSubmit, onCancel, isSubmitting }: BudgetFormProps) {
  const { data: categories = [] } = useCategories();
  const { data: accounts = [] } = useAccounts();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    budget?.category_ids || []
  );
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>(
    budget?.account_ids || []
  );

  const expenseCategories = categories.filter(cat => cat.type === 'EXPENSE');
  
  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      name: budget?.name || "",
      description: budget?.description || "",
      amount: budget?.amount || 0,
      period: budget?.period || 'MONTHLY',
      start_date: budget?.start_date || startOfMonth(new Date()).toISOString().split('T')[0],
      end_date: budget?.end_date || endOfMonth(new Date()).toISOString().split('T')[0],
      category_ids: budget?.category_ids || [],
      account_ids: budget?.account_ids || [],
      alert_percentage: budget?.alert_percentage || 80,
      color: budget?.color || '#10b981',
      icon: budget?.icon || 'Target',
    },
  });

  // Atualizar datas automaticamente baseado no período selecionado
  const handlePeriodChange = (period: BudgetFormData['period']) => {
    const today = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (period) {
      case 'MONTHLY':
        startDate = startOfMonth(today);
        endDate = endOfMonth(today);
        break;
      case 'QUARTERLY':
        startDate = startOfMonth(today);
        endDate = endOfMonth(addMonths(today, 2));
        break;
      case 'YEARLY':
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31);
        break;
      default:
        return; // Para CUSTOM, deixa o usuário definir
    }

    form.setValue('start_date', startDate.toISOString().split('T')[0]);
    form.setValue('end_date', endDate.toISOString().split('T')[0]);
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newSelection);
    form.setValue('category_ids', newSelection);
  };

  const handleAccountToggle = (accountId: string) => {
    const newSelection = selectedAccounts.includes(accountId)
      ? selectedAccounts.filter(id => id !== accountId)
      : [...selectedAccounts, accountId];
    
    setSelectedAccounts(newSelection);
    form.setValue('account_ids', newSelection);
  };

  const handleFormSubmit = (data: BudgetFormData) => {
    onSubmit({
      ...data,
      category_ids: selectedCategories,
      account_ids: selectedAccounts.length > 0 ? selectedAccounts : undefined
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Orçamento</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Gastos do mês" {...field} data-testid="input-budget-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o que este orçamento engloba..." 
                        className="resize-none"
                        rows={3}
                        {...field}
                        data-testid="textarea-budget-description"
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
                    <FormLabel>Valor Total</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0,00"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        data-testid="input-budget-amount"
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value > 0 && `Equivale a ${formatCurrency(field.value)}`}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Período e alertas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Período e Alertas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Período</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        handlePeriodChange(value as BudgetFormData['period']);
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-budget-period">
                          <SelectValue placeholder="Selecione o período" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MONTHLY">Mensal</SelectItem>
                        <SelectItem value="QUARTERLY">Trimestral</SelectItem>
                        <SelectItem value="YEARLY">Anual</SelectItem>
                        <SelectItem value="CUSTOM">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Início</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-budget-start-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Fim</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-budget-end-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="alert_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alerta em % do orçamento</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="50"
                          max="100"
                          step="5"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          data-testid="input-budget-alert-percentage"
                        />
                        <Percent className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Receba um alerta quando atingir {field.value}% do orçamento
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* Seleção de categorias */}
        <Card>
          <CardHeader>
            <CardTitle>Categorias</CardTitle>
            <p className="text-sm text-muted-foreground">
              Selecione as categorias que farão parte deste orçamento
            </p>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="category_ids"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {expenseCategories.map((category) => (
                      <div
                        key={category.id}
                        onClick={() => handleCategoryToggle(category.id)}
                        className={`
                          flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors
                          ${selectedCategories.includes(category.id) 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:bg-accent'
                          }
                        `}
                        data-testid={`category-option-${category.id}`}
                      >
                        <span className="text-sm font-medium">{category.name}</span>
                        {selectedCategories.includes(category.id) && (
                          <Badge variant="secondary" className="text-xs">✓</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {selectedCategories.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Categorias selecionadas:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCategories.map((categoryId) => {
                          const category = expenseCategories.find(c => c.id === categoryId);
                          return category ? (
                            <Badge key={categoryId} variant="outline" className="flex items-center gap-1">
                              {category.name}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCategoryToggle(categoryId);
                                }}
                                className="ml-1 hover:text-destructive"
                                data-testid={`remove-category-${categoryId}`}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                  
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} data-testid="button-save-budget">
            {isSubmitting ? 'Salvando...' : budget ? 'Atualizar' : 'Criar Orçamento'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
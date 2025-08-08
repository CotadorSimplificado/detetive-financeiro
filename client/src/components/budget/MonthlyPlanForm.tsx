
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Target } from "lucide-react";
import { formatCurrency } from "@/lib/currency-utils";
import { useCategories } from "@/hooks/useCategories";
import { MonthlyPlan, CategoryBudget } from "@/data/types/budget";
import { useCompetenceFilter } from "@/hooks/useCompetenceFilter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const planSchema = z.object({
  total_budget: z.number().min(1, "Orçamento total deve ser maior que zero"),
  category_budgets: z.record(z.number().min(0, "Valor não pode ser negativo"))
});

type PlanFormData = z.infer<typeof planSchema>;

interface MonthlyPlanFormProps {
  currentPlan?: MonthlyPlan;
  onSubmit: (totalBudget: number, categoryBudgets: CategoryBudget[]) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function MonthlyPlanForm({ 
  currentPlan, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}: MonthlyPlanFormProps) {
  const { data: categories = [] } = useCategories();
  const { currentCompetence } = useCompetenceFilter();

  const expenseCategories = categories.filter(cat => cat.type === 'EXPENSE');

  const form = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      total_budget: currentPlan?.total_budget || 0,
      category_budgets: currentPlan?.category_budgets.reduce((acc, cb) => {
        acc[cb.category_id] = cb.planned_amount;
        return acc;
      }, {} as Record<string, number>) || {}
    },
  });

  const watchedBudgets = form.watch('category_budgets');
  const totalCategoryBudgets = Object.values(watchedBudgets || {}).reduce((sum, value) => sum + (value || 0), 0);
  const totalBudget = form.watch('total_budget');
  const remaining = totalBudget - totalCategoryBudgets;

  const handleFormSubmit = (data: PlanFormData) => {
    const categoryBudgets: CategoryBudget[] = Object.entries(data.category_budgets)
      .filter(([_, amount]) => amount > 0)
      .map(([categoryId, amount]) => ({
        category_id: categoryId,
        planned_amount: amount
      }));

    onSubmit(data.total_budget, categoryBudgets);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Header com informações do mês */}
        <Card className="bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">
                Planejamento para {format(new Date(currentCompetence.year, currentCompetence.month - 1), 'MMMM yyyy', { locale: ptBR })}
              </h3>
            </div>
          </CardContent>
        </Card>

        {/* Orçamento Total */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Orçamento Total do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="total_budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Total Disponível</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      data-testid="input-total-budget"
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

        {/* Orçamento por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
            <p className="text-sm text-muted-foreground">
              Defina quanto pretende gastar em cada categoria (não é obrigatório usar todo o orçamento)
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expenseCategories.map((category) => (
                <FormField
                  key={category.id}
                  control={form.control}
                  name={`category_budgets.${category.id}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{category.name}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0,00"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                          data-testid={`input-category-${category.id}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {/* Resumo da distribuição */}
            {totalBudget > 0 && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Orçamento total:</span>
                    <span className="font-semibold">{formatCurrency(totalBudget)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total distribuído:</span>
                    <span className="font-semibold">{formatCurrency(totalCategoryBudgets)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Restante:</span>
                    <span className={`font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(remaining)}
                    </span>
                  </div>
                  {remaining < 0 && (
                    <p className="text-red-600 text-xs">
                      ⚠️ O valor distribuído excede o orçamento total
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} data-testid="button-save-plan">
            {isSubmitting ? 'Salvando...' : currentPlan ? 'Atualizar' : 'Criar Planejamento'}
          </Button>
        </div>
      </form>
    </Form>
  );
}


import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/currency-utils";
import { CategoryBudgetSummary } from "@/data/types/budget";
import { cn } from "@/lib/utils";

interface CategoryBudgetCardProps {
  category: CategoryBudgetSummary;
}

export function CategoryBudgetCard({ category }: CategoryBudgetCardProps) {
  const getStatusColor = (status: CategoryBudgetSummary['status']) => {
    switch (status) {
      case 'SAFE': return 'text-green-600 dark:text-green-400';
      case 'WARNING': return 'text-yellow-600 dark:text-yellow-400';
      case 'DANGER': return 'text-orange-600 dark:text-orange-400';
      case 'EXCEEDED': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBadge = (status: CategoryBudgetSummary['status']) => {
    switch (status) {
      case 'SAFE': return <Badge variant="outline" className="text-green-700 border-green-300">No Limite</Badge>;
      case 'WARNING': return <Badge variant="outline" className="text-yellow-700 border-yellow-300">Atenção</Badge>;
      case 'DANGER': return <Badge variant="outline" className="text-orange-700 border-orange-300">Perigo</Badge>;
      case 'EXCEEDED': return <Badge variant="destructive">Excedido</Badge>;
      default: return <Badge variant="secondary">-</Badge>;
    }
  };

  const progressValue = Math.min(category.percentage_used || 0, 100);
  const isOverBudget = (category.percentage_used || 0) > 100;

  return (
    <Card className={cn(
      "transition-all duration-200",
      category.status === 'EXCEEDED' && "border-red-200 bg-red-50/30 dark:bg-red-950/10",
      category.status === 'DANGER' && "border-orange-200 bg-orange-50/30 dark:bg-orange-950/10",
      category.status === 'WARNING' && "border-yellow-200 bg-yellow-50/30 dark:bg-yellow-950/10"
    )}>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-sm">{category.category_name}</h4>
          </div>
          {getStatusBadge(category.status)}
        </div>

        {/* Valores */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-muted-foreground">Planejado</p>
            <p className="font-semibold">{formatCurrency(category.planned_amount)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Gasto</p>
            <p className={cn(
              "font-semibold",
              getStatusColor(category.status)
            )}>
              {formatCurrency(category.spent_amount || 0)}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Progresso</span>
            <span className={cn(
              "font-medium",
              getStatusColor(category.status)
            )}>
              {(category.percentage_used || 0).toFixed(1)}%
            </span>
          </div>
          
          <div className="relative">
            <Progress value={progressValue} className="h-2" />
            {isOverBudget && (
              <div className="absolute inset-0 bg-red-500 rounded-full h-2" />
            )}
          </div>

          {isOverBudget && (
            <p className="text-xs text-red-600 dark:text-red-400">
              Excedido em {formatCurrency((category.spent_amount || 0) - category.planned_amount)}
            </p>
          )}
        </div>

        {/* Valor restante */}
        <div className="text-xs">
          <p className="text-muted-foreground">Restante</p>
          <p className={cn(
            "font-semibold",
            (category.planned_amount - (category.spent_amount || 0)) >= 0 
              ? "text-green-600 dark:text-green-400" 
              : "text-red-600 dark:text-red-400"
          )}>
            {formatCurrency(Math.max(0, category.planned_amount - (category.spent_amount || 0)))}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

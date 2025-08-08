import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { formatCurrency } from "@/lib/currency-utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Budget, BudgetSummary } from "@/data/types/budget";

interface BudgetCardProps {
  budget: Budget;
  summary: BudgetSummary;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: Budget['status']) => void;
}

export function BudgetCard({ 
  budget, 
  summary, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: BudgetCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getStatusColor = (status: Budget['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500';
      case 'EXCEEDED':
        return 'bg-red-500';
      case 'INACTIVE':
        return 'bg-gray-500';
      case 'COMPLETED':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: Budget['status']) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="outline" className="text-green-700 border-green-300">Ativo</Badge>;
      case 'EXCEEDED':
        return <Badge variant="destructive">Excedido</Badge>;
      case 'INACTIVE':
        return <Badge variant="secondary">Inativo</Badge>;
      case 'COMPLETED':
        return <Badge variant="outline" className="text-blue-700 border-blue-300">Concluído</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const isOverBudget = summary.is_over_budget;
  const isNearLimit = summary.percentage_used >= budget.alert_percentage;

  return (
    <>
      <Card className={cn(
        "relative overflow-hidden transition-all duration-200 hover:shadow-md",
        isOverBudget && "border-red-200 bg-red-50/30 dark:bg-red-950/10",
        isNearLimit && !isOverBudget && "border-yellow-200 bg-yellow-50/30 dark:bg-yellow-950/10"
      )}>
        {/* Indicador de status */}
        <div 
          className={cn("absolute top-0 left-0 w-full h-1", getStatusColor(budget.status))}
        />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-foreground">
                {budget.name}
              </CardTitle>
              {budget.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {budget.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {getStatusBadge(budget.status)}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    data-testid={`button-budget-menu-${budget.id}`}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(budget)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onToggleStatus(
                      budget.id, 
                      budget.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                    )}
                  >
                    {budget.status === 'ACTIVE' ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Ativar
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Informações principais */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-3 w-3" />
                Orçado
              </div>
              <p className="font-semibold text-lg">
                {formatCurrency(summary.total_budgeted)}
              </p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {summary.is_over_budget ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-red-500" />
                    Gasto
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 text-green-500" />
                    Gasto
                  </>
                )}
              </div>
              <p className={cn(
                "font-semibold text-lg",
                summary.is_over_budget ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
              )}>
                {formatCurrency(summary.total_spent)}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Progresso
              </span>
              <span className={cn(
                "font-medium",
                summary.percentage_used >= 100 ? "text-red-600 dark:text-red-400" : "text-foreground"
              )}>
                {summary.percentage_used.toFixed(1)}%
              </span>
            </div>
            
            <div className="relative">
              <Progress 
                value={Math.min(summary.percentage_used, 100)} 
                className="h-2"
              />
              {summary.percentage_used >= 100 && (
                <div className="absolute inset-0 bg-red-500 rounded-full h-2" />
              )}
            </div>
            
            {summary.is_over_budget && (
              <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                <AlertTriangle className="h-3 w-3" />
                Excedido em {formatCurrency(summary.total_spent - summary.total_budgeted)}
              </div>
            )}
            
            {!summary.is_over_budget && summary.percentage_used >= budget.alert_percentage && (
              <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                <AlertTriangle className="h-3 w-3" />
                Próximo do limite ({budget.alert_percentage}%)
              </div>
            )}
          </div>

          {/* Informações adicionais */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {summary.days_remaining} dias restantes
            </div>
            
            <div className="text-right">
              <div>Restante: {formatCurrency(summary.total_remaining)}</div>
              {summary.days_remaining > 0 && (
                <div>Por dia: {formatCurrency(summary.daily_budget_remaining)}</div>
              )}
            </div>
          </div>

          {/* Projeção */}
          {summary.projected_spending > summary.total_budgeted && !summary.is_over_budget && (
            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    Atenção: Possível excesso
                  </p>
                  <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                    Projeção: {formatCurrency(summary.projected_spending)} 
                    ({(summary.projected_spending / summary.total_budgeted * 100).toFixed(0)}%)
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmação para exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Orçamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o orçamento "{budget.name}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                onDelete(budget.id);
                setShowDeleteDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
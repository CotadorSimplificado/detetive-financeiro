
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Plus, 
  Copy,
  Target, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  DollarSign,
  Calendar,
  CheckCircle,
  Edit
} from "lucide-react";
import { CompetenceFilter } from "@/components/transactions/CompetenceFilter";
import { MonthlyPlanForm } from "@/components/budget/MonthlyPlanForm";
import { CategoryBudgetCard } from "@/components/budget/CategoryBudgetCard";
import { useMonthlyPlan, useCreateMonthlyPlan, useUpdateMonthlyPlan } from "@/hooks/useMonthlyPlan";
import { useCompetenceFilter } from "@/hooks/useCompetenceFilter";
import { formatCurrency } from "@/lib/currency-utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CategoryBudget } from "@/data/types/budget";
import { cn } from "@/lib/utils";

export default function Budgets() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { currentCompetence } = useCompetenceFilter();
  const { 
    currentPlan, 
    previousPlan, 
    planSummary, 
    hasPlan, 
    hasPreviousPlan,
    copyFromPrevious 
  } = useMonthlyPlan();
  
  const createPlan = useCreateMonthlyPlan();
  const updatePlan = useUpdateMonthlyPlan();

  const handleCreatePlan = () => {
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditPlan = () => {
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleCopyFromPrevious = async () => {
    try {
      await copyFromPrevious();
      // Em um app real, isso atualizaria o estado via query cache
      window.location.reload();
    } catch (error) {
      console.error('Erro ao copiar planejamento:', error);
    }
  };

  const handleSubmit = async (totalBudget: number, categoryBudgets: CategoryBudget[]) => {
    try {
      if (isEditing && currentPlan) {
        await updatePlan.mutateAsync(totalBudget, categoryBudgets);
      } else {
        await createPlan.mutateAsync(totalBudget, categoryBudgets);
      }
      setIsModalOpen(false);
      setIsEditing(false);
      // Em um app real, isso atualizaria via query cache
      window.location.reload();
    } catch (error) {
      console.error('Erro ao salvar planejamento:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SAFE': return 'text-green-600 dark:text-green-400';
      case 'WARNING': return 'text-yellow-600 dark:text-yellow-400';
      case 'DANGER': return 'text-orange-600 dark:text-orange-400';
      case 'EXCEEDED': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SAFE': return <Badge variant="outline" className="text-green-700 border-green-300">No Limite</Badge>;
      case 'WARNING': return <Badge variant="outline" className="text-yellow-700 border-yellow-300">Atenção</Badge>;
      case 'DANGER': return <Badge variant="outline" className="text-orange-700 border-orange-300">Perigo</Badge>;
      case 'EXCEEDED': return <Badge variant="destructive">Excedido</Badge>;
      default: return <Badge variant="secondary">-</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Planejamento Mensal</h1>
            <p className="text-muted-foreground">
              Gerencie seu orçamento mensal por categoria
            </p>
          </div>
          <div className="flex gap-2">
            <CompetenceFilter />
          </div>
        </div>

        {/* Estado: Sem planejamento */}
        {!hasPlan && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhum planejamento para {format(new Date(currentCompetence.year, currentCompetence.month - 1), 'MMMM yyyy', { locale: ptBR })}
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Crie um planejamento para controlar seus gastos mensais por categoria.
              </p>
              <div className="flex gap-3">
                <Button onClick={handleCreatePlan}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Planejamento
                </Button>
                {hasPreviousPlan && (
                  <Button variant="outline" onClick={handleCopyFromPrevious}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar do Mês Anterior
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estado: Com planejamento */}
        {hasPlan && planSummary && (
          <>
            {/* Resumo Geral */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Orçamento Total
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(planSummary.total_planned)}
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Gasto
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(planSummary.total_spent)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="mt-2">
                    <Progress value={planSummary.percentage_used} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {planSummary.percentage_used.toFixed(1)}% utilizado
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Disponível
                      </p>
                      <p className={cn(
                        "text-2xl font-bold",
                        planSummary.total_remaining > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}>
                        {formatCurrency(planSummary.total_remaining)}
                      </p>
                    </div>
                    {planSummary.total_remaining > 0 ? (
                      <TrendingDown className="h-8 w-8 text-green-600" />
                    ) : (
                      <TrendingUp className="h-8 w-8 text-red-600" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alertas */}
            {planSummary.alerts.length > 0 && (
              <Alert className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Atenção nos gastos:</p>
                    {planSummary.alerts.slice(0, 3).map((alert, index) => (
                      <p key={index} className="text-sm">
                        • <strong>{alert.category_name}</strong>: {alert.alert_type === 'EXCEEDED' ? 'Orçamento excedido' : 'Próximo do limite'} ({alert.percentage.toFixed(0)}%)
                      </p>
                    ))}
                    {planSummary.alerts.length > 3 && (
                      <p className="text-sm text-muted-foreground">
                        E mais {planSummary.alerts.length - 3} alertas...
                      </p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Ações */}
            <div className="flex justify-end">
              <Button onClick={handleEditPlan}>
                <Edit className="h-4 w-4 mr-2" />
                Editar Planejamento
              </Button>
            </div>

            {/* Orçamento por Categoria */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Orçamento por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {planSummary.categories_summary.map((category) => (
                    <CategoryBudgetCard
                      key={category.category_id}
                      category={category}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Modal de criação/edição */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Editar Planejamento' : 'Novo Planejamento'}
              </DialogTitle>
            </DialogHeader>
            <MonthlyPlanForm
              currentPlan={isEditing ? currentPlan : undefined}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsModalOpen(false);
                setIsEditing(false);
              }}
              isSubmitting={createPlan.isPending || updatePlan.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}

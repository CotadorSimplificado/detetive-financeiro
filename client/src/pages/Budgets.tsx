import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Search, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  DollarSign,
  Calendar,
  Filter
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useBudgets, useCreateBudget, useUpdateBudget, useDeleteBudget } from "@/hooks/useBudgets";
import { BudgetCard } from "@/components/budget/BudgetCard";
import { BudgetForm } from "@/components/budget/BudgetForm";
import { formatCurrency } from "@/lib/currency-utils";
import { Budget, BudgetFormData, BudgetAlert } from "@/data/types/budget";

export default function Budgets() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const { budgets, budgetSummaries, budgetAlerts } = useBudgets();
  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();
  const deleteBudget = useDeleteBudget();

  const isLoading = false; // Em um app real, viria dos hooks de query

  const filteredSummaries = budgetSummaries.filter(summary => {
    const matchesSearch = summary.budget.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || summary.budget.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calcular estatísticas gerais
  const totalBudgeted = budgetSummaries.reduce((sum, summary) => sum + summary.total_budgeted, 0);
  const totalSpent = budgetSummaries.reduce((sum, summary) => sum + summary.total_spent, 0);
  const totalRemaining = Math.max(0, totalBudgeted - totalSpent);
  const averageUsage = budgetSummaries.length > 0 
    ? budgetSummaries.reduce((sum, summary) => sum + summary.percentage_used, 0) / budgetSummaries.length 
    : 0;

  const activeBudgets = budgetSummaries.filter(s => s.budget.status === 'ACTIVE').length;
  const exceededBudgets = budgetSummaries.filter(s => s.is_over_budget).length;
  const criticalAlerts = budgetAlerts.filter(alert => 
    alert.alert_type === 'BUDGET_EXCEEDED' || alert.alert_type === 'CATEGORY_EXCEEDED'
  ).length;

  const handleSubmit = async (data: BudgetFormData) => {
    try {
      if (editingBudget) {
        await updateBudget.mutateAsync(editingBudget.id, data);
      } else {
        await createBudget.mutateAsync(data);
      }
      setIsModalOpen(false);
      setEditingBudget(null);
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error);
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBudget.mutateAsync(id);
    } catch (error) {
      console.error('Erro ao excluir orçamento:', error);
    }
  };

  const handleToggleStatus = async (id: string, status: Budget['status']) => {
    try {
      // Em um app real, isso atualizaria o status via API
      console.log('Alterando status:', id, status);
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  const getAlertIcon = (alertType: BudgetAlert['alert_type']) => {
    switch (alertType) {
      case 'BUDGET_EXCEEDED':
      case 'CATEGORY_EXCEEDED':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'THRESHOLD_REACHED':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'PROJECTED_OVERSPENDING':
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Orçamentos</h1>
            <p className="text-muted-foreground">
              Gerencie seus orçamentos e acompanhe seus gastos
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} data-testid="button-create-budget">
            <Plus className="h-4 w-4 mr-2" />
            Novo Orçamento
          </Button>
        </div>

        {/* Estatísticas gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Orçado
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(totalBudgeted)}
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
                    {formatCurrency(totalSpent)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2">
                <Progress value={(totalSpent / totalBudgeted) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Orçamentos Ativos
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {activeBudgets}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    de {budgetSummaries.length} total
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Alertas
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {criticalAlerts}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {exceededBudgets} excedidos
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertas */}
        {budgetAlerts.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <AlertTriangle className="h-5 w-5" />
                Alertas de Orçamento ({budgetAlerts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {budgetAlerts.slice(0, 3).map((alert, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border">
                    {getAlertIcon(alert.alert_type)}
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {alert.budget_name}
                        {alert.category_name && ` - ${alert.category_name}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {alert.alert_type === 'BUDGET_EXCEEDED' && `Orçamento excedido em ${formatCurrency(alert.amount_over || 0)}`}
                        {alert.alert_type === 'THRESHOLD_REACHED' && `Limite de ${alert.percentage.toFixed(0)}% atingido`}
                        {alert.alert_type === 'CATEGORY_EXCEEDED' && `Categoria excedida em ${formatCurrency(alert.amount_over || 0)}`}
                        {alert.alert_type === 'PROJECTED_OVERSPENDING' && `Projeção de excesso: ${formatCurrency(alert.amount_over || 0)}`}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {alert.percentage.toFixed(0)}%
                    </Badge>
                  </div>
                ))}
                {budgetAlerts.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center">
                    E mais {budgetAlerts.length - 3} alertas...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar orçamentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-budgets"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]" data-testid="select-filter-status">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="ACTIVE">Ativos</SelectItem>
              <SelectItem value="EXCEEDED">Excedidos</SelectItem>
              <SelectItem value="INACTIVE">Inativos</SelectItem>
              <SelectItem value="COMPLETED">Concluídos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de orçamentos */}
        {filteredSummaries.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm || filterStatus !== "all" 
                  ? "Nenhum orçamento encontrado"
                  : "Nenhum orçamento criado"
                }
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm || filterStatus !== "all"
                  ? "Tente ajustar os filtros para encontrar seus orçamentos."
                  : "Comece criando seu primeiro orçamento para controlar seus gastos."
                }
              </p>
              {!searchTerm && filterStatus === "all" && (
                <Button onClick={() => setIsModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Orçamento
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSummaries.map((summary) => (
              <BudgetCard
                key={summary.budget.id}
                budget={summary.budget}
                summary={summary}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}

        {/* Modal de criação/edição */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBudget ? 'Editar Orçamento' : 'Novo Orçamento'}
              </DialogTitle>
            </DialogHeader>
            <BudgetForm
              budget={editingBudget || undefined}
              onSubmit={handleSubmit}
              onCancel={closeModal}
              isSubmitting={createBudget.isPending || updateBudget.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
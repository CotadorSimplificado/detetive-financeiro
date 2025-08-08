import { useMemo } from 'react';
import { useMockStore } from '@/data/store/mockContext';
import { Budget, BudgetSummary, BudgetSpending, BudgetAlert, BudgetFormData } from '@/data/types/budget';
import { endOfMonth, startOfMonth, isWithinInterval, differenceInDays } from 'date-fns';

// Mock data para orçamentos
const mockBudgets: Budget[] = [
  {
    id: '1',
    user_id: '1',
    name: 'Gastos Essenciais',
    description: 'Alimentação, transporte e moradia',
    amount: 3000,
    period: 'MONTHLY',
    start_date: startOfMonth(new Date()).toISOString(),
    end_date: endOfMonth(new Date()).toISOString(),
    status: 'ACTIVE',
    category_ids: ['food', 'transport', 'housing'],
    alert_percentage: 80,
    is_active: true,
    color: '#10b981',
    icon: 'Home',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: '1',
    name: 'Entretenimento',
    description: 'Lazer, streaming, restaurantes',
    amount: 800,
    period: 'MONTHLY',
    start_date: startOfMonth(new Date()).toISOString(),
    end_date: endOfMonth(new Date()).toISOString(),
    status: 'ACTIVE',
    category_ids: ['entertainment', 'dining'],
    alert_percentage: 75,
    is_active: true,
    color: '#f59e0b',
    icon: 'Film',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    user_id: '1',
    name: 'Compras Pessoais',
    description: 'Roupas, cosméticos, presentes',
    amount: 600,
    period: 'MONTHLY',
    start_date: startOfMonth(new Date()).toISOString(),
    end_date: endOfMonth(new Date()).toISOString(),
    status: 'EXCEEDED',
    category_ids: ['shopping', 'personal'],
    alert_percentage: 70,
    is_active: true,
    color: '#ef4444',
    icon: 'ShoppingBag',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export function useBudgets() {
  const { transactions, categories } = useMockStore();
  
  // Calcular resumos dos orçamentos
  const budgetSummaries = useMemo((): BudgetSummary[] => {
    return mockBudgets.map(budget => {
      const budgetStart = new Date(budget.start_date);
      const budgetEnd = new Date(budget.end_date);
      
      // Filtrar transações do período do orçamento
      const budgetTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return (
          (transaction.type === 'EXPENSE' || transaction.type === 'CREDIT_CARD_EXPENSE') &&
          isWithinInterval(transactionDate, { start: budgetStart, end: budgetEnd }) &&
          budget.category_ids.includes(transaction.category_id)
        );
      });

      // Calcular gastos por categoria
      const spendingByCategory: BudgetSpending[] = budget.category_ids.map(categoryId => {
        const category = categories.find(c => c.id === categoryId);
        const categoryTransactions = budgetTransactions.filter(t => t.category_id === categoryId);
        const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
        
        // Distribuir orçamento proporcionalmente por categoria (simplificado)
        const categoryBudget = budget.amount / budget.category_ids.length;
        
        return {
          budget_id: budget.id,
          category_id: categoryId,
          category_name: category?.name || 'Categoria desconhecida',
          budgeted_amount: categoryBudget,
          spent_amount: spent,
          remaining_amount: Math.max(0, categoryBudget - spent),
          percentage_used: categoryBudget > 0 ? (spent / categoryBudget) * 100 : 0,
          transaction_count: categoryTransactions.length,
          last_transaction_date: categoryTransactions.length > 0 
            ? categoryTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
            : undefined
        };
      });

      const totalSpent = budgetTransactions.reduce((sum, t) => sum + t.amount, 0);
      const totalRemaining = Math.max(0, budget.amount - totalSpent);
      const percentageUsed = budget.amount > 0 ? (totalSpent / budget.amount) * 100 : 0;
      const daysRemaining = Math.max(0, differenceInDays(budgetEnd, new Date()));
      const dailyBudgetRemaining = daysRemaining > 0 ? totalRemaining / daysRemaining : 0;
      
      // Projeção de gastos baseada na média diária
      const daysPassed = differenceInDays(new Date(), budgetStart);
      const dailyAverage = daysPassed > 0 ? totalSpent / daysPassed : 0;
      const totalDays = differenceInDays(budgetEnd, budgetStart);
      const projectedSpending = dailyAverage * totalDays;

      return {
        budget,
        total_budgeted: budget.amount,
        total_spent: totalSpent,
        total_remaining: totalRemaining,
        percentage_used: percentageUsed,
        spending_by_category: spendingByCategory,
        days_remaining: daysRemaining,
        daily_budget_remaining: dailyBudgetRemaining,
        is_over_budget: totalSpent > budget.amount,
        projected_spending: projectedSpending
      };
    });
  }, [transactions, categories]);

  // Gerar alertas de orçamento
  const budgetAlerts = useMemo((): BudgetAlert[] => {
    const alerts: BudgetAlert[] = [];
    
    budgetSummaries.forEach(summary => {
      const { budget, percentage_used, total_spent, is_over_budget, projected_spending, spending_by_category } = summary;
      
      // Alerta de limite atingido
      if (percentage_used >= budget.alert_percentage && percentage_used < 100) {
        alerts.push({
          budget_id: budget.id,
          budget_name: budget.name,
          alert_type: 'THRESHOLD_REACHED',
          percentage: percentage_used,
          triggered_at: new Date().toISOString()
        });
      }
      
      // Alerta de orçamento excedido
      if (is_over_budget) {
        alerts.push({
          budget_id: budget.id,
          budget_name: budget.name,
          alert_type: 'BUDGET_EXCEEDED',
          percentage: percentage_used,
          amount_over: total_spent - budget.amount,
          triggered_at: new Date().toISOString()
        });
      }
      
      // Alerta de categoria excedida
      spending_by_category.forEach(categorySpending => {
        if (categorySpending.percentage_used > 100) {
          alerts.push({
            budget_id: budget.id,
            budget_name: budget.name,
            alert_type: 'CATEGORY_EXCEEDED',
            percentage: categorySpending.percentage_used,
            category_name: categorySpending.category_name,
            amount_over: categorySpending.spent_amount - categorySpending.budgeted_amount,
            triggered_at: new Date().toISOString()
          });
        }
      });
      
      // Alerta de projeção de excesso de gastos
      if (projected_spending > budget.amount && !is_over_budget) {
        alerts.push({
          budget_id: budget.id,
          budget_name: budget.name,
          alert_type: 'PROJECTED_OVERSPENDING',
          percentage: (projected_spending / budget.amount) * 100,
          amount_over: projected_spending - budget.amount,
          triggered_at: new Date().toISOString()
        });
      }
    });
    
    return alerts;
  }, [budgetSummaries]);

  const createBudget = async (data: BudgetFormData): Promise<Budget> => {
    // Em um app real, isso faria uma chamada para a API
    const newBudget: Budget = {
      id: Date.now().toString(),
      user_id: '1',
      status: 'ACTIVE',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data
    };
    
    console.log('Criando orçamento:', newBudget);
    return newBudget;
  };

  const updateBudget = async (id: string, data: Partial<BudgetFormData>): Promise<Budget> => {
    console.log('Atualizando orçamento:', id, data);
    const budget = mockBudgets.find(b => b.id === id);
    if (!budget) throw new Error('Orçamento não encontrado');
    
    return { ...budget, ...data, updated_at: new Date().toISOString() };
  };

  const deleteBudget = async (id: string): Promise<void> => {
    console.log('Deletando orçamento:', id);
  };

  const toggleBudgetStatus = async (id: string, status: Budget['status']): Promise<void> => {
    console.log('Alterando status do orçamento:', id, status);
  };

  return {
    budgets: mockBudgets,
    budgetSummaries,
    budgetAlerts,
    createBudget,
    updateBudget,
    deleteBudget,
    toggleBudgetStatus
  };
}

export function useCreateBudget() {
  const { createBudget } = useBudgets();
  return { mutateAsync: createBudget, isPending: false };
}

export function useUpdateBudget() {
  const { updateBudget } = useBudgets();
  return { mutateAsync: updateBudget, isPending: false };
}

export function useDeleteBudget() {
  const { deleteBudget } = useBudgets();
  return { mutateAsync: deleteBudget, isPending: false };
}
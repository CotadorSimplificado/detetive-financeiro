
import { useMemo } from 'react';
import { useMockStore } from '@/data/store/mockContext';
import { useCompetenceFilter } from './useCompetenceFilter';
import { useCategories } from './useCategories';
import { 
  MonthlyPlan, 
  MonthlyPlanSummary, 
  CategoryBudget, 
  CategoryBudgetSummary,
  PlanAlert 
} from '@/data/types/budget';

// Mock data para planejamentos mensais
const mockMonthlyPlans: MonthlyPlan[] = [
  {
    id: '1',
    user_id: '1',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    total_budget: 4500,
    category_budgets: [
      { category_id: 'food', planned_amount: 1200 },
      { category_id: 'transport', planned_amount: 600 },
      { category_id: 'housing', planned_amount: 1500 },
      { category_id: 'entertainment', planned_amount: 400 },
      { category_id: 'shopping', planned_amount: 500 },
      { category_id: 'health', planned_amount: 300 }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export function useMonthlyPlan() {
  const { transactions } = useMockStore();
  const { currentCompetence } = useCompetenceFilter();
  const { data: categories = [] } = useCategories();

  const currentPlan = useMemo(() => {
    return mockMonthlyPlans.find(plan => 
      plan.month === currentCompetence.month && 
      plan.year === currentCompetence.year
    );
  }, [currentCompetence]);

  const previousPlan = useMemo(() => {
    const prevMonth = currentCompetence.month === 1 ? 12 : currentCompetence.month - 1;
    const prevYear = currentCompetence.month === 1 ? currentCompetence.year - 1 : currentCompetence.year;
    
    return mockMonthlyPlans.find(plan => 
      plan.month === prevMonth && 
      plan.year === prevYear
    );
  }, [currentCompetence]);

  const planSummary = useMemo((): MonthlyPlanSummary | null => {
    if (!currentPlan) return null;

    // Filtrar transações do mês atual
    const monthTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() + 1 === currentCompetence.month &&
        transactionDate.getFullYear() === currentCompetence.year &&
        (transaction.type === 'EXPENSE' || transaction.type === 'CREDIT_CARD_EXPENSE')
      );
    });

    // Calcular gastos por categoria
    const categoriesSummary: CategoryBudgetSummary[] = currentPlan.category_budgets.map(categoryBudget => {
      const category = categories.find(c => c.id === categoryBudget.category_id);
      const categoryTransactions = monthTransactions.filter(t => t.category_id === categoryBudget.category_id);
      const spentAmount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
      const percentageUsed = categoryBudget.planned_amount > 0 
        ? (spentAmount / categoryBudget.planned_amount) * 100 
        : 0;

      let status: CategoryBudgetSummary['status'] = 'SAFE';
      if (percentageUsed > 100) status = 'EXCEEDED';
      else if (percentageUsed >= 90) status = 'DANGER';
      else if (percentageUsed >= 70) status = 'WARNING';

      return {
        ...categoryBudget,
        category_name: category?.name || 'Categoria desconhecida',
        category_icon: category?.icon,
        category_color: category?.color,
        spent_amount: spentAmount,
        percentage_used: percentageUsed,
        status,
        is_over_budget: spentAmount > categoryBudget.planned_amount
      };
    });

    const totalSpent = categoriesSummary.reduce((sum, cat) => sum + (cat.spent_amount || 0), 0);
    const totalRemaining = Math.max(0, currentPlan.total_budget - totalSpent);
    const overallPercentage = currentPlan.total_budget > 0 
      ? (totalSpent / currentPlan.total_budget) * 100 
      : 0;

    // Gerar alertas
    const alerts: PlanAlert[] = [];
    categoriesSummary.forEach(category => {
      if (category.status === 'EXCEEDED') {
        alerts.push({
          category_id: category.category_id,
          category_name: category.category_name,
          alert_type: 'EXCEEDED',
          current_amount: category.spent_amount || 0,
          planned_amount: category.planned_amount,
          percentage: category.percentage_used || 0
        });
      } else if (category.status === 'DANGER') {
        alerts.push({
          category_id: category.category_id,
          category_name: category.category_name,
          alert_type: 'APPROACHING_LIMIT',
          current_amount: category.spent_amount || 0,
          planned_amount: category.planned_amount,
          percentage: category.percentage_used || 0
        });
      }
    });

    return {
      plan: currentPlan,
      total_planned: currentPlan.total_budget,
      total_spent: totalSpent,
      total_remaining: totalRemaining,
      percentage_used: overallPercentage,
      categories_summary: categoriesSummary,
      alerts
    };
  }, [currentPlan, transactions, categories, currentCompetence]);

  const createPlan = async (totalBudget: number, categoryBudgets: CategoryBudget[]): Promise<MonthlyPlan> => {
    const newPlan: MonthlyPlan = {
      id: Date.now().toString(),
      user_id: '1',
      month: currentCompetence.month,
      year: currentCompetence.year,
      total_budget: totalBudget,
      category_budgets: categoryBudgets,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Criando planejamento mensal:', newPlan);
    return newPlan;
  };

  const updatePlan = async (totalBudget: number, categoryBudgets: CategoryBudget[]): Promise<MonthlyPlan | null> => {
    if (!currentPlan) return null;

    const updatedPlan: MonthlyPlan = {
      ...currentPlan,
      total_budget: totalBudget,
      category_budgets: categoryBudgets,
      updated_at: new Date().toISOString()
    };

    console.log('Atualizando planejamento mensal:', updatedPlan);
    return updatedPlan;
  };

  const copyFromPrevious = async (): Promise<MonthlyPlan | null> => {
    if (!previousPlan) return null;

    const newPlan: MonthlyPlan = {
      id: Date.now().toString(),
      user_id: '1',
      month: currentCompetence.month,
      year: currentCompetence.year,
      total_budget: previousPlan.total_budget,
      category_budgets: [...previousPlan.category_budgets],
      created_from_previous: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Copiando planejamento do mês anterior:', newPlan);
    return newPlan;
  };

  const checkTransactionAlert = (categoryId: string, amount: number): PlanAlert | null => {
    if (!planSummary) return null;

    const categorySummary = planSummary.categories_summary.find(c => c.category_id === categoryId);
    if (!categorySummary) {
      return {
        category_id: categoryId,
        category_name: categories.find(c => c.id === categoryId)?.name || 'Categoria',
        alert_type: 'NO_BUDGET',
        current_amount: amount,
        planned_amount: 0,
        percentage: 0
      };
    }

    const newTotal = (categorySummary.spent_amount || 0) + amount;
    const newPercentage = (newTotal / categorySummary.planned_amount) * 100;

    if (newTotal > categorySummary.planned_amount) {
      return {
        category_id: categoryId,
        category_name: categorySummary.category_name,
        alert_type: 'EXCEEDED',
        current_amount: newTotal,
        planned_amount: categorySummary.planned_amount,
        percentage: newPercentage
      };
    }

    return null;
  };

  return {
    currentPlan,
    previousPlan,
    planSummary,
    hasPlan: !!currentPlan,
    hasPreviousPlan: !!previousPlan,
    createPlan,
    updatePlan,
    copyFromPrevious,
    checkTransactionAlert
  };
}

export function useCreateMonthlyPlan() {
  const { createPlan } = useMonthlyPlan();
  return { mutateAsync: createPlan, isPending: false };
}

export function useUpdateMonthlyPlan() {
  const { updatePlan } = useMonthlyPlan();
  return { mutateAsync: updatePlan, isPending: false };
}

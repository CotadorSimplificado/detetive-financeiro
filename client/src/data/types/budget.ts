import { BaseEntity } from './index';

export type BudgetPeriod = 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'CUSTOM';
export type BudgetStatus = 'ACTIVE' | 'INACTIVE' | 'EXCEEDED' | 'COMPLETED';

export interface Budget extends BaseEntity {
  user_id: string;
  name: string;
  description?: string;
  amount: number;
  period: BudgetPeriod;
  start_date: string;
  end_date: string;
  status: BudgetStatus;
  category_ids: string[];
  account_ids?: string[];
  alert_percentage: number; // Percentual para disparar alerta (ex: 80%)
  is_active: boolean;
  color?: string;
  icon?: string;
}

// Novo tipo para planejamento mensal
export interface MonthlyPlan extends BaseEntity {
  user_id: string;
  month: number; // 1-12
  year: number;
  total_budget: number;
  category_budgets: CategoryBudget[];
  created_from_previous?: boolean; // Se foi copiado do mês anterior
}

export interface CategoryBudget {
  category_id: string;
  planned_amount: number;
  spent_amount?: number; // Calculado dinamicamente
  percentage_used?: number; // Calculado dinamicamente
}

export interface MonthlyPlanSummary {
  plan: MonthlyPlan;
  total_planned: number;
  total_spent: number;
  total_remaining: number;
  percentage_used: number;
  categories_summary: CategoryBudgetSummary[];
  alerts: PlanAlert[];
}

export interface CategoryBudgetSummary extends CategoryBudget {
  category_name: string;
  category_icon?: string;
  category_color?: string;
  status: 'SAFE' | 'WARNING' | 'DANGER' | 'EXCEEDED';
  is_over_budget: boolean;
}

export interface PlanAlert {
  category_id: string;
  category_name: string;
  alert_type: 'APPROACHING_LIMIT' | 'EXCEEDED' | 'NO_BUDGET';
  current_amount: number;
  planned_amount: number;
  percentage: number;
}

export interface BudgetSpending {
  budget_id: string;
  category_id: string;
  category_name: string;
  budgeted_amount: number;
  spent_amount: number;
  remaining_amount: number;
  percentage_used: number;
  transaction_count: number;
  last_transaction_date?: string;
}

export interface BudgetSummary {
  budget: Budget;
  total_budgeted: number;
  total_spent: number;
  total_remaining: number;
  percentage_used: number;
  spending_by_category: BudgetSpending[];
  days_remaining: number;
  daily_budget_remaining: number;
  is_over_budget: boolean;
  projected_spending: number;
}

export interface BudgetAlert {
  budget_id: string;
  budget_name: string;
  alert_type: 'THRESHOLD_REACHED' | 'BUDGET_EXCEEDED' | 'CATEGORY_EXCEEDED' | 'PROJECTED_OVERSPENDING';
  percentage: number;
  amount_over?: number;
  category_name?: string;
  triggered_at: string;
}

// Tipos para componentes
export interface BudgetCardProps {
  budget: Budget;
  summary: BudgetSummary;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: BudgetStatus) => void;
}

export interface BudgetFormData {
  name: string;
  description?: string;
  amount: number;
  period: BudgetPeriod;
  start_date: string;
  end_date: string;
  category_ids: string[];
  account_ids?: string[];
  alert_percentage: number;
  color?: string;
  icon?: string;
}
import { FinancialCard } from "./FinancialCard";
import { DonutChart } from "../charts/DonutChart";
import { CustomLineChart } from "../charts/LineChart";
import { CustomBarChart } from "../charts/BarChart";
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Target, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useMockStore } from "@/data/store/mockContext";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { formatCurrency } from "@/lib/currency-utils";

// Mock data - in real app, this would come from your backend
const expenseData = [
  { name: "Casa Fixo", value: 2025, color: "hsl(var(--chart-orange))", percentage: 23.3 },
  { name: "Saúde", value: 1593, color: "hsl(var(--chart-purple))", percentage: 18.3 },
  { name: "Alimentação", value: 1104, color: "hsl(var(--chart-blue))", percentage: 12.7 },
  { name: "Transporte", value: 890, color: "hsl(var(--chart-green))", percentage: 10.2 },
  { name: "Outros", value: 3086, color: "hsl(var(--chart-cyan))", percentage: 35.5 }
];

const monthlyTrendData = [
  { name: "Jan", value: 8500 },
  { name: "Fev", value: 9200 },
  { name: "Mar", value: 8800 },
  { name: "Abr", value: 9500 },
  { name: "Mai", value: 8900 },
  { name: "Jun", value: 10200 },
  { name: "Jul", value: 8700 },
  { name: "Ago", value: 8698 }
];

const cashFlowData = [
  { name: "Jan", receitas: 10210, despesas: 8500 },
  { name: "Fev", receitas: 10210, despesas: 9200 },
  { name: "Mar", receitas: 10210, despesas: 8800 },
  { name: "Abr", receitas: 10210, despesas: 9500 },
  { name: "Mai", receitas: 10210, despesas: 8900 },
  { name: "Jun", receitas: 10210, despesas: 10200 },
  { name: "Jul", receitas: 10210, despesas: 8700 },
  { name: "Ago", receitas: 10210, despesas: 8698 }
];

export const DashboardCards = () => {
  const { 
    accounts, 
    accountsLoading, 
    creditCards, 
    creditCardsLoading,
    transactions,
    transactionsLoading,
    getTotalBalance,
    getTotalCreditLimit,
    getTotalAvailableLimit,
    isAuthenticated,
    loading
  } = useMockStore();

  // Se ainda está carregando dados de autenticação
  if (loading || !isAuthenticated) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const totalBalance = getTotalBalance();
  const totalCreditLimit = getTotalCreditLimit();
  const totalAvailableLimit = getTotalAvailableLimit();
  const creditCardUsed = totalCreditLimit - totalAvailableLimit;
  const creditCardPercentage = totalCreditLimit > 0 ? (creditCardUsed / totalCreditLimit) * 100 : 0;
  
  // Calcular receitas e despesas do mês atual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
  
  const monthlyIncome = currentMonthTransactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const monthlyExpenses = currentMonthTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const monthlyBalance = monthlyIncome - monthlyExpenses;
  
  // Meta de economia (valores mock - idealmente viriam de preferências do usuário)
  const savingsGoal = 20000;
  const currentSavings = totalBalance * 0.6; // Simular que 60% do saldo é poupança
  const savingsProgress = (currentSavings / savingsGoal) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Saldo Total */}
      <FinancialCard
        title="Saldo Total"
        value={formatCurrency(totalBalance)}
        subtitle="Saldo consolidado em contas"
        variant="balance"
        trend={monthlyBalance >= 0 ? "up" : "down"}
        trendValue={`${monthlyBalance >= 0 ? '+' : ''}${formatCurrency(monthlyBalance)} este mês`}
        icon={<DollarSign className="h-5 w-5" />}
      />

      {/* Fluxo de Caixa Mensal */}
      <FinancialCard
        title="Balanço Mensal"
        variant="default"
        icon={<TrendingUp className="h-5 w-5" />}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-income"></div>
              <span className="text-sm text-muted-foreground">Receitas</span>
            </div>
            <span className="text-sm font-semibold text-income">
              {formatCurrency(monthlyIncome)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-expense"></div>
              <span className="text-sm text-muted-foreground">Despesas</span>
            </div>
            <span className="text-sm font-semibold text-expense">
              {formatCurrency(monthlyExpenses)}
            </span>
          </div>
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Balanço</span>
              <span className={`text-sm font-bold ${monthlyBalance >= 0 ? 'text-income' : 'text-expense'}`}>
                {formatCurrency(monthlyBalance)}
              </span>
            </div>
          </div>
        </div>
      </FinancialCard>

      {/* Cartões de Crédito */}
      <FinancialCard
        title="Cartões de Crédito"
        variant="default"
        icon={<CreditCard className="h-5 w-5" />}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Fatura Atual</span>
            <span className="text-lg font-bold text-warning">
              {formatCurrency(creditCardUsed)}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Limite Usado</span>
              <span className="text-muted-foreground">{creditCardPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={creditCardPercentage} className="h-2" />
          </div>
          <div className="text-xs text-muted-foreground">
            Limite disponível: {formatCurrency(totalAvailableLimit)}
          </div>
        </div>
      </FinancialCard>

      {/* Despesas por Categoria */}
      <FinancialCard
        title="Despesas por Categoria"
        className="md:col-span-2"
      >
        <DonutChart
          data={expenseData}
          innerRadius={50}
          outerRadius={80}
          showLegend={false}
          centerContent={
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-lg font-bold text-foreground">
                {formatCurrency(expenseData.reduce((sum, item) => sum + item.value, 0))}
              </div>
            </div>
          }
        />
        <div className="mt-4 grid grid-cols-2 gap-2">
          {expenseData.slice(0, 4).map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
              <span className="text-xs font-semibold">{formatCurrency(item.value)}</span>
            </div>
          ))}
        </div>
      </FinancialCard>

      {/* Meta de Economia */}
      <FinancialCard
        title="Meta de Economia"
        variant="goal"
        icon={<Target className="h-5 w-5" />}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Progresso</span>
            <span className="text-sm font-semibold">{savingsProgress.toFixed(1)}%</span>
          </div>
          <Progress value={savingsProgress} className="h-3" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {formatCurrency(currentSavings)}
            </span>
            <span className="text-muted-foreground">
              {formatCurrency(savingsGoal)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Faltam {formatCurrency(savingsGoal - currentSavings)} para atingir a meta
          </div>
        </div>
      </FinancialCard>

      {/* Tendência de Gastos */}
      <FinancialCard
        title="Tendência de Gastos"
        subtitle="Últimos 8 meses"
        className="md:col-span-2 lg:col-span-3"
      >
        <CustomLineChart
          data={monthlyTrendData}
          height={200}
          color="hsl(var(--chart-blue))"
          filled={true}
        />
      </FinancialCard>

      {/* Fluxo de Caixa Anual */}
      <FinancialCard
        title="Fluxo de Caixa"
        subtitle="Receitas vs Despesas (2025)"
        className="md:col-span-2 lg:col-span-3"
      >
        <CustomBarChart
          data={cashFlowData}
          height={250}
          bars={[
            { key: "receitas", color: "hsl(var(--chart-green))", name: "Receitas" },
            { key: "despesas", color: "hsl(var(--chart-red))", name: "Despesas" }
          ]}
        />
      </FinancialCard>
    </div>
  );
};
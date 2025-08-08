import { FinancialCard } from "./FinancialCard";
import { DonutChart } from "../charts/DonutChart";
import { CustomLineChart } from "../charts/LineChart";
import { CustomBarChart } from "../charts/BarChart";
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Target, PiggyBank, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { formatCurrency } from "@/lib/currency-utils";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useAccounts } from '@/hooks/useAccounts';
import { useTransactions } from '@/hooks/useTransactions';
import { useCreditCards } from '@/hooks/useCreditCards';
import { useCreditCardBills } from '@/hooks/useCreditCardBills';
import { useMonthlyPlan } from '@/hooks/useMonthlyPlan';

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
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts();
  const { data: transactions = [], isLoading: transactionsLoading } = useTransactions();
  const { data: creditCards = [], isLoading: creditCardsLoading } = useCreditCards();
  const { data: bills = [] } = useCreditCardBills();
  const { planSummary } = useMonthlyPlan();

  // Se ainda está carregando dados principais
  if (accountsLoading || transactionsLoading || creditCardsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // Funções de cálculo usando dados reais da API
  const getTotalBalance = () => {
    return accounts.reduce((total, account) => total + (account.balance || 0), 0);
  };

  const getTotalCreditLimit = () => {
    return creditCards.reduce((total, card) => total + (card.creditLimit || 0), 0);
  };

  const getTotalAvailableLimit = () => {
    return creditCards.reduce((total, card) => total + (card.availableLimit || 0), 0);
  };

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

      {/* Planejamento Mensal */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Planejamento Mensal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {planSummary ? (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progresso Geral</span>
                    <span className="text-sm text-muted-foreground">
                      {planSummary.percentage_used.toFixed(0)}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(planSummary.percentage_used, 100)} 
                    className="h-2" 
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatCurrency(planSummary.total_spent)} de {formatCurrency(planSummary.total_planned)}
                  </p>
                </div>

                {planSummary.alerts.length > 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-3 w-3 text-yellow-600" />
                      <span className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
                        {planSummary.alerts.length} categoria(s) com alerta
                      </span>
                    </div>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      {planSummary.alerts[0].category_name} - {planSummary.alerts[0].percentage.toFixed(0)}%
                      {planSummary.alerts.length > 1 && ` e mais ${planSummary.alerts.length - 1}`}
                    </p>
                  </div>
                )}

                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/budgets">
                    Ver Detalhes
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  Nenhum planejamento para este mês
                </p>
                <Button asChild size="sm" className="w-full">
                  <Link to="/budgets">
                    Criar Planejamento
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

      {/* Meta de Economia */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Meta de Economia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Emergência</span>
                <span className="text-sm text-muted-foreground">65%</span>
              </div>
              <Progress value={65} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(6500)} de {formatCurrency(10000)}
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Viagem</span>
                <span className="text-sm text-muted-foreground">30%</span>
              </div>
              <Progress value={30} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(1500)} de {formatCurrency(5000)}
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Casa Própria</span>
                <span className="text-sm text-muted-foreground">45%</span>
              </div>
              <Progress value={45} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(22500)} de {formatCurrency(50000)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
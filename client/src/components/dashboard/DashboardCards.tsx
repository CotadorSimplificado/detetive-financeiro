import { FinancialCard } from "./FinancialCard";
import { DonutChart } from "../charts/DonutChart";
import { CustomLineChart } from "../charts/LineChart";
import { CustomBarChart } from "../charts/BarChart";
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Target, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

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
  const totalBalance = 6790.42;
  const monthlyIncome = 10210.00;
  const monthlyExpenses = 8698.63;
  const monthlyBalance = monthlyIncome - monthlyExpenses;
  const creditCardUsed = 1042.05;
  const creditCardLimit = 5000.00;
  const creditCardPercentage = (creditCardUsed / creditCardLimit) * 100;
  
  const savingsGoal = 20000;
  const currentSavings = 12500;
  const savingsProgress = (currentSavings / savingsGoal) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Saldo Total */}
      <FinancialCard
        title="Saldo Total"
        value={`R$ ${totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
        subtitle="Saldo consolidado em contas"
        variant="balance"
        trend="up"
        trendValue="+R$ 350,00 este mês"
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
              R$ {monthlyIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-expense"></div>
              <span className="text-sm text-muted-foreground">Despesas</span>
            </div>
            <span className="text-sm font-semibold text-expense">
              R$ {monthlyExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Balanço</span>
              <span className={`text-sm font-bold ${monthlyBalance >= 0 ? 'text-income' : 'text-expense'}`}>
                R$ {monthlyBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
              R$ {creditCardUsed.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
            Limite disponível: R$ {(creditCardLimit - creditCardUsed).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                R$ {expenseData.reduce((sum, item) => sum + item.value, 0).toLocaleString('pt-BR')}
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
              <span className="text-xs font-semibold">R$ {item.value.toLocaleString('pt-BR')}</span>
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
              R$ {currentSavings.toLocaleString('pt-BR')}
            </span>
            <span className="text-muted-foreground">
              R$ {savingsGoal.toLocaleString('pt-BR')}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Faltam R$ {(savingsGoal - currentSavings).toLocaleString('pt-BR')} para atingir a meta
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
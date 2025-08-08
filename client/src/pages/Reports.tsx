
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePicker } from '@/components/ui/calendar';
import { DonutChart } from '@/components/charts/DonutChart';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { useTransactions } from '@/hooks/useTransactions';
import { useAccounts } from '@/hooks/useAccounts';
import { useCreditCards } from '@/hooks/useCreditCards';
import { useCategories } from '@/hooks/useCategories';
import { formatCurrency } from '@/lib/currency-utils';
import { formatDate } from '@/lib/date-utils';
import { TransactionType } from '@/data/types';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  PieChart,
  BarChart3,
  LineChart as LineChartIcon,
  Calendar,
  Filter,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

export default function Reports() {
  const { transactions } = useTransactions();
  const { accounts } = useAccounts();
  const { creditCards } = useCreditCards();
  const { categories } = useCategories();

  // Filters
  const [dateRange, setDateRange] = useState<{
    start: Date | undefined;
    end: Date | undefined;
  }>({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date()
  });
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [selectedCard, setSelectedCard] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [transactionType, setTransactionType] = useState<string>('all');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Date filter
      if (dateRange.start && new Date(transaction.date) < dateRange.start) return false;
      if (dateRange.end && new Date(transaction.date) > dateRange.end) return false;
      
      // Account filter
      if (selectedAccount !== 'all' && transaction.account_id !== selectedAccount) return false;
      
      // Card filter
      if (selectedCard !== 'all' && transaction.credit_card_id !== selectedCard) return false;
      
      // Category filter
      if (selectedCategory !== 'all' && transaction.category_id !== selectedCategory) return false;
      
      // Transaction type filter
      if (transactionType !== 'all' && transaction.type !== transactionType) return false;
      
      // Amount filter
      if (minAmount && transaction.amount < parseFloat(minAmount)) return false;
      if (maxAmount && transaction.amount > parseFloat(maxAmount)) return false;
      
      return true;
    });
  }, [transactions, dateRange, selectedAccount, selectedCard, selectedCategory, transactionType, minAmount, maxAmount]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = filteredTransactions
      .filter(t => t.type === TransactionType.EXPENSE || t.type === TransactionType.CREDIT_CARD_EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const transfers = filteredTransactions
      .filter(t => t.type === TransactionType.TRANSFER)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalTransactions: filteredTransactions.length,
      totalIncome: income,
      totalExpenses: expenses,
      totalTransfers: transfers,
      balance: income - expenses,
      avgTransaction: filteredTransactions.length > 0 ? 
        filteredTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / filteredTransactions.length : 0
    };
  }, [filteredTransactions]);

  // Chart data
  const expensesByCategory = useMemo(() => {
    const categoryTotals = filteredTransactions
      .filter(t => t.type === TransactionType.EXPENSE || t.type === TransactionType.CREDIT_CARD_EXPENSE)
      .reduce((acc, transaction) => {
        const category = categories.find(c => c.id === transaction.category_id);
        const categoryName = category?.name || 'Sem categoria';
        acc[categoryName] = (acc[categoryName] || 0) + transaction.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
      fill: categories.find(c => c.name === name)?.color || '#8884d8'
    }));
  }, [filteredTransactions, categories]);

  const monthlyTrend = useMemo(() => {
    const monthlyData = filteredTransactions.reduce((acc, transaction) => {
      const month = new Date(transaction.date).toLocaleDateString('pt-BR', { 
        year: 'numeric', 
        month: 'short' 
      });
      
      if (!acc[month]) {
        acc[month] = { month, income: 0, expenses: 0 };
      }
      
      if (transaction.type === TransactionType.INCOME) {
        acc[month].income += transaction.amount;
      } else if (transaction.type === TransactionType.EXPENSE || transaction.type === TransactionType.CREDIT_CARD_EXPENSE) {
        acc[month].expenses += transaction.amount;
      }
      
      return acc;
    }, {} as Record<string, { month: string; income: number; expenses: number }>);

    return Object.values(monthlyData).sort((a, b) => 
      new Date(a.month).getTime() - new Date(b.month).getTime()
    );
  }, [filteredTransactions]);

  // Export functions
  const exportToCSV = () => {
    const csvData = filteredTransactions.map(transaction => {
      const account = accounts.find(a => a.id === transaction.account_id);
      const card = creditCards.find(c => c.id === transaction.credit_card_id);
      const category = categories.find(c => c.id === transaction.category_id);
      
      return {
        Data: formatDate(new Date(transaction.date)),
        Descrição: transaction.description,
        Tipo: transaction.type === TransactionType.INCOME ? 'Receita' : 
              transaction.type === TransactionType.EXPENSE ? 'Despesa' :
              transaction.type === TransactionType.CREDIT_CARD_EXPENSE ? 'Despesa Cartão' : 'Transferência',
        Valor: transaction.amount,
        Conta: account?.name || '',
        Cartão: card?.name || '',
        Categoria: category?.name || ''
      };
    });

    const csv = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${formatDate(new Date())}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Relatório exportado com sucesso!');
  };

  const exportToPDF = () => {
    // Simulação de exportação para PDF
    toast.success('Funcionalidade de PDF em desenvolvimento!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Análise detalhada das suas finanças
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button onClick={exportToPDF} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros Avançados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Inicial</label>
              <Input
                type="date"
                value={dateRange.start ? dateRange.start.toISOString().split('T')[0] : ''}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: new Date(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Final</label>
              <Input
                type="date"
                value={dateRange.end ? dateRange.end.toISOString().split('T')[0] : ''}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: new Date(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Conta</label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as contas</SelectItem>
                  {accounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cartão</label>
              <Select value={selectedCard} onValueChange={setSelectedCard}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os cartões</SelectItem>
                  {creditCards.map(card => (
                    <SelectItem key={card.id} value={card.id}>
                      {card.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value={TransactionType.INCOME}>Receitas</SelectItem>
                  <SelectItem value={TransactionType.EXPENSE}>Despesas</SelectItem>
                  <SelectItem value={TransactionType.CREDIT_CARD_EXPENSE}>Cartão de Crédito</SelectItem>
                  <SelectItem value={TransactionType.TRANSFER}>Transferências</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Valor Mínimo</label>
              <Input
                type="number"
                placeholder="0,00"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Valor Máximo</label>
              <Input
                type="number"
                placeholder="0,00"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Transações</p>
                <p className="text-2xl font-bold">{metrics.totalTransactions}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receitas</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(metrics.totalIncome)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Despesas</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(metrics.totalExpenses)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Saldo</p>
                <p className={`text-2xl font-bold ${metrics.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(metrics.balance)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="expenses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="expenses" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Despesas por Categoria
          </TabsTrigger>
          <TabsTrigger value="trend" className="flex items-center gap-2">
            <LineChartIcon className="h-4 w-4" />
            Tendência Mensal
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Comparação
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Despesas por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <DonutChart 
                data={expensesByCategory}
                centerLabel="Total"
                centerValue={formatCurrency(metrics.totalExpenses)}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trend">
          <Card>
            <CardHeader>
              <CardTitle>Tendência Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart 
                data={monthlyTrend}
                lines={[
                  { key: 'income', label: 'Receitas', color: '#10b981' },
                  { key: 'expenses', label: 'Despesas', color: '#ef4444' }
                ]}
                xAxisKey="month"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Receitas vs Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart 
                data={monthlyTrend}
                bars={[
                  { key: 'income', label: 'Receitas', color: '#10b981' },
                  { key: 'expenses', label: 'Despesas', color: '#ef4444' }
                ]}
                xAxisKey="month"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Transaction List */}
      <Card>
        <CardHeader>
          <CardTitle>Transações Filtradas ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredTransactions.slice(0, 100).map(transaction => {
              const account = accounts.find(a => a.id === transaction.account_id);
              const card = creditCards.find(c => c.id === transaction.credit_card_id);
              const category = categories.find(c => c.id === transaction.category_id);
              
              return (
                <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{transaction.description}</span>
                      <Badge variant={
                        transaction.type === TransactionType.INCOME ? 'default' :
                        transaction.type === TransactionType.EXPENSE ? 'destructive' :
                        transaction.type === TransactionType.CREDIT_CARD_EXPENSE ? 'secondary' : 'outline'
                      }>
                        {transaction.type === TransactionType.INCOME ? 'Receita' :
                         transaction.type === TransactionType.EXPENSE ? 'Despesa' :
                         transaction.type === TransactionType.CREDIT_CARD_EXPENSE ? 'Cartão' : 'Transferência'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>{formatDate(new Date(transaction.date))}</span>
                      {account && <span>{account.name}</span>}
                      {card && <span>{card.name}</span>}
                      {category && <span>{category.name}</span>}
                    </div>
                  </div>
                  <div className={`text-lg font-semibold ${
                    transaction.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === TransactionType.INCOME ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                  </div>
                </div>
              );
            })}
            {filteredTransactions.length > 100 && (
              <p className="text-center text-muted-foreground py-4">
                Mostrando apenas as primeiras 100 transações. Use a exportação para ver todas.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


import { useMemo } from 'react';
import { useTransactions } from './useTransactions';
import { useAccounts } from './useAccounts';
import { useCreditCards } from './useCreditCards';
import { useCategories } from './useCategories';
import { TransactionType } from '@/data/types';

export interface ReportFilters {
  dateRange: {
    start: Date | undefined;
    end: Date | undefined;
  };
  accountId?: string;
  creditCardId?: string;
  categoryId?: string;
  transactionType?: TransactionType | 'all';
  minAmount?: number;
  maxAmount?: number;
}

export interface ReportMetrics {
  totalTransactions: number;
  totalIncome: number;
  totalExpenses: number;
  totalTransfers: number;
  balance: number;
  avgTransaction: number;
  avgIncome: number;
  avgExpense: number;
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  color: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: string;
  year: number;
  monthNumber: number;
  income: number;
  expenses: number;
  balance: number;
  transactionCount: number;
}

export function useReports(filters: ReportFilters) {
  const { transactions } = useTransactions();
  const { accounts } = useAccounts();
  const { creditCards } = useCreditCards();
  const { categories } = useCategories();

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Date filter
      if (filters.dateRange.start && new Date(transaction.date) < filters.dateRange.start) {
        return false;
      }
      if (filters.dateRange.end && new Date(transaction.date) > filters.dateRange.end) {
        return false;
      }
      
      // Account filter
      if (filters.accountId && filters.accountId !== 'all' && transaction.account_id !== filters.accountId) {
        return false;
      }
      
      // Credit card filter
      if (filters.creditCardId && filters.creditCardId !== 'all' && transaction.credit_card_id !== filters.creditCardId) {
        return false;
      }
      
      // Category filter
      if (filters.categoryId && filters.categoryId !== 'all' && transaction.category_id !== filters.categoryId) {
        return false;
      }
      
      // Transaction type filter
      if (filters.transactionType && filters.transactionType !== 'all' && transaction.type !== filters.transactionType) {
        return false;
      }
      
      // Amount filters
      if (filters.minAmount !== undefined && transaction.amount < filters.minAmount) {
        return false;
      }
      if (filters.maxAmount !== undefined && transaction.amount > filters.maxAmount) {
        return false;
      }
      
      return true;
    });
  }, [transactions, filters]);

  const metrics = useMemo((): ReportMetrics => {
    const income = filteredTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = filteredTransactions
      .filter(t => t.type === TransactionType.EXPENSE || t.type === TransactionType.CREDIT_CARD_EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const transfers = filteredTransactions
      .filter(t => t.type === TransactionType.TRANSFER)
      .reduce((sum, t) => sum + t.amount, 0);

    const incomeTransactions = filteredTransactions.filter(t => t.type === TransactionType.INCOME);
    const expenseTransactions = filteredTransactions.filter(t => 
      t.type === TransactionType.EXPENSE || t.type === TransactionType.CREDIT_CARD_EXPENSE
    );

    return {
      totalTransactions: filteredTransactions.length,
      totalIncome: income,
      totalExpenses: expenses,
      totalTransfers: transfers,
      balance: income - expenses,
      avgTransaction: filteredTransactions.length > 0 ? 
        filteredTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / filteredTransactions.length : 0,
      avgIncome: incomeTransactions.length > 0 ? income / incomeTransactions.length : 0,
      avgExpense: expenseTransactions.length > 0 ? expenses / expenseTransactions.length : 0,
    };
  }, [filteredTransactions]);

  const expensesByCategory = useMemo((): CategorySummary[] => {
    const expenseTransactions = filteredTransactions.filter(t => 
      t.type === TransactionType.EXPENSE || t.type === TransactionType.CREDIT_CARD_EXPENSE
    );

    const categoryTotals = expenseTransactions.reduce((acc, transaction) => {
      const categoryId = transaction.category_id || 'uncategorized';
      if (!acc[categoryId]) {
        acc[categoryId] = { amount: 0, count: 0 };
      }
      acc[categoryId].amount += transaction.amount;
      acc[categoryId].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number }>);

    const totalExpenses = Object.values(categoryTotals).reduce((sum, cat) => sum + cat.amount, 0);

    return Object.entries(categoryTotals).map(([categoryId, data]) => {
      const category = categories.find(c => c.id === categoryId);
      return {
        categoryId,
        categoryName: category?.name || 'Sem categoria',
        color: category?.color || '#8884d8',
        totalAmount: data.amount,
        transactionCount: data.count,
        percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
      };
    }).sort((a, b) => b.totalAmount - a.totalAmount);
  }, [filteredTransactions, categories]);

  const incomeByCategory = useMemo((): CategorySummary[] => {
    const incomeTransactions = filteredTransactions.filter(t => t.type === TransactionType.INCOME);

    const categoryTotals = incomeTransactions.reduce((acc, transaction) => {
      const categoryId = transaction.category_id || 'uncategorized';
      if (!acc[categoryId]) {
        acc[categoryId] = { amount: 0, count: 0 };
      }
      acc[categoryId].amount += transaction.amount;
      acc[categoryId].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number }>);

    const totalIncome = Object.values(categoryTotals).reduce((sum, cat) => sum + cat.amount, 0);

    return Object.entries(categoryTotals).map(([categoryId, data]) => {
      const category = categories.find(c => c.id === categoryId);
      return {
        categoryId,
        categoryName: category?.name || 'Sem categoria',
        color: category?.color || '#10b981',
        totalAmount: data.amount,
        transactionCount: data.count,
        percentage: totalIncome > 0 ? (data.amount / totalIncome) * 100 : 0,
      };
    }).sort((a, b) => b.totalAmount - a.totalAmount);
  }, [filteredTransactions, categories]);

  const monthlyTrend = useMemo((): MonthlyTrend[] => {
    const monthlyData = filteredTransactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const year = date.getFullYear();
      const monthNumber = date.getMonth();
      const monthKey = `${year}-${monthNumber.toString().padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('pt-BR', { 
        year: 'numeric', 
        month: 'short' 
      });
      
      if (!acc[monthKey]) {
        acc[monthKey] = { 
          month: monthName, 
          year, 
          monthNumber,
          income: 0, 
          expenses: 0,
          transactionCount: 0
        };
      }
      
      if (transaction.type === TransactionType.INCOME) {
        acc[monthKey].income += transaction.amount;
      } else if (transaction.type === TransactionType.EXPENSE || transaction.type === TransactionType.CREDIT_CARD_EXPENSE) {
        acc[monthKey].expenses += transaction.amount;
      }
      
      acc[monthKey].transactionCount += 1;
      
      return acc;
    }, {} as Record<string, { month: string; year: number; monthNumber: number; income: number; expenses: number; transactionCount: number }>);

    return Object.values(monthlyData)
      .map(item => ({
        ...item,
        balance: item.income - item.expenses
      }))
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.monthNumber - b.monthNumber;
      });
  }, [filteredTransactions]);

  return {
    filteredTransactions,
    metrics,
    expensesByCategory,
    incomeByCategory,
    monthlyTrend,
    accounts,
    creditCards,
    categories,
  };
}

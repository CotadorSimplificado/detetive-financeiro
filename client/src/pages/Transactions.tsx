import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionModal } from "@/components/transactions/TransactionModal";
import { CreditCardBillItem } from "@/components/transactions/CreditCardBillItem";
import { CompetenceFilter } from "@/components/transactions/CompetenceFilter";
import { SkeletonList, SkeletonCard } from "@/components/ui/skeleton-card";
import { InlineLoading } from "@/components/ui/loading";
import { useTransactions, useTransactionsSummary, type TransactionFilters } from "@/hooks/useTransactions";
import { useCreditCardBills } from "@/hooks/useCreditCardBills";
import { useAccounts } from "@/hooks/useAccounts";
import { useCategories } from "@/hooks/useCategories";
import { formatDateBR, isCurrentMonth } from "@/lib/date-utils";
import { Plus, Search, Filter, ArrowUpDown, Calendar } from "lucide-react";
import { useCompetenceFilter } from "@/hooks/useCompetenceFilter";

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  
  // Use global competence filter
  const { currentCompetence, setCompetenceDate } = useCompetenceFilter();

  // Criar filtros para as queries
  const filters = useMemo(() => ({
    type: typeFilter === "all" ? undefined : typeFilter as any,
    competence_month: currentCompetence.month,
    competence_year: currentCompetence.year,
  }), [typeFilter, currentCompetence.month, currentCompetence.year]);

  // Hooks para buscar dados
  const { data: transactions = [], isLoading: isLoadingTransactions, error: transactionsError } = useTransactions(filters);
  const { data: summary, isLoading: isLoadingSummary } = useTransactionsSummary(filters);
  const { data: accounts = [] } = useAccounts();
  const { data: categories = [] } = useCategories();
  const { data: creditCardBills = [] } = useCreditCardBills();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "INCOME":
        return "text-success";
      case "EXPENSE":
        return "text-destructive";
      case "TRANSFER":
        return "text-primary";
      default:
        return "text-foreground";
    }
  };

  const getTransactionTypeIcon = (type: string, amount: number) => {
    if (type === "INCOME") return "+";
    if (type === "EXPENSE") return "-";
    return amount > 0 ? "+" : "-";
  };

  const getAccountDisplay = (transaction: any) => {
    if (transaction.is_transfer && transaction.transfer_from_account && transaction.transfer_to_account) {
      return `${transaction.transfer_from_account.name} → ${transaction.transfer_to_account.name}`;
    }
    if (transaction.account) {
      return transaction.account.name;
    }
    if (transaction.card) {
      return transaction.card.name;
    }
    return "Conta não informada";
  };

  return (
    <MainLayout activeTab="transactions" onNewTransaction={() => setTransactionModalOpen(true)}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Transações</h1>
            <p className="text-muted-foreground">
              {searchTerm || typeFilter !== "all" || !isCurrentMonth(currentCompetence.date) 
                ? `Mostrando transações de ${formatDateBR(currentCompetence.date, "MMMM 'de' yyyy").toLowerCase()}`
                : "Visualize e gerencie todas as suas movimentações financeiras"
              }
            </p>
          </div>
          <Button onClick={() => setTransactionModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </div>

        {/* Summary Cards */}
        {isLoadingSummary ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-card p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-success"></div>
                <span className="text-sm text-muted-foreground">Receitas</span>
              </div>
              <p className="text-2xl font-bold text-success">
                {formatCurrency(summary?.income || 0)}
              </p>
            </div>
            
            <div className="bg-gradient-card p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-destructive"></div>
                <span className="text-sm text-muted-foreground">Despesas</span>
              </div>
              <p className="text-2xl font-bold text-destructive">
                {formatCurrency(summary?.expenses || 0)}
              </p>
            </div>
            
            <div className="bg-gradient-card p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span className="text-sm text-muted-foreground">Saldo</span>
              </div>
              <p className={`text-2xl font-bold ${(summary?.balance || 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(summary?.balance || 0)}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col gap-6">
          {/* Competence Filter */}
          <div className="flex justify-center">
            <CompetenceFilter 
              currentDate={currentCompetence.date}
              onDateChange={setCompetenceDate}
              isLoading={isLoadingTransactions || isLoadingSummary}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter || "all"} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="INCOME">Receitas</SelectItem>
                <SelectItem value="EXPENSE">Despesas</SelectItem>
                <SelectItem value="TRANSFER">Transferências</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-card rounded-lg border">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Transações Recentes</h3>
              <Button variant="ghost" size="sm">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Ordenar
              </Button>
            </div>
          </div>
          
          {isLoadingTransactions ? (
            <SkeletonList count={5} />
          ) : transactionsError ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-destructive text-xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Erro ao carregar transações</h3>
              <p className="text-muted-foreground mb-4">
                Ocorreu um erro ao buscar suas transações. Tente novamente.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {/* Credit card bills */}
              {creditCardBills.filter((bill: any) => !bill.is_paid).map((bill: any) => (
                <div key={bill.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <CreditCardBillItem bill={bill} />
                </div>
              ))}
              
              {/* Regular transactions */}
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <div className={`w-10 h-10 rounded-lg ${
                              transaction.type === "INCOME" ? "bg-success/10" :
                              transaction.type === "EXPENSE" ? "bg-destructive/10" : "bg-primary/10"
                            } flex items-center justify-center`}>
                              <span className={`text-sm font-semibold ${getTransactionTypeColor(transaction.type)}`}>
                                {getTransactionTypeIcon(transaction.type, transaction.amount)}
                              </span>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-foreground truncate">
                              {transaction.description}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>Categoria</span>
                              <span>•</span>
                              <span>{getAccountDisplay(transaction)}</span>
                              <span>•</span>
                              <span>{formatDateBR(new Date(transaction.date))}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className={`font-semibold ${getTransactionTypeColor(transaction.type)}`}>
                          {getTransactionTypeIcon(transaction.type, transaction.amount)}{formatCurrency(Math.abs(transaction.amount))}
                        </p>
                        {transaction.notes && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {transaction.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : creditCardBills.filter((bill: any) => !bill.is_paid).length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {searchTerm || typeFilter !== "all" ? "Nenhuma transação encontrada" : "Nenhuma transação cadastrada"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || typeFilter !== "all" 
                      ? "Tente ajustar os filtros de busca"
                      : "Comece registrando sua primeira movimentação financeira"
                    }
                  </p>
                  {!searchTerm && typeFilter === "all" && (
                    <Button onClick={() => setTransactionModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeira Transação
                    </Button>
                   )}
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Transaction Modal */}
        <TransactionModal
          open={transactionModalOpen}
          onOpenChange={setTransactionModalOpen}
        />
      </div>
    </MainLayout>
  );
}
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionModal } from "@/components/transactions/TransactionModal";
import { Plus, Search, Filter, ArrowUpDown, Calendar } from "lucide-react";

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);

  // Mock data for transactions - will be replaced with real data later
  const transactions = [
    {
      id: "1",
      description: "Supermercado ABC",
      amount: -234.56,
      type: "expense",
      category: "Alimentação",
      account: "Conta Corrente",
      date: "2024-01-08",
      notes: "Compras da semana"
    },
    {
      id: "2", 
      description: "Salário",
      amount: 5000.00,
      type: "income",
      category: "Trabalho",
      account: "Conta Corrente",
      date: "2024-01-05",
      notes: ""
    },
    {
      id: "3",
      description: "Transferência para Poupança",
      amount: -1000.00,
      type: "transfer",
      category: "Transferência",
      account: "Conta Corrente → Poupança",
      date: "2024-01-03",
      notes: "Reserva de emergência"
    }
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Math.abs(amount));
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "income":
        return "text-success";
      case "expense":
        return "text-destructive";
      case "transfer":
        return "text-primary";
      default:
        return "text-foreground";
    }
  };

  const getTransactionTypeIcon = (amount: number) => {
    return amount > 0 ? "+" : "-";
  };

  return (
    <MainLayout activeTab="transactions">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Transações</h1>
            <p className="text-muted-foreground">
              Visualize e gerencie todas as suas movimentações financeiras
            </p>
          </div>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-card p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-success"></div>
              <span className="text-sm text-muted-foreground">Receitas</span>
            </div>
            <p className="text-2xl font-bold text-success">R$ 5.000,00</p>
          </div>
          
          <div className="bg-gradient-card p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-destructive"></div>
              <span className="text-sm text-muted-foreground">Despesas</span>
            </div>
            <p className="text-2xl font-bold text-destructive">R$ 1.234,56</p>
          </div>
          
          <div className="bg-gradient-card p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span className="text-sm text-muted-foreground">Saldo</span>
            </div>
            <p className="text-2xl font-bold text-primary">R$ 3.765,44</p>
          </div>
        </div>

        {/* Filters */}
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
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="income">Receitas</SelectItem>
              <SelectItem value="expense">Despesas</SelectItem>
              <SelectItem value="transfer">Transferências</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="w-full sm:w-auto">
            <Calendar className="h-4 w-4 mr-2" />
            Período
          </Button>
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
          
          <div className="divide-y">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-lg ${
                            transaction.type === "income" ? "bg-success/10" :
                            transaction.type === "expense" ? "bg-destructive/10" : "bg-primary/10"
                          } flex items-center justify-center`}>
                            <span className={`text-sm font-semibold ${getTransactionTypeColor(transaction.type)}`}>
                              {getTransactionTypeIcon(transaction.amount)}
                            </span>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground truncate">
                            {transaction.description}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{transaction.category}</span>
                            <span>•</span>
                            <span>{transaction.account}</span>
                            <span>•</span>
                            <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className={`font-semibold ${getTransactionTypeColor(transaction.type)}`}>
                        {getTransactionTypeIcon(transaction.amount)}{formatCurrency(transaction.amount)}
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
            ) : (
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
                  <Button onClick={() => setModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Transação
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Transaction Modal */}
        <TransactionModal
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      </div>
    </MainLayout>
  );
}
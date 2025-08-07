import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AccountCard } from "@/components/accounts/AccountCard";
import { AccountModal } from "@/components/accounts/AccountModal";
import { useAccounts, type Account } from "@/hooks/useAccounts";
import { Plus, Search, Filter } from "lucide-react";
import { accountTypeOptions } from "@/lib/validations/account";

export default function Accounts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const { data: accounts = [], isLoading, error } = useAccounts();

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.bank_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || account.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const totalBalance = accounts
    .filter(account => account.include_in_total)
    .reduce((sum, account) => sum + account.current_balance, 0);

  const handleCreateAccount = () => {
    setSelectedAccount(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    setModalMode('edit');
    setModalOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">Erro ao carregar contas: {error.message}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout activeTab="accounts">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Contas</h1>
            <p className="text-muted-foreground">
              Gerencie suas contas bancárias e saldos
            </p>
          </div>
          <Button onClick={handleCreateAccount}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Conta
          </Button>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-card p-6 rounded-lg border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold">Saldo Total</h2>
              <p className="text-3xl font-bold text-success">
                {formatCurrency(totalBalance)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total de Contas</p>
              <p className="text-2xl font-semibold">{accounts.length}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar contas..."
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
              {accountTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Accounts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : filteredAccounts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAccounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onEdit={handleEditAccount}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm || typeFilter !== "all" ? "Nenhuma conta encontrada" : "Nenhuma conta cadastrada"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || typeFilter !== "all" 
                ? "Tente ajustar os filtros de busca"
                : "Comece criando sua primeira conta bancária"
              }
            </p>
            {!searchTerm && typeFilter === "all" && (
              <Button onClick={handleCreateAccount}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Conta
              </Button>
            )}
          </div>
        )}

        {/* Account Modal */}
        <AccountModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          account={selectedAccount}
          mode={modalMode}
        />
      </div>
    </MainLayout>
  );
}
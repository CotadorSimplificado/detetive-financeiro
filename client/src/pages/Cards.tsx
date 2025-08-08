import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, CreditCard as CreditCardIcon, Wallet, TrendingUp, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreditCards, useCreateCreditCard, useUpdateCreditCard, useDeleteCreditCard } from "@/hooks/useCreditCards";
import { useCreditCardBills } from "@/hooks/useCreditCardBills";
import { CreditCardCard } from "@/components/cards/CreditCardCard";
import { CreditCardModal } from "@/components/cards/CreditCardModal";
import { CreditCardFormData } from "@/lib/validations/credit-card";
import { formatCurrency } from "@/lib/currency-utils";
import { parseCurrencyInput } from "@/lib/currency-format";
import { useNavigate } from "react-router-dom";
import { TransactionModal } from "@/components/transactions/TransactionModal";

export default function Cards() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<any>(null);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);

  const { data: cards = [], isLoading } = useCreditCards();
  const { data: bills = [] } = useCreditCardBills();
  const createCard = useCreateCreditCard();
  const updateCard = useUpdateCreditCard();
  const deleteCard = useDeleteCreditCard();

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || card.type === filterType;
    return matchesSearch && matchesType;
  });

  // Cálculos dos resumos
  const totalCards = cards.length;
  const totalLimit = cards.reduce((sum, card) => sum + (card.credit_limit || 0), 0);
  const totalAvailable = cards.reduce((sum, card) => sum + (card.available_limit || 0), 0);
  const totalUsed = totalLimit - totalAvailable;
  const usagePercentage = totalLimit > 0 ? (totalUsed / totalLimit) * 100 : 0;

  const cardsNearLimit = cards.filter(card => {
    if (!card.credit_limit || !card.available_limit) return false;
    const usage = ((card.credit_limit - card.available_limit) / card.credit_limit) * 100;
    return usage > 80;
  }).length;

  const handleSubmit = async (data: CreditCardFormData) => {
    try {
      // Transform frontend snake_case fields to backend camelCase fields
      const transformedData = {
        name: data.name,
        type: data.type,
        brand: data.brand,
        lastFourDigits: data.last_digits || undefined,
        color: data.color,
        limit: parseCurrencyInput(data.credit_limit), // Convert Brazilian format to DB format
        availableLimit: parseCurrencyInput(data.available_limit), // Convert Brazilian format to DB format
        closingDay: parseInt(data.closing_day),
        dueDay: parseInt(data.due_day),
        isDefault: data.is_default,
        isVirtual: data.is_virtual,
        parentCardId: data.parent_card_id || undefined,
      };

      if (editingCard) {
        await updateCard.mutateAsync({ id: editingCard.id, ...transformedData });
      } else {
        await createCard.mutateAsync({
          ...transformedData,
          isActive: true,
        });
      }
      setIsModalOpen(false);
      setEditingCard(null);
    } catch (error) {
      console.error('Error saving card:', error);
    }
  };

  const handleEdit = (card: any) => {
    setEditingCard(card);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja remover este cartão?")) {
      await deleteCard.mutateAsync(id);
    }
  };

  const handleViewDetails = (cardId: string) => {
    // Buscar a fatura atual/mais recente do cartão
    const cardBills = bills.filter(bill => bill.credit_card_id === cardId);
    const currentBill = cardBills.find(bill => !bill.is_paid) || cardBills[0];
    
    if (currentBill) {
      navigate(`/bills/${currentBill.id}`);
    } else {
      // Se não houver faturas, pode mostrar uma mensagem ou criar uma fatura
      console.log('Nenhuma fatura encontrada para este cartão');
    }
  };

  const handleSetDefault = async (id: string) => {
    // Primeiro, remove o default de todos os cartões
    const currentDefault = cards.find(card => card.is_default);
    if (currentDefault && currentDefault.id !== id) {
      await updateCard.mutateAsync({ id: currentDefault.id, is_default: false });
    }
    
    // Depois define o novo como default
    await updateCard.mutateAsync({ id, is_default: true });
  };

  return (
    <>
      <MainLayout onNewTransaction={() => setTransactionModalOpen(true)}>
        <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cartões</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie seus cartões de crédito e débito
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cartão
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CreditCardIcon className="h-8 w-8 text-muted-foreground" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total de Cartões</p>
                  <p className="text-2xl font-bold">{totalCards}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Wallet className="h-8 w-8 text-muted-foreground" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Limite Total</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalLimit)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Limite Usado</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalUsed)}</p>
                  <p className="text-xs text-muted-foreground">
                    {usagePercentage.toFixed(1)}% do total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Próximo do Limite</p>
                  <p className="text-2xl font-bold">{cardsNearLimit}</p>
                  {cardsNearLimit > 0 && (
                    <Badge variant="destructive" className="text-xs mt-1">
                      Atenção
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Pesquisar cartões..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="CREDIT">Crédito</SelectItem>
                  <SelectItem value="DEBIT">Débito</SelectItem>
                  <SelectItem value="CREDIT_DEBIT">Múltiplo</SelectItem>
                  <SelectItem value="PREPAID">Pré-pago</SelectItem>
                  <SelectItem value="VIRTUAL">Virtual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredCards.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <CreditCardIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Nenhum cartão encontrado</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterType !== "all" 
                  ? "Tente ajustar os filtros para encontrar seus cartões."
                  : "Comece adicionando seu primeiro cartão."
                }
              </p>
              {!searchTerm && filterType === "all" && (
                <Button className="mt-4" onClick={() => setIsModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Cartão
                </Button>
              )}
            </div>
          ) : (
            filteredCards.map((card) => (
              <CreditCardCard
                key={card.id}
                card={card}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
                onSetDefault={handleSetDefault}
              />
            ))
          )}
        </div>

        {/* Modal */}
        <CreditCardModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCard(null);
          }}
          onSubmit={handleSubmit}
          isLoading={createCard.isPending || updateCard.isPending}
          editingCard={editingCard}
          availableParentCards={cards}
        />
        
        {/* Transaction Modal */}
        <TransactionModal 
          open={transactionModalOpen}
          onOpenChange={setTransactionModalOpen}
        />
        </div>
      </MainLayout>
    </>
  );
}
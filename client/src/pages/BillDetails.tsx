
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, CreditCard, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCreditCardBills } from '@/hooks/useCreditCardBills';
import { useCreditCards } from '@/hooks/useCreditCards';
import { useTransactions } from '@/hooks/useTransactions';
import { formatCurrency } from '@/lib/currency-utils';
import { formatDateBR } from '@/lib/date-utils';
import { PayBillModal } from '@/components/transactions/PayBillModal';
import { useState } from 'react';

export default function BillDetails() {
  const { billId } = useParams<{ billId: string }>();
  const navigate = useNavigate();
  const { bills } = useCreditCardBills();
  const { creditCards } = useCreditCards();
  const { transactions } = useTransactions();
  const [payBillModalOpen, setPayBillModalOpen] = useState(false);

  const bill = bills.find(b => b.id === billId);
  const creditCard = bill ? creditCards.find(c => c.id === bill.credit_card_id) : null;
  
  // Buscar transações da fatura
  const billTransactions = transactions.filter(t => 
    t.type === 'credit_card_expense' && 
    t.credit_card_id === bill?.credit_card_id &&
    t.date >= bill?.period_start! &&
    t.date <= bill?.period_end!
  );

  if (!bill || !creditCard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-muted-foreground">Fatura não encontrada</h2>
          <Button variant="outline" onClick={() => navigate('/cards')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar aos Cartões
          </Button>
        </div>
      </div>
    );
  }

  const isPaid = bill.paid;
  const isOverdue = !isPaid && new Date(bill.due_date) < new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/cards')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Detalhes da Fatura</h1>
            <p className="text-muted-foreground">{creditCard.name}</p>
          </div>
        </div>
        
        {!isPaid && (
          <Button onClick={() => setPayBillModalOpen(true)}>
            <DollarSign className="mr-2 h-4 w-4" />
            Pagar Fatura
          </Button>
        )}
      </div>

      {/* Resumo da Fatura */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(bill.amount)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {billTransactions.length} transações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencimento</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDateBR(new Date(bill.due_date))}</div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant={isOverdue ? "destructive" : isPaid ? "default" : "secondary"}>
                {isPaid ? "Paga" : isOverdue ? "Vencida" : "Pendente"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Período</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {formatDateBR(new Date(bill.period_start))}
            </div>
            <div className="text-xs text-muted-foreground">
              até {formatDateBR(new Date(bill.period_end))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalhes do Cartão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Informações do Cartão</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nome do Cartão</p>
              <p className="text-base">{creditCard.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bandeira</p>
              <p className="text-base">{creditCard.brand}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Limite Total</p>
              <p className="text-base">{formatCurrency(creditCard.limit)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Disponível</p>
              <p className="text-base">{formatCurrency(creditCard.available)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>Transações da Fatura</CardTitle>
        </CardHeader>
        <CardContent>
          {billTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma transação encontrada para esta fatura
            </p>
          ) : (
            <div className="space-y-3">
              {billTransactions.map((transaction, index) => (
                <div key={transaction.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDateBR(new Date(transaction.date))}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">
                        -{formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                  {index < billTransactions.length - 1 && (
                    <Separator className="mt-3" />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Pagamento */}
      <PayBillModal
        open={payBillModalOpen}
        onOpenChange={setPayBillModalOpen}
        bill={bill}
        creditCard={creditCard}
      />
    </div>
  );
}

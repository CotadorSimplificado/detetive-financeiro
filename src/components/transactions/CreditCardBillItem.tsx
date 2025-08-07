import { useState } from "react";
import { CreditCard, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PayBillModal } from "./PayBillModal";
import { CreditCardBill } from "@/hooks/useCreditCardBills";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CreditCardBillItemProps {
  bill: CreditCardBill;
}

export function CreditCardBillItem({ bill }: CreditCardBillItemProps) {
  const [showPayModal, setShowPayModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
  };

  const isOverdue = new Date(bill.due_date) < new Date() && !bill.is_paid;
  const isDueSoon = new Date(bill.due_date) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) && !bill.is_paid;

  return (
    <>
      <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
            <CreditCard className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-foreground">
                Fatura {bill.credit_cards?.name}
              </h3>
              {bill.is_paid ? (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Paga
                </Badge>
              ) : isOverdue ? (
                <Badge variant="destructive">
                  Vencida
                </Badge>
              ) : isDueSoon ? (
                <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                  Vence em breve
                </Badge>
              ) : (
                <Badge variant="outline">
                  Pendente
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Vence em {formatDate(bill.due_date)}</span>
              </div>
              {bill.credit_cards?.last_digits && (
                <span>•••• {bill.credit_cards.last_digits}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-semibold text-foreground">
              {formatCurrency(bill.total_amount)}
            </div>
            <div className="text-sm text-muted-foreground">
              {bill.reference_month}
            </div>
          </div>

          {!bill.is_paid && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPayModal(true)}
              className="min-w-20"
            >
              <DollarSign className="h-4 w-4 mr-1" />
              Pagar
            </Button>
          )}
        </div>
      </div>

      <PayBillModal
        bill={bill}
        open={showPayModal}
        onOpenChange={setShowPayModal}
      />
    </>
  );
}
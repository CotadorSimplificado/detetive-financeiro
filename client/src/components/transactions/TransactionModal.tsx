import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransactionTypeDialog } from "./TransactionTypeDialog";
import { IncomeForm } from "./IncomeForm";
import { ExpenseForm } from "./ExpenseForm";
import { CreditCardExpenseForm } from "./CreditCardExpenseForm";
import { TransferForm } from "./TransferForm";
import { useCreateTransaction, useUpdateTransaction } from '@/hooks/useTransactions';
import { useMonthlyPlan } from '@/hooks/useMonthlyPlan';
import { Transaction } from '@/data/types';
import { toast } from 'sonner';

interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TransactionType = 'income' | 'expense' | 'credit_card_expense' | 'transfer' | null;

export function TransactionModal({ open, onOpenChange }: TransactionModalProps) {
  const [selectedType, setSelectedType] = useState<TransactionType>(null);

  const handleClose = () => {
    setSelectedType(null);
    onOpenChange(false);
  };

  const handleTypeSelect = (type: TransactionType) => {
    setSelectedType(type);
  };

  const handleSuccess = () => {
    handleClose();
  };

  const handleBack = () => {
    setSelectedType(null);
  };

  const getTitle = () => {
    switch (selectedType) {
      case 'income':
        return 'Nova Receita';
      case 'expense':
        return 'Nova Despesa';
      case 'credit_card_expense':
        return 'Nova Despesa no Cartão';
      case 'transfer':
        return 'Nova Transferência';
      default:
        return 'Nova Transação';
    }
  };

  const renderForm = () => {
    switch (selectedType) {
      case 'income':
        return <IncomeForm key="income" onSuccess={handleSuccess} onCancel={handleBack} />;
      case 'expense':
        return <ExpenseForm key="expense" onSuccess={handleSuccess} onCancel={handleBack} />;
      case 'credit_card_expense':
        return <CreditCardExpenseForm key="credit_card_expense" onSuccess={handleSuccess} onCancel={handleBack} />;
      case 'transfer':
        return <TransferForm key="transfer" onSuccess={handleSuccess} onCancel={handleBack} />;
      default:
        return null;
    }
  };

  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const { checkTransactionAlert } = useMonthlyPlan();

  const handleSubmit = async (data: any) => {
    try {
      // Verificar alertas de orçamento para despesas
      if ((data.type === 'EXPENSE' || data.type === 'CREDIT_CARD_EXPENSE') && data.category_id && data.amount) {
        const alert = checkTransactionAlert(data.category_id, data.amount);

        if (alert) {
          let alertMessage = '';

          switch (alert.alert_type) {
            case 'EXCEEDED':
              alertMessage = `Esta despesa ultrapassará o orçamento de ${alert.category_name} em ${((alert.percentage - 100)).toFixed(1)}%`;
              break;
            case 'NO_BUDGET':
              alertMessage = `A categoria ${alert.category_name} não possui orçamento definido para este mês`;
              break;
            default:
              alertMessage = `Atenção: esta despesa afetará o orçamento de ${alert.category_name}`;
          }

          // Mostrar toast de aviso (não bloqueia a ação)
          toast.warning(alertMessage, {
            duration: 5000,
            action: {
              label: 'Ver Planejamento',
              onClick: () => window.location.href = '/budgets'
            }
          });
        }
      }

      if (false) { // EditingTransaction não implementado ainda
        await updateTransaction('', data);
        toast.success('Transação atualizada com sucesso!');
      } else {
        await createTransaction(data);
        toast.success('Transação criada com sucesso!');
      }
      handleClose();
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      toast.error('Erro ao salvar transação');
    }
  };

  return (
    <>
      {/* Dialog para seleção do tipo */}
      <TransactionTypeDialog
        open={open && !selectedType}
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
        onTransactionTypeSelect={handleTypeSelect}
      />

      {/* Dialog para o formulário específico */}
      <Dialog 
        open={open && !!selectedType} 
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
      >
        <DialogContent 
          className="sm:max-w-md max-h-[90vh] overflow-y-auto"
          aria-describedby="transaction-form-description"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{getTitle()}</DialogTitle>
          </DialogHeader>

          <div id="transaction-form-description" className="py-4">
            {renderForm()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
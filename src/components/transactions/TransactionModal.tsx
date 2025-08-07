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
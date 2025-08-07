import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRightLeft,
  Plus
} from "lucide-react";

interface TransactionTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransactionTypeSelect: (type: 'income' | 'expense' | 'credit_card_expense' | 'transfer') => void;
}

export function TransactionTypeDialog({ 
  open, 
  onOpenChange, 
  onTransactionTypeSelect 
}: TransactionTypeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-md"
        aria-describedby="transaction-type-description"
      >
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
          <DialogDescription id="transaction-type-description">
            Escolha o tipo de transação que deseja registrar
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-3 py-4">
          <Button
            onClick={() => onTransactionTypeSelect('income')}
            variant="outline"
            className="flex items-center justify-start gap-3 h-16 border-success/20 hover:border-success/40 hover:bg-success/5"
          >
            <div className="p-2 rounded-lg bg-success/10">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div className="text-left">
              <div className="font-medium">Receita</div>
              <div className="text-sm text-muted-foreground">
                Registrar entrada de dinheiro
              </div>
            </div>
          </Button>

          <Button
            onClick={() => onTransactionTypeSelect('expense')}
            variant="outline"
            className="flex items-center justify-start gap-3 h-16 border-expense/20 hover:border-expense/40 hover:bg-expense/5"
          >
            <div className="p-2 rounded-lg bg-expense/10">
              <TrendingDown className="w-5 h-5 text-expense" />
            </div>
            <div className="text-left">
              <div className="font-medium">Despesa</div>
              <div className="text-sm text-muted-foreground">
                Registrar saída de dinheiro
              </div>
            </div>
          </Button>

          <Button
            onClick={() => onTransactionTypeSelect('credit_card_expense')}
            variant="outline"
            className="flex items-center justify-start gap-3 h-16 border-orange-500/20 hover:border-orange-500/40 hover:bg-orange-500/5"
          >
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Plus className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-left">
              <div className="font-medium">Despesa no Cartão</div>
              <div className="text-sm text-muted-foreground">
                Registrar compra no cartão de crédito
              </div>
            </div>
          </Button>

          <Button
            onClick={() => onTransactionTypeSelect('transfer')}
            variant="outline"
            className="flex items-center justify-start gap-3 h-16 border-transfer/20 hover:border-transfer/40 hover:bg-transfer/5"
          >
            <div className="p-2 rounded-lg bg-transfer/10">
              <ArrowRightLeft className="w-5 h-5 text-transfer" />
            </div>
            <div className="text-left">
              <div className="font-medium">Transferência</div>
              <div className="text-sm text-muted-foreground">
                Transferir entre contas
              </div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
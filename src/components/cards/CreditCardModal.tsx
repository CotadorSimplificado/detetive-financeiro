import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCardForm } from "./CreditCardForm";
import { CreditCardFormData } from "@/lib/validations/credit-card";
import { CreditCard } from "@/hooks/useCreditCards";

interface CreditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreditCardFormData) => void;
  isLoading?: boolean;
  editingCard?: CreditCard;
  availableParentCards?: CreditCard[];
}

export function CreditCardModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  editingCard,
  availableParentCards = []
}: CreditCardModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingCard ? "Editar Cartão" : "Novo Cartão"}
          </DialogTitle>
        </DialogHeader>
        
        <CreditCardForm
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isLoading}
          defaultValues={editingCard}
          availableParentCards={availableParentCards.filter(card => 
            !card.is_virtual && card.id !== editingCard?.id
          )}
        />
      </DialogContent>
    </Dialog>
  );
}
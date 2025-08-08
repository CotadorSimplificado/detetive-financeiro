import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AccountForm } from "./AccountForm";
import { useCreateAccount, useUpdateAccount, useDeleteAccount, type Account } from "@/hooks/useAccounts";
import { AccountFormData } from "@/lib/validations/account";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

interface AccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: Account | null;
  mode: 'create' | 'edit';
}

export function AccountModal({ open, onOpenChange, account, mode }: AccountModalProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { user } = useAuth();
  
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();

  const handleSubmit = async (data: AccountFormData) => {
    try {
      if (mode === 'create') {
        const accountData = {
          ...data,
          user_id: user?.id || 'mock-user',
          current_balance: data.initial_balance,
          sync_enabled: true
        };
        await createAccount.mutateAsync(accountData);
      } else if (account) {
        await updateAccount.mutateAsync({ id: account.id, userId: user?.id || 'mock-user', account: data });
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving account:', error);
    }
  };

  const handleDelete = async () => {
    if (!account) return;
    
    try {
      await deleteAccount.mutateAsync(account.id);
      setShowDeleteDialog(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const defaultValues = account ? {
    name: account.name,
    type: account.type as "CHECKING" | "SAVINGS" | "INVESTMENT" | "CASH",
    bank_name: account.bank_name || undefined,
    bank_code: account.bank_code || undefined,
    agency_number: account.agency_number || undefined,
    account_number: account.account_number || undefined,
    initial_balance: account.current_balance || 0,
    color: account.color || "#2196F3",
    icon: account.icon || undefined,
    is_default: account.is_default || false,
    include_in_total: account.include_in_total !== false, // default true
    is_active: account.is_active !== false, // default true
  } : undefined;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent 
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          aria-describedby="account-form-description"
        >
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Nova Conta' : 'Editar Conta'}
            </DialogTitle>
          </DialogHeader>

          <div id="account-form-description">

          <AccountForm
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            defaultValues={defaultValues}
            isLoading={createAccount.isPending || updateAccount.isPending}
            submitText={mode === 'create' ? 'Criar Conta' : 'Salvar Alterações'}
          />

          {mode === 'edit' && account && (
            <div className="pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowDeleteDialog(true)}
                className="text-sm text-destructive hover:underline"
              >
                Remover conta
              </button>
            </div>
          )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Conta</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover a conta "{account?.name}"? 
              Esta ação não pode ser desfeita e a conta será ocultada do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteAccount.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteAccount.isPending ? "Removendo..." : "Remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
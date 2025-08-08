import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Account } from "@/hooks/useAccounts";
import { CreditCard, PiggyBank, TrendingUp, Banknote, MoreVertical, Edit, Eye, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountCardProps {
  account: Account;
  onEdit: (account: Account) => void;
  onView?: (account: Account) => void;
}

const iconMap = {
  CHECKING: CreditCard,
  SAVINGS: PiggyBank,
  INVESTMENT: TrendingUp,
  CASH: Banknote,
};

const typeLabels = {
  CHECKING: 'Conta Corrente',
  SAVINGS: 'Poupança',
  INVESTMENT: 'Investimento',
  CASH: 'Dinheiro',
};

export function AccountCard({ account, onEdit, onView }: AccountCardProps) {
  const Icon = iconMap[account.type] || CreditCard;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  return (
    <Card className="relative group hover:shadow-md transition-all">
      <div 
        className="absolute top-0 left-0 w-1 h-full rounded-l-lg"
        style={{ backgroundColor: account.color }}
      />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${account.color}20` }}
            >
              <Icon 
                className="h-5 w-5" 
                style={{ color: account.color }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">{account.name}</h3>
                {account.is_default && (
                  <Star className="h-3 w-3 fill-warning text-warning" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {typeLabels[account.type]}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(account)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onEdit(account)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Saldo Atual</p>
          <p className={cn(
            "text-lg font-bold",
            account.current_balance >= 0 ? "text-success" : "text-destructive"
          )}>
            {formatCurrency(account.current_balance)}
          </p>
        </div>

        {account.bank_name && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Banco</p>
            <p className="text-sm">{account.bank_name}</p>
          </div>
        )}

        {(account.agency_number || account.account_number) && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            {account.agency_number && (
              <div>
                <span className="text-muted-foreground">Ag:</span>
                <span className="ml-1">{account.agency_number}</span>
              </div>
            )}
            {account.account_number && (
              <div>
                <span className="text-muted-foreground">CC:</span>
                <span className="ml-1">{account.account_number}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          {account.is_default && (
            <Badge variant="secondary" className="text-xs">
              Padrão
            </Badge>
          )}
          {!account.include_in_total && (
            <Badge variant="outline" className="text-xs">
              Não incluída no total
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
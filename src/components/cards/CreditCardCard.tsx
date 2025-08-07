import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CreditCard, MoreVertical, Pen, Trash2, Eye, Star } from "lucide-react";
import { CreditCard as CreditCardType } from "@/hooks/useCreditCards";
import { formatCurrency } from "@/lib/currency-utils";

interface CreditCardCardProps {
  card: CreditCardType;
  onEdit: (card: CreditCardType) => void;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
  onSetDefault?: (id: string) => void;
}

const brandNames = {
  VISA: "Visa",
  MASTERCARD: "Mastercard",
  ELO: "Elo",
  AMEX: "American Express",
  HIPERCARD: "Hipercard",
  OTHER: "Outro"
};

const typeNames = {
  CREDIT: "Crédito",
  DEBIT: "Débito",
  CREDIT_DEBIT: "Múltiplo",
  PREPAID: "Pré-pago",
  VIRTUAL: "Virtual"
};

export function CreditCardCard({ card, onEdit, onDelete, onViewDetails, onSetDefault }: CreditCardCardProps) {
  const limitUsage = card.credit_limit && card.available_limit 
    ? ((card.credit_limit - card.available_limit) / card.credit_limit) * 100 
    : 0;

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-8 rounded-md flex items-center justify-center"
              style={{ backgroundColor: card.color }}
            >
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base">{card.name}</h3>
                {card.is_default && (
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {brandNames[card.brand]}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {typeNames[card.type]}
                </Badge>
                {card.is_virtual && (
                  <Badge variant="outline" className="text-xs">
                    Virtual
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(card.id)}>
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(card)}>
                <Pen className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              {!card.is_default && onSetDefault && (
                <DropdownMenuItem onClick={() => onSetDefault(card.id)}>
                  <Star className="mr-2 h-4 w-4" />
                  Marcar como Padrão
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => onDelete(card.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remover
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {card.last_digits && (
          <div className="text-sm text-muted-foreground mb-3">
            •••• •••• •••• {card.last_digits}
          </div>
        )}

        {card.credit_limit && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Limite disponível</span>
              <span className="font-medium">
                {formatCurrency(card.available_limit || 0)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Limite total</span>
              <span>{formatCurrency(card.credit_limit)}</span>
            </div>
            
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Utilizado</span>
                <span>{limitUsage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(limitUsage, 100)}%`,
                    backgroundColor: limitUsage > 80 ? '#ef4444' : limitUsage > 60 ? '#f59e0b' : '#22c55e'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {card.closing_day && card.due_day && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Fechamento</span>
                <p className="font-medium">Dia {card.closing_day}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Vencimento</span>
                <p className="font-medium">Dia {card.due_day}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
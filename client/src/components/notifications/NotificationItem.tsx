import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Wallet,
  Target,
  Bell,
  X,
  ExternalLink,
  Clock
} from "lucide-react";
import { formatCurrency } from "@/lib/currency-utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  priority: string;
  status: string;
  title: string;
  message: string;
  metadata?: any;
  action_url?: string;
  created_at: string;
}

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onAction?: (notification: Notification) => void;
}

const getNotificationIcon = (type: string, priority: string) => {
  const iconClass = cn(
    "h-4 w-4 mr-3 flex-shrink-0",
    priority === 'CRITICAL' && "text-red-500",
    priority === 'HIGH' && "text-orange-500",
    priority === 'MEDIUM' && "text-yellow-500",
    priority === 'LOW' && "text-blue-500"
  );

  switch (type) {
    case 'BILL_DUE':
    case 'BILL_OVERDUE':
      return <CreditCard className={iconClass} />;
    case 'SPENDING_ALERT':
    case 'BUDGET_EXCEEDED':
      return <DollarSign className={iconClass} />;
    case 'LOW_BALANCE':
      return <Wallet className={iconClass} />;
    case 'CARD_LIMIT':
      return <AlertCircle className={iconClass} />;
    case 'GOAL_PROGRESS':
      return <Target className={iconClass} />;
    default:
      return <Bell className={iconClass} />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'CRITICAL':
      return 'destructive';
    case 'HIGH':
      return 'secondary';
    case 'MEDIUM':
      return 'outline';
    default:
      return 'outline';
  }
};

export function NotificationItem({ 
  notification, 
  onRead, 
  onDismiss, 
  onAction 
}: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isUnread = notification.status === 'UNREAD';
  
  const handleClick = () => {
    if (isUnread) {
      onRead(notification.id);
    }
    if (onAction) {
      onAction(notification);
    }
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDismiss(notification.id);
  };

  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
    locale: ptBR
  });

  return (
    <div
      className={cn(
        "relative p-3 hover:bg-accent/50 cursor-pointer transition-colors",
        isUnread && "bg-muted/30"
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`notification-item-${notification.id}`}
    >
      <div className="flex items-start gap-3">
        {/* Indicador de não lida */}
        {isUnread && (
          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
        )}
        
        {/* Ícone */}
        {getNotificationIcon(notification.type, notification.priority)}
        
        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className={cn(
                "text-sm",
                isUnread ? "font-medium" : "font-normal"
              )}>
                {notification.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {notification.message}
              </p>
            </div>
            
            {/* Badge de prioridade */}
            {notification.priority !== 'LOW' && (
              <Badge 
                variant={getPriorityColor(notification.priority) as any}
                className="text-xs"
              >
                {notification.priority === 'CRITICAL' ? 'Urgente' :
                 notification.priority === 'HIGH' ? 'Alta' : 'Média'}
              </Badge>
            )}
          </div>
          
          {/* Metadados */}
          {notification.metadata && (
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              {notification.metadata.amount && (
                <span>{formatCurrency(notification.metadata.amount)}</span>
              )}
              {notification.metadata.due_date && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(notification.metadata.due_date).toLocaleDateString('pt-BR')}
                </span>
              )}
            </div>
          )}
          
          {/* Tempo */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
            
            {/* Ações */}
            {(isHovered || notification.action_url) && (
              <div className="flex items-center gap-1">
                {notification.action_url && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    data-testid={`button-action-${notification.id}`}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleDismiss}
                  data-testid={`button-dismiss-${notification.id}`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
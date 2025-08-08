import { useMemo, useEffect } from 'react';
import { useMockStore } from '@/data/store/mockContext';
import { notificationService } from '@/lib/notifications';

export interface Notification {
  id: string;
  user_id: string;
  type: 'BILL_DUE' | 'BILL_OVERDUE' | 'SPENDING_ALERT' | 'BUDGET_EXCEEDED' | 'GOAL_PROGRESS' | 'LOW_BALANCE' | 'CARD_LIMIT' | 'SYSTEM';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'UNREAD' | 'READ' | 'DISMISSED' | 'ARCHIVED';
  title: string;
  message: string;
  metadata?: {
    bill_id?: string;
    card_id?: string;
    account_id?: string;
    category_id?: string;
    budget_id?: string;
    amount?: number;
    due_date?: string;
    [key: string]: any;
  };
  action_url?: string;
  expires_at?: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
}

export function useNotifications() {
  const { 
    accounts, 
    creditCards, 
    creditCardBills, 
    transactions,
    user 
  } = useMockStore();

  // Configurar notificações automáticas quando os dados mudarem
  useEffect(() => {
    if (!user || !creditCardBills.length) return;

    // Verificar faturas vencendo nos próximos dias
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);

    creditCardBills
      .filter(bill => !bill.is_paid)
      .forEach(bill => {
        const dueDate = new Date(bill.due_date);
        const card = creditCards.find(c => c.id === bill.credit_card_id);
        
        if (!card) return;

        // Verificar se deve notificar
        if (dueDate <= tomorrow && dueDate >= today) {
          // Agendar notificação para amanhã se a fatura vence
          setTimeout(() => {
            notificationService.notifyBillDue(card.name, bill.amount, dueDate, bill.id);
          }, 1000); // Delay pequeno para não sobrecarregar
        }
      });

    // Verificar limites de cartão
    creditCards.forEach(card => {
      if (card.credit_limit && card.available_limit) {
        const usagePercent = ((card.credit_limit - card.available_limit) / card.credit_limit) * 100;
        
        if (usagePercent > 85) {
          setTimeout(() => {
            notificationService.notifyCardLimit(card.name, usagePercent, card.available_limit);
          }, 2000);
        }
      }
    });

    // Verificar saldos baixos
    accounts
      .filter(account => account.type === 'CHECKING' && account.current_balance < 500)
      .forEach(account => {
        setTimeout(() => {
          notificationService.notifyLowBalance(account.name, account.current_balance, 500);
        }, 3000);
      });

  }, [accounts, creditCards, creditCardBills, user]);

  // Gerar notificações baseadas no estado atual
  const notifications = useMemo(() => {
    if (!user) return [];

    const now = new Date();
    const generatedNotifications: Notification[] = [];

    // 1. Notificações de vencimento de faturas
    creditCardBills
      .filter(bill => !bill.is_paid)
      .forEach(bill => {
        const dueDate = new Date(bill.due_date);
        const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const card = creditCards.find(c => c.id === bill.credit_card_id);

        if (daysUntilDue < 0) {
          // Fatura vencida
          generatedNotifications.push({
            id: `overdue-${bill.id}`,
            user_id: user.id,
            type: 'BILL_OVERDUE',
            priority: 'CRITICAL',
            status: 'UNREAD',
            title: 'Fatura Vencida',
            message: `A fatura do cartão ${card?.name} venceu há ${Math.abs(daysUntilDue)} dias`,
            metadata: {
              bill_id: bill.id,
              card_id: bill.credit_card_id,
              amount: bill.amount,
              due_date: bill.due_date
            },
            action_url: `/bills/${bill.id}`,
            created_at: new Date(now.getTime() - Math.abs(daysUntilDue) * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
          });
        } else if (daysUntilDue <= 3) {
          // Fatura vence em breve
          generatedNotifications.push({
            id: `due-soon-${bill.id}`,
            user_id: user.id,
            type: 'BILL_DUE',
            priority: daysUntilDue === 0 ? 'HIGH' : 'MEDIUM',
            status: 'UNREAD',
            title: daysUntilDue === 0 ? 'Fatura Vence Hoje' : 'Fatura Vence em Breve',
            message: `A fatura do cartão ${card?.name} ${daysUntilDue === 0 ? 'vence hoje' : `vence em ${daysUntilDue} dias`}`,
            metadata: {
              bill_id: bill.id,
              card_id: bill.credit_card_id,
              amount: bill.amount,
              due_date: bill.due_date
            },
            action_url: `/bills/${bill.id}`,
            created_at: new Date(now.getTime() - (3 - daysUntilDue) * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      });

    // 2. Alertas de limite de cartão
    creditCards.forEach(card => {
      if (card.credit_limit && card.available_limit) {
        const usagePercent = ((card.credit_limit - card.available_limit) / card.credit_limit) * 100;
        
        if (usagePercent > 90) {
          generatedNotifications.push({
            id: `card-limit-${card.id}`,
            user_id: user.id,
            type: 'CARD_LIMIT',
            priority: 'HIGH',
            status: 'UNREAD',
            title: 'Limite do Cartão Quase Esgotado',
            message: `O cartão ${card.name} está com ${usagePercent.toFixed(1)}% do limite utilizado`,
            metadata: {
              card_id: card.id,
              amount: card.credit_limit - card.available_limit,
              usage_percent: usagePercent
            },
            action_url: `/cards`,
            created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
            updated_at: new Date().toISOString()
          });
        }
      }
    });

    // 3. Alertas de saldo baixo
    accounts.forEach(account => {
      if (account.current_balance < 500 && account.type === 'CHECKING') {
        generatedNotifications.push({
          id: `low-balance-${account.id}`,
          user_id: user.id,
          type: 'LOW_BALANCE',
          priority: account.current_balance < 100 ? 'HIGH' : 'MEDIUM',
          status: 'UNREAD',
          title: 'Saldo Baixo',
          message: `A conta ${account.name} está com saldo baixo`,
          metadata: {
            account_id: account.id,
            amount: account.current_balance
          },
          action_url: `/accounts`,
          created_at: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(), // 6 horas atrás
          updated_at: new Date().toISOString()
        });
      }
    });

    // 4. Alertas de gastos excessivos (últimos 7 dias)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentExpenses = transactions
      .filter(t => 
        (t.type === 'EXPENSE' || t.type === 'CREDIT_CARD_EXPENSE') && 
        new Date(t.date) >= sevenDaysAgo
      )
      .reduce((sum, t) => sum + t.amount, 0);

    if (recentExpenses > 5000) {
      generatedNotifications.push({
        id: 'spending-alert-week',
        user_id: user.id,
        type: 'SPENDING_ALERT',
        priority: 'MEDIUM',
        status: 'UNREAD',
        title: 'Gastos Elevados',
        message: `Você gastou muito nos últimos 7 dias. Considere revisar seus gastos.`,
        metadata: {
          amount: recentExpenses,
          period: 'week'
        },
        action_url: `/transactions`,
        created_at: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(), // 1 hora atrás
        updated_at: new Date().toISOString()
      });
    }

    // Ordenar por data de criação (mais recentes primeiro)
    return generatedNotifications.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [accounts, creditCards, creditCardBills, transactions, user]);

  const unreadCount = notifications.filter(n => n.status === 'UNREAD').length;

  const markAsRead = (notificationId: string) => {
    // Em um app real, isso faria uma chamada para a API
    console.log('Marking notification as read:', notificationId);
  };

  const markAllAsRead = () => {
    console.log('Marking all notifications as read');
  };

  const dismissNotification = (notificationId: string) => {
    console.log('Dismissing notification:', notificationId);
  };

  const clearAllNotifications = () => {
    console.log('Clearing all notifications');
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAllNotifications
  };
}
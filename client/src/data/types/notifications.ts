// Tipos para sistema de notificações
import { BaseEntity } from './index';

export type NotificationType = 'BILL_DUE' | 'BILL_OVERDUE' | 'SPENDING_ALERT' | 'BUDGET_EXCEEDED' | 'GOAL_PROGRESS' | 'LOW_BALANCE' | 'CARD_LIMIT' | 'SYSTEM';

export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type NotificationStatus = 'UNREAD' | 'READ' | 'DISMISSED' | 'ARCHIVED';

export interface Notification extends BaseEntity {
  user_id: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
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
}

export interface NotificationSettings extends BaseEntity {
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  bill_reminders: {
    enabled: boolean;
    days_before: number[];
  };
  spending_alerts: {
    enabled: boolean;
    daily_limit?: number;
    weekly_limit?: number;
    monthly_limit?: number;
  };
  budget_alerts: {
    enabled: boolean;
    threshold_percentage: number;
  };
  low_balance_alerts: {
    enabled: boolean;
    minimum_balance: number;
  };
  card_limit_alerts: {
    enabled: boolean;
    threshold_percentage: number;
  };
  quiet_hours: {
    enabled: boolean;
    start_time: string;
    end_time: string;
  };
}

// Tipos para componentes
export interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onAction?: (notification: Notification) => void;
}

export interface NotificationCenterProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: Notification[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
}


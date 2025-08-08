// Utilitários para notificações push e do navegador

interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

interface ExtendedNotificationOptions extends NotificationOptions {
  actions?: NotificationAction[];
}

export class NotificationService {
  private static instance: NotificationService;
  private swRegistration: ServiceWorkerRegistration | null = null;
  
  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Verifica se as notificações são suportadas
  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
  }

  // Verifica o status da permissão
  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) {
      return { granted: false, denied: true, default: false };
    }
    
    const permission = Notification.permission;
    return {
      granted: permission === 'granted',
      denied: permission === 'denied',
      default: permission === 'default'
    };
  }

  // Solicita permissão para notificações
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      console.warn('Notificações não são suportadas neste navegador');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Erro ao solicitar permissão para notificações:', error);
      return false;
    }
  }

  // Registra o Service Worker
  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!this.isSupported()) {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      this.swRegistration = registration;
      console.log('Service Worker registrado com sucesso');
      return registration;
    } catch (error) {
      console.error('Erro ao registrar Service Worker:', error);
      return null;
    }
  }

  // Envia uma notificação local
  async showNotification(title: string, options: ExtendedNotificationOptions = {}): Promise<boolean> {
    const permissionStatus = this.getPermissionStatus();
    
    if (!permissionStatus.granted) {
      console.warn('Permissão de notificação não concedida');
      return false;
    }

    try {
      if (this.swRegistration) {
        // Usar Service Worker para notificações mais robustas
        await this.swRegistration.showNotification(title, {
          badge: '/favicon.ico',
          icon: '/favicon.ico',
          requireInteraction: false,
          ...options
        } as any);
      } else {
        // Fallback para notificação direta
        new Notification(title, {
          icon: '/favicon.ico',
          ...options
        });
      }
      return true;
    } catch (error) {
      console.error('Erro ao exibir notificação:', error);
      return false;
    }
  }

  // Agenda uma notificação para um horário específico
  scheduleNotification(title: string, message: string, scheduledTime: Date, id?: string): void {
    const now = new Date().getTime();
    const scheduledDateTime = scheduledTime.getTime();
    const delay = scheduledDateTime - now;

    if (delay <= 0) {
      console.warn('Horário agendado já passou');
      return;
    }

    const timeoutId = setTimeout(() => {
      this.showNotification(title, {
        body: message,
        tag: id,
        requireInteraction: true,
        actions: [
          {
            action: 'view',
            title: 'Ver Detalhes'
          },
          {
            action: 'dismiss',
            title: 'Dispensar'
          }
        ]
      });
    }, delay);

    // Armazenar o timeout ID se precisar cancelar depois
    if (id) {
      localStorage.setItem(`notification_${id}`, timeoutId.toString());
    }
  }

  // Cancela uma notificação agendada
  cancelScheduledNotification(id: string): void {
    const timeoutId = localStorage.getItem(`notification_${id}`);
    if (timeoutId) {
      clearTimeout(parseInt(timeoutId));
      localStorage.removeItem(`notification_${id}`);
    }
  }

  // Notificação de lembrete de fatura
  async notifyBillDue(cardName: string, amount: number, dueDate: Date, billId: string): Promise<boolean> {
    const daysUntilDue = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    let title: string;
    let message: string;
    
    if (daysUntilDue < 0) {
      title = 'Fatura Vencida!';
      message = `A fatura do cartão ${cardName} venceu há ${Math.abs(daysUntilDue)} dias. Valor: R$ ${amount.toFixed(2)}`;
    } else if (daysUntilDue === 0) {
      title = 'Fatura Vence Hoje!';
      message = `A fatura do cartão ${cardName} vence hoje. Valor: R$ ${amount.toFixed(2)}`;
    } else {
      title = 'Fatura Vence em Breve';
      message = `A fatura do cartão ${cardName} vence em ${daysUntilDue} dias. Valor: R$ ${amount.toFixed(2)}`;
    }

    return this.showNotification(title, {
      body: message,
      tag: `bill_${billId}`,
      requireInteraction: daysUntilDue <= 1
    });
  }

  // Notificação de alerta de gastos
  async notifySpendingAlert(amount: number, limit: number, period: 'daily' | 'weekly' | 'monthly'): Promise<boolean> {
    const periodText = {
      daily: 'diário',
      weekly: 'semanal',
      monthly: 'mensal'
    }[period];

    const percentage = (amount / limit) * 100;
    
    return this.showNotification('Alerta de Gastos!', {
      body: `Você gastou R$ ${amount.toFixed(2)} do seu limite ${periodText} de R$ ${limit.toFixed(2)} (${percentage.toFixed(0)}%)`,
      tag: `spending_alert_${period}`,
      requireInteraction: percentage >= 90
    });
  }

  // Notificação de limite de cartão
  async notifyCardLimit(cardName: string, usagePercent: number, availableLimit: number): Promise<boolean> {
    let title: string;
    let priority = false;
    
    if (usagePercent >= 95) {
      title = 'Limite do Cartão Quase Esgotado!';
      priority = true;
    } else if (usagePercent >= 80) {
      title = 'Atenção: Limite do Cartão Alto';
    } else {
      title = 'Aviso de Limite do Cartão';
    }

    return this.showNotification(title, {
      body: `O cartão ${cardName} está com ${usagePercent.toFixed(1)}% do limite usado. Limite disponível: R$ ${availableLimit.toFixed(2)}`,
      tag: `card_limit_${cardName}`,
      requireInteraction: priority
    });
  }

  // Notificação de saldo baixo
  async notifyLowBalance(accountName: string, currentBalance: number, minimumBalance: number): Promise<boolean> {
    const isVeryLow = currentBalance < minimumBalance / 2;
    
    return this.showNotification(
      isVeryLow ? 'Saldo Muito Baixo!' : 'Saldo Baixo',
      {
        body: `A conta ${accountName} está com saldo de R$ ${currentBalance.toFixed(2)}, abaixo do mínimo de R$ ${minimumBalance.toFixed(2)}`,
        tag: `low_balance_${accountName}`,
        requireInteraction: isVeryLow
      }
    );
  }

  // Configurar notificações automáticas baseadas no estado da aplicação
  async setupAutomaticNotifications(settings: any): Promise<void> {
    if (!settings || !this.getPermissionStatus().granted) {
      return;
    }

    // Registrar Service Worker se ainda não foi feito
    if (!this.swRegistration) {
      await this.registerServiceWorker();
    }

    console.log('Notificações automáticas configuradas com as seguintes opções:', settings);
  }
}

// Instância singleton
export const notificationService = NotificationService.getInstance();
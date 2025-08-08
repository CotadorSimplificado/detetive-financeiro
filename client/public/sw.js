// Service Worker para notificações push
const CACHE_NAME = 'detetive-financeiro-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

// Push event para notificações push
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Nova notificação do Detetive Financeiro',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: data.tag || 'default',
      requireInteraction: data.requireInteraction || false,
      actions: data.actions || [],
      data: data.data || {}
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Detetive Financeiro', options)
    );
  }
});

// Click event para notificações
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  const action = event.action;
  const notificationData = event.notification.data;
  
  let url = '/';
  
  // Definir URL baseada na ação
  switch (action) {
    case 'pay':
    case 'pay_bill':
      url = `/bills/${notificationData.billId || ''}`;
      break;
    case 'view':
    case 'view_card':
      url = `/cards`;
      break;
    case 'view_account':
      url = `/accounts`;
      break;
    case 'view_transactions':
      url = `/transactions`;
      break;
    case 'adjust_budget':
      url = `/budgets`;
      break;
    default:
      // Se não há ação específica, usar a URL padrão baseada no tipo
      if (notificationData.billId) {
        url = `/bills/${notificationData.billId}`;
      } else if (notificationData.cardId) {
        url = `/cards`;
      } else if (notificationData.accountId) {
        url = `/accounts`;
      }
  }
  
  event.waitUntil(
    clients.openWindow(url)
  );
});

// Close event para notificações
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification.tag);
  
  // Analytics ou limpeza se necessário
});

// Background sync para notificações offline
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event.tag);
  
  if (event.tag === 'bill-reminder') {
    event.waitUntil(checkBillReminders());
  }
});

// Função para verificar lembretes de faturas
async function checkBillReminders() {
  try {
    // Em um app real, isso faria uma chamada para a API
    console.log('Verificando lembretes de faturas em background');
  } catch (error) {
    console.error('Erro ao verificar lembretes:', error);
  }
}
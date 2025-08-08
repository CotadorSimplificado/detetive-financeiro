import { useState, useEffect } from 'react';
import { notificationService } from '@/lib/notifications';

export function useNotificationPermissions() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    // Verificar se as notificações são suportadas
    const supported = notificationService.isSupported();
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported || isRequesting) {
      return false;
    }

    setIsRequesting(true);
    
    try {
      const granted = await notificationService.requestPermission();
      setPermission(Notification.permission);
      return granted;
    } finally {
      setIsRequesting(false);
    }
  };

  const hasPermission = permission === 'granted';
  const isDenied = permission === 'denied';
  const isDefault = permission === 'default';

  return {
    permission,
    isSupported,
    isRequesting,
    hasPermission,
    isDenied,
    isDefault,
    requestPermission
  };
}
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { notificationsApi } from '../../utils/api';

interface NotificationContextType {
  unreadCount: number;
  notifications: Notification[];
  markAsRead: (incidentId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

interface Notification {
  id: string;
  incidentId: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const refreshNotifications = async () => {
    try {
      const response = await notificationsApi.getAll();

      if (response.notifications) {
        // Transform database format to frontend format
        const transformedNotifications = response.notifications.map((notif: any) => ({
          id: notif.id,
          incidentId: notif.incident_id,
          message: notif.message,
          timestamp: notif.created_at,
          read: notif.read
        }));

        setNotifications(transformedNotifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  // Load notifications on mount
  useEffect(() => {
    refreshNotifications();

    // Refresh notifications every 30 seconds
    const interval = setInterval(refreshNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (incidentId: string) => {
    try {
      await notificationsApi.markAsRead(incidentId);
      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.incidentId === incidentId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      // Update local state
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      unreadCount,
      notifications,
      markAsRead,
      markAllAsRead,
      refreshNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

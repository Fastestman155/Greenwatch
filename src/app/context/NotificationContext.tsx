import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useIncidents } from './IncidentsContext';

interface NotificationContextType {
  unreadCount: number;
  notifications: Notification[];
  markAsRead: (incidentId: string) => void;
  markAllAsRead: () => void;
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
  const { incidents } = useIncidents();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [lastCheckedCount, setLastCheckedCount] = useState<number>(0);

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('greenwatch-notifications');
    const storedCount = localStorage.getItem('greenwatch-last-checked-count');
    if (stored) {
      setNotifications(JSON.parse(stored));
    }
    if (storedCount) {
      setLastCheckedCount(parseInt(storedCount));
    } else {
      // First time, set to current incident count so no notifications
      setLastCheckedCount(incidents.length);
      localStorage.setItem('greenwatch-last-checked-count', incidents.length.toString());
    }
  }, []);

  // Save to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem('greenwatch-notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Check for new incidents
  useEffect(() => {
    const currentCount = incidents.length;
    
    if (currentCount > lastCheckedCount) {
      // New incidents detected
      const newIncidents = incidents.slice(0, currentCount - lastCheckedCount);
      const newNotifications = newIncidents.map(incident => ({
        id: `notif-${incident.id}`,
        incidentId: incident.id,
        message: `New ${incident.severity.toLowerCase()} severity report: ${incident.type} at ${incident.location}`,
        timestamp: new Date().toISOString(),
        read: false
      }));
      
      setNotifications(prev => [...newNotifications, ...prev]);
    }
    
    setLastCheckedCount(currentCount);
    localStorage.setItem('greenwatch-last-checked-count', currentCount.toString());
  }, [incidents.length]);

  const markAsRead = (incidentId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.incidentId === incidentId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ unreadCount, notifications, markAsRead, markAllAsRead }}>
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

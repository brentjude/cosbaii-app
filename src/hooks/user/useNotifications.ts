// Create: src/hooks/user/useNotifications.ts
import { useState, useEffect, useCallback } from 'react'; // ✅ Added useCallback
import { Notification } from '@/types/notification';

export const useNotifications = (limit: number = 10) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Wrapped fetchNotifications with useCallback
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/notifications?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data.notifications || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [limit]); // ✅ Added limit as dependency

  const markAsRead = async (notificationIds: number[]) => {
    try {
      const response = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds }),
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notification =>
            notificationIds.includes(notification.id)
              ? { ...notification, isRead: true } // ✅ Fixed: use 'isRead' not 'read'
              : notification
          )
        );
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notification => ({ ...notification, isRead: true })) // ✅ Fixed: use 'isRead' not 'read'
        );
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // ✅ Added fetchNotifications to dependency array
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]); // ✅ Now includes fetchNotifications

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};
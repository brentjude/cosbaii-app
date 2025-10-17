import { useState, useEffect, useCallback } from "react";
import { Notification } from "@/types/notification";

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  fetchNotifications: (skip?: number, unreadOnly?: boolean) => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: number) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchNotifications = useCallback(
    async (skip: number = 0, unreadOnly: boolean = false) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          take: "10",
          skip: skip.toString(),
          ...(unreadOnly && { unreadOnly: "true" }),
        });

        const response = await fetch(`/api/user/notifications?${params}`);

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();

        if (skip === 0) {
          setNotifications(data.notifications);
        } else {
          setNotifications((prev) => [...prev, ...data.notifications]);
        }

        setUnreadCount(data.unreadCount);
        setHasMore(data.pagination.hasMore);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      const response = await fetch("/api/user/notifications/mark-read", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark as read");
      }

      // ✅ Changed from 'read' to 'isRead'
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking as read:", err);
      throw err;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch("/api/user/notifications/mark-all-read", {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to mark all as read");
      }

      // ✅ Changed from 'read' to 'isRead'
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );

      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all as read:", err);
      throw err;
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId: number) => {
    try {
      const response = await fetch(
        `/api/user/notifications?id=${notificationId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      setNotifications((prev) => {
        const notification = prev.find((n) => n.id === notificationId);
        // ✅ Changed from 'read' to 'isRead'
        if (notification && !notification.isRead) {
          setUnreadCount((count) => Math.max(0, count - 1));
        }
        return prev.filter((notif) => notif.id !== notificationId);
      });
    } catch (err) {
      console.error("Error deleting notification:", err);
      throw err;
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    await fetchNotifications(0, false);
  }, [fetchNotifications]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    hasMore,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
  };
};
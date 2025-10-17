import { useState, useCallback, useRef, useEffect } from "react";
import { Notification } from "@/types/notification";

interface UseDashboardNotificationsReturn {
  notifications: Notification[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  unreadCount: number;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  loadMore: () => Promise<void>;
}

export const useDashboardNotifications = (
  userId?: string
): UseDashboardNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const pageRef = useRef(0);
  const ITEMS_PER_PAGE = 5;

  const loadNotifications = useCallback(
    async (isInitial = false) => {
      if (isInitial) {
        setLoading(true);
        pageRef.current = 0;
        setNotifications([]);
      } else {
        setLoadingMore(true);
      }

      try {
        const currentPage = isInitial ? 0 : pageRef.current;
        const skip = currentPage * ITEMS_PER_PAGE;

        const response = await fetch(
          `/api/user/notifications?take=${ITEMS_PER_PAGE}&skip=${skip}`
        );

        if (!response.ok) throw new Error("Failed to fetch notifications");

        const data = await response.json();

        if (isInitial) {
          setNotifications(data.notifications);
        } else {
          setNotifications((prev) => [...prev, ...data.notifications]);
        }

        pageRef.current = currentPage + 1;
        const shouldHaveMore = data.notifications.length === ITEMS_PER_PAGE;
        setHasMore(shouldHaveMore);
      } catch (error) {
        console.error("Error loading notifications:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [ITEMS_PER_PAGE]
  );

  useEffect(() => {
    if (userId) {
      loadNotifications(true);
    }
  }, [userId, loadNotifications]);

  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      if (!notificationId || isNaN(Number(notificationId))) {
        console.error("Invalid notification ID:", notificationId);
        throw new Error("Invalid notification ID");
      }

      const response = await fetch("/api/user/notifications/mark-read", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationId: Number(notificationId),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Mark as read failed:", errorData);
        throw new Error(errorData.message || "Failed to mark as read");
      }

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
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

      if (!response.ok) throw new Error("Failed to mark all as read");

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  }, []);

  const loadMore = useCallback(() => {
    return loadNotifications(false);
  }, [loadNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    loading,
    loadingMore,
    hasMore,
    unreadCount,
    markAsRead,
    markAllAsRead,
    loadMore,
  };
};
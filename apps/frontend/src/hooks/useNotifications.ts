import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../stores/auth.store";

export type Notification = {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  postId: string | null;
};

export function useNotifications() {
  const { token } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setNotifications(list);
      setUnreadCount(list.filter((n: Notification) => !n.isRead).length);
    } catch {
      // silent fail
    }
  }, [token]);

  const markAllRead = async () => {
    if (!token) return;
    await fetch(`${import.meta.env.VITE_API_URL}/notifications/read-all`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const markOneRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  // Polling setiap 10 detik
  useEffect(() => {
    fetchNotifications();
    if (!token) return;
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [fetchNotifications, token]);

  return { notifications, unreadCount, fetchNotifications, markAllRead, markOneRead };
}
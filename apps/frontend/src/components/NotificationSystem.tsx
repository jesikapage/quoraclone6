import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function NotificationSystem({ currentUserId }: { currentUserId: string }) {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!currentUserId) return;

    // Koneksi ke WebSocket ElysiaJS
    const ws = new WebSocket(`ws://localhost:3000/ws/notifications?userId=${currentUserId}`);

    ws.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      
      // Tampilkan popup notifikasi instan
      const message = newNotification.type === "LIKE" 
        ? "Seseorang menyukai postingan Anda!" 
        : "Seseorang mengomentari postingan Anda!";

      toast.success(message, { 
        duration: 4000,
        style: { border: '1px solid #DEE0E1', padding: '16px' }
      });

      setNotifications((prev: any) => [newNotification, ...prev]);
    };

    return () => ws.close();
  }, [currentUserId]);

  return <Toaster position="top-right" />;
}
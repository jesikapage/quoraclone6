import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { Bell } from 'lucide-react';

const C = {
  bg: "#181919", surface: "#262626", border: "#333333",
  textPrimary: "#e2e2e2", textSecondary: "#939598", textMuted: "#636466",
  blue: "#2B69D1", red: "#B92B27",
};
const FONT = "-apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff} detik lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

type Notification = {
  id: string; message: string; isRead: boolean; createdAt: string; postId: string | null;
};

export default function Notifikasi() {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetch(`${import.meta.env.VITE_API_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, [token]);

  const markAllRead = async () => {
    if (!token) return;
    await fetch(`${import.meta.env.VITE_API_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: FONT }}>
      {/* Navbar simpel */}
      <header style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '0 16px', height: 50, display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 50 }}>
        <Link to="/" style={{ color: C.red, fontWeight: 900, fontSize: 22, textDecoration: 'none' }}>Quora</Link>
        <span style={{ color: C.textPrimary, fontWeight: 600, fontSize: 15 }}>Notifikasi</span>
        <div style={{ marginLeft: 'auto' }}>
          <Link to="/" style={{ color: C.blue, fontSize: 13, textDecoration: 'none' }}>← Beranda</Link>
        </div>
      </header>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: 16 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell size={20} color={C.textPrimary} />
            <h1 style={{ color: C.textPrimary, fontSize: 18, fontWeight: 700, margin: 0 }}>Notifikasi</h1>
            {unreadCount > 0 && (
              <span style={{ background: C.red, color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 100 }}>
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              style={{ color: C.blue, background: 'none', border: 'none', fontSize: 13, cursor: 'pointer', fontFamily: FONT }}>
              Tandai semua dibaca
            </button>
          )}
        </div>

        {/* List */}
        {loading ? (
          <p style={{ color: C.textMuted, textAlign: 'center', padding: 48 }}>Memuat...</p>
        ) : notifications.length === 0 ? (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: 48, textAlign: 'center' }}>
            <Bell size={32} color={C.textMuted} style={{ margin: '0 auto 12px' }} />
            <p style={{ color: C.textMuted, fontSize: 15 }}>Belum ada notifikasi.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => notif.postId && navigate(`/posts/${notif.postId}`)}
                style={{
                  background: notif.isRead ? C.surface : '#1a2a4a',
                  border: `1px solid ${notif.isRead ? C.border : C.blue}`,
                  borderRadius: 4, padding: '12px 16px',
                  cursor: notif.postId ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                }}
              >
                <Bell size={16} color={notif.isRead ? C.textMuted : C.blue} style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ color: notif.isRead ? C.textSecondary : C.textPrimary, fontSize: 14, margin: 0 }}>
                    {notif.message}
                  </p>
                  <p style={{ color: C.textMuted, fontSize: 12, margin: '4px 0 0' }}>{timeAgo(notif.createdAt)}</p>
                </div>
                {!notif.isRead && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.blue, flexShrink: 0, marginTop: 4 }} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
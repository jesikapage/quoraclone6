import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import { useNotifications } from "../hooks/useNotifications";
import Navbar from "../components/Navbar";
import { Bell, MoreHorizontal, Settings, X } from "lucide-react";

const C = {
  bg: "#181818", surface: "#242424", surfaceHover: "#2d2d2d",
  border: "#393939", textPrimary: "#D5D6D7", textSecondary: "#B1B3B6",
  textMuted: "#87898c", red: "#b92b27", redBg: "#b92b271a", blue: "#3A7AEF",
};
const FONT = "-apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff} detik lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

function NotifItem({ notif, onNavigate, onMarkRead }: {
  notif: any;
  onNavigate: (postId: string | null) => void;
  onMarkRead: (id: string) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!showMenu) return;
    const close = () => setShowMenu(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [showMenu]);

  return (
    <div
      style={{
        position: "relative", display: "flex", gap: 12,
        padding: "14px 16px", borderBottom: `1px solid ${C.border}`,
        background: !notif.isRead
          ? `linear-gradient(90deg, ${C.redBg} 0%, transparent 100%)`
          : hovered ? C.surfaceHover : "transparent",
        cursor: "pointer", transition: "background 0.15s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onNavigate(notif.postId)}
    >
      {/* Unread dot */}
      {!notif.isRead && (
        <div style={{
          position: "absolute", left: 4, top: "50%",
          transform: "translateY(-50%)", width: 7, height: 7,
          borderRadius: "50%", background: C.red,
        }} />
      )}

      {/* Icon */}
      <div style={{
        width: 40, height: 40, borderRadius: "50%",
        background: C.blue, display: "flex", alignItems: "center",
        justifyContent: "center", flexShrink: 0,
      }}>
        <Bell size={18} color="#fff" />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: FONT, fontSize: 15, fontWeight: !notif.isRead ? 700 : 400,
          color: C.textPrimary, margin: "0 0 4px", lineHeight: 1.4,
        }}>
          {notif.message}
        </p>
        <p style={{ fontFamily: FONT, fontSize: 12, color: C.textMuted, margin: 0 }}>
          {timeAgo(notif.createdAt)}
          {notif.postId && (
            <span style={{ color: C.blue, marginLeft: 8 }}>· Lihat postingan →</span>
          )}
        </p>
      </div>

      {/* Menu */}
      <div
        style={{ flexShrink: 0, alignSelf: "flex-start", position: "relative" }}
        onClick={(e) => { e.stopPropagation(); setShowMenu((v) => !v); }}
      >
        <button style={{ background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", padding: "4px 6px", borderRadius: 3 }}>
          <MoreHorizontal size={18} />
        </button>
        {showMenu && (
          <div style={{
            position: "absolute", right: 0, top: 32, background: C.surface,
            border: `1px solid ${C.border}`, borderRadius: 4, zIndex: 20,
            minWidth: 200, boxShadow: "0 4px 16px rgba(0,0,0,0.55)", overflow: "hidden",
          }} onClick={(e) => e.stopPropagation()}>
            {!notif.isRead && (
              <button
                onClick={() => { onMarkRead(notif.id); setShowMenu(false); }}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 16px", fontFamily: FONT, fontSize: 14, color: C.textPrimary, background: "none", border: "none", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "none")}
              >
                Tandai Sudah Dibaca
              </button>
            )}
            <button
              onClick={() => setShowMenu(false)}
              style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 16px", fontFamily: FONT, fontSize: 14, color: C.textMuted, background: "none", border: "none", cursor: "pointer" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "none")}
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Notifications() {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const { notifications, unreadCount, markAllRead, markOneRead } = useNotifications();
  const [search, setSearch] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token]);

  const handleNavigate = (postId: string | null) => {
    if (postId) navigate(`/posts/${postId}`);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT, paddingBottom: 64 }}>
      <Navbar search={search} onSearchChange={setSearch} />

      {showSettings && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setShowSettings(false)}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: 32, maxWidth: 400, width: "100%" }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontFamily: FONT, fontSize: 17, fontWeight: 700, color: C.textPrimary }}>Setelan Notifikasi</h2>
              <button onClick={() => setShowSettings(false)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            <p style={{ fontFamily: FONT, fontSize: 14, color: C.textMuted }}>
              Kamu akan mendapat notifikasi saat ada yang mengomentari postinganmu.
            </p>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "16px 12px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Bell size={20} color={C.textPrimary} />
            <h1 style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: C.textPrimary, margin: 0 }}>
              Notifikasi
            </h1>
            {unreadCount > 0 && (
              <span style={{ background: C.red, color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 100 }}>
                {unreadCount}
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{ background: "none", border: "none", fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C.textSecondary, cursor: "pointer" }}>
                Tandai Semua Dibaca
              </button>
            )}
            <button onClick={() => setShowSettings(true)} style={{ background: "none", border: "none", color: C.textSecondary, cursor: "pointer", padding: 4, display: "flex" }}>
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* List */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, overflow: "hidden" }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 24px" }}>
              <Bell size={52} color={C.textMuted} style={{ margin: "0 auto 16px" }} />
              <p style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: C.textPrimary, margin: "0 0 8px" }}>
                Belum Ada Notifikasi
              </p>
              <p style={{ fontFamily: FONT, fontSize: 14, color: C.textMuted }}>
                Notifikasi akan muncul saat ada yang mengomentari postinganmu.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <NotifItem
                key={notif.id}
                notif={notif}
                onNavigate={handleNavigate}
                onMarkRead={markOneRead}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
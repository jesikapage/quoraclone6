import { useState } from "react";
import { useAuthStore } from "../stores/auth.store";
import { useNavigate, Link } from "react-router-dom";
import {
  Home, BookOpen, PenLine, Rocket, Bell,
  Search, ChevronDown, Globe,
} from "lucide-react";

const C = {
  bg: "#181919",
  surface: "#262626",
  surfaceHover: "#2f2f2f",
  border: "#333333",
  textPrimary: "#e2e2e2",
  textSecondary: "#939598",
  red: "#B92B27",
};

const FONT = "-apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans', Ubuntu, Cantarell, 'Helvetica Neue', Oxygen-Sans, sans-serif";

const NAV_ITEMS = [
  { to: "/",           icon: Home,     label: "Beranda" },
  { to: "/mengikuti",  icon: BookOpen, label: "Mengikuti" },
  { to: "/jawab",      icon: PenLine,  label: "Jawab" },
  { to: "/ruang",      icon: Rocket,   label: "Ruang" },
  { to: "/notifikasi", icon: Bell,     label: "Notifikasi" },
];

export default function Navbar() {
  const { user: authUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("/");

  const user = authUser ?? {
    name: "Prilia",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=Prilia",
  };

  const handleLogout = () => {
    try { logout(); navigate("/login"); } catch { navigate("/"); }
  };

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: C.surface, borderBottom: `1px solid ${C.border}`, height: 50 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 16px", height: "100%", display: "flex", alignItems: "center", gap: 8 }}>

        <Link to="/" style={{ color: C.red, fontWeight: 900, fontSize: 22, textDecoration: "none", letterSpacing: -1, flexShrink: 0, marginRight: 4, fontFamily: FONT }}>
          Quora
        </Link>

        <nav style={{ display: "flex", alignItems: "center", height: 50 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.to;
            const Icon = item.icon;
            return (
              <button
                key={item.to}
                onClick={() => setActiveNav(item.to)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  padding: "0 12px", height: "100%",
                  borderBottom: isActive ? `2px solid ${C.red}` : "2px solid transparent",
                  borderTop: "none", borderLeft: "none", borderRight: "none",
                  color: isActive ? C.red : C.textSecondary,
                  background: "none",
                  fontFamily: FONT, fontSize: 11, fontWeight: 500,
                  cursor: "pointer", gap: 2, transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                <Icon size={20} color={isActive ? C.red : C.textSecondary} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div style={{ flex: 1, maxWidth: 220, position: "relative", marginLeft: 8 }}>
          <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.textSecondary }} />
          <input
            type="search"
            placeholder="Cari Quora"
            style={{
              width: "100%", background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: 3, padding: "6px 12px 6px 30px", fontSize: 15,
              color: C.textPrimary, outline: "none", boxSizing: "border-box",
              fontFamily: FONT,
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <img
            src={user.avatarUrl ?? ""}
            alt="avatar"
            style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${C.border}`, cursor: "pointer" }}
          />
          <Globe size={20} style={{ color: C.textSecondary, cursor: "pointer" }} />
          <button
            onClick={handleLogout}
            style={{
              fontFamily: FONT, fontSize: 15, fontWeight: 500,
              color: C.textSecondary, border: `1px solid ${C.border}`, borderRadius: 3,
              padding: "5px 10px", background: C.surface, cursor: "pointer",
            }}
          >
            Keluar
          </button>
          <button
            style={{
              display: "flex", alignItems: "center", gap: 4,
              background: C.red, color: "#fff", border: "none", borderRadius: 3,
              padding: "6px 12px",
              fontFamily: FONT,
              fontSize: 15, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            Tambah pertanyaan <ChevronDown size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}
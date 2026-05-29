import { useAuthStore } from "../stores/auth.store";
import { useNavigate, Link } from "react-router-dom";
import {
  Home, BookOpen, PenLine, Rocket, Bell,
  Search, ChevronDown, Globe, Plus,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const C = {
  bg: "#181919",
  surface: "#262626",
  surfaceHover: "#2f2f2f",
  dropdown: "#2a2a2a",
  border: "#333333",
  borderLight: "#3a3a3a",
  textPrimary: "#e2e2e2",
  textSecondary: "#939598",
  textMuted: "#636466",
  red: "#B92B27",
  blue: "#3A7AEF",
};

const FONT = "-apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans', Ubuntu, Cantarell, 'Helvetica Neue', Oxygen-Sans, sans-serif";

const NAV_ITEMS = [
  { to: "/",           icon: Home,     label: "Beranda" },
  { to: "/mengikuti",  icon: BookOpen, label: "Mengikuti" },
  { to: "/jawab",      icon: PenLine,  label: "Jawab" },
  { to: "/ruang",      icon: Rocket,   label: "Ruang" },
  { to: "/notifikasi", icon: Bell,     label: "Notifikasi" },
];

// ── Data topik & postingan yang bisa dicari ────────────────────────────────
const SEARCH_DATA = [
  { type: "topik",    icon: "💻", label: "Topik",    name: "Teknologi & Pemrograman" },
  { type: "topik",    icon: "🤖", label: "Topik",    name: "Kecerdasan Buatan (AI)" },
  { type: "topik",    icon: "🌍", label: "Topik",    name: "Bahasa Indonesia" },
  { type: "topik",    icon: "🎮", label: "Topik",    name: "Game & Esports" },
  { type: "topik",    icon: "📚", label: "Topik",    name: "Pendidikan & Ilmu Pengetahuan" },
  { type: "topik",    icon: "🏥", label: "Topik",    name: "Kesehatan & Kedokteran" },
  { type: "topik",    icon: "💰", label: "Topik",    name: "Bisnis & Keuangan" },
  { type: "topik",    icon: "🎬", label: "Topik",    name: "Film & Hiburan" },
  { type: "topik",    icon: "🚀", label: "Topik",    name: "Luar Angkasa & Astronomi" },
  { type: "topik",    icon: "🦁", label: "Topik",    name: "Alam & Satwa Liar" },
  { type: "postingan", icon: "❓", label: "Postingan", name: "Apa tips belajar pemrograman yang efektif?" },
  { type: "postingan", icon: "❓", label: "Postingan", name: "Bagaimana cara kerja AI sebenarnya?" },
  { type: "postingan", icon: "❓", label: "Postingan", name: "Apa makanan paling sehat untuk dikonsumsi setiap hari?" },
  { type: "postingan", icon: "❓", label: "Postingan", name: "Bagaimana pengalaman belajar bahasa asing?" },
  { type: "postingan", icon: "❓", label: "Postingan", name: "Game apa yang sedang populer tahun ini?" },
  { type: "pengguna", icon: "👤", label: "Pengguna", name: "Ahmad Rizky" },
  { type: "pengguna", icon: "👤", label: "Pengguna", name: "Sari Dewi" },
  { type: "pengguna", icon: "👤", label: "Pengguna", name: "Budi Santoso" },
];

// ── Komponen Search Dropdown ──────────────────────────────────────────────
function SearchBar({ search, onSearchChange }: { search: string; onSearchChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // Filter hasil berdasarkan query
  const query = search.trim().toLowerCase();
  const results = query.length === 0
    ? SEARCH_DATA.slice(0, 6)  // Default: tampilkan 6 topik populer
    : SEARCH_DATA.filter(d => d.name.toLowerCase().includes(query)).slice(0, 7);

  const showDropdown = open && (query.length > 0 || focused);

  return (
    <div ref={wrapRef} style={{ flex: 1, maxWidth: 420, minWidth: 180, position: "relative", marginLeft: 8 }}>
      {/* Input */}
      <Search
        size={13}
        style={{
          position: "absolute", left: 10, top: "50%",
          transform: "translateY(-50%)", color: C.textSecondary, pointerEvents: "none",
        }}
      />
      <input
        ref={inputRef}
        type="text"
        placeholder="Cari postingan atau pengguna..."
        value={search}
        onChange={(e) => { onSearchChange(e.target.value); setOpen(true); }}
        onFocus={() => { setOpen(true); setFocused(true); }}
        style={{
          width: "100%", background: C.bg, border: `1px solid ${focused ? C.blue : C.border}`,
          borderRadius: focused ? "3px 3px 0 0" : 3,
          padding: "6px 12px 6px 30px", fontSize: 13,
          color: C.textPrimary, outline: "none",
          boxSizing: "border-box", fontFamily: FONT,
          transition: "border-color 0.15s",
        }}
      />

      {/* Dropdown */}
      {showDropdown && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: C.dropdown, border: `1px solid ${C.border}`,
          borderTop: "none", borderRadius: "0 0 4px 4px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          zIndex: 999, overflow: "hidden",
        }}>
          {/* Baris "Cari: [query]" */}
          {query.length > 0 && (
            <div
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", cursor: "pointer",
                borderBottom: `1px solid ${C.borderLight}`,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.surfaceHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Search size={14} color={C.textSecondary} />
              <span style={{ fontSize: 13, color: C.textPrimary, fontFamily: FONT }}>
                Cari: <strong style={{ color: C.blue }}>{search}</strong>
              </span>
            </div>
          )}

          {/* Judul section */}
          {results.length > 0 && (
            <div style={{ padding: "6px 14px 2px", fontSize: 11, color: C.textMuted, fontFamily: FONT, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {query.length === 0 ? "Topik Populer" : "Hasil"}
            </div>
          )}

          {/* Hasil pencarian */}
          {results.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 14px", cursor: "pointer",
                borderBottom: i < results.length - 1 ? `1px solid ${C.borderLight}` : "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.surfaceHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              onClick={() => { onSearchChange(item.name); setOpen(false); inputRef.current?.blur(); }}
            >
              <span style={{ fontSize: 16, flexShrink: 0, width: 22, textAlign: "center" }}>{item.icon}</span>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: 11, color: C.textMuted, fontFamily: FONT }}>
                  {item.label}:{" "}
                </span>
                <span style={{ fontSize: 13, color: C.textPrimary, fontFamily: FONT }}>
                  {query.length > 0
                    ? highlightMatch(item.name, query)
                    : item.name}
                </span>
              </div>
            </div>
          ))}

          {/* Tidak ada hasil */}
          {results.length === 0 && query.length > 0 && (
            <div style={{ padding: "12px 14px", fontSize: 13, color: C.textMuted, fontFamily: FONT }}>
              Tidak ada hasil untuk "<strong style={{ color: C.textPrimary }}>{search}</strong>"
            </div>
          )}

          {/* Tambahkan pertanyaan baru */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", cursor: "pointer",
              borderTop: `1px solid ${C.borderLight}`,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.surfaceHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Plus size={16} color={C.blue} />
            <span style={{ fontSize: 13, color: C.blue, fontFamily: FONT, fontWeight: 600 }}>
              Tambahkan Pertanyaan Baru
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Highlight teks yang cocok dengan query
function highlightMatch(text: string, query: string): React.ReactNode {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <strong style={{ color: C.blue }}>{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </>
  );
}

// ── Main Navbar ──────────────────────────────────────────────────────────────
interface NavbarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function Navbar({ search, onSearchChange }: NavbarProps) {
  const { user: authUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("/");

  const user = authUser ?? { name: "Guest", avatar: null };

  const initials = user.name
    .split(" ")
    .map((w: string) => w[0] || "")
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

  const handleLogout = () => { logout(); navigate("/login"); };
  const handleNavClick = (to: string) => { setActiveNav(to); navigate(to); };

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: C.surface, borderBottom: `1px solid ${C.border}`, height: 56 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: "100%", display: "flex", alignItems: "center", gap: 12 }}>

        {/* Logo */}
        <Link
          to="/"
          style={{
            color: "#b92b27", fontWeight: 900, fontSize: 26, textDecoration: "none",
            letterSpacing: "-0.5px", flexShrink: 0, marginRight: 4,
            fontFamily: "Georgia, 'Times New Roman', serif", lineHeight: 1,
          }}
        >
          Qoora
        </Link>

        {/* Nav items */}
        <nav style={{ display: "flex", alignItems: "center", height: 50 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.to;
            const Icon = item.icon;
            return (
              <button
                key={item.to}
                onClick={() => handleNavClick(item.to)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  padding: "0 12px", height: "100%",
                  borderBottom: isActive ? `2px solid ${C.red}` : "2px solid transparent",
                  borderTop: "none", borderLeft: "none", borderRight: "none",
                  color: isActive ? C.red : C.textSecondary,
                  background: "none", fontFamily: FONT, fontSize: 11, fontWeight: 500,
                  cursor: "pointer", gap: 2, transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
              >
                <Icon size={20} color={isActive ? C.red : C.textSecondary} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Search dengan dropdown */}
        <SearchBar search={search} onSearchChange={onSearchChange} />

        {/* Kanan: avatar + nama + tombol */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <div
            onClick={() => navigate("/profile/edit")}
            style={{
              width: 32, height: 32, borderRadius: "50%",
              border: `1px solid ${C.border}`, cursor: "pointer",
              overflow: "hidden", flexShrink: 0, background: "#3A7AEF",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {user.avatar ? (
              <img src={user.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <span style={{ fontSize: 12, fontWeight: 800, color: "#fff", fontFamily: FONT, lineHeight: 1, userSelect: "none" }}>
                {initials}
              </span>
            )}
          </div>
          <span style={{ fontFamily: FONT, fontSize: 14, color: C.textPrimary, fontWeight: 500 }}>{user.name}</span>
          <Globe size={20} style={{ color: C.textSecondary, cursor: "pointer" }} />
          {authUser ? (
            <button
              onClick={handleLogout}
              style={{ fontFamily: FONT, fontSize: 15, fontWeight: 500, color: C.textSecondary, border: `1px solid ${C.border}`, borderRadius: 3, padding: "5px 10px", background: C.surface, cursor: "pointer" }}
            >
              Keluar
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              style={{ fontFamily: FONT, fontSize: 15, fontWeight: 500, color: C.textSecondary, border: `1px solid ${C.border}`, borderRadius: 3, padding: "5px 10px", background: C.surface, cursor: "pointer" }}
            >
              Masuk
            </button>
          )}
          <button
            onClick={() => authUser ? null : navigate("/login")}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              background: C.red, color: "#fff", border: "none", borderRadius: 3,
              padding: "6px 12px", fontFamily: FONT, fontSize: 15, fontWeight: 500,
              cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            Tambah pertanyaan <ChevronDown size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}
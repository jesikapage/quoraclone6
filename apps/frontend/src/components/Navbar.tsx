import { useAuthStore } from "../stores/auth.store";
import { useNavigate, Link } from "react-router-dom";
import {
  Home, BookOpen, PenLine, Rocket, Bell,
  Search, ChevronDown, Globe, Plus, X, Menu,
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

const FONT = "-apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

const NAV_ITEMS = [
  { to: "/",           icon: Home,     label: "Beranda" },
  { to: "/mengikuti",  icon: BookOpen, label: "Mengikuti" },
  { to: "/jawab",      icon: PenLine,  label: "Jawab" },
  { to: "/ruang",      icon: Rocket,   label: "Ruang" },
  { to: "/notifikasi", icon: Bell,     label: "Notifikasi" },
];

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

// ── Search Dropdown ────────────────────────────────────────────────────────
function SearchBar({ search, onSearchChange, onClose }: {
  search: string;
  onSearchChange: (v: string) => void;
  onClose?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const query = search.trim().toLowerCase();
  const results = query.length === 0
    ? SEARCH_DATA.slice(0, 6)
    : SEARCH_DATA.filter(d => d.name.toLowerCase().includes(query)).slice(0, 7);

  const showDropdown = open && (query.length > 0 || focused);

  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%" }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <Search size={13} style={{ position: "absolute", left: 10, color: C.textSecondary, pointerEvents: "none", flexShrink: 0 }} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Cari..."
          value={search}
          onChange={(e) => { onSearchChange(e.target.value); setOpen(true); }}
          onFocus={() => { setOpen(true); setFocused(true); }}
          style={{
            width: "100%", background: C.bg,
            border: `1px solid ${focused ? C.blue : C.border}`,
            borderRadius: showDropdown ? "4px 4px 0 0" : 4,
            padding: "7px 12px 7px 30px", fontSize: 13,
            color: C.textPrimary, outline: "none",
            boxSizing: "border-box", fontFamily: FONT,
          }}
        />
        {onClose && (
          <button onClick={onClose} style={{ position: "absolute", right: 8, background: "none", border: "none", color: C.textSecondary, cursor: "pointer", padding: 2, display: "flex" }}>
            <X size={14} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: C.dropdown, border: `1px solid ${C.border}`,
          borderTop: "none", borderRadius: "0 0 4px 4px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)", zIndex: 9999, overflow: "hidden",
        }}>
          {query.length > 0 && (
            <div
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", borderBottom: `1px solid ${C.borderLight}` }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.surfaceHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Search size={14} color={C.textSecondary} />
              <span style={{ fontSize: 13, color: C.textPrimary, fontFamily: FONT }}>
                Cari: <strong style={{ color: C.blue }}>{search}</strong>
              </span>
            </div>
          )}

          {results.length > 0 && (
            <div style={{ padding: "6px 14px 2px", fontSize: 11, color: C.textMuted, fontFamily: FONT, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {query.length === 0 ? "Topik Populer" : "Hasil"}
            </div>
          )}

          {results.map((item, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", cursor: "pointer", borderBottom: i < results.length - 1 ? `1px solid ${C.borderLight}` : "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.surfaceHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              onClick={() => { onSearchChange(item.name); setOpen(false); inputRef.current?.blur(); }}
            >
              <span style={{ fontSize: 16, flexShrink: 0, width: 22, textAlign: "center" }}>{item.icon}</span>
              <div style={{ minWidth: 0, overflow: "hidden" }}>
                <span style={{ fontSize: 11, color: C.textMuted, fontFamily: FONT }}>{item.label}: </span>
                <span style={{ fontSize: 13, color: C.textPrimary, fontFamily: FONT }}>
                  {query.length > 0 ? highlightMatch(item.name, query) : item.name}
                </span>
              </div>
            </div>
          ))}

          {results.length === 0 && query.length > 0 && (
            <div style={{ padding: "12px 14px", fontSize: 13, color: C.textMuted, fontFamily: FONT }}>
              Tidak ada hasil untuk "<strong style={{ color: C.textPrimary }}>{search}</strong>"
            </div>
          )}

          <div
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", borderTop: `1px solid ${C.borderLight}` }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.surfaceHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Plus size={16} color={C.blue} />
            <span style={{ fontSize: 13, color: C.blue, fontFamily: FONT, fontWeight: 600 }}>Tambahkan Pertanyaan Baru</span>
          </div>
        </div>
      )}
    </div>
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const user = authUser ?? { name: "Guest", avatar: null };
  const initials = user.name.split(" ").map((w: string) => w[0] || "").slice(0, 2).join("").toUpperCase() || "?";

  const handleLogout = () => { logout(); navigate("/login"); setMobileMenuOpen(false); };
  const handleNavClick = (to: string) => { setActiveNav(to); navigate(to); setMobileMenuOpen(false); };

  return (
    <>
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: C.surface, borderBottom: `1px solid ${C.border}`, height: 52 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 12px", height: "100%", display: "flex", alignItems: "center", gap: 4 }}>

          {/* Logo */}
          <Link to="/" style={{ color: "#b92b27", fontWeight: 900, fontSize: 24, textDecoration: "none", letterSpacing: "-0.5px", flexShrink: 0, fontFamily: "Georgia, 'Times New Roman', serif", lineHeight: 1, marginRight: 4 }}>
            Qoora
          </Link>

          {/* Nav items — hidden on mobile */}
          <nav className="nav-desktop" style={{ display: "flex", alignItems: "center", height: 52 }}>
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.to;
              const Icon = item.icon;
              return (
                <button
                  key={item.to}
                  onClick={() => handleNavClick(item.to)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    padding: "0 10px", height: "100%",
                    borderBottom: isActive ? `2px solid ${C.red}` : "2px solid transparent",
                    borderTop: "none", borderLeft: "none", borderRight: "none",
                    color: isActive ? C.red : C.textSecondary,
                    background: "none", fontFamily: FONT, fontSize: 10, fontWeight: 500,
                    cursor: "pointer", gap: 1, transition: "background 0.15s", whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                >
                  <Icon size={18} color={isActive ? C.red : C.textSecondary} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Search — hidden on mobile when not active */}
          <div className="search-desktop" style={{ flex: 1, maxWidth: 380, minWidth: 0, marginLeft: 8 }}>
            <SearchBar search={search} onSearchChange={onSearchChange} />
          </div>

          {/* Mobile: search icon */}
          <button
            className="search-mobile-btn"
            onClick={() => setMobileSearchOpen(true)}
            style={{ display: "none", background: "none", border: "none", color: C.textSecondary, cursor: "pointer", padding: 6 }}
          >
            <Search size={20} />
          </button>

          {/* Right side */}
          <div className="right-desktop" style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
            {/* Avatar */}
            <div
              onClick={() => navigate("/profile/edit")}
              style={{ width: 30, height: 30, borderRadius: "50%", border: `1px solid ${C.border}`, cursor: "pointer", overflow: "hidden", flexShrink: 0, background: "#3A7AEF", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {user.avatar ? (
                <img src={user.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              ) : (
                <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", fontFamily: FONT, lineHeight: 1, userSelect: "none" }}>{initials}</span>
              )}
            </div>
            <span className="name-desktop" style={{ fontFamily: FONT, fontSize: 13, color: C.textPrimary, fontWeight: 500, whiteSpace: "nowrap" }}>{user.name}</span>
            <Globe size={18} style={{ color: C.textSecondary, cursor: "pointer", flexShrink: 0 }} />
            {authUser ? (
              <button onClick={handleLogout} style={{ fontFamily: FONT, fontSize: 13, fontWeight: 500, color: C.textSecondary, border: `1px solid ${C.border}`, borderRadius: 3, padding: "4px 8px", background: C.surface, cursor: "pointer", whiteSpace: "nowrap" }}>Keluar</button>
            ) : (
              <button onClick={() => navigate("/login")} style={{ fontFamily: FONT, fontSize: 13, fontWeight: 500, color: C.textSecondary, border: `1px solid ${C.border}`, borderRadius: 3, padding: "4px 8px", background: C.surface, cursor: "pointer" }}>Masuk</button>
            )}
            <button
              style={{ display: "flex", alignItems: "center", gap: 3, background: C.red, color: "#fff", border: "none", borderRadius: 3, padding: "5px 10px", fontFamily: FONT, fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}
            >
              Tambah <ChevronDown size={12} />
            </button>
          </div>

          {/* Mobile: hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: "none", background: "none", border: "none", color: C.textSecondary, cursor: "pointer", padding: 6, marginLeft: "auto" }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile search overlay */}
      {mobileSearchOpen && (
        <div className="mobile-search-overlay" style={{ position: "fixed", top: 52, left: 0, right: 0, background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "10px 12px", zIndex: 99 }}>
          <SearchBar search={search} onSearchChange={onSearchChange} onClose={() => setMobileSearchOpen(false)} />
        </div>
      )}

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer" style={{ position: "fixed", top: 52, left: 0, right: 0, bottom: 0, background: C.surface, zIndex: 98, overflowY: "auto" }}>
          {/* Avatar + nama */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 16px 12px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#3A7AEF", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
              {user.avatar
                ? <img src={user.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: 15, fontWeight: 800, color: "#fff", fontFamily: FONT }}>{initials}</span>
              }
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.textPrimary, fontFamily: FONT }}>{user.name}</p>
              <p style={{ margin: 0, fontSize: 12, color: C.textSecondary, fontFamily: FONT }}>Lihat profil</p>
            </div>
          </div>

          {/* Nav items */}
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.to;
            return (
              <button
                key={item.to}
                onClick={() => handleNavClick(item.to)}
                style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", textAlign: "left", padding: "14px 16px", border: "none", borderBottom: `1px solid ${C.border}`, background: isActive ? "#3A7AEF18" : "none", color: isActive ? C.blue : C.textPrimary, fontFamily: FONT, fontSize: 14, cursor: "pointer" }}
              >
                <Icon size={20} color={isActive ? C.blue : C.textSecondary} />
                {item.label}
              </button>
            );
          })}

          {/* Divider + aksi */}
          <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={() => { navigate("/profile/edit"); setMobileMenuOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", border: "none", background: "none", color: C.textPrimary, fontFamily: FONT, fontSize: 14, cursor: "pointer", borderBottom: `1px solid ${C.border}` }}
            >
              👤 Edit Profil
            </button>
            <button
              style={{ display: "flex", alignItems: "center", gap: 4, background: C.red, color: "#fff", border: "none", borderRadius: 4, padding: "10px 16px", fontFamily: FONT, fontSize: 14, fontWeight: 600, cursor: "pointer", justifyContent: "center", marginTop: 4 }}
            >
              <Plus size={16} /> Tambah Pertanyaan
            </button>
            {authUser
              ? <button onClick={handleLogout} style={{ padding: "10px 16px", border: `1px solid ${C.border}`, borderRadius: 4, background: "none", color: C.textSecondary, fontFamily: FONT, fontSize: 14, cursor: "pointer" }}>Keluar</button>
              : <button onClick={() => { navigate("/login"); setMobileMenuOpen(false); }} style={{ padding: "10px 16px", border: `1px solid ${C.border}`, borderRadius: 4, background: "none", color: C.textSecondary, fontFamily: FONT, fontSize: 14, cursor: "pointer" }}>Masuk</button>
            }
          </div>
        </div>
      )}

      <style>{`
        /* Desktop (≥768px): tampilkan semua elemen navbar */
        .nav-desktop { display: flex !important; }
        .search-desktop { display: block !important; }
        .right-desktop { display: flex !important; }
        .search-mobile-btn { display: none !important; }
        .mobile-menu-btn { display: none !important; }
        .name-desktop { display: inline !important; }

        /* Mobile (<768px): sembunyikan desktop elements, tampilkan mobile */
        @media (max-width: 767px) {
          .nav-desktop { display: none !important; }
          .search-desktop { display: none !important; }
          .right-desktop { display: none !important; }
          .search-mobile-btn { display: flex !important; }
          .mobile-menu-btn { display: flex !important; }
        }

        /* Tablet (768px – 1023px): sembunyikan nama user dan kurangi elemen */
        @media (min-width: 768px) and (max-width: 1023px) {
          .name-desktop { display: none !important; }
        }
      `}</style>
    </>
  );
}
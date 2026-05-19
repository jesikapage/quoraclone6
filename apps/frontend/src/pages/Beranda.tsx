import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/auth.store";
import { useNavigate, Link } from "react-router-dom";
import {
  Home, BookOpen, PenLine, Rocket, Bell,
  Search, ChevronDown, ThumbsUp, ThumbsDown,
  MessageCircle, Repeat2, MoreHorizontal, X,
  Plus, Globe, HelpCircle, Send,
} from "lucide-react";

type Post = {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  user: {
    name: string;
    avatar_url: string;
  };
};

// Dark mode color tokens
const C = {
  bg: "#181919",
  surface: "#262626",
  surfaceHover: "#2f2f2f",
  border: "#333333",
  textPrimary: "#e2e2e2",
  textSecondary: "#939598",
  textMuted: "#636466",
  red: "#B92B27",
  blue: "#2B69D1",
  blueHover: "#1a4fa0",
};

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff} detik lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(137);

  return (
    <article
      style={{
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        padding: "16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
        marginBottom: "24px",
        borderRadius: "4px",
      }}
    >
      {/* Author */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img
            src={post.user.avatar_url}
            alt={post.user.name}
            style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${C.border}`, flexShrink: 0 }}
          />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontWeight: 600, fontSize: 14,
                color: C.textPrimary, cursor: "pointer",
              }}>
                {post.user.name}
              </span>
              <span style={{ color: C.textMuted, fontSize: 13 }}>·</span>
              <span style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontWeight: 500, fontSize: 13,
                color: C.blue, cursor: "pointer",
              }}>
                Ikuti
              </span>
            </div>
            {/* Caption / User Bio — Inter 13px */}
            <p style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 13, color: C.textSecondary,
              lineHeight: 1.4, margin: 0,
            }}>
              {timeAgo(post.created_at)}
            </p>
          </div>
        </div>
        <button style={{ color: C.textMuted, background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <X size={18} />
        </button>
      </div>

      {/* Question / Judul Post — Inter 18px Bold */}
      <h2 style={{
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 18, fontWeight: 700,
        color: C.textPrimary, lineHeight: 1.3,
        margin: "8px 0", cursor: "pointer",
      }}>
        {post.content}
      </h2>

      {/* Body / Answer Text — Georgia serif 15px */}
      <p style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: 15, fontWeight: 400,
        color: C.textSecondary, lineHeight: 1.6,
        margin: "8px 0",
      }}>
        Klik untuk membaca jawaban selengkapnya...
      </p>

      {/* Gambar */}
      {post.image_url && (
        <img
          src={post.image_url}
          alt="post"
          style={{
            width: "100%", maxHeight: 256, objectFit: "cover",
            borderRadius: 4, marginBottom: 12,
            border: `1px solid ${C.border}`,
          }}
        />
      )}

      {/* Action Bar — Inter 13px */}
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 8, display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
        <div style={{ display: "flex", borderRadius: 100, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          <button
            onClick={() => { setLiked((p) => !p); setLikeCount((p) => (liked ? p - 1 : p + 1)); }}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 12px",
              background: liked ? "#1a2a4a" : C.surface,
              color: liked ? C.blue : C.textSecondary,
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 13, fontWeight: 500,
              border: "none", borderRight: `1px solid ${C.border}`,
              cursor: "pointer",
            }}
          >
            <ThumbsUp size={14} /> Dukung Naik · {likeCount}
          </button>
          <button
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "5px 10px", background: C.surface,
              color: C.textSecondary, border: "none", cursor: "pointer",
            }}
          >
            <ThumbsDown size={14} />
          </button>
        </div>

        <Link
          to={`/komentar/${post.id}`}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "5px 12px", borderRadius: 100,
            border: `1px solid ${C.border}`,
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 13, fontWeight: 500, color: C.textSecondary,
            textDecoration: "none",
          }}
        >
          <MessageCircle size={14} /> Komentar
        </Link>

        <button
          style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "5px 12px", borderRadius: 100,
            border: `1px solid ${C.border}`, background: C.surface,
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 13, fontWeight: 500, color: C.textSecondary,
            cursor: "pointer",
          }}
        >
          <Repeat2 size={14} /> Bagikan
        </button>

        <button style={{ marginLeft: "auto", color: C.textMuted, background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <MoreHorizontal size={18} />
        </button>
      </div>
    </article>
  );
}

function FeedTabs({ avatarUrl }: { avatarUrl: string }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 4, marginBottom: 24,
      boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
        <img src={avatarUrl} alt="avatar" style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Apa yang ingin Anda tanyakan atau bagikan?"
          readOnly
          style={{
            flex: 1, border: "none", outline: "none", background: "transparent",
            fontFamily: "Inter, system-ui, sans-serif", fontSize: 15,
            color: C.textMuted, cursor: "pointer",
          }}
        />
      </div>
      <div style={{ display: "flex" }}>
        {[
          { icon: <HelpCircle size={16} />, label: "Tanya" },
          { icon: <PenLine size={16} />, label: "Jawab" },
          { icon: <Send size={16} />, label: "Kiriman" },
        ].map((item, i) => (
          <button
            key={item.label}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "10px 0",
              borderLeft: i > 0 ? `1px solid ${C.border}` : "none",
              background: C.surface, border: "none",
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 14, fontWeight: 500,
              color: C.textSecondary, cursor: "pointer",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.surface; }}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const LEFT_TOPICS = [
  { label: "Bahasa Inggris", img: "https://images.unsplash.com/photo-1543872084-c7bd3822856f?w=100&q=80" },
  { label: "Budaya populer", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&q=80" },
  { label: "Pendidikan",     img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=100&q=80" },
  { label: "Kesehatan",      img: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=100&q=80" },
  { label: "Musik",          img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&q=80" },
  { label: "Teknologi",      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&q=80" },
];

const DUMMY_POSTS: Post[] = [
  {
    id: "101",
    content: "Bagaimana cara mengoptimalkan penggunaan AWS Lambda untuk backend aplikasi skala besar?",
    image_url: null,
    created_at: "2026-05-16T12:00:00Z",
    user: { name: "Rito Backend Developer", avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Rito" },
  },
  {
    id: "102",
    content: "Desain Quora Clone kita terlihat sangat responsif menggunakan Tailwind CSS!",
    image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500",
    created_at: "2026-05-16T14:30:00Z",
    user: { name: "Prilia UI/UX", avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Prilia" },
  },
];

const NAV_ITEMS = [
  { to: "/",           icon: Home,     label: "Beranda" },
  { to: "/mengikuti",  icon: BookOpen, label: "Mengikuti" },
  { to: "/jawab",      icon: PenLine,  label: "Jawab" },
  { to: "/ruang",      icon: Rocket,   label: "Ruang" },
  { to: "/notifikasi", icon: Bell,     label: "Notifikasi" },
];

const FOOTER_LINKS = [
  "Tentang Quora", "Ketentuan", "Privasi",
  "Penggunaan Dapat Diterima", "Beriklan",
  "Karier", "Pers", "Perusahaan",
];

export default function Beranda() {
  const { user: authUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeNav, setActiveNav] = useState("/");

  const user = authUser ?? {
    name: "Prilia",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=Prilia",
  };

  useEffect(() => {
    setPosts(DUMMY_POSTS);
  }, []);

  const handleLogout = () => {
    try { logout(); navigate("/login"); } catch { navigate("/"); }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* NAVBAR — tinggi 50px sticky */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: C.surface, borderBottom: `1px solid ${C.border}`, height: 50 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 16px", height: "100%", display: "flex", alignItems: "center", gap: 8 }}>

          {/* Logo */}
          <Link to="/" style={{ color: C.red, fontWeight: 900, fontSize: 22, textDecoration: "none", letterSpacing: -1, flexShrink: 0, marginRight: 4 }}>
            Quora
          </Link>

          {/* Nav — Navigation/Tabs Inter 13px Medium */}
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
                    fontFamily: "Inter, system-ui, sans-serif", fontSize: 11, fontWeight: 500,
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

          {/* Search Bar */}
          <div style={{ flex: 1, maxWidth: 220, position: "relative", marginLeft: 8 }}>
            <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.textSecondary }} />
            <input
              type="search"
              placeholder="Cari Quora"
              style={{
                width: "100%", background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: 3, padding: "6px 12px 6px 30px", fontSize: 14,
                color: C.textPrimary, outline: "none", boxSizing: "border-box",
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            />
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
            <img
              src={user.avatarUrl}
              alt="avatar"
              style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${C.border}`, cursor: "pointer" }}
            />
            <Globe size={20} style={{ color: C.textSecondary, cursor: "pointer" }} />
            <button
              onClick={handleLogout}
              style={{
                fontFamily: "Inter, system-ui, sans-serif", fontSize: 13, fontWeight: 500,
                color: C.textSecondary, border: `1px solid ${C.border}`, borderRadius: 3,
                padding: "5px 10px", background: C.surface, cursor: "pointer",
              }}
            >
              Keluar
            </button>
            {/* Button Text — Inter 14px Medium */}
            <button
              style={{
                display: "flex", alignItems: "center", gap: 4,
                background: C.red, color: "#fff", border: "none", borderRadius: 3,
                padding: "6px 12px",
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 14, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap",
              }}
            >
              Tambah pertanyaan <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* BODY — max 1000px */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "16px", display: "flex", gap: 24 }}>

        {/* Sidebar Kiri */}
        <aside style={{ width: 180, flexShrink: 0 }} className="lg-sidebar">
          <button
            style={{
              display: "flex", alignItems: "center", gap: 8, width: "100%",
              padding: "8px 12px", borderRadius: 3, border: "none",
              background: "none", cursor: "pointer",
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 13, fontWeight: 500,
              color: C.textPrimary, textAlign: "left",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
          >
            <Plus size={16} color={C.textSecondary} /> Buat Ruang
          </button>

          <p style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 11, color: C.textMuted, fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.05em",
            padding: "12px 12px 4px",
          }}>
            Topik
          </p>

          {LEFT_TOPICS.map((topic) => {
            return (
              <button
                key={topic.label}
                style={{
                  display: "flex", alignItems: "center", gap: 8, width: "100%",
                  padding: "8px 12px", borderRadius: 3, border: "none",
                  background: "none", cursor: "pointer",
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: 13, color: C.textPrimary, textAlign: "left",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
              >
                <img
                  src={topic.img}
                  alt={topic.label}
                  style={{ width: 28, height: 28, borderRadius: 4, objectFit: "cover", flexShrink: 0, border: `1px solid ${C.border}` }}
                />
                {topic.label}
              </button>
            );
          })}

          <div style={{ marginTop: 24, padding: "0 12px" }}>
          <p style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.6, margin: 0 }}>
            {FOOTER_LINKS.map((l, i) => (
              <span key={l}>
                <a href="#" style={{ color: C.textMuted, textDecoration: "none" }}>{l}</a>
                {i < FOOTER_LINKS.length - 1 && <span> · </span>}
              </span>
            ))}
          </p>
          <p style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>© 2025 Quora</p>
        </div>
        </aside>

        {/* Feed Tengah — max 570px */}
        <main style={{ flex: 1, minWidth: 0, maxWidth: 570 }}>
          <FeedTabs avatarUrl={user.avatarUrl} />
          <div>
            {/* TODO (Fadjri): ganti dengan data dari API */}
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </main>

        {/* Sidebar Kanan */}
        <aside style={{ width: 180, flexShrink: 0 }} className="right-sidebar">
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: 16, textAlign: "center" }}>
            <p style={{ fontSize: 12, color: C.textMuted }}>Ruang iklan</p>
          </div>
        </aside>
      </div>

      <style>{`
        .lg-sidebar { display: none; }
        .right-sidebar { display: none; }
        @media (min-width: 1024px) {
          .lg-sidebar { display: block; }
          .right-sidebar { display: block; }
        }
        input[type="search"]::-webkit-search-cancel-button { display: none; }
        input::placeholder { color: #636466; }
      `}</style>
    </div>
  );
}
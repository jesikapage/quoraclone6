import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../stores/auth.store";
import { useNavigate, Link, useLocation } from "react-router-dom"; // 👈 Ditambahkan useLocation di sini
import { toast, Toaster } from "sonner"; // 👈 1. Import Sonner untuk pop-up selamat datang
import CreatePost from "./CreatePost";
import { useNavigate, Link } from "react-router-dom";
import {
  Home, BookOpen, PenLine, Rocket, Bell,
  Search, ChevronDown, ThumbsUp, ThumbsDown,
  MessageCircle, Repeat2, MoreHorizontal, X,
  Plus, Globe, HelpCircle, Send, TrendingUp,
  Bookmark, Share2, Flag, EyeOff, UserPlus,
  ChevronUp,
} from "lucide-react";

type Post = {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  user: {
    name: string;
    avatar_url: string;
    credential?: string;
  };
};

const IconUpvote = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);
const IconDownvote = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IconComment = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const IconShare = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconHome = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);
const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const IconPencil = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconDots = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
  </svg>
);
// ──────────────────────────────────────────────────────────────────────────

export default function Beranda() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation(); // 👈 Ambil data lokasi router saat ini
  const [posts, setPosts] = useState<Post[]>([]);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeNav, setActiveNav] = useState("home");

  // 👈 2. Efek untuk menangkap data dari halaman Login & memicu Sonner Toast
  useEffect(() => {
    if (location.state?.fromLogin) {
      const namaUser = user?.name || "Pengguna";
      
      // Munculkan pop-up selamat datang estetik
      toast.success(`Selamat Datang, ${namaUser}!`, {
        description: "Anda berhasil masuk ke Quora Clone.",
        duration: 4000,
      });

      // Bersihkan state agar notif tidak muncul berkali-kali jika user me-refresh beranda
      window.history.replaceState({}, document.title);
    }
  }, [location, user]);

  useEffect(() => {
    const dummyPosts: Post[] = [
      {
        id: "101",
        content: "Bagaimana cara mengoptimalkan penggunaan AWS Lambda untuk backend aplikasi skala besar?",
        image_url: null,
        created_at: "2026-05-16T12:00:00Z",
        user: {
          name: "Rito Backend Developer",
          avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Rito",
          credential: "Software Engineer · AWS Certified",
        },
        upvotes: 9400,
        comments: 288,
        shares: 279,
        upvotedBy: [],
        downvotedBy: [],
        sharedBy: [],
      },
      {
        id: "102",
        content: "Desain Dark Mode Quora Clone kita malam ini terlihat sangat responsif menggunakan Tailwind CSS!",
        image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500",
        created_at: "2026-05-16T14:30:00Z",
        user: {
          name: "Prilia UI/UX",
          avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Prilia",
          credential: "UI/UX Designer · Figma Expert",
        },
        upvotes: 7,
        comments: 3,
        shares: 1,
        upvotedBy: [],
        downvotedBy: [],
        sharedBy: [],
      },
    ];
    setPosts(dummyPosts);
  }, []);
// System font stack sesuai permintaan
const FONT = `-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", Ubuntu, Cantarell, "Helvetica Neue", Oxygen-Sans, sans-serif`;

const C = {
  bg: "#f7f7f8",
  surface: "#ffffff",
  surfaceHover: "#f7f7f8",
  border: "#dee0e1",
  borderHover: "#c4c7c8",
  textPrimary: "#282829",
  textSecondary: "#636466",
  textMuted: "#939598",
  red: "#B92B27",
  redHover: "#9e2422",
  blue: "#2B69D1",
  blueHover: "#1c5bbf",
  blueBg: "#ebf0ff",
  activeNav: "#282829",
};

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff} dtk`;
  if (diff < 3600) return `${Math.floor(diff / 60)} mnt`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} j`;
  return `${Math.floor(diff / 86400)} hr`;
}

// ─── Tooltip ───────────────────────────────────────────────────────────────
function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 6px)", left: "50%",
          transform: "translateX(-50%)",
          background: "#282829", color: "#fff",
          fontSize: 11, fontFamily: FONT,
          padding: "4px 8px", borderRadius: 3,
          whiteSpace: "nowrap", pointerEvents: "none",
          zIndex: 999,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}>
          {text}
          <div style={{
            position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
            borderWidth: "4px 4px 0", borderStyle: "solid",
            borderColor: "#282829 transparent transparent",
          }} />
        </div>
      )}
    </div>
  );
}

// ─── PostCard ──────────────────────────────────────────────────────────────
function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(137);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    if (showMenu) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [showMenu]);

  function handleLike() {
    if (liked) { setLiked(false); setLikeCount(p => p - 1); }
    else { setLiked(true); setDisliked(false); setLikeCount(p => p + 1); }
  }
  function handleDislike() {
    if (disliked) { setDisliked(false); }
    else { setDisliked(true); setLiked(false); setLikeCount(p => liked ? p - 1 : p); }
  }

  return (
    <div className="min-h-screen bg-[#181919] text-[#e2e2e2] font-sans">
      
      {/* 👈 3. WAJIB Taruh Toaster di paling atas return untuk merender pop-up-nya */}
      <Toaster position="top-right" theme="dark" closeButton RICH-COLORS />
  if (dismissed) return null;

  const BODY_TEXT = "Klik untuk membaca jawaban selengkapnya tentang topik ini. Temukan perspektif unik dari para ahli dan komunitas Quora Indonesia yang aktif berdiskusi setiap hari.";

  return (
    <article style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 4,
      marginBottom: 8,
      transition: "box-shadow 0.15s",
      position: "relative",
    }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
    >
      <div style={{ padding: "12px 16px 0" }}>
        {/* Author row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <img
              src={post.user.avatar_url}
              alt={post.user.name}
              style={{
                width: 40, height: 40, borderRadius: "50%",
                border: `1px solid ${C.border}`, flexShrink: 0,
                cursor: "pointer",
              }}
            />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{
                  fontFamily: FONT, fontWeight: 600, fontSize: 15,
                  color: C.textPrimary, cursor: "pointer",
                  lineHeight: 1.3,
                }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = "underline"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = "none"; }}
                >
                  {post.user.name}
                </span>
                <button
                  onClick={() => setIsFollowing(p => !p)}
                  style={{
                    fontFamily: FONT, fontWeight: 600, fontSize: 13,
                    color: isFollowing ? C.textSecondary : C.blue,
                    background: "none", border: "none", cursor: "pointer",
                    padding: 0, display: "flex", alignItems: "center", gap: 3,
                    transition: "color 0.15s",
                  }}
                >
                  {isFollowing ? null : <UserPlus size={12} />}
                  {isFollowing ? "Mengikuti" : "Ikuti"}
                </button>
              </div>
              <p style={{ fontFamily: FONT, fontSize: 13, color: C.textSecondary, margin: 0, lineHeight: 1.4 }}>
                {post.user.credential || "Kontributor Quora"} · {timeAgo(post.created_at)}
              </p>
            </div>
          </div>

          {/* Top-right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
            <Tooltip text="Simpan">
              <button
                onClick={() => setIsSaved(p => !p)}
                style={{
                  color: isSaved ? C.blue : C.textSecondary,
                  background: "none", border: "none", cursor: "pointer",
                  padding: "4px 6px", borderRadius: 3,
                  display: "flex", alignItems: "center",
                  transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
              >
                <Bookmark size={16} fill={isSaved ? C.blue : "none"} />
              </button>
            </Tooltip>

            {/* Overflow menu */}
            <div style={{ position: "relative" }} ref={menuRef}>
              <button
                onClick={() => setShowMenu(p => !p)}
                style={{
                  color: C.textSecondary, background: "none", border: "none",
                  cursor: "pointer", padding: "4px 6px", borderRadius: 3,
                  display: "flex", alignItems: "center",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
              >
                <MoreHorizontal size={18} />
              </button>

              {showMenu && (
                <div style={{
                  position: "absolute", top: "calc(100% + 4px)", right: 0,
                  background: C.surface, border: `1px solid ${C.border}`,
                  borderRadius: 4, boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                  minWidth: 200, zIndex: 100,
                  overflow: "hidden",
                }}>
                  {[
                    { icon: <EyeOff size={15} />, label: "Sembunyikan postingan" },
                    { icon: <UserPlus size={15} />, label: isFollowing ? "Berhenti mengikuti" : "Ikuti pengguna" },
                    { icon: <Flag size={15} />, label: "Laporkan" },
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (item.label === "Sembunyikan postingan") setDismissed(true);
                        if (item.label.includes("Ikuti") || item.label.includes("Berhenti")) setIsFollowing(p => !p);
                        setShowMenu(false);
                      }}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 10,
                        padding: "10px 14px", border: "none", background: "none",
                        fontFamily: FONT, fontSize: 14, color: C.textPrimary,
                        cursor: "pointer", textAlign: "left",
                        transition: "background 0.1s",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
                    >
                      <span style={{ color: C.textSecondary }}>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setDismissed(true)}
              style={{
                color: C.textSecondary, background: "none", border: "none",
                cursor: "pointer", padding: "4px 6px", borderRadius: 3,
                display: "flex", alignItems: "center",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Judul / Pertanyaan */}
        <h2 style={{
          fontFamily: FONT, fontSize: 20, fontWeight: 700,
          color: C.textPrimary, lineHeight: 1.3,
          margin: "0 0 6px", cursor: "pointer",
          transition: "color 0.15s",
        }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = C.blue; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = C.textPrimary; }}
        >
          {post.content}
        </h2>

        {/* Body */}
        <div style={{ overflow: "hidden", maxHeight: expanded ? "none" : 72, transition: "max-height 0.3s ease" }}>
          <p style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: 15, color: C.textSecondary, lineHeight: 1.65,
            margin: "0 0 8px",
          }}>
            {BODY_TEXT}
          </p>
        </div>
        <button
          onClick={() => setExpanded(p => !p)}
          style={{
            fontFamily: FONT, fontSize: 13, fontWeight: 600,
            color: C.blue, background: "none", border: "none",
            cursor: "pointer", padding: 0, marginBottom: 10,
            display: "flex", alignItems: "center", gap: 3,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = C.blueHover; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = C.blue; }}
        >
          {expanded ? <><ChevronUp size={13} /> Sembunyikan</> : <>Lihat selengkapnya</>}
        </button>

        {/* Image */}
        {post.image_url && (
          <div style={{
            marginBottom: 12, borderRadius: 4, overflow: "hidden",
            border: `1px solid ${C.border}`,
          }}>
            <img
              src={post.image_url}
              alt="post"
              style={{ width: "100%", maxHeight: 280, objectFit: "cover", display: "block", cursor: "pointer" }}
            />
          </div>
        )}
      </div>

      {/* ── Action Bar ── */}
      <div style={{
        borderTop: `1px solid ${C.border}`,
        padding: "6px 16px",
        display: "flex", alignItems: "center", gap: 4,
      }}>
        {/* Upvote/Downvote group */}
        <div style={{
          display: "flex", borderRadius: 100,
          border: `1px solid ${C.border}`, overflow: "hidden",
        }}>
          <Tooltip text="Dukung naik">
            <button
              onClick={handleLike}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "6px 12px",
                background: liked ? C.blueBg : C.surface,
                color: liked ? C.blue : C.textSecondary,
                fontFamily: FONT, fontSize: 13, fontWeight: 600,
                border: "none", borderRight: `1px solid ${C.border}`,
                cursor: "pointer", transition: "all 0.15s",
                userSelect: "none",
              }}
              onMouseEnter={(e) => {
                if (!liked) (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = liked ? C.blueBg : C.surface;
              }}
            >
              Taimbahkan pertanyaan atau tautan
              <ThumbsUp size={14} fill={liked ? C.blue : "none"} />
              Dukung Naik · {likeCount}
            </button>
          </Tooltip>
          <Tooltip text="Turunkan">
            <button
              onClick={handleDislike}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "6px 10px",
                background: disliked ? "#fff5f5" : C.surface,
                color: disliked ? C.red : C.textSecondary,
                border: "none", cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!disliked) (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = disliked ? "#fff5f5" : C.surface;
              }}
            >
              <ThumbsDown size={14} fill={disliked ? C.red : "none"} />
            </button>
          </Tooltip>
        </div>

        {/* Komentar */}
        <Link
          to={`/komentar/${post.id}`}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "6px 12px", borderRadius: 100,
            border: `1px solid ${C.border}`,
            fontFamily: FONT, fontSize: 13, fontWeight: 600,
            color: C.textSecondary, textDecoration: "none",
            background: C.surface, transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = C.surfaceHover;
            (e.currentTarget as HTMLAnchorElement).style.borderColor = C.borderHover;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = C.surface;
            (e.currentTarget as HTMLAnchorElement).style.borderColor = C.border;
          }}
        >
          <MessageCircle size={14} /> Komentar
        </Link>

        {/* Bagikan */}
        <button
          onClick={() => setIsShared(p => !p)}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "6px 12px", borderRadius: 100,
            border: `1px solid ${isShared ? C.blue : C.border}`,
            background: isShared ? C.blueBg : C.surface,
            fontFamily: FONT, fontSize: 13, fontWeight: 600,
            color: isShared ? C.blue : C.textSecondary, cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            if (!isShared) {
              (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover;
              (e.currentTarget as HTMLButtonElement).style.borderColor = C.borderHover;
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = isShared ? C.blueBg : C.surface;
            (e.currentTarget as HTMLButtonElement).style.borderColor = isShared ? C.blue : C.border;
          }}
        >
          <Repeat2 size={14} /> Bagikan
        </button>

        {/* Trending indicator */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, color: C.textMuted }}>
          <TrendingUp size={13} />
          <span style={{ fontFamily: FONT, fontSize: 12 }}>Tren</span>
        </div>
      </div>
    </article>
  );
}

// ─── FeedTabs (Tanya / Jawab / Kiriman) ────────────────────────────────────
function FeedTabs({
  avatarUrl,
  onOpenCreate,
}: {
  avatarUrl: string;
  onOpenCreate: (tab: "question" | "post") => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  const tabs = [
    { icon: <HelpCircle size={16} />, label: "Tanya", action: () => onOpenCreate("question") },
    { icon: <PenLine size={16} />, label: "Jawab", action: () => onOpenCreate("post") },
    { icon: <Send size={16} />, label: "Kiriman", action: () => onOpenCreate("post") },
  ];

  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 4, marginBottom: 8,
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    }}>
      {/* Input row */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 16px",
          borderBottom: `1px solid ${C.border}`,
          cursor: "pointer",
        }}
        onClick={() => onOpenCreate("question")}
      >
        <img
          src={avatarUrl}
          alt="avatar"
          style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, border: `1px solid ${C.border}` }}
        />
        <div style={{
          flex: 1, border: `1px solid ${C.border}`, borderRadius: 3,
          padding: "8px 14px",
          fontFamily: FONT, fontSize: 15, color: C.textMuted,
          transition: "border-color 0.15s",
          background: C.bg,
        }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = C.borderHover; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = C.border; }}
        >
          Apa yang ingin Anda tanyakan atau bagikan?
        </div>
      </div>

      {/* Tab buttons */}
      <div style={{ display: "flex" }}>
        {tabs.map((item, i) => (
          <button
            key={item.label}
            onClick={item.action}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              padding: "10px 0",
              borderLeft: i > 0 ? `1px solid ${C.border}` : "none",
              background: hovered === i ? C.surfaceHover : C.surface,
              border: "none",
              fontFamily: FONT, fontSize: 14, fontWeight: 600,
              color: hovered === i ? C.textPrimary : C.textSecondary,
              cursor: "pointer", transition: "all 0.15s",
            }}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Feed Filter Tabs ───────────────────────────────────────────────────────
function FeedFilter() {
  const [active, setActive] = useState<"untukmu" | "mengikuti">("untukmu");
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 4, marginBottom: 8,
      display: "flex", overflow: "hidden",
    }}>
      {(["untukmu", "mengikuti"] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          style={{
            flex: 1, padding: "10px 0", border: "none",
            borderBottom: active === tab ? `2px solid ${C.textPrimary}` : "2px solid transparent",
            background: C.surface, cursor: "pointer",
            fontFamily: FONT, fontSize: 14, fontWeight: active === tab ? 700 : 500,
            color: active === tab ? C.textPrimary : C.textSecondary,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            if (active !== tab) (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = C.surface;
          }}
        >
          {tab === "untukmu" ? "Untuk Kamu" : "Mengikuti"}
        </button>
      ))}
    </div>
  );
}

// ─── Sidebar Widget ─────────────────────────────────────────────────────────
function TopicWidget() {
  const topics = [
    { label: "Teknologi", count: "12.4rb", emoji: "💻" },
    { label: "Pendidikan", count: "9.2rb", emoji: "📚" },
    { label: "Kesehatan", count: "7.8rb", emoji: "🏥" },
    { label: "Sains", count: "6.1rb", emoji: "🔬" },
    { label: "Bisnis", count: "5.5rb", emoji: "💼" },
  ];

  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 4, marginBottom: 8,
    }}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
        <h3 style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: C.textPrimary, margin: 0 }}>
          Topik Tren Hari Ini
        </h3>
      </div>
      {topics.map((t, i) => (
        <button
          key={t.label}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 16px",
            borderBottom: i < topics.length - 1 ? `1px solid ${C.border}` : "none",
            background: C.surface, border: "none", cursor: "pointer",
            fontFamily: FONT, textAlign: "left",
            transition: "background 0.1s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.surface; }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>{t.emoji}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{t.label}</span>
          </span>
          <span style={{ fontSize: 12, color: C.textMuted }}>{t.count} pengikut</span>
        </button>
      ))}
    </div>
  );
}

// ─── Left Topics Sidebar ────────────────────────────────────────────────────
const LEFT_TOPICS = [
  { label: "Bahasa Inggris", img: "https://images.unsplash.com/photo-1543872084-c7bd3822856f?w=100&q=80" },
  { label: "Budaya Populer", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&q=80" },
  { label: "Pendidikan",     img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=100&q=80" },
  { label: "Kesehatan",      img: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=100&q=80" },
  { label: "Musik",          img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&q=80" },
  { label: "Teknologi",      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&q=80" },
];

const FOOTER_LINKS = [
  "Tentang", "Ketentuan", "Privasi", "Penggunaan Dapat Diterima",
  "Beriklan", "Karier", "Bahasa Indonesia",
];

const DUMMY_POSTS: Post[] = [
  {
    id: "101",
    content: "Bagaimana cara mengoptimalkan penggunaan AWS Lambda untuk backend aplikasi skala besar?",
    image_url: null,
    created_at: "2026-05-16T12:00:00Z",
    user: {
      name: "Rito Backend Developer",
      avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Rito",
      credential: "Software Engineer · 5 th pengalaman",
    },
  },
  {
    id: "102",
    content: "Desain Quora Clone kita terlihat sangat responsif menggunakan Tailwind CSS — apa pendapat kalian?",
    image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500",
    created_at: "2026-05-16T14:30:00Z",
    user: {
      name: "Prilia UI/UX",
      avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Prilia",
      credential: "UI/UX Designer · Bandung",
    },
  },
  {
    id: "103",
    content: "Apa perbedaan utama antara React dan Vue.js untuk proyek startup pada tahun 2026?",
    image_url: null,
    created_at: "2026-05-17T09:15:00Z",
    user: {
      name: "Fadjri Fullstack",
      avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Fadjri",
      credential: "Fullstack Dev · Jakarta",
    },
  },
];

const NAV_ITEMS = [
  { to: "/",           icon: Home,     label: "Beranda" },
  { to: "/mengikuti",  icon: BookOpen, label: "Mengikuti" },
  { to: "/jawab",      icon: PenLine,  label: "Jawab" },
  { to: "/ruang",      icon: Rocket,   label: "Ruang" },
  { to: "/notifikasi", icon: Bell,     label: "Notifikasi" },
];

// ─── Search with instant results ────────────────────────────────────────────
function SearchBar() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const SUGGESTIONS = [
    "Bagaimana cara belajar Python?",
    "Apa itu machine learning?",
    "Tips menjadi programmer handal",
    "Perbedaan AI dan machine learning",
  ];
  const filtered = query
    ? SUGGESTIONS.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div style={{ flex: 1, maxWidth: 240, position: "relative" }}>
      <Search size={13} style={{
        position: "absolute", left: 10, top: "50%",
        transform: "translateY(-50%)", color: C.textSecondary,
        pointerEvents: "none",
      }} />
      <input
        type="search"
        placeholder="Cari Quora"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        style={{
          width: "100%", background: C.bg,
          border: `1px solid ${focused ? C.blue : C.border}`,
          borderRadius: 3, padding: "7px 12px 7px 30px", fontSize: 14,
          color: C.textPrimary, outline: "none", boxSizing: "border-box" as const,
          fontFamily: FONT, transition: "border-color 0.15s",
        }}
      />
      {focused && filtered.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 4, boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          zIndex: 200, overflow: "hidden",
        }}>
          {filtered.map((s, i) => (
            <button key={i}
              onMouseDown={() => setQuery(s)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 8,
                padding: "9px 12px", border: "none", background: "none",
                fontFamily: FONT, fontSize: 13, color: C.textPrimary,
                cursor: "pointer", textAlign: "left",
                borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
            >
              <Search size={12} color={C.textMuted} /> {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Beranda ────────────────────────────────────────────────────────────
export default function Beranda() {
  const { user: authUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeNav, setActiveNav] = useState("/");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifCount] = useState(3);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const user = authUser ?? {
    name: "Prilia",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=Prilia",
  };

  useEffect(() => { setPosts(DUMMY_POSTS); }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node))
        setShowUserMenu(false);
    }
    if (showUserMenu) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [showUserMenu]);

  const handleLogout = () => {
    try { logout(); navigate("/login"); } catch { navigate("/"); }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT, fontSize: 15 }}>

      {/* ── NAVBAR ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        height: 50, boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}>
        <div style={{
          maxWidth: 1060, margin: "0 auto", padding: "0 16px",
          height: "100%", display: "flex", alignItems: "center", gap: 6,
        }}>
          {/* Logo */}
          <Link to="/" style={{
            color: C.red, fontWeight: 900, fontSize: 22,
            textDecoration: "none", letterSpacing: -1,
            flexShrink: 0, marginRight: 4, fontFamily: FONT,
          }}>
            Quora
          </Link>

          {/* Nav */}
          <nav style={{ display: "flex", alignItems: "center", height: 50 }}>
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.to;
              const Icon = item.icon;
              const isNotif = item.to === "/notifikasi";
              return (
                <button
                  key={item.to}
                  onClick={() => setActiveNav(item.to)}
                  style={{
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    padding: "0 10px", height: "100%",
                    borderBottom: isActive ? `3px solid ${C.red}` : "3px solid transparent",
                    borderTop: "none", borderLeft: "none", borderRight: "none",
                    color: isActive ? C.red : C.textSecondary,
                    background: "none", fontFamily: FONT,
                    fontSize: 11, fontWeight: 600,
                    cursor: "pointer", gap: 2,
                    transition: "background 0.15s, color 0.15s",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <Icon size={20} color={isActive ? C.red : C.textSecondary} />
                    {isNotif && notifCount > 0 && (
                      <span style={{
                        position: "absolute", top: -4, right: -4,
                        background: C.red, color: "#fff",
                        fontSize: 9, fontWeight: 700,
                        width: 14, height: 14, borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: `2px solid ${C.surface}`,
                      }}>
                        {notifCount}
                      </span>
                    )}
                  </div>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Search */}
          <SearchBar />

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
            {/* Avatar dropdown */}
            <div style={{ position: "relative" }} ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(p => !p)}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  background: "none", border: "none", cursor: "pointer", padding: 0,
                  borderRadius: "50%",
                }}
              >
                <img
                  src={user.avatarUrl}
                  alt="avatar"
                  style={{
                    width: 34, height: 34, borderRadius: "50%",
                    border: `2px solid ${showUserMenu ? C.blue : C.border}`,
                    transition: "border-color 0.15s",
                  }}
                />
              </button>
              {showUserMenu && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  background: C.surface, border: `1px solid ${C.border}`,
                  borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                  minWidth: 200, zIndex: 200, overflow: "hidden",
                }}>
                  {/* User info */}
                  <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img src={user.avatarUrl} alt="" style={{ width: 40, height: 40, borderRadius: "50%" }} />
                      <div>
                        <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: C.textPrimary, margin: 0 }}>{user.name}</p>
                        <p style={{ fontFamily: FONT, fontSize: 12, color: C.textMuted, margin: 0 }}>Lihat profil saya</p>
                      </div>
                    </div>
                  </div>
                  {[
                    { label: "Profil", to: "/profile" },
                    { label: "Edit Profil", to: "/profile/edit" },
                    { label: "Pengaturan", to: "/settings" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => { navigate(item.to); setShowUserMenu(false); }}
                      style={{
                        width: "100%", display: "block", padding: "10px 14px",
                        border: "none", background: "none",
                        fontFamily: FONT, fontSize: 14, color: C.textPrimary,
                        cursor: "pointer", textAlign: "left",
                        transition: "background 0.1s",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
                    >
                      {item.label}
                    </button>
                  ))}
                  <div style={{ borderTop: `1px solid ${C.border}` }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%", display: "block", padding: "10px 14px",
                        border: "none", background: "none",
                        fontFamily: FONT, fontSize: 14, color: C.red,
                        cursor: "pointer", textAlign: "left",
                        transition: "background 0.1s",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#fff5f5"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
                    >
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Tooltip text="Ganti Bahasa">
              <button style={{
                color: C.textSecondary, background: "none", border: "none",
                cursor: "pointer", padding: 4, borderRadius: 3,
                display: "flex", alignItems: "center",
                transition: "background 0.15s",
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
              >
                <Globe size={18} />
              </button>
            </Tooltip>

            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                background: C.red, color: "#fff", border: "none", borderRadius: 3,
                padding: "7px 13px", fontFamily: FONT, fontSize: 14, fontWeight: 600,
                cursor: "pointer", whiteSpace: "nowrap" as const,
                transition: "background 0.15s",
                boxShadow: "0 1px 3px rgba(185,43,39,0.3)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.redHover; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.red; }}
            >
              Tambah pertanyaan <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* ── BODY ── */}
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "16px 16px", display: "flex", gap: 20 }}>

        {/* ── Left Sidebar ── */}
        <aside style={{ width: 190, flexShrink: 0 }} className="q-left-sidebar">
          <button
            onClick={() => {}}
            style={{
              display: "flex", alignItems: "center", gap: 8, width: "100%",
              padding: "8px 12px", borderRadius: 3, border: "none",
              background: "none", cursor: "pointer",
              fontFamily: FONT, fontSize: 14, fontWeight: 600,
              color: C.textPrimary, textAlign: "left" as const,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
          >
            <Plus size={16} color={C.blue} /> Buat Ruang
          </button>

          <p style={{
            fontFamily: FONT, fontSize: 11, color: C.textMuted,
            fontWeight: 700, textTransform: "uppercase" as const,
            letterSpacing: "0.06em", padding: "12px 12px 4px",
          }}>
            Topik
          </p>

          {LEFT_TOPICS.map((topic) => (
            <button
              key={topic.label}
              style={{
                display: "flex", alignItems: "center", gap: 9, width: "100%",
                padding: "8px 12px", borderRadius: 3, border: "none",
                background: "none", cursor: "pointer",
                fontFamily: FONT, fontSize: 14, color: C.textPrimary,
                textAlign: "left" as const, transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
            >
              <img
                src={topic.img}
                alt={topic.label}
                style={{ width: 30, height: 30, borderRadius: 4, objectFit: "cover", flexShrink: 0, border: `1px solid ${C.border}` }}
              />
              {topic.label}
            </button>
          ))}

          <div style={{ marginTop: 24, padding: "0 12px" }}>
            <p style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>
              {FOOTER_LINKS.map((l, i) => (
                <span key={l}>
                  <a href="#" style={{ color: C.textMuted, textDecoration: "none" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = "underline"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = "none"; }}
                  >
                    {l}
                  </a>
                  {i < FOOTER_LINKS.length - 1 && " · "}
                </span>
              ))}
            </p>
            <p style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>© 2026 Quora, Inc.</p>
          </div>
        </aside>

        {/* ── Main Feed ── */}
        <main style={{ flex: 1, minWidth: 0, maxWidth: 600 }}>
          <FeedTabs avatarUrl={user.avatarUrl} onOpenCreate={() => setShowCreateModal(true)} />
          <FeedFilter />
          <div>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </main>

        {/* ── Right Sidebar ── */}
        <aside style={{ width: 220, flexShrink: 0 }} className="q-right-sidebar">
          <TopicWidget />

          {/* Suggested users widget */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 4,
          }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
              <h3 style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: C.textPrimary, margin: 0 }}>
                Disarankan untuk Diikuti
              </h3>
            </div>
            {[
              { name: "Budi Santoso", seed: "Budi", role: "Data Scientist" },
              { name: "Ani Rahayu", seed: "Ani", role: "Product Manager" },
              { name: "Candra Wijaya", seed: "Candra", role: "DevOps Engineer" },
            ].map((u, i) => {
              const [following, setFollowing] = useState(false);
              return (
                <div
                  key={u.seed}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 16px",
                    borderBottom: i < 2 ? `1px solid ${C.border}` : "none",
                  }}
                >
                  <img
                    src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${u.seed}`}
                    alt={u.name}
                    style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, border: `1px solid ${C.border}` }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C.textPrimary, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {u.name}
                    </p>
                    <p style={{ fontFamily: FONT, fontSize: 12, color: C.textMuted, margin: 0 }}>{u.role}</p>
                  </div>
                  <button
                    onClick={() => setFollowing(p => !p)}
                    style={{
                      flexShrink: 0,
                      fontFamily: FONT, fontSize: 12, fontWeight: 700,
                      color: following ? C.textSecondary : C.blue,
                      border: `1px solid ${following ? C.border : C.blue}`,
                      borderRadius: 100, padding: "4px 10px",
                      background: following ? C.surface : C.blueBg,
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    {following ? "Mengikuti" : "+ Ikuti"}
                  </button>
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      {/* ── Create Post Modal ── */}
      {showCreateModal && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 500,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)",
            padding: 16,
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 4, boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              width: "100%", maxWidth: 560, overflow: "hidden",
              animation: "modalIn 0.18s ease",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* This renders CreatePost — import it in your actual app */}
            <div style={{ padding: 24 }}>
              <p style={{ fontFamily: FONT, fontSize: 15, color: C.textSecondary, textAlign: "center", margin: 0 }}>
                [CreatePost component akan di-render di sini]
              </p>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  display: "block", margin: "16px auto 0",
                  fontFamily: FONT, fontSize: 14, fontWeight: 600,
                  color: C.textSecondary, border: `1px solid ${C.border}`,
                  borderRadius: 100, padding: "7px 20px",
                  background: C.surface, cursor: "pointer",
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .q-left-sidebar { display: none; }
        .q-right-sidebar { display: none; }
        @media (min-width: 768px) { .q-left-sidebar { display: block; } }
        @media (min-width: 1024px) { .q-right-sidebar { display: block; } }
        input[type="search"]::-webkit-search-cancel-button { display: none; }
        input::placeholder, textarea::placeholder { color: #939598; }
        * { box-sizing: border-box; }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(-12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
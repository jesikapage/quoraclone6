import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/auth.store";
import { Link } from "react-router-dom";
import {
  ThumbsUp, ThumbsDown, MessageCircle, Repeat2,
  MoreHorizontal, X, HelpCircle, PenLine, Send,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

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
};

const FONT = "-apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans', Ubuntu, Cantarell, 'Helvetica Neue', Oxygen-Sans, sans-serif";

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
    <article style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.4)", marginBottom: "24px", borderRadius: "4px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img src={post.user.avatar_url} alt={post.user.name} style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${C.border}`, flexShrink: 0 }} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 15, color: C.textPrimary, cursor: "pointer" }}>
                {post.user.name}
              </span>
              <span style={{ color: C.textMuted, fontSize: 15 }}>·</span>
              <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 15, color: C.blue, cursor: "pointer" }}>
                Ikuti
              </span>
            </div>
            <p style={{ fontFamily: FONT, fontSize: 13, color: C.textSecondary, lineHeight: 1.4, margin: 0 }}>
              {timeAgo(post.created_at)}
            </p>
          </div>
        </div>
        <button style={{ color: C.textMuted, background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <X size={18} />
        </button>
      </div>

      <h2 style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: C.textPrimary, lineHeight: 1.3, margin: "8px 0", cursor: "pointer" }}>
        {post.content}
      </h2>

      <p style={{ fontFamily: FONT, fontSize: 15, fontWeight: 400, color: C.textSecondary, lineHeight: 1.6, margin: "8px 0" }}>
        Klik untuk membaca jawaban selengkapnya...
      </p>

      {post.image_url && (
        <img src={post.image_url} alt="post" style={{ width: "100%", maxHeight: 256, objectFit: "cover", borderRadius: 4, marginBottom: 12, border: `1px solid ${C.border}` }} />
      )}

      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 8, display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
        <div style={{ display: "flex", borderRadius: 100, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          <button
            onClick={() => { setLiked((p) => !p); setLikeCount((p) => (liked ? p - 1 : p + 1)); }}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", background: liked ? "#1a2a4a" : C.surface, color: liked ? C.blue : C.textSecondary, fontFamily: FONT, fontSize: 15, fontWeight: 500, border: "none", borderRight: `1px solid ${C.border}`, cursor: "pointer" }}
          >
            <ThumbsUp size={14} /> Dukung Naik · {likeCount}
          </button>
          <button style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "5px 10px", background: C.surface, color: C.textSecondary, border: "none", cursor: "pointer" }}>
            <ThumbsDown size={14} />
          </button>
        </div>

        <Link
          to={`/komentar/${post.id}`}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 100, border: `1px solid ${C.border}`, fontFamily: FONT, fontSize: 15, fontWeight: 500, color: C.textSecondary, textDecoration: "none" }}
        >
          <MessageCircle size={14} /> Komentar
        </Link>

        <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 100, border: `1px solid ${C.border}`, background: C.surface, fontFamily: FONT, fontSize: 15, fontWeight: 500, color: C.textSecondary, cursor: "pointer" }}>
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
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
        <img src={avatarUrl} alt="avatar" style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Apa yang ingin Anda tanyakan atau bagikan?"
          readOnly
          style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: FONT, fontSize: 15, color: C.textMuted, cursor: "pointer" }}
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
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 0", borderLeft: i > 0 ? `1px solid ${C.border}` : "none", background: C.surface, border: "none", fontFamily: FONT, fontSize: 15, fontWeight: 500, color: C.textSecondary, cursor: "pointer" }}
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

export default function Beranda() {
  const { user: authUser } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");

  const user = authUser ?? {
    name: "Prilia",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=Prilia",
  };

  useEffect(() => {
    setPosts(DUMMY_POSTS);
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.content.toLowerCase().includes(search.toLowerCase()) ||
    post.user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT, fontSize: 15 }}>
      <Navbar search={search} onSearchChange={setSearch} />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "16px", display: "flex", gap: 24 }}>

        {/* Sidebar Kiri */}
        <div className="lg-sidebar">
          <Sidebar />
        </div>

        {/* Feed Tengah */}
        <main style={{ flex: 1, minWidth: 0, maxWidth: 570 }}>
          <FeedTabs avatarUrl={user.avatarUrl ?? ""} />

          {search && (
            <p style={{ fontFamily: FONT, fontSize: 13, color: C.textMuted, marginBottom: 12 }}>
              Hasil untuk "<strong style={{ color: C.textSecondary }}>{search}</strong>" — {filteredPosts.length} ditemukan
            </p>
          )}

          <div>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "48px 0", color: C.textMuted }}>
                <p style={{ fontSize: 15, fontFamily: FONT }}>
                  Tidak ada postingan untuk "<strong>{search}</strong>"
                </p>
                <p style={{ fontSize: 13, fontFamily: FONT, marginTop: 8 }}>Coba kata kunci lain</p>
              </div>
            )}
          </div>
        </main>

        {/* Sidebar Kanan */}
        <aside style={{ width: 180, flexShrink: 0 }} className="right-sidebar">
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: 16, textAlign: "center" }}>
            <p style={{ fontSize: 15, color: C.textMuted, fontFamily: FONT }}>Ruang iklan</p>
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
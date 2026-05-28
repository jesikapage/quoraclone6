import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/auth.store";
import { Link, useNavigate } from "react-router-dom";
import { ThumbsUp, ThumbsDown, MessageCircle, Repeat2, MoreHorizontal, X, HelpCircle, PenLine, Send } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

type Post = {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
  _count?: {
    comments: number;
    likes: number;
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
  const { token } = useAuthStore();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post._count?.likes || 0);

  const handleLike = async () => {
    if (!token) return alert("Login dulu untuk like!");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/likes/${post.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLiked(data.liked);
      setLikeCount((p) => data.liked ? p + 1 : p - 1);
    } catch {
      console.error("Gagal like post");
    }
  };

  return (
    <article style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.4)", marginBottom: "24px", borderRadius: "4px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img
            src={post.user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${post.user.name}`}
            alt={post.user.name}
            style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${C.border}`, flexShrink: 0 }}
          />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 15, color: C.textPrimary }}>
                {post.user.name}
              </span>
            </div>
            <p style={{ fontFamily: FONT, fontSize: 13, color: C.textSecondary, lineHeight: 1.4, margin: 0 }}>
              {timeAgo(post.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <h2 style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: C.textPrimary, lineHeight: 1.3, margin: "8px 0" }}>
        {post.content}
      </h2>

      <Link
        to={`/posts/${post.id}`}
        style={{ fontFamily: FONT, fontSize: 15, color: C.blue, lineHeight: 1.6, margin: "8px 0", textDecoration: "none", display: "block" }}
      >
        Klik untuk membaca selengkapnya...
      </Link>

      {post.imageUrl && (
        <img src={post.imageUrl} alt="post" style={{ width: "100%", maxHeight: 256, objectFit: "cover", borderRadius: 4, marginBottom: 12, border: `1px solid ${C.border}` }} />
      )}

      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 8, display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
        <div style={{ display: "flex", borderRadius: 100, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          <button
            onClick={handleLike}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", background: liked ? "#1a2a4a" : C.surface, color: liked ? C.blue : C.textSecondary, fontFamily: FONT, fontSize: 15, fontWeight: 500, border: "none", borderRight: `1px solid ${C.border}`, cursor: "pointer" }}
          >
            <ThumbsUp size={14} /> Dukung · {likeCount}
          </button>
          <button style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "5px 10px", background: C.surface, color: C.textSecondary, border: "none", cursor: "pointer" }}>
            <ThumbsDown size={14} />
          </button>
        </div>

        <Link
          to={`/posts/${post.id}`}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 100, border: `1px solid ${C.border}`, fontFamily: FONT, fontSize: 15, fontWeight: 500, color: C.textSecondary, textDecoration: "none" }}
        >
          <MessageCircle size={14} /> {post._count && post._count.comments > 0 ? `${post._count.comments} Komentar` : "Komentar"}
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

function FeedTabs({ avatarUrl, onOpenModal }: { avatarUrl: string, onOpenModal: () => void }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
        <img src={avatarUrl} alt="avatar" style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Apa yang ingin Anda tanyakan atau bagikan?"
          readOnly
          onClick={onOpenModal}
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
            onClick={onOpenModal}
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

export default function Beranda() {
  const { user: authUser, token } = useAuthStore();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorModal, setErrorModal] = useState("");

  const user = authUser ?? {
    name: "Guest",
    avatar: null,
  };

  const avatarUrl = (user as any).avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`;

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/posts`);
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal mengambil data post", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleOpenModal = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setIsModalOpen(true);
  };

  const handleCreatePost = async () => {
    if (!postContent.trim() || !token) return;
    setIsSubmitting(true);
    setErrorModal("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: postContent }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorModal(data.error || "Gagal memposting.");
        return;
      }
      setPostContent("");
      setIsModalOpen(false);
      fetchPosts();
    } catch {
      setErrorModal("Koneksi ke server gagal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.content.toLowerCase().includes(search.toLowerCase()) ||
    post.user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT, fontSize: 15 }}>
      <Navbar search={search} onSearchChange={setSearch} />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "16px", display: "flex", gap: 24 }}>
        <div className="lg-sidebar"><Sidebar /></div>

        <main style={{ flex: 1, minWidth: 0, maxWidth: 570 }}>
          <FeedTabs avatarUrl={avatarUrl} onOpenModal={handleOpenModal} />

          {search && (
            <p style={{ fontFamily: FONT, fontSize: 13, color: C.textMuted, marginBottom: 12 }}>
              Hasil untuk "<strong style={{ color: C.textSecondary }}>{search}</strong>" — {filteredPosts.length} ditemukan
            </p>
          )}

          <div>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <div style={{ textAlign: "center", padding: "48px 0", color: C.textMuted }}>
                <p style={{ fontSize: 15, fontFamily: FONT }}>Belum ada postingan.</p>
              </div>
            )}
          </div>
        </main>

        <aside style={{ width: 180, flexShrink: 0 }} className="right-sidebar">
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: 16, textAlign: "center" }}>
            <p style={{ fontSize: 15, color: C.textMuted, fontFamily: FONT }}>Ruang iklan</p>
          </div>
        </aside>
      </div>

      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, width: "100%", maxWidth: 600, display: "flex", flexDirection: "column", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img src={avatarUrl} alt="avatar" style={{ width: 40, height: 40, borderRadius: "50%" }} />
                <h2 style={{ fontFamily: FONT, color: C.textPrimary, margin: 0, fontSize: 16, fontWeight: 600 }}>{user.name}</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", padding: 4 }}>
                <X size={24} />
              </button>
            </div>

            {errorModal && (
              <div style={{ background: C.red, color: "#fff", padding: "8px 16px", fontSize: 13, fontFamily: FONT }}>
                {errorModal}
              </div>
            )}

            <div style={{ padding: 16 }}>
              <textarea
                autoFocus
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Apa yang ingin Anda tanyakan atau bagikan?"
                style={{ width: "100%", minHeight: 180, background: "transparent", border: "none", outline: "none", color: C.textPrimary, fontFamily: FONT, fontSize: 18, resize: "none" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", padding: 16, borderTop: `1px solid ${C.border}` }}>
              <button
                onClick={handleCreatePost}
                disabled={isSubmitting || !postContent.trim()}
                style={{ background: isSubmitting || !postContent.trim() ? C.textMuted : C.blue, color: "#fff", border: "none", padding: "8px 20px", borderRadius: 100, fontFamily: FONT, fontWeight: 600, cursor: isSubmitting || !postContent.trim() ? "not-allowed" : "pointer" }}
              >
                {isSubmitting ? "Mengirim..." : "Kirim"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .lg-sidebar { display: none; }
        .right-sidebar { display: none; }
        @media (min-width: 1024px) {
          .lg-sidebar { display: block; }
          .right-sidebar { display: block; }
        }
        input::placeholder { color: #636466; }
      `}</style>
    </div>
  );
}
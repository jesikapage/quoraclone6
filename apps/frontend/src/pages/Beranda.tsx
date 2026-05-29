import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/auth.store";
import { Link, useNavigate } from "react-router-dom";
// Menambahkan icon Edit2 dan Trash2 dari lucide-react
import { ThumbsUp, ThumbsDown, MessageCircle, Repeat2, MoreHorizontal, X, HelpCircle, PenLine, Send, Edit2, Trash2 } from "lucide-react";
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
  bg: "#181818",
  surface: "#242424",
  surfaceHover: "#2d2d2d",
  border: "#393939",
  textPrimary: "#D5D6D7",
  textSecondary: "#B1B3B6",
  textMuted: "#87898c",
  red: "#b92b27",
  blue: "#3A7AEF",
};

const FONT = "-apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans', Ubuntu, Cantarell, 'Helvetica Neue', Oxygen-Sans, sans-serif";

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff} detik lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} hari lalu`;
  return "1bln";
}

// Menambahkan prop currentUser dan fetchPosts
function PostCard({ post, currentUser, fetchPosts }: { post: Post; currentUser: any; fetchPosts: () => void }) {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post._count?.likes || 0);

  // STATE BARU UNTUK EDIT & DELETE
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cek apakah user yang sedang login adalah pemilik postingan
  const isOwner = currentUser?.id === post.user.id;

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah pemicu klik navigasi halaman detail
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

  // FUNGSI HAPUS POSTINGAN
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Yakin ingin menghapus postingan ini?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${post.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchPosts(); 
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menghapus postingan.");
      }
    } catch {
      alert("Koneksi gagal saat menghapus.");
    }
  };

  // FUNGSI UPDATE POSTINGAN
  const handleUpdate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editContent.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${post.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ content: editContent }),
      });
      if (res.ok) {
        setIsEditing(false);
        setShowMenu(false);
        fetchPosts(); 
      } else {
        const data = await res.json();
        alert(data.error || "Gagal memperbarui.");
      }
    } catch {
      alert("Koneksi gagal saat memperbarui.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article 
      onClick={() => {
        // Jangan navigasi jika sedang dalam mode edit
        if (!isEditing) navigate(`/posts/${post.id}`);
      }}
      style={{ 
        background: C.surface, 
        border: `1px solid ${C.border}`, 
        marginBottom: "8px", 
        borderRadius: "4px", 
        padding: "12px 16px",
        cursor: isEditing ? "default" : "pointer",
        transition: "background 0.2s"
      }}
      onMouseEnter={(e) => { if (!isEditing) (e.currentTarget as HTMLElement).style.background = C.surfaceHover; }}
      onMouseLeave={(e) => { if (!isEditing) (e.currentTarget as HTMLElement).style.background = C.surface; }}
    >
      {/* Header Postingan */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
          <img
            src={post.user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${post.user.name}`}
            alt={post.user.name}
            style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
          />
          <div style={{ display: "flex", flexDirection: "column", marginTop: "-2px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>
              <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13, color: C.textPrimary }}>
                {post.user.name}
              </span>
              <span 
                onClick={(e) => e.stopPropagation()} 
                style={{ fontFamily: FONT, fontSize: 13, color: C.blue, fontWeight: 600, cursor: "pointer" }}
              >
                · Ikuti
              </span>
            </div>
            <p style={{ fontFamily: FONT, fontSize: 13, color: C.textSecondary, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "400px" }}>
              S1 di Ilmu Komputer, Universitas Tanjungpura · {timeAgo(post.createdAt)}
            </p>
          </div>
        </div>
        
        {/* LOGIKA DROPDOWN MENU HANYA UNTUK PEMILIK */}
        {isOwner ? (
          <div style={{ position: "relative" }}>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} 
              style={{ background: "transparent", border: "none", color: C.textSecondary, cursor: "pointer", padding: "4px" }}
            >
              <MoreHorizontal size={18} />
            </button>
            
            {showMenu && (
              <div style={{ position: "absolute", right: 0, top: 24, background: "#1c1c1c", border: `1px solid ${C.border}`, borderRadius: 4, padding: "4px", zIndex: 10, width: "120px", boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsEditing(true); setShowMenu(false); }} 
                  style={{ width: "100%", textAlign: "left", padding: "8px 12px", background: "transparent", border: "none", color: C.textPrimary, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontFamily: FONT }}
                >
                  <Edit2 size={14} /> Ubah
                </button>
                <button 
                  onClick={handleDelete} 
                  style={{ width: "100%", textAlign: "left", padding: "8px 12px", background: "transparent", border: "none", color: C.red, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontFamily: FONT }}
                >
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={(e) => { e.stopPropagation(); }}
            style={{ background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", padding: "4px" }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* LOGIKA INLINE EDITING ATAU TAMPILAN NORMAL */}
      {isEditing ? (
        <div style={{ marginBottom: 12 }} onClick={(e) => e.stopPropagation()}>
          <textarea
            autoFocus
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            style={{ width: "100%", minHeight: 80, background: "#181818", border: `1px solid ${C.blue}`, outline: "none", color: C.textPrimary, fontFamily: FONT, fontSize: 15, padding: "8px 12px", borderRadius: 4, resize: "vertical" }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsEditing(false); setEditContent(post.content); }} 
              style={{ background: "transparent", color: C.textSecondary, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
            >
              Batal
            </button>
            <button 
              onClick={handleUpdate} 
              disabled={isSubmitting || editContent === post.content || !editContent.trim()} 
              style={{ background: C.blue, color: "#fff", border: "none", padding: "6px 16px", borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: isSubmitting || editContent === post.content || !editContent.trim() ? "not-allowed" : "pointer", opacity: isSubmitting || editContent === post.content || !editContent.trim() ? 0.5 : 1 }}
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      ) : (
        <p style={{ 
          fontFamily: FONT, 
          fontSize: 15, 
          color: C.textPrimary, 
          lineHeight: 1.6, 
          margin: "8px 0 12px 0", 
          whiteSpace: "pre-wrap",
          display: "-webkit-box", 
          WebkitLineClamp: 4, 
          WebkitBoxOrient: "vertical", 
          overflow: "hidden" 
        }}>
          {post.content}
        </p>
      )}

      {post.imageUrl && (
        <img src={post.imageUrl} alt="post" style={{ width: "100%", maxHeight: 400, objectFit: "cover", borderRadius: 4, marginBottom: 12, border: `1px solid ${C.border}` }} />
      )}

      {/* Action Bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
        <div style={{ display: "flex", alignItems: "center", background: "#2B2D2D", borderRadius: 100, overflow: "hidden", border: `1px solid ${C.border}` }}>
          <button
            onClick={handleLike}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: liked ? "#3A7AEF20" : "transparent", color: liked ? C.blue : C.textSecondary, fontFamily: FONT, fontSize: 13, fontWeight: 600, border: "none", borderRight: `1px solid ${C.border}`, cursor: "pointer" }}
          >
            <ThumbsUp size={16} fill={liked ? C.blue : "none"} /> Dukung · {likeCount}
          </button>
          <button 
            onClick={(e) => e.stopPropagation()}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "6px 10px", background: "transparent", color: C.textSecondary, border: "none", cursor: "pointer" }}
          >
            <ThumbsDown size={16} />
          </button>
        </div>

        <div
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 100, fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C.textSecondary }}
        >
          <MessageCircle size={16} /> {post._count?.comments || 0} Komentar
        </div>

        <button 
          onClick={(e) => e.stopPropagation()}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 100, border: "none", background: "transparent", fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C.textSecondary, cursor: "pointer" }}
        >
          <Repeat2 size={16} /> {Math.floor(Math.random() * 20)}
        </button>

        <button 
          onClick={(e) => e.stopPropagation()}
          style={{ marginLeft: "auto", color: C.textSecondary, background: "transparent", border: "none", cursor: "pointer", padding: "6px" }}
        >
          {/* Ikon MoreHorizontal default disembunyikan untuk owner, karena owner pakai menu dropdown di header */}
          {!isOwner && <MoreHorizontal size={18} />}
        </button>
      </div>
    </article>
  );
}

function FeedTabs({ avatarUrl, onOpenModal }: { avatarUrl: string, onOpenModal: () => void }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, marginBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px" }}>
        <img src={avatarUrl} alt="avatar" style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, objectFit: "cover" }} />
        <div
          onClick={onOpenModal}
          style={{ flex: 1, background: "#181818", border: `1px solid ${C.border}`, borderRadius: 100, padding: "8px 16px", cursor: "text", display: "flex", alignItems: "center" }}
        >
          <span style={{ fontFamily: FONT, fontSize: 14, color: C.textMuted }}>Apa yang ingin Anda tanyakan atau bagikan?</span>
        </div>
      </div>
      <div style={{ display: "flex", padding: "0 8px 8px 8px" }}>
        {[
          { icon: <HelpCircle size={18} />, label: "Tanya" },
          { icon: <PenLine size={18} />, label: "Jawab" },
          { icon: <Send size={18} />, label: "Kiriman" },
        ].map((item) => (
          <button
            key={item.label}
            onClick={onOpenModal}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "8px 0", borderRadius: 100, background: "transparent", border: "none", fontFamily: FONT, fontSize: 14, fontWeight: 600, color: C.textSecondary, cursor: "pointer" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
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
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT, fontSize: 15, paddingBottom: 64 }}>
      <Navbar search={search} onSearchChange={setSearch} />

      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "24px 16px", display: "flex", gap: 24 }}>
        <div className="lg-sidebar" style={{ width: 140, flexShrink: 0 }}><Sidebar /></div>

        <main style={{ flex: 1, minWidth: 0, maxWidth: 570 }}>
          <FeedTabs avatarUrl={avatarUrl} onOpenModal={handleOpenModal} />

          {search && (
            <p style={{ fontFamily: FONT, fontSize: 13, color: C.textMuted, marginBottom: 12, padding: "0 16px" }}>
              Hasil untuk "<strong style={{ color: C.textSecondary }}>{search}</strong>" — {filteredPosts.length} ditemukan
            </p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
            {filteredPosts.length > 0 ? (
              // Mengoper currentUser dan fetchPosts ke PostCard
              filteredPosts.map((post) => <PostCard key={post.id} post={post} currentUser={user} fetchPosts={fetchPosts} />)
            ) : (
              <div style={{ textAlign: "center", padding: "48px 0", color: C.textMuted, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4 }}>
                <p style={{ fontSize: 15, fontFamily: FONT }}>Belum ada postingan.</p>
              </div>
            )}
          </div>
        </main>

        <aside style={{ width: 280, flexShrink: 0 }} className="right-sidebar">
          {/* Sisi kanan diseimbangkan */}
        </aside>
      </div>

      {/* Modal Posting */}
      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, width: "100%", maxWidth: 600, display: "flex", flexDirection: "column", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img src={avatarUrl} alt="avatar" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
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
                style={{ background: isSubmitting || !postContent.trim() ? "#444" : C.blue, color: isSubmitting || !postContent.trim() ? "#888" : "#fff", border: "none", padding: "8px 20px", borderRadius: 100, fontFamily: FONT, fontWeight: 600, cursor: isSubmitting || !postContent.trim() ? "not-allowed" : "pointer" }}
              >
                {isSubmitting ? "Mengirim..." : "Tambah pertanyaan"}
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
        input::placeholder { color: #87898c; }
      `}</style>
    </div>
  );
}
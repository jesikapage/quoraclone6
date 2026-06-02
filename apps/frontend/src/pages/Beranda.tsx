import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../stores/auth.store";
import { useNavigate } from "react-router-dom";
import { useImageUpload } from "../hooks/useImageUpload";
import { ThumbsUp, ThumbsDown, MessageCircle, MoreHorizontal, X, HelpCircle, PenLine, Send, Edit2, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CreatePost from "../pages/CreatePost";

type Post = {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
    credential: string | null;
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

// ── Modal Edit Post ──────────────────────────────────────────────────────────
function EditPostModal({ post, onClose, onSuccess }: { post: Post; onClose: () => void; onSuccess: () => void }) {
  const { token, user } = useAuthStore();
  const { uploadImage } = useImageUpload();

  const [content, setContent] = useState(post.content);
  const [imagePreview, setImagePreview] = useState<string | null>(post.imageUrl);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxChar = 500;
  const isOverLimit = content.length > maxChar;
  const avatarUrl = user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name}`;

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Ukuran gambar maksimal 5MB.'); return; }
    if (!file.type.startsWith('image/')) { setError('File harus berupa gambar.'); return; }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    setError(null);
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() && !imagePreview) { setError('Konten tidak boleh kosong.'); return; }
    if (isOverLimit) { setError(`Melebihi batas ${maxChar} karakter.`); return; }
    if (!token) return;

    setError(null);
    setIsSubmitting(true);

    try {
      let imageUrl: string | null = imagePreview;

      // Kalau ada file baru, upload dulu ke S3
      if (imageFile) {
        setIsUploading(true);
        const uploaded = await uploadImage(imageFile);
        setIsUploading(false);
        if (!uploaded) { setError('Gagal upload gambar. Coba lagi.'); setIsSubmitting(false); return; }
        imageUrl = uploaded;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content, imageUrl }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Gagal memperbarui.'); return; }
      onSuccess();
      onClose();
    } catch {
      setError('Koneksi ke server gagal.');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  }

  const isLoading = isSubmitting || isUploading;

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', background: 'rgba(0,0,0,0.75)' }}
      onClick={onClose}
    >
      <div
        style={{ width: '100%', maxWidth: 540, background: '#262626', border: '1px solid #444', borderRadius: 3, boxShadow: '0 10px 40px rgba(0,0,0,0.5)', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #444' }}>
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: '#e2e2e2' }}>Edit Postingan</span>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#636466', cursor: 'pointer', fontSize: 18 }}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <img src={avatarUrl} alt="avatar" style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #444' }} />
              <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: '#e2e2e2', margin: 0 }}>{user?.name}</p>
            </div>

            <textarea
              autoFocus
              value={content}
              onChange={(e) => { setContent(e.target.value); setError(null); }}
              placeholder="Bagikan sesuatu..."
              rows={4}
              style={{
                width: '100%', background: 'transparent', border: 'none',
                borderBottom: `2px solid ${isOverLimit ? '#b92b27' : '#444'}`,
                color: '#e2e2e2', fontSize: 16, fontWeight: 600, lineHeight: 1.6,
                paddingBottom: 8, outline: 'none', resize: 'none', fontFamily: FONT,
                boxSizing: 'border-box',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4, marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: isOverLimit ? '#b92b27' : '#636466' }}>{content.length}/{maxChar}</span>
            </div>

            {/* Preview gambar */}
            {imagePreview && (
              <div style={{ position: 'relative', marginBottom: 12, borderRadius: 3, overflow: 'hidden', border: '1px solid #444' }}>
                <img src={imagePreview} alt="preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }} />
                {isUploading && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>Mengupload...</p>
                  </div>
                )}
                {!isUploading && (
                  <button
                    type="button"
                    onClick={removeImage}
                    style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', fontSize: 12, padding: '4px 8px', borderRadius: 3, cursor: 'pointer' }}
                  >
                    ✕ Hapus
                  </button>
                )}
              </div>
            )}

            <input type="file" ref={fileInputRef} accept="image/jpeg,image/png,image/gif,image/webp" style={{ display: 'none' }} onChange={handleImageChange} />
            {error && <p style={{ fontSize: 12, color: '#b92b27', marginBottom: 8 }}>✗ {error}</p>}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderTop: '1px solid #444', background: '#1e1e1e' }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#636466', background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: 3, fontSize: 13, fontFamily: FONT }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
              <span style={{ fontWeight: 600 }}>{imagePreview ? 'Ganti Foto' : 'Tambah Foto'}</span>
            </button>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                style={{ border: '1px solid #444', color: '#939598', fontSize: 13, fontWeight: 600, padding: '6px 16px', borderRadius: 100, background: 'transparent', cursor: 'pointer', fontFamily: FONT }}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading || (!content.trim() && !imagePreview) || isOverLimit}
                style={{
                  background: isLoading || (!content.trim() && !imagePreview) || isOverLimit ? '#1a3a6b' : '#2b69d1',
                  color: '#fff', fontSize: 13, fontWeight: 700, padding: '6px 20px',
                  borderRadius: 100, border: 'none', cursor: 'pointer', fontFamily: FONT,
                  opacity: isLoading || (!content.trim() && !imagePreview) || isOverLimit ? 0.5 : 1,
                }}
              >
                {isUploading ? 'Mengupload...' : isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── PostCard ─────────────────────────────────────────────────────────────────
function PostCard({ post, currentUser, fetchPosts }: { post: Post; currentUser: any; fetchPosts: () => void }) {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post._count?.likes || 0);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const isOwner = currentUser?.id === post.user.id;

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  return (
    <>
      <article
        onClick={() => { if (!showEditModal) navigate(`/posts/${post.id}`); }}
        style={{
          background: C.surface, border: `1px solid ${C.border}`,
          marginBottom: "8px", borderRadius: "4px", padding: "12px 16px",
          cursor: "pointer", transition: "background 0.2s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = C.surfaceHover; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = C.surface; }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", minWidth: 0, flex: 1 }}>
            <img
              src={post.user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${post.user.name}`}
              alt={post.user.name}
              style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            />
            <div style={{ display: "flex", flexDirection: "column", marginTop: "-2px", minWidth: 0, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>
                <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13, color: C.textPrimary }}>{post.user.name}</span>
                <span onClick={(e) => e.stopPropagation()} style={{ fontFamily: FONT, fontSize: 13, color: C.blue, fontWeight: 600, cursor: "pointer" }}>· Ikuti</span>
              </div>
              <p style={{ fontFamily: FONT, fontSize: 13, color: C.textSecondary, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {post.user.credential || 'Pengguna Qoora'} · {timeAgo(post.createdAt)}
              </p>
            </div>
          </div>

          {isOwner ? (
            <div style={{ position: "relative", flexShrink: 0 }}>
              <button
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                style={{ background: "transparent", border: "none", color: C.textSecondary, cursor: "pointer", padding: "4px" }}
              >
                <MoreHorizontal size={18} />
              </button>
              {showMenu && (
                <div style={{ position: "absolute", right: 0, top: 24, background: "#1c1c1c", border: `1px solid ${C.border}`, borderRadius: 4, padding: "4px", zIndex: 10, width: "120px", boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowEditModal(true); setShowMenu(false); }}
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
              onClick={(e) => e.stopPropagation()}
              style={{ background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", padding: "4px", flexShrink: 0 }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        <p style={{ fontFamily: FONT, fontSize: 15, color: C.textPrimary, lineHeight: 1.6, margin: "8px 0 12px 0", whiteSpace: "pre-wrap", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {post.content}
        </p>

        {post.imageUrl && (
          <img src={post.imageUrl} alt="post" style={{ width: "100%", maxHeight: 400, objectFit: "cover", borderRadius: 4, marginBottom: 12, border: `1px solid ${C.border}` }} />
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, flexWrap: "nowrap", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", background: "#2B2D2D", borderRadius: 100, overflow: "hidden", border: `1px solid ${C.border}`, flexShrink: 0 }}>
            <button
              onClick={handleLike}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: liked ? "#3A7AEF20" : "transparent", color: liked ? C.blue : C.textSecondary, fontFamily: FONT, fontSize: 13, fontWeight: 600, border: "none", borderRight: `1px solid ${C.border}`, cursor: "pointer", whiteSpace: "nowrap" }}
            >
              <ThumbsUp size={16} fill={liked ? C.blue : "none"} />
              <span className="action-label"> Dukung · {likeCount}</span>
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "6px 10px", background: "transparent", color: C.textSecondary, border: "none", cursor: "pointer" }}
            >
              <ThumbsDown size={16} />
            </button>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/posts/${post.id}`); }}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 8px", borderRadius: 100, fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C.textSecondary, background: "transparent", border: "none", cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}
          >
            <MessageCircle size={16} />
            <span className="action-label"> {post._count?.comments || 0}</span>
          </button>

          <button
            onClick={(e) => e.stopPropagation()}
            style={{ marginLeft: "auto", color: C.textSecondary, background: "transparent", border: "none", cursor: "pointer", padding: "6px", flexShrink: 0 }}
          >
            {!isOwner && <MoreHorizontal size={18} />}
          </button>
        </div>
      </article>

      {/* Modal Edit Post */}
      {showEditModal && (
        <EditPostModal
          post={post}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => { setShowEditModal(false); fetchPosts(); }}
        />
      )}
    </>
  );
}

// ── FeedTabs ─────────────────────────────────────────────────────────────────
function FeedTabs({ avatarUrl, onOpenModal }: { avatarUrl: string; onOpenModal: () => void }) {
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

// ── Beranda ───────────────────────────────────────────────────────────────────
export default function Beranda() {
  const { user: authUser, token } = useAuthStore();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = authUser ?? { name: "Guest", avatar: null };
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

  useEffect(() => { fetchPosts(); }, []);

  const handleOpenModal = () => {
    if (!token) { navigate("/login"); return; }
    setIsModalOpen(true);
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(search.toLowerCase()) ||
      post.user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT, fontSize: 15, paddingBottom: 64 }}>
      <Navbar search={search} onSearchChange={setSearch} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 12px", display: "flex", gap: 20 }}>
        <div className="lg-sidebar" style={{ width: 140, flexShrink: 0 }}><Sidebar /></div>

        <main style={{ flex: 1, minWidth: 0, maxWidth: 600 }}>
          <FeedTabs avatarUrl={avatarUrl} onOpenModal={handleOpenModal} />

          {search && (
            <p style={{ fontFamily: FONT, fontSize: 13, color: C.textMuted, marginBottom: 12, padding: "0 16px" }}>
              Hasil untuk "<strong style={{ color: C.textSecondary }}>{search}</strong>" — {filteredPosts.length} ditemukan
            </p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} currentUser={user} fetchPosts={fetchPosts} />
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "48px 0", color: C.textMuted, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4 }}>
                <p style={{ fontSize: 15, fontFamily: FONT }}>Belum ada postingan.</p>
              </div>
            )}
          </div>
        </main>

        <aside style={{ width: 280, flexShrink: 0 }} className="right-sidebar" />
      </div>

      {isModalOpen && (
        <CreatePost
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => { setIsModalOpen(false); fetchPosts(); }}
        />
      )}

      <style>{`
        .lg-sidebar { display: none; }
        .right-sidebar { display: none; }
        @media (min-width: 1024px) {
          .lg-sidebar { display: block; }
          .right-sidebar { display: block; }
        }
        input::placeholder { color: #87898c; }
        textarea::placeholder { color: #87898c; }
        @media (max-width: 480px) {
          .action-label { display: none; }
        }
      `}</style>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { ThumbsUp, ThumbsDown, MessageCircle, Repeat2, MoreHorizontal, X, Send } from 'lucide-react';

// Palet warna tersinkronisasi dengan Beranda.tsx
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

type Post = {
  id: string; content: string; imageUrl: string | null; createdAt: string;
  user: { id: string; name: string; avatar: string | null };
  _count: { likes: number };
  comments: Comment[];
};

type Comment = {
  id: string; content: string; createdAt: string;
  user: { id: string; name: string; avatar: string | null };
};

export default function DetailPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user: authUser } = useAuthStore();

  const [post, setPost] = useState<Post | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const currentUserAvatar = (authUser as any)?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${authUser?.name || 'Guest'}`;

  useEffect(() => {
    if (!id) return;
    fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setPost(data);
        setLikeCount(data._count?.likes || 0);
      })
      .catch(() => setError('Gagal memuat postingan.'));
  }, [id]);

  const handleLike = async () => {
    if (!token) { navigate('/login'); return; }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/likes/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLiked(data.liked);
      setLikeCount((p) => data.liked ? p + 1 : p - 1);
    } catch {
      console.error("Gagal like post");
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!token) { navigate('/login'); return; }
    setIsSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/comments/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: newComment }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Gagal mengirim komentar.'); return; }
      setPost((prev) => prev ? { ...prev, comments: [data.comment, ...prev.comments] } : prev);
      setNewComment('');
    } catch {
      setError('Koneksi ke server gagal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!post) return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: C.textMuted, fontFamily: FONT }}>{error || 'Memuat postingan...'}</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: FONT, padding: '24px 16px' }}>
      <div style={{ maxWidth: 650, margin: '0 auto' }}>
        
        {/* Post Container */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: "16px 20px", marginBottom: 16 }}>
          
          {/* Header Postingan + Tombol X */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <img
                src={post.user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${post.user.name}`}
                alt={post.user.name}
                style={{ width: 44, height: 44, borderRadius: '50%', border: `1px solid ${C.border}`, objectFit: 'cover' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: '-2px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: C.textPrimary }}>
                    {post.user.name}
                  </span>
                  <span style={{ fontFamily: FONT, fontSize: 14, color: C.blue, fontWeight: 600, cursor: 'pointer' }}>
                    · Ikuti
                  </span>
                </div>
                <p style={{ color: C.textSecondary, fontSize: 13, margin: "2px 0 0 0" }}>
                  S1 di Ilmu Komputer, Universitas Tanjungpura · {timeAgo(post.createdAt)}
                </p>
              </div>
            </div>
            <button 
              onClick={() => navigate(-1)} 
              style={{ background: 'transparent', border: 'none', color: C.textMuted, cursor: 'pointer', padding: 4 }}
              title="Tutup Postingan"
            >
              <X size={22} />
            </button>
          </div>

          {/* Konten Postingan (Menjulang ke bawah tanpa terpotong) */}
          <p style={{ color: C.textPrimary, fontSize: 16, lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: "0 0 16px 0", wordBreak: 'break-word' }}>
            {post.content}
          </p>

          {post.imageUrl && (
            <img src={post.imageUrl} alt="post" style={{ width: '100%', maxHeight: 600, objectFit: 'contain', borderRadius: 4, marginBottom: 16, border: `1px solid ${C.border}` }} />
          )}

          {/* Action Bar Kapsul (Sama persis dengan Beranda) */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", background: "#2B2D2D", borderRadius: 100, overflow: "hidden", border: `1px solid ${C.border}` }}>
              <button
                onClick={handleLike}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: liked ? "#3A7AEF20" : "transparent", color: liked ? C.blue : C.textSecondary, fontFamily: FONT, fontSize: 13, fontWeight: 600, border: "none", borderRight: `1px solid ${C.border}`, cursor: "pointer" }}
              >
                <ThumbsUp size={16} fill={liked ? C.blue : "none"} /> Dukung · {likeCount}
              </button>
              <button style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "6px 10px", background: "transparent", color: C.textSecondary, border: "none", cursor: "pointer" }}>
                <ThumbsDown size={16} />
              </button>
            </div>

            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 100, border: "none", background: "transparent", fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C.textSecondary, cursor: "pointer" }}>
              <MessageCircle size={16} /> {post.comments.length}
            </button>

            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 100, border: "none", background: "transparent", fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C.textSecondary, cursor: "pointer" }}>
              <Repeat2 size={16} /> {Math.floor(Math.random() * 100)}
            </button>

            <button style={{ marginLeft: "auto", color: C.textSecondary, background: "transparent", border: "none", cursor: "pointer", padding: "6px" }}>
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* Kotak Tulis Komentar */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: "12px 16px", marginBottom: 16 }}>
          <form onSubmit={handleComment} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <img 
              src={currentUserAvatar} 
              alt="You" 
              style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} 
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={token ? "Tambahkan komentar..." : "Login dulu untuk berkomentar"}
                disabled={!token}
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${target.scrollHeight}px`;
                }}
                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${C.border}`, padding: '8px 0', color: C.textPrimary, fontSize: 15, resize: 'none', outline: 'none', fontFamily: FONT, minHeight: '38px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={isSubmitting || !newComment.trim()}
                  style={{ background: isSubmitting || !newComment.trim() ? '#444' : C.blue, color: isSubmitting || !newComment.trim() ? '#888' : '#fff', border: 'none', borderRadius: 100, padding: '6px 16px', fontSize: 14, fontWeight: 600, cursor: isSubmitting || !newComment.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  Tambahkan Komentar
                </button>
              </div>
            </div>
          </form>
          {error && <p style={{ color: C.red, fontSize: 13, marginTop: 8 }}>{error}</p>}
        </div>

        {/* Daftar Komentar */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {post.comments.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', background: C.surface, borderRadius: 4, border: `1px solid ${C.border}` }}>
              <p style={{ color: C.textMuted, margin: 0, fontSize: 15 }}>Belum ada komentar. Jadilah yang pertama!</p>
            </div>
          ) : (
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4 }}>
              {post.comments.map((comment, index) => (
                <div key={comment.id} style={{ padding: "16px", borderBottom: index === post.comments.length - 1 ? 'none' : `1px solid ${C.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <img
                      src={comment.user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${comment.user.name}`}
                      alt={comment.user.name}
                      style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                        <span style={{ color: C.textPrimary, fontWeight: 700, fontSize: 14 }}>{comment.user.name}</span>
                        <span style={{ color: C.textMuted, fontSize: 13 }}>· {timeAgo(comment.createdAt)}</span>
                      </div>
                      <p style={{ color: C.textPrimary, fontSize: 15, margin: 0, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { ThumbsUp, MessageCircle, Send } from 'lucide-react';

const C = {
  bg: "#181919", surface: "#262626", border: "#333333",
  textPrimary: "#e2e2e2", textSecondary: "#939598", textMuted: "#636466",
  red: "#B92B27", blue: "#2B69D1",
};
const FONT = "-apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff} detik lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
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
  const { token } = useAuthStore();

  const [post, setPost] = useState<Post | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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
    const res = await fetch(`${import.meta.env.VITE_API_URL}/likes/${id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setLiked(data.liked);
    setLikeCount((p) => data.liked ? p + 1 : p - 1);
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
      <p style={{ color: C.textMuted, fontFamily: FONT }}>{error || 'Memuat...'}</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: FONT, padding: '16px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <Link to="/" style={{ color: C.blue, fontSize: 13, textDecoration: 'none', display: 'block', marginBottom: 16 }}>← Kembali ke Beranda</Link>

        {/* Post */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <img
              src={post.user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${post.user.name}`}
              alt={post.user.name}
              style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${C.border}` }}
            />
            <div>
              <p style={{ color: C.textPrimary, fontWeight: 600, margin: 0 }}>{post.user.name}</p>
              <p style={{ color: C.textSecondary, fontSize: 13, margin: 0 }}>{timeAgo(post.createdAt)}</p>
            </div>
          </div>

          <p style={{ color: C.textPrimary, fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{post.content}</p>

          {post.imageUrl && (
            <img src={post.imageUrl} alt="post" style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 4, marginBottom: 12 }} />
          )}

          <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
            <button onClick={handleLike}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', borderRadius: 100, border: `1px solid ${C.border}`, background: liked ? '#1a2a4a' : C.surface, color: liked ? C.blue : C.textSecondary, cursor: 'pointer', fontSize: 14 }}>
              <ThumbsUp size={14} /> {likeCount} Suka
            </button>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', color: C.textSecondary, fontSize: 14 }}>
              <MessageCircle size={14} /> {post.comments.length} Komentar
            </span>
          </div>
        </div>

        {/* Form Komentar */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: 16, marginBottom: 16 }}>
          <form onSubmit={handleComment} style={{ display: 'flex', gap: 10 }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={token ? "Tulis komentar..." : "Login dulu untuk berkomentar"}
              disabled={!token}
              rows={2}
              style={{ flex: 1, background: '#1c1c1c', border: `1px solid ${C.border}`, borderRadius: 4, padding: '8px 12px', color: C.textPrimary, fontSize: 14, resize: 'none', outline: 'none', fontFamily: FONT }}
            />
            <button type="submit" disabled={isSubmitting || !newComment.trim()}
              style={{ background: C.blue, color: '#fff', border: 'none', borderRadius: 4, padding: '0 16px', cursor: 'pointer', opacity: isSubmitting || !newComment.trim() ? 0.5 : 1 }}>
              <Send size={16} />
            </button>
          </form>
          {error && <p style={{ color: C.red, fontSize: 12, marginTop: 6 }}>{error}</p>}
        </div>

        {/* List Komentar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {post.comments.length === 0 ? (
            <p style={{ color: C.textMuted, textAlign: 'center', padding: 24, fontFamily: FONT }}>Belum ada komentar.</p>
          ) : (
            post.comments.map((comment) => (
              <div key={comment.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <img
                    src={comment.user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${comment.user.name}`}
                    alt={comment.user.name}
                    style={{ width: 28, height: 28, borderRadius: '50%' }}
                  />
                  <span style={{ color: C.blue, fontWeight: 600, fontSize: 13 }}>{comment.user.name}</span>
                  <span style={{ color: C.textMuted, fontSize: 12 }}>{timeAgo(comment.createdAt)}</span>
                </div>
                <p style={{ color: C.textPrimary, fontSize: 14, margin: 0 }}>{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
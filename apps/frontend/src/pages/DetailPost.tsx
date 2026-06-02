import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { ThumbsUp, ThumbsDown, MessageCircle, MoreHorizontal, X, Edit2, Trash2 } from 'lucide-react';

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
  user: { id: string; name: string; avatar: string | null; credential: string | null };
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

  // State untuk edit komentar
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [isEditingComment, setIsEditingComment] = useState(false);

  const commentInputRef = useRef<HTMLTextAreaElement>(null);
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

  const handleEditComment = async (commentId: string) => {
    if (!editCommentContent.trim() || !token) return;
    setIsEditingComment(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/comments/comment/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: editCommentContent }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Gagal mengedit komentar.'); return; }
      setPost((prev) => prev ? {
        ...prev,
        comments: prev.comments.map((c) => c.id === commentId ? data.comment : c)
      } : prev);
      setEditingCommentId(null);
      setEditCommentContent('');
    } catch {
      setError('Koneksi ke server gagal.');
    } finally {
      setIsEditingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Yakin ingin menghapus komentar ini?')) return;
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/comments/comment/${commentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { setError('Gagal menghapus komentar.'); return; }
      setPost((prev) => prev ? {
        ...prev,
        comments: prev.comments.filter((c) => c.id !== commentId)
      } : prev);
    } catch {
      setError('Koneksi ke server gagal.');
    }
  };

  const scrollToComment = () => {
    commentInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    commentInputRef.current?.focus();
  };

  if (!post) return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: C.textMuted, fontFamily: FONT }}>{error || 'Memuat postingan...'}</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: FONT, padding: '24px 12px' }}>
      <div style={{ maxWidth: 650, margin: '0 auto' }}>

        {/* Post Container */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: "16px", marginBottom: 16 }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', minWidth: 0, flex: 1 }}>
              <img
                src={post.user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${post.user.name}`}
                alt={post.user.name}
                style={{ width: 44, height: 44, borderRadius: '50%', border: `1px solid ${C.border}`, objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: '-2px', minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: C.textPrimary }}>
                    {post.user.name}
                  </span>
                  <span style={{ fontFamily: FONT, fontSize: 14, color: C.blue, fontWeight: 600, cursor: 'pointer' }}>
                    · Ikuti
                  </span>
                </div>
                <p style={{ fontFamily: FONT, fontSize: 13, color: C.textSecondary, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {post.user.credential || 'Pengguna Qoora'} · {timeAgo(post.createdAt)}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate(-1)}
              style={{ background: 'transparent', border: 'none', color: C.textMuted, cursor: 'pointer', padding: 4, flexShrink: 0 }}
              title="Tutup Postingan"
            >
              <X size={22} />
            </button>
          </div>

          {/* Konten */}
          <p style={{ color: C.textPrimary, fontSize: 16, lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: "0 0 16px 0", wordBreak: 'break-word' }}>
            {post.content}
          </p>

          {post.imageUrl && (
            <img src={post.imageUrl} alt="post" style={{ width: '100%', maxHeight: 600, objectFit: 'contain', borderRadius: 4, marginBottom: 16, border: `1px solid ${C.border}` }} />
          )}

          {/* Action Bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, paddingTop: 16, borderTop: `1px solid ${C.border}`, flexWrap: "nowrap" }}>
            <div style={{ display: "flex", alignItems: "center", background: "#2B2D2D", borderRadius: 100, overflow: "hidden", border: `1px solid ${C.border}`, flexShrink: 0 }}>
              <button
                onClick={handleLike}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: liked ? "#3A7AEF20" : "transparent", color: liked ? C.blue : C.textSecondary, fontFamily: FONT, fontSize: 13, fontWeight: 600, border: "none", borderRight: `1px solid ${C.border}`, cursor: "pointer", whiteSpace: "nowrap" }}
              >
                <ThumbsUp size={16} fill={liked ? C.blue : "none"} />
                <span className="dp-action-label"> Dukung · {likeCount}</span>
              </button>
              <button style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "6px 10px", background: "transparent", color: C.textSecondary, border: "none", cursor: "pointer" }}>
                <ThumbsDown size={16} />
              </button>
            </div>

            {/* Tombol komentar — scroll ke form */}
            <button
              onClick={scrollToComment}
              style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 10px", borderRadius: 100, border: "none", background: "transparent", fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C.textSecondary, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}
            >
              <MessageCircle size={16} />
              <span className="dp-action-label"> {post.comments.length} Komentar</span>
            </button>

            <button style={{ marginLeft: "auto", color: C.textSecondary, background: "transparent", border: "none", cursor: "pointer", padding: "6px", flexShrink: 0 }}>
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
              style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
              <textarea
                ref={commentInputRef}
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
                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${C.border}`, padding: '8px 0', color: C.textPrimary, fontSize: 15, resize: 'none', outline: 'none', fontFamily: FONT, minHeight: '38px', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={isSubmitting || !newComment.trim()}
                  style={{ background: isSubmitting || !newComment.trim() ? '#444' : C.blue, color: isSubmitting || !newComment.trim() ? '#888' : '#fff', border: 'none', borderRadius: 100, padding: '6px 16px', fontSize: 14, fontWeight: 600, cursor: isSubmitting || !newComment.trim() ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
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
              {post.comments.map((comment, index) => {
                const isCommentOwner = authUser?.id === comment.user.id;
                const isEditing = editingCommentId === comment.id;

                return (
                  <div key={comment.id} style={{ padding: "16px", borderBottom: index === post.comments.length - 1 ? 'none' : `1px solid ${C.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <img
                        src={comment.user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${comment.user.name}`}
                        alt={comment.user.name}
                        style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
                            <span style={{ color: C.textPrimary, fontWeight: 700, fontSize: 14 }}>{comment.user.name}</span>
                            <span style={{ color: C.textMuted, fontSize: 13 }}>· {timeAgo(comment.createdAt)}</span>
                          </div>
                          {/* Menu edit/hapus hanya untuk pemilik komentar */}
                          {isCommentOwner && !isEditing && (
                            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                              <button
                                onClick={() => { setEditingCommentId(comment.id); setEditCommentContent(comment.content); }}
                                style={{ background: 'transparent', border: 'none', color: C.textMuted, cursor: 'pointer', padding: '2px 6px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}
                                title="Edit komentar"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                style={{ background: 'transparent', border: 'none', color: C.red, cursor: 'pointer', padding: '2px 6px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}
                                title="Hapus komentar"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          )}
                        </div>

                        {isEditing ? (
                          <div>
                            <textarea
                              autoFocus
                              value={editCommentContent}
                              onChange={(e) => setEditCommentContent(e.target.value)}
                              style={{ width: '100%', background: '#181818', border: `1px solid ${C.blue}`, outline: 'none', color: C.textPrimary, fontFamily: FONT, fontSize: 14, padding: '8px 10px', borderRadius: 4, resize: 'vertical', boxSizing: 'border-box', minHeight: 70 }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                              <button
                                onClick={() => { setEditingCommentId(null); setEditCommentContent(''); }}
                                style={{ background: 'transparent', color: C.textSecondary, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
                              >
                                Batal
                              </button>
                              <button
                                onClick={() => handleEditComment(comment.id)}
                                disabled={isEditingComment || !editCommentContent.trim() || editCommentContent === comment.content}
                                style={{ background: C.blue, color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: isEditingComment || !editCommentContent.trim() || editCommentContent === comment.content ? 0.5 : 1 }}
                              >
                                {isEditingComment ? 'Menyimpan...' : 'Simpan'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p style={{ color: C.textPrimary, fontSize: 15, margin: 0, lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                            {comment.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .dp-action-label { display: none; }
        }
      `}</style>
    </div>
  );
}
import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import { ArrowLeft, Send, AlertCircle, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";

// --- KONSTANTA GAYA ---
const C = {
  bg: "#181919",
  surface: "#262626",
  border: "#333333",
  textPrimary: "#e2e2e2",
  textSecondary: "#939598",
  textMuted: "#636466",
  red: "#B92B27",
  blue: "#2B69D1",
};

const FONT = "-apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans', Ubuntu, Cantarell, 'Helvetica Neue', Oxygen-Sans, sans-serif";

function timeAgo(dateInput: any) {
  // Jika data kosong atau tidak terdeteksi
  if (!dateInput) return "Baru saja";

  // Konversi input dari database ke objek Date JavaScript
  const parsedDate = new Date(dateInput);

  // Jika format dari backend tidak bisa dibaca (Invalid Date)
  if (isNaN(parsedDate.getTime())) return "Beberapa saat lalu";

  const diff = Math.floor((Date.now() - parsedDate.getTime()) / 1000);

  // Mencegah nilai minus jika jam server AWS dan jam laptop Anda tidak sinkron
  if (diff < 0) return "Baru saja";

  if (diff < 60) return `${diff} detik lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

export default function Komentar() {
  // SOLUSI DEFINITIF: Tangkap semua parameter dari URL, gunakan yang mana saja yang terisi
  const params = useParams();
  const currentPostId = params.id || params.postId;

  const navigate = useNavigate();
  const { user: authUser } = useAuthStore();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  // UX States
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);

  const user = authUser ?? {
    id: "1",
    name: "Pengguna Tamu",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Guest",
  };

  // --- FUNGSI GET (Dilengkapi Error Handling & useCallback) ---
  const fetchComments = useCallback(async () => {
    if (!currentPostId) return; // Hentikan jika ID tidak terbaca

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${currentPostId}/comments`);

      if (!res.ok) throw new Error("Gagal terhubung ke peladen.");

      const json = await res.json();
      if (json.success) {
        setComments(json.data);
      } else {
        throw new Error(json.message || "Data tidak valid.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Koneksi terputus atau pos tidak ditemukan.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPostId]);

  useEffect(() => {
    async function loadComments() {
      await fetchComments();
    }

    void loadComments();
  }, [fetchComments]);

  // --- FUNGSI POST ---
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const sanitizedComment = newComment.trim();
    if (!sanitizedComment || !currentPostId) return;

    if (!user?.id) {
      setErrorMsg("Sesi Anda telah habis. Silakan masuk kembali.");
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/${currentPostId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          content: sanitizedComment
        })
      });

      if (!response.ok) throw new Error("Peladen menolak permintaan.");

      const data = await response.json();
      if (data.success) {
        setNewComment("");
        fetchComments();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      setErrorMsg("Gagal mengirim komentar. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const visibleComments = useMemo(() => {
    return comments.slice(0, visibleCount);
  }, [comments, visibleCount]);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT, fontSize: 15 }}>
      <Navbar search="" onSearchChange={() => { }} />

      <main style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px" }}>
        <Link
          to="/"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.textSecondary, textDecoration: "none", marginBottom: 24, fontWeight: 500 }}
        >
          <ArrowLeft size={18} /> Kembali ke Beranda
        </Link>

        {errorMsg && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(185, 43, 39, 0.1)", border: `1px solid ${C.red}`, color: C.red, padding: "12px 16px", borderRadius: 8, marginBottom: 16 }}>
            <AlertCircle size={18} />
            <span style={{ fontWeight: 500 }}>{errorMsg}</span>
          </div>
        )}

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 24, boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.border}`, paddingBottom: 12, marginBottom: 24 }}>
            <h2 style={{ color: C.textPrimary, margin: 0, fontSize: 18, fontWeight: 700 }}>
              Balasan & Komentar
            </h2>
            <span style={{ color: C.textMuted, fontSize: 13, fontWeight: 500 }}>
              {comments.length} Komentar
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
            {isLoading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "40px 0", color: C.textMuted }}>
                <Loader2 size={32} style={{ animation: "spin 1s linear infinite" }} />
              </div>
            ) : visibleComments.length > 0 ? (
              <>
                {visibleComments.map((comment) => (
                  <div key={comment.id} style={{ display: "flex", gap: 12 }}>
                    <img
                      src={comment.user?.avatar_url || "https://api.dicebear.com/7.x/bottts/svg?seed=Anon"}
                      alt="avatar"
                      style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${C.border}`, flexShrink: 0, objectFit: "cover" }}
                    />
                    <div style={{ background: "#1c1c1c", padding: "12px 16px", borderRadius: "0 12px 12px 12px", border: `1px solid ${C.border}`, flex: 1, wordBreak: "break-word" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, color: C.textPrimary, fontSize: 14 }}>
                          {comment.user?.name || "Pengguna Anonim"}
                        </span>
                        <span style={{ color: C.textMuted, fontSize: 12 }}>
                          {timeAgo(comment.created_at || new Date().toISOString())}
                        </span>
                      </div>
                      <p style={{ margin: 0, color: C.textSecondary, fontSize: 14, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}

                {visibleCount < comments.length && (
                  <button
                    onClick={() => setVisibleCount(prev => prev + 10)}
                    style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.blue, padding: "10px 0", borderRadius: 100, fontFamily: FONT, fontWeight: 600, fontSize: 14, cursor: "pointer", marginTop: 8 }}
                  >
                    Tampilkan Komentar Sebelumnya...
                  </button>
                )}
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "32px 0", color: C.textMuted, fontStyle: "italic" }}>
                Belum ada komentar. Jadilah yang pertama membalas!
              </div>
            )}
          </div>

          <form onSubmit={handleAddComment} style={{ display: "flex", gap: 12, alignItems: "flex-start", borderTop: `1px solid ${C.border}`, paddingTop: 24 }}>
            <img
              src={user.avatarUrl}
              alt="avatar"
              style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, objectFit: "cover" }}
            />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Tuliskan komentar Anda..."
                style={{ width: "100%", minHeight: 60, background: "#1c1c1c", border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 16px", color: C.textPrimary, fontFamily: FONT, fontSize: 14, outline: "none", resize: "vertical" }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  style={{ display: "flex", alignItems: "center", gap: 6, background: isSubmitting || !newComment.trim() ? C.border : C.blue, color: "#fff", border: "none", padding: "8px 20px", borderRadius: 100, fontFamily: FONT, fontWeight: 600, fontSize: 14, cursor: isSubmitting || !newComment.trim() ? "not-allowed" : "pointer", transition: "background 0.2s" }}
                >
                  {isSubmitting ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={16} />}
                  {isSubmitting ? "Mengirim..." : "Kirim"}
                </button>
              </div>
            </div>
          </form>

        </div>
      </main>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
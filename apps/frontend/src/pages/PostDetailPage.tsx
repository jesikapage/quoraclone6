import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

// ── SVG Icons ──────────────────────────────────────────────────────────────
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
const IconDots = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
  </svg>
);

// Helper Fungsi Format Angka
function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(".0", "") + " jt";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + " rb";
  return String(n);
}

// Data Materi Detail Postingan berserta Initial Comments
const detailPostsData = [
  {
    id: "101",
    title: "Bagaimana cara mengoptimalkan penggunaan AWS Lambda untuk backend aplikasi skala besar?",
    created_at: "3 jam lalu",
    upvotes: 9400,
    shares: 279,
    user: {
      name: "Rito Backend Developer",
      avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Rito",
      credential: "Software Engineer · AWS Certified",
    },
    answers: [
      {
        author: "Alex Kurniawan",
        credential: "Cloud Architect at TechCorp",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex",
        content: [
          "Mengoptimalkan AWS Lambda untuk skala besar memerlukan pemahaman mendalam tentang siklus hidup fungsi serverless. Berikut adalah beberapa strategi utama yang wajib diterapkan:",
          "1. Atasi Cold Start dengan Provisioned Concurrency: Cold start terjadi saat Lambda menginisiasi kontainer baru. Dengan menggunakan Provisioned Concurrency, AWS akan selalu menjaga sejumlah instance Lambda tetap hangat dan siap merespons secara instan.",
          "2. Optimalkan Ukuran Memori (CPU): Di AWS Lambda, alokasi CPU berbanding lurus dengan memori yang Anda pilih. Jika fungsi Anda terasa lambat, menaikkan memori (misal dari 512MB ke 1024MB) seringkali justru menurunkan durasi eksekusi secara signifikan dan menghemat biaya global."
        ]
      }
    ],
    commentsList: [
      { id: 1, user_name: "Budi Santoso", content: "Sangat membantu bang, RDS Proxy beneran jadi penyelamat pas traffic naik.", created_at: "2 jam lalu" },
      { id: 2, user_name: "Dewi Lestari", content: "Kalau di node.js mending pakai esbuild ya buat ngecilin bundle package?", created_at: "1 jam lalu" }
    ]
  },
  {
    id: "102",
    title: "Desain Dark Mode Quora Clone kita malam ini terlihat sangat responsif menggunakan Tailwind CSS!",
    created_at: "3 hari lalu",
    upvotes: 7,
    shares: 1,
    user: {
      name: "Prilia UI/UX",
      avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Prilia",
      credential: "UI/UX Designer · Figma Expert",
    },
    image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500",
    answers: [
      {
        author: "Prilia UI/UX",
        credential: "UI/UX Designer · Figma Expert",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Prilia",
        content: [
          "Terima kasih atas apresiasinya! Penerapan Dark Mode malam ini memang dirancang khusus menggunakan utility classes Tailwind CSS untuk memastikan kenyamanan visual pengguna di kondisi minim cahaya."
        ]
      }
    ],
    commentsList: [
      { id: 1, user_name: "Rito Backend Developer", content: "Keren jes! Warna #181919 nya bikin betah mantengin berjam-jam.", created_at: "2 hari lalu" }
    ]
  }
];

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const basePost = detailPostsData.find((p) => String(p.id) === String(id));

  // State Tombol Aksi
  const [upvotes, setUpvotes] = useState(0);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);

  // State Fitur Komentar Dinamis
  const [comments, setComments] = useState<any[]>([]);
  const [newCommentText, setNewCommentText] = useState("");

  useEffect(() => {
    if (basePost) {
      setUpvotes(basePost.upvotes);
      setIsUpvoted(false);
      setIsDownvoted(false);
      setComments(basePost.commentsList || []);
    }
  }, [id, basePost]);

  if (!basePost) {
    return (
      <div className="min-h-screen bg-[#181919] flex flex-col items-center justify-center text-[#e2e2e2]">
        <p className="text-lg font-medium mb-4">Postingan tidak ditemukan.</p>
        <Link to="/" className="text-[#2b69d1] hover:underline text-sm">Kembali ke Beranda</Link>
      </div>
    );
  }

  const handleUpvoteClick = () => {
    if (isUpvoted) {
      setUpvotes((prev) => prev - 1);
      setIsUpvoted(false);
    } else {
      setUpvotes((prev) => prev + (isDownvoted ? 2 : 1));
      setIsUpvoted(true);
      setIsDownvoted(false);
    }
  };

  const handleDownvoteClick = () => {
    if (isDownvoted) {
      setIsDownvoted(false);
    } else {
      if (isUpvoted) {
        setUpvotes((prev) => prev - 1);
        setIsUpvoted(false);
      }
      setIsDownvoted(true);
    }
  };

  // Fungsi menambah komentar baru
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment = {
      id: Date.now(),
      user_name: "Anda (Pengguna)",
      content: newCommentText,
      created_at: "Baru saja"
    };

    setComments([newComment, ...comments]);
    setNewCommentText("");
  };

  return (
    <div className="min-h-screen bg-[#181919] text-[#e2e2e2] font-sans pb-12">
      {/* Header / Navbar */}
      <header className="bg-[#262626] border-b border-[#333] sticky top-0 h-[50px] flex items-center px-4 z-30">
        <div className="max-w-[650px] mx-auto w-full flex items-center gap-4">
          <Link to="/" className="text-[#939598] hover:text-[#e2e2e2] transition p-1 rounded hover:bg-[#333]">
            <ArrowLeft size={20} />
          </Link>
          <span className="font-bold text-sm">Pertanyaan</span>
        </div>
      </header>
      
      {/* Konten Utama */}
      <main className="max-w-[650px] mx-auto mt-5 px-4">
        <div className="bg-[#262626] border border-[#333] rounded-[3px] p-5 shadow-sm">
          
          {/* Profil Pembuat */}
          <div className="flex items-center gap-2.5 mb-3">
            <img src={basePost.user.avatar_url} alt="avatar" className="w-9 h-9 rounded-full border border-[#444]" />
            <div>
              <p className="font-semibold text-sm text-[#e2e2e2]">{basePost.user.name}</p>
              <p className="text-[12px] text-[#636466]">{basePost.user.credential} · {basePost.created_at}</p>
            </div>
          </div>

          {/* Judul */}
          <h1 className="text-[17px] font-bold text-[#e2e2e2] leading-snug mb-4">
            {basePost.title}
          </h1>

          {/* Gambar Media */}
          {basePost.image_url && (
            <div className="mb-4 rounded-[3px] overflow-hidden border border-[#333]">
              <img src={basePost.image_url} alt="Post media" className="w-full max-h-80 object-cover" />
            </div>
          )}

          {/* Kolom Jawaban Utama */}
          <div className="border-t border-[#333] mt-6 pt-5">
            <h2 className="text-sm font-bold text-[#939598] mb-4 uppercase tracking-wider">
              {basePost.answers.length} Jawaban
            </h2>

            {basePost.answers.map((ans, idx) => (
              <div key={idx} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <img src={ans.avatar} alt="avatar" className="w-8 h-8 rounded-full border border-[#444]" />
                  <div>
                    <p className="font-semibold text-sm text-[#e2e2e2]">{ans.author}</p>
                    <p className="text-[11px] text-[#636466]">{ans.credential}</p>
                  </div>
                </div>
                <div className="text-[15px] text-[#d5d6d7] leading-relaxed space-y-3 pl-1">
                  {ans.content.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Action Bar Bawah */}
          <div className="border-t border-[#333] mt-6 pt-2 flex items-center gap-1">
            <div className="flex items-center rounded-full border border-[#444] overflow-hidden mr-1">
              <button
                onClick={handleUpvoteClick}
                className={`flex items-center gap-1.5 pl-3 pr-2.5 py-1.5 text-[13px] font-medium transition ${
                  isUpvoted ? "bg-[#2b69d1] text-white" : "text-[#939598] hover:bg-[#1a3a6b] hover:text-[#e2e2e2]"
                }`}
              >
                <IconUpvote />
                <span>Dukung Naik</span>
                {upvotes > 0 && (
                  <span className={`ml-0.5 font-semibold ${isUpvoted ? "text-white" : "text-[#e2e2e2]"}`}>
                    · {formatCount(upvotes)}
                  </span>
                )}
              </button>
              <div className="w-px h-5 bg-[#444]" />
              <button
                onClick={handleDownvoteClick}
                className={`px-2.5 py-1.5 transition ${
                  isDownvoted ? "bg-[#b92b27] text-white" : "text-[#939598] hover:bg-[#3d1010] hover:text-[#e2e2e2]"
                }`}
              >
                <IconDownvote />
              </button>
            </div>

            {/* Indikator Jumlah Komentar Aktif */}
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#939598] hover:bg-[#333] hover:text-[#e2e2e2] px-3 py-1.5 rounded-full transition">
              <IconComment />
              <span>{formatCount(comments.length)}</span>
            </div>

            <button className="flex items-center gap-1.5 text-[13px] font-medium text-[#939598] hover:bg-[#333] hover:text-[#e2e2e2] px-3 py-1.5 rounded-full transition">
              <IconShare />
              {basePost.shares > 0 && <span>{formatCount(basePost.shares)}</span>}
            </button>

            <button className="ml-auto text-[#939598] hover:bg-[#333] hover:text-[#e2e2e2] p-1.5 rounded-full transition">
              <IconDots />
            </button>
          </div>

          {/* ── SEKSI KOMENTAR (BARU) ─────────────────────────────────────── */}
          <div className="bg-[#181919] -mx-5 px-5 py-4 mt-4 border-t border-[#333]">
            
            {/* Input Form Tambah Komentar */}
            <form onSubmit={handleAddComment} className="flex gap-2 items-center bg-[#262626] p-2 border border-[#333] rounded-full mb-4">
              <input 
                type="text"
                placeholder="Tambahkan komentar..." 
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 text-[13px] px-3 outline-none bg-transparent text-[#e2e2e2] placeholder-[#636466]"
              />
              <button 
                type="submit" 
                className="bg-[#2b69d1] hover:bg-[#1a3a6b] text-white text-[12px] font-semibold px-3 py-1 rounded-full transition"
              >
                Kirim
              </button>
            </form>

            {/* List Daftar Komentar */}
            <div className="space-y-2">
              {comments.map((c) => (
                <div key={c.id} className="bg-[#262626] p-3 border border-[#333] rounded-[3px]">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-bold text-[13px] text-[#e2e2e2]">{c.user_name}</p>
                    <span className="text-[10px] text-[#636466]">{c.created_at}</span>
                  </div>
                  <p className="text-[13px] text-[#d5d6d7] leading-relaxed">{c.content}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-xs text-[#636466] text-center py-2">Belum ada komentar. Jadilah yang pertama!</p>
              )}
            </div>

          </div>
          {/* ──────────────────────────────────────────────────────────────── */}

        </div>
      </main>
    </div>
  );
}
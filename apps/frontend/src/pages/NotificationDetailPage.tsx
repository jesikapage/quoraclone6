import { useParams, Link, useNavigate } from "react-router-dom"; // Ditambahkan useNavigate
import { useState, useEffect } from "react";
import { MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { useAuthStore } from "../stores/auth.store"; // Ditambahkan untuk manajemen akun & profil
import CreatePost from "./CreatePost"; // Ditambahkan untuk modal tambah pertanyaan

// ── SVG Icons dari Beranda.tsx ─────────────────────────────────────────────
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
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

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

// Helper Fungsi Format Angka
function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(".0", "") + " jt";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + " rb";
  return String(n);
}

// Data Notifikasi Lengkap dengan Konten Detail
const notificationsData = [
  {
    notificationId: "notif-1",
    id: "1",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=anomali",
    context: "Anomali Warga RT sebelah · Dikirimkan ke Ruang yang mungkin Anda sukai · 6 jam yang lalu",
    mainText: "Jejak digital itu real kawan.",
    subText: "Apa fakta yang membuatmu terheran-heran hari ini?",
    type: "Ruang",
    isUnread: false,
    author: "Anomali Warga RT sebelah",
    authorRole: "Pengguna Aktif · Contributor",
    fullContent: [
      "Jejak digital yang kita tinggalkan di internet ternyata jauh lebih nyata dari yang kita bayangkan. Setiap klik, setiap like, dan setiap komentar menciptakan jejak yang tidak akan pernah benar-benar hilang.",
      "Dalam era digital ini, privasi bukan hanya tentang data pribadi, tetapi juga tentang bagaimana identitas digital kita terbentuk. Algoritma yang mempelajari perilaku kita, AI yang memprediksi preferensi kita, dan server yang menyimpan setiap jejak kita.",
      "Pertanyaannya adalah: Berapa banyak dari kita yang benar-benar memahami dampak jejak digital yang kita ciptakan setiap hari?"
    ],
    upvotes: 2840,
    shares: 145,
    comments: [
      { id: 1, user: "Budi Santoso", role: "Software Engineer", avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=budi", comment: "Sangat relevan dengan era sekarang. Privacy bukan lagi luxury.", created: "2 jam lalu", upvotes: 234 },
      { id: 2, user: "Siti Nurhayati", role: "Digital Analyst", avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=siti", comment: "Ini kenapa saya mulai menggunakan privacy tools dan VPN.", created: "1 jam lalu", upvotes: 156 }
    ]
  },
  {
    notificationId: "notif-2",
    id: "2",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=talulah",
    context: "Ruang Talulah Rhym · Dijawab di Ruang yang mungkin Anda sukai · 12 Mei",
    mainText: "Apa tips cara bermain di situs slot agar mendapatkan maxwin?",
    subText: null,
    type: "Ruang",
    isUnread: false,
    author: "Talulah Rhym",
    authorRole: "Gaming Expert · Content Creator",
    fullContent: [
      "Bermain slot dengan strategi yang tepat bisa meningkatkan peluang kemenangan Anda. Berikut beberapa tips yang sudah terbukti efektif:",
      "1. Pahami RTP (Return to Player): Pilih mesin slot dengan RTP tinggi (minimal 96%). Ini menunjukkan persentase uang yang dikembalikan kepada pemain dalam jangka panjang.",
      "2. Kelola Bankroll dengan Bijak: Tentukan batas maksimal yang bisa Anda kehilangan sebelum bermain. Jangan pernah bermain dengan uang yang Anda butuhkan untuk kebutuhan sehari-hari.",
      "3. Gunakan Fitur Demo: Sebelum bermain dengan uang asli, coba versi demo untuk memahami mekanisme permainan.",
      "4. Maksimalkan Bonus: Manfaatkan bonus deposit, free spins, dan promosi lainnya untuk memperbesar modal bermain Anda."
    ],
    upvotes: 1230,
    shares: 89,
    comments: [
      { id: 1, user: "Ahmad Ridho", role: "Pemain Berpengalaman", avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=ahmad", comment: "Tips yang sangat praktis. RTP memang kunci utamanya.", created: "3 hari lalu", upvotes: 178 }
    ]
  },
  {
    notificationId: "notif-3",
    id: "3",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=darkstory",
    context: "Dark (humor) story · Dikirimkan ke Ruang yang mungkin Anda sukai · 5 Mei",
    mainText: "Hidup itu lucu, mau menghindar kaya gimanapun kalau blm takdir pasti bakal selamat.",
    subText: null,
    type: "Kisah",
    isUnread: true,
    author: "Dark Humor Daily",
    authorRole: "Philosophy Enthusiast · Storyteller",
    fullContent: [
      "Ada sesuatu yang filosofis namun menyenangkan tentang bagaimana hidup bekerja. Tidak peduli seberapa keras kita coba menghindar dari takdir, entah bagaimana caranya kita selalu berakhir di tempat yang 'seharusnya' kita berada.",
      "Saya pernah mengenal seseorang yang sangat takut dengan ketinggian. Dia hindari pesawat, hindari lift, bahkan hindari tangga dengan tiga anak tangga. Sampai suatu hari dia terjatuh dari tempat tidur dan patah tangan. Takdir punya cara tersendiri untuk menertawai kita.",
      "Yang membuat saya tertawa adalah bagaimana kita sangat percaya diri bahwa rencana kita adalah rencana terbaik. Padahal, hidup adalah improvisasi yang indah. Dan kadang improvisasi yang paling baik adalah ketika kita berhenti merencanakan dan mulai menerima apa adanya."
    ],
    upvotes: 3450,
    shares: 267,
    comments: [
      { id: 1, user: "Rini Wijaya", role: "Philosophy Student", avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=rini", comment: "Ini seperti nasihat dari teman yang bijak sekaligus lucu.", created: "4 hari lalu", upvotes: 445 }
    ]
  },
  {
    notificationId: "notif-4",
    id: "4",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=historia",
    context: "Historia Magistra · Dikirimkan ke Ruang yang mungkin Anda sukai · 21 April",
    mainText: "Kota yang Mati Tanpa Musuh",
    subText: null,
    type: "Kisah",
    isUnread: false,
    author: "Historia Magistra",
    authorRole: "Historian · Cultural Writer",
    fullContent: [
      "Di tengah padang pasir Mesopotamia, tersembunyi sebuah kota kuno yang misterius: Samarra. Kota yang dibangun atas ambisi seorang khalifah, hanya untuk ditinggalkan dan dilupakan dalam hitungan dekade.",
      "Khalifah Al-Mu'tasim mendirikan Samarra pada tahun 836 Masehi sebagai ibu kota baru KhaLifah Abbasiyah. Dengan investasi besar dan ribuan buruh, kota ini dirancang untuk menjadi jantung kekuasaan. Istana megah, masjid besar, dan jalan-jalan lebar mencerminkan ambisi pembangunannya.",
      "Namun, kehidupan Samarra berakhir dengan sedih. Tanpa peperangan besar atau invasi musuh, kota ini secara bertahap ditinggalkan. Pada akhir abad ke-9, ibu kota dipindahkan, dan Samarra menjadi reruntuhan yang terlupakan.",
      "Cerita Samarra mengajarkan kita bahwa kehancuran tidak selalu datang dari perang. Kadang, kota dan peradaban runtuh dari dalam, karena keputusan buruk, perubahan politk, atau sekadar keberuntungan yang membelok."
    ],
    upvotes: 2156,
    shares: 98,
    comments: [
      { id: 1, user: "Dr. Bambang Histori", role: "Sejarawan", avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=bambang", comment: "Dokumentasi yang sangat baik tentang periode Samarra. Detailnya akurat.", created: "15 Mei", upvotes: 567 }
    ]
  }
];

export default function NotificationDetailPage() {
  const { notificationId } = useParams<{ notificationId: string }>();
  const notification = notificationsData.find(n => n.notificationId === notificationId);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [upvotes, setUpvotes] = useState(0);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeNav, setActiveNav] = useState("notif");

  // Menutup menu profil otomatis saat klik di luar area
  useEffect(() => {
    function handleClickOutside() { setShowMenu(null); }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => { logout(); navigate("/login"); };

  useEffect(() => {
    if (notification) {
      setUpvotes(notification.upvotes);
      setIsUpvoted(false);
      setIsDownvoted(false);
      setComments(notification.comments || []);
    }
  }, [notificationId, notification]);

  if (!notification) {
    return (
      <div className="min-h-screen bg-[#181919] flex flex-col items-center justify-center text-[#e2e2e2]">
        <p className="text-lg font-medium mb-4">Notifikasi tidak ditemukan.</p>
        <Link to="/notifikasi" className="text-[#2b69d1] hover:underline text-sm">
          Kembali ke Notifikasi
        </Link>
      </div>
    );
  }

  const handleUpvoteClick = () => {
    if (isUpvoted) {
      setUpvotes(prev => prev - 1);
      setIsUpvoted(false);
    } else {
      setUpvotes(prev => prev + (isDownvoted ? 2 : 1));
      setIsUpvoted(true);
      setIsDownvoted(false);
    }
  };

  const handleDownvoteClick = () => {
    if (isDownvoted) {
      setIsDownvoted(false);
    } else {
      if (isUpvoted) {
        setUpvotes(prev => prev - 1);
        setIsUpvoted(false);
      }
      setIsDownvoted(true);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment = {
      id: Date.now(),
      user: "Anda (Pengguna)",
      role: "Member",
      avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=you",
      comment: newCommentText,
      created: "Baru saja",
      upvotes: 0
    };

    setComments([newComment, ...comments]);
    setNewCommentText("");
  };

  return (
    <div className="min-h-screen bg-[#181919] text-[#e2e2e2] font-sans pb-8 sm:pb-12">
      
      {/* Navbar Utama (Mobile responsive) */}
      <nav className="h-[50px] bg-[#262626] border-b border-[#333] sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto h-full flex items-center gap-2 px-2 sm:px-4">
          <span
            className="text-[#b92b27] text-lg sm:text-2xl font-bold tracking-tighter cursor-pointer select-none mr-1 sm:mr-2"
            onClick={() => navigate("/")}
          >
            Quora
          </span>

          <div className="flex-1 max-w-[200px] sm:max-w-[340px]">
            <div className="flex items-center gap-2 bg-[#181919] border border-[#444] rounded-[3px] px-2 sm:px-3 py-1 sm:py-1.5 hover:border-[#636466] transition">
              <span className="text-[#636466] text-xs sm:text-sm"><IconSearch /></span>
              <input
                type="text"
                placeholder="Cari"
                className="bg-transparent text-xs sm:text-sm text-[#e2e2e2] outline-none w-full placeholder-[#636466]"
              />
            </div>
          </div>

          <div className="flex items-center gap-0.5 sm:gap-1 ml-auto">
            <Link
              to="/"
              onClick={() => setActiveNav("home")}
              title="Beranda"
              className={`hidden sm:flex items-center justify-center w-10 h-10 rounded-[3px] transition ${
                activeNav === "home"
                  ? "text-[#b92b27] border-b-2 border-[#b92b27]"
                  : "text-[#636466] hover:bg-[#333] hover:text-[#e2e2e2]"
              }`}
            >
              <IconHome />
            </Link>

            <Link
              to="/notifikasi"
              onClick={() => setActiveNav("notif")}
              title="Notifikasi"
              className={`flex items-center justify-center w-10 h-10 rounded-[3px] transition ${
                activeNav === "notif"
                  ? "text-[#b92b27] border-b-2 border-[#b92b27]"
                  : "text-[#636466] hover:bg-[#333] hover:text-[#e2e2e2]"
              }`}
            >
              <IconBell />
            </Link>

            <button
              onClick={() => setShowCreatePost(true)}
              className="hidden sm:flex items-center gap-1.5 bg-[#2b69d1] hover:bg-[#3277ed] text-white text-sm font-semibold px-4 py-1.5 rounded-[3px] transition ml-2"
            >
              <IconPencil />
              Tambah
            </button>

            <button
              onClick={() => setShowCreatePost(true)}
              className="sm:hidden flex items-center justify-center w-9 h-9 bg-[#2b69d1] hover:bg-[#3277ed] text-white rounded-[3px] transition"
              title="Tambah Pertanyaan"
            >
              <IconPencil />
            </button>

            <div className="relative ml-1 sm:ml-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowMenu(showMenu === "profile" ? null : "profile")}
                className="flex items-center gap-1 hover:bg-[#333] rounded-[3px] p-1 transition"
              >
                <img
                  src={user?.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name}`}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border border-[#444]"
                />
              </button>

              {showMenu === "profile" && (
                <div className="absolute right-0 top-11 bg-[#2e2e2e] border border-[#444] rounded-[3px] shadow-lg z-40 w-48 py-1">
                  <div className="px-4 py-3 border-b border-[#444]">
                    <p className="text-xs sm:text-sm font-bold text-[#e2e2e2] truncate">{user?.name || "Pengguna"}</p>
                    <p className="text-[10px] sm:text-xs text-[#636466] mt-0.5">Lihat profil</p>
                  </div>
                  <button onClick={() => { navigate("/profile/edit"); setShowMenu(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-xs sm:text-sm text-[#e2e2e2] hover:bg-[#3a3a3a] transition">
                    <span>👤</span>Edit Profil
                  </button>
                  <button onClick={() => { navigate("/settings"); setShowMenu(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-xs sm:text-sm text-[#e2e2e2] hover:bg-[#3a3a3a] transition">
                    <span>⚙️</span>Pengaturan
                  </button>
                  <button onClick={() => { logout(); navigate("/login"); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-xs sm:text-sm text-[#e2e2e2] hover:bg-[#3a3a3a] transition">
                    <span>🚪</span>Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Modal Tambah Pertanyaan */}
      {showCreatePost && (
        <CreatePost onClose={() => setShowCreatePost(false)} onSuccess={() => {}} />
      )}

      {/* Main Content (Mobile responsive) */}
      <main className="max-w-[650px] mx-auto mt-3 sm:mt-5 px-2 sm:px-4">
        <div className="bg-[#262626] border border-[#333] rounded-[3px] p-3 sm:p-5 shadow-sm">
          
          {/* Author Profile (Mobile responsive) */}
          <div className="flex items-center gap-2 sm:gap-2.5 mb-3 sm:mb-4">
            <img 
              src={notification.avatar} 
              alt="avatar" 
              className="w-8 sm:w-9 h-8 sm:h-9 rounded-full border border-[#444] flex-shrink-0" 
            />
            <div className="min-w-0">
              <p className="font-semibold text-xs sm:text-sm text-[#e2e2e2] truncate">{notification.author}</p>
              <p className="text-[10px] sm:text-[12px] text-[#636466] truncate">
                {notification.authorRole} · {notification.context.split("·").pop()}
              </p>
            </div>
          </div>

          {/* Notification Title */}
          <h1 className="text-[17px] font-bold text-[#e2e2e2] leading-snug mb-4">
            {notification.mainText}
          </h1>

          {/* Subtitle if exists */}
          {notification.subText && (
            <div className="mb-4 p-3 bg-[#181919]/50 border border-[#444] rounded-[3px]">
              <p className="text-[14px] text-[#d5d6d7]">{notification.subText}</p>
            </div>
          )}

          {/* Full Content */}
          <div className="border-t border-[#333] mt-6 pt-5">
            <div className="text-[15px] text-[#d5d6d7] leading-relaxed space-y-4">
              {notification.fullContent.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Action Bar */}
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

            <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#939598] hover:bg-[#333] hover:text-[#e2e2e2] px-3 py-1.5 rounded-full transition">
              <MessageCircle size={16} />
              <span>{formatCount(comments.length)}</span>
            </div>

            <button className="flex items-center gap-1.5 text-[13px] font-medium text-[#939598] hover:bg-[#333] hover:text-[#e2e2e2] px-3 py-1.5 rounded-full transition">
              <Share2 size={16} />
              {notification.shares > 0 && <span>{formatCount(notification.shares)}</span>}
            </button>

            <button className="ml-auto text-[#939598] hover:bg-[#333] hover:text-[#e2e2e2] p-1.5 rounded-full transition">
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* Comments Section */}
          <div className="bg-[#181919] -mx-5 px-5 py-4 mt-4 border-t border-[#333]">
            
            {/* Add Comment Form */}
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

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="bg-[#262626] p-3 border border-[#333] rounded-[3px]">
                  <div className="flex items-center gap-2 mb-2">
                    <img 
                      src={c.avatar} 
                      alt="avatar" 
                      className="w-6 h-6 rounded-full border border-[#444]"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-[13px] text-[#e2e2e2]">{c.user}</p>
                      <p className="text-[11px] text-[#636466]">{c.role} · {c.created}</p>
                    </div>
                    {c.upvotes > 0 && (
                      <span className="text-[11px] text-[#939598]">{formatCount(c.upvotes)}</span>
                    )}
                  </div>
                  <p className="text-[13px] text-[#d5d6d7] leading-relaxed">{c.comment}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-xs text-[#636466] text-center py-2">Belum ada komentar. Jadilah yang pertama!</p>
              )}
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MessageCircle, Share2, MoreHorizontal, ArrowLeft } from "lucide-react";
import { useAuthStore } from "../stores/auth.store";
import Navbar from "../components/Navbar";
import CreatePost from "./CreatePost";

// ── SVG Icons ─────────────────────────────────────────────────────────────────
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

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(".0", "") + " jt";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + " rb";
  return String(n);
}

// ── Full Notification Data ─────────────────────────────────────────────────────
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
      "Pertanyaannya adalah: Berapa banyak dari kita yang benar-benar memahami dampak jejak digital yang kita ciptakan setiap hari? Apakah kita siap dengan konsekuensinya?",
    ],
    upvotes: 2840,
    shares: 145,
    comments: [
      { id: 1, user: "Budi Santoso", role: "Software Engineer", avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=budi", comment: "Sangat relevan dengan era sekarang. Privacy bukan lagi luxury.", created: "2 jam lalu", upvotes: 234 },
      { id: 2, user: "Siti Nurhayati", role: "Digital Analyst", avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=siti", comment: "Ini kenapa saya mulai menggunakan privacy tools dan VPN.", created: "1 jam lalu", upvotes: 156 },
    ],
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
      "4. Maksimalkan Bonus: Manfaatkan bonus deposit, free spins, dan promosi lainnya untuk memperbesar modal bermain Anda.",
    ],
    upvotes: 1230,
    shares: 89,
    comments: [
      { id: 1, user: "Ahmad Ridho", role: "Pemain Berpengalaman", avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=ahmad", comment: "Tips yang sangat praktis. RTP memang kunci utamanya.", created: "3 hari lalu", upvotes: 178 },
    ],
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
      "Yang membuat saya tertawa adalah bagaimana kita sangat percaya diri bahwa rencana kita adalah rencana terbaik. Padahal, hidup adalah improvisasi yang indah. Dan kadang improvisasi yang paling baik adalah ketika kita berhenti merencanakan dan mulai menerima apa adanya.",
      "Jadi, mau menghindar kaya gimanapun — kalau belum takdir, ya pasti bakal selamat. Santai saja. 😄",
    ],
    upvotes: 3450,
    shares: 267,
    comments: [
      { id: 1, user: "Rini Wijaya", role: "Philosophy Student", avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=rini", comment: "Ini seperti nasihat dari teman yang bijak sekaligus lucu.", created: "4 hari lalu", upvotes: 445 },
    ],
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
      "Khalifah Al-Mu'tasim mendirikan Samarra pada tahun 836 Masehi sebagai ibu kota baru Khilafah Abbasiyah. Dengan investasi besar dan ribuan buruh, kota ini dirancang untuk menjadi jantung kekuasaan. Istana megah, masjid besar, dan jalan-jalan lebar mencerminkan ambisi pembangunannya.",
      "Namun, kehidupan Samarra berakhir dengan sedih. Tanpa peperangan besar atau invasi musuh, kota ini secara bertahap ditinggalkan. Pada akhir abad ke-9, ibu kota dipindahkan, dan Samarra menjadi reruntuhan yang terlupakan.",
      "Cerita Samarra mengajarkan kita bahwa kehancuran tidak selalu datang dari perang. Kadang, kota dan peradaban runtuh dari dalam, karena keputusan buruk, perubahan politik, atau sekadar keberuntungan yang membelok. Inilah 'kota yang mati tanpa musuh.'",
    ],
    upvotes: 2156,
    shares: 98,
    comments: [
      { id: 1, user: "Dr. Bambang Histori", role: "Sejarawan", avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=bambang", comment: "Dokumentasi yang sangat baik tentang periode Samarra. Detailnya akurat.", created: "15 Mei", upvotes: 567 },
    ],
  },
  {
    notificationId: "notif-5",
    id: "5",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=gerakan",
    context: "Gerakan Pemuda Berani Kritis · Dikirimkan ke Ruang yang mungkin Anda sukai · 1 jam yang lalu",
    mainText: "Saya rasa juga demikian",
    subText: "Bagaimana tanggapan kalian tentang kasus korupsi Makarim? Apakah beliau benar tidak bersalah?",
    type: "Pertanyaan",
    isUnread: true,
    author: "Gerakan Pemuda Berani Kritis",
    authorRole: "Aktivis · Pemerhati Sosial",
    fullContent: [
      "Saya rasa juga demikian — kasus ini patut untuk dikaji lebih dalam sebelum kita mengambil kesimpulan.",
      "Banyak yang bertanya: Bagaimana tanggapan kalian tentang kasus korupsi Makarim? Apakah beliau benar tidak bersalah? Ini adalah pertanyaan yang kompleks dan memerlukan data yang valid.",
      "Dari sisi hukum, asas praduga tidak bersalah harus tetap dijunjung. Namun dari sisi publik, transparansi dan akuntabilitas adalah hal yang tidak bisa dikompromikan. Masyarakat berhak tahu.",
      "Gerakan pemuda seperti kita harus berani bersuara, bukan berdasarkan asumsi, tapi berdasarkan fakta dan data. Kritis bukan berarti menghakimi — kritis berarti bertanya dengan dasar yang kuat.",
      "Mari kita tunggu proses hukum yang transparan dan adil. Tapi jangan berhenti mengawasi.",
    ],
    upvotes: 4120,
    shares: 312,
    comments: [
      { id: 1, user: "Andi Pratama", role: "Mahasiswa Hukum", avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=andi", comment: "Setuju, asas praduga tak bersalah harus dihormati sambil tetap kritis.", created: "45 menit lalu", upvotes: 289 },
      { id: 2, user: "Dewi Saraswati", role: "Jurnalis Independen", avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=dewi", comment: "Transparansi adalah kunci. Rakyat berhak mendapat informasi yang jujur.", created: "30 menit lalu", upvotes: 201 },
    ],
  },
  {
    notificationId: "notif-6",
    id: "6",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=kisahkisah",
    context: "Kisah-Kisah yang Terlupakan · Dikirimkan ke Ruang yang mungkin Anda sukai · Rab",
    mainText: "Seperti apa rasanya hidup di zaman pemerintahan Presiden Soeharto?",
    subText: null,
    type: "Pertanyaan",
    isUnread: false,
    author: "Kisah-Kisah yang Terlupakan",
    authorRole: "Penulis Sejarah · Kurator Memori Bangsa",
    fullContent: [
      "Seperti apa rasanya hidup di zaman pemerintahan Presiden Soeharto? Ini adalah pertanyaan yang sering ditanyakan generasi muda kepada orang tua mereka.",
      "Dari cerita para saksi sejarah, kehidupan di era Orde Baru memiliki dua sisi yang sangat berbeda. Di satu sisi, stabilitas ekonomi yang cukup terasa — harga sembako terjangkau, pembangunan infrastruktur masif, dan rasa aman dari gejolak sosial.",
      "Di sisi lain, kebebasan berpendapat sangat dibatasi. Kritik terhadap pemerintah bisa berujung pada penangkapan. Banyak aktivis dan intelektual yang 'menghilang' tanpa penjelasan. Media dikontrol ketat oleh pemerintah.",
      "Seorang ibu dari Jawa Tengah pernah bercerita: 'Dulu kami tidak takut kelaparan, tapi kami takut bicara.' Itulah gambaran yang paling jujur dari era tersebut.",
      "Sejarah harus kita pelajari bukan untuk diulang, tapi untuk menjadi cermin — agar kita bisa membangun bangsa yang lebih baik, lebih adil, dan lebih bebas.",
    ],
    upvotes: 5670,
    shares: 423,
    comments: [
      { id: 1, user: "Pak Harto Jr.", role: "Pensiunan · Saksi Sejarah", avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=harto", comment: "Dua sisi itu benar. Saya hidup di era itu. Kenyang perut, lapar pikiran.", created: "Rab", upvotes: 892 },
    ],
  },
  {
    notificationId: "notif-7",
    id: "7",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=kumpulan",
    context: "Kumpulan kumpulin · Dikirimkan ke Ruang yang mungkin Anda sukai · Rab",
    mainText: "Siapakah Youtuber yang memiliki konten bagus tapi sedikit followers?",
    subText: null,
    type: "Ruang",
    isUnread: false,
    author: "Kumpulan Kumpulin",
    authorRole: "Kurator Konten · Content Enthusiast",
    fullContent: [
      "Siapakah Youtuber yang memiliki konten bagus tapi sedikit followers? Pertanyaan ini selalu menarik karena banyak permata tersembunyi di YouTube yang belum ditemukan.",
      "Beberapa nama yang sering direkomendasikan komunitas:\n• Hujan Tanda Tanya — konten filsafat dan eksistensialisme dalam Bahasa Indonesia yang mendalam\n• Ksatria Animasi — animasi pendek dengan cerita orisinal yang sangat kreatif\n• Pak Tani Digital — edukasi pertanian modern yang jarang dibahas creator lain",
      "Mengapa mereka belum viral? Karena algoritma YouTube cenderung menguntungkan konten yang sudah populer. Konten berkualitas sering tenggelam di antara video clickbait.",
      "Kalau kamu punya rekomendasi lain, tulis di komentar! Mari kita bantu creator-creator kecil yang layak mendapat perhatian lebih.",
    ],
    upvotes: 1890,
    shares: 167,
    comments: [
      { id: 1, user: "Fajar Creative", role: "Content Creator", avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=fajar", comment: "Hujan Tanda Tanya recommended banget! Kontennya dalam dan thoughtful.", created: "Rab", upvotes: 334 },
    ],
  },
  {
    notificationId: "notif-8",
    id: "8",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=literasicerdas",
    context: "Literasi Cerdas · Dikirimkan ke Ruang yang mungkin Anda sukai · Sel",
    mainText: "Apakah lebih baik kemoterapi atau membiarkan kanker sampai meninggal?",
    subText: null,
    type: "Pertanyaan",
    isUnread: false,
    author: "Literasi Cerdas",
    authorRole: "Edukator Kesehatan · Medical Writer",
    fullContent: [
      "Apakah lebih baik kemoterapi atau membiarkan kanker sampai meninggal? Ini adalah pertanyaan yang sangat berat, namun penting untuk dijawab dengan jujur dan berdasarkan bukti ilmiah.",
      "Keputusan ini sangat bergantung pada beberapa faktor krusial:\n• Stadium dan jenis kanker\n• Usia dan kondisi kesehatan umum pasien\n• Keinginan dan kualitas hidup yang diharapkan pasien\n• Dukungan keluarga dan sumber daya yang tersedia",
      "Kemoterapi memang memiliki efek samping yang berat — mual, rambut rontok, kelelahan ekstrem. Namun untuk banyak jenis kanker, kemoterapi terbukti secara signifikan memperpanjang usia dan bahkan menyembuhkan.",
      "Di sisi lain, palliative care (perawatan paliatif) adalah pilihan yang valid untuk pasien yang memilih kualitas hidup daripada memperpanjang usia dengan segala penderitaannya. Ini bukan menyerah — ini adalah pilihan yang terhormat.",
      "Konsultasikan dengan dokter onkologi yang terpercaya. Jangan membuat keputusan ini sendirian. Informasi yang akurat dan dukungan emosional adalah hak setiap pasien.",
    ],
    upvotes: 3280,
    shares: 289,
    comments: [
      { id: 1, user: "dr. Ratna Sp.On", role: "Dokter Onkologi", avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=ratna", comment: "Sebagai onkologis, saya setuju. Keputusan harus dibuat bersama pasien, bukan untuk pasien.", created: "Sel", upvotes: 678 },
      { id: 2, user: "Keluarga Penyintas", role: "Survivor Keluarga", avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=survivor", comment: "Ibu saya memilih palliative care. Itu keputusan terbaik yang bisa kami buat bersama.", created: "Sel", upvotes: 512 },
    ],
  },
];

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

export default function NotificationDetailPage() {
  const { notificationId } = useParams<{ notificationId: string }>();
  const notification = notificationsData.find((n) => n.notificationId === notificationId);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Gunakan avatar asli user — cek avatarUrl lalu avatar (field berbeda tiap backend)
  const myAvatarUrl =
    (user as any)?.avatarUrl ||
    (user as any)?.avatar ||
    `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name || "guest"}`;

  const [upvotes, setUpvotes] = useState(0);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [search, setSearch] = useState("");

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
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <p style={{ color: C.textPrimary, fontSize: 16, fontWeight: 600 }}>Notifikasi tidak ditemukan.</p>
        <button onClick={() => navigate("/notifikasi")} style={{ color: C.blue, background: "none", border: "none", cursor: "pointer", fontSize: 14 }}>
          ← Kembali ke Notifikasi
        </button>
      </div>
    );
  }

  const handleUpvoteClick = () => {
    if (isUpvoted) { setUpvotes((p) => p - 1); setIsUpvoted(false); }
    else { setUpvotes((p) => p + (isDownvoted ? 2 : 1)); setIsUpvoted(true); setIsDownvoted(false); }
  };

  const handleDownvoteClick = () => {
    if (isDownvoted) { setIsDownvoted(false); }
    else { if (isUpvoted) { setUpvotes((p) => p - 1); setIsUpvoted(false); } setIsDownvoted(true); }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const newComment = {
      id: Date.now(),
      user: user?.name || "Anda",
      role: "Member",
      // Pakai avatar asli user, bukan random dicebear
      avatar: myAvatarUrl,
      comment: newCommentText,
      created: "Baru saja",
      upvotes: 0,
    };
    setComments([newComment, ...comments]);
    setNewCommentText("");
  };

  const FONT = "-apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT, paddingBottom: 48 }}>
      <Navbar search={search} onSearchChange={setSearch} />

      {showCreatePost && <CreatePost onClose={() => setShowCreatePost(false)} onSuccess={() => {}} />}

      <main style={{ maxWidth: 680, margin: "0 auto", padding: "16px 12px" }}>
        {/* Back button */}
        <button
          onClick={() => navigate("/notifikasi")}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            color: C.textMuted, background: "none", border: "none",
            cursor: "pointer", fontFamily: FONT, fontSize: 13,
            marginBottom: 12, padding: "4px 0",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = C.textPrimary)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = C.textMuted)}
        >
          <ArrowLeft size={16} /> Kembali ke Notifikasi
        </button>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px" }}>
            {/* Author */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <img src={notification.avatar} alt="avatar"
                style={{ width: 38, height: 38, borderRadius: "50%", border: `1px solid ${C.border}`, flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 13, color: C.textPrimary, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {notification.author}
                </p>
                <p style={{ fontSize: 12, color: C.textMuted, margin: 0 }}>
                  {notification.authorRole} · {notification.context.split("·").pop()?.trim()}
                </p>
              </div>
            </div>

            {/* Title */}
            <h1 style={{ fontSize: 18, fontWeight: 800, color: C.textPrimary, lineHeight: 1.35, margin: "0 0 12px" }}>
              {notification.mainText}
            </h1>

            {/* Subtitle/Question box */}
            {notification.subText && (
              <div style={{ margin: "0 0 16px", padding: "10px 14px", background: `${C.bg}88`, border: `1px solid ${C.border}`, borderRadius: 3 }}>
                <p style={{ fontSize: 14, color: C.textSecondary, margin: 0, lineHeight: 1.5 }}>{notification.subText}</p>
              </div>
            )}

            {/* Divider */}
            <hr style={{ border: "none", borderTop: `1px solid ${C.border}`, margin: "16px 0" }} />

            {/* Full content */}
            <div style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.75, display: "flex", flexDirection: "column", gap: 16 }}>
              {notification.fullContent.map((para, i) => (
                <p key={i} style={{ margin: 0, whiteSpace: "pre-line" }}>{para}</p>
              ))}
            </div>

            {/* Action bar */}
            <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 20, paddingTop: 8, display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
              {/* Upvote/Downvote */}
              <div style={{ display: "flex", alignItems: "center", borderRadius: 100, border: `1px solid ${C.border}`, overflow: "hidden", marginRight: 4 }}>
                <button
                  onClick={handleUpvoteClick}
                  style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
                    background: isUpvoted ? C.blue : "transparent",
                    color: isUpvoted ? "#fff" : C.textSecondary,
                    border: "none", borderRight: `1px solid ${C.border}`,
                    fontFamily: FONT, fontSize: 13, fontWeight: 600, cursor: "pointer",
                  }}
                >
                  <IconUpvote /> Dukung Naik
                  {upvotes > 0 && (
                    <span style={{ fontWeight: 700, color: isUpvoted ? "#fff" : C.textPrimary }}>
                      · {formatCount(upvotes)}
                    </span>
                  )}
                </button>
                <button
                  onClick={handleDownvoteClick}
                  style={{
                    padding: "7px 12px",
                    background: isDownvoted ? C.red : "transparent",
                    color: isDownvoted ? "#fff" : C.textSecondary,
                    border: "none", fontFamily: FONT, cursor: "pointer",
                  }}
                >
                  <IconDownvote />
                </button>
              </div>

              {/* Comment count */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", fontSize: 13, fontWeight: 600, color: C.textSecondary }}>
                <MessageCircle size={16} />
                <span>{formatCount(comments.length)}</span>
              </div>

              {/* Share */}
              <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 100, border: "none", background: "transparent", fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C.textSecondary, cursor: "pointer" }}>
                <Share2 size={16} />
                {notification.shares > 0 && <span>{formatCount(notification.shares)}</span>}
              </button>

              <button style={{ marginLeft: "auto", color: C.textSecondary, background: "transparent", border: "none", cursor: "pointer", padding: "7px" }}>
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div style={{ background: C.bg, borderTop: `1px solid ${C.border}`, padding: "16px 20px" }}>
            {/* Add comment form */}
            <form onSubmit={handleAddComment} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
              <img
                src={myAvatarUrl}
                alt="me"
                style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${C.border}`, flexShrink: 0, objectFit: "cover" }}
              />
              <div style={{ flex: 1, display: "flex", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 100, overflow: "hidden" }}>
                <input
                  type="text" value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Tambahkan komentar..."
                  style={{ flex: 1, padding: "8px 16px", background: "transparent", border: "none", outline: "none", fontFamily: FONT, fontSize: 13, color: C.textPrimary }}
                />
                <button type="submit" style={{ padding: "8px 16px", background: C.blue, border: "none", color: "#fff", fontFamily: FONT, fontSize: 12, fontWeight: 700, cursor: "pointer", borderRadius: "0 100px 100px 0", whiteSpace: "nowrap" }}>
                  Kirim
                </button>
              </div>
            </form>

            {/* Comment list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {comments.length === 0 ? (
                <p style={{ color: C.textMuted, fontSize: 13, textAlign: "center", padding: "8px 0" }}>Belum ada komentar. Jadilah yang pertama!</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} style={{ display: "flex", gap: 10, padding: "12px 14px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 3 }}>
                    <img src={c.avatar} alt="avatar" style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid ${C.border}`, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: C.textPrimary }}>{c.user}</span>
                        <span style={{ fontSize: 11, color: C.textMuted }}>{c.role} · {c.created}</span>
                        {c.upvotes > 0 && <span style={{ marginLeft: "auto", fontSize: 11, color: C.textMuted }}>{formatCount(c.upvotes)} dukung</span>}
                      </div>
                      <p style={{ fontSize: 13, color: C.textSecondary, margin: 0, lineHeight: 1.55 }}>{c.comment}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
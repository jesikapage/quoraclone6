import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react"; // Pastikan lucide-react terpasang

// SVG Icon Panah Kembali untuk Mobile
const IconBack = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

// SVG Lonceng Besar untuk Empty State
const BigBellIcon = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    <circle cx="12" cy="12" r="10" stroke="#333" strokeWidth="0.5" fill="#262626" opacity="0.3"/>
  </svg>
);

export default function Notifikasi() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("Semua Notifikasi");

  // Daftar menu filter kiri sesuai gambar
  const filters = [
    "Semua Notifikasi", 
    "Kisah", 
    "Pertanyaan", 
    "Ruang", 
    "Pembaruan tentang orang", 
    "Komentar dan sebutan", 
    "Dukung Naik", 
    "Konten Anda", 
    "Profil Anda", 
    "Pengumuman"
  ];

  // Data notifikasi dengan konten detail yang unik sesuai judul
  const [notifications, setNotifications] = useState([
    { 
      id: "1", 
      notificationId: "notif-1",
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
      comments: [
        { id: 1, user: "Budi Santoso", role: "Software Engineer", comment: "Sangat relevan dengan era sekarang. Privacy bukan lagi luxury.", created: "2 jam lalu" },
        { id: 2, user: "Siti Nurhayati", role: "Digital Analyst", comment: "Ini kenapa saya mulai menggunakan privacy tools dan VPN.", created: "1 jam lalu" }
      ]
    },
    { 
      id: "2", 
      notificationId: "notif-2",
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
      comments: [
        { id: 1, user: "Ahmad Ridho", role: "Pemain Berpengalaman", comment: "Tips yang sangat praktis. RTP memang kunci utamanya.", created: "3 hari lalu" }
      ]
    },
    { 
      id: "3", 
      notificationId: "notif-3",
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
      comments: [
        { id: 1, user: "Rini Wijaya", role: "Philosophy Student", comment: "Ini seperti nasihat dari teman yang bijak sekaligus lucu.", created: "4 hari lalu" }
      ]
    },
    { 
      id: "4", 
      notificationId: "notif-4",
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
        "Cerita Samarra mengajarkan kita bahwa kehancuran tidak selalu datang dari perang. Kadang, kota dan peradaban runtuh dari dalam, karena keputusan buruk, perubahan poli tik, atau sekadar keberuntungan yang membelok."
      ],
      comments: [
        { id: 1, user: "Dr. Bambang Histori", role: "Sejarawan", comment: "Dokumentasi yang sangat baik tentang periode Samarra. Detailnya akurat.", created: "15 Mei" }
      ]
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isUnread: false })));
  };

  const filteredNotif = activeFilter === "Semua Notifikasi" 
    ? notifications 
    : notifications.filter(n => n.type === activeFilter);

  return (
    <div className="min-h-screen bg-[#181919] text-[#e2e2e2] font-sans pb-10">
      
      {/* Header Mobile (Opsional, disembunyikan di layar besar agar mirip desktop Quora) */}
      <header className="bg-[#262626] border-b border-[#333] sticky top-0 h-[50px] flex md:hidden items-center z-30 shadow-sm">
        <div className="w-full flex items-center gap-4 px-4">
          <Link to="/" className="text-[#939598] hover:text-[#e2e2e2] p-1.5 rounded-full hover:bg-[#333]">
            <IconBack />
          </Link>
          <span className="font-bold text-sm tracking-wide">Notifikasi</span>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="max-w-[1000px] mx-auto px-4 pt-6 flex gap-8">
        
        {/* SISI KIRI: Menu Filter */}
        <aside className="w-[180px] flex-shrink-0 hidden md:block">
          <p className="text-[15px] font-bold text-[#e2e2e2] mb-3 pb-2 border-b border-[#333]">Filter</p>
          <div className="space-y-0.5">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`w-full text-left text-[13px] px-3 py-1.5 rounded-[4px] transition-all ${
                  activeFilter === filter 
                    ? "bg-[#b92b27]/10 text-[#b92b27] font-semibold" // Warna merah pudar ala Quora
                    : "text-[#939598] hover:bg-[#262626] hover:text-[#e2e2e2]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </aside>

        {/* TENGAH: List Item Notifikasi */}
        <main className="flex-1 min-w-0 max-w-[650px]">
          
          {/* Header Konten (Judul & Aksi) */}
          <div className="flex justify-between items-end mb-4 pb-2 border-b border-[#333]">
            <h2 className="text-[15px] font-bold text-[#e2e2e2]">
              {activeFilter === "Semua Notifikasi" ? "Notifikasi" : activeFilter}
            </h2>
            <div className="text-[13px] text-[#939598] flex gap-1">
              <button onClick={markAllAsRead} className="hover:underline">Tandai Semua Sudah Dibaca</button>
              <span>·</span>
              <button className="hover:underline">Setelan</button>
            </div>
          </div>

          {/* Render List Notifikasi */}
          <div className="bg-[#262626] rounded-[4px] border border-[#333] overflow-hidden">
            {filteredNotif.map((notif, index) => (
              <div 
                key={notif.id} 
                onClick={() => navigate(`/notification/${notif.notificationId}`)}
                className={`flex gap-3 p-4 cursor-pointer transition-all border-b border-[#333] last:border-0 hover:bg-[#2c2d2e] ${
                  notif.isUnread ? "bg-[#1f242e]/50" : "bg-transparent"
                }`}
              >
                {/* Avatar */}
                <img src={notif.avatar} alt="avatar" className="w-10 h-10 rounded-full border border-[#444] flex-shrink-0" />

                {/* Konten Notifikasi */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[#939598] mb-1 leading-snug">
                    {notif.context}
                  </p>
                  <p className="text-[15px] font-bold text-[#e2e2e2] leading-snug mb-1">
                    {notif.mainText}
                  </p>
                  
                  {notif.subText && (
                    <div className="text-[14px] text-[#d5d6d7] mt-2 p-2.5 border border-[#444] rounded-[4px] bg-[#181919]/50">
                      {notif.subText}
                    </div>
                  )}
                </div>

                {/* Tombol Opsi (Titik Tiga) */}
                <button 
                  onClick={(e) => e.stopPropagation()} 
                  className="text-[#939598] hover:text-[#e2e2e2] hover:bg-[#333] h-fit p-1.5 rounded-full transition"
                >
                  <MoreHorizontal size={18} />
                </button>
              </div>
            ))}

            {/* EMPTY STATE: Jika tidak ada notifikasi di filter tersebut (Sesuai Gambar 2) */}
            {filteredNotif.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="mb-4">
                  <BigBellIcon />
                </div>
                <h3 className="text-[16px] font-bold text-[#e2e2e2] mb-2">
                  Tidak Ada Notifikasi Baru
                </h3>
                <p className="text-[13px] text-[#939598] max-w-[350px] leading-relaxed">
                  Notifikasi yang Anda terima dalam jangka waktu 30 hari terakhir akan ditampilkan di sini.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
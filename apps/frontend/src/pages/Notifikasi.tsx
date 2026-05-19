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

  // Data notifikasi yang direplikasi dari gambar Quora asli
  const [notifications, setNotifications] = useState([
    { 
      id: "1", 
      postId: "101", 
      avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=anomali",
      context: "Anomali Warga RT sebelah · Dikirimkan ke Ruang yang mungkin Anda sukai · 6 jam yang lalu", 
      mainText: "Jejak digital itu real kawan.", 
      subText: "Apa fakta yang membuatmu terheran-heran hari ini?",
      type: "Ruang",
      isUnread: false 
    },
    { 
      id: "2", 
      postId: "102", 
      avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=talulah",
      context: "Ruang Talulah Rhym · Dijawab di Ruang yang mungkin Anda sukai · 12 Mei", 
      mainText: "Apa tips cara bermain di situs slot agar mendapatkan maxwin?", 
      subText: null,
      type: "Ruang",
      isUnread: false 
    },
    { 
      id: "3", 
      postId: "101", 
      avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=darkstory",
      context: "Dark (humor) story · Dikirimkan ke Ruang yang mungkin Anda sukai · 5 Mei", 
      mainText: "Hidup itu lucu, mau menghindar kaya gimanapun kalau blm takdir pasti bakal selamat.", 
      subText: null,
      type: "Kisah",
      isUnread: true 
    },
    { 
      id: "4", 
      postId: "102", 
      avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=historia",
      context: "Historia Magistra · Dikirimkan ke Ruang yang mungkin Anda sukai · 21 April", 
      mainText: "Kota yang Mati Tanpa Musuh", 
      subText: null,
      type: "Kisah",
      isUnread: false 
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
                onClick={() => navigate(`/post/${notif.postId}`)}
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
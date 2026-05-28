import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react"; 
import { useAuthStore } from "../stores/auth.store"; // Mengambil store auth untuk info user & logout
import CreatePost from "./CreatePost"; // Mengimpor komponen modal tambah pertanyaan

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
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("Semua Notifikasi");

  // State untuk kontrol Navbar & Modal
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeNav, setActiveNav] = useState("notif"); // Set default "notif" karena berada di halaman Notifikasi

  // Mengatur penutupan menu profil otomatis saat klik di luar area profil
  useEffect(() => {
    function handleClickOutside() { setShowMenu(null); }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Daftar menu filter kiri
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

  // Data notifikasi
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
      
      {/* Navbar Utama (Sama persis seperti di Beranda) */}
      <nav className="h-[50px] bg-[#262626] border-b border-[#333] sticky top-0 z-30">
        <div className="max-w-[1000px] mx-auto h-full flex items-center gap-2 px-4">
          <span
            className="text-[#b92b27] text-2xl font-bold tracking-tighter cursor-pointer select-none mr-2"
            onClick={() => navigate("/")}
          >
            Quora
          </span>

          <div className="flex-1 max-w-[340px]">
            <div className="flex items-center gap-2 bg-[#181919] border border-[#444] rounded-[3px] px-3 py-1.5 hover:border-[#636466] transition">
              <span className="text-[#636466]"><IconSearch /></span>
              <input
                type="text"
                placeholder="Cari Quora"
                className="bg-transparent text-sm text-[#e2e2e2] outline-none w-full placeholder-[#636466]"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <Link
              to="/"
              onClick={() => setActiveNav("home")}
              title="Beranda"
              className={`flex items-center justify-center w-10 h-10 rounded-[3px] transition ${
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
              className="ml-2 flex items-center gap-1.5 bg-[#2b69d1] hover:bg-[#3277ed] text-white text-sm font-semibold px-4 py-1.5 rounded-[3px] transition"
            >
              <IconPencil />
              Tambah Pertanyaan
            </button>

            <div className="relative ml-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowMenu(showMenu === "profile" ? null : "profile")}
                className="flex items-center gap-1 hover:bg-[#333] rounded-[3px] p-1 transition"
              >
                <img
                  src={user?.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name}`}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border border-[#444]"
                />
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#636466" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
              </button>

              {showMenu === "profile" && (
                <div className="absolute right-0 top-11 bg-[#2e2e2e] border border-[#444] rounded-[3px] shadow-lg z-40 w-52 py-1">
                  <div className="px-4 py-3 border-b border-[#444]">
                    <p className="text-sm font-bold text-[#e2e2e2]">{user?.name || "Pengguna"}</p>
                    <p className="text-xs text-[#636466] mt-0.5">Lihat profil</p>
                  </div>
                  <button onClick={() => { navigate("/profile/edit"); setShowMenu(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-[#e2e2e2] hover:bg-[#3a3a3a] transition">
                    <span>👤</span>Edit Profil
                  </button>
                  <button onClick={() => setShowMenu(null)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-[#e2e2e2] hover:bg-[#3a3a3a] transition">
                    <span>⚙️</span>Pengaturan
                  </button>
                  <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-[#e2e2e2] hover:bg-[#3a3a3a] transition">
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
                    ? "bg-[#b92b27]/10 text-[#b92b27] font-semibold" 
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
            {filteredNotif.map((notif) => (
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

            {/* EMPTY STATE */}
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
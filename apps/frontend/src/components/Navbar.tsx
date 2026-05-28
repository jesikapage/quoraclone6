import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../stores/auth.store";

// Icons
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

interface NavbarProps {
  activeNav?: string;
  onNavChange?: (nav: string) => void;
  onCreatePost?: () => void;
}

export default function Navbar({ activeNav = "home", onNavChange, onCreatePost }: NavbarProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavClick = (nav: string, path: string) => {
    onNavChange?.(nav);
    navigate(path);
  };

  return (
    <nav className="h-[50px] bg-[#262626] border-b border-[#333] sticky top-0 z-30">
      <div className="max-w-[1000px] mx-auto h-full flex items-center gap-2 px-4">
        <span
          className="text-[#b92b27] text-2xl font-bold tracking-tighter cursor-pointer select-none mr-2"
          onClick={() => handleNavClick("home", "/")}
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
            onClick={() => onNavChange?.("home")}
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
            onClick={() => onNavChange?.("notif")}
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
            onClick={onCreatePost}
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
  );
}

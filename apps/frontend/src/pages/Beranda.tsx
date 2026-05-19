import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/auth.store";
import { useNavigate, Link } from "react-router-dom";
import CreatePost from "./CreatePost";

type Post = {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  user: {
    name: string;
    avatar_url: string;
    credential?: string;
  };
  upvotes: number;
  comments: number;
  shares: number;
  upvotedBy: string[];
  downvotedBy: string[];
  sharedBy: string[];
};

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
const IconDots = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
  </svg>
);
// ──────────────────────────────────────────────────────────────────────────

export default function Beranda() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeNav, setActiveNav] = useState("home");

  useEffect(() => {
    const dummyPosts: Post[] = [
      {
        id: "101",
        content: "Bagaimana cara mengoptimalkan penggunaan AWS Lambda untuk backend aplikasi skala besar?",
        image_url: null,
        created_at: "2026-05-16T12:00:00Z",
        user: {
          name: "Rito Backend Developer",
          avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Rito",
          credential: "Software Engineer · AWS Certified",
        },
        upvotes: 9400,
        comments: 288,
        shares: 279,
        upvotedBy: [],
        downvotedBy: [],
        sharedBy: [],
      },
      {
        id: "102",
        content: "Desain Dark Mode Quora Clone kita malam ini terlihat sangat responsif menggunakan Tailwind CSS!",
        image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500",
        created_at: "2026-05-16T14:30:00Z",
        user: {
          name: "Prilia UI/UX",
          avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Prilia",
          credential: "UI/UX Designer · Figma Expert",
        },
        upvotes: 7,
        comments: 3,
        shares: 1,
        upvotedBy: [],
        downvotedBy: [],
        sharedBy: [],
      },
    ];
    setPosts(dummyPosts);
  }, []);

  useEffect(() => {
    function handleClickOutside() { setShowMenu(null); }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => { logout(); navigate("/login"); };

  function handleUpvote(postId: string) {
    const userId = user?.id || "guest";
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const alreadyUp = post.upvotedBy.includes(userId);
        return {
          ...post,
          upvotes: alreadyUp ? post.upvotes - 1 : post.upvotes + 1,
          upvotedBy: alreadyUp
            ? post.upvotedBy.filter((id) => id !== userId)
            : [...post.upvotedBy, userId],
          downvotedBy: post.downvotedBy.filter((id) => id !== userId),
        };
      })
    );
  }

  function handleDownvote(postId: string) {
    const userId = user?.id || "guest";
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const alreadyDown = post.downvotedBy.includes(userId);
        const wasUpvoted = post.upvotedBy.includes(userId);
        return {
          ...post,
          downvotedBy: alreadyDown
            ? post.downvotedBy.filter((id) => id !== userId)
            : [...post.downvotedBy, userId],
          upvotes: wasUpvoted ? post.upvotes - 1 : post.upvotes,
          upvotedBy: wasUpvoted
            ? post.upvotedBy.filter((id) => id !== userId)
            : post.upvotedBy,
        };
      })
    );
  }

  function handleShare(postId: string) {
    const userId = user?.id || "guest";
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const alreadyShared = post.sharedBy.includes(userId);
        return {
          ...post,
          shares: alreadyShared ? post.shares - 1 : post.shares + 1,
          sharedBy: alreadyShared
            ? post.sharedBy.filter((id) => id !== userId)
            : [...post.sharedBy, userId],
        };
      })
    );
  }

  function formatCount(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(".0", "") + " jt";
    if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + " rb";
    return String(n);
  }

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    const now = new Date();
    const diffH = Math.floor((now.getTime() - d.getTime()) / 3600000);
    if (diffH < 1) return "baru saja";
    if (diffH < 24) return `${diffH} jam lalu`;
    const diffD = Math.floor(diffH / 24);
    if (diffD < 7) return `${diffD} hari lalu`;
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <div className="min-h-screen bg-[#181919] text-[#e2e2e2] font-sans">

      {/* ── Navbar ── */}
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
            {[
              { key: "home", icon: <IconHome />, label: "Beranda", to: "/" },
              { key: "notif", icon: <IconBell />, label: "Notifikasi", to: "/notifikasi" },
            ].map((item) => (
              <Link
                key={item.key}
                to={item.to}
                onClick={() => setActiveNav(item.key)}
                title={item.label}
                className={`flex items-center justify-center w-10 h-10 rounded-[3px] transition ${
                  activeNav === item.key
                    ? "text-[#b92b27] border-b-2 border-[#b92b27]"
                    : "text-[#636466] hover:bg-[#333] hover:text-[#e2e2e2]"
                }`}
              >
                {item.icon}
              </Link>
            ))}

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
                  {[
                    { icon: "👤", label: "Edit Profil", action: () => { navigate("/profile/edit"); setShowMenu(null); } },
                    { icon: "⚙️", label: "Pengaturan", action: () => setShowMenu(null) },
                    { icon: "🚪", label: "Keluar", action: handleLogout },
                  ].map((item) => (
                    <button key={item.label} onClick={item.action}
                      className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-[#e2e2e2] hover:bg-[#3a3a3a] transition"
                    >
                      <span>{item.icon}</span>{item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Main layout ── */}
      <div className="max-w-[1000px] mx-auto px-4 pt-5 flex gap-5">

        {/* Feed */}
        <main className="flex-1 min-w-0 max-w-[570px] space-y-3">

          {/* Shortcut bar */}
          <div className="bg-[#262626] border border-[#333] rounded-[3px] px-4 py-3 flex items-center gap-3">
            <img
              src={user?.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name}`}
              alt="avatar"
              className="w-8 h-8 rounded-full border border-[#444]"
            />
            <button
              onClick={() => setShowCreatePost(true)}
              className="flex-1 text-left text-sm text-[#636466] bg-[#181919] border border-[#444] hover:border-[#2b69d1] rounded-[3px] px-3 py-2 transition"
            >
              Tambahkan pertanyaan atau tautan
            </button>
          </div>

          {showCreatePost && (
            <CreatePost onClose={() => setShowCreatePost(false)} onSuccess={() => {}} />
          )}

          {posts.map((post) => {
            const userId = user?.id || "guest";
            const isUpvoted = post.upvotedBy.includes(userId);
            const isDownvoted = post.downvotedBy.includes(userId);
            const isShared = post.sharedBy.includes(userId);

            return (
              <div key={post.id} className="bg-[#262626] border border-[#333] rounded-[3px] overflow-hidden">

                <div className="flex items-start justify-between px-4 pt-4 pb-2">
                  <div className="flex items-start gap-2.5">
                    <img src={post.user.avatar_url} alt="user" className="w-9 h-9 rounded-full border border-[#444] flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-[#e2e2e2] leading-tight hover:underline cursor-pointer">{post.user.name}</p>
                      {post.user.credential && (
                        <p className="text-[12px] text-[#636466] leading-tight">{post.user.credential}</p>
                      )}
                      <p className="text-[11px] text-[#636466] mt-0.5">{formatDate(post.created_at)}</p>
                    </div>
                  </div>

                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setShowMenu(showMenu === post.id ? null : post.id)}
                      className="text-[#636466] hover:text-[#e2e2e2] hover:bg-[#333] p-1.5 rounded-full transition"
                    >
                      <IconDots />
                    </button>
                    {showMenu === post.id && (
                      <div className="absolute right-0 top-9 bg-[#2e2e2e] border border-[#444] rounded-[3px] shadow-lg z-20 w-56 py-1">
                        {[
                          { icon: "🔗", label: "Salin tautan", action: () => { navigator.clipboard.writeText(`${window.location.origin}/komentar/${post.id}`); setShowMenu(null); } },
                          { icon: "🚫", label: "Tidak tertarik dengan ini", action: () => setShowMenu(null) },
                          { icon: "🔖", label: "Simpan", action: () => setShowMenu(null) },
                          { icon: "⬇️", label: "Dukung turun pertanyaan", action: () => { handleDownvote(post.id); setShowMenu(null); } },
                          { icon: "🚩", label: "Laporkan", action: () => setShowMenu(null) },
                        ].map((item) => (
                          <button key={item.label} onClick={item.action}
                            className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-[#e2e2e2] hover:bg-[#3a3a3a] transition"
                          >
                            <span>{item.icon}</span>{item.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Konten — bold besar seperti Quora */}
                <div className="px-4 pb-3">
                  <p className="text-[17px] font-semibold text-[#e2e2e2] leading-snug hover:text-[#2b69d1] cursor-pointer transition">
                    {post.content}
                  </p>
                </div>

                {post.image_url && (
                  <div className="pb-3 px-4">
                    <img src={post.image_url} alt="post" className="w-full max-h-72 object-cover rounded-[3px] border border-[#333]" />
                  </div>
                )}

                {/* Action bar */}
                <div className="border-t border-[#333] px-3 py-1 flex items-center gap-1">

                  <div className="flex items-center rounded-full border border-[#444] overflow-hidden mr-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleUpvote(post.id); }}
                      className={`flex items-center gap-1.5 pl-3 pr-2.5 py-1.5 text-[13px] font-medium transition ${
                        isUpvoted ? "bg-[#2b69d1] text-white" : "text-[#939598] hover:bg-[#1a3a6b] hover:text-[#e2e2e2]"
                      }`}
                    >
                      <IconUpvote />
                      <span>Dukung Naik</span>
                      {post.upvotes > 0 && (
                        <span className={`ml-0.5 font-semibold ${isUpvoted ? "text-white" : "text-[#e2e2e2]"}`}>
                          · {formatCount(post.upvotes)}
                        </span>
                      )}
                    </button>
                    <div className="w-px h-5 bg-[#444]" />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDownvote(post.id); }}
                      className={`px-2.5 py-1.5 transition ${
                        isDownvoted ? "bg-[#b92b27] text-white" : "text-[#939598] hover:bg-[#3d1010] hover:text-[#e2e2e2]"
                      }`}
                      title="Dukung Turun"
                    >
                      <IconDownvote />
                    </button>
                  </div>

                  <Link
                    to={`/komentar/${post.id}`}
                    className="flex items-center gap-1.5 text-[13px] font-medium text-[#939598] hover:bg-[#333] hover:text-[#e2e2e2] px-3 py-1.5 rounded-full transition"
                  >
                    <IconComment />
                    {post.comments > 0 && <span>{formatCount(post.comments)}</span>}
                  </Link>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleShare(post.id); }}
                    className={`flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-full transition ${
                      isShared ? "text-[#2b69d1]" : "text-[#939598] hover:bg-[#333] hover:text-[#e2e2e2]"
                    }`}
                  >
                    <IconShare />
                    {post.shares > 0 && <span>{formatCount(post.shares)}</span>}
                  </button>

                  <button className="ml-auto text-[#939598] hover:bg-[#333] hover:text-[#e2e2e2] p-1.5 rounded-full transition">
                    <IconDots />
                  </button>
                </div>

              </div>
            );
          })}
        </main>

        {/* Sidebar kanan */}
        <aside className="w-[300px] flex-shrink-0 hidden lg:block space-y-4">
          <div className="bg-[#262626] border border-[#333] rounded-[3px] overflow-hidden">
            <div className="h-16 bg-gradient-to-r from-[#b92b27] to-[#8b1a18]" />
            <div className="px-4 pb-4 -mt-8">
              <img
                src={user?.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name}`}
                alt="avatar"
                className="w-16 h-16 rounded-full border-4 border-[#262626]"
              />
              <p className="font-bold text-[15px] text-[#e2e2e2] mt-2">{user?.name || "Pengguna"}</p>
              <p className="text-[12px] text-[#636466] mt-0.5">Mahasiswa · Quora Clone</p>
              <Link
                to="/profile/edit"
                className="mt-3 block text-center text-sm font-semibold text-[#2b69d1] border border-[#2b69d1] hover:bg-[#1a3a6b] rounded-[3px] px-3 py-1.5 transition"
              >
                Edit Profil
              </Link>
            </div>
          </div>

          <div className="bg-[#262626] border border-[#333] rounded-[3px] p-4">
            <p className="font-bold text-[13px] text-[#e2e2e2] mb-3">Topik yang Relevan</p>
            {["Teknologi", "Pemrograman Web", "UI/UX Design", "Backend Development", "Cloud Computing"].map((topic) => (
              <div key={topic} className="flex items-center gap-2 py-1.5 hover:bg-[#333] -mx-2 px-2 rounded-[3px] cursor-pointer transition group">
                <div className="w-7 h-7 bg-[#333] rounded-[3px] flex items-center justify-center text-xs">🏷️</div>
                <span className="text-[13px] text-[#e2e2e2] group-hover:text-[#2b69d1] transition">{topic}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-[#636466] px-1 leading-relaxed">
            Tentang · Karir · Privasi · Ketentuan · © 2026 Quora Clone, Kelompok 6 PPWL
          </p>
        </aside>
      </div>
    </div>
  );
}
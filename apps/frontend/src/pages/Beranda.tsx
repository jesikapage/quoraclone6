import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/auth.store";
import { useNavigate, Link } from "react-router-dom";

// Struktur data Post sesuai skema DB di instruksi
type Post = {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  user: {
    name: string;
    avatar_url: string;
  };
};

export default function Beranda() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // DUMMY DATA SQL - Menyimulasikan hasil GET dari AWS Lambda nantinya
    const dummyPostsFromSQL: Post[] = [
      {
        id: "101",
        content: "Bagaimana cara mengoptimalkan penggunaan AWS Lambda untuk backend aplikasi skala besar?",
        image_url: null,
        created_at: "2026-05-16T12:00:00Z",
        user: {
          name: "Rito Backend Developer",
          avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Rito"
        }
      },
      {
        id: "102",
        content: "Desain Dark Mode Quora Clone kita malam ini terlihat sangat responsif menggunakan Tailwind CSS!",
        image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500",
        created_at: "2026-05-16T14:30:00Z",
        user: {
          name: "Prilia UI/UX",
          avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Prilia"
        }
      }
    ];

    setPosts(dummyPostsFromSQL);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#181919] text-[#e2e2e2] p-6">
      {/* Mini Navbar Component */}
      <nav className="max-w-2xl mx-auto flex justify-between items-center border-b border-[#333] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <img src={user?.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full border border-[#444]" />
          <div>
            <h1 className="text-lg font-bold text-[#b92b27]">Quora Clone</h1>
            <p className="text-xs text-[#939598]">Halo, {user?.name || "Tamu"}</p>
          </div>
        </div>
        <div className="flex gap-4 text-sm">
          <Link to="/" className="hover:underline text-[#2b69d1]">Beranda</Link>
          <Link to="/notifikasi" className="hover:underline">Notifikasi</Link>
          <button onClick={handleLogout} className="text-red-500 hover:underline">Keluar</button>
        </div>
      </nav>

      {/* Main Feed */}
      <main className="max-w-2xl mx-auto space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-[#262626] border border-[#333] p-4 rounded-md">
            <div className="flex items-center gap-2 mb-3">
              <img src={post.user.avatar_url} alt="user" className="w-8 h-8 rounded-full" />
              <span className="font-bold text-sm text-[#eee]">{post.user.name}</span>
            </div>
            <p className="text-sm text-[#e2e2e2] mb-4">{post.content}</p>
            {post.image_url && (
              <img src={post.image_url} alt="post-img" className="rounded-md w-full max-h-60 object-cover mb-4" />
            )}
            <div className="border-t border-[#333] pt-2">
              <Link to={`/komentar/${post.id}`} className="text-xs text-[#2b69d1] hover:underline font-semibold">
                💬 Lihat Komentar (1 Level)
              </Link>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
import { useState } from "react";
import { Plus, Search, X, Users, Check } from "lucide-react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

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

const FONT = "-apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

type Space = {
  id: number;
  name: string;
  description: string;
  image: string;
  membersCount: string;
};

const SPACES: Space[] = [
  {
    id: 1,
    name: "Tips of Life",
    description: "Ruang ini membahas tentang tips-tips seputar kehidupan",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=80",
    membersCount: "12,4 rb",
  },
  {
    id: 2,
    name: "Debate Club",
    description: "Ruang untuk Diskusi dan Debat",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
    membersCount: "8,7 rb",
  },
  {
    id: 3,
    name: "Psikologi Cinta",
    description: "Ruang ini dibuat untuk belajar tentang cinta, pasangan hidup serta tips hubungan kasmaraan",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80",
    membersCount: "23,1 rb",
  },
  {
    id: 4,
    name: "Muslim Inklusif",
    description: "Tempat segala masalah Islam dan Muslim didiskusikan dengan Tuhan sebagai penenta...",
    image: "https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=400&q=80",
    membersCount: "31,6 rb",
  },
  {
    id: 5,
    name: "Kisah-Kisah yang Terlupakan",
    description: "menggali misteri sejarah umat manusia",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80",
    membersCount: "5,2 rb",
  },
  {
    id: 6,
    name: "Info IHSG",
    description: "Update IHSG dan analisa teknikal saham harian",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80",
    membersCount: "18,9 rb",
  },
  {
    id: 7,
    name: "Semua tentang sejarah",
    description: "Ruang ini dibuat untuk rekan-rekan Quora yang ingin mengetahui...",
    image: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=400&q=80",
    membersCount: "9,4 rb",
  },
  {
    id: 8,
    name: "Gerakan Pemuda Berani Kritis",
    description: "Sekumpulan para pemuda dan pemudi yang suka berpendapat dan berani...",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    membersCount: "6,8 rb",
  },
  {
    id: 9,
    name: "Siswa ambis",
    description: "Tempat berkumpulnya siswa untuk mengambis secara sehat.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80",
    membersCount: "14,3 rb",
  },
  {
    id: 10,
    name: "EvolusiDiri.my.id",
    description: "EvolusiDiri menjadi lebih baik setiap harinya.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80",
    membersCount: "4,1 rb",
  },
  {
    id: 11,
    name: "Wawasan Tanpa Batas",
    description: "Ada Semua",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80",
    membersCount: "7,5 rb",
  },
  {
    id: 12,
    name: "Soal Rasa",
    description: "Permasalahan Cinta, Pasangan, Rumah Tangga",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80",
    membersCount: "19,2 rb",
  },
  {
    id: 13,
    name: "Kumpulan kumpulin",
    description: "Sekadar sarana ruangan ini di kunjungi ketika saat anda hendak tidur atau malam hari",
    image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&q=80",
    membersCount: "3,8 rb",
  },
  {
    id: 14,
    name: "Segalanya Tentang Film",
    description: "Diskusi seru dan informasi terkait dunia film",
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80",
    membersCount: "22,7 rb",
  },
  {
    id: 15,
    name: "Journaling 101",
    description: "My darling, be patient with yourself. Healing takes time. (Alexandra Vasiliu)",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
    membersCount: "11,0 rb",
  },
  {
    id: 16,
    name: "Kumpulan Sarjana S.Kom",
    description: "Ruangan ini hanya untuk bersenang – senang saja. Dilarang gabung bagi...",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80",
    membersCount: "2,9 rb",
  },
];

type Invitation = {
  id: number;
  spaceName: string;
  invitedBy: string;
  avatar: string;
};

const INVITATIONS: Invitation[] = [
  {
    id: 1,
    spaceName: "Historia Magistra",
    invitedBy: "Zacharias",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Zacharias",
  },
  {
    id: 2,
    spaceName: "Ngopi di Kayangan",
    invitedBy: "Zacharias",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Kayangan",
  },
];

function SpaceCard({ space }: { space: Space }) {
  const [joined, setJoined] = useState(false);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: hovered ? C.surfaceHover : C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.15s",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Cover image */}
      <div style={{ height: 80, overflow: "hidden", position: "relative" }}>
        <img
          src={space.image}
          alt={space.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6))" }} />
      </div>

      {/* Content */}
      <div style={{ padding: "10px 12px", flex: 1, display: "flex", flexDirection: "column" }}>
        <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: C.textPrimary, margin: "0 0 4px 0", lineHeight: 1.3 }}>
          {space.name}
        </p>
        <p style={{ fontFamily: FONT, fontSize: 11, color: C.textMuted, margin: "0 0 10px 0", lineHeight: 1.4, flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>
          {space.description}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: FONT, fontSize: 11, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}>
            <Users size={11} /> {space.membersCount}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); setJoined(!joined); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 10px",
              borderRadius: 100,
              border: "none",
              background: joined ? "#3A7AEF20" : C.blue,
              color: joined ? C.blue : "#fff",
              fontFamily: FONT,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {joined ? <><Check size={11} /> Bergabung</> : <><Plus size={11} /> Ikuti</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Ruang() {
  const [search, setSearch] = useState("");
  const [spaceSearch, setSpaceSearch] = useState("");
  const [invitations, setInvitations] = useState(INVITATIONS);

  const dismissInvitation = (id: number) => {
    setInvitations((prev) => prev.filter((inv) => inv.id !== id));
  };

  const filteredSpaces = spaceSearch
    ? SPACES.filter((s) => s.name.toLowerCase().includes(spaceSearch.toLowerCase()))
    : SPACES;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT }}>
      <Navbar search={search} onSearchChange={setSearch} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 12px", display: "flex", gap: 20 }}>
        {/* Main */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Welcome Banner */}
          <div style={{
            background: `linear-gradient(135deg, ${C.surface} 0%, #2a2a3a 100%)`,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: "20px 24px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}>
            <div>
              <h1 style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: C.textPrimary, margin: "0 0 6px 0" }}>
                Selamat datang di Ruang!
              </h1>
              <p style={{ fontFamily: FONT, fontSize: 14, color: C.textSecondary, margin: "0 0 14px 0" }}>
                Ikuti Ruang untuk menjelajahi minat Anda di Quora.
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 16px",
                  borderRadius: 100,
                  border: `1px solid ${C.border}`,
                  background: "transparent",
                  color: C.textPrimary,
                  fontFamily: FONT,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}>
                  <Plus size={14} /> Buat ruang
                </button>
                <button style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 16px",
                  borderRadius: 100,
                  border: `1px solid ${C.border}`,
                  background: "transparent",
                  color: C.textPrimary,
                  fontFamily: FONT,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}>
                  <Search size={14} /> Temukan Ruang
                </button>
              </div>
            </div>
            <div style={{ fontSize: 56, flexShrink: 0, display: "flex", gap: 6 }} className="ruang-emoji">
              🚀🎯🌟
            </div>
          </div>

          {/* Search bar for spaces */}
          <div style={{ position: "relative", marginBottom: 16 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.textMuted }} />
            <input
              type="text"
              placeholder="Cari Ruang..."
              value={spaceSearch}
              onChange={(e) => setSpaceSearch(e.target.value)}
              style={{
                width: "100%",
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 100,
                padding: "9px 16px 9px 36px",
                fontFamily: FONT,
                fontSize: 14,
                color: C.textPrimary,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Section title */}
          <h2 style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.textPrimary, marginBottom: 12 }}>
            Temukan Ruang
          </h2>

          {/* Spaces Grid */}
          <div className="ruang-grid">
            {filteredSpaces.length > 0 ? (
              filteredSpaces.map((space) => (
                <SpaceCard key={space.id} space={space} />
              ))
            ) : (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 0", color: C.textMuted }}>
                <div style={{ fontSize: 40 }}>🔍</div>
                <p style={{ fontFamily: FONT, fontSize: 14, marginTop: 12 }}>Tidak ada ruang yang ditemukan untuk "{spaceSearch}"</p>
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar - Invitations */}
        {invitations.length > 0 && (
          <aside className="ruang-right-sidebar" style={{ width: 260, flexShrink: 0 }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
                <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: C.textPrimary, margin: 0 }}>
                  Undangan yang Tertunda
                </p>
              </div>
              {invitations.map((inv) => (
                <div key={inv.id} style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <img
                      src={inv.avatar}
                      alt={inv.spaceName}
                      style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, border: `1px solid ${C.border}` }}
                    />
                    <div>
                      <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C.textPrimary, margin: 0 }}>
                        {inv.spaceName}
                      </p>
                      <p style={{ fontFamily: FONT, fontSize: 11, color: C.textMuted, margin: 0 }}>
                        Diundang sebagai pengikut oleh {inv.invitedBy}.
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      style={{
                        flex: 1,
                        padding: "6px 0",
                        borderRadius: 100,
                        border: "none",
                        background: C.blue,
                        color: "#fff",
                        fontFamily: FONT,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Terima
                    </button>
                    <button
                      onClick={() => dismissInvitation(inv.id)}
                      style={{
                        flex: 1,
                        padding: "6px 0",
                        borderRadius: 100,
                        border: `1px solid ${C.border}`,
                        background: "transparent",
                        color: C.textSecondary,
                        fontFamily: FONT,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Tolak
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>

      <style>{`
        .ruang-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .ruang-emoji { display: flex; }
        @media (min-width: 640px) {
          .ruang-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 900px) {
          .ruang-grid { grid-template-columns: repeat(4, 1fr); }
        }
        .ruang-right-sidebar { display: none; }
        @media (min-width: 1024px) {
          .ruang-right-sidebar { display: block; }
          .ruang-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 480px) {
          .ruang-emoji { display: none; }
        }
      `}</style>
    </div>
  );
}

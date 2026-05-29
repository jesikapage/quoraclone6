import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PenLine, Users, X, ChevronDown, MoreHorizontal, Bookmark } from "lucide-react";
import Navbar from "../components/Navbar";

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

type Question = {
  id: number;
  title: string;
  answersCount: number;
  followersCount: number;
  lastEdited: string;
  topic: string;
  topicIcon: string;
  isDismissed?: boolean;
};

const TOPICS_DIIKUTI = [
  { label: "Bahasa Mandarin", icon: "🇨🇳" },
  { label: "Jepang (bahasa)", icon: "🇯🇵" },
  { label: "Tionghoa (bahasa)", icon: "🀄" },
  { label: "Thai (bahasa)", icon: "🇹🇭" },
  { label: "Bahasa Inggris", icon: "🇬🇧" },
];

const PERTANYAAN_UNTUK_ANDA: Question[] = [
  {
    id: 1,
    title: "Apakah ada rekomendasi laptop yang cocok untuk di pakai kuliah?",
    answersCount: 4,
    followersCount: 4,
    lastEdited: "10 Mei",
    topic: "Teknologi",
    topicIcon: "💻",
    isDismissed: false,
  },
  {
    id: 2,
    title: "Kalau mau menanyakan toilet di China, sebaiknya menggunakan xishoujian atau cesuo?",
    answersCount: 5,
    followersCount: 1,
    lastEdited: "21 Feb",
    topic: "Bahasa Mandarin",
    topicIcon: "🇨🇳",
    isDismissed: false,
  },
  {
    id: 3,
    title: "Ortu dan aku ingin kuliah, tapi aku gatau apa-apa tentang kuliah, gimana ya?",
    answersCount: 8,
    followersCount: 1,
    lastEdited: "23 Apr",
    topic: "Pendidikan",
    topicIcon: "📚",
    isDismissed: false,
  },
];

const TOPIK_TIONGHOA: Question[] = [
  {
    id: 4,
    title: "Mengapa Tiongkok menyebut Amerika Serikat sebagai Meiguo?",
    answersCount: 8,
    followersCount: 6,
    lastEdited: "15 Mar",
    topic: "Tionghoa (bahasa)",
    topicIcon: "🀄",
    isDismissed: false,
  },
];

const TOPIK_BAHASA_INGGRIS: Question[] = [
  {
    id: 5,
    title: "Kepanjangan dari kata 'Tips' itu apa?",
    answersCount: 3,
    followersCount: 2,
    lastEdited: "17 jam",
    topic: "Bahasa Inggris",
    topicIcon: "🇬🇧",
    isDismissed: false,
  },
  {
    id: 6,
    title: "Apakah CV lebih baik menggunakan bahasa inggris atau bahasa indonesia?",
    answersCount: 14,
    followersCount: 3,
    lastEdited: "Kem",
    topic: "Bahasa Inggris",
    topicIcon: "🇬🇧",
    isDismissed: false,
  },
  {
    id: 7,
    title: "Mengapa penulis atau novelis terkenal di dunia banyak yang berasal dari Inggris?",
    answersCount: 5,
    followersCount: 8,
    lastEdited: "21 Feb",
    topic: "Bahasa Inggris",
    topicIcon: "🇬🇧",
    isDismissed: false,
  },
];

const TOPIK_IKUTI_LAINNYA = [
  { label: "Indonesia", followers: "251,8 rb", icon: "🇮🇩" },
  { label: "Hiburan", followers: "297,8 rb", icon: "🎭" },
  { label: "Sejarah Dunia", followers: "247,6 rb", icon: "🏛️" },
  { label: "Pengalaman Dalam Hidup", followers: "198,3 rb", icon: "✨" },
  { label: "Media Sosial", followers: "249,7 rb", icon: "📱" },
];

function QuestionCard({ question, onDismiss }: { question: Question; onDismiss: (id: number) => void }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 4,
        padding: "14px 16px",
        marginBottom: 1,
        transition: "background 0.15s",
        background: hovered ? C.surfaceHover : C.surface,
      } as React.CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: FONT,
              fontSize: 15,
              fontWeight: 600,
              color: C.textPrimary,
              margin: "0 0 6px 0",
              lineHeight: 1.5,
              cursor: "pointer",
            }}
            onClick={() => navigate(`/posts/${question.id}`)}
          >
            {question.title}
          </p>
          <p style={{ fontFamily: FONT, fontSize: 13, color: C.textMuted, margin: 0 }}>
            {question.answersCount} Jawaban · Terakhir Diikuti {question.lastEdited}
          </p>
        </div>
        <button
          onClick={() => onDismiss(question.id)}
          style={{ background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", padding: 4, flexShrink: 0 }}
        >
          <X size={16} />
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
        <ActionBtn icon={<PenLine size={15} />} label="Jawab" />
        <ActionBtn icon={<Users size={15} />} label={`Ikuti ${question.followersCount}`} />
        <ActionBtn icon={<X size={15} />} label="Lewati" />
        <button style={{ marginLeft: "auto", background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", padding: 4 }}>
          <Bookmark size={16} />
        </button>
        <button style={{ background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", padding: 4 }}>
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
}

function ActionBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 10px",
        borderRadius: 100,
        border: `1px solid ${C.border}`,
        background: hov ? C.surfaceHover : "transparent",
        color: C.textSecondary,
        fontFamily: FONT,
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        transition: "background 0.15s",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {icon} {label}
    </button>
  );
}

function SectionHeader({ title, topicIcon }: { title: string; topicIcon?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {topicIcon && <span style={{ fontSize: 16 }}>{topicIcon}</span>}
        <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: C.textSecondary }}>{title}</span>
        <button style={{ background: "transparent", border: "none", cursor: "pointer", color: C.textMuted, padding: "2px 4px" }}>
          <MoreHorizontal size={14} />
        </button>
      </div>
    </div>
  );
}

export default function Mengikuti() {
  const [search, setSearch] = useState("");
  const [pertanyaanList, setPertanyaanList] = useState(PERTANYAAN_UNTUK_ANDA);
  const [tionghoa, setTionghoa] = useState(TOPIK_TIONGHOA);
  const [bahasaInggris, setBahasaInggris] = useState(TOPIK_BAHASA_INGGRIS);
  const [followedTopics, setFollowedTopics] = useState<string[]>([]);
  const [showAllSaran, setShowAllSaran] = useState(false);

  const dismiss = (
    setter: React.Dispatch<React.SetStateAction<Question[]>>,
    id: number
  ) => {
    setter((prev) => prev.filter((q) => q.id !== id));
  };

  const toggleFollow = (label: string) => {
    setFollowedTopics((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]
    );
  };

  const saranTopics = showAllSaran ? TOPIK_IKUTI_LAINNYA : TOPIK_IKUTI_LAINNYA.slice(0, 5);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT }}>
      <Navbar search={search} onSearchChange={setSearch} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 12px", display: "flex", gap: 20 }}>
        {/* Left Sidebar */}
        <aside className="mengikuti-left-sidebar" style={{ width: 180, flexShrink: 0 }}>
          <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: C.textPrimary, marginBottom: 8, padding: "0 4px" }}>
            Pertanyaan
          </p>
          {[
            { label: "Pertanyaan untuk Anda", active: true },
            { label: "Permintaan jawaban", active: false },
            { label: "Draf", active: false },
          ].map((item) => (
            <button
              key={item.label}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "7px 10px",
                borderRadius: 4,
                border: "none",
                background: item.active ? "#3A7AEF20" : "transparent",
                color: item.active ? C.blue : C.textSecondary,
                fontFamily: FONT,
                fontSize: 14,
                fontWeight: item.active ? 600 : 400,
                cursor: "pointer",
                marginBottom: 2,
                borderLeft: item.active ? `3px solid ${C.blue}` : "3px solid transparent",
              }}
            >
              {item.label}
            </button>
          ))}
        </aside>

        {/* Main Feed */}
        <main style={{ flex: 1, minWidth: 0, maxWidth: 580 }}>
          {/* Pertanyaan untuk Anda */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, marginBottom: 12, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: C.textPrimary }}>
                ⭐ Pertanyaan untuk Anda
              </span>
            </div>
            {pertanyaanList.length > 0 ? (
              pertanyaanList.map((q) => (
                <div key={q.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <QuestionCard question={q} onDismiss={(id) => dismiss(setPertanyaanList, id)} />
                </div>
              ))
            ) : (
              <div style={{ padding: "24px 16px", textAlign: "center", color: C.textMuted, fontSize: 14 }}>
                Tidak ada pertanyaan untuk saat ini.
              </div>
            )}
            {pertanyaanList.length > 0 && (
              <div style={{ padding: "10px 16px" }}>
                <button style={{ background: "transparent", border: "none", color: C.blue, fontFamily: FONT, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                  Lainnya <ChevronDown size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Tionghoa (bahasa) */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, marginBottom: 12, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <SectionHeader title="Tionghoa (bahasa)" topicIcon="🀄" />
              <span style={{ fontFamily: FONT, fontSize: 12, color: C.textMuted }}>Topik yang Anda tahu</span>
            </div>
            {tionghoa.map((q) => (
              <div key={q.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <QuestionCard question={q} onDismiss={(id) => dismiss(setTionghoa, id)} />
              </div>
            ))}
            <div style={{ padding: "10px 16px" }}>
              <button style={{ background: "transparent", border: "none", color: C.blue, fontFamily: FONT, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                Lihat semua <ChevronDown size={14} />
              </button>
            </div>
          </div>

          {/* Ikuti topik lainnya */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, marginBottom: 12, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 24, height: 24, borderRadius: 4, background: C.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>⭐</span>
                <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: C.textPrimary }}>Ikuti topik lainnya</span>
              </div>
              <p style={{ fontFamily: FONT, fontSize: 12, color: C.textMuted, margin: "4px 0 0 32px" }}>
                Personalisasi feed Anda dengan konten yang lebih relevan.
              </p>
            </div>
            {saranTopics.map((topic) => {
              const isFollowed = followedTopics.includes(topic.label);
              return (
                <div
                  key={topic.label}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: `1px solid ${C.border}` }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 22, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: C.surfaceHover, borderRadius: 6 }}>{topic.icon}</span>
                    <div>
                      <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: C.textPrimary, margin: 0 }}>{topic.label}</p>
                      <p style={{ fontFamily: FONT, fontSize: 12, color: C.textMuted, margin: 0 }}>{topic.followers} pengikut</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFollow(topic.label)}
                    style={{
                      padding: "5px 14px",
                      borderRadius: 100,
                      border: `1px solid ${isFollowed ? C.blue : C.border}`,
                      background: isFollowed ? "#3A7AEF20" : "transparent",
                      color: isFollowed ? C.blue : C.textSecondary,
                      fontFamily: FONT,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {isFollowed ? "✓ Diikuti" : "🔔 Ikuti"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bahasa Inggris */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, marginBottom: 12, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <SectionHeader title="Bahasa Inggris" topicIcon="🇬🇧" />
              <span style={{ fontFamily: FONT, fontSize: 12, color: C.textMuted }}>Topik yang Anda tahu</span>
            </div>
            {bahasaInggris.map((q, i) => (
              <div key={q.id} style={{ borderBottom: i < bahasaInggris.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <QuestionCard question={q} onDismiss={(id) => dismiss(setBahasaInggris, id)} />
              </div>
            ))}
            {bahasaInggris.length > 2 && (
              <div style={{ padding: "10px 16px" }}>
                <button style={{ background: "transparent", border: "none", color: C.blue, fontFamily: FONT, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                  Lainnya <ChevronDown size={14} />
                </button>
              </div>
            )}
          </div>

          {/* End of feed */}
          <div style={{ textAlign: "center", padding: "32px 0 48px" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
            <p style={{ fontFamily: FONT, fontSize: 14, color: C.textMuted, marginBottom: 12 }}>
              Anda telah mencapai bagian akhir feed Anda
            </p>
            <button
              style={{ background: C.blue, color: "#fff", border: "none", borderRadius: 100, padding: "8px 24px", fontFamily: FONT, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
            >
              Segarkan Halaman
            </button>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="mengikuti-right-sidebar" style={{ width: 240, flexShrink: 0 }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: "14px 16px", marginBottom: 12 }}>
            <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: C.textPrimary, margin: "0 0 12px 0" }}>
              Topik yang Anda tahu ✏️
            </p>
            {TOPICS_DIIKUTI.map((topic) => (
              <div key={topic.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
                <span style={{ fontSize: 18 }}>{topic.icon}</span>
                <span style={{ fontFamily: FONT, fontSize: 14, color: C.textSecondary }}>{topic.label}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <style>{`
        .mengikuti-left-sidebar { display: none; }
        .mengikuti-right-sidebar { display: none; }
        @media (min-width: 768px) {
          .mengikuti-left-sidebar { display: block; }
        }
        @media (min-width: 1024px) {
          .mengikuti-right-sidebar { display: block; }
        }
      `}</style>
    </div>
  );
}

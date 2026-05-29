import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PenLine, Users, MoreHorizontal, X, ChevronDown, Clock, TrendingUp, Bookmark } from "lucide-react";
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
  topic: string;
  topicIcon: string;
  answersCount: number;
  followersCount: number;
  timeAgo: string;
  isNew?: boolean;
  hasBadge?: string;
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "Apa perbedaan antara machine learning dan deep learning secara sederhana?",
    topic: "Kecerdasan Buatan",
    topicIcon: "🤖",
    answersCount: 0,
    followersCount: 3,
    timeAgo: "2 jam lalu",
    isNew: true,
  },
  {
    id: 2,
    title: "Bagaimana cara efektif belajar bahasa Mandarin dari nol untuk pemula Indonesia?",
    topic: "Bahasa Mandarin",
    topicIcon: "🇨🇳",
    answersCount: 2,
    followersCount: 7,
    timeAgo: "5 jam lalu",
    hasBadge: "Populer",
  },
  {
    id: 3,
    title: "Apa tips terbaik untuk mempersiapkan ujian IELTS dalam waktu 2 bulan?",
    topic: "Bahasa Inggris",
    topicIcon: "🇬🇧",
    answersCount: 1,
    followersCount: 12,
    timeAgo: "1 hari lalu",
  },
  {
    id: 4,
    title: "Apakah kuliah jurusan Ilmu Komputer masih relevan di era AI sekarang ini?",
    topic: "Pendidikan",
    topicIcon: "📚",
    answersCount: 5,
    followersCount: 24,
    timeAgo: "2 hari lalu",
    hasBadge: "Trending",
  },
  {
    id: 5,
    title: "Kenapa bahasa Jepang memiliki tiga sistem penulisan yang berbeda?",
    topic: "Jepang (bahasa)",
    topicIcon: "🇯🇵",
    answersCount: 3,
    followersCount: 9,
    timeAgo: "3 hari lalu",
  },
  {
    id: 6,
    title: "Apa rekomendasi buku terbaik untuk memahami sejarah dunia modern?",
    topic: "Sejarah",
    topicIcon: "📖",
    answersCount: 0,
    followersCount: 5,
    timeAgo: "4 hari lalu",
    isNew: true,
  },
  {
    id: 7,
    title: "Bagaimana cara mengatasi rasa takut berbicara di depan umum?",
    topic: "Pengalaman Hidup",
    topicIcon: "💬",
    answersCount: 8,
    followersCount: 31,
    timeAgo: "1 minggu lalu",
    hasBadge: "Populer",
  },
  {
    id: 8,
    title: "Apa perbedaan antara Thai dan Mandarin dalam hal nada bicara?",
    topic: "Bahasa",
    topicIcon: "🗣️",
    answersCount: 2,
    followersCount: 6,
    timeAgo: "1 minggu lalu",
  },
];

function QuestionCard({ question, onDismiss }: { question: Question; onDismiss: (id: number) => void }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div
      style={{
        background: hovered ? C.surfaceHover : C.surface,
        borderBottom: `1px solid ${C.border}`,
        padding: "16px 16px 12px",
        transition: "background 0.15s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Topic tag */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <span style={{ fontSize: 14 }}>{question.topicIcon}</span>
        <span style={{ fontFamily: FONT, fontSize: 12, color: C.textMuted }}>{question.topic}</span>
        {question.isNew && (
          <span style={{
            background: "#3A7AEF20",
            color: C.blue,
            fontSize: 10,
            fontWeight: 700,
            padding: "1px 6px",
            borderRadius: 100,
            fontFamily: FONT,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}>Baru</span>
        )}
        {question.hasBadge && (
          <span style={{
            background: question.hasBadge === "Trending" ? "#ff6b3520" : "#22c55e20",
            color: question.hasBadge === "Trending" ? "#ff6b35" : "#22c55e",
            fontSize: 10,
            fontWeight: 700,
            padding: "1px 6px",
            borderRadius: 100,
            fontFamily: FONT,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}>
            {question.hasBadge === "Trending" ? "🔥" : "⭐"} {question.hasBadge}
          </span>
        )}
      </div>

      {/* Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <p
          style={{
            fontFamily: FONT,
            fontSize: 15,
            fontWeight: 600,
            color: C.textPrimary,
            margin: "0 0 8px 0",
            lineHeight: 1.5,
            cursor: "pointer",
            flex: 1,
          }}
          onClick={() => navigate(`/posts/${question.id}`)}
        >
          {question.title}
        </p>
        <button
          onClick={() => onDismiss(question.id)}
          style={{ background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", padding: 4, flexShrink: 0 }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Meta info */}
      <p style={{ fontFamily: FONT, fontSize: 12, color: C.textMuted, margin: "0 0 10px 0" }}>
        <Clock size={11} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
        {question.timeAgo} ·{" "}
        {question.answersCount === 0
          ? "Belum ada jawaban"
          : `${question.answersCount} jawaban`}{" "}
        · {question.followersCount} pengikut
      </p>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        <ActionBtn icon={<PenLine size={14} />} label="Jawab" primary />
        <ActionBtn icon={<Users size={14} />} label={`Ikuti · ${question.followersCount}`} />
        <ActionBtn icon={<X size={14} />} label="Lewati" />
        <div style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
          <button
            onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
            style={{ background: "transparent", border: "none", color: saved ? C.blue : C.textMuted, cursor: "pointer", padding: 6, borderRadius: 4 }}
          >
            <Bookmark size={16} fill={saved ? C.blue : "none"} />
          </button>
          <button style={{ background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", padding: 6, borderRadius: 4 }}>
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, primary }: { icon: React.ReactNode; label: string; primary?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 12px",
        borderRadius: 100,
        border: primary ? "none" : `1px solid ${C.border}`,
        background: primary
          ? hov ? "#2f64cc" : C.blue
          : hov ? C.surfaceHover : "transparent",
        color: primary ? "#fff" : C.textSecondary,
        fontFamily: FONT,
        fontSize: 13,
        fontWeight: primary ? 600 : 500,
        cursor: "pointer",
        transition: "all 0.15s",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {icon} {label}
    </button>
  );
}

export default function Jawab() {
  const [search, setSearch] = useState("");
  const [questions, setQuestions] = useState(QUESTIONS);
  const [activeFilter, setActiveFilter] = useState<"semua" | "baru" | "trending">("semua");

  const dismiss = (id: number) => setQuestions((prev) => prev.filter((q) => q.id !== id));

  const filtered = questions.filter((q) => {
    if (activeFilter === "baru") return q.isNew;
    if (activeFilter === "trending") return q.hasBadge === "Trending" || q.hasBadge === "Populer";
    return true;
  });

  const filters = [
    { key: "semua", label: "Semua", icon: <MoreHorizontal size={14} /> },
    { key: "baru", label: "Terbaru", icon: <Clock size={14} /> },
    { key: "trending", label: "Trending", icon: <TrendingUp size={14} /> },
  ] as const;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT }}>
      <Navbar search={search} onSearchChange={setSearch} />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 12px", display: "flex", gap: 20 }}>
        {/* Left Sidebar */}
        <aside className="jawab-sidebar" style={{ width: 200, flexShrink: 0 }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, overflow: "hidden" }}>
            <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}` }}>
              <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: C.textPrimary, margin: 0 }}>Topik Anda</p>
            </div>
            {[
              { label: "Bahasa Mandarin", icon: "🇨🇳" },
              { label: "Jepang (bahasa)", icon: "🇯🇵" },
              { label: "Tionghoa (bahasa)", icon: "🀄" },
              { label: "Thai (bahasa)", icon: "🇹🇭" },
              { label: "Bahasa Inggris", icon: "🇬🇧" },
            ].map((topic) => (
              <button
                key={topic.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  textAlign: "left",
                  padding: "9px 14px",
                  border: "none",
                  borderBottom: `1px solid ${C.border}`,
                  background: "transparent",
                  color: C.textSecondary,
                  fontFamily: FONT,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 16 }}>{topic.icon}</span>
                {topic.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <div style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 4,
            padding: "16px",
            marginBottom: 8,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <div>
                <h1 style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.textPrimary, margin: 0 }}>
                  Pertanyaan untuk Dijawab
                </h1>
                <p style={{ fontFamily: FONT, fontSize: 13, color: C.textMuted, margin: "4px 0 0 0" }}>
                  {filtered.length} pertanyaan menunggu jawaban Anda
                </p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {filters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setActiveFilter(f.key)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "5px 12px",
                      borderRadius: 100,
                      border: `1px solid ${activeFilter === f.key ? C.blue : C.border}`,
                      background: activeFilter === f.key ? "#3A7AEF20" : "transparent",
                      color: activeFilter === f.key ? C.blue : C.textSecondary,
                      fontFamily: FONT,
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {f.icon} {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Questions */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, overflow: "hidden" }}>
            {filtered.length > 0 ? (
              filtered.map((q) => (
                <QuestionCard key={q.id} question={q} onDismiss={dismiss} />
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
                <p style={{ fontFamily: FONT, fontSize: 15, color: C.textMuted }}>
                  Tidak ada pertanyaan di kategori ini.
                </p>
                <button
                  onClick={() => setActiveFilter("semua")}
                  style={{ marginTop: 12, background: C.blue, color: "#fff", border: "none", borderRadius: 100, padding: "8px 20px", fontFamily: FONT, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  Lihat Semua
                </button>
              </div>
            )}
          </div>

          {filtered.length > 0 && (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <button style={{
                background: "transparent",
                border: `1px solid ${C.border}`,
                color: C.textSecondary,
                borderRadius: 100,
                padding: "8px 24px",
                fontFamily: FONT,
                fontSize: 13,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}>
                Muat Lebih Banyak <ChevronDown size={14} />
              </button>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .jawab-sidebar { display: none; }
        @media (min-width: 768px) {
          .jawab-sidebar { display: block; }
        }
      `}</style>
    </div>
  );
}

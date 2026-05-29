import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import Navbar from "../components/Navbar";
import { Bell, MoreHorizontal, Settings, X, ChevronLeft } from "lucide-react";

// ── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#181818",
  surface: "#242424",
  surfaceHover: "#2d2d2d",
  border: "#393939",
  textPrimary: "#D5D6D7",
  textSecondary: "#B1B3B6",
  textMuted: "#87898c",
  red: "#b92b27",
  redBg: "#b92b271a",
  blue: "#3A7AEF",
};

const FONT =
  "-apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans', Ubuntu, Cantarell, 'Helvetica Neue', Oxygen-Sans, sans-serif";

// ── Static Notification Data ───────────────────────────────────────────────────
const STATIC_NOTIFS = [
  {
    id: "notif-1",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=anomali",
    context: "Anomali Warga RT sebelah",
    contextDetail: "Dikirimkan ke Ruang yang mungkin Anda sukai",
    timeLabel: "6 jam yang lalu",
    mainText: "Jejak digital itu real kawan.",
    subText: "Apa fakta yang membuatmu terheran-heran hari ini?",
    type: "Ruang",
    isUnread: false,
  },
  {
    id: "notif-2",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=talulah",
    context: "Ruang Talulah Rhym",
    contextDetail: "Dijawab di Ruang yang mungkin Anda sukai",
    timeLabel: "12 Mei",
    mainText: "Apa tips cara bermain di situs slot agar mendapatkan maxwin?",
    subText: null,
    type: "Ruang",
    isUnread: false,
  },
  {
    id: "notif-3",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=darkstory",
    context: "Dark (humor) story",
    contextDetail: "Dikirimkan ke Ruang yang mungkin Anda sukai",
    timeLabel: "5 Mei",
    mainText: "Hidup itu lucu, mau menghindar kaya gimanapun kalau blm takdir pasti bakal selamat.",
    subText: null,
    type: "Kisah",
    isUnread: true,
  },
  {
    id: "notif-4",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=historia",
    context: "Historia Magistra",
    contextDetail: "Dikirimkan ke Ruang yang mungkin Anda sukai",
    timeLabel: "21 April",
    mainText: "Kota yang Mati Tanpa Musuh",
    subText: null,
    type: "Kisah",
    isUnread: false,
  },
  {
    id: "notif-5",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=gerakan",
    context: "Gerakan Pemuda Berani Kritis",
    contextDetail: "Dikirimkan ke Ruang yang mungkin Anda sukai",
    timeLabel: "1 jam yang lalu",
    mainText: "Saya rasa juga demikian",
    subText: "Bagaimana tanggapan kalian tentang kasus korupsi Makarim? Apakah beliau benar tidak bersalah?",
    type: "Pertanyaan",
    isUnread: true,
  },
  {
    id: "notif-6",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=kisahkisah",
    context: "Kisah-Kisah yang Terlupakan",
    contextDetail: "Dikirimkan ke Ruang yang mungkin Anda sukai",
    timeLabel: "Rab",
    mainText: "Seperti apa rasanya hidup di zaman pemerintahan Presiden Soeharto?",
    subText: null,
    type: "Pertanyaan",
    isUnread: false,
  },
  {
    id: "notif-7",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=kumpulan",
    context: "Kumpulan kumpulin",
    contextDetail: "Dikirimkan ke Ruang yang mungkin Anda sukai",
    timeLabel: "Rab",
    mainText: "Siapakah Youtuber yang memiliki konten bagus tapi sedikit followers?",
    subText: null,
    type: "Ruang",
    isUnread: false,
  },
  {
    id: "notif-8",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=literasicerdas",
    context: "Literasi Cerdas",
    contextDetail: "Dikirimkan ke Ruang yang mungkin Anda sukai",
    timeLabel: "Sel",
    mainText: "Apakah lebih baik kemoterapi atau membiarkan kanker sampai meninggal?",
    subText: null,
    type: "Pertanyaan",
    isUnread: false,
  },
];

// ── Filter categories ──────────────────────────────────────────────────────────
const FILTER_CATS = [
  { key: "semua", label: "Semua Notifikasi" },
  { key: "Kisah", label: "Kisah" },
  { key: "Pertanyaan", label: "Pertanyaan" },
  { key: "Ruang", label: "Ruang", badge: 1 },
  { key: "pembaruan", label: "Pembaruan tentang orang" },
  { key: "komentar", label: "Komentar dan sebutan" },
  { key: "dukung", label: "Dukung Naik" },
  { key: "konten", label: "Konten Anda" },
  { key: "profil", label: "Profil Anda" },
  { key: "pengumuman", label: "Pengumuman" },
];

// ── Toggle Switch Component ────────────────────────────────────────────────────
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 44,
        height: 24,
        borderRadius: 100,
        border: "none",
        background: on ? C.blue : "#555",
        cursor: "pointer",
        position: "relative",
        flexShrink: 0,
        transition: "background 0.2s",
        padding: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: on ? 22 : 3,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s",
          display: "block",
        }}
      />
    </button>
  );
}

// ── Settings Panel ─────────────────────────────────────────────────────────────
type SettingItem = {
  key: string;
  label: string;
  desc: string;
  hasManage?: boolean;
  on: boolean;
};

type SettingSection = {
  section: string;
  items: SettingItem[];
};

const INITIAL_SETTINGS: SettingSection[] = [
  {
    section: "Saluran Konten",
    items: [],
  },
  {
    section: "Tanya jawab umum",
    items: [
      { key: "jawaban_baru", label: "Jawaban baru", desc: "Kirimi saya surel jika ada jawaban baru untuk pertanyaan yang saya ajukan atau ikuti.", on: true },
      { key: "permintaan", label: "Permintaan", desc: "Kirimi saya surel jika ada seseorang yang meminta saya untuk menjawab suatu pertanyaan.", on: true },
    ],
  },
  {
    section: "Pesan, komentar & sebutan",
    items: [
      { key: "pesan", label: "Pesan", desc: "Kirimi saya surel jika ada seseorang yang mengirimkan pesan langsung kepada saya.", on: true },
      { key: "komentar_balasan", label: "Komentar dan balasan", desc: "Kirimi saya surel tentang komentar di konten saya dan balasan terhadap komentar saya.", on: true },
      { key: "sebutan", label: "Sebutan", desc: "Kirimi saya surel jika seseorang menyebut nama saya.", on: true },
    ],
  },
  {
    section: "Ruang",
    items: [
      { key: "undangan_ruang", label: "Undangan Ruang", desc: "Kirimi saya surel jika ada seseorang yang mengundang atau menerima undangan saya untuk bergabung ke dalam suatu ruang.", on: true },
      { key: "pembaruan_ruang", label: "Pembaruan Ruang", desc: "Kirimi saya surel jika ada pembaruan fitur ke Ruang saya.", on: true },
      { key: "ruang_untuk_anda", label: "Ruang untuk Anda", desc: "Kirimi saya surel tentang Ruang yang mungkin saya suka.", on: true },
      { key: "ruang_anda_ikuti", label: "Ruang yang Anda Ikuti", desc: "Kirimi saya surel dengan pembaruan dari ruang yang saya ikuti dengan frekuensi pilihan saya.", on: false, hasManage: true },
    ],
  },
  {
    section: "Jaringan Anda",
    items: [
      { key: "pengikut_baru", label: "Pengikut baru", desc: "Kirimi saya surel tentang pengikut baru.", on: true },
      { key: "orang_anda_ikuti", label: "Orang Anda Ikuti", desc: "Kelola notifikasi dari orang-orang yang saya ikuti.", on: false, hasManage: true },
    ],
  },
  {
    section: "Aktivitas di Konten Anda",
    items: [],
  },
  {
    section: "Dukung Naik",
    items: [
      { key: "dukung_naik", label: "Dukung Naik", desc: "Kirimi saya surel jika seseorang mendukung naik konten saya.", on: true },
    ],
  },
  {
    section: "Konten yang Dibagi",
    items: [
      { key: "konten_dibagi", label: "Informasi yang dibagikan dari konten saya", desc: "Kirimi saya surel ketika seseorang membagikan konten saya.", on: true },
    ],
  },
  {
    section: "Moderasi",
    items: [
      { key: "jawaban_saya", label: "Jawaban saya", desc: "Kirimi saya surel jika tindakan moderasi diterapkan pada jawaban saya.", on: true },
    ],
  },
  {
    section: "Dari Quora",
    items: [],
  },
  {
    section: "Hal yang mungkin Anda sukai",
    items: [
      { key: "jawaban_populer", label: "Jawaban populer", desc: "Kirimi saya surel dengan jawaban dan informasi yang dibagikan yang didukung oleh orang-orang yang saya ikuti.", on: false },
      { key: "cerita_aktivitas", label: "Cerita berdasarkan aktivitas saya", desc: "Kirimi saya surel yang lebih banyak cerita yang lebih berkaitan dengan hal-hal yang saya baca.", on: true },
      { key: "pertanyaan_disarankan", label: "Pertanyaan yang disarankan", desc: "Kirimi saya surel dengan pertanyaan untuk dijawab.", on: true },
      { key: "penulis_favorit", label: "Penulis favorit", desc: "Kirimi saya surel dengan konten dari penulis favorit saya.", on: true },
    ],
  },
];

const SETTING_NAV = ["Akun", "Privasi", "Tampilan", "Surel & Notifikasi", "Bahasa"];

function SettingsPanel({ onClose }: { onClose: () => void }) {
  const [activeNav, setActiveNav] = useState("Surel & Notifikasi");
  const [settings, setSettings] = useState<SettingSection[]>(INITIAL_SETTINGS);

  const toggleItem = (key: string) => {
    setSettings((prev) =>
      prev.map((sec) => ({
        ...sec,
        items: sec.items.map((item) =>
          item.key === key ? { ...item, on: !item.on } : item
        ),
      }))
    );
  };

  return (
    // Overlay
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: 60,
      }}
      onClick={onClose}
    >
      {/* Panel */}
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          width: "100%",
          maxWidth: 700,
          maxHeight: "calc(100vh - 80px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.7)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Panel Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: `1px solid ${C.border}`,
            flexShrink: 0,
          }}
        >
          <h2 style={{ margin: 0, fontFamily: FONT, fontSize: 17, fontWeight: 700, color: C.textPrimary }}>
            Setelan
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", padding: 4, display: "flex" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Panel Body: Left nav + Right content */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Left nav */}
          <nav
            style={{
              width: 160,
              flexShrink: 0,
              borderRight: `1px solid ${C.border}`,
              padding: "12px 0",
              overflowY: "auto",
            }}
          >
            {SETTING_NAV.map((item) => {
              const isActive = activeNav === item;
              return (
                <button
                  key={item}
                  onClick={() => setActiveNav(item)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "9px 16px",
                    border: "none",
                    background: isActive ? C.redBg : "none",
                    fontFamily: FONT,
                    fontSize: 14,
                    fontWeight: isActive ? 700 : 400,
                    color: isActive ? C.red : C.textPrimary,
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover; }}
                  onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
                >
                  {item}
                </button>
              );
            })}
          </nav>

          {/* Right content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
            {activeNav === "Surel & Notifikasi" ? (
              <div>
                {settings.map((sec, si) => {
                  // Section header (bold, like "Saluran Konten", "Tanya jawab umum")
                  const isMajorHeader = sec.items.length === 0;
                  return (
                    <div key={si} style={{ marginBottom: isMajorHeader ? 4 : 0 }}>
                      {/* Section title */}
                      <p
                        style={{
                          fontFamily: FONT,
                          fontSize: isMajorHeader ? 15 : 13,
                          fontWeight: isMajorHeader ? 700 : 600,
                          color: isMajorHeader ? C.textPrimary : C.textMuted,
                          margin: isMajorHeader ? "20px 0 8px" : "16px 0 6px",
                          paddingBottom: isMajorHeader ? 6 : 0,
                          borderBottom: isMajorHeader ? `1px solid ${C.border}` : "none",
                        }}
                      >
                        {sec.section}
                      </p>

                      {/* Items */}
                      {sec.items.map((item) => (
                        <div
                          key={item.key}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 16,
                            padding: "10px 0",
                            borderBottom: `1px solid ${C.border}`,
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: C.textPrimary, margin: "0 0 3px" }}>
                              {item.label}
                            </p>
                            <p style={{ fontFamily: FONT, fontSize: 12, color: C.textMuted, margin: 0, lineHeight: 1.5 }}>
                              {item.desc}
                            </p>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, paddingTop: 2 }}>
                            {item.hasManage ? (
                              <button
                                style={{
                                  fontFamily: FONT, fontSize: 13, fontWeight: 600,
                                  color: C.textPrimary, background: "none",
                                  border: `1px solid ${C.border}`, borderRadius: 100,
                                  padding: "4px 14px", cursor: "pointer",
                                }}
                              >
                                Kelola
                              </button>
                            ) : (
                              <Toggle on={item.on} onChange={() => toggleItem(item.key)} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ) : (
              // Placeholder for other nav items
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <p style={{ fontFamily: FONT, fontSize: 15, color: C.textMuted }}>
                  Setelan <strong style={{ color: C.textSecondary }}>{activeNav}</strong> belum tersedia.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── NotifItem Card ─────────────────────────────────────────────────────────────
function NotifItem({
  notif,
  onNavigate,
  onMarkRead,
}: {
  notif: (typeof STATIC_NOTIFS)[0];
  onNavigate: (id: string) => void;
  onMarkRead: (id: string) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Close menu on outside click
  useEffect(() => {
    if (!showMenu) return;
    const close = () => setShowMenu(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [showMenu]);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        gap: 12,
        padding: "14px 16px",
        borderBottom: `1px solid ${C.border}`,
        background: notif.isUnread
          ? `linear-gradient(90deg, ${C.redBg} 0%, transparent 100%)`
          : hovered
          ? C.surfaceHover
          : "transparent",
        cursor: "pointer",
        transition: "background 0.15s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onNavigate(notif.id)}
    >
      {/* Unread dot */}
      {notif.isUnread && (
        <div
          style={{
            position: "absolute",
            left: 4,
            top: "50%",
            transform: "translateY(-50%)",
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: C.red,
            flexShrink: 0,
          }}
        />
      )}

      {/* Avatar */}
      <img
        src={notif.avatar}
        alt="avatar"
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
          border: `1px solid ${C.border}`,
          background: C.surface,
        }}
      />

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: FONT,
            fontSize: 13,
            color: C.textMuted,
            margin: "0 0 2px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span style={{ color: C.textSecondary, fontWeight: 600 }}>{notif.context}</span>
          {" · "}
          {notif.contextDetail}
          {" · "}
          {notif.timeLabel}
        </p>
        <p
          style={{
            fontFamily: FONT,
            fontSize: 15,
            fontWeight: 700,
            color: C.textPrimary,
            margin: "0 0 2px",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as any,
            overflow: "hidden",
          }}
        >
          {notif.mainText}
        </p>
        {notif.subText && (
          <p
            style={{
              fontFamily: FONT,
              fontSize: 13,
              color: C.textSecondary,
              margin: 0,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical" as any,
              overflow: "hidden",
            }}
          >
            {notif.subText}
          </p>
        )}
      </div>

      {/* Three-dot menu */}
      <div
        style={{ flexShrink: 0, alignSelf: "flex-start", position: "relative" }}
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu((v) => !v);
        }}
      >
        <button
          style={{
            background: "transparent",
            border: "none",
            color: C.textMuted,
            cursor: "pointer",
            padding: "4px 6px",
            borderRadius: 3,
          }}
        >
          <MoreHorizontal size={18} />
        </button>

        {showMenu && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 32,
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 4,
              zIndex: 20,
              minWidth: 240,
              boxShadow: "0 4px 16px rgba(0,0,0,0.55)",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Only show "Tandai Sudah Dibaca" if still unread */}
            {notif.isUnread && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkRead(notif.id);
                  setShowMenu(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "12px 16px",
                  fontFamily: FONT,
                  fontSize: 14,
                  color: C.textPrimary,
                  background: "none",
                  border: "none",
                  borderBottom: `1px solid ${C.border}`,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "none")}
              >
                Tandai Sudah Dibaca
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "12px 16px",
                fontFamily: FONT,
                fontSize: 14,
                color: C.textMuted,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "none")}
            >
              Lihat lebih sedikit notifikasi seperti ini
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Notifications Page ────────────────────────────────────────────────────
export default function Notifications() {
  const { token } = useAuthStore();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState("semua");
  const [notifications, setNotifications] = useState(STATIC_NOTIFS);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token]);

  // Mark all as read (only for currently filtered and unread)
  const markAllRead = () => {
    const filteredIds = new Set(filtered.filter((n) => n.isUnread).map((n) => n.id));
    setNotifications((prev) =>
      prev.map((n) => (filteredIds.has(n.id) ? { ...n, isUnread: false } : n))
    );
  };

  // Mark single as read
  const markOneRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isUnread: false } : n)));
  };

  // Filter notifications
  const filtered = notifications.filter((n) => {
    if (activeFilter === "semua") return true;
    const emptyKeys = ["pembaruan", "komentar", "dukung", "konten", "profil", "pengumuman"];
    if (emptyKeys.includes(activeFilter)) return false;
    return n.type === activeFilter;
  });

  // Unread count ONLY for the currently filtered list
  const filteredUnreadCount = filtered.filter((n) => n.isUnread).length;

  const activeLabel = FILTER_CATS.find((f) => f.key === activeFilter)?.label ?? "Semua Notifikasi";

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT, paddingBottom: 64 }}>
      <Navbar search={search} onSearchChange={setSearch} />

      {/* Settings modal */}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}

      {/* Mobile filter toggle */}
      <div
        className="notif-mobile-bar"
        style={{ display: "none", padding: "8px 16px", background: C.surface, borderBottom: `1px solid ${C.border}` }}
      >
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          style={{
            background: "none",
            border: `1px solid ${C.border}`,
            borderRadius: 3,
            padding: "6px 12px",
            color: C.textSecondary,
            fontFamily: FONT,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Filter: {activeLabel}
        </button>
      </div>

      {/* Page Layout */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "16px 12px",
          display: "flex",
          gap: 24,
          alignItems: "flex-start",
        }}
      >
        {/* ── Left Sidebar Filter ── */}
        <aside
          className={`notif-sidebar${sidebarOpen ? " notif-sidebar-open" : ""}`}
          style={{ width: 220, flexShrink: 0 }}
        >
          <p
            style={{
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 700,
              color: C.textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              margin: "0 0 8px 12px",
            }}
          >
            Filter
          </p>

          {FILTER_CATS.map((cat) => {
            const isActive = activeFilter === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveFilter(cat.key);
                  setSidebarOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: 3,
                  border: "none",
                  background: isActive ? C.redBg : "none",
                  fontFamily: FONT,
                  fontSize: 15,
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? C.red : C.textPrimary,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover;
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "none";
                }}
              >
                <span>{cat.label}</span>
                {cat.badge && cat.badge > 0 ? (
                  <span
                    style={{
                      background: C.red,
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "1px 6px",
                      borderRadius: 100,
                    }}
                  >
                    {cat.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </aside>

        {/* ── Main Notification List ── */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Header row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <h1
              style={{
                fontFamily: FONT,
                fontSize: 20,
                fontWeight: 700,
                color: C.textPrimary,
                margin: 0,
              }}
            >
              {activeLabel}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* "Tandai Semua Sudah Dibaca" hanya muncul jika ada notif unread di filter aktif */}
              {filteredUnreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  style={{
                    background: "none",
                    border: "none",
                    fontFamily: FONT,
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.textSecondary,
                    cursor: "pointer",
                    padding: 0,
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = C.textPrimary)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = C.textSecondary)}
                >
                  Tandai Semua Sudah Dibaca
                </button>
              )}

              {/* Settings icon — opens the settings panel */}
              <button
                title="Setelan"
                onClick={() => setShowSettings(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: C.textSecondary,
                  cursor: "pointer",
                  padding: 4,
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 3,
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = C.textPrimary)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = C.textSecondary)}
              >
                <Settings size={18} />
              </button>
            </div>
          </div>

          {/* Notification card list */}
          <div
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "64px 24px" }}>
                <Bell size={52} color={C.textMuted} style={{ margin: "0 auto 16px" }} />
                <p style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: C.textPrimary, margin: "0 0 8px" }}>
                  Tidak Ada Notifikasi Baru
                </p>
                <p style={{ fontFamily: FONT, fontSize: 14, color: C.textMuted, maxWidth: 340, margin: "0 auto", lineHeight: 1.6 }}>
                  Notifikasi yang Anda terima dalam jangka waktu 30 hari terakhir akan ditampilkan di sini.
                </p>
              </div>
            ) : (
              filtered.map((notif) => (
                <NotifItem
                  key={notif.id}
                  notif={notif}
                  onNavigate={(id) => navigate(`/notifikasi/${id}`)}
                  onMarkRead={markOneRead}
                />
              ))
            )}
          </div>
        </main>
      </div>

      {/* Responsive styles */}
      <style>{`
        .notif-sidebar { display: block; }
        .notif-mobile-bar { display: none !important; }

        @media (max-width: 768px) {
          .notif-sidebar {
            display: none;
            position: fixed;
            top: 50px;
            left: 0;
            width: 240px;
            height: calc(100vh - 50px);
            background: ${C.surface};
            border-right: 1px solid ${C.border};
            z-index: 40;
            overflow-y: auto;
            padding: 16px 0;
          }
          .notif-sidebar.notif-sidebar-open {
            display: block;
          }
          .notif-mobile-bar {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
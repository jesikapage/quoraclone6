import { Plus } from "lucide-react";

const C = {
  bg: "#181919",
  surface: "#262626",
  surfaceHover: "#2f2f2f",
  border: "#333333",
  textPrimary: "#e2e2e2",
  textSecondary: "#939598",
  textMuted: "#636466",
};

const FONT = "-apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans', Ubuntu, Cantarell, 'Helvetica Neue', Oxygen-Sans, sans-serif";

const LEFT_TOPICS = [
  { label: "Bahasa Inggris", img: "https://images.unsplash.com/photo-1543872084-c7bd3822856f?w=100&q=80" },
  { label: "Budaya populer", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&q=80" },
  { label: "Pendidikan",     img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=100&q=80" },
  { label: "Kesehatan",      img: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=100&q=80" },
  { label: "Musik",          img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&q=80" },
  { label: "Teknologi",      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&q=80" },
];

const FOOTER_LINKS = [
  "Tentang Quora", "Ketentuan", "Privasi",
  "Penggunaan Dapat Diterima", "Beriklan",
  "Karier", "Pers", "Perusahaan",
];

export default function Sidebar() {
  return (
    <aside style={{ width: 180, flexShrink: 0 }}>
      {/* Buat Ruang */}
      <button
        style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px", borderRadius: 3, border: "none", background: "none", cursor: "pointer", fontFamily: FONT, fontSize: 15, fontWeight: 500, color: C.textPrimary, textAlign: "left" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
      >
        <Plus size={16} color={C.textSecondary} /> Buat Ruang
      </button>

      {/* Label Topik */}
      <p style={{ fontFamily: FONT, fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", padding: "12px 12px 4px" }}>
        Topik
      </p>

      {/* List Topik */}
      {LEFT_TOPICS.map((topic) => {
        return (
          <button
            key={topic.label}
            style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px", borderRadius: 3, border: "none", background: "none", cursor: "pointer", fontFamily: FONT, fontSize: 15, color: C.textPrimary, textAlign: "left" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
          >
            <img
              src={topic.img}
              alt={topic.label}
              style={{ width: 28, height: 28, borderRadius: 4, objectFit: "cover", flexShrink: 0, border: `1px solid ${C.border}` }}
            />
            {topic.label}
          </button>
        );
      })}

      {/* Footer Links */}
      <div style={{ marginTop: 24, padding: "0 12px" }}>
        <p style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.6, margin: 0, fontFamily: FONT }}>
          {FOOTER_LINKS.map((l, i) => {
            return (
              <span key={l}>
                <a href="#" style={{ color: C.textMuted, textDecoration: "none" }}>{l}</a>
                {i < FOOTER_LINKS.length - 1 && <span> · </span>}
              </span>
            );
          })}
        </p>
        <p style={{ fontSize: 11, color: C.textMuted, marginTop: 6, fontFamily: FONT }}>© 2025 Quora</p>
      </div>
    </aside>
  );
}
import { useState } from "react";

export default function Navbar() {
  const [search, setSearch] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-2">
        {/* Logo */}
        <a href="/" className="text-red-600 font-black text-2xl tracking-tight select-none flex-shrink-0 mr-2">
          Quora
        </a>

        {/* Nav Icons Tengah */}
        <nav className="hidden md:flex items-center">
          {[
            { href: "/", icon: "🏠", active: true },
            { href: "#", icon: "📋", active: false },
            { href: "#", icon: "✏️", active: false },
            { href: "#", icon: "👥", active: false },
            { href: "/notifikasi", icon: "🔔", active: false },
          ].map((item, i) => (
            
              key={i}
              href={item.href}
              className={`flex items-center justify-center w-14 h-14 border-b-2 transition ${
                item.active
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
            </a>
          ))}
        </nav>

        {/* Search */}
        <div className="flex-1 max-w-sm relative mx-2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">🔍</span>
          <input
            type="search"
            placeholder="Cari Quora"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-100 border border-transparent focus:border-gray-300 focus:bg-white rounded-full pl-9 pr-4 py-1.5 text-sm outline-none transition"
          />
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 ml-auto">
          <button className="text-xl w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition">🌐</button>
          <div className="w-8 h-8 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center cursor-pointer flex-shrink-0">
            P
          </div>
          <button className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-1.5 rounded-full transition flex-shrink-0">
            Tambah pertanyaan <span className="ml-1">▾</span>
          </button>
        </div>
      </div>
    </header>
  );
}
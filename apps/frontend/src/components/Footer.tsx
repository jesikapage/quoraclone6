const FOOTER_LINKS = [
  "Tentang Quora", "Ketentuan", "Privasi",
  "Penggunaan Dapat Diterima", "Beriklan", "Karier", "Pers", "Perusahaan",
];

export default function Footer() {
  return (
    <footer className="mt-8 px-2">
      <nav className="flex flex-wrap gap-x-3 gap-y-1">
        {FOOTER_LINKS.map((link) => (
          <a key={link} href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            {link}
          </a>
        ))}
      </nav>
      <p className="text-xs text-gray-400 mt-2">© 2025 Quora Clone</p>
    </footer>
  );
}
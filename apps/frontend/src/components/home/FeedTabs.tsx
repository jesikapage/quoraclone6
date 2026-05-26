export default function FeedTabs() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-4">
      {/* Input bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <div className="w-8 h-8 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">P</div>
        <input
          type="text"
          placeholder="Apa yang ingin Anda tanyakan atau bagikan?"
          className="flex-1 text-sm text-gray-500 outline-none bg-transparent"
          readOnly
        />
      </div>
      {/* Action buttons */}
      <div className="flex">
        {[
          { icon: "❓", label: "Tanya" },
          { icon: "✏️", label: "Jawab" },
          { icon: "📤", label: "Kiriman" },
        ].map((item) => (
          <button
            key={item.label}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-red-600 transition-colors"
          >
            <span>{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
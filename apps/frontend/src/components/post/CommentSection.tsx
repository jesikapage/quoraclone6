import { ArrowUp } from "lucide-react";

export default function CommentSection({ comments }: { comments: any[] }) {
  return (
    <div className="space-y-3">
      {/* Input Tambah Komentar */}
      <div className="flex gap-2 items-center bg-[#181919] border border-[#444] rounded-[3px] px-3 py-2 mb-4">
        <input 
          placeholder="Tambahkan komentar..." 
          className="flex-1 bg-transparent text-sm text-[#e2e2e2] outline-none placeholder-[#636466]" 
        />
        <button className="bg-[#2b69d1] hover:bg-[#3277ed] text-white text-xs font-semibold px-3 py-1 rounded-[3px] transition">
          Tambah
        </button>
      </div>

      {/* List Komentar */}
      {comments.map((c: any) => (
        <div key={c.id} className="bg-[#181919] p-3 border border-[#333] rounded-[3px]">
          <div className="flex justify-between items-center mb-1">
            <p className="font-bold text-xs text-[#2b69d1]">{c.user.name}</p>
            <span className="text-[10px] text-[#636466]">Baru saja</span>
          </div>
          <p className="text-sm text-[#e2e2e2] my-1">{c.content}</p>
          
          <div className="flex items-center gap-4 text-[12px] text-[#636466] mt-2 pt-1 border-t border-[#262626]">
            <button className="flex items-center gap-1 hover:text-[#2b69d1] transition">
              <ArrowUp size={13} /> Suka
            </button>
            <button className="hover:underline transition">Balas</button>
          </div>
        </div>
      ))}
    </div>
  );
}
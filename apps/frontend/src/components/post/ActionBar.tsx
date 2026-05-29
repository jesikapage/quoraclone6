import { useState } from "react";
import { ArrowUp, ArrowDown, MessageCircle, Repeat2, MoreHorizontal } from "lucide-react";

export default function ActionBar({ likeCount, commentCount, onCommentClick }: any) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(likeCount);

  return (
    <div className="flex items-center justify-between py-1 mt-1 pb-2">
      <div className="flex items-center gap-2">
        <button onClick={() => { setLiked(!liked); setCount(liked ? count - 1 : count + 1); }} 
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium ${liked ? "text-[#2B69D1] bg-[#F1F2F2]" : "text-[#636466] bg-[#F1F2F2]"}`}>
          <ArrowUp size={16} /> <span>Dukung Naik · {count}</span>
        </button>
        <button onClick={onCommentClick} className="flex items-center gap-1.5 px-2 py-1.5 text-[#636466] hover:bg-[#F1F2F2] rounded-full text-[13px]">
          <MessageCircle size={18} /> <span>{commentCount}</span>
        </button>
      </div>
      <button className="text-[#636466] p-1.5 hover:bg-[#F1F2F2] rounded-full"><MoreHorizontal size={18} /></button>
    </div>
  );
}
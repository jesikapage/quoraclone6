import { useState } from "react";

export interface Post {
  id: number;
  author: string;
  avatar: string;
  avatarColor: string;
  credential: string;
  question: string;
  answer: string;
  likes: number;
  comments: number;
  shares: number;
  time: string;
  topic: string;
  isLiked?: boolean;
}

export default function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(post.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [expanded, setExpanded] = useState(false);

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const PREVIEW_LENGTH = 200;
  const isLong = post.answer.length > PREVIEW_LENGTH;

  return (
    <article className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0 ${post.avatarColor}`}>
            {post.avatar}
          </div>
          <div>
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-semibold text-gray-900 text-sm hover:underline cursor-pointer">{post.author}</span>
              <span className="text-gray-400 text-xs">·</span>
              <span className="text-red-600 text-xs font-medium cursor-pointer hover:underline">Ikuti</span>
            </div>
            <p className="text-xs text-gray-500">{post.credential} · {post.time}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 text-lg leading-none flex-shrink-0">×</button>
      </div>

      {/* Pertanyaan */}
      <h2 className="font-bold text-gray-900 text-base mb-2 leading-snug hover:text-red-700 cursor-pointer transition-colors">
        {post.question}
      </h2>

      {/* Jawaban */}
      <p className="text-gray-700 text-sm leading-relaxed">
        {expanded || !isLong ? post.answer : post.answer.slice(0, PREVIEW_LENGTH) + "…"}
        {isLong && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="ml-1 text-red-600 hover:text-red-700 font-medium text-sm"
          >
            {expanded ? " (sembunyikan)" : " (lanjut)"}
          </button>
        )}
      </p>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-1 flex-wrap">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition-all ${
            liked
              ? "border-red-300 bg-red-50 text-red-600 font-semibold"
              : "border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {liked ? "▲" : "▲"} Dukung Naik · {likeCount}
        </button>
        <button className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
          ▼
        </button>
        <button className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
          💬 {post.comments}
        </button>
        <button className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
          🔁 {post.shares}
        </button>
        <button className="ml-auto text-gray-400 hover:text-gray-600 px-2">•••</button>
      </div>
    </article>
  );
}
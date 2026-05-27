import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

type Comment = {
  id: string;
  user_name: string;
  content: string;
  created_at: string;
};

export default function Komentar() {
  const { postId } = useParams();
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    // DUMMY DATA SQL - Simulasi GET /comments?post_id=...
    const dummyComments = [
      { id: "1", user_name: "Rito", content: "Keren jes! Skema DB SQL-nya sudah aku sinkronkan juga.", created_at: "5m ago" },
      { id: "2", user_name: "Prilia", content: "Setuju, layout grid post-nya sudah rapi.", created_at: "2m ago" }
    ];
    setComments(dummyComments);
  }, [postId]);

  return (
    <div className="min-h-screen bg-[#181919] text-[#e2e2e2] p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-[#262626] border border-[#333] p-6 rounded-md h-fit">
        <Link to="/" className="text-xs text-[#2b69d1] hover:underline mb-4 block">← Kembali ke Beranda</Link>
        <h2 className="text-md font-bold mb-4 border-b border-[#333] pb-2">Komentar Post #{postId}</h2>
        
        {/* List Komentar 1 Level */}
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-[#181919] p-3 border border-[#333] rounded-sm">
              <p className="text-xs font-bold text-[#2b69d1] mb-1">{comment.user_name}</p>
              <p className="text-sm text-[#e2e2e2]">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
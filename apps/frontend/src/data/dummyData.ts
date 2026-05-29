import type { Post } from "../types";

export const posts: Post[] = [
  {
    id: "1",
    title: "Apa trik psikologi keren yang pernah kamu coba?",
    content: "1. Diam selama tiga detik setelah seseorang selesai bicara...",
    created_at: new Date().toISOString(),
    user: { name: "Dèvan Alhoni", bio: "Bocah Yang Sedikit (Sok Tau) · 9bln" },
    _count: { post_likes: 3600, comments: 20 },
    blocks: [
        { type: "text", text: "1. Diam selama tiga detik..." },
        { type: "image", url: "https://images.unsplash.com/photo-1559757175-5700dde675bc" }
    ],
    comments_preview: [
        { id: "c1", user: { name: "Zahra Tasyamaula" }, content: "Teknik diam 3 detik itu beneran ampuh!", created_at: "1thn" }
    ]
  }
];
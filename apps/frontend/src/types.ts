// Pastikan ada kata "export" di depan interface/type
export interface Comment {
  id: string;
  user: { name: string };
  content: string;
  created_at: string;
}

export interface ContentBlock {
  type: "text" | "image";
  text?: string;
  url?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  blocks: ContentBlock[];
  created_at: string;
  user: { name: string; bio?: string; };
  _count: { post_likes: number; comments: number; };
  comments_preview: Comment[];
}
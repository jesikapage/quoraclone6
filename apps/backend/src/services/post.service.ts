import { prisma } from "../../prisma/db";

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, avatar_url: true }
        },
        _count: {
          select: { comments: true, post_likes: true }
        }
      }
    });

    // Konversi tipe BigInt ke String agar tidak error saat dikirim sebagai JSON
    const formattedPosts = posts.map(post => ({
      ...post,
      id: post.id.toString(),
      user_id: post.user_id.toString(),
      user: {
        ...post.user,
        id: post.user.id.toString()
      }
    }));

    return { data: formattedPosts };
  } catch (error: any) {
    return { error: error.message, status: 500 };
  }
}

export async function createPost(userId: string, content: string, imageUrl?: string) {
  try {
    const newPost = await prisma.post.create({
      data: {
        user_id: BigInt(userId),
        content: content,
        image_url: imageUrl || null
      }
    });

    return {
      data: {
        ...newPost,
        id: newPost.id.toString(),
        user_id: newPost.user_id.toString()
      }
    };
  } catch (error: any) {
    return { error: error.message, status: 500 };
  }
}
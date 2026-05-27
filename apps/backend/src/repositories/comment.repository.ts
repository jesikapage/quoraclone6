import { prisma } from "../../prisma/db";

const userSelect = {
  id: true,
  name: true,
  username: true,
  avatar_url: true,
};

const baseCommentSelect = {
  id: true,
  post_id: true,
  user_id: true,
  parent_comment_id: true,
  content: true,
  created_at: true,
  updated_at: true,
  user: { select: userSelect },
};

// ─────────────────────────────────────────────────────────────
// GET komentar root suatu post + eager load 2 level replies
// ─────────────────────────────────────────────────────────────
export async function findCommentsByPostId(
  postId: bigint,
  skip: number,
  take: number,
) {
  return prisma.comment.findMany({
    where: { post_id: postId, parent_comment_id: null },
    select: {
      ...baseCommentSelect,
      replies: {
        select: {
          ...baseCommentSelect,
          replies: {
            select: {
              ...baseCommentSelect,
              _count: { select: { replies: true } },
            },
            orderBy: { created_at: "asc" },
          },
          _count: { select: { replies: true } },
        },
        orderBy: { created_at: "asc" },
      },
      _count: { select: { replies: true } },
    },
    orderBy: { created_at: "desc" },
    skip,
    take,
  });
}

export async function countRootCommentsByPostId(postId: bigint) {
  return prisma.comment.count({
    where: { post_id: postId, parent_comment_id: null },
  });
}

// ─────────────────────────────────────────────────────────────
// GET replies suatu komentar (lazy load / pagination)
// ─────────────────────────────────────────────────────────────
export async function findRepliesByCommentId(
  commentId: bigint,
  skip: number,
  take: number,
) {
  return prisma.comment.findMany({
    where: { parent_comment_id: commentId },
    select: {
      ...baseCommentSelect,
      _count: { select: { replies: true } },
    },
    orderBy: { created_at: "asc" },
    skip,
    take,
  });
}

export async function countRepliesByCommentId(commentId: bigint) {
  return prisma.comment.count({ where: { parent_comment_id: commentId } });
}

// ─────────────────────────────────────────────────────────────
// CREATE komentar / reply
// ─────────────────────────────────────────────────────────────
export async function createComment(data: {
  post_id: bigint;
  user_id: bigint;
  content: string;
  parent_comment_id?: bigint;
}) {
  return prisma.comment.create({
    data,
    select: {
      ...baseCommentSelect,
      _count: { select: { replies: true } },
    },
  });
}

// ─────────────────────────────────────────────────────────────
// UPDATE komentar (hanya pemilik)
// ─────────────────────────────────────────────────────────────
export async function updateComment(
  id: bigint,
  userId: bigint,
  content: string,
) {
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) return null;
  if (comment.user_id !== userId) return "forbidden" as const;

  return prisma.comment.update({
    where: { id },
    data: { content },
    select: {
      ...baseCommentSelect,
      _count: { select: { replies: true } },
    },
  });
}

// ─────────────────────────────────────────────────────────────
// DELETE komentar (hanya pemilik)
// replies → parent_comment_id SET NULL (sesuai schema)
// ─────────────────────────────────────────────────────────────
export async function deleteComment(id: bigint, userId: bigint) {
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) return null;
  if (comment.user_id !== userId) return "forbidden" as const;

  await prisma.comment.delete({ where: { id } });
  return true;
}

// ─────────────────────────────────────────────────────────────
// HELPERS validasi
// ─────────────────────────────────────────────────────────────
export async function postExists(postId: bigint) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  return !!post;
}

export async function commentBelongsToPost(commentId: bigint, postId: bigint) {
  const comment = await prisma.comment.findFirst({
    where: { id: commentId, post_id: postId },
  });
  return !!comment;
}

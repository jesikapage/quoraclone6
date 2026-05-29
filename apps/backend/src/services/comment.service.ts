import * as repo from "../repositories/comment.repository";

// ─────────────────────────────────────────────────────────────
// Utils
// ─────────────────────────────────────────────────────────────

// BigInt tidak bisa di-JSON.stringify langsung → konversi ke string
function serializeBigInt(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "bigint") return obj.toString();
  if (Array.isArray(obj)) return obj.map(serializeBigInt);
  if (typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([k, v]) => [
        k,
        serializeBigInt(v),
      ]),
    );
  }
  return obj;
}

// Flatten _count.replies → reply_count, dan proses replies secara rekursif
function normalizeComment(comment: Record<string, unknown>): unknown {
  const { _count, replies, ...rest } = comment as {
    _count?: { replies: number };
    replies?: Record<string, unknown>[];
    [key: string]: unknown;
  };

  return {
    ...rest,
    reply_count: _count?.replies ?? 0,
    replies: Array.isArray(replies)
      ? replies.map((r) => normalizeComment(r))
      : [],
  };
}

function parsePage(page: unknown, defaultLimit: number) {
  const p = Math.max(1, Number(page) || 1);
  const l = Math.min(50, Math.max(1, Number(defaultLimit) || 10));
  return { page: p, limit: l, skip: (p - 1) * l };
}

// ─────────────────────────────────────────────────────────────
// GET /posts/:postId/comments
// ─────────────────────────────────────────────────────────────
export async function getComments(postId: string, page: number, limit: number) {
  const postBigInt = BigInt(postId);

  if (!(await repo.postExists(postBigInt))) {
    return { error: "POST_NOT_FOUND", status: 404 } as const;
  }

  const skip = (page - 1) * limit;
  const [comments, total] = await Promise.all([
    repo.findCommentsByPostId(postBigInt, skip, limit),
    repo.countRootCommentsByPostId(postBigInt),
  ]);

  return {
    data: serializeBigInt(
      comments.map((c) =>
        normalizeComment(c as unknown as Record<string, unknown>),
      ),
    ),
    meta: {
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
      has_next: page * limit < total,
      has_prev: page > 1,
    },
  };
}

// ─────────────────────────────────────────────────────────────
// GET /posts/:postId/comments/:commentId/replies
// ─────────────────────────────────────────────────────────────
export async function getReplies(
  postId: string,
  commentId: string,
  page: number,
  limit: number,
) {
  const postBigInt = BigInt(postId);
  const commentBigInt = BigInt(commentId);

  if (!(await repo.postExists(postBigInt))) {
    return { error: "POST_NOT_FOUND", status: 404 } as const;
  }
  if (!(await repo.commentBelongsToPost(commentBigInt, postBigInt))) {
    return { error: "COMMENT_NOT_FOUND", status: 404 } as const;
  }

  const skip = (page - 1) * limit;
  const [replies, total] = await Promise.all([
    repo.findRepliesByCommentId(commentBigInt, skip, limit),
    repo.countRepliesByCommentId(commentBigInt),
  ]);

  return {
    data: serializeBigInt(
      replies.map((r) =>
        normalizeComment(r as unknown as Record<string, unknown>),
      ),
    ),
    meta: {
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
      has_next: page * limit < total,
      has_prev: page > 1,
    },
  };
}

// ─────────────────────────────────────────────────────────────
// POST /posts/:postId/comments
// ─────────────────────────────────────────────────────────────
export async function createComment(
  postId: string,
  body: { user_id: string; content: string; parent_comment_id?: string },
) {
  if (!body.content?.trim()) {
    return { error: "CONTENT_REQUIRED", status: 422 } as const;
  }

  const postBigInt = BigInt(postId);

  if (!(await repo.postExists(postBigInt))) {
    return { error: "POST_NOT_FOUND", status: 404 } as const;
  }

  let parentBigInt: bigint | undefined;
  if (body.parent_comment_id) {
    parentBigInt = BigInt(body.parent_comment_id);
    if (!(await repo.commentBelongsToPost(parentBigInt, postBigInt))) {
      return { error: "PARENT_COMMENT_NOT_FOUND", status: 404 } as const;
    }
  }

  const comment = await repo.createComment({
    post_id: postBigInt,
    user_id: BigInt(body.user_id),
    content: body.content.trim(),
    parent_comment_id: parentBigInt,
  });

  return {
    data: serializeBigInt(
      normalizeComment(comment as unknown as Record<string, unknown>),
    ),
    status: 201,
  };
}

// ─────────────────────────────────────────────────────────────
// PATCH /posts/:postId/comments/:commentId
// ─────────────────────────────────────────────────────────────
export async function updateComment(
  postId: string,
  commentId: string,
  body: { user_id: string; content: string },
) {
  if (!body.content?.trim()) {
    return { error: "CONTENT_REQUIRED", status: 422 } as const;
  }

  const postBigInt = BigInt(postId);
  const commentBigInt = BigInt(commentId);

  if (!(await repo.commentBelongsToPost(commentBigInt, postBigInt))) {
    return { error: "COMMENT_NOT_FOUND", status: 404 } as const;
  }

  const result = await repo.updateComment(
    commentBigInt,
    BigInt(body.user_id),
    body.content.trim(),
  );

  if (result === null)
    return { error: "COMMENT_NOT_FOUND", status: 404 } as const;
  if (result === "forbidden")
    return { error: "FORBIDDEN", status: 403 } as const;

  return {
    data: serializeBigInt(
      normalizeComment(result as unknown as Record<string, unknown>),
    ),
    status: 200,
  };
}

// ─────────────────────────────────────────────────────────────
// DELETE /posts/:postId/comments/:commentId
// ─────────────────────────────────────────────────────────────
export async function deleteComment(
  postId: string,
  commentId: string,
  userId: string,
) {
  const postBigInt = BigInt(postId);
  const commentBigInt = BigInt(commentId);

  if (!(await repo.commentBelongsToPost(commentBigInt, postBigInt))) {
    return { error: "COMMENT_NOT_FOUND", status: 404 } as const;
  }

  const result = await repo.deleteComment(commentBigInt, BigInt(userId));

  if (result === null)
    return { error: "COMMENT_NOT_FOUND", status: 404 } as const;
  if (result === "forbidden")
    return { error: "FORBIDDEN", status: 403 } as const;

  return {
    data: { message: "Comment deleted successfully" },
    status: 200,
  };
}

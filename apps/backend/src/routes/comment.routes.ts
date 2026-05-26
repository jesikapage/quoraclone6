import { Elysia, t } from "elysia";
import * as service from "../services/comment.service";

export const commentRoutes = new Elysia({ prefix: "/posts/:postId/comments" })

  // GET /posts/:postId/comments
  .get(
    "/",
    async ({ params, query, set }) => {
      const page  = Math.max(1, Number(query.page)  || 1);
      const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));

      const result = await service.getComments(params.postId, page, limit);

      if ("error" in result) {
        set.status = result.status;
        return { success: false, error: result.error };
      }

      return { success: true, ...result };
    },
    {
      params: t.Object({ postId: t.String() }),
      query: t.Object({
        page:  t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
    }
  )

  // POST /posts/:postId/comments  (komentar baru atau reply)
  .post(
    "/",
    async ({ params, body, set }) => {
      const result = await service.createComment(params.postId, body);

      set.status = result.status ?? 200;

      if ("error" in result) {
        return { success: false, error: result.error };
      }

      return { success: true, data: result.data };
    },
    {
      params: t.Object({ postId: t.String() }),
      body: t.Object({
        user_id:           t.String(),
        content:           t.String({ minLength: 1 }),
        parent_comment_id: t.Optional(t.String()),
      }),
    }
  )

  // GET /posts/:postId/comments/:commentId/replies  (lazy load)
  .get(
    "/:commentId/replies",
    async ({ params, query, set }) => {
      const page  = Math.max(1, Number(query.page)  || 1);
      const limit = Math.min(50, Math.max(1, Number(query.limit) || 5));

      const result = await service.getReplies(
        params.postId,
        params.commentId,
        page,
        limit
      );

      if ("error" in result) {
        set.status = result.status;
        return { success: false, error: result.error };
      }

      return { success: true, ...result };
    },
    {
      params: t.Object({ postId: t.String(), commentId: t.String() }),
      query: t.Object({
        page:  t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
    }
  )

  // PATCH /posts/:postId/comments/:commentId
  .patch(
    "/:commentId",
    async ({ params, body, set }) => {
      const result = await service.updateComment(
        params.postId,
        params.commentId,
        body
      );

      set.status = result.status ?? 200;

      if ("error" in result) {
        return { success: false, error: result.error };
      }

      return { success: true, data: result.data };
    },
    {
      params: t.Object({ postId: t.String(), commentId: t.String() }),
      body: t.Object({
        user_id: t.String(),
        content: t.String({ minLength: 1 }),
      }),
    }
  )

  // DELETE /posts/:postId/comments/:commentId
  .delete(
    "/:commentId",
    async ({ params, body, set }) => {
      const result = await service.deleteComment(
        params.postId,
        params.commentId,
        body.user_id
      );

      set.status = result.status ?? 200;

      if ("error" in result) {
        return { success: false, error: result.error };
      }

      return { success: true, data: result.data };
    },
    {
      params: t.Object({ postId: t.String(), commentId: t.String() }),
      body: t.Object({ user_id: t.String() }),
    }
  );

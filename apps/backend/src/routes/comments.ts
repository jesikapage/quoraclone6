import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { bearer } from "@elysiajs/bearer";
import prisma from "../lib/prisma";

export const commentRoutes = new Elysia({ prefix: "/comments" })
  .use(jwt({ name: "jwt", secret: process.env.JWT_SECRET || "fallback_secret" }))
  .use(bearer())

  .get("/:id", async ({ params, set }) => {
    const post = await prisma.post.findUnique({ where: { id: params.id } });
    if (!post) { set.status = 404; return { error: "Post tidak ditemukan" }; }

    const comments = await prisma.comment.findMany({
      where: { postId: params.id },
      include: { user: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: "desc" },
    });
    return comments;
  })

  .post("/:id", async ({ params, bearer, jwt, body, set }) => {
    const payload = await jwt.verify(bearer);
    if (!payload) { set.status = 401; return { error: "Unauthorized" }; }

    const userId = payload.userId as string;

    const commentCount = await prisma.comment.count({ where: { userId } });
    if (commentCount >= 5) {
      set.status = 403;
      return { error: "Kamu sudah mencapai batas maksimal 5 komentar" };
    }

    const post = await prisma.post.findUnique({ where: { id: params.id } });
    if (!post) { set.status = 404; return { error: "Post tidak ditemukan" }; }

    const comment = await prisma.comment.create({
      data: { content: body.content, userId, postId: params.id },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });

    if (post.userId !== userId) {
      await prisma.notification.create({
        data: {
          message: `Ada yang mengomentari postinganmu`,
          userId: post.userId,
          postId: post.id,
        },
      });
    }

    return { message: "Komentar berhasil ditambahkan", comment };
  }, {
    body: t.Object({
      content: t.String({ minLength: 1 }),
    }),
  })

  // PUT edit komentar
  .put("/comment/:commentId", async ({ params, bearer, jwt, body, set }) => {
    const payload = await jwt.verify(bearer);
    if (!payload) { set.status = 401; return { error: "Unauthorized" }; }

    const comment = await prisma.comment.findUnique({ where: { id: params.commentId } });
    if (!comment) { set.status = 404; return { error: "Komentar tidak ditemukan" }; }
    if (comment.userId !== payload.userId) { set.status = 403; return { error: "Forbidden" }; }

    const updated = await prisma.comment.update({
      where: { id: params.commentId },
      data: { content: body.content },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });

    return { message: "Komentar berhasil diupdate", comment: updated };
  }, {
    body: t.Object({
      content: t.String({ minLength: 1 }),
    }),
  })

  // DELETE hapus komentar
  .delete("/comment/:commentId", async ({ params, bearer, jwt, set }) => {
    const payload = await jwt.verify(bearer);
    if (!payload) { set.status = 401; return { error: "Unauthorized" }; }

    const comment = await prisma.comment.findUnique({ where: { id: params.commentId } });
    if (!comment) { set.status = 404; return { error: "Komentar tidak ditemukan" }; }
    if (comment.userId !== payload.userId) { set.status = 403; return { error: "Forbidden" }; }

    await prisma.comment.delete({ where: { id: params.commentId } });
    return { message: "Komentar berhasil dihapus" };
  });
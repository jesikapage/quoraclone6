import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { bearer } from "@elysiajs/bearer";
import prisma from "../lib/prisma";

export const postRoutes = new Elysia({ prefix: "/posts" })
  .use(jwt({ name: "jwt", secret: process.env.JWT_SECRET || "fallback_secret" }))
  .use(bearer())

  // GET semua postingan dengan pagination
  .get("/", async ({ query }) => {
    const page = parseInt((query as any).page || "1");
    const limit = 10;
    const skip = (page - 1) * limit;

    const posts = await prisma.post.findMany({
      take: limit,
      skip,
      include: {
        user: { select: { id: true, name: true, avatar: true, credential: true } },
        _count: { select: { comments: true, likes: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return posts;
  })

  // GET detail 1 postingan
  .get("/:id", async ({ params, set }) => {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, name: true, avatar: true, credential: true } },
        comments: {
          include: { user: { select: { id: true, name: true, avatar: true, credential: true } } },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { likes: true } },
      },
    });
    if (!post) { set.status = 404; return { error: "Post tidak ditemukan" }; }
    return post;
  })

  // POST buat postingan baru
  .post("/", async ({ bearer, jwt, body, set }) => {
    const payload = await jwt.verify(bearer);
    if (!payload) { set.status = 401; return { error: "Unauthorized" }; }

    const userId = payload.userId as string;

    const postCount = await prisma.post.count({ where: { userId } });
    if (postCount >= 2) {
      set.status = 403;
      return { error: "Kamu sudah mencapai batas maksimal 2 postingan" };
    }

    const post = await prisma.post.create({
      data: { content: body.content, imageUrl: body.imageUrl, userId },
      include: { user: { select: { id: true, name: true, avatar: true, credential: true } } },
    });
    return { message: "Post berhasil dibuat", post };
  }, {
    body: t.Object({
      content: t.String({ minLength: 1 }),
      imageUrl: t.Optional(t.String()),
    }),
  })

  // PUT edit postingan
  .put("/:id", async ({ bearer, jwt, params, body, set }) => {
    const payload = await jwt.verify(bearer);
    if (!payload) { set.status = 401; return { error: "Unauthorized" }; }

    const post = await prisma.post.findUnique({ where: { id: params.id } });
    if (!post) { set.status = 404; return { error: "Post tidak ditemukan" }; }
    if (post.userId !== payload.userId) { set.status = 403; return { error: "Forbidden" }; }

    const updated = await prisma.post.update({
      where: { id: params.id },
      data: { content: body.content, imageUrl: body.imageUrl },
    });
    return { message: "Post berhasil diupdate", post: updated };
  }, {
    body: t.Object({
      content: t.String({ minLength: 1 }),
      imageUrl: t.Optional(t.String()),
    }),
  })

  // DELETE postingan
  .delete("/:id", async ({ bearer, jwt, params, set }) => {
    const payload = await jwt.verify(bearer);
    if (!payload) { set.status = 401; return { error: "Unauthorized" }; }

    const post = await prisma.post.findUnique({ where: { id: params.id } });
    if (!post) { set.status = 404; return { error: "Post tidak ditemukan" }; }
    if (post.userId !== payload.userId) { set.status = 403; return { error: "Forbidden" }; }

    await prisma.post.delete({ where: { id: params.id } });
    return { message: "Post berhasil dihapus" };
  });
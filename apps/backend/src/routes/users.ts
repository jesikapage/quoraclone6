import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { bearer } from "@elysiajs/bearer";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

export const userRoutes = new Elysia({ prefix: "/users" })
  .use(jwt({ name: "jwt", secret: process.env.JWT_SECRET || "fallback_secret" }))
  .use(bearer())

  .get("/", async ({ query, set }) => {
    if (query.key !== "your-secret-key") {
      set.status = 401;
      return { error: "Unauthorized" };
    }
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, avatar: true, createdAt: true },
    });
    return users;
  })

  .get("/me", async ({ bearer, jwt, set }) => {
    const payload = await jwt.verify(bearer);
    if (!payload) { set.status = 401; return { error: "Unauthorized" }; }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: { id: true, name: true, email: true, avatar: true, credential: true, bio: true, createdAt: true },
    });
    return user;
  })

  .put("/profile", async ({ bearer, jwt, body, set }) => {
    const payload = await jwt.verify(bearer);
    if (!payload) { set.status = 401; return { error: "Unauthorized" }; }

    const userId = payload.userId as string;
    const updateData: any = {};

    if (body.name) updateData.name = body.name;
    if (body.avatar) updateData.avatar = body.avatar;
    if (body.email) updateData.email = body.email;
    if (body.credential !== undefined) updateData.credential = body.credential;
    if (body.bio !== undefined) updateData.bio = body.bio;

    if (body.newPassword) {
      if (!body.currentPassword) {
        set.status = 400;
        return { error: "Password lama harus diisi" };
      }
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user?.password) {
        set.status = 400;
        return { error: "Akun ini tidak menggunakan password" };
      }
      const valid = await bcrypt.compare(body.currentPassword, user.password);
      if (!valid) {
        set.status = 400;
        return { error: "Password lama salah" };
      }
      updateData.password = await bcrypt.hash(body.newPassword, 10);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, name: true, email: true, avatar: true, credential: true, bio: true },
    });

    return { message: "Profile berhasil diupdate", user: updated };
  }, {
    body: t.Object({
      name: t.Optional(t.String()),
      email: t.Optional(t.String()),
      avatar: t.Optional(t.String()),
      credential: t.Optional(t.String()),
      bio: t.Optional(t.String()),
      currentPassword: t.Optional(t.String()),
      newPassword: t.Optional(t.String()),
    }),
  });
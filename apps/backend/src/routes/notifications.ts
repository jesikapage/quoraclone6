import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { bearer } from "@elysiajs/bearer";
import prisma from "../lib/prisma";

export const notificationRoutes = new Elysia({ prefix: "/notifications" })
  .use(jwt({ name: "jwt", secret: process.env.JWT_SECRET || "fallback_secret" }))
  .use(bearer())

  // GET notifikasi milik user yang login
  .get("/", async ({ bearer, jwt, set }) => {
    const payload = await jwt.verify(bearer);
    if (!payload) { set.status = 401; return { error: "Unauthorized" }; }

    const notifications = await prisma.notification.findMany({
      where: { userId: payload.userId as string },
      orderBy: { createdAt: "desc" },
    });
    return notifications;
  })

  // PUT tandai semua notifikasi sebagai sudah dibaca
  .put("/read-all", async ({ bearer, jwt, set }) => {
    const payload = await jwt.verify(bearer);
    if (!payload) { set.status = 401; return { error: "Unauthorized" }; }

    await prisma.notification.updateMany({
      where: { userId: payload.userId as string, isRead: false },
      data: { isRead: true },
    });
    return { message: "Semua notifikasi sudah dibaca" };
  });
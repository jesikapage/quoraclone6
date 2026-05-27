import { Elysia, t } from "elysia";
import { prisma } from "../../prisma/db";
import { compare } from "bcryptjs"; // Ekstraksi fungsi secara spesifik

export const authRoutes = new Elysia({ prefix: "/login" })
  .post("/", async ({ body, set }) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email: body.email }
      });

      if (!user || !user.password) {
        set.status = 401;
        return { success: false, message: "Surel atau kata sandi tidak valid." };
      }

      // Panggil langsung fungsi compare yang sudah diekstrak
      const isMatch = await compare(body.password, user.password);

      if (!isMatch) {
        set.status = 401;
        return { success: false, message: "Surel atau kata sandi tidak valid." };
      }

      const safeUser = {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        avatarUrl: user.avatar_url
      };

      return {
        success: true,
        user: safeUser,
        token: "jwt-token-asli-bisa-dibuat-nanti"
      };

    } catch (error) {
      console.error("[AUTH ERROR]", error);
      set.status = 500;
      return { success: false, message: "Kesalahan server internal saat memproses login." };
    }
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String()
    })
  });
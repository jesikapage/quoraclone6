import { Elysia, t } from "elysia";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "../lib/prisma";
import { jwt } from "@elysiajs/jwt";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleRoutes = new Elysia({ prefix: "/auth" })
  .use(jwt({ name: "jwt", secret: process.env.JWT_SECRET || "fallback_secret" }))
  .post("/google", async ({ body, jwt, set }) => {
    try {
      const { token } = body;
      
      // 1. Verifikasi token dari Google
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      
      if (!payload || !payload.email) {
        set.status = 401;
        return { error: "Token tidak valid" };
      }

      // 2. Cari atau buat user di database
      let user = await prisma.user.findUnique({ where: { email: payload.email } });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: payload.email,
            name: payload.name || "User Google",
            avatar: payload.picture,
            googleId: payload.sub, // Simpan Google ID
          },
        });
      } else if (!user.googleId) {
        // Jika user sudah ada via email tapi belum punya googleId, update
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId: payload.sub, avatar: payload.picture },
        });
      }

      // 3. Buat token JWT untuk aplikasi Anda
      const accessToken = await jwt.sign({ userId: user.id });
      return { token: accessToken, user };

    } catch (error) {
      set.status = 500;
      return { error: "Gagal login dengan Google" };
    }
  }, {
    body: t.Object({ token: t.String() })
  });
import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { OAuth2Client } from "google-auth-library";
import prisma from "../lib/prisma";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "fallback_secret",
    })
  )

  // ── Register ──────────────────────────────────────────────
  .post(
    "/register",
    async ({ body, set }) => {
      console.log("📥 [BACKEND] Ada request register masuk!", body);

      const { name, email, password } = body;

      try {
        console.log("🔍 [BACKEND] Memeriksa email di database...");
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
          console.log("❌ [BACKEND] Email sudah terdaftar.");
          set.status = 400;
          return { error: "Email sudah digunakan" };
        }

        console.log("🔑 [BACKEND] Melakukan hashing password...");
        const hashedPassword = await Bun.password.hash(password);

        console.log("💾 [BACKEND] Mencoba menyimpan user ke Neon Cloud...");
        const user = await prisma.user.create({
          data: { name, email, password: hashedPassword },
        });

        console.log("✅ [BACKEND] User berhasil disimpan!", user.id);
        return {
          message: "Registrasi berhasil",
          user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
        };
      } catch (dbError: any) {
        console.error("🔥 [BACKEND] ERROR DATABASE TERJADI:", dbError);
        set.status = 500;
        return { error: "Database error", message: dbError.message };
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 6 }),
      }),
    }
  )

  // ── Login ─────────────────────────────────────────────────
  .post(
    "/login",
    async ({ body, set, jwt }) => {
      const { email, password } = body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.password) {
        set.status = 401;
        return { error: "Email atau password salah" };
      }

      const valid = await Bun.password.verify(password, user.password);
      if (!valid) {
        set.status = 401;
        return { error: "Email atau password salah" };
      }

      const token = await jwt.sign({ userId: user.id });

      return {
        message: "Login berhasil",
        token,
        user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
      };
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 1 }),
      }),
    }
  )

  // ── Google OAuth ──────────────────────────────────────────
  .post(
    "/google",
    async ({ body, set, jwt }) => {
      const { token } = body;

      // Verifikasi ID token dari Google
      let payload: any;
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
      } catch {
        set.status = 401;
        return { error: "Token Google tidak valid." };
      }

      if (!payload?.email) {
        set.status = 400;
        return { error: "Tidak dapat mengambil data dari Google." };
      }

      const { sub: googleId, email, name, picture: avatar } = payload;

      // Cari user berdasarkan googleId atau email
      let user = await prisma.user.findFirst({
        where: { OR: [{ googleId }, { email }] },
      });

      if (user) {
        // User sudah ada — update googleId & avatar kalau belum terisi
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: user.googleId ?? googleId,
            avatar: user.avatar ?? avatar,
          },
        });
      } else {
        // User baru — buat akun otomatis
        user = await prisma.user.create({
          data: {
            name: name ?? email.split("@")[0],
            email,
            googleId,
            avatar,
            password: null,
          },
        });
      }

      const jwtToken = await jwt.sign({ userId: user.id });

      return {
        message: "Login Google berhasil",
        token: jwtToken,
        user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
      };
    },
    {
      body: t.Object({
        token: t.String(),
      }),
    }
  );
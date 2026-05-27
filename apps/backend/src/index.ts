import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import * as dotenv from "dotenv";
import { commentRoutes } from "./routes/comment.routes";
import { postRoutes } from "./routes/post.routes";
import { authRoutes } from "./routes/auth.routes";

dotenv.config();

const app = new Elysia()

  .use(
    cors({
      origin: "*", // Mengizinkan semua domain (Termasuk S3 kamu) tembus tanpa drama
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    })
  )
  
  .get("/", () => ({ message: "API is running alias berjalan 🚀 via Lambda Function URL" }))


  .post("/auth/google", async ({ body, set }) => {
    const { token } = body;

    try {
      const googleRes = await globalThis.fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);

      if (!googleRes.ok) {
        set.status = 401;
        return { success: false, message: "Token Google tidak valid atau kedaluwarsa" };
      }

      const googleUser = (await googleRes.json()) as any;

      // Simulasi token session untuk sementara sebelum kita masuk ke database Prisma
      const dummySessionToken = "session_mock_" + Math.random().toString(36).substr(2, 9);

      return {
        success: true,
        message: "Login Google Berhasil!",
        token: dummySessionToken,
        user: {
          id: googleUser.sub,
          name: googleUser.name,
          email: googleUser.email,
          avatarUrl: googleUser.picture
        }
      };

    } catch (error) {
      set.status = 500;
      return { success: false, error: "INTERNAL_SERVER_ERROR", message: String(error) };
    }
  }, {
    body: t.Object({
      token: t.String()
    })
  })

  .get("/users", ({ query, set }) => {
    const secretKey = query.key;
    const VALID_KEY = "asdos-ppwl-rahasia-2026";

    if (!secretKey || secretKey !== VALID_KEY) {
      set.status = 403; // Forbidden
      return {
        success: false,
        error: "FORBIDDEN",
        message: "Akses ditolak! Kunci pemeriksaan salah atau tidak disertakan."
      };
    }

    return [
      { id: "1", name: "Jesika Manager", role: "Admin AWS" },
      { id: "2", name: "Rito Backend", role: "Developer" },
      { id: "3", name: "Prilia UI/UX", role: "UI/UX Designer" }
    ];
  })

  .use(authRoutes)
  .use(postRoutes)
  .use(commentRoutes)

  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 422;
      return {
        success: false,
        error: "VALIDATION_ERROR",
        detail: error.message,
      };
    }
    if (code === "NOT_FOUND") {
      set.status = 404;
      return { success: false, error: "NOT_FOUND" };
    }
    console.error("[ERROR]", error);
    set.status = 500;
    return { success: false, error: "INTERNAL_SERVER_ERROR" };
  })
  .listen(3000);

console.log(`Backend lokal berjalan di http://localhost:3000`);

export default {
  port: process.env.PORT || 3000,
  fetch(request: Request, env: any) {
    return app.fetch(request);
  },
};

export type App = typeof app;

// Baris ini ditambahkan untuk memancing robot CI/CD backend menyala
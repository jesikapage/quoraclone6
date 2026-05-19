import { Elysia } from "elysia";
import * as dotenv from "dotenv";
import { commentRoutes } from "./routes/comment.routes";

dotenv.config();

const app = new Elysia()
  .get("/", () => ({ message: "API is running 🚀" }))

  // ── ROUTE KHUSUS PEMERIKSAAN ASDOS ─────────────────────────────────────────
  .get("/users", ({ query, set }) => {
    const secretKey = query.key;
    
    // Kata kunci rahasia kelompok kalian yang bakal diketik asdos (?key=...)
    const VALID_KEY = "asdos-ppwl-rahasia-2026"; 

    // Validasi pengecekan key rahasia
    if (!secretKey || secretKey !== VALID_KEY) {
      set.status = 403; // Forbidden
      return { 
        success: false, 
        error: "FORBIDDEN", 
        message: "Akses ditolak! Kunci pemeriksaan salah atau tidak disertakan." 
      };
    }

    // Jika key benar, return data dummy akun kelompok kalian untuk kebutuhan examine
    return [
      { id: "1", name: "Jesika Manager", role: "Admin AWS" },
      { id: "2", name: "Rito Backend", role: "Developer" },
      { id: "3", name: "Prilia UI/UX", role: "UI/UX Designer" }
    ];
  })
  // ──────────────────────────────────────────────────────────────────────────

  // Daftarkan semua route di sini
  .use(commentRoutes)

  // Global error handler
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

console.log(
  `🦊 Elysia running at http://${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
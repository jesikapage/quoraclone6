import { Elysia } from "elysia";
import * as dotenv from "dotenv";
import { commentRoutes } from "./routes/comment.routes";

dotenv.config();

const app = new Elysia()
  .get("/", () => ({ message: "API is running 🚀" }))

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

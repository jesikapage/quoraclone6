import { Elysia, t } from "elysia";
import * as dotenv from "dotenv";
import { commentRoutes } from "./routes/comment.routes";

dotenv.config();

const app = new Elysia()
  .get("/", () => ({ message: "API is running alias berjalan 🚀 via Lambda Function URL" }))

  .post("/auth/google", async ({ body, set }) => {
    const { token } = body;

    try {
      const googleRes = await globalThis.fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
      
      if (!googleRes.ok) {
        set.status = 401;
        return { success: false, message: "Token Google tidak valid atau kedaluwarsa" };
      }

      const googleUser = (await googleRes.json()) as {
        name: string;
        email: string;
        picture: string;
      };

      return {
        success: true,
        message: "Login Google Berhasil!",
        user: {
          name: googleUser.name,
          email: googleUser.email,
          picture: googleUser.picture
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
  });

export const fetch = async (request: Request) => {
  return await app.handle(request);
};

export default {
  fetch
};

export type App = typeof app;
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { authRoutes } from "./routes/auth";
import { postRoutes } from "./routes/posts";
import { commentRoutes } from "./routes/comments";
import { likeRoutes } from "./routes/likes";
import { notificationRoutes } from "./routes/notifications";
import { userRoutes } from "./routes/users";
import { uploadRoutes } from "./routes/upload";

export const app = new Elysia()
  .use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }))
  .use(authRoutes)
  .use(postRoutes)
  .use(commentRoutes)
  .use(likeRoutes)
  .use(notificationRoutes)
  .use(userRoutes)
  .use(uploadRoutes)
  .get("/", () => ({ message: "API is running!" }));

if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => {
    console.log("Server lokal menyala di http://localhost:3000");
  });
}

export type App = typeof app;

export const handler = async (event: any) => {
  try {
    const path = event.rawPath || event.path || "/";
    const queryString = event.rawQueryString ? `?${event.rawQueryString}` : "";
    const cleanUrl = `https://${event.headers?.host || "localhost"}${path}${queryString}`;

    const request = new Request(cleanUrl, {
      method: event.requestContext?.http?.method || event.httpMethod || "GET",
      headers: new Headers(event.headers as any),
      body: event.body
        ? event.isBase64Encoded
          ? Buffer.from(event.body, "base64").toString()
          : event.body
        : undefined,
    });

    const response = await app.handle(request);
    const responseText = await response.text();

    return {
      statusCode: response.status,
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
        "access-control-allow-headers": "*",
        ...Object.fromEntries(response.headers.entries()),
      },
      body: responseText,
      isBase64Encoded: false,
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Server Error", message: error.message }),
    };
  }
};
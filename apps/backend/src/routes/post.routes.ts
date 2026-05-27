import { Elysia, t } from "elysia";
import * as service from "../services/post.service";

export const postRoutes = new Elysia({ prefix: "/posts" })
  .get("/", async ({ set }) => {
    const result = await service.getPosts();

    if ("error" in result) {
      set.status = result.status || 500;
      return { success: false, error: result.error };
    }

    return { success: true, data: result.data };
  })
  .post("/", async ({ body, set }) => {
    const result = await service.createPost(
      body.user_id,
      body.content,
      body.image_url
    );

    if ("error" in result) {
      set.status = result.status || 500;
      return { success: false, error: result.error };
    }

    set.status = 201; // Created
    return { success: true, data: result.data };
  }, {
    body: t.Object({
      user_id: t.String(),
      content: t.String({ minLength: 1 }),
      image_url: t.Optional(t.String())
    })
  });
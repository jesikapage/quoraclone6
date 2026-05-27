import { Elysia, t } from "elysia";

export const googleAuthRoutes = new Elysia({ prefix: "/auth" })
  .post("/google", async ({ body, set }) => {
    const { token } = body;

    try {
      const googleRes = await globalThis.fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
      );

      if (!googleRes.ok) {
        set.status = 401;
        return { success: false, message: "Token Google tidak valid atau kedaluwarsa" };
      }

      const googleUser = (await googleRes.json()) as any;

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
  });
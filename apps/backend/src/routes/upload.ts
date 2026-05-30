import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { bearer } from "@elysiajs/bearer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: "ap-southeast-1" });

export const uploadRoutes = new Elysia({ prefix: "/upload" })
  .use(jwt({ name: "jwt", secret: process.env.JWT_SECRET || "fallback_secret" }))
  .use(bearer())

  // GET presigned URL untuk upload gambar
  .get("/presign", async ({ bearer, jwt, query, set }) => {
    const payload = await jwt.verify(bearer);
    if (!payload) { set.status = 401; return { error: "Unauthorized" }; }

    const fileName = `posts/${Date.now()}-${query.filename || "image.jpg"}`;
    const contentType = query.contentType || "image/jpeg";

    const command = new PutObjectCommand({
      Bucket: "kurakura-images",
      Key: fileName,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
    const imageUrl = `https://kurakura-images.s3.ap-southeast-1.amazonaws.com/${fileName}`;

    return { presignedUrl, imageUrl };
  });
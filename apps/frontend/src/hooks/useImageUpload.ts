import { useAuthStore } from "../stores/auth.store";

export function useImageUpload() {
  const { token } = useAuthStore();

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      // 1. Minta presigned URL dari backend
      const presignRes = await fetch(
        `${import.meta.env.VITE_API_URL}/upload/presign?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!presignRes.ok) return null;
      const { presignedUrl, imageUrl } = await presignRes.json();

      // 2. Upload langsung ke S3
      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) return null;

      return imageUrl;
    } catch {
      return null;
    }
  };

  return { uploadImage };
}
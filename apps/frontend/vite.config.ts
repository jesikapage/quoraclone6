import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // --- TAMBAHKAN BLOK BUILD DI BAWAH INI ---
  build: {
    rollupOptions: {
      output: {
        // Trik memaksa nama file berubah total agar cache CloudFront & Browser hancur murni
        entryFileNames: `assets/[name].${Date.now()}.js`,
        chunkFileNames: `assets/[name].${Date.now()}.js`,
        assetFileNames: `assets/[name].${Date.now()}.[ext]`
      }
    }
  }
})
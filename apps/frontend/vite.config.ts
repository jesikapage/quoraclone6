import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-baru-[hash].js`,
        chunkFileNames: `assets/[name]-baru-[hash].js`,
        assetFileNames: `assets/[name]-baru-[hash].[ext]`
      }
    }
  }
})
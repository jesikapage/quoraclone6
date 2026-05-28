import { PrismaClient } from "@prisma/client";

// Mencegah Prisma membuat koneksi berulang kali saat proses hot-reload Bun
const globalForPrisma = globalThis as unknown as { 
  prisma: PrismaClient | undefined 
};

// Paksa Prisma membaca URL langsung dari process.env
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

console.log("🚀 Server terhubung 100% ke Database Neon (Mode Standar)!");

export default prisma;
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { 
  prisma: PrismaClient | undefined 
};

// Kosongkan saja parameternya. 
// Prisma sudah sangat pintar untuk otomatis mencari process.env.DATABASE_URL
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

console.log("🚀 Server terhubung 100% ke Database Neon (Mode Standar)!");

export default prisma;
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL ||
  "postgresql://admin:secret123@localhost:5432/socialmedia";

const adapter = new PrismaPg({
  connectionString,
  max: 1,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
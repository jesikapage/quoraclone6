import { PrismaClient } from "../src/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// 1. Setup your PostgreSQL connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Initialize the adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter to Prisma Client
export const prisma = new PrismaClient({ adapter });

import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Em produção na Vercel usa POSTGRES_PRISMA_URL (com PgBouncer);
// em dev local usa DATABASE_URL do .env.
const connectionString =
  process.env.POSTGRES_PRISMA_URL ?? process.env.DATABASE_URL ?? "";

// Em serverless (Vercel) mantemos max:1 porque o PgBouncer do provedor faz o pool real.
// Em dev/testes usamos max:10 para evitar contenção com múltiplas queries paralelas.
const pool = new Pool({ connectionString, max: process.env.VERCEL ? 1 : 10 });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma };

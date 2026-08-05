import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

// Em produção na Vercel usa POSTGRES_PRISMA_URL (com PgBouncer);
// em dev local usa DATABASE_URL do .env.
const connectionString =
  process.env.POSTGRES_PRISMA_URL ?? process.env.DATABASE_URL ?? "";

// max: 1 porque em serverless o pooling real é feito pelo PgBouncer do provedor.
const pool = new Pool({ connectionString, max: 1 });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma };

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// DB_URL is the existing local-backend convention. Leave it empty in a
// Supabase deployment so DATABASE_URL becomes the runtime connection.
const connectionString = process.env.DB_URL || process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DB_URL or DATABASE_URL must be configured before starting the API.");
}

const pool = new Pool({
    connectionString,
    max: Number(process.env.DB_POOL_MAX || 10),
    connectionTimeoutMillis: Number(process.env.DB_CONNECT_TIMEOUT_MS || 10000),
    idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS || 30000)
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;

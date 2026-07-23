import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";

const connectionString = process.env.DB_URL || process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DB_URL, DIRECT_URL, or DATABASE_URL must be configured before seeding.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const username = process.env.SUPERADMIN_USERNAME || "superadmin";
    const password = process.env.SUPERADMIN_PASSWORD || "superadmin123";
    const isFromEnv = Boolean(process.env.SUPERADMIN_USERNAME || process.env.SUPERADMIN_PASSWORD);

    console.log(`Upserting superadmin account: ${username}...`);
    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = await prisma.admin.upsert({
        where: { username },
        update: { role: Role.SUPERADMIN, password: hashedPassword },
        create: {
            username,
            password: hashedPassword,
            role: Role.SUPERADMIN,
        },
    });

    if (isFromEnv) {
        console.log(`Created superadmin account using env parameters: ${superAdmin.username}`);
    } else {
        console.log(`Created default superadmin account: ${superAdmin.username} (password: superadmin123)`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

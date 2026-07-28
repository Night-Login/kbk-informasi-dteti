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
    const username = process.env.SUPERADMIN_USERNAME?.trim();
    const password = process.env.SUPERADMIN_PASSWORD;

    if (!username || !password) {
        throw new Error(
            "SUPERADMIN_USERNAME and SUPERADMIN_PASSWORD must both be configured before seeding.",
        );
    }

    const existingByUsername = await prisma.admin.findUnique({
        where: { username },
    });

    if (existingByUsername) {
        if (
            existingByUsername.role !== Role.SUPERADMIN ||
            existingByUsername.deletedAt !== null
        ) {
            throw new Error(
                `Admin username "${username}" already exists but is not an active superadmin.`,
            );
        }

        console.log(`Superadmin account "${username}" already exists; no changes were made.`);
        return;
    }

    const existingSuperAdmin = await prisma.admin.findFirst({
        where: {
            role: Role.SUPERADMIN,
            deletedAt: null,
        },
    });

    if (existingSuperAdmin) {
        throw new Error(
            `An active superadmin already exists with username "${existingSuperAdmin.username}".`,
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.admin.create({
        data: {
            username,
            password: hashedPassword,
            role: Role.SUPERADMIN,
        },
    });

    console.log(`Created superadmin account "${username}".`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

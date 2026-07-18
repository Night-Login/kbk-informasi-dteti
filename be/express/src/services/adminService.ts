import prisma from "../prisma/client.js";
import { Admin, CreateAdminDTO, UpdateAdminDTO, Role } from "../types/index.js";
import { Prisma } from "@prisma/client";

/**
 * Helper to strip sensitive fields (password)
 */
const omitPassword = (admin: any): Omit<Admin, "password"> => {
    if (!admin) return admin;
    const { password, ...rest } = admin;
    return rest;
};

/**
 * Get all admins (excluding passwords)
 */
export const getAdmins = async (filters?: { search?: string; role?: Role }): Promise<Omit<Admin, "password">[]> => {
    const conditions: Prisma.AdminWhereInput[] = [];

    if (filters?.role) {
        conditions.push({ role: filters.role });
    }

    if (filters?.search) {
        conditions.push({
            username: { contains: filters.search, mode: "insensitive" }
        });
    }

    const where: Prisma.AdminWhereInput = conditions.length > 0 ? { AND: conditions } : {};

    const admins = await prisma.admin.findMany({
        where,
        orderBy: { createdAt: "desc" }
    });

    return admins.map(omitPassword) as Omit<Admin, "password">[];
};

/**
 * Get admin by ID (excluding password by default)
 */
export const getAdminById = async (id: number): Promise<Omit<Admin, "password"> | null> => {
    const admin = await prisma.admin.findUnique({
        where: { id }
    });

    return admin ? (omitPassword(admin) as Omit<Admin, "password">) : null;
};

/**
 * Get admin by username
 */
export const getAdminByUsername = async (
    username: string,
    includePassword = false
): Promise<Admin | null> => {
    const admin = await prisma.admin.findUnique({
        where: { username }
    });

    if (!admin) return null;
    return includePassword ? (admin as unknown as Admin) : (omitPassword(admin) as Admin);
};

/**
 * Create a new admin
 */
export const createAdmin = async (data: CreateAdminDTO): Promise<Omit<Admin, "password">> => {
    const admin = await prisma.admin.create({
        data: {
            username: data.username,
            password: data.password || "", // Note: controller layer should hash passwords using bcrypt/argon2
            role: data.role || "ADMIN"
        }
    });

    return omitPassword(admin) as Omit<Admin, "password">;
};

/**
 * Update an existing admin
 */
export const updateAdmin = async (id: number, data: UpdateAdminDTO): Promise<Omit<Admin, "password">> => {
    const updateData: Prisma.AdminUpdateInput = {};

    if (data.username !== undefined) updateData.username = data.username;
    if (data.password !== undefined) updateData.password = data.password;
    if (data.role !== undefined) updateData.role = data.role;

    const admin = await prisma.admin.update({
        where: { id },
        data: updateData
    });

    return omitPassword(admin) as Omit<Admin, "password">;
};

/**
 * Delete an admin by ID
 */
export const deleteAdmin = async (id: number): Promise<boolean> => {
    try {
        await prisma.admin.delete({
            where: { id }
        });
        return true;
    } catch (error) {
        console.error(`Error deleting admin ${id}:`, error);
        return false;
    }
};

/**
 * Basic authentication verification helper
 */
export const authenticateAdmin = async (
    username: string,
    passwordPlain: string
): Promise<Omit<Admin, "password"> | null> => {
    const admin = await prisma.admin.findUnique({
        where: { username }
    });

    if (!admin) return null;

    // Direct string match or fallback for when bcrypt is integrated in controllers
    if (admin.password === passwordPlain) {
        return omitPassword(admin) as Omit<Admin, "password">;
    }

    return null;
};

import prisma from "../prisma/client.js";
import { Admin, CreateAdminDTO, UpdateAdminDTO, Role } from "../types/index.js";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";


/**
 * Helper to strip sensitive fields
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
    const conditions: Prisma.AdminWhereInput[] = [
        { deletedAt: null }
    ];

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
 * Get soft-deleted admins for the protected admin trash view.
 */
export const getDeletedAdmins = async (): Promise<Omit<Admin, "password">[]> => {
    const admins = await prisma.admin.findMany({
        where: { deletedAt: { not: null } },
        orderBy: { deletedAt: "desc" }
    });

    return admins.map(omitPassword) as Omit<Admin, "password">[];
};

/**
 * Get admin by ID
 */
export const getAdminById = async (id: number): Promise<Omit<Admin, "password"> | null> => {
    const admin = await prisma.admin.findFirst({
        where: { id, deletedAt: null }
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
    const admin = await prisma.admin.findFirst({
        where: { username, deletedAt: null }
    });

    if (!admin) return null;
    return includePassword ? (admin as unknown as Admin) : (omitPassword(admin) as Admin);
};

/**
 * Create a new admin
 */
export const createAdmin = async (data: CreateAdminDTO): Promise<Omit<Admin, "password">> => {
    const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : "";
    const admin = await prisma.admin.create({
        data: {
            username: data.username,
            password: hashedPassword,
            role: data.role || "ADMIN"
        }
    });

    return omitPassword(admin) as Omit<Admin, "password">;
};

/**
 * Update an existing admin
 */
export const updateAdmin = async (id: number, data: UpdateAdminDTO): Promise<Omit<Admin, "password">> => {
    const existing = await prisma.admin.findFirst({
        where: { id, deletedAt: null }
    });
    if (!existing) {
        throw new Error(`Admin with id ${id} not found or deleted.`);
    }

    const updateData: Prisma.AdminUpdateInput = {};

    if (data.username !== undefined) updateData.username = data.username;
    if (data.password !== undefined) {
        updateData.password = data.password ? await bcrypt.hash(data.password, 10) : "";
    }
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
        await prisma.admin.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
        return true;
    } catch (error) {
        console.error(`Error deleting admin ${id}:`, error);
        return false;
    }
};

/**
 * Restore a soft-deleted admin by ID
 */
export const restoreAdmin = async (id: number): Promise<boolean> => {
    try {
        await prisma.admin.update({
            where: { id },
            data: { deletedAt: null }
        });
        return true;
    } catch (error) {
        console.error(`Error restoring admin ${id}:`, error);
        return false;
    }
};

/**
 * Basic authentication verification helper
 */
export const authenticateAdmin = async (
    username: string,
    passsword: string
): Promise<Omit<Admin, "password"> | null> => {
    const admin = await prisma.admin.findFirst({
        where: { username, deletedAt: null }
    });

    if (!admin || !admin.password) return null;

    const isMatch = await bcrypt.compare(passsword, admin.password);
    if (!isMatch) return null;

    return omitPassword(admin) as Omit<Admin, "password">;
};

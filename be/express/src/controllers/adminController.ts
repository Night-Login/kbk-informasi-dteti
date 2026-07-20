import { Request, Response, NextFunction } from "express";
import { LoginRequestDTO, CreateAdminDTO, UpdateAdminDTO, Role } from "../types/index.js";
import { adminService } from "../services/index.js";
import { generateToken } from "../utils/index.js";

/*
    Name           : Admin Login Controller
    Description    : Handle the admin login process
    Request params : username and password
    Action         : create JWT
    Response       : success or error message 
*/
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { username, password } = req.body as LoginRequestDTO;

        if (!username || !password) {
            res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
            return;
        }

        const admin = await adminService.authenticateAdmin(username, password);
        if (!admin) {
            res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
            return;
        }

        // Generate JWT token
        const token = generateToken({
            id: admin.id,
            username: admin.username,
            role: admin.role
        });

        // Set httpOnly cookie for secure client-side storage
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                admin,
                token
            }
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Get all admins controller
    Description    : Fetches all admin data from database
    Request params : none
    Action         : fetch data from database
    Response       : success or error message 
*/
export async function getAdmins(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { search, role } = req.query;
        const filters = {
            search: typeof search === "string" ? search : undefined,
            role: role as Role | undefined
        };

        const admins = await adminService.getAdmins(filters);
        res.status(200).json({
            success: true,
            data: admins
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Get single admin by ID controller
    Description    : Fetches single admin data from database based on ID parameter
    Request params : admin ID
    Action         : fetch data from database
    Response       : success or error message 
*/
export async function getAdminById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid admin ID parameter"
            });
            return;
        }

        const admin = await adminService.getAdminById(id);
        if (!admin) {
            res.status(404).json({
                success: false,
                message: "Admin not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: admin
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Create new admin controller
    Description    : Creates new admin data
    Request params : username, password, and role
    Action         : create admin data
    Response       : success or error message 
*/
export async function createAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { username, password, role } = req.body as CreateAdminDTO;

        if (!username || !password) {
            res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
            return;
        }

        // Check if username already exists
        const existing = await adminService.getAdminByUsername(username);
        if (existing) {
            res.status(409).json({
                success: false,
                message: "An admin with this username already exists"
            });
            return;
        }

        const newAdmin = await adminService.createAdmin({ username, password, role });
        res.status(201).json({
            success: true,
            message: "Admin created successfully",
            data: newAdmin
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Update an existing admin controller
    Description    : Updates existing admin data
    Request params : admin ID
    Action         : update admin data
    Response       : success or error message 
*/
export async function updateAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid admin ID parameter"
            });
            return;
        }

        const updateData = req.body as UpdateAdminDTO;
        const updated = await adminService.updateAdmin(id, updateData);

        res.status(200).json({
            success: true,
            message: "Admin updated successfully",
            data: updated
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Soft delete an admin controller
    Description    : Soft deletes admin data
    Request params : admin ID
    Action         : delete admin data
    Response       : success or error message 
*/
export async function deleteAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid admin ID parameter"
            });
            return;
        }

        const success = await adminService.deleteAdmin(id);
        if (!success) {
            res.status(500).json({
                success: false,
                message: "Failed to delete admin"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Admin deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}

/*
    Name           : Restore a soft-deleted admin controller
    Description    : Restores soft-deleted admin data
    Request params : admin ID
    Action         : restore admin data
    Response       : success or error message 
*/
export async function restoreAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid admin ID parameter"
            });
            return;
        }

        const success = await adminService.restoreAdmin(id);
        if (!success) {
            res.status(500).json({
                success: false,
                message: "Failed to restore admin"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Admin restored successfully"
        });
    } catch (error) {
        next(error);
    }
}
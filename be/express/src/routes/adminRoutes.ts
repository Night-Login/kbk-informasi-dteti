import { Router } from "express";
import { adminController } from "../controllers/index.js";
import { authenticateJWT, requireRole } from "../middleware/index.js";

const router = Router();

/* #### Public endpoint #### */

// POST /api/v1/admins/login
router.post("/login", adminController.login);

/* #### Protected endpoints (Admin & Superadmin access) #### */

// GET /api/v1/admins 
router.get("/", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), adminController.getAdmins);

// GET /api/v1/admins/:id
router.get("/:id", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), adminController.getAdminById);

// POST /api/v1/admins
router.post("/", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), adminController.createAdmin);

// PUT /api/v1/admins/:id 
router.put("/:id", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), adminController.updateAdmin);

// DELETE /api/v1/admins/:id 
router.delete("/:id", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), adminController.deleteAdmin);

// PATCH /api/v1/admins/:id/restore 
router.patch("/:id/restore", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), adminController.restoreAdmin);

export default router;

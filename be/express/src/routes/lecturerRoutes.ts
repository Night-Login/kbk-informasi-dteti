import { Router } from "express";
import { lecturerController } from "../controllers/index.js";
import { authenticateJWT, requireRole, uploadPhoto, validateRequest, cacheMiddleware, clearCache } from "../middleware/index.js";
import { lecturerSchema } from "../schemas/index.js";

const router = Router();

/* #### Public endpoints #### */

// GET /api/v1/lecturers 
router.get("/", cacheMiddleware(300), lecturerController.getLecturers);

// GET /api/v1/lecturers/paginated 
router.get("/paginated", cacheMiddleware(300), lecturerController.getPaginatedLecturers);

// GET /api/v1/lecturers/slug/:slug 
router.get("/slug/:slug", cacheMiddleware(300), lecturerController.getLecturerBySlug);

// GET /api/v1/lecturers/sinta/:sinta_id 
router.get("/sinta/:sinta_id", cacheMiddleware(300), lecturerController.getLecturerBySintaId);

// GET /api/v1/lecturers/trash
router.get("/trash", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), lecturerController.getDeletedLecturers);

// GET /api/v1/lecturers/:id 
router.get("/:id", cacheMiddleware(300), lecturerController.getLecturerById);

/* #### Protected endpoints #### */

// POST /api/v1/lecturers 
router.post("/", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), validateRequest(lecturerSchema), clearCache('/api/v1/lecturers'), lecturerController.createLecturer);

// POST /api/v1/lecturers/import 
router.post("/import", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), clearCache('/api/v1/lecturers'), lecturerController.importLecturersCSV);

// PUT /api/v1/lecturers/:id 
router.put("/:id", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), validateRequest(lecturerSchema), clearCache('/api/v1/lecturers'), lecturerController.updateLecturer);

// DELETE /api/v1/lecturers/:id 
router.delete("/:id", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), clearCache('/api/v1/lecturers'), lecturerController.deleteLecturer);

// PATCH /api/v1/lecturers/:id/restore  
router.patch("/:id/restore", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), clearCache('/api/v1/lecturers'), lecturerController.restoreLecturer);

// PUT /api/v1/lecturers/:id/tags 
router.put("/:id/tags", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), lecturerController.assignResearchTags);

// PUT /api/v1/lecturers/:id/metrics
router.put("/:id/metrics", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), lecturerController.upsertMetric);

// PUT /api/v1/lecturers/:id/photo 
router.put("/:id/photo", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), uploadPhoto, lecturerController.uploadPhoto);

export default router;

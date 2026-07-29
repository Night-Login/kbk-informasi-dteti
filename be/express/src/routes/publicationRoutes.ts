import { Router } from "express";
import { publicationController } from "../controllers/index.js";
import { authenticateJWT, requireRole, cacheMiddleware, clearCache } from "../middleware/index.js";

const router = Router();

/* #### Public endpoints #### */

// GET /api/v1/publications 
router.get("/", cacheMiddleware(300), publicationController.getPublications);

// GET /api/v1/publications/paginated 
router.get("/paginated", cacheMiddleware(300), publicationController.getPaginatedPublications);

// GET /api/v1/publications/slug/:slug 
router.get("/slug/:slug", cacheMiddleware(300), publicationController.getPublicationBySlug);

// GET /api/v1/publications/doi/:doi 
router.get("/doi/:doi", cacheMiddleware(300), publicationController.getPublicationByDoi);

// GET /api/v1/publications/trash
router.get("/trash", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), publicationController.getDeletedPublications);

// GET /api/v1/publications/:id 
router.get("/:id", cacheMiddleware(300), publicationController.getPublicationById);

/* #### Protected endpoints #### */

// POST /api/v1/publications 
router.post("/", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), clearCache('/api/v1/publications'), publicationController.createPublication);

// POST /api/v1/publications/import 
router.post("/import", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), clearCache('/api/v1/publications'), publicationController.importPublicationsCSV);

// PUT /api/v1/publications/:id 
router.put("/:id", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), clearCache('/api/v1/publications'), publicationController.updatePublication);

// DELETE /api/v1/publications/:id 
router.delete("/:id", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), clearCache('/api/v1/publications'), publicationController.deletePublication);

// PATCH /api/v1/publications/:id/restore 
router.patch("/:id/restore", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), clearCache('/api/v1/publications'), publicationController.restorePublication);

// Protected relation assignment endpoint
router.put("/:id/lecturers", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), clearCache('/api/v1/publications'), publicationController.assignLecturersToPublication);

export default router;

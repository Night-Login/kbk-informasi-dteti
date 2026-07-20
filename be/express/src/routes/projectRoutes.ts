import { Router } from "express";
import { projectController } from "../controllers/index.js";
import { authenticateJWT, requireRole } from "../middleware/index.js";

const router = Router();

/* #### Public endpoints #### */

// GET /api/v1/projects 
router.get("/", projectController.getProjects);

// GET /api/v1/projects/paginated 
router.get("/paginated", projectController.getPaginatedProjects);

// GET /api/v1/projects/slug/:slug 
router.get("/slug/:slug", projectController.getProjectBySlug);

// GET /api/v1/projects/:id 
router.get("/:id", projectController.getProjectById);

/* #### Protected endpoints #### */

// POST /api/v1/projects
router.post("/", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), projectController.createProject);

// POST /api/v1/projects/import
router.post("/import", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), projectController.importProjectsCSV);

// PUT /api/v1/projects/:id
router.put("/:id", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), projectController.updateProject);

// DELETE /api/v1/projects/:id
router.delete("/:id", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), projectController.deleteProject);

// PATCH /api/v1/projects/:id/restore
router.patch("/:id/restore", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), projectController.restoreProject);

// PUT /api/v1/projects/:id/participants
router.put("/:id/participants", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), projectController.assignParticipantsToProject);

// PUT /api/v1/projects/:id/tags
router.put("/:id/tags", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), projectController.assignResearchTagsToProject);

export default router;

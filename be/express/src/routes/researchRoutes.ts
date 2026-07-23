import { Router } from "express";
import { researchController } from "../controllers/index.js";
import { authenticateJWT, requireRole } from "../middleware/index.js";

const router = Router();

/* Public endpoints */
router.get("/", researchController.getResearch);

// GET /api/v1/research/clusters    
router.get("/clusters", researchController.getResearchClusters);

// GET /api/v1/research/clusters/paginated    
router.get("/clusters/paginated", researchController.getPaginatedResearchClusters);

// GET /api/v1/research/clusters/slug/:slug    
router.get("/clusters/slug/:slug", researchController.getResearchClusterBySlug);

// GET /api/v1/research/clusters/trash
router.get("/clusters/trash", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), researchController.getDeletedResearchClusters);

// GET /api/v1/research/clusters/:id    
router.get("/clusters/:id", researchController.getResearchClusterById);

// GET /api/v1/research/tags    
router.get("/tags", researchController.getResearchTags);

// GET /api/v1/research/tags/paginated    
router.get("/tags/paginated", researchController.getPaginatedResearchTags);

// GET /api/v1/research/tags/slug/:slug    
router.get("/tags/slug/:slug", researchController.getResearchTagBySlug);

// GET /api/v1/research/tags/trash
router.get("/tags/trash", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), researchController.getDeletedResearchTags);

// GET /api/v1/research/tags/:id    
router.get("/tags/:id", researchController.getResearchTagById);

/* Protected endpoints */
// POST /api/v1/research/clusters    
router.post("/clusters", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), researchController.createResearchCluster);

// POST /api/v1/research/clusters/import    
router.post("/clusters/import", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), researchController.importResearchClustersCSV);

// PUT /api/v1/research/clusters/:id    
router.put("/clusters/:id", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), researchController.updateResearchCluster);

// DELETE /api/v1/research/clusters/:id    
router.delete("/clusters/:id", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), researchController.deleteResearchCluster);

// PATCH /api/v1/research/clusters/:id/restore    
router.patch("/clusters/:id/restore", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), researchController.restoreResearchCluster);

// POST /api/v1/research/tags    
router.post("/tags", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), researchController.createResearchTag);

// POST /api/v1/research/tags/import    
router.post("/tags/import", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), researchController.importResearchTagsCSV);

// PUT /api/v1/research/tags/:id    
router.put("/tags/:id", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), researchController.updateResearchTag);

// DELETE /api/v1/research/tags/:id    
router.delete("/tags/:id", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), researchController.deleteResearchTag);

// PATCH /api/v1/research/tags/:id/restore    
router.patch("/tags/:id/restore", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), researchController.restoreResearchTag);

export default router;

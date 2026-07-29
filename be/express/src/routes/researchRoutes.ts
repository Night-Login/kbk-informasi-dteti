import { Router } from "express";
import { researchController } from "../controllers/index.js";
import { authenticateJWT, requireRole, cacheMiddleware, clearCache } from "../middleware/index.js";

const router = Router();

/* Public endpoints */
router.get("/", cacheMiddleware(300), researchController.getResearch);

// GET /api/v1/research/clusters    
router.get("/clusters", cacheMiddleware(300), researchController.getResearchClusters);

// GET /api/v1/research/clusters/paginated    
router.get("/clusters/paginated", cacheMiddleware(300), researchController.getPaginatedResearchClusters);

// GET /api/v1/research/clusters/slug/:slug    
router.get("/clusters/slug/:slug", cacheMiddleware(300), researchController.getResearchClusterBySlug);

// GET /api/v1/research/clusters/trash
router.get("/clusters/trash", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), researchController.getDeletedResearchClusters);

// GET /api/v1/research/clusters/:id    
router.get("/clusters/:id", cacheMiddleware(300), researchController.getResearchClusterById);

// GET /api/v1/research/tags    
router.get("/tags", cacheMiddleware(300), researchController.getResearchTags);

// GET /api/v1/research/tags/paginated    
router.get("/tags/paginated", cacheMiddleware(300), researchController.getPaginatedResearchTags);

// GET /api/v1/research/tags/slug/:slug    
router.get("/tags/slug/:slug", cacheMiddleware(300), researchController.getResearchTagBySlug);

// GET /api/v1/research/tags/trash
router.get("/tags/trash", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), researchController.getDeletedResearchTags);

// GET /api/v1/research/tags/:id    
router.get("/tags/:id", cacheMiddleware(300), researchController.getResearchTagById);

/* Protected endpoints */
// POST /api/v1/research/clusters    
router.post("/clusters", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), clearCache('/api/v1/research'), researchController.createResearchCluster);

// POST /api/v1/research/clusters/import    
router.post("/clusters/import", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), clearCache('/api/v1/research'), researchController.importResearchClustersCSV);

// PUT /api/v1/research/clusters/:id    
router.put("/clusters/:id", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), clearCache('/api/v1/research'), researchController.updateResearchCluster);

// DELETE /api/v1/research/clusters/:id    
router.delete("/clusters/:id", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), clearCache('/api/v1/research'), researchController.deleteResearchCluster);

// PATCH /api/v1/research/clusters/:id/restore    
router.patch("/clusters/:id/restore", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), clearCache('/api/v1/research'), researchController.restoreResearchCluster);

// POST /api/v1/research/tags    
router.post("/tags", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), clearCache('/api/v1/research'), researchController.createResearchTag);

// POST /api/v1/research/tags/import    
router.post("/tags/import", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), clearCache('/api/v1/research'), researchController.importResearchTagsCSV);

// PUT /api/v1/research/tags/:id    
router.put("/tags/:id", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), clearCache('/api/v1/research'), researchController.updateResearchTag);

// DELETE /api/v1/research/tags/:id    
router.delete("/tags/:id", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), clearCache('/api/v1/research'), researchController.deleteResearchTag);

// PATCH /api/v1/research/tags/:id/restore    
router.patch("/tags/:id/restore", authenticateJWT, requireRole(["SUPERADMIN", "ADMIN"]), clearCache('/api/v1/research'), researchController.restoreResearchTag);

export default router;

import { Router } from "express";
import adminRoutes from "./adminRoutes.js";
import lecturerRoutes from "./lecturerRoutes.js";
import projectRoutes from "./projectRoutes.js";
import publicationRoutes from "./publicationRoutes.js";
import researchRoutes from "./researchRoutes.js";
import contentRoutes from "./contentRoutes.js";
import searchRoutes from "./searchRoutes.js";

const router = Router();

router.use("/admins", adminRoutes);
router.use("/lecturers", lecturerRoutes);
router.use("/projects", projectRoutes);
router.use("/publications", publicationRoutes);
router.use("/research", researchRoutes);
router.use("/content", contentRoutes);
router.use("/search", searchRoutes);

export default router;
export {
  adminRoutes,
  lecturerRoutes,
  projectRoutes,
  publicationRoutes,
  researchRoutes,
  contentRoutes,
  searchRoutes,
};

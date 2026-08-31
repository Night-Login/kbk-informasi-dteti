import { Router } from "express";
import { searchUniversal } from "../controllers/searchController.js";

const router = Router();

router.get("/", searchUniversal);

export default router;

import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import { getCareerInsights } from "../controllers/career.controller.js";

const router = Router();

router.post("/insights", auth, getCareerInsights);

export default router;

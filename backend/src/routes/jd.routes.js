import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import { analyzeJD } from "../controllers/jd.controller.js";

const router = Router();

router.post("/analyze", auth, analyzeJD);

export default router;

import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import {
  createMatch,
  getMatchById,
  getMatchHistory,
} from "../controllers/match.controller.js";

const router = Router();

router.get("/history", auth, getMatchHistory);
router.post("/", auth, createMatch);
router.get("/:matchId", auth, getMatchById);

export default router;

import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import upload from "../utils/fileUpload.js";
import { uploadResume } from "../controllers/resume.controller.js";

const router = Router();

router.post("/upload", auth, upload.single("resume"), uploadResume);

export default router;

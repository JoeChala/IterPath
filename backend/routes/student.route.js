import express from "express";
import {
  applyToJob,
  getJobPostingById,
  getJobPostings,
  parseResume,
} from "../controllers/student.controller.js";
import upload from "../config/multer.js"; 
import { authenticateSession, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticateSession, requireRole("student"));

router.get("/jobs", getJobPostings);
router.get("/jobs/:id", getJobPostingById);
router.post("/jobs/:id/apply", applyToJob);
//router.post("/resume/parse",upload.single("resume"), parseResume);

export default router;

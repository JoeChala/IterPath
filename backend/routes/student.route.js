import express from "express";
import { getJobPostingById, getJobPostings } from "../controllers/student.controller.js";
import { authenticateSession, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticateSession, requireRole("student"));

router.get("/jobs", getJobPostings);
router.get("/jobs/:id", getJobPostingById);

export default router;

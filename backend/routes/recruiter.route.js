import express from "express";
import {
  deleteJobListing,
  getRecruiterDashboard,
  postJobListing,
  viewJobListing,
} from "../controllers/recruiter.controller.js";
import { authenticateSession, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticateSession, requireRole("recruiter"));

router.get("/dashboard", getRecruiterDashboard);
router.get("/jobs", viewJobListing);
router.post("/jobs", postJobListing);
router.delete("/jobs/:id", deleteJobListing);

export default router;

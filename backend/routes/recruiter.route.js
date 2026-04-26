import express from "express";
import {
  deleteJobListing,
  getApplicantsForJob,
  getRecruiterDashboard,
  postJobListing,
  updateApplicationStatus,
  viewJobListing,
} from "../controllers/recruiter.controller.js";
import { authenticateSession, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticateSession, requireRole("recruiter"));

router.get("/dashboard", getRecruiterDashboard);
router.get("/jobs", viewJobListing);
router.post("/jobs", postJobListing);
router.delete("/jobs/:id", deleteJobListing);
router.get("/applicants/:jobId", getApplicantsForJob);
router.put("/applications/:id/status", updateApplicationStatus);

export default router;

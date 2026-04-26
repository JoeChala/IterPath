import express from 'express'
import { completeProfile,inviteRecruiter,requestLoginLink,verifyInviteToken } from '../controllers/recruiter.controller.js';
import {getStudents,createStudent,loginStudent} from "../controllers/student.controller.js";
import { getMe, logout } from "../controllers/auth.controller.js";
import { authenticateSession, requireRole } from "../middleware/auth.middleware.js";

const router=express.Router();

//student auth routes
router.post("/students/login", loginStudent);

router.get("/students", authenticateSession, requireRole("admin"), getStudents);

router.post("/students",createStudent);

// recuiter auth routes
router.post(
  "/recruiter/complete-profile",
  authenticateSession,
  requireRole("recruiter"),
  completeProfile
);

router.post("/recruiter/invite", authenticateSession, requireRole("admin"), inviteRecruiter);

router.post("/recruiter/request",requestLoginLink)

router.get("/recruiter/verify",verifyInviteToken)

router.get("/me", authenticateSession, getMe);

router.post("/logout", logout);

export default router;

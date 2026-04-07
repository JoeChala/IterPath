import express from 'express'
import { completeProfile,inviteRecruiter,requestLoginLink,verifyInviteToken } from '../controllers/recruiter.controller.js';
import {getStudents,createStudent,loginStudent} from "../controllers/student.controller.js";

const router=express.Router();

//student auth routes
router.post("/students/login", loginStudent);

router.get("/students/",getStudents);

router.post("/students/",createStudent);

// recuiter auth routes
router.post("/recruiter/complete-profile",completeProfile);

router.post("/recruiter/invite", inviteRecruiter);

router.post("/recruiter/request",requestLoginLink)

router.get("/recruiter/verify",verifyInviteToken)


export default router;
import express from 'express'
import { completeProfile } from '../controllers/recruiter.controller.js';
import {getStudents,createStudent,loginStudent} from "../controllers/student.controller.js";
//import { sendRecruiterInvite } from "../controllers/admin.controller.js";

const router=express.Router();

//student auth routes
router.post("/students/login", loginStudent);

router.get("/students/",getStudents);

router.post("/students/",createStudent);

// recuiter auth routes
router.post("/recuiter/complete-profile",completeProfile);

//router.get("/recruiter/invite/:id", sendRecruiterInvite);
//router.delete("/:id",deleteStudent);

//router.put("/:id",updateStudent);

export default router;
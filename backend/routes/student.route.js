import express from "express";

import {getStudents,createStudent,loginStudent} from "../controllers/student.controller.js";

const router=express.Router();

router.post("/login", loginStudent);

router.get("/",getStudents);

router.post("/",createStudent);

//router.delete("/:id",deleteStudent);

//router.put("/:id",updateStudent);

export default router;
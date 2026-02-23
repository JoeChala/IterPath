import express from "express";

import {getStudents,createStudent,deleteStudent,updateStudent} from "../controllers/student.controller.js";

const router=express.Router();

router.get("/",getStudents);

router.post("/",createStudent);

router.delete("/:id",deleteStudent);

router.put("/:id",updateStudent);

export default router;
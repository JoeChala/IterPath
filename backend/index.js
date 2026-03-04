import express from "express";
import dotenv from "dotenv";
import {connectDB} from './config/db.js';
import recruiterRoutes from "./routes/recruiter.route.js"
import studentRoutes from "./routes/student.route.js";
import { initiateInvites } from "./controllers/utils.controller.js";
import cors from "cors";

dotenv.config();
const port = process.env.PORT;
const app=express(); 

app.use(express.json());
app.use(cors());

app.use("/auth/students",studentRoutes);
app.use("/auth/recruiters",recruiterRoutes);

app.post("/invites", initiateInvites);

app.listen(5000,()=>{
    connectDB_Student(); 
    //Put yours here
    console.log(`Server started at http://localhost:${port}`);
});
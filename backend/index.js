import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDB } from "./config/db.js";
import recruiterRoutes from "./routes/recruiter.route.js";
import studentRoutes from "./routes/student.route.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use("/auth/students", studentRoutes);
app.use("/auth/recruiters", recruiterRoutes);

await connectDB();
app.listen(port, () => {
  
  console.log(`Server started at http://localhost:${port}`);
});
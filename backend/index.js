import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js"
import recruiterRoutes from "./routes/recruiter.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/recruiter", recruiterRoutes);

await connectDB();
app.listen(port, () => {
  
  console.log(`Server started at http://localhost:${port}`);
});

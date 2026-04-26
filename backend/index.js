import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js"
import recruiterRoutes from "./routes/recruiter.route.js";
import studentRoutes from "./routes/student.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/student", studentRoutes);

app.use((err, req, res, next) => {
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Uploaded file is too large. Please upload a smaller resume!",
    });
  }

  next(err);
});

await connectDB();
app.listen(port, () => {
  
  console.log(`Server started at http://localhost:${port}`);
});

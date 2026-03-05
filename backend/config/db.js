import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Student DB
export const studentDB = mongoose.createConnection(process.env.MONGO_URI_STUDENT);

studentDB.on("connected", () => {
  console.log("Student MongoDB connected");
});

studentDB.on("error", (err) => {
  console.error("Student DB error:", err);
});

// Recruiter DB
export const recruiterDB = mongoose.createConnection(process.env.MONGO_URI_RECRUITER);

recruiterDB.on("connected", () => {
  console.log("Recruiter MongoDB connected");
});

recruiterDB.on("error", (err) => {
  console.error("Recruiter DB error:", err);
});
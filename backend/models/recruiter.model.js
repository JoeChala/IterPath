import mongoose from "mongoose";
import { recruiterDB } from "../config/db.js";

const recruiterSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true },
  company: { 
    type: String, 
    required: true 
  },
  designation: {
    type: String,
    enum: [
      "HR Executive",
      "HR Manager",
      "Talent Acquisition Specialist",
      "Talent Acquisition Manager",
      "Campus Recruiter",
      "Hiring Manager",
      "Software Engineer",
      "Senior Software Engineer",
      "Engineering Manager",
      "Other"
    ],
    required: true
  }
}, { timestamps: true });

export default recruiterDB.model("Recruiter", recruiterSchema);
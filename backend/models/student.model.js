import mongoose from "mongoose";
import { studentDB } from "../config/db.js";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  usn: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resume: { type: Object }
}, { timestamps: true });

export default studentDB.model("Student", studentSchema);
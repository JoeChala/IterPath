import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });
import { signSessionToken } from "./backend/utils/jwt.util.js";
import Student from "./backend/models/student.model.js";
import Job from "./backend/models/jobs.model.js";

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected to DB");
  } catch (err) {
    console.log("Could not connect to DB", err);
    process.exit(1);
  }

  const student = await Student.findOne({});
  const job = await Job.findOne({});

  if (!student || !job) {
    console.log("No student or job");
    process.exit(1);
  }

  const token = signSessionToken({ sub: student._id, role: "student" });

  const res = await fetch(`http://localhost:5000/api/student/jobs/${job._id}/apply`, {
    method: "POST",
    headers: {
      "Cookie": `token=${token}`
    }
  });

  const data = await res.json();
  console.log("Response:", res.status, data);

  process.exit(0);
}

run();

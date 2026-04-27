import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });
import Application from "./backend/models/application.model.js";
import Student from "./backend/models/student.model.js";
import Job from "./backend/models/jobs.model.js";

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  // Create mock student
  const student = new Student({
    name: "Test",
    usn: "123",
    email: "test@example.com",
    password: "pwd"
  });
  await student.save().catch(e => console.log("Student exists"));
  const savedStudent = await Student.findOne({ email: "test@example.com" });

  // Create mock job
  const job = new Job({
    company: "Company",
    role: "Dev",
    ctc: "10 LPA",
    openings: 5,
    deadline: new Date(),
    description: "desc",
    eligibility: { cgpa: 7, branches: ["CSE"], backlogs: 0 },
    website: "https://example.com",
    applyLink: "https://example.com"
  });
  await job.save();

  // Test apply
  try {
    const app = await Application.create({
      job: job._id,
      student: savedStudent._id,
      status: "applied"
    });
    console.log("Application created successfully:", app);
  } catch (err) {
    console.error("Application create error:", err);
  }

  process.exit(0);
}

run();

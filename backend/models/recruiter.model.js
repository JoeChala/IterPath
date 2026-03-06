import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  company: { 
    type: String,
    require: true
  },
  designation: {
    type: String,
    enum: [
      "hr-executive",
      "hr-manager",
      "talent-acquisition-specialist",
      "talent-acquisition-manager",
      "campus-recruiter",
      "hiring-manager",
      "software-engineer",
      "senior-software-engineer",
      "engineering-manager",
      "other"
    ],
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Recruiter", recruiterSchema);
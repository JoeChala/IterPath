import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
  },
  email: { 
    type: String, 
    required: true, 
    lowercase: true,
    trim: true
  },
  companyId: { 
    type: Number,
    required: true,
    trim: true
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
  },
  isOnboarded: {
    type: Boolean,
    default: false,   // flips to true once they fill in their profile after first login
  },
}, { timestamps: true });
recruiterSchema.index({ email: 1, company: 1 }, { unique: true });

export default mongoose.model("Recruiter", recruiterSchema);
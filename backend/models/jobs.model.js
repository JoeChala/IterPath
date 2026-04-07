import mongoose from "mongoose";

const eligibilitySchema = new mongoose.Schema(
  {
    cgpa: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    branches: {
      type: [String], // Array of branches
      required: true,
    },

    backlogs: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  { _id: false } // prevents nested _id
);

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    ctc: {
      type: String, // e.g. "8 LPA"
      required: true,
    },

    openings: {
      type: Number,
      required: true,
      min: 1,
    },

    deadline: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    eligibility: {
      type: eligibilitySchema,
      required: true,
    },

    website: {
      type: String,
      required: true,
    },

    applyLink: {
      type: String,
      required: true,
    },

    // Optional but useful
    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // auto manages createdAt & updatedAt
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected"],
      default: "applied",
    },
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, student: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);

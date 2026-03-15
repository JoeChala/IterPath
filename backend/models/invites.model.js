import mongoose from "mongoose";

const recruiterInviteSchema = new mongoose.Schema({
  token: {
    type: String,
    unique: true,
    index: true
  },

  email: String,

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company"
  },

  expiresAt: Date,

  used: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

recruiterInviteSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export default mongoose.model("RecruiterInvite",recruiterInviteSchema);
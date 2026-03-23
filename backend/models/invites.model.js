import mongoose from "mongoose";

const recruiterInviteSchema = new mongoose.Schema({
  token: {
    type: String,
    unique: true,
    required: true,
  },

  email: {
      type: String,
      required: true,
      lowercase: true, 
      trim: true,        
      index: true,       
    },

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company"
  },

  expiresAt: {
    type: Date,
    required: true
  },
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
import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },

  website: String,

  description: String,

  industry: String,

  recruiters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter"
    }
  ]
});

export default mongoose.model("Company",CompanySchema);
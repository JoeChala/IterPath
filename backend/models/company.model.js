import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
  company_id : {
    required: true,
    type: Number
  },
  name: {
    type: String,
    required: true,
    trim: true
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
CompanySchema.createIndex({ name: 1 }, { unique: true })

export default mongoose.model("Company",CompanySchema);
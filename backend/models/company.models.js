
const CompanySchema = new mongoose.Schema({
  name: String,

  website: String,

  description: String,

  recruiters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter"
    }
  ]
});
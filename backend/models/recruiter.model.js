import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false
    },
    company: {
        type: String,
        required: true,
    },
    designation: {       // HR, dev, manager
        type: String,
        required: true,
    },
}, {
    timestamps: true, //created at, updated at
});

const Recruiter =   mongoose.model("Recruiter",recruiterSchema);
export default Recruiter;
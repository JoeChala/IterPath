import Recruiter from "../models/recruiter.model.js";
import CompanyDB from "../models/company.model.js"
import Job from "../models/jobs.model.js";
import * as recruiterService from "../services/recruiter.service.js";

export const completeProfile =  async (req,res) => {
    const {name,email,companyName,designation} = req.body;

    if(!name || !email || !companyName || !designation) {
        return res.status(400).json({
            success: false,
            message: "Please provide all the details!"
        });
    }
    try{
        const company = await CompanyDB.findOneAndUpdate(
            { name: companyName },
            { $setOnInsert: { name: companyName } },
            { upsert: true, returnDocument: "after" }
        );

        const data = await Recruiter.findByIdAndUpdate(
            req.user.id,
            {
                name,
                email,
                companyId: company._id,
                company: company.name,
                designation,
                isOnboarded: true
            },
            { returnDocument: "after", runValidators: true }
        );

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Recruiter not found"
            });
        }

        res.status(201).json({
            success: true,
            data: data,
        });
    }catch (error){
        console.error("Error in creating user: ",error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const inviteRecruiter = async (req,res) => {
    try{
        const result = await recruiterService.inviteRecruiter(
            req.body.email,
            req.body.company,
        );
        res.status(200).json(result);
    }catch(err){
        res.status(400).json({ error: err.message });
    }
};

export const requestLoginLink = async (req,res,next) => {
    try{
        const result = await recruiterService.requestLoginLink(req.body.email);
        res.status(200).json(result);
    }catch(err){
        res.status(400).json({ error: err.message });
    }
};

export const verifyInviteToken = async (req, res) => {
  try {
    const { sessionToken, recruiter } =
      await recruiterService.verifyInviteToken(req.query.token);

    res.clearCookie("token", { path: "/api/auth" });
    res.clearCookie("token", { path: "/api/auth/" });
    res.cookie("token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Recruiter verified",
      redirectTo: recruiter.isOnboarded ? "/r/dashboard" : "/r/onboarding",
      data: {
        id: recruiter._id,
        email: recruiter.email,
        role: "recruiter",
        isOnboarded: recruiter.isOnboarded,
      },
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getRecruiterDashboard = async (req, res) => {
    try {
        const recruiter = await Recruiter.findById(req.user.id);
        const company = recruiter?.company;

        const jobs = company ? await Job.find({ company }) : [];
        const totalJobs = jobs.length;

        res.status(200).json({
            totalJobs,
            totalApplicants: 0,
            shortlisted: 0,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const postJobListing = async (req,res) => {
    const {
        role,
        ctc,
        openings,
        deadline,
        description,
        eligibility,
        website,
        applyLink,
    } = req.body;

    if (
        !role ||
        !ctc ||
        !openings ||
        !deadline ||
        !description ||
        eligibility?.cgpa === undefined ||
        eligibility?.cgpa === null ||
        eligibility?.cgpa === "" ||
        !eligibility?.branches?.length ||
        eligibility.backlogs === undefined ||
        !website ||
        !applyLink
    ) {
        return res.status(400).json({
            success: false,
            message: "Please provide all job details"
        });
    }

    try{
        const recruiter = await Recruiter.findById(req.user.id);

        if (!recruiter?.company) {
            return res.status(400).json({
                success: false,
                message: "Complete your recruiter profile before creating jobs"
            });
        }

        const job = await Job.create({
            company: recruiter.company,
            role,
            ctc,
            openings: Number(openings),
            deadline,
            description,
            eligibility: {
                cgpa: parseFloat(eligibility.cgpa),
                branches: eligibility.branches,
                backlogs: Number(eligibility.backlogs),
            },
            website,
            applyLink,
        });

        res.status(201).json({
            success: true,
            data: job,
        });
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message || "Server Error"
        });
    }
};

export const viewJobListing = async (req,res) => {
    try {
        const recruiter = await Recruiter.findById(req.user.id);
        const company = recruiter?.company;
        const jobs = company
            ? await Job.find({ company }).sort({ createdAt: -1 })
            : [];

        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const deleteJobListing = async (req, res) => {
    try {
        const recruiter = await Recruiter.findById(req.user.id);
        const deletedJob = await Job.findOneAndDelete({
            _id: req.params.id,
            company: recruiter?.company,
        });

        if (!deletedJob) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Job deleted"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

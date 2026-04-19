import RecruiterDB from "../models/recruiter.model.js";
import CompanyDB from "../models/company.model.js"
import * as recruiterService from "../services/recruiter.service.js";

export const completeProfile =  async (req,res) => {
    const {name,email,companyName,designation} = req.body;

    if(!name || !email || !companyName || !designation) {
        return res.status(400).json({
            success: false,
            message: "Please provide all the details!"
        });
    }
    const existing = await RecruiterDB.findOne({ email });
    if (existing) throw new AppError('Already registered', 400);

    const result = await CompanyDB.findOneAndUpdate(
        { name: companyName },
        { $setOnInsert: { name: companyName } },
        { upsert: true, returnDocument: "after" }
    );

    const companyId = result.value._id;


    //add data into db
    const newRecruiter = new Recruiter({
        name,
        email,
        companyId,
        designation,
        isOnboarded: true
    });

    try{
        await newRecruiter.save();
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

export const inviteRecruiter = async (req,res,next) => {
    try{
        const result = await recruiterService.inviteRecruiter(
            req.body.email,
            req.body.company,
        );
        res.status(200).json(result);
    }catch(err){
        console.log(err);
    }
};

export const requestLoginLink = async (req,res,next) => {
    try{
        const result = await recruiterService.requestLoginLink(req.body.email);
        res.status(200).json(result);
    }catch(err){
        console.log(err);
    }
};

export const verifyInviteToken = async (req,res,next) => {
    try{
        const result = await recruiterService.verifyInviteToken(req.query.token);
        res.cookie('token', req.body.sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .redirect(`http://127.0.0.1:5500/frontend/recruiter-html/login.html`);
    }catch(err){
        console.log(err);
    }
};

export const postJobListing = async (req,res,next) => {
    const { name,email,company } = req.body;



    try{

    }catch{
        console.log(err);
    }
};

export const viewJobListing = async (req,res,next) => {

};
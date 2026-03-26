import Recruiter from "../models/recruiter.model.js";
import * as recruiterService from "../services/recruiter.service.js";

export const completeProfile =  async (req,res) => {
    const data = req.body;
    if(!data.name || !data.email || !data.company || !data.designation) {
        return res.status(400).json({
            success: false,
            message: "Please provide all the details!"
        });
    }
    //add data into db
    const newRecruiter = new Recruiter(data);

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
        res
        .cookie('token', req.body.sessionToken, {
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
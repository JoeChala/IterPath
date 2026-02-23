import express from 'express'
import Recruiter from '../models/recruiter.model.js';


const router = express.Router();

router.post("/recruiter/complete-profile", async (req,res) => {
    const data = req.body;
    const contentLength = req.headers['content-length'];
    console.log(contentLength);
    if(!data.name || !data.company || !data.designation) {
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
});

export default router;
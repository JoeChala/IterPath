import Recruiter from "../models/recruiter.model.js";
import RecruiterInvite from "../models/invites.model.js";

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


export const verifyInvite = async (req, res) => {

  const { token } = req.params;

  const invite = await RecruiterInvite.findOne({ token });

  if (!invite)
    return res.status(400).json({ message: "Invalid invite" });

  if (invite.used)
    return res.status(400).json({ message: "Invite already used" });

  if (invite.expiresAt < Date.now())
    return res.status(400).json({ message: "Invite expired" });

  res.json({
    email: invite.email,
    company: invite.company
  });

};
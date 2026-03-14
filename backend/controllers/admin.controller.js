import { sendEmail } from "../utils/sendEmail.js";
import recruiterInvite from "../models/invites.model.js"
import generateInviteToken from "../utils/generateInviteToken.js"

export const sendInvite = async(req,res) => {
  let invite;
  let token;
  let created = false;
  //24 hour invite
  const duration = 24*60*60*1000;
  while(!created){
    try{
      token = generateInviteToken();

      invite = await recruiterInvite.create({
        token,
        email: req.body.email,
        company: req.body.email,
        expiresAt: new Date(Date.now() + duration),
      });

      created = true;

    }catch(error){
      throw error;
    }
  }
  const inviteLink =
    `http://localhost:${process.env.PORT}/recruiter/invite/${token}`;

  await sendEmail(email, inviteLink);

  res.json({
    success: true,
    message: "Invite sent"
  });
};


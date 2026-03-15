import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,           
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function sendInviteEmail(email, inviteLink) {
  try{
    await transporter.sendMail({
      from: `"IterPath" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Recruiter Invite",
      html: `
        <h2>You're invited to IterPath</h2>
        <a href="${inviteLink}">
          Accept Invite
        </a>
      `
    });
  }catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
  }
}
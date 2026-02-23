import express from "express";
import dotenv from "dotenv";
import {connectDB} from './config/db.js';
import recruiterRoutes from "./routes/recruiter.route.js"
import { sendEmail } from "./utils/sendEmail.js";
import studentRoutes from "./routes/student.route.js";

dotenv.config();
const port = process.env.PORT;
const app=express(); 

app.use(express.json());

app.use("/students",studentRoutes);
app.use("/auth",recruiterRoutes);

app.post("/invites", async (req, res) => {
  try {
    const { email } = req.body;
    const inviteToken = "abc123";
    const inviteLink = `http://localhost:5000/auth/recruiter/?token=${inviteToken}`;

    await sendEmail({
      to: email,
      subject: "Recruiter Invitation",
      html: `
        <h2>You are invited!</h2>
        <p>Click below to join:</p>
        <a href="${inviteLink}">${inviteLink}</a>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Invite email sent successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
app.listen(5000,()=>{
    connectDB();
    console.log(`Server started at http://localhost:${port}`);
});
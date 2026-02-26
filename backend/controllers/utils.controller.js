import { sendEmail } from "./utils/sendEmail.js";

export const initiateInvites = async (req, res) => {
  try {
    const { email } = req.body;
    const inviteToken = "abc123";
    const inviteLink = `http://localhost:5000/auth/recruiters/?token=${inviteToken}`;

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
};
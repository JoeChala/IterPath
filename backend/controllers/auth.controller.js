import Recruiter from "../models/recruiter.model.js";
import Student from "../models/student.model.js";
import Admin from "../models/admin.model.js";

export const getMe = async (req, res) => {
  try {
    const { id, role } = req.user;

    let user;

    if (role === "recruiter") {
      user = await Recruiter.findById(id).populate("companyId");
    }

    if (role === "student") {
      user = await Student.findById(id);
    }

    if (role === "admin") {
      user = await Admin.findById(id);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      email: user.email,
      role,
      isOnboarded: user.isOnboarded || false,
      company: user.companyId?.name || user.company || null,
      name: user.name || null,
      usn: user.usn || null,
      resumeDetails: user.resumeDetails || null,
    });

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", { path: "/api/auth" });
  res.clearCookie("token", { path: "/api/auth/" });
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
};

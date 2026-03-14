import Student from "../models/student.model.js";
import bcrypt from "bcrypt";

export const loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }

    const { password: _, ...studentData } = student._doc;

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: studentData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

export const getStudents = async (req,res)=>{
    try{
        const students=await Student.find({});
        res.status(200).json({success:true,data:students});
    }catch(error){
        res.status(500).json({success:false,message:"Server error"});
    }
};

export const createStudent = async (req, res) => {
  const { name, usn, email, password } = req.body;

  if (!name || !usn || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the details"
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      name,
      usn,
      email,
      password: hashedPassword
    });

    await newStudent.save();

    res.status(201).json({
      success: true,
      message: "Student Registered",
      data: newStudent
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Student with this USN or Email already exists"
      });
    }
    console.error("Error in register student:", error.message);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
/*
export const deleteStudent=async (req,res)=>{
    const {id}=req.params;
    try{
        await Student.findByIdAndDelete(id);
        res.status(200).json({success: true,message: "Student Deleted"});
    }catch(error){
        res.status(404).json({sucess:false,message:"Student not found"}); 
    }
};

export const updateStudent=async (req,res)=>{
    const {id}=req.params;
    const student=req.body;
    if(!mongoose.Types.ObjectID.isvalid(id))
        return res.status(404).json({success:false,message:"Invalid Product ID"});
    try{
        const updatedStudent=await Student.findByIdandUpdate(id, student,{new:true});
        res.status(200).json({success:true,data:updatedStudent});
    }catch(error){
        res.status(500).json({success:false,message:"Server error"});
    }
};
*/

import mongoose from 'mongoose';
import dotenv from "dotenv";

export const connectDB_Student = async () => {
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI_STUDENT);
        console.log("Student MongoDB connected");
    }catch(error){
        console.error(`Error: "${error.message}`);
        process.exit(1);
    }
};

export const connectDB_Recruiter = async () => {
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI_RECRUITER);
        console.log("Recruiter MongoDB connected");
    }catch(error){
        console.error(`Error: "${error.message}`);
        process.exit(1);
    }
};

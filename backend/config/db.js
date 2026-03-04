import mongoose from 'mongoose';

export const connectDB_Student = async () => {
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI_STUDENT);
        console.log("Student MongoDB connected");
    }catch(error){
        console.error(`Error: "${error.message}`);
        process.exit(1);
    }
};

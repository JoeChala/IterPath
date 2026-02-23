import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    usn:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    resume:{
        type:Object
    }
    },
    {
        timestamps: true,
    }
);

const Student=mongoose.model('Student', studentSchema);

export default Student;
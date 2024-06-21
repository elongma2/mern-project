import mongoose from "mongoose";


const userSchema=new mongoose.Schema({
    Username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    Password:{
        type:String,
        required:true,
    }
},{timestamps:true})//record time of creation of user, time of update using timestamps

const User=mongoose.model('User',userSchema);

export default User;
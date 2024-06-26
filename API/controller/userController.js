import { errorHandle } from "../utils/error.js";
import bcryptjs from 'bcryptjs'
import User from "../models/userModel.js";

export const test=(req,res)=>{
    res.json({
        msg:"API route is working",
    });
}
export const updateUser=async (req,res,next)=>{
  if(req.user.id!=req.params.id)return next(errorHandle(403,"you can update only your account"));
  try {
    if(req.body.password){
      req.body.password=bcryptjs.hashSync(req.body.password,10);
    }
    const updatedUser=await User.findByIdAndUpdate(req.params.id,{$set:{username:req.body.username
      ,email:req.body.email,
      password:req.body.password,
      avatar:req.body.avatar
    }},{new:true});//set updated user, new true returns updated user
    const {password,...others}=updatedUser._doc;
    res.status(200).json(others)
  } catch (error) {
    next(error)
  }
}
export const deleteUser=async (req,res,next)=>{
  if(req.user.id!== req.params.id) return next(errorHandle(403,"you can delete only your account"));
  try {
    await User.findByIdAndDelete(req.params.id)
    res.clearCookie('access_token');
    res.status(200).json("User has been deleted !");
  } catch (error) {
    next(error)
  }
}
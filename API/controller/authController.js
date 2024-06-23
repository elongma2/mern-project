import User from '../models/userModel.js'
import bcryptjs from 'bcryptjs'
import { errorHandle } from '../utils/error.js';
import jwt from 'jsonwebtoken';


export const signup=async(req,res,next)=>{
    const {username,email,password}=req.body;
    const hashedPassword=bcryptjs.hashSync(password,10);//hashing password
    const newUser=new User({username,email,password:hashedPassword});
    try {
        await newUser.save()
        res.status(201).json({message:'user created sucessfully'});
    } catch (error) {
        //next(errorHandle(550,'error dumbass')); excecutes errorhandle functions and return custom error from function
        next(error);
    }
}


export const signin = async (req, res, next) => {
    const { email, password } = req.body; // Destructure email and password from request body
    try {
        const user = await User.findOne({ email }); // Find user by email in the database
        if (!user) return next(errorHandle(404, 'User not found')); // If user does not exist, return error

        const isMatch = bcryptjs.compareSync(password, user.password); // Compare password using bcryptjs
        if (!isMatch) return next(errorHandle(401, 'Wrong password')); // If password does not match, return error

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET); // Generate JWT token
        const { password: pass, ...others } = user._doc; // Exclude password field from user document
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(others); // Set access_token cookie and respond with user data

    } catch (error) {
        next(error); // Pass any caught errors to the error handling middleware
    }
};

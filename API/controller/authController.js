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

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // Generate JWT token
        const { password: pass, ...others } = user._doc; // Exclude password field from user document
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(others); // Set access_token cookie and respond with user data

    } catch (error) {
        next(error); // Pass any caught errors to the error handling middleware
    }
};

export const google = async (req, res, next) => {
    try {
        // Check if a user with the provided email already exists in the database
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            // If user exists, generate a JWT token for authentication
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

            // Exclude password field from user document
            const { password: pass, ...others } = user._doc;//._doc is this property from mongoose when data is taken
            // Set the access_token cookie and respond with user data (excluding password)
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(others);
        } else {
            // If user does not exist, create a new user with random password and provided data
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10); // Hash the generated password

            const newUser = new User({
                username: req.body.name.split('').join("").toLowerCase() + Math.random().toString(36).slice(-8),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo
            });
            
            // Save the new user to the database
            await newUser.save();
            
            // Generate JWT token for the newly created user
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            
            // Exclude password field from user document
            const { password: pass, ...others } = newUser._doc;
            // Set the access_token cookie and respond with user data (excluding password)
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(others);
        }
    } catch (error) {
        // Pass any caught errors to the error handling middleware
        next(error);
    }
};

import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRouter from './routes/userRoutes.js'
import authRouter from './routes/authRoutes.js'

dotenv.config();
const app=express();

app.use(express.json())




mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected to DB")
}).catch(err=>{
    console.log(err)
})

app.listen(3000,()=>{
    console.log("server is running on port 3000");
});
app.use('/api/user',userRouter);//using middleware
app.use('/api/auth',authRouter);
app.use((err,req,res,next)=>{
    console.log(err)
    const statuscode=err.statuscode || 500
    const message=err.message || 'internal server error'
    return res.status(statuscode).json({
        success:false,
        statuscode:statuscode,
        message
    });
});


const jwt=require('jsonwebtoken');
const userModel = require('../models/userModel');

//Protected routes token base

const requireSignin=async (req,res,next)=>{
    try{
        const decode=await jwt.verify(req.headers.authorization,
            process.env.JWT_SECRET);
            req.user=decode;
            next();
    }
    catch(err){
        console.log(err);
    }
}

//admin access
const isAdmin=async (req,res,next)=>{
    try{
        const user=await userModel.findById(req.user._id)
        if(user.role !== 1){
            return res.status(201).send({
                success:false,
                message:"UnAuthorized Access"
            });
        }
        else{
            next();
        }
        }
    
    catch(err){
        console.log(err);
    }
}


module.exports={requireSignin,isAdmin}
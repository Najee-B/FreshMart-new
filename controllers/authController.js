const { hashPassword, comparePassword } = require('../helpers/authHelper');
const contactModel = require('../models/contactModel');
const orderModel = require('../models/orderModel');
const userModel=require('../models/userModel')
const jwt=require('jsonwebtoken')


const registerController=async (req,res)=>{
    try{
        const{name,email,password,phone,address,question}=req.body;
        //validation
        if(!name){
            return res.send({message:'Name is required'})
        }
        if(!email){
            return res.send({message:'Email is required'})
        }
        if(!password){
            return res.send({message:'Password is required'})
        }
        if(!phone){
            return res.send({message:'Phone is required'})
        }
        if(!address){
            return res.send({message:'Address is required'})
        }
        if(!question){
            return res.send({message:'Question is required'})
        }

        //existing user check
        const existinguser=await userModel.findOne({email});
        if(existinguser){
            return res.status(200).send({
                success:false,
                message:"Already Registered please login",
            })
        }
        //register user
        const hashedPassword=await hashPassword(password)
        //save
        const user=await new userModel({name,email,phone,address,password:hashedPassword,question:question}).save()

        res.status(201).send({
            success:true,
            message:"User register successfull",
            user,
        })

    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Registration',
            error:error,
        })
    }
}

const loginController=async (req,res)=>{
    try{
        const{email,password}=req.body;
        //validation
        if(!email||!password){
            return res.status(200).send({
                success:false,
                message:"Invalid Username or Password"
            })
        }
        //check user
        const user=await userModel.findOne({email})
        if(!user){
            return res.status(200).send({
                success:false,
                message:"Email is not Registered"
            })
        }
        const match=await comparePassword(password,user.password);
        if(!match){
            return res.status(200).send({
                success:false,
                message:'Invalid Password'
            })
        }
        //token
        const token=jwt.sign({ _id: user._id},process.env.JWT_SECRET,{
            expiresIn:'7d',

        });
        res.status(200).send({
            success:true,
            message:"Login successfull",
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role,
            },
            token:token
        });
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Login',
            error:error
    });
}
}

//forgot password

const forgotController=async(req,res)=>{
    try {
        const{email,newpassword,question}=req.body; 
        if(!email){
            res.status(201).send({message:"Email Required"});
        }
        if(!question){
            res.status(201).send({message:"Question Required"});
        }
        if(!newpassword){
            res.status(201).send({message:"Newpassword Required"});
        }
        //check
        const user=await userModel.findOne({email,question})
        //validation
        if(!user){
            res.status(201).send({
                success:false,
                message:"Invalid email or Question"
            })
        }
        const hashed=await hashPassword(newpassword);
        await userModel.findByIdAndUpdate(user._id,{password:hashed});
        res.status(200).send({
            success:true,
            message:"Password Reset Successfull "
        })

    } catch (error) {
        console.log(error);
        res.status(201).send({
            success:false,
            message:"Somethng wents wrong",
            error:error
        }
        )
    }

}

//test controller
const testController=(req,res)=>{
    res.send("Protected Route")
}

//update Profile Controller
const updateProfileController=async (req,res)=>{
try {
    const{email,name,phone,address,password}=req.body
    const user=await userModel.findById(req.user._id)
    const hashedPassword=password?await hashPassword(password):user.password

    const updatedUser=await userModel.findByIdAndUpdate(req.user._id,{
        name:name||user.name,
        password:hashedPassword||user.password,
        email:email||user.email,
        phone:phone||user.phone,
        address:address||user.address,
    },{new:true})
    res.status(200).send({
        success:true,
        message:"Profile update Successfull",
        updatedUser
    })
  }
 catch (error) {
    console.log(error)
    res.status(201).send({
        succerr:false,
        message:"Error in update profile",
        error
    })}

}

//user Order Controlle

const userOrderController=async(req,res)=>{
    try {
        const orders=await orderModel.find({buyer:req.user._id}).populate('products','-photo').populate('buyer','name')
        res.json(orders);
    } catch (error) {
        console.log(error)
        res.status(201).send({
            success:false,
            message:"Error in user orders",
            error
        })
    }
}

//all Orders Controller
const allOrdersController=async(req,res)=>{
    try {
        const orders=await orderModel.find().populate('products','-photo').populate('buyer','name').
        sort({createdAt:'-1'})
        res.json(orders);
    } catch (error) {
        console.log(error)
        res.status(201).send({
            success:false,
            message:"Error in all orders",
            error
        })
    }
}

//status update controller
const orderStatusUpdate=async (req,res)=>{
    try {
        const{oid}=req.params
        const{status}=req.body
        const orders=await orderModel.findByIdAndUpdate(oid,{status},{new:true})
        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(201).send({
            success:false,
            message:"Error in update status",
            error
        })
    }
}
// For Contact us API

//putting contact
const sendContactContainer=async (req,res)=>{
    try {
        const {name,email,message}=req.body
        if(!email){
            res.status(201).send({message:"Email Required"});
        }
        if(!name){
            res.status(201).send({message:"Name Required"});
        }
        if(!message){
            res.status(201).send({message:"Message Required"});
        }

        const data=await new contactModel({name,email,message}).save()
        res.status(200).send({
            success:true,
            message:"User message stored Success",
            data
        })

    } catch (error) {
        console.log(error)
        res.status(201).send({
            success:false,
            message:"Error in send Contact",
            error
        })
    }
}

//get all message from contact us
const showAllContactController=async (req,res)=>{
    try {
        const data=await contactModel.find({})
        res.status(200).send({
            success:true,
            message:"get contacts Success",
            data
        })
    } catch (error) {
        console.log(error)
        res.status(201).send({
            success:false,
            message:"Error in get all messages",
            error
        })
    }
}


module.exports={registerController,loginController,testController,
    forgotController,updateProfileController,userOrderController,
    allOrdersController,orderStatusUpdate,sendContactContainer,showAllContactController};
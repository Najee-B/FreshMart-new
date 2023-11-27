
const slugify=require('slugify');
const categoryModel = require('../models/categoryModel');

const createCategoryController=async(req,res)=>{

try {

    const{name}=req.body;
    if(!name){
        res.status(201).send({message:"Category name is required"})
    }

    //existance check
    const existing=await categoryModel.findOne({name});
    if(existing){
        res.status(200).send({
            success:true,
            message:'Category already exist',  
        })
    }
    const category=await new categoryModel({name,slug:slugify(name)}).save()
    res.status(200).send({
        success:true,
        message:'Category added successfully',
        category,
    })

    
} catch (error) {
    console.log(error)
    res.status(201).send({
        success:false,
        message:"Error in create Category",
        error,
    })
}
}

const updateCategoryController=async(req,res)=>{
try {
    const{name}=req.body;
    const{id}=req.params;

    const category=await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
    res.status(200).send({
        success:true,
        message:"Category Updated Successfully",
        category,
    })

} catch (error) {
    console.log(error);
    res.status(201).send({
        success:false,
        message:"Error in Update Category",
        error,
    })
}
}

const viewAllCategoryController=async (req,res)=>{
    try {
        const category= await categoryModel.find({})
        res.status(200).send({
            success:true,
            message:"View all Category Success",
            category,
        })
        
    } catch (error) {
        console.log(error);
        res.status(201).send({
            success:false,
            message:"Error in view all Category",
            error,
        })
    }
}

const viewSingleCategoryController=async (req,res)=>{

    try {
        const{slug}=req.params;
        const category=await categoryModel.findOne({slug})
        res.status(200).send({
            success:true,
            message:"Getting single Category",
            category,
        })
        
    } catch (error) {
        console.log(error)
        res.status(201).send({
            success:false,
            message:"Error in view Single Category",
            error,
        })
    }

}

const deleteCategoryController=async(req,res)=>{

    try {

        const {id}=req.params
        const category=await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:"Delete Category Success",
            category,
        })
        
    } catch (error) {
        console.log(error)
        res.status(201).send({
            success:false,
            message:"Delete user not Success",
            error,
        })
    }

}


module.exports={createCategoryController,updateCategoryController,viewAllCategoryController,viewSingleCategoryController,deleteCategoryController}
const slugify=require('slugify')
const fs=require('fs')
const dotenv=require('dotenv');
const productModel = require('../models/productModel')
const categoryModel = require('../models/categoryModel')
const braintree=require('braintree')
const orderModel = require('../models/orderModel')
dotenv.config();
//payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BT_MERCHANT_ID,
    publicKey: process.env.BT_PUBLIC_KEY,
    privateKey: process.env.BT_PRIVATE_KEY,
  });

const createProductController=async(req,res)=>{
try {
    const{name,description,quantity,price,category}=req.fields
    const {photo}=req.files
    //validation
    switch(true){
        case !name:
            return res.status(201).send({error:"Product Name is required"});
        case !description:
            return res.status(201).send({error:"Product Description is required"});
        case !quantity:
            return res.status(201).send({error:"Product quantity is required"});
        case !price:
            return res.status(201).send({error:"Product price is required"});
        case !category:
            return res.status(201).send({error:"Product category is required"});
        case photo && photo.size > 1000000:
            return res.status(201).send({error:"Product photo is required and should be less than 1 mb"});
    }

const products=new productModel({...req.fields,slug:slugify(name)})
if(photo){
    products.photo.data=fs.readFileSync(photo.path)
    products.photo.contentType=photo.type    
}
await products.save();
res.send({
    success:true,
    message:"product added Successfully",
    products,
})
}
 catch (error) {
    console.log(error)
    res.status(201).send({
        success:false,
        message:"Create product Error",
        error,
    })
}

}

//view all product controller
const viewAllProductController=async(req,res)=>{
    try {

        const products=await productModel.find({}).select('-photo').sort({createdAt:-1}).populate('category')
        res.status(200).send({
            success:true,
            message:"View all product Success",
            products,
            totalcount:products.length,
        })
        
    } catch (error) {
        console.log(error)
        res.status(201).send({
            success:false,
            message:"Error in view all product",
            error,
        })
    }

}

//view Single Product Contruller
const viewSingleProductContruller=async(req,res)=>{

    try {
        const product=await productModel.findOne({slug:req.params.slug}).select('-photo').populate('category')
        res.status(201).send({
            success:true,
            message:"View single Product Successfull",
            product,
        })
        
    } catch (error) {
        console.log(error)
        res.status(201).send({
            success:false,
            message:"Error in single view product",
            error,
        })
    }

}

//product Photo Controller
const productPhotoController=async (req,res)=>{
    try {
        const product=await productModel.findById(req.params.id).select('photo')
        if(product.photo.data){
            res.set("Content-type",product.photo.contentType);
            return res.status(200).send(product.photo.data)
        }

        
    } catch (error) {
        console.log(error)
        res.status(201).send({
            success:false,
            message:"Error in product-photo",
            error,
        })
    }

}

//delete Product Controller
const deleteProductController=async(req,res)=>{
 try {
    await productModel.findByIdAndDelete(req.params.id).select('-Photo')
    res.status(200).send({
        success:true,
        message:"Delete product Successfull",
    })
    
 } catch (error) {
    console.log(error)
    res.status(201).send({
        success:false,
        message:"Error in delete product",
        error,
    })
 }
}

//update product controller || put
const updateProductController=async (req,res)=>{
    try {
        const{name,description,quantity,price,category}=req.fields
        const {photo}=req.files
        //validation
        switch(true){
            case !name:
                return res.status(201).send({error:"Product Name is required"});
            case !description:
                return res.status(201).send({error:"Product Description is required"});
            case !quantity:
                return res.status(201).send({error:"Product quantity is required"});
            case !price:
                return res.status(201).send({error:"Product price is required"});
            case !category:
                return res.status(201).send({error:"Product category is required"});
            case photo && photo.size > 1000000:
                return res.status(201).send({error:"Product photo is required and should be less than 1 mb"});
        }
    
    const products=await productModel.findByIdAndUpdate(req.params.id,{...req.fields,slug:slugify(name)},{new:true})
    if(photo){
        products.photo.data=fs.readFileSync(photo.path)
        products.photo.contentType=photo.type    
    }
    await products.save();
    res.send({
        success:true,
        message:"product updated Successfully",
        products,
    })
    }
     catch (error) {
        console.log(error)
        res.status(201).send({
            success:false,
            message:"update product Error",
            error,
        })
    }
}
//filter products
const productFiltersController=async (req,res)=>{
    try {
      const{checked,radio}=req.body
      let args={}
      if(checked.length>0)args.category=checked
      if(radio.length)args.price={$gte:radio[0],$lte:radio[1]}  
      const products=await productModel.find(args)
      res.status(200).send({
        success:true,
        message:"Product filter Success",
        products,
      })
    } catch (error) {
        console.log(error)
        res.status(201).send({
            success:false,
            message:"product filter Error",
            error,
        })
    }
}

//product count
const productCountController=async(req,res)=>{
    try {
        const total=await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success:true,
            message:" product count success",
            total,
        })
        
    } catch (error) {
        console.log(error)
        res.status(201).send({
            success:false,
            message:"Error  in product count",
            error,
        })
    }
}

//product list
const productListController=async(req,res)=>{
    try {
        const perPage=6
        const page=req.params.page?req.params.page:1
        const products=await productModel.find({}).select("-photo").skip((page-1)*perPage).limit(perPage).sort({createdAt:-1});
        res.status(200).send({
            success:true,
            message:" product list success",
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(201).send({
            success:true,
            message:"Error in product list",
            error,
        })
    }
}

//search products
const searchProductController=async (req,res)=>{
    try {
        const{keyword}=req.params
        const result=await productModel.find({
            $or:[
                {name:{$regex :keyword, $options:"i"}},
                {description:{$regex :keyword, $options:"i"}}
            ]
        }).select('-photo')
        res.status(200).send({
            success:true,
            message:"search product success",
            result,
        })
    } catch (error) {
        console.log(error)
        res.status(201).send({
            success:false,
            message:"Error in search controller",
            error
        })
    }
}

//similar products
const similarProductController=async(req,res)=>{
    try {
        const{pid,cid}=req.params
        const products=await productModel.find({
            category:cid,
            _id:{$ne:pid}
        }).select('-photo').limit(3).populate('category')
        res.status(200).send({
            success:true,
            message:"Similar product Success",
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(201).send({
            success:false,
            message:"Error in similar products",
            error
        })
    }
}

//producy with category
const productWithCategoryCotroller=async(req,res)=>{
    try {
        const category=await categoryModel.findOne({slug:req.params.slug})
        const products=await productModel.find({category}).populate('category').select('-photo')
        console.log(category)
        res.status(200).send({
            success:true,
            message:"Product with Category Success",
            products,
            category
        })
    } catch (error) {
        console.log(error)
        res.status(201).send({
            success:false,
            message:"Error in product with category",
            error
        })
    }
}

//brainTree Token Controller
const brainTreeTokenController=async(req,res)=>{
    try {
        gateway.clientToken.generate({},function (err,response){
            if(err){
                res.send(201).send(err)
            }else{
                res.send(response);
            }
        })
    } catch (error) {
        console.log(error)
    }

}

//brainTree Payment Controller
const brainTreePaymentController=async(req,res)=>{
    try {
        let temp=false
        const {cart,nonce}=req.body
        let total=0
        cart.map((i)=>{total+=((i.price)*(i.quantity))});
        let newTransaction=gateway.transaction.sale({
            amount:total,
            paymentMethodNonce:nonce,
            options:{
                submitForSettlement:true
            }
        },
        function(err,result){
            if(result){
                const order= new orderModel({
                    products:cart,
                    payment:result,
                    buyer:req.user._id
                }).save()
                temp=true
                res.json({ok:true})
            }else{
                res.status(201).send(err)
            }
        }
        )
        if(temp==true){
        for (const cartItem of cart) {
            const product = await productModel.findById(cartItem._id);
      
            if (product) {
              // Update the product model based on cart quantity
              product.quantity -= cartItem.quantity;
      
              // Save the updated product model
              await product.save();
            }
          }}
    } catch (error) {
        console.log(error)
    }
}


module.exports={createProductController,viewAllProductController,
    viewSingleProductContruller,productPhotoController,
    deleteProductController,updateProductController,
    productFiltersController,productCountController,
    productListController,searchProductController,
    similarProductController,productWithCategoryCotroller,
brainTreeTokenController,brainTreePaymentController}
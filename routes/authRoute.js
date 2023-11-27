const express=require('express')
const {registerController,testController,loginController, forgotController, updateProfileController, userOrderController, allOrdersController, orderStatusUpdate, sendContactContainer, showAllContactController}=require('../controllers/authController');
const { requireSignin, isAdmin } = require('../middlewares/authMiddleware');

//router object
const router=express.Router()

//routing
//REGISTER || METHOD POST
router.post('/register',registerController);

//LOGIN || METHOD POST
router.post('/login',loginController)

//FORGOT-PASSWORD || POST
router.post('/forgot-password',forgotController)

//test rout
router.get('/test',requireSignin,isAdmin,testController)

//protected user route auth
router.get('/user-auth',requireSignin,(req,res)=>{
    res.status(200).send({
        ok:true
    });
})


//protected admin route auth
router.get('/admin-auth',requireSignin,isAdmin,(req,res)=>{
    res.status(200).send({
        ok:true
    });
})

//update profile
router.put('/profile-update',requireSignin,updateProfileController)

//Orders
router.get('/user-orders',requireSignin,userOrderController)

//allorders
router.get('/all-orders',requireSignin,isAdmin,allOrdersController)

//order status update
router.post('/order-status/:oid',requireSignin,isAdmin,orderStatusUpdate)

//For contact API

//Set contact || POST
router.post('/contact',sendContactContainer)

//get contact || GET
router.get('/all-contacts',requireSignin,isAdmin,showAllContactController)
module.exports=router
const express=require('express')
const { requireSignin, isAdmin } = require('../middlewares/authMiddleware');
const { createCategoryController,updateCategoryController, viewAllCategoryController, viewSingleCategoryController, deleteCategoryController } = require('../controllers/createCategoryController');

const router=express.Router()

//Create Category || post
router.post('/create-category',requireSignin,isAdmin,createCategoryController);

//update Category || Post
router.post('/update-category/:id',requireSignin,isAdmin,updateCategoryController)

//view all Category || get
router.get('/category',viewAllCategoryController)

//view single category||get
router.get('/single-category/:slug',viewSingleCategoryController)

//delete category|| delete
router.delete('/delete-category/:id',requireSignin,isAdmin,deleteCategoryController)

module.exports=router
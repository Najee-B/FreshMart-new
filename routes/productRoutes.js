const express=require('express')
const { requireSignin, isAdmin } = require('../middlewares/authMiddleware')
const { createProductController, viewAllProductController, viewSingleProductContruller, productPhotoController, deleteProductController, updateProductController, productFiltersController, productCountController, productListController, searchProductController, similarProductController, productWithCategoryCotroller, brainTreeTokenController, brainTreePaymentController } = require('../controllers/productController')
const formidable=require('express-formidable')


const router=express.Router()

//Create Product || post
router.post('/create-product',requireSignin,isAdmin,formidable(),createProductController)

//view all || get
router.get('/viewall-product',viewAllProductController)

//view singlw || get
router.get('/single-product/:slug',viewSingleProductContruller)

//view photo || get
router.get('/product-photo/:id',productPhotoController)

//delete product || post
router.delete('/delete-product/:id',requireSignin,isAdmin,deleteProductController)

//Update Product || post
router.put('/update-product/:id',requireSignin,isAdmin,formidable(),updateProductController)

//filter Products || post
router.post('/filter-product/',productFiltersController)

//product count || get
router.get('/product-count',productCountController)

//product per page || get
router.get('/product-list/:page',productListController)

//search product 
router.get('/search-product/:keyword',searchProductController)

//similar products
router.get('/similar-products/:pid/:cid',similarProductController)

//product based on category
router.get('/products-with-category/:slug',productWithCategoryCotroller)

//Payments route

//get token

router.get('/braintree/token',brainTreeTokenController)

//payment
router.post('/braintree/payment',requireSignin,brainTreePaymentController)

module.exports=router
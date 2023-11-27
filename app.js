const express=require('express');
const morgan=require('morgan');
const dotenv=require('dotenv');
const ConnectDB = require('./config/db');
const cors=require('cors')
const authRoute=require('./routes/authRoute')
const categoryRoute=require('./routes/categoryRoutes')
const productRoute=require('./routes/productRoutes')
const path=require('path')

//.env configure
dotenv.config();
//database connection
ConnectDB();
//middlewares
const app=express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors())
app.use(express.static(path.join(__dirname,'./client/build')))

//routes
app.use('/api/v1/auth',authRoute);
app.use('/api/v1/category',categoryRoute);
app.use('/api/v1/product',productRoute)


//rest api
app.use('*',function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
})



app.listen(7080,()=>{
    console.log("Server Listening at port 7080 ");
})

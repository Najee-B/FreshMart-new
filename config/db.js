const mongoose=require('mongoose');


const ConnectDB=async()=>{
    try{
        const db=await mongoose.connect(process.env.DB);
        console.log(`Connection Success ${db.connection.host}`);
    }
    catch (err){
        console.log(`Connection Failed ${err}`);
    }
};

module.exports=ConnectDB;
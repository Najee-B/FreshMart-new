const bcrypt=require('bcrypt')

const hashPassword=async(password)=>{
    try{
        const hashedPassword=await bcrypt.hash(password,10)
        return hashedPassword;
    }
    catch(error){
        console.log(error);
    }
}

const comparePassword=async(password,hashedpassword)=>{
    return bcrypt.compare(password,hashedpassword);
}

module.exports={hashPassword,comparePassword}
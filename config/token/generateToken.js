const jwt=require('jsonwebtoken')
const mykeys=process.env.JWT_KEY;



const generateToken=id=>{
    return jwt.sign({id},mykeys,{expiresIn:"10d"} )
} 


module.exports=generateToken;
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../../model/user/User");



const authMiddleware=expressAsyncHandler(async(req,res,next)=>{
let token ;
if(req?.headers?.authorization?.startsWith('Bearer')){
    try {
        token=req.headers.authorization.split(" ")
        console.log(token)
    } catch (error) {
        
    }
}

})
authMiddleware();


module.exports={
    authMiddleware
}
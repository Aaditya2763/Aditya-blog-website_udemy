//calling user for data modeling
const User = require("../../model/user/User");
//importing  express-async-handler
//used to handle exceptions 
const expressAsyncHandler=require("express-async-handler");


//----------------------------------------------------------------------
//controller to register user
// expressAsyncHandler used to handle exceptions
const registerUser= expressAsyncHandler(
  async(req,res)=>{
   
      const userExist=await User.findOne({
          email:req?.body?.email,
      })
  if(userExist){
      throw new Error("User Already exists with this email");
  }
  try {
   // console.log(req.body);
   const user=await User.create({
      // types of destructuring firstname
      //type1: firstName=req.body.firstName (simple method)
      //type2: firstName=req.body && req.body.firstName (with conditions)
      //type 3 firstNAme=req?.body?.firstname (shorthand)
      firstName:req?.body?.firstName,
      lastName:req?.body?.lastName,
      email:req?.body?.email,
      password:req?.body?.password,
      gender:req?.body?.gender,
  })
  // res.json({user:"User registerd successfully"}); 
  res.json(user);  
          
  } 
 
     
    catch (error) {
      res.json(error);
    }
  
  }
); 


//---------------------------------------------------------------------------------
//controller to login user
const login=expressAsyncHandler(
  async(req,res)=>{
    const{password}=req.body;
 
const user=await User.findOne({email:req?.body?.email});
if(!user) {
  res.status(401);
  throw new Error("Invalid email");

}
if(user && (await user.isPasswordMatched(password)) ){
  // throw new Error("Invalid credentilas");
  res.json(user);
}
    else{
      res.status(401);
      throw new Error("Invalid password")
    }

    
}
)



module.exports={
    registerUser,
    login,
}
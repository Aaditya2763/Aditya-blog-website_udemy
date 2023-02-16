//calling user for data modeling
const User = require("../../model/user/User");


//----------------------------------------------------------------------
//controller to register user
const registerUser=async(req,res)=>{
  try {
    const user=await User.findOne({
        email:req?.body?.email,
    })
if(user){
    res.json("user already exists" );
}
else{
 // console.log(req.body);
 const newuser=await User.create({
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
res.json(newuser);  
        
} 
}
   
  catch (error) {
    res.json(error);
  }

}


//---------------------------------------------------------------------------------
//controller to login user
const login=async(req,res)=>{
         try {
            const user=await User.find({
                email:req?.body?.email,
                password:req?.body?.password,
            })
            res.json(user);
         } catch (error) {
            res.json(error);
         }
    }



module.exports={
    registerUser,
    login,
}
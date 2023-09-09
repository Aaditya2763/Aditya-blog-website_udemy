
const mongoose=require('mongoose')

//we are using this function to check that the provided id is valid or not
const validateMongoDBId=id=>{
    const isValid=mongoose.Types.ObjectId.isValid(id);
    if(!isValid) throw new Error("invalid id")
}

module.exports=validateMongoDBId
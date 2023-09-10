
const expressAsyncHandler = require("express-async-handler");
const Comment=require("../../model/comments/comments");
const validateMongoDBId = require("../../utils/validateMongodbId");

// -------------------------------------------------------------
// ----------------fetch  all comment---------------------------
// -------------------------------------------------------------

const fetchCommentsCtrl=expressAsyncHandler(async(req,res)=>{
try {
    const comments=await Comment.find({}).sort("-created");
    res.status(200).json({message:"fetched the comments successfully",comments})
} catch (error) {
    res.status(500).json({message:"internal server error"})
    
}
})

// -------------------------------------------------------------
// ----------------fetch particular comment---------------------
// -------------------------------------------------------------

const fetchParticularCommentCtrl=expressAsyncHandler(async(req,res)=>{
    const {id}=req.params
    validateMongoDBId(id);
   
    try {
        const comments=await Comment.findById(id).sort("-created");
        res.status(200).json({message:"fetched the comments successfully",comments})
    } catch (error) {
        res.status(500).json({message:"internal server error"})
        
    }
    })

    // -------------------------------------------------------------
// ----------------delete particular comment---------------------
// -------------------------------------------------------------

const deleteParticularCtrl=expressAsyncHandler(async(req,res)=>{
    const {id}=req.params
    validateMongoDBId(id);
   
    try {
        const comments=await Comment.findByIdAndDelete(id);
        res.status(200).json({message:"deletedthe comments successfully",comments})
    } catch (error) {
        res.status(500).json({message:"internal server error"})
        
    }s
    },{new:true})
// -------------------------------------------------------------
// ---------------- post comment--------------------------------
// -------------------------------------------------------------
const createCommentsCtrl=expressAsyncHandler(async(req,res)=>{
    const user=req.user;
    const {postId,description}=req.body;
    try {
        const comment=await Comment.create({
            postId:postId,
            user:user,
            description:description
        })
        res.status(200).json({message:"comment created successfully",comment})
    } catch (error) {
        res.status(500).json({message:"internal server error",error})
    }
    
},{new:true})

// -------------------------------------------------------------
// ---------------- post comment--------------------------------
// -------------------------------------------------------------
const updateCommentsCtrl=expressAsyncHandler(async(req,res)=>{
    const user=req.user;
    const{id}=req.params
    const {postId,description}=req.body;
    validateMongoDBId(id)
    try {   

        const comment=await Comment.findByIdAndUpdate(id,{
            postId:postId,
            user:user,
            description:description
        },{new:true})
        res.status(200).json({message:"comment updted successfully",comment})
    } catch (error) {
        res.status(500).json({message:"internal server error",error})
    }
    
},{new:true})


// -------------------------------------------------------------
// ---------------- post comment--------------------------------
// -------------------------------------------------------------


module.exports={
    createCommentsCtrl,
    fetchCommentsCtrl,
    fetchParticularCommentCtrl,
    updateCommentsCtrl,
    deleteParticularCtrl
}
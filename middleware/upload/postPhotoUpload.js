
// The multerFilter function  is used as a filter function for the Multer middleware in a Node.js application. Multer is a popular middleware for handling file uploads in Express.js, and the filter function is used to determine whether to accept or reject a file that a user is trying to upload.
const multer=require("multer");
const sharp = require("sharp");
const path = require('path');


//multerStorage varible used to store data temperory using multer inbuilt memory storage
const multerStorage =multer.memoryStorage();

//file type checking
//if we uplaod any file we  will access it in file
//cb is a callback function that is used to display  success,error
//req is request made by the user
//The main purpose of this function is to check whether the uploaded file is an image or not. It does this by examining the mimetype property of the file object.
const multerFilter=(req,file,cb)=>{
    // checking file type and image indcates that it only accept image/jpeg and image/png
    if(file.mimetype.startsWith("image")){
        cb(null,true)
    }
    else{
        cb({
            message:'unsupported file'
        },false)
    }
   

}

const  postPhotoResize=async(req,res,next)=>{
    if(!req.file)return next();
    //creating dynamic file name to avoid filename conflict
    req.file.filename=`post-${Date.now()}-${req.file.originalname}`;
    //resizing and storing file to public folder temporarily
    await sharp(req.file.buffer)
    .resize(500,500)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(path.join(`public/images/post/${req.file.filename}`))
    next()
}

//post profile upload middleware
const postPhotoUpload=multer({
    //temporary  storage location
    storage:multerStorage,
//filter function
    fileFilter:multerFilter,
    //filesize
    limits:{fileSize:1000000}
})



//postPhotoResizing resizing middleware




module.exports={postPhotoUpload,postPhotoResize}
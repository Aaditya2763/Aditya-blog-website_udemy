
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
//user profile upload middleware
const userProfileUpload=multer({
    //temporary  storage location
    storage:multerStorage,
//filter function
    fileFilter:multerFilter,
    //filesize
    limits:{fileSize:1000000}
})

//output provided by multerfunction
// {
//     fieldname: 'image',
//     originalname: 'pexels-pixabay-36717.jpg',
//     encoding: '7bit',
//     mimetype: 'image/jpeg',
//     buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 48 00 48 00 00 ff e2 0c 58 49 43 43 5f 50 52 4f 46 49 4c 45 00 01 01 00 00 0c 48 4c 69 6e 6f 02 10 00 00 ... 154643 more bytes>,
//     size: 154693
//   }


// Sharp is a high-performance image processing library for Node.js. It is often used to manipulate and process images in various ways, such as resizing, cropping, rotating, compressing, and applying various image filters. Sharp is particularly popular for web applications and services that require efficient image processing and optimization.
//userProfile resizing middleware
const  profilePhotoResize=async(req,res,next)=>{
    if(!req.file)return next();
    //creating dynamic file name to avoid filename conflict
    req.file.filename=`user-${Date.now()}-${req.file.originalname}`;
    //resizing and storing file to public folder temporarily
    await sharp(req.file.buffer)
    .resize(250,250)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(path.join(`public/images/profile/${req.file.filename}`))
    next()
}

module.exports={userProfileUpload,profilePhotoResize,}
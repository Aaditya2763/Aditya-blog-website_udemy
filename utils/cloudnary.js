const cloudnary=require ('cloudinary');
// import {v2 as cloudinary} from 'cloudinary';
cloudnary.config({
    cloud_name:process.env.Cloudnary_CLOUD_NAME,
    api_key:process.env.Cloudnary_API_KEY,
    api_secret:process.env.Cloudnary_API_SECRET
});

const cloudnaryUploadImg=async(fileToUpload)=>{
    try {
        //uploader 
        const data=await cloudnary.uploader.upload(fileToUpload ,{
            resource_type:"auto",
        })
        // return the whole data whrere file is stored
    //   return data
    // but we want only secure profile image url so
    return {
        url:data?.secure_url,
    }
    } catch (error) {
        return error
    }
}

module.exports=cloudnaryUploadImg
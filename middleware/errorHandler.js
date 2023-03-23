
const notFound=(req,res,next)=>{
    const error=new Error(`Not Found-${req.originalUrl}`);
    res.status(404);
    //passing error to nxt middleware ie error handler
    next(error);
};

//middleware contains 4 parametrers req,res,err,next 
//the parameters are alwas written as like this 1st err 2nd req,res,3rd next 
const errorHandler=(err,req,res,next)=>{
    const statusCode=res.statusCode===200 ? 500: res.statusCode;
res.status(statusCode);
res.json({
    // custom object message  containing  err having message object in it  
    message:err?.message,
    //to know which line of code has error  i am using my own variable to store it 
     stack: process.env.NODE_ENV=="production" ? null: err.stack,
})
 
};



module.exports={
    errorHandler,
    notFound
}
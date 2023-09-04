// importing dbUrl from process.env file
const DB_URL=process.env.DB_URL ;
//importing mongoose
const mongoose=require("mongoose");


//connecting to database  
const dbConnect=async()=>{
    try{
        //added to prevent deprecation warning  for strict Query
        mongoose.set("strictQuery", false);
        mongoose.connect(DB_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }) 
        console.log("db connected");
    }

    catch(error){
        
        console.log(error.message); 
    }
}

module.exports= dbConnect;
if(process.env.Node_Env !=='production'){
    require('dotenv').config();
}
//initialising express
const express=require('express');

//importing dbconnect file to connect database
const dbConnect=require('./database/dbConnect');

//assigning express toapp variable
const app =express();

//connecting database
dbConnect();

//middleware use to provide json data to a request
app.use(express.json());
//importing all auth routes to authroutesroutes
const authRoutes=require('./routes/user/authRoutes')
 
//allowing app to use routes
app.use(authRoutes); 

//dynamic port allocation in addition with a constat port 
const PORT=process.env.PORT || 5000;

//Server
 app.listen(PORT,console.log(`server running at ${PORT}`));
   


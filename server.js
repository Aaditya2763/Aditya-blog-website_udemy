if(process.env.Node_Env !=='production'){
    require('dotenv').config();
}
//initialising express
const express=require('express');

//importing dbconnect file to connect database
const dbConnect=require('./database/dbConnect');
//error handler middleware
const{ errorHandler,notFound}=require('./middleware/errorHandler')

//assigning express toapp variable
const app =express();

//connecting database
dbConnect();

//middleware use to provide json data to a request
app.use(express.json());
//importing all auth routes to authroutesroutes
const authRoutes=require('./routes/auth/authRoutes')
const userRoutes=require('./routes/users/userRoutes')
 
//allowing app to use routes

app.use(authRoutes); 
app.use(userRoutes);
// always use middleware velow your all routes
app.use(notFound);
//As error handler middleware dependent on notfound middleware to receive  error message 
//that is why we are using it before errorHandler
app.use(errorHandler);

//dynamic port allocation in addition with a constat port 
const PORT=process.env.PORT || 5000;

//Server
 app.listen(PORT,console.log(`server running at ${PORT}`));
   


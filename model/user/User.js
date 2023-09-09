//importing mongoose
const mongoose=require('mongoose');
// importing bcrypt
const bcrypt=require('bcryptjs');
//crypto is a node built in function which return a desired value result in hexadecimal
const crypto=require('crypto')
const Post=require('../post/Post')
//createing user schema
const  userSchema=new mongoose.Schema({
    firstName:{
        //if we want to provide requitred message we put it in array having bollean value(true/false) and a message
        required:[true,'First name is required'],
        type:String,
    },
    lastName:{
        required:[true,'Last  name is required'],
        type:String,
    },
    gender:{
        required:[true,'Gender is required'],
        type:String,
    },
    age:{
        // required:[true,'Age is required'],
        type:Date,
    },
    profilePhoto:{
type:String,
default:'https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651__340.png',
    },
    email:{
        required:[true,'Email is required'],
        type:String,
    },
    bio:{
type:String,
    },
    password:{
        required:[true,'Password is required'],
        type:String,
    },
    postCount:{
        type:Number,
        default:0,
    },
    isBlocked:{
        type:Boolean,
        default:false,
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    role:{
        type:String,
        //enum is used for multiple role for single person
        enum:['Admin','Blogger','Guest'],

    },
    isFollowing:{
        type:Boolean,
        default:false,
    },
    isUnFollowing:{
        type:Boolean,
        default:false,
    },
    isAccountVerified:{
        type:Boolean,
        default:false,
    },
    accountVerificationToken:{
        type:String,
      
       
    },
    accountVerificationTokenExpires:{
        type:Date,  
    },
    accountCreated:{
        type:Date,
    },
    //ViewedBy is a many to one realtion that means many users can see your post
    //to handel the view user data we create an array
    //we just want to store only the id of the users instead of whole user data
    //to store only their id type:mongoose.Schema.Types.ObjectId is used
    //ref is use for referncing whose id we have to store like userId not postId
    viewedBy:{
type:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
}]
    },
    followers:{
        
type:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
}]
    },
    following:{
        
type:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
}]
    },
    
    //we can also create user feild like this when user having a single type
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
active:{
    type:Boolean,
    default:false,

},

},

// type: type:mongoose.Schema.Types.ObjectId,
//this provide virtuals id not the actual userid so to get the actual userid we have to convert it in 
//json type
//and then into object type
{
//converting virtuals ids into json
    toJSON:{
        virtuals:true,
    },
    //converting json into object
    toObject:{
virtuals:true,
    },
    timestamps:true
   
}
);

//Virtual methods to populate created post
userSchema.virtual('posts',{
    ref:Post,
    foreignField:'user',
    localField:'_id'
})

//mongoose pre middleware which i am using to hash password before creating user
// Mongoose pre middleware to hash the password before saving
userSchema.pre("save", async function(next) {
if(!this.isModified('password')){
     next();
}

  
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    
});

// Custom method to compare entered password with hashed password
userSchema.methods.isPasswordMatched = async function(enteredPassword) {
    try {
        return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
        throw error;
    }
};

//generate account verification token
userSchema.methods.createAccountVerificationToken = async function() {
    try {
        const verificationToken=  crypto.randomBytes(32).toString('hex')
        const hasedtoken=crypto.createHash("sha256").update(verificationToken).digest("hex")
        
        this.accountVerificationToken = hasedtoken;

    // Set an expiration time (e.g., 10 minutes)
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    this.passwordResetExpires = expirationTime;

    return verificationToken;
    } catch (error) {
        throw error;
    }
};

//generate password verification token
userSchema.methods.createPasswordResetToken = async function() {
    try {
        const resetToken=crypto.randomBytes(32).toString('hex')
        const hasedtoken=crypto.createHash("sha256").update(resetToken).digest("hex")
        
        this.passwordResetToken = hasedtoken;

    // Set an expiration time (e.g., 10 minutes)
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    this.passwordResetExpires = expirationTime;

    return resetToken;
    } catch (error) {
        throw error;
    }
};
//compiling Schema into model

const User=mongoose.model('User',userSchema);
module.exports=User;
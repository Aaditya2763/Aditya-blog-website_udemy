const expressAsyncHandler = require("express-async-handler");
const User = require("../../model/user/User");
const { param } = require("../../routes/auth/authRoutes");
const validateMongoDBId = require("../../utils/validateMongodbId");

// const Key=process.env.JWT_kEY;

/*------------------------Alluser --------------------------------*/
const getAllUsers = expressAsyncHandler(async (req, res) => {
  try {
    const allusers = await User.find({});
    // console.log(allusers);

    res.json(allusers);
  } catch (error) {
    res.send(error);
  }
  // console.log("getting users data");
  // res.send("hello");
});

/*------------------------fetch user--------------------------------*/
const fetchUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  //validating id
  validateMongoDBId(id);
  try {
    const userdata = await User.find({ _id: id });
    // console.log(user);

    res.json(userdata);
  } catch (error) {
    res.json(error.message);
  }
  // console.log("getting users data");
  // res.send("hello");
});

/*------------------------delete user--------------------------------*/
const deleteUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.json(deletedUser);
    console.log("user deleted!");
  } catch (error) {
    res.json(error.message);
  }
});

/*------------------------ user Profile--------------------------------*/
const userProfile = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  //validating id
  validateMongoDBId(id);
  try {
    const profile = await User.find({ _id: id });
    // console.log(user);

    res.json(profile);
  } catch (error) {
    res.json(error.message);
  }
  // console.log("getting users data");
  // res.send("hello");
});

/*------------------------ update Profile--------------------------------*/
const updateProfile = expressAsyncHandler(async (req, res) => {
  console.log(req.user);

  const { id } = req?.user;
  console.log(id);
  validateMongoDBId(id);

  try {
    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        email: req?.body?.email,
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        bio: req?.body?.bio,
      },
      {
        //new immidiately reftlect the result
        new: true,
        //used to run validation
        runValidators: true,
      }
    );
    res.json(updateUser);
  } catch (error) {
    throw new Error(error.message);
  }
});

/*------------------------ update password--------------------------------*/
const updatePassword = expressAsyncHandler(async (req, res) => {
  
  const { id } = req?.user;
 
  const { password } = req?.body;

  validateMongoDBId(id);
  //find user by id

  const user = await User.findById(id);
  try {
    if (password) {
      user.password = password;
      const updatedPassword = await user.save();
      console.log("saving password");
      res.json(updatedPassword);
      return;
    }
   
    res.json(user);
  } catch (error) {
    console.log(error.message);
  }
});

/*------------------------ following user--------------------------------*/
const followingUserCtrl=expressAsyncHandler(async(req,res)=>{
    const {followId}=req.body;
    const loginUserId=req.user.id;
    // finding the user and adding the current user to its follwers arraay
    const targetUser=await User.findById(followId);
    // console.log(targetUser.followers)
   const alreadyFollowing=targetUser?.followers?.find(user=>user?.toString()===loginUserId.toString())
//    console.log(alreadyFollowing)
if(alreadyFollowing){
    throw new Error("already following this user")
}
    await User.findByIdAndUpdate(followId,{ 
        $push:{followers:loginUserId},
        isFollowing:true,
    },{new:true})


    await User.findByIdAndUpdate(loginUserId,{
        $push:{following:followId}
    },{new:true})

    res.json("Successfully followed the user")
})


// --------------------unfollowUserCtrl--------------
const unfollowUserCtrl=expressAsyncHandler(async(req,res)=>{
    console.log("fifififi")
    const {unfollowId}=req.body;
    const loginUserId=req.user.id;
    console.log(unfollowId+"and"+loginUserId)
await User.findByIdAndUpdate(unfollowId,{
    $pull:{followers:loginUserId},
    isFollowing:false,
},{new:true})

await User.findByIdAndUpdate(loginUserId,{
    $pull:{following:unfollowId},
},{new:true})

    res.json("unfollow  user succesfully")
})

// --------------------BlockUserCtrl--------------
const blockUserCtrl=expressAsyncHandler(async(req,res)=>{
    const {id}=req.params;
    // console.log(id)
    validateMongoDBId(id);
    const user=await User.findByIdAndUpdate(id,{
        isBlocked:true
    },{new:true})
    res.json(user)
})


// --------------------unBlockUserCtrl--------------
const unblockUserCtrl=expressAsyncHandler(async(req,res)=>{
    const {id}=req.params;
    // console.log(id)
    validateMongoDBId(id);
    const user=await User.findByIdAndUpdate(id,{
        isBlocked:false,
    },{new:true})
    res.json(user)
})
module.exports = {
  getAllUsers,
  deleteUser,
  fetchUser,
  userProfile,
  updateProfile,
  updatePassword,
  followingUserCtrl,
  unfollowUserCtrl,
  blockUserCtrl,
  unblockUserCtrl
};

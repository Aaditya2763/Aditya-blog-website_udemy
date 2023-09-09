
const expressAsyncHandler = require('express-async-handler');
const User = require('../../model/user/User');
const validateMongoDBId = require('../../utils/validateMongodbId');
const { CourierClient } = require('@trycourier/courier');
const crypto=require('crypto');
const fs=require('fs');
const { now } = require('mongoose');
const cloudnaryUploadImg = require('../../utils/cloudnary');



// --------------------------------------------------------------
/* ------------------------ All Users ------------------------ */
// --------------------------------------------------------------

const getAllUsers = expressAsyncHandler(async (req, res) => {
  try {
    const allUsers = await User.find({}).select('-password');
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
},{now:true});


// --------------------------------------------------------------
/* ------------------------ Fetch User Details ------------------------ */
// --------------------------------------------------------------

const fetchUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ID
  validateMongoDBId(id);
  
  try {
    const userData = await User.findById(id).select('-password').populate('posts')
  console.log("fghjksdfghj")
  console.log(userData)
    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error',error });
  }
},{now:true});




// --------------------------------------------------------------
/* ------------------------ Delete User ------------------------ */
// --------------------------------------------------------------

const deleteUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
},{now:true});


// --------------------------------------------------------------
/* ------------------------ User Profile ------------------------ */
// --------------------------------------------------------------


const userProfile = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);

  try {
    const profile = await User.findById(id);
    if (!profile) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
},{now:true});


// --------------------------------------------------------------
/* ------------------------ Update Profile ------------------------ */
// --------------------------------------------------------------

const updateProfile = expressAsyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoDBId(id);

  try {
    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        bio: req.body.bio,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updateUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updateUser);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
},{now:true});


// --------------------------------------------------------------
/* ------------------------ Update Password ------------------------ */
// --------------------------------------------------------------

const updatePassword = expressAsyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoDBId(id);

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password } = req.body;
    if (password) {
      user.password = password;
      const updatedUser = await user.save();
      return res.json(updatedUser);
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
},{now:true});


// --------------------------------------------------------------
/* ------------------------ Following User ------------------------ */
// --------------------------------------------------------------


const followingUserCtrl = expressAsyncHandler(async (req, res) => {
  const { followId } = req.body;
  const loginUserId = req.user.id;

  // Validate MongoDB ID
  validateMongoDBId(followId);

  try {
    const targetUser = await User.findById(followId);
    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    const alreadyFollowing = targetUser.followers.find((user) =>
      user.toString() === loginUserId.toString()
    );

    if (alreadyFollowing) {
      throw new Error('Already following this user');
    }

    await User.findByIdAndUpdate(followId, {
      $push: { followers: loginUserId },
      isFollowing: true,
    });

    await User.findByIdAndUpdate(loginUserId, {
      $push: { following: followId },
    });

    res.json('Successfully followed the user');
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
},{now:true});


// --------------------------------------------------------------
/* ------------------------ Unfollow User ------------------------ */
// --------------------------------------------------------------

const unfollowUserCtrl = expressAsyncHandler(async (req, res) => {
  const { unfollowId } = req.body;
  const loginUserId = req.user.id;
  
  // Validate MongoDB ID
  validateMongoDBId(unfollowId);

  try {
    await User.findByIdAndUpdate(unfollowId, {
      $pull: { followers: loginUserId },
      isFollowing: false,
    });

    await User.findByIdAndUpdate(loginUserId, {
      $pull: { following: unfollowId },
    });

    res.json('Unfollowed the user successfully');
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
},{now:true});


// --------------------------------------------------------------
/* ------------------------ Block User ------------------------ */
// --------------------------------------------------------------


const blockUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);

  try {
    const user = await User.findByIdAndUpdate(id, {
      isBlocked: true,
    }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
},{now:true});


// --------------------------------------------------------------
/* ------------------------ Unblock User ------------------------ */
// --------------------------------------------------------------

const unblockUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);

  try {
    const user = await User.findByIdAndUpdate(id, {
      isBlocked: false,
    }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
},{now:true});


// --------------------------------------------------------------
/* ------------------------ sent Account Verification-token via email------------------------ */
// --------------------------------------------------------------


const geverateVerifyAccountToken = expressAsyncHandler(async (req, res) => {
 
  try {

    const loginId = req.user.id;
    
    const user = await User.findById(loginId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const verificationToken = await user.createAccountVerificationToken();
    await user.save()
    console.log(verificationToken)
      const courier = CourierClient(
    { authorizationToken: "pk_prod_JT8SGGK9FK4W23JE52KK51Q530RG"});

      const { requestId } = await courier.send({
        message: {
          content: {
            title: "Welcome to Blogposter4u.com",
            body:`if you were requested to verify your account ,verify now within 10 mins.otherwise ignore this message
            click on the button to cativate your account.
            [click here](http://localhost:5000/users/verify-account/${verificationToken})`
          },
          data: {
            joke: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZjQ2MGIyZTE2NzZlNzMxMjEyZGRkYiIsImlhdCI6MTY5MzczNzE3MSwiZXhwIjoxNjk0NjAxMTcxfQ.HU9HNHLlLivLP8p_CPYRVqf-DBdLFe205S0n0gcGgHA"
          },
          to: {
            email: `${user.email}`
          }
        }
      })
    console.log(verificationToken)
    res.status(200).json(`http://localhost:5000/users/verify-account/${verificationToken}`)
  }
  catch(error){
res.status(200).json(error)
  }
},{now:true})


// --------------------------------------------------------------
// -------------------------Verify email---------------------
// --------------------------------------------------------------

const verifyAccount=expressAsyncHandler(async(req,res)=>{
try {
 
  const {verificationToken}=req.params;
 const hasedtoken=crypto.createHash("sha256").update(verificationToken).digest("hex");
 
  
  const user=await User.findOne({
    accountVerificationToken:hasedtoken,
    accountVerificationTokenExpires:{$gt:new Date()},
  });
  
  
  user.isAccountVerified=true;
  user.accountVerificationToken=undefined;
  user.accountVerificationTokenExpires=undefined
  await user.save();
  res.status(200).json(user)
} catch (error) {
  res.status(400).json({message:"Token expired please try again"})
}
}, {now:true})


// --------------------------------------------------------------
// ------------------------passwordResetToke----------------------------
// --------------------------------------------------------------

const generatePasswordResetToken=expressAsyncHandler(async(req,res)=>{
  const{email}=req.body;
    const user=await User.findOne({email:email})
    
    if (!user) {
      return res.status(404).json({ message: 'email not found' });
    }

  try {
   
    const verificationToken = await user.createPasswordResetToken();
    await user.save()
    
      const courier = CourierClient(
    { authorizationToken:`${process.env.COURIER_TOKEN}`});

      const { requestId } = await courier.send({
        message: {
          content: {
            title: "Welcome to Blogposter4u.com",
            body:`if you were requested to reset your account password  ,reset  now within 10 mins. otherwise ignore this message
            click on the button to cativate your account.
            [click here](http://localhost:5000/users/reset-password/${verificationToken})`
          },
          data: {
            // joke: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZjQ2MGIyZTE2NzZlNzMxMjEyZGRkYiIsImlhdCI6MTY5MzczNzE3MSwiZXhwIjoxNjk0NjAxMTcxfQ.HU9HNHLlLivLP8p_CPYRVqf-DBdLFe205S0n0gcGgHA"
          },
          to: {
            email: `${user.email}`
          }
        }
      })
    
    res.status(200).json(
      {message:"link sent successfully to your email address",
        link:`http://localhost:5000/users/verify-account/${verificationToken}`})
    // resetToken=
  } catch (error) {
    res.status(400).json("email not found");
  }
})


// --------------------------------------------------------------
// -------------------------change Password---------------------
// --------------------------------------------------------------

const changePasswordCtrl=expressAsyncHandler(async(req,res)=>{
  try {
   
    const {verificationToken}=req.params;
    const {password}=req.body;
    console.log(verificationToken)
   const hasedtoken=crypto.createHash("sha256").update(verificationToken).digest("hex");
   console.log(hasedtoken)
    
    const user=await User.findOne({
      passwordResetToken:hasedtoken,
      passwordResetExpires:{$gt:Date.now()},
    });
    
   user.password=password;
    user.passwordResetToken=undefined;
    user.passwordResetExpires=undefined;
    await user.save();
    res.status(200).json("password updated successfully")
  } catch (error) {
    res.status(400).json({message:"Token expired please try again"})
  }
  }, {now:true})
  
  
  // --------------------------------------------------------------
// -------------------------Updating user profile controller---------------------
// --------------------------------------------------------------

const userProfileUpdateCtrl = expressAsyncHandler(async (req, res) => {
  try {
    // Assuming req.file contains the uploaded image

    // Get the user ID from req.user or wherever it is available
    const { id } = req.user;

    // Get the local path to the uploaded image
    const localPath = `public/images/profile/${req.file.filename}`;

    // Upload the image to Cloudinary
    const imgUploaded = await cloudnaryUploadImg(localPath);

    if (!imgUploaded || !imgUploaded.url) {
      return res.status(500).json({ message: 'Image upload to Cloudinary failed.' });
    }

    // Update the user's profilePhoto field with the Cloudinary URL
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { profilePhoto: imgUploaded.url } },
      { new: true } // Return the updated user object
    );
    //removing imgae file  from public folder
    fs.unlinkSync(localPath)

    // Check if the user was found and updated successfully
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Send a success response with the updated user object
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


    
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
  unblockUserCtrl,
  geverateVerifyAccountToken,
  verifyAccount,
  generatePasswordResetToken,
  changePasswordCtrl,
  userProfileUpdateCtrl
};
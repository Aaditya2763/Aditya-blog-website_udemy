const expressAsyncHandler = require("express-async-handler");
const Post = require("../../model/post/Post");
const User = require("../../model/user/User");
const Filter = require("bad-words");
const fs = require("fs");
const validateMongoDBId = require("../../utils/validateMongodbId");
const cloudnaryUploadImg = require("../../utils/cloudnary");
const { post } = require("../../routes/posts/postRoutes");

// ---------------------------------------------------------------------
// ----------------create post ctrl------------------------------------
// ---------------------------------------------------------------------

const createPostCtrl = expressAsyncHandler(
  async (req, res) => {
    const { id } = req.user;
    console.log(req.user);
    validateMongoDBId(id);
    const { title, description } = req.body;

    // Check for bad words
    const filter = new Filter();
    const isProfaneTitle = filter.isProfane(title);
    const isProfanedesc = filter.isProfane(description);

    // Block user if profane words are detected
    if (isProfaneTitle || isProfanedesc) {
      await User.findByIdAndUpdate(id, {
        isBlocked: true,
      });
      return res.status(400).json({
        message:
          "Creating failed because it contains profane words,please remove or change therse words and try again.",
      });
    }

    //   getting the path  where the  img is currently stored
    const localPath = `public/images/post/${req.file.filename}`;
    //storing  the img to the cloud
    const imgUploaded = await cloudnaryUploadImg(localPath);
    try {
      const post = await Post.create(
        {
          ...req.body,

          postImage: imgUploaded?.url,
          user: id,
        },
        {
          new: true,
        }
      );
      // removing imgae file  from public folder
      fs.unlinkSync(localPath);
      res.status(201).json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error while creating a post" });
    }
  },
  { now: true }
);

// ---------------------------------------------------------------------
// ----------------Fetch all post ------------------------------------
// ---------------------------------------------------------------------
const fetchAllPosts = expressAsyncHandler(async (req, res) => {
  try {
    // Fetching all posts and populating the "user" field
    const posts = await Post.find({}).populate("user");

    if (posts.length === 0) {
      // Handle the case when there are no posts found
      res.status(404).json({ message: "No posts found." });
    } else {
      // Send a JSON response with the fetched posts
      res.status(200).json(posts);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error. Unable to fetch posts." });
  }
});

// ---------------------------------------------------------------------
// ----------------Fetch all post ------------------------------------
// ---------------------------------------------------------------------
const fetchParticularPost = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Validate the ID
    validateMongoDBId(id);

    // Fetch the post by its ID and populate the "user" field
    const post = await Post.findById(id).select("-password").populate("user");

    if (!post) {
      // If the post is not found, return a 404 Not Found status
      return res.status(404).json({ message: "Post not found" });
    }

    // Increment the "numViews" field of the post
    await Post.findByIdAndUpdate(id, { $inc: { numViews: 1 } }, { new: true });

    // Respond with the fetched post and a 200 OK status
    res.status(200).json(post);
  } catch (error) {
    console.error(error);

    if (error.name === "CastError") {
      // If the provided ID is invalid, return a 400 Bad Request status
      res.status(400).json({ message: "Invalid post ID" });
    } else {
      // For other errors, return a 500 Internal Server Error status
      res
        .status(500)
        .json({ message: "Internal server error. Unable to fetch post." });
    }
  }
},{new:true});

// ---------------------------------------------------------------------
// ----------------update post------------------------------------
// ---------------------------------------------------------------------

const updateParticulerPost = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);

  const { title, description } = req.body;
  const filter = new Filter();
  const isProfaneTitle = filter.isProfane(title);
  const isProfanedesc = filter.isProfane(description);

  // Block user if profane words are detected
  if (isProfaneTitle || isProfanedesc) {
    await User.findByIdAndUpdate(id, {
      isBlocked: true,
    });
    return res.status(400).json({
      message:
        "Creating failed because it contains profane words, please remove or change these words and try again.",
    });
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        title: title,
        description: description,
        user:req.user?.id
        // Add other fields you want to update here
      },
      { new: true }
    );

    if (!updatedPost) {
      // If the post is not found, return a 404 Not Found status
      return res.status(404).json({ message: "Post not found" });
    }

    // Send a JSON response with the updated post
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error while updating post" });
  }
});



// ---------------------------------------------------------------------
// ----------------delete post------------------------------------
// ---------------------------------------------------------------------

const deleteParticularPost=expressAsyncHandler(async(req,res)=>{
  const {id}=req.params;
  validateMongoDBId(id)
  try {
    const deletepost=await Post.findByIdAndDelete(id);
    res.status(200).json("post deleted successfully")

  } catch (error) {
    res.status(error.status).json(error)
  }
  res.json("deleted")
})


// -------------------------------------------------------------
// ----------------like post------------------------------------
// -------------------------------------------------------------

const postLikeController=expressAsyncHandler(async(req,res)=>{
try {
    //find the post to be liked
    const {postId}=req.body;
    // validateMongoDBId(postId)
      const post=await Post.findById(postId);
      //find the login user
    const LoginUserId=req?.user?.id;
    //find the user has liked the podt
    const isLiked=post?.isLiked
    // checked the user has disliked the post
    const alreadyDisLiked=post?.disLikes?.find(
      function (userId) {
        return userId?.toString() === LoginUserId?.toString();
      })
      //removing the user fromdisliked array
      if(alreadyDisLiked){
      const post=await Post.findByIdAndUpdate(postId,{
          $pull:{disLikes:LoginUserId},
          isDisliked:false,
        },{now:true})
      }
    
      //toggling if liked the pull the user fro the likes array
      if(isLiked){
        const post=await Post.findByIdAndUpdate(postId,{
          $pull:{likes:LoginUserId},
          isLiked:false,
        })
        res.status(200).json({message:"disliked the post successfully",post})
      }
      else{
        //adding user to  the  likes array
        const post=await Post.findByIdAndUpdate(postId,{
          $push:{likes:LoginUserId},
          isLiked:true,
        })
        res.status(200).json({message:"liked the post successfully",post})
      }
      res.json(post)
} catch (error) {
  res.status(500).json.json({message:"internal server error",error})
}
})



// -------------------------------------------------------------
// ----------------like post------------------------------------
// -------------------------------------------------------------

const postDislikeController=expressAsyncHandler(async(req,res)=>{
 
  try {
      //find the post to be liked
      const {postId}=req.body;
      // validateMongoDBId(postId)
        const post=await Post.findById(postId);
        //find the login user
      const LoginUserId=req?.user?.id;
      //find the user has liked the podt
      const isDisliked=post?.isDisLiked
      // checked the user has disliked the post
      const alreadyLiked=post?.likes?.find(
        function (userId) {
          return userId?.toString() === LoginUserId?.toString();
        })
        //removing the user fromdisliked array
        if(alreadyLiked){
        const post=await Post.findByIdAndUpdate(postId,{
            $pull:{likes:LoginUserId},
            isliked:false,
          },{now:true})
        }
      
        //toggling if liked the pull the user fro the likes array
        if(isDisliked){
          const post=await Post.findByIdAndUpdate(postId,{
            $pull:{disLikes:LoginUserId},
            isDisLiked:false,
          },{new:true})
          res.status(200).json({message:"request successfully",post})
        }
        else{
          //adding user to  the  likes array
          const post=await Post.findByIdAndUpdate(postId,{
            $push:{disLikes:LoginUserId},
            isDisLiked:true,
          },{new:true})
          res.status(200).json({message:"disliked the post successfully",post})
        }
        res.json(post)
  } catch (error) {
    res.status(500).json.json({message:"internal server error",error})
  }
  })


module.exports =
 { createPostCtrl, 
  fetchAllPosts, 
  fetchParticularPost,
  updateParticulerPost,
  deleteParticularPost,
  postLikeController,
  postDislikeController

 };

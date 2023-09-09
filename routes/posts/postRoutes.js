const express = require("express");

const router = express.Router();

const {
  createPostCtrl,
  fetchAllPosts,
  fetchParticularPost,
  updateParticulerPost,
  deleteParticularPost,
  postLikeController,
  postDislikeController,
} = require("../../controllers/post/postController");
const { authMiddleware } = require("../../middleware/auth/authMiddleWare");
const {
  postPhotoResize,
  postPhotoUpload,
} = require("../../middleware/upload/postPhotoUpload");

/*-----------------------Creating post,fetchposts--------------------------------*/

router.route("/post").get(authMiddleware, fetchAllPosts);
router
  .route("/post")
  .post(
    authMiddleware,
    postPhotoUpload.single("postImage"),
    postPhotoResize,
    createPostCtrl
  );
router.route("/post/:id").get(authMiddleware, fetchParticularPost);
router.route("/post/:id").put(authMiddleware, updateParticulerPost);
router.route("/post/like/:id").put(authMiddleware, postLikeController);
router.route("/post/dislike/:id").put(authMiddleware, postDislikeController);
router.route("/post/:id").delete(authMiddleware, deleteParticularPost);

/*------------------------All users--------------------------------*/

module.exports = router;

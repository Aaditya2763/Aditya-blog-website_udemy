const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../middleware/auth/authMiddleWare");
const {
  createCommentsCtrl,
  fetchParticularCommentCtrl,
  fetchCommentsCtrl,
  updateCommentsCtrl,
  deleteParticularCtrl,
} = require("../../controllers/comments/commentsController");

// ------------------------------------------------------------
// ---------------------------comments route-------------------
// -----------------------------------------------------------


router.route("/comments").get(authMiddleware, fetchCommentsCtrl);
router.route("/comments/:id").get(authMiddleware, fetchParticularCommentCtrl);
router.route("/comments").post(authMiddleware, createCommentsCtrl);

router.route("/comments/:id").put(authMiddleware, updateCommentsCtrl);
router.route("/comments/:id").delete(authMiddleware, deleteParticularCtrl);



module.exports = router;

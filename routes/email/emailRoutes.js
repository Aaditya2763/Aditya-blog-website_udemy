const express = require("express");

const router = express.Router();
const {authMiddleware}=require("../../middleware/auth/authMiddleWare")
const {sendEmailMsgCtrl}=require("../../controllers/email/emailController")
router.route("/").post( authMiddleware,sendEmailMsgCtrl);

module.exports = router;

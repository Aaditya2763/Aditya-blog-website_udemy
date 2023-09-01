const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../../model/user/User");
const Key = process.env.JWT_kEY;

const authMiddleware = expressAsyncHandler(async (req, res, next) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    try {
      var token;
      //this will provide an array having 0th index as "Bearer" and 1th index as "token  "
      token = req.headers.authorization.split(" ")[1];
      // console.log(token)
      if (token) {
        // the decoded variable now contain userid after verifying the token because
        //while generating token we are providing id as a parameter
        const decoded = jwt.verify(token, Key);
        //the user variable store all the data of the user fetched by the particular id
        //and it also includes password and we dont want to send the password that is why we rae removing the password form the user variable;
        const user = await User.findById(decoded?.id).select("-pasword");
        req.user = user;
        next();
      } else {
        throw new Error("invalid token");
      }
    } catch (error) {
      throw new Error("Not authorised login again");
    }
  }
});

module.exports = {
  authMiddleware,
};

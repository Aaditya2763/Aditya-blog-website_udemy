const expressAsyncHandler = require("express-async-handler");
const User = require("../../model/user/User");
const { param } = require("../../routes/auth/authRoutes");
const validateMongoDBId = require("../../utils/validateMongodbId");

// const Key=process.env.JWT_kEY;
const authMiddleWare = require("../../middleware/auth/authMiddleWare");


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
  const { Id } = req.params;
  console.log(Id);
  //validating id
  validateMongoDBId(Id);
  try {
    const userdata = await User.find({ _id: Id });
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
  const { Id } = req.params;
  validateMongoDBId(Id);
  try {
    const deletedUser = await User.findByIdAndDelete(Id);
    res.json(deletedUser);
    console.log("user deleted!");
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = {
  getAllUsers,
  deleteUser,
  fetchUser,
};

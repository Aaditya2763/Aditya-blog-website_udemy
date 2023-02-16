const express = require('express');
const router = express.Router();
const {registerUser,
       login,
      }=require('../../controllers/User/authController');

//registering user
router.route('/user/register')
.post(registerUser);

//user login route
router.route('/user/login')
.post(login);



module.exports=router;

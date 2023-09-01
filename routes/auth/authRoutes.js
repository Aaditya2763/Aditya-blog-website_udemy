const express = require('express');
const router = express.Router();

const {registerUser,
       login,
      }=require('../../controllers/auth/authController');

 /*------------------------register routes--------------------------------*/
//registering user
router.route('/register')
.post(registerUser);


/*------------------------login routes--------------------------------*/
//user login route
router.route('/login')
.post(login);
//getting all users
 


module.exports=router;

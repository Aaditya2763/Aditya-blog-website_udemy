const express = require('express');
const router = express.Router();
const {getAllUsers, deleteUser, fetchUser}=require('../../controllers/users/usersController')
const {authMiddleware}=require('../../middleware/auth/authMiddleWare')
router.route('/users')
.get(authMiddleware,getAllUsers);


/*------------------------user routes--------------------------------*/
router.route('/users/:Id')
.get(fetchUser)
.delete(deleteUser)






module.exports=router;
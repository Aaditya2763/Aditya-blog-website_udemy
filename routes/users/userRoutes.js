const express = require('express');
const router = express.Router();

const {getAllUsers, deleteUser, fetchUser}=require('../../controllers/users/usersController')

router.route('/users')
.get(getAllUsers);

router.route('/users/:Id')
.get(fetchUser)
.delete(deleteUser)






module.exports=router;
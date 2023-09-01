const express = require('express');
const router = express.Router();
const {getAllUsers, 
    deleteUser,
     fetchUser,
    userProfile,
     updateProfile,
     updatePassword,
     unfollowUserCtrl,
     blockUserCtrl,
     unblockUserCtrl,
followingUserCtrl}=require('../../controllers/users/usersController')
const {authMiddleware}=require('../../middleware/auth/authMiddleWare')

/*------------------------All users--------------------------------*/
router.route('/')
.get(authMiddleware,getAllUsers);


/*------------------------user routes--------------------------------*/
router.route('/:id')
.get(fetchUser) 
.delete(deleteUser)

/*-----------------UserProfile----------*/
router.route('/profile/:id')
.get(authMiddleware,userProfile)
router.route('/profile')
.put(authMiddleware,updateProfile)


/*----------------- change Userpassword----------*/
router.route('/password')
.put(authMiddleware,updatePassword)

module.exports=router;

/*-----------------followingUsers----------*/
router.route('/follow')
.put(authMiddleware,followingUserCtrl)


/*-----------------unfollowingUsers----------*/
router.route('/unfollow')
.put(authMiddleware,unfollowUserCtrl)

/*-----------------BlockUser----------*/
router.route('/block-user/:id')
.put(authMiddleware,blockUserCtrl)

/*-----------------unBlockUser----------*/
router.route('/unblock-user/:id')
.put(authMiddleware,blockUserCtrl)
const express = require('express');

const auth = require('../middlewares/auth');
const { 
  getUsers, 
  getUserById, 
  signUp, 
  updateUser, 
  logIn, 
  updateUserName, 
  resetPassword, 
  sendResetLink,
  resetPasswordFromLink,
  updateAvatar,
} = require('./../controllers/users');

const router = express.Router();

router.get('/', getUsers);
router.post('/', signUp);
router.post('/login', logIn);
router.get('/:id', getUserById);
router.post('/forgot-password', sendResetLink);
router.put('/reset-password', resetPasswordFromLink);
router.put('/name', auth, updateUserName);
router.put('/avatar', auth, updateAvatar);
router.put('/password', auth, resetPassword);
router.put('/:id', auth, updateUser);

module.exports = router;

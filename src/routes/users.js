const express = require('express');

const auth = require('../middlewares/auth');
const { getUsers, getUserById, signUp, updateUser, logIn, updateUserName } = require('./../controllers/users');

const router = express.Router();

router.get('/', getUsers);
router.post('/', signUp);
router.post('/login', logIn);
router.get('/:id', getUserById);
router.put('/name', auth, updateUserName);
router.put('/:id', auth, updateUser);

module.exports = router;

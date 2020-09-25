const express = require('express');
const auth = require('../middlewares/auth');

const { getUsers, getUserById, addUser, updateUser, authenticateUser } = require('./../controllers/users');

const router = express.Router();

router.get('/', getUsers);
router.post('/', addUser);
router.post('/auth', authenticateUser);
router.get('/:id', getUserById);
router.put('/:id', auth, updateUser);

module.exports = router;
const express = require('express');

const { getUsers, getUserById, addUser, updateUser } = require('./../controllers/users');

const router = express.Router();

router.get('/', getUsers);
router.post('/', addUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);

module.exports = router;
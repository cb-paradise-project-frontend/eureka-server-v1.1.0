const express = require('express');

const auth = require('./../middlewares/auth');
const { verifyUser } = require('./../controllers/auth');

const router = express.Router();

router.get('/', auth, verifyUser);

module.exports = router;

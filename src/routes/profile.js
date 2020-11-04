const express = require('express');
const auth = require('../middlewares/auth');

const {
  saveProfile,
  getAllProfile,
  getProfileByUserId,
  getAvatarByUserId,
} = require('./../controllers/profile');

const router = express.Router();

router.get('/all', getAllProfile); // for testing only
router.get('/', auth, getProfileByUserId);
router.get('/avatar', auth, getAvatarByUserId);
router.put('/', auth, saveProfile);

module.exports = router;
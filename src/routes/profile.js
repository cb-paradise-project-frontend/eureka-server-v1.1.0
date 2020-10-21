const express = require('express');
const auth = require('../middlewares/auth');

const {
  saveProfile,
  getAllProfile,
  getProfileByUserId,
} = require('./../controllers/profile');

const router = express.Router();

router.get('/all', getAllProfile);
router.get('/', auth, getProfileByUserId);

router.put('/', auth, saveProfile);

module.exports = router;
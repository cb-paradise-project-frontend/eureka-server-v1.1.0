const express = require('express');
const auth = require('../middlewares/auth');

const {
  saveProfile,
  getAllProfile,
  getProfileByUserId,
} = require('./../controllers/profile');

const router = express.Router();

router.get('/', getAllProfile);
router.get('/:id', getProfileByUserId);

router.put('/', auth, saveProfile);

module.exports = router;
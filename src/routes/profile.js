const express = require('express');

const {
  saveProfile,
  getAllProfile,
  getProfileByUserId,
} = require('./../controllers/profile');

const router = express.Router();

router.get('/', getAllProfile);
router.get('/:id', getProfileByUserId);
router.put('/', saveProfile);

module.exports = router;
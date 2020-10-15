const express = require('express');

const {
  addProfile,
  getAllProfile,
  getProfileByUserId,
} = require('./../controllers/profile');

const router = express.Router();

router.get('/', getAllProfile);
router.get('/:id', getProfileByUserId);
router.post('/', addProfile);

module.exports = router;
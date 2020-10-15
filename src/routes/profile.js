const express = require('express');

const {
  addProfile,
  getAllProfile,
} = require('./../controllers/profile');

const router = express.Router();

router.get('/', getAllProfile);
router.post('/', addProfile);

module.exports = router;
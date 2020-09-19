const express = require('express');
const { route } = require('./routes/tasks');

const taskRoute = require('./routes/tasks');
const userRoute = require('./routes/users');

const router = express.Router();

router.use('/tasks', taskRoute);
router.use('/users', userRoute);

module.exports = router;

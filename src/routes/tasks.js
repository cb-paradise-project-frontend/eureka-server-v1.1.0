const express = require('express');
const auth = require('../middlewares/auth');


const {
  getAllTasks,
  getTaskByUserId,
  getTaskById,
  addTask,
  updateTask,
  addComment,
  makeOffer,
  deleteTask
} = require('./../controllers/tasks');

const router = express.Router();

router.get('/', getAllTasks);
router.get('/private', auth , getTaskByUserId);

router.get('/:id', getTaskById); //using for test

router.post('/', auth, addTask);

router.put('/:id', updateTask);
router.put('/comment/:id', auth, addComment);
router.put('/offer/:id', auth, makeOffer);

router.delete('/:id', deleteTask);

module.exports = router;

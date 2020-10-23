const express = require('express');
const auth = require('../middlewares/auth');


const {
  getAllTasks,
  getTaskByUserId,
  getTaskByCategory,
  getTaskById,
  addTask,
  assignTask,
  updateTask,
  completeTask,
  addComment,
  makeOffer,
  deleteTask
} = require('./../controllers/tasks');

const router = express.Router();

router.get('/', getAllTasks);
router.get('/private', auth , getTaskByUserId);
router.get('/category/:category', getTaskByCategory);

router.get('/:id', getTaskById); //using for test

router.post('/', auth, addTask);

router.put('/:id', updateTask);
router.put('/assign/:taskId', auth, assignTask); //patch
router.put('/complete/:taskId', auth, completeTask);
router.put('/comment/:id', auth, addComment);
router.put('/offer/:id', auth, makeOffer);

router.delete('/:id', deleteTask);

module.exports = router;

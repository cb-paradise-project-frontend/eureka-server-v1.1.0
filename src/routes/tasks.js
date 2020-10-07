const express = require('express');

const {
  getAllTasks,
  getTaskById,
  addTask,
  updateTask,
  addComment,
  deleteTask
} = require('./../controllers/tasks');

const router = express.Router();

router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.post('/', addTask);
router.put('/:id', updateTask);
router.put('/comment/:id', addComment);
router.delete('/:id', deleteTask);

module.exports = router;
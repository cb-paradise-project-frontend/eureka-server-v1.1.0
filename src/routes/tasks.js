const express = require('express');
const auth = require('../middlewares/auth');


const {
  getAllTasks,
  getTaskById,
  addTask,
  updateTask,
  addComment,
  makeOffer,
  deleteTask
} = require('./../controllers/tasks');

const router = express.Router();

router.get('/', getAllTasks);
router.get('/:id', getTaskById);

router.post('/', auth, addTask);

router.put('/:id', updateTask);
router.put('/comment/:id', auth, addComment);
router.put('/offer/:id', auth, makeOffer);

router.delete('/:id', deleteTask);

module.exports = router;

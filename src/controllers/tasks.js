const mongoose = require('mongoose');
const Task = require('../models/Task');
const User = require('../models/User');

// title,
// status,
// postedBy,
// location,
// dueDate,
// budget,
// description,

const getAllTasks = async (req, res) => {
  const tasks = await Task.find().exec();
  if (!tasks) {
    return res.status(400).json('Tasks not found');
  }
  return res.json(tasks);
};

const getTaskById = (req, res) => {};

const addTask = async (req, res) => {
  const task = new Task({
    ...req.body 
  });

  await task.save();

  const user = await User.findByIdAndUpdate(
    mongoose.Types.ObjectId(task.postedBy),
    {
      $push: {
        postedTasks: task._id
      }
    }
  ).exec();

  res.json(task);
};

const updateTask = (req, res) => {};
const deleteTask = (req, res) => {};

module.exports = {
  getAllTasks,
  getTaskById,
  addTask,
  updateTask,
  deleteTask,
}
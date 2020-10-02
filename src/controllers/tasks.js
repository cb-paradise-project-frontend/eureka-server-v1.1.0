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

const deleteTask = async (req, res) => {
  const { id } = req.params;
  const taskId = mongoose.Types.ObjectId(id);

  const task = await Task.findByIdAndDelete(taskId).exec();

  if (!task) return res.status(404).json('task not found');

  const user = await User.findByIdAndUpdate(
    task.postedBy,
    {
      $pull: {
        postedTasks: taskId
      }
    }
  ).exec();

  return res.status(200).json('task deleted');
};

module.exports = {
  getAllTasks,
  getTaskById,
  addTask,
  updateTask,
  deleteTask,
}
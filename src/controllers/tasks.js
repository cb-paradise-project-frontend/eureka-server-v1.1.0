const mongoose = require('mongoose');
const Task = require('../models/Task');
const User = require('../models/User');
const HttpError = require('../utils/HttpError');
const { sendResult } = require('../utils/sendResponse');
const toObjectId = require('../utils/toObjectId');

// title,
// status,
// postedBy,
// location,
// dueDate,
// budget,
// description,

const getAllTasks = async (req, res) => {
  const MIN_PAGE_SIZE = 1;
  const DEFAULT_PAGE = 1;

  const { page = DEFAULT_PAGE, pageSize = 20 } = req.query;

  const limit = Math.max(pageSize, MIN_PAGE_SIZE);
  const skip = (Math.max(page, DEFAULT_PAGE) - 1) * limit;
  const sort = { _id: 'asc' };

  const tasks = await Task.find().sort(sort).limit(limit).skip(skip).exec();

  if (!tasks.length) throw new HttpError(404, 'Tasks not found');

  return sendResult(res, tasks);
};


const getTaskById = async (req, res) => {
  const { id } = req.params; 

  const task = await Task.findById(toObjectId(id))
    .populate('postedBy', '_id')
    .populate('offeredBy', '_id')
    .populate('askedBy', '_id')
    .exec();

  console.log(task);

  if (!task) throw new HttpError(404, 'Task not found.');

  return sendResult(res, task);
};


const addTask = async (req, res) => {
  const task = new Task({
    ...req.body 
  });

  const user = await User.findByIdAndUpdate(
    toObjectId(task.postedBy),
    {
      $push: {
        postedTasks: task._id
      }
    }
    ).exec();

  if (!user) throw new HttpError(401, 'User not found.');

  await task.save();

  return sendResult(res, task);
};


const updateTask = (req, res) => {};

const addComment = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  console.log(comment);

  const task = await Task
    .findByIdAndUpdate(toObjectId(id),
      {
        $push: {
          comments: comment
        }
      },
      {
        new: true
      }
    )
    .exec();

  if (!task) throw new HttpError(404, 'Task not found.');

  return sendResult(res, task);
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  const taskId = toObjectId(id);

  const task = await Task.findByIdAndDelete(taskId).exec();

  if (!task) throw new HttpError(404, 'Task not found.');

  await User.findByIdAndUpdate(
    task.postedBy,
    {
      $pull: {
        postedTasks: taskId
      }
    }
  ).exec();

  return sendResult(res, null, 204);
};


module.exports = {
  getAllTasks,
  getTaskById,
  addTask,
  updateTask,
  addComment,
  deleteTask,
}
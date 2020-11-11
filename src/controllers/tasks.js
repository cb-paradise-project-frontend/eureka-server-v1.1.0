const { object } = require('joi');
const Task = require('../models/Task');
const User = require('../models/User');
const HttpError = require('../utils/HttpError');
const { sendResult } = require('../utils/sendResponse');
const toObjectId = require('../utils/toObjectId');

const SELECT_USER_FIELD = 'firstName lastName avatarId email';

const getAllTasks = async (req, res) => {
  const MIN_PAGE_SIZE = 1;
  const DEFAULT_PAGE = 1;

  const { 
    page = DEFAULT_PAGE, 
    pageSize = 20, 
    keyword, 
    maxPrice = 9999,
    minPrice = 5,
    category,
  } = req.query;

  const filter = { $and: [{
    status: 'OPEN',
  }] };

  if (category) {
    filter.$and.push({ category });
  };

  if (keyword) {
    filter.$and.push({
      $or: [
        { title: { $regex: keyword, $options: '$i' } },
        { description: { $regex: keyword, $options: '$i' }},
      ]
    });
  };

  const limit = Math.max(pageSize, MIN_PAGE_SIZE);
  const skip = (Math.max(page, DEFAULT_PAGE) - 1) * limit;
  const sort = { _id: 'asc' };

  const tasks = await Task
    .find(filter)
    .sort(sort)
    .where('budget')
    .gte(minPrice)
    .lte(maxPrice)
    .limit(limit)
    .skip(skip)
    .populate('postedBy', SELECT_USER_FIELD)
    .populate({ 
      path: 'offers',
      populate: {
        path: "offeredBy",
        select: SELECT_USER_FIELD
      }
    })
    .populate({ 
      path: 'comments',
      populate: {
        path: "askedBy",
        select: SELECT_USER_FIELD
      }
    })
    .exec();

  if (!tasks || !tasks.length) throw new HttpError(404, 'Tasks not found');

  return sendResult(res, tasks);
};


const getTaskById = async (req, res) => {
  const { id } = req.params; 

  const task = await Task.findById(toObjectId(id))
    .populate('postedBy')
    .populate({ 
      path: 'offers',
      populate: {
        path: "offeredBy",
        select: SELECT_USER_FIELD
      }
    })
    .populate({ 
      path: 'comments',
      populate: {
        path: "askedBy",
        select: SELECT_USER_FIELD
      }
    })
    .exec();

  if (!task) throw new HttpError(404, 'Task not found.');

  return sendResult(res, task);
};

const getTaskByCategory = async (req, res) => {
  const { category } = req.params; 

  const task = await Task.find({category: category})
    .populate('postedBy')
    .populate({ 
      path: 'offers',
      populate: {
        path: "offeredBy",
        select: SELECT_USER_FIELD
      }
    })
    .populate({ 
      path: 'comments',
      populate: {
        path: "askedBy",
        select: SELECT_USER_FIELD
      }
    })
    .exec();

  if (!task) throw new HttpError(404, 'Task not found.');

  return sendResult(res, task);
}

const getTaskByOwnerId = async (req, res) => {
  const { userId } = req.user; 

  const task = await Task.find({postedBy: toObjectId(userId)})
    .populate({ 
      path: 'offers',
      populate: {
        path: "offeredBy",
        select: SELECT_USER_FIELD
      }
    })
    .populate({ 
      path: 'comments',
      populate: {
        path: "askedBy",
        select: SELECT_USER_FIELD
      }
    })
    .exec();

  if (!task) throw new HttpError(404, 'Task not found.');

  return sendResult(res, task);
};

const getTaskByOffererId = async (req, res) => {
  const { userId } = req.user; 

  const user = await User.findById(userId).exec();

  if (!user) throw new HttpError(404, 'User not found.');

  const { offeredTasks } = user;

  const task = await Task
    .find({
      _id: {
        $in: offeredTasks.map((taskId) => toObjectId(taskId)),
    }})
    .populate({ 
      path: 'offers',
      populate: {
        path: "offeredBy",
        select: SELECT_USER_FIELD
      }
    })
    .populate({ 
      path: 'comments',
      populate: {
        path: "askedBy",
        select: SELECT_USER_FIELD
      }
    })
    .exec();

  if (!task.length) throw new HttpError(404, 'Task not found.');

  return sendResult(res, task);
};

const addTask = async (req, res) => {
  const { userId } = req.user;

  const task = new Task({
    ...req.body,
    postedBy: userId
  });

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $push: {
        postedTasks: task._id
      }
    }
    ).exec();

  if (!user) throw new HttpError(404, 'User not found.');

  await task.save();

  return sendResult(res, task);
};

const completeTask = async (req, res) => {
  const { userId } = req.user;
  const { taskId } = req.params;
  const task = await Task.findById(taskId);

  if (!taskId) throw new HttpError(404, 'Task not found.');
  if (task.postedBy.toString() !== userId) throw new HttpError(406, 'You are not the task owner');

  const updatedTask = await task.updateOne({status: 'COMPLETED'});

  return sendResult(res, updatedTask);
};

const updateTask = async (req, res) => {

};

const assignTask = async (req, res) => {
  const { taskId } = req.params;
  const { userId } = req.user;
  const { assignUserId } = req.body;
  const assignUserIdString = assignUserId.toString()

  const task = await Task.findById(taskId).exec();

  // if (!task) throw new HttpError(404, 'Task not found.');
  // if (task.postedBy.toString() !== userId) throw new HttpError(406, 'You are not the task owner');
  // if (task.status !== 'OPEN' ) throw new HttpError(406, 'Task can not be assigned.');
  // if (task.offers.length === 0) throw new HttpError(406, 'Task has no candidate.');
  // if (task.offers.find((offer) => offer.offeredBy.toString() !==  assignUserIdString)) throw new HttpError(406, 'You are not in waiting list'); //for debug convenience

  const errorList = (!task || task.postedBy.toString() !== userId || task.status !== 'OPEN' || task.offers.length === 0 || task.offers.find((offer) => offer.offeredBy.toString() !==  assignUserIdString));
  if(errorList) throw new HttpError(406, 'unacceptable');

  task.acceptedBy = toObjectId(assignUserId);
  task.status = 'ASSIGNED';

  await User.findByIdAndUpdate(assignUserId, { 
    $push: {
      joinedTasks: taskId
    }
  }, {new: true});

  const updatedTask = await task.save();

  return sendResult(res, updatedTask);
};

const addComment = async (req, res) => {
  const { id: taskId } = req.params;
  const { userId } = req.user;

  const comment = {
    ...req.body,
    askedBy: userId,
  };

  const task = await Task
    .findByIdAndUpdate(
      taskId,
      {
        $push: {
          comments: comment
        }
      }
    )
    .exec();

  if (!task) throw new HttpError(404, 'Task not found.');

  return sendResult(res, task);
};

const makeOffer = async (req, res) => {
  const { id: taskId } = req.params;
  const { userId } = req.user;

  const task = await Task.findById(taskId).exec();

  if (!task) throw new HttpError(404, 'Task not found');

  if (userId === task.postedBy) {
    throw new HttpError(403, 'Cannot make offer to your tasks.')
  };

  const newOffer = {
    ...req.body,
    offeredBy: toObjectId(userId),
  };

  task.offers.push(newOffer);

  await task.save();

  await User
    .findByIdAndUpdate(userId, {
      $push: {
        offeredTasks: taskId
      }
    })
    .exec();

  return sendResult(res, task);
}

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
  getTaskByOwnerId,
  getTaskByOffererId,
  getTaskByCategory,
  addTask,
  assignTask,
  updateTask,
  completeTask,
  addComment,
  makeOffer,
  deleteTask,
}
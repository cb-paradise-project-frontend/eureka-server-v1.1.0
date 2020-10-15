const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  postedTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  }],
  joinedTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  }],
  profile:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: false,
  }
});

const Model = mongoose.model('User', schema);

module.exports = Model;
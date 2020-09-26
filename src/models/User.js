const mongoose = require('mongoose');

const schema = new mongoose.Schema({
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
  }]
});

const Model = mongoose.model('User', schema);

module.exports = Model;
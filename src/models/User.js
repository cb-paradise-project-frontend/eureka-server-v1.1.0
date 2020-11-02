const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: false,
  },
  postedTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  }],
  offeredTasks: [{
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
},
{
  toJSON: {
    getters: true,
    virtuals: true
  },
  timestamps: true,
}
);

schema
  .virtual('fullName')
  .get(function() {
    return `${this.firstName} ${this.lastName}`; 
  });

const Model = mongoose.model('User', schema);

module.exports = Model;
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  location: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  offers: [{
    offeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    message: {
      type: String,
      required: true,
    },
    timestamps: true,
    required: false,
  }],
  comments: [{
    askedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    message: {
      type: String,
      required: true,
    },
    timestamps: true,
    required: false,
  }],
});

const Model = mongoose.model('Task', schema);

module.exports = Model;
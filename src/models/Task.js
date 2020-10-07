const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  acceptedBy :{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  location: {
    type: String,
    required: false,
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
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    required: false,
  },
  {
    timestamps: true
  }
  ],
  comments: [{
    askedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    required: false,
  },
  {
    timestamps: true
  }]
},
{
  toJSON: {
    virtuals: true
  },
  timestamps: true,
});

const Model = mongoose.model('Task', schema);

module.exports = Model;
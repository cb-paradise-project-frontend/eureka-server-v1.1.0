const mongoose = require('mongoose');
const Joi = require('joi');

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    validate: {
      validator: (title) => 
      {
        return !Joi.string().min(10).max(50).validate(title).error
      },
        msg: "Please enter at least 10 characters and a maximum of 50"
    }
  },
  status: {
    type: String, //Open, assigned, expired, completed
    validate: {
      validator: (status) => {
        return !Joi.string().uppercase().valid(...['OPEN', 'ASSIGNED', 'EXPIRED', 'COMPLETED']).validate(status).error
      },
      msg: "Invalid task status"
    },
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
  }, //TODO: 验证
  location: {
    type: String,
    validate: {
      validator: (location) => {
        return !Joi.string().validate(location).error || !Joi.string().lowercase().valid(...['online']).validate(location).error
      }, //TODO: google api
      msg: "Invalid address"
    },
    required: true,
  },
  dueDate: {
    type: Date,
    // validate: {
    //   validator: (dueDate) => {
    //     return !Joi.date().min(Date.now()).max(Date.now()+(1000 * 60 * 60 * 24 * 30)).validate(dueDate).error
    //   },
    //   msg: "DueDate start from today and not greater than 30 days"
    // },
    required: true,
  },
  budget: {
    type: Number,
    validate: {
      validator: (budget) => 
      {
        return !Joi.number().min(5).max(9999).validate(budget).error
      },
        msg: "Please suggest a budget between $ 5 and 9999 for your task"
    },
    required: true,
  },
  description: {
    type: String,
    validate: {
      validator: (desc) => 
      {
        return !Joi.string().min(25).max(1000).validate(desc).error
      },
        msg: "Please enter at least 25 characters and a maximum of 1000"
    },
    required: true,
  },
  //TODO: user table validate(userID)
  offers: [{
    offeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: false,
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

schema
  .virtual('due')
  .get(function() { return this.dueDate; });

const Model = mongoose.model('Task', schema);

module.exports = Model;
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  accountHolder: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: Number,
    required: true,
  },
  bsb: {
    type: Number,
    required: true,
  },
  billingAddress: {
    type: {
      lineOne: {
        type: String,
        required: true,
      },
      lineTwo: {
        type: String,
        required: false,
      },
      suburb: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      postcode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      }
    },
    required: true
  },
  birthday: {
    type: Date,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
});

const Model = mongoose.model('Profile', schema);

module.exports = Model;
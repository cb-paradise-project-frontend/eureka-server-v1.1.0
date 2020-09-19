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
  password: {
    type: String,
    required: true,
  }
});

const Model = mongoose.model('User', schema);

module.exports = Model;
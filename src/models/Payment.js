const mongoose = require('mongoose');
const { model, schema } = require('./User');

const Model = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  payer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  payee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    select: false
  }
});

const Model = mongoose.Schema('Payment', schema);

module.exports = Model;


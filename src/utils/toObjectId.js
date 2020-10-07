const mongoose = require('mongoose');

module.exports = (id) => (mongoose.Types.ObjectId(id));
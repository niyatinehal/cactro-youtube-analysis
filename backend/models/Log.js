const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  message: String,
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);

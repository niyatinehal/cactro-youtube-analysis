const mongoose = require('mongoose');

const eventLogSchema = new mongoose.Schema({
  action: String,
  entityType: {
    type: String,
    enum: ['video', 'comment', 'note'],
    required: true
  },
  entityId: String,
  details: Object,
  userId: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EventLog', eventLogSchema);

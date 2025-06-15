const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
  title: String,
  content: String,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);

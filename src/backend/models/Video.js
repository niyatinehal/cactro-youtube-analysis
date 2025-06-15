const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  thumbnail_url: String,
  published_at: Date,
  view_count: Number,
  like_count: Number,
  comment_count: Number,
  duration: String,
  privacy_status: {
    type: String,
    enum: ['public', 'private', 'unlisted'],
    default: 'private'
  },
  channel_title: String,
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);

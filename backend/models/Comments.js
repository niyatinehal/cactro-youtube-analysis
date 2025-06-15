const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  videoId: { type: String, required: true },
  author_display_name: String,
  author_profile_image_url: String,
  text_display: String,
  published_at: Date,
  like_count: Number,
  can_reply: {
    type: Boolean,
    default: true
  },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);

const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true },
  author_display_name: String,
  author_profile_image_url: String,
  text_display: String,
  published_at: Date,
  like_count: Number,
}, { timestamps: true });

module.exports = mongoose.model('Reply', replySchema);
    
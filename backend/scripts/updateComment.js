const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const Comment = require('../models/Comments');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Replace with the actual Comment _id from your DB
    const commentId = '666b12ccebaaf6bb1c7a6ab3';

    const comment = await Comment.findById(commentId);
    if (!comment) {
      console.log("❌ Comment not found");
      return;
    }

    // ✅ Update fields
    comment.text_display = "Updated comment text!";
    comment.like_count = (comment.like_count || 0) + 1;

    await comment.save();

    console.log("✅ Comment updated:", comment);
  } catch (err) {
    console.error("❌ Error updating comment:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  }
};

run();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const Video = require('../models/Video');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const newVideo = await Video.create({
      videoId: "Vjm2tRaqFlA",
      title: "My Amazing Video Tutorial",
      description: "A tutorial on building modern web apps.",
      thumbnail_url: "https://img.youtube.com/vi/Vjm2tRaqFlA/maxresdefault.jpg",
      published_at: new Date("2024-01-15T10:30:00Z"),
      view_count: 15234,
      like_count: 892,
      comment_count: 47,
      duration: "15:32",
      privacy_status: "unlisted",
      channel_title: "My Developer Channel",
      tags: ["tutorial", "web development", "programming", "react"]
    });

    console.log("✅ Video inserted:", newVideo._id);
  } catch (err) {
    console.error("❌ Error inserting video:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  }
};

run();

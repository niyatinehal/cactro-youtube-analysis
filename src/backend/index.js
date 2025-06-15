const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const youtubeRoutes = require("./routes/youtube");
const notesRoutes = require("./routes/notes");
const logsRoutes = require("./routes/logs");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("YouTube Dashboard API is live.");
});

app.use('/api/youtube', youtubeRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/logs', logsRoutes);


// Connect MongoDB and start server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));

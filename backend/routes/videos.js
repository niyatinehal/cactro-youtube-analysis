const express = require('express');
const router = express.Router();
const { getVideo, updateVideo } = require('../controllers/videoController');

// GET /api/videos/:videoId
router.get('/:videoId', getVideo);

// PUT /api/videos/:videoId
router.put('/:videoId', updateVideo);

module.exports = router;

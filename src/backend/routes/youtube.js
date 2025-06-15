const express = require('express');
const router = express.Router();
const { getVideoDetails } = require('../controllers/youtubeController');

router.get('/video/:videoId/details', getVideoDetails);

module.exports = router;

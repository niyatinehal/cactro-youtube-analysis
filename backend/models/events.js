const express = require('express');
const router = express.Router();
const {
  getEvents,
  logEvent
} = require('../controllers/eventsController');

// GET /api/events?limit=50
router.get('/', getEvents);

// POST /api/events
router.post('/', logEvent);

module.exports = router;

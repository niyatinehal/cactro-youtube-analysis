const EventLog = require('../models/EventLog');

const getEvents = async (req, res) => {
  const limit = parseInt(req.query.limit) || 100;

  try {
    const logs = await EventLog.find().sort({ timestamp: -1 }).limit(limit);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event logs' });
  }
};

const logEvent = async (req, res) => {
  const { action, entityType, entityId, details, userId } = req.body;

  try {
    await EventLog.create({
      action,
      entityType,
      entityId,
      details,
      userId
    });
    res.status(201).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to log event' });
  }
};

module.exports = {
  getEvents,
  logEvent
};

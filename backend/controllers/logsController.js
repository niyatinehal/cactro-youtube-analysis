const Log = require('../models/Log');

const getLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};

const addLog = async (req, res) => {
  const { message } = req.body;
  try {
    const log = await Log.create({ message });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add log' });
  }
};

module.exports = { getLogs, addLog };

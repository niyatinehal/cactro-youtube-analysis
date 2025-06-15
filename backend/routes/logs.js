const express = require('express');
const router = express.Router();
const { getLogs, addLog } = require('../controllers/logsController');

router.get('/', getLogs);
router.post('/', addLog);

module.exports = router;

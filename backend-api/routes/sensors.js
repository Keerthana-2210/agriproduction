const express = require('express');
const router = express.Router();
const { logData, getLatestData } = require('../controllers/sensorController');
const auth = require('../middleware/auth');

router.post('/', auth, logData);
router.get('/', auth, getLatestData);

module.exports = router;

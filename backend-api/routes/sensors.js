const express = require('express');
const router = express.Router();
const { logData, getLatestData, fetchWeather } = require('../controllers/sensorController');
const auth = require('../middleware/auth');

router.post('/', auth, logData);
router.get('/', auth, getLatestData);
router.post('/weather', auth, fetchWeather);

module.exports = router;

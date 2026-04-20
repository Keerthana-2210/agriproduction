const express = require('express');
const router = express.Router();
const { createJob, getAllJobs, applyForJob } = require('../controllers/jobController');
const auth = require('../middleware/auth');

router.post('/', auth, createJob);
router.get('/', getAllJobs);
router.post('/:id/apply', auth, applyForJob);

module.exports = router;

const express = require('express');
const router = express.Router();
const { createJob, getAllJobs, applyForJob, editJob } = require('../controllers/jobController');
const auth = require('../middleware/auth');

router.post('/', auth, createJob);
router.get('/', getAllJobs);
router.post('/:id/apply', auth, applyForJob);
router.put('/:id', auth, editJob);

module.exports = router;

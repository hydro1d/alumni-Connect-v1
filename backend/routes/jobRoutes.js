const express = require('express');
const router = express.Router();
const { createJob, getJobs, getRecentJobs } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/recent', protect, getRecentJobs);

router.route('/')
    .get(protect, getJobs)
    .post(protect, authorize('Alumni', 'Admin'), createJob);

module.exports = router;

const express = require('express');
const router = express.Router();
const { requestMentorship, getRequests, updateRequestStatus } = require('../controllers/mentorshipController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/request', protect, authorize('Student'), requestMentorship);
router.get('/requests', protect, getRequests);
router.put('/request/:id', protect, authorize('Alumni'), updateRequestStatus);

module.exports = router;

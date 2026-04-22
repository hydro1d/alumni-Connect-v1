const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getAlumni, getRecommendations } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/recommendations', protect, getRecommendations);

router.route('/profile')
    .get(protect, getProfile)
    .put(protect, updateProfile);

router.get('/alumni', protect, getAlumni);

module.exports = router;

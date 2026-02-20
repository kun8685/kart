const express = require('express');
const { trackActivity, trackEvent, getAnalyticsStats } = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/track').post(trackActivity);
router.route('/event').post(trackEvent);
router.route('/stats').get(protect, admin, getAnalyticsStats);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
    createCoupon,
    getCoupons,
    validateCoupon,
    deleteCoupon,
    updateCoupon
} = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, admin, createCoupon).get(protect, admin, getCoupons);
router.route('/validate').post(protect, validateCoupon);
router.route('/:id').delete(protect, admin, deleteCoupon).put(protect, admin, updateCoupon);

module.exports = router;

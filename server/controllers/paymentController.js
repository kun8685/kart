const Razorpay = require('razorpay');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/razorpay
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
    const { receipt } = req.body;

    // Find order by ID (receipt is order ID)
    const order = await Order.findById(receipt);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    // Verify ownership or admin
    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        res.status(401);
        throw new Error('Not authorized to pay for this order');
    }

    if (order.isPaid) {
        res.status(400);
        throw new Error('Order is already paid');
    }

    const options = {
        amount: Math.round(order.totalPrice * 100), // Amount in paise
        currency: 'INR',
        receipt: order._id.toString(),
    };

    try {
        const razorpayOrder = await razorpay.orders.create(options);

        // Save razorpayOrderId to order for later verification
        order.razorpayOrderId = razorpayOrder.id;
        await order.save();

        res.json(razorpayOrder);
    } catch (error) {
        res.status(500);
        throw new Error(error);
    }
});

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/razorpay/verify
// @access  Private
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

    const order = await Order.findById(order_id);
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    // Security Check: Verify that the razorpay_order_id matches what we stored
    if (order.razorpayOrderId !== razorpay_order_id) {
        console.error(`Razorpay Order ID mismatch for order ${order._id}. Expected ${order.razorpayOrderId}, got ${razorpay_order_id}`);
        res.status(400);
        throw new Error('Invalid payment request');
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        // Payment verified, update order status
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: razorpay_payment_id,
            status: 'success',
            update_time: Date.now(),
            email_address: req.user.email,
        };

        const updatedOrder = await order.save();
        res.json({ message: 'Payment verified successfully', order: updatedOrder });
    } else {
        res.status(400);
        throw new Error('Invalid signature');
    }
});

// @desc    Get Razorpay Key ID
// @route   GET /api/payment/razorpay/key
// @access  Private
const getRazorpayKey = asyncHandler(async (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID });
});

module.exports = {
    createRazorpayOrder,
    verifyRazorpayPayment,
    getRazorpayKey,
};

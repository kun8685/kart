const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Apply mass discount/sale
// @route   POST /api/products/apply-discount
// @access  Private/Admin
const applyMassDiscount = asyncHandler(async (req, res) => {
    const { type, target, discountPercentage } = req.body;

    // Validation
    if (!discountPercentage || discountPercentage <= 0 || discountPercentage >= 100) {
        return res.status(400).json({ message: 'Valid discount percentage is required (1-99)' });
    }

    let query = {};
    if (type === 'category' && target) {
        query = { category: target };
    } else if (type === 'product' && target) {
        query = { _id: target };
    } else if (type === 'all') {
        // query remains {}
    } else {
        return res.status(400).json({ message: 'Invalid discount configuration' });
    }

    // Find all products matching the query
    const products = await Product.find(query);

    let updatedCount = 0;

    for (let product of products) {
        // If originalPrice is not set, set it to the current price before discounting
        if (!product.originalPrice || product.originalPrice === 0) {
            product.originalPrice = product.price;
        }

        // Calculate new price based on originalPrice
        const discountAmount = (product.originalPrice * discountPercentage) / 100;
        product.price = Math.floor(product.originalPrice - discountAmount);

        await product.save();
        updatedCount++;
    }

    res.json({ message: `Successfully applied ${discountPercentage}% discount to ${updatedCount} products.`, updatedCount });
});

// @desc    Remove mass discount (Revert to original prices)
// @route   POST /api/products/remove-discount
// @access  Private/Admin
const removeMassDiscount = asyncHandler(async (req, res) => {
    const { type, target } = req.body;

    let query = { originalPrice: { $gt: 0 } }; // Only reset products that have an originalPrice set

    if (type === 'category' && target) {
        query.category = target;
    } else if (type === 'product' && target) {
        query._id = target;
    }

    const products = await Product.find(query);
    let revertedCount = 0;

    for (let product of products) {
        if (product.originalPrice > 0) {
            product.price = product.originalPrice;
            // Optionally clear originalPrice or keep it. Let's keep it but make price equal to originalPrice (so 0% discount)
            await product.save();
            revertedCount++;
        }
    }

    res.json({ message: `Successfully reverted prices for ${revertedCount} products.`, revertedCount });
});

module.exports = { applyMassDiscount, removeMassDiscount };

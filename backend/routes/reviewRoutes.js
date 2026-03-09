const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const { protect } = require('../middleware/authMiddleware');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Create a review (product or partner)
// @route   POST /api/reviews
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
    const { product_id, partner_id, rating, text } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        res.status(400);
        throw new Error('Rating must be between 1 and 5');
    }

    // Check for verified purchase
    let verifiedPurchase = false;
    if (product_id) {
        const orderWithProduct = await Order.findOne({
            user: req.user._id,
            'orderItems.product': product_id,
            isPaid: true
        });
        verifiedPurchase = !!orderWithProduct;
    }

    // Check for duplicate review
    const existingReview = await Review.findOne({
        user_id: req.user._id,
        ...(product_id ? { product_id } : { partner_id })
    });

    if (existingReview) {
        res.status(400);
        throw new Error('You have already reviewed this item');
    }

    const review = await Review.create({
        user_id: req.user._id,
        product_id: product_id || null,
        partner_id: partner_id || null,
        rating,
        text: text || '',
        verified_purchase: verifiedPurchase
    });

    // Update product average rating if product review
    if (product_id) {
        const allReviews = await Review.find({ product_id });
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

        await Product.findByIdAndUpdate(product_id, {
            rating_avg: Math.round(avgRating * 10) / 10,
            numReviews: allReviews.length
        });
    }

    res.status(201).json(review);
}));

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
router.get('/product/:productId', asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
        Review.find({ product_id: req.params.productId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user_id', 'name'),
        Review.countDocuments({ product_id: req.params.productId })
    ]);

    res.json({ reviews, page, totalPages: Math.ceil(total / limit), total });
}));

// @desc    Get reviews for a partner
// @route   GET /api/reviews/partner/:partnerId
// @access  Public
router.get('/partner/:partnerId', asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
        Review.find({ partner_id: req.params.partnerId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user_id', 'name'),
        Review.countDocuments({ partner_id: req.params.partnerId })
    ]);

    res.json({ reviews, page, totalPages: Math.ceil(total / limit), total });
}));

// @desc    Delete own review
// @route   DELETE /api/reviews/:id
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
    const review = await Review.findOne({ _id: req.params.id, user_id: req.user._id });

    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }

    const productId = review.product_id;
    await Review.deleteOne({ _id: review._id });

    // Recalculate product rating if product review
    if (productId) {
        const allReviews = await Review.find({ product_id: productId });
        const avgRating = allReviews.length > 0
            ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
            : 0;

        await Product.findByIdAndUpdate(productId, {
            rating_avg: Math.round(avgRating * 10) / 10,
            numReviews: allReviews.length
        });
    }

    res.json({ message: 'Review deleted' });
}));

module.exports = router;

const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const { protect, admin } = require('../middleware/authMiddleware');
const Partner = require('../models/Partner');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const cache = require('../utils/cache');

// @desc    Get partners by pin code and type (with caching)
// @route   GET /api/partners?pin_code=411001&type=pharmacy&verified=true
// @access  Public
router.get('/', cache.middleware(900), asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.pin_code) filter.pin_code = req.query.pin_code;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.verified !== undefined) filter.verified = req.query.verified === 'true';

    const partners = await Partner.find(filter).sort({ rating: -1, createdAt: -1 });
    res.json(partners);
}));

// @desc    Get single partner by ID
// @route   GET /api/partners/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
        res.status(404);
        throw new Error('Partner not found');
    }

    // Get partner reviews
    const reviews = await Review.find({ partner_id: partner._id })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('user_id', 'name');

    res.json({ partner, reviews });
}));

// @desc    Partner applies to join platform
// @route   POST /api/partners/apply
// @access  Private
router.post('/apply', protect, asyncHandler(async (req, res) => {
    const { business_name, type, pin_code, email, phone, address, gst_number, services, description } = req.body;

    if (!business_name || !type || !pin_code) {
        res.status(400);
        throw new Error('Business name, type, and pin code are required');
    }

    const partner = await Partner.create({
        business_name,
        type,
        pin_code,
        email: email || '',
        phone: phone || '',
        address: address || '',
        gst_number: gst_number || '',
        services: services || [],
        description: description || '',
        verified: false
    });

    // Invalidate partner cache for this pin code
    await cache.delPattern(`cache:/api/partners*`);

    res.status(201).json(partner);
}));

// @desc    Partner dashboard — get stats
// @route   GET /api/partners/:id/dashboard
// @access  Private
router.get('/:id/dashboard', protect, asyncHandler(async (req, res) => {
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
        res.status(404);
        throw new Error('Partner not found');
    }

    const [bookingsCount, reviews, recentBookings] = await Promise.all([
        Booking.countDocuments({
            'details.partner_id': partner._id.toString(),
            status: { $in: ['Confirmed', 'Completed'] }
        }),
        Review.find({ partner_id: partner._id }).select('rating'),
        Booking.find({ 'details.partner_id': partner._id.toString() })
            .sort({ createdAt: -1 })
            .limit(10)
    ]);

    const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.json({
        partner,
        stats: {
            totalBookings: bookingsCount,
            totalReviews: reviews.length,
            averageRating: Math.round(avgRating * 10) / 10
        },
        recentBookings
    });
}));

// @desc    Update partner profile
// @route   PUT /api/partners/:id
// @access  Private
router.put('/:id', protect, asyncHandler(async (req, res) => {
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
        res.status(404);
        throw new Error('Partner not found');
    }

    const fields = ['business_name', 'email', 'phone', 'address', 'services', 'description', 'photos', 'working_hours'];
    fields.forEach(field => {
        if (req.body[field] !== undefined) {
            partner[field] = req.body[field];
        }
    });

    const updatedPartner = await partner.save();
    await cache.delPattern(`cache:/api/partners*`);

    res.json(updatedPartner);
}));

module.exports = router;

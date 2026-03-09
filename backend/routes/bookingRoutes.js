const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const { protect } = require('../middleware/authMiddleware');
const Booking = require('../models/Booking');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
    const { type, details, payment_id } = req.body;

    if (!type || !['travel', 'health', 'event'].includes(type)) {
        res.status(400);
        throw new Error('Type must be one of: travel, health, event');
    }

    const booking = await Booking.create({
        user_id: req.user._id,
        type,
        details: details || {},
        payment_id: payment_id || '',
        status: 'Pending'
    });

    res.status(201).json(booking);
}));

// @desc    Get user's bookings
// @route   GET /api/bookings?type=travel&status=Confirmed&page=1
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { user_id: req.user._id };
    if (req.query.type) filter.type = req.query.type;
    if (req.query.status) filter.status = req.query.status;

    const [bookings, total] = await Promise.all([
        Booking.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Booking.countDocuments(filter)
    ]);

    res.json({
        bookings,
        page,
        totalPages: Math.ceil(total / limit),
        total
    });
}));

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
    const booking = await Booking.findOne({ _id: req.params.id, user_id: req.user._id });

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    res.json(booking);
}));

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, asyncHandler(async (req, res) => {
    const booking = await Booking.findOne({ _id: req.params.id, user_id: req.user._id });

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    if (booking.status === 'Cancelled') {
        res.status(400);
        throw new Error('Booking is already cancelled');
    }

    if (booking.status === 'Completed') {
        res.status(400);
        throw new Error('Cannot cancel a completed booking');
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.json(booking);
}));

module.exports = router;

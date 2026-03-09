const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const { protect } = require('../middleware/authMiddleware');
const Notification = require('../models/Notification');

// @desc    Get user's notifications
// @route   GET /api/notifications?read=false&page=1
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { user_id: req.user._id };
    if (req.query.read !== undefined) filter.read = req.query.read === 'true';

    const [notifications, total, unreadCount] = await Promise.all([
        Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Notification.countDocuments(filter),
        Notification.countDocuments({ user_id: req.user._id, read: false })
    ]);

    res.json({
        notifications,
        unreadCount,
        page,
        totalPages: Math.ceil(total / limit),
        total
    });
}));

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', protect, asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({ _id: req.params.id, user_id: req.user._id });

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
}));

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
router.put('/read-all', protect, asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { user_id: req.user._id, read: false },
        { read: true }
    );

    res.json({ message: 'All notifications marked as read' });
}));

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({ _id: req.params.id, user_id: req.user._id });

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    await Notification.deleteOne({ _id: notification._id });
    res.json({ message: 'Notification deleted' });
}));

module.exports = router;

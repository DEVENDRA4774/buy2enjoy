const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const { protect, admin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Booking = require('../models/Booking');
const Partner = require('../models/Partner');
const WalletTransaction = require('../models/WalletTransaction');
const Notification = require('../models/Notification');
const Review = require('../models/Review');

// =============== PHASE 5: ADMIN DASHBOARD ===============

// @desc    Platform overview stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, admin, asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
        totalUsers,
        newUsersToday,
        totalProducts,
        totalOrdersToday,
        totalBookingsToday,
        totalWalletTxToday,
        totalOrders,
        totalRevenue,
        pendingPartners
    ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ createdAt: { $gte: today } }),
        Product.countDocuments(),
        Order.countDocuments({ createdAt: { $gte: today } }),
        Booking.countDocuments({ createdAt: { $gte: today } }),
        WalletTransaction.countDocuments({ createdAt: { $gte: today } }),
        Order.countDocuments(),
        Order.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]),
        Partner.countDocuments({ verified: false })
    ]);

    res.json({
        totalUsers,
        newUsersToday,
        totalProducts,
        totalOrdersToday,
        totalBookingsToday,
        totalWalletTxToday,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingPartners
    });
}));

// @desc    Get DAU (Daily Active Users) — users who logged in today
// @route   GET /api/admin/analytics/dau
// @access  Private/Admin
router.get('/analytics/dau', protect, admin, asyncHandler(async (req, res) => {
    const days = parseInt(req.query.days) || 7;
    const results = [];

    for (let i = 0; i < days; i++) {
        const dayStart = new Date();
        dayStart.setDate(dayStart.getDate() - i);
        dayStart.setHours(0, 0, 0, 0);

        const dayEnd = new Date(dayStart);
        dayEnd.setHours(23, 59, 59, 999);

        const count = await Order.distinct('user', {
            createdAt: { $gte: dayStart, $lte: dayEnd }
        });

        results.push({
            date: dayStart.toISOString().split('T')[0],
            activeUsers: count.length
        });
    }

    res.json(results.reverse());
}));

// @desc    Revenue by category
// @route   GET /api/admin/analytics/revenue
// @access  Private/Admin
router.get('/analytics/revenue', protect, admin, asyncHandler(async (req, res) => {
    const orderRevenue = await Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const walletRevenue = await WalletTransaction.aggregate([
        { $match: { type: 'debit' } },
        {
            $group: {
                _id: '$category',
                total: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        }
    ]);

    res.json({
        orderRevenue: orderRevenue[0]?.total || 0,
        walletRevenueByCategory: walletRevenue
    });
}));

// @desc    User management — list users with search
// @route   GET /api/admin/users?search=john&page=1
// @access  Private/Admin
router.get('/users', protect, admin, asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.search) {
        filter.$or = [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
        ];
    }

    const [users, total] = await Promise.all([
        User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
        User.countDocuments(filter)
    ]);

    res.json({ users, page, totalPages: Math.ceil(total / limit), total });
}));

// @desc    Get specific user's full history (admin view)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
router.get('/users/:id', protect, admin, asyncHandler(async (req, res) => {
    const userId = req.params.id;

    const [user, orders, bookings, walletTx, reviews] = await Promise.all([
        User.findById(userId).select('-password'),
        Order.find({ user: userId }).sort({ createdAt: -1 }).limit(20),
        Booking.find({ user_id: userId }).sort({ createdAt: -1 }).limit(20),
        WalletTransaction.find({ user_id: userId }).sort({ createdAt: -1 }).limit(20),
        Review.find({ user_id: userId }).sort({ createdAt: -1 }).limit(10)
    ]);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.json({ user, orders, bookings, walletTransactions: walletTx, reviews });
}));

// @desc    Suspend/unsuspend user
// @route   PUT /api/admin/users/:id/suspend
// @access  Private/Admin
router.put('/users/:id/suspend', protect, admin, asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.isAdmin = false; // Prevent accidental admin lockout
    const updatedUser = await user.save();

    res.json({ message: 'User updated', user: updatedUser });
}));

// @desc    Partner management — approve/reject partner
// @route   PUT /api/admin/partners/:id/verify
// @access  Private/Admin
router.put('/partners/:id/verify', protect, admin, asyncHandler(async (req, res) => {
    const { verified } = req.body;
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
        res.status(404);
        throw new Error('Partner not found');
    }

    partner.verified = verified;
    if (verified) {
        partner.live_since = new Date();
    }
    await partner.save();

    res.json({ message: verified ? 'Partner verified' : 'Partner rejected', partner });
}));

// @desc    Get all partners for admin management
// @route   GET /api/admin/partners?verified=false
// @access  Private/Admin
router.get('/partners', protect, admin, asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.verified !== undefined) filter.verified = req.query.verified === 'true';

    const partners = await Partner.find(filter).sort({ createdAt: -1 });
    res.json(partners);
}));

// @desc    Order management — get all orders with filters
// @route   GET /api/admin/orders?status=Pending&page=1
// @access  Private/Admin
router.get('/orders', protect, admin, asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [orders, total] = await Promise.all([
        Order.find(filter)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Order.countDocuments(filter)
    ]);

    res.json({ orders, page, totalPages: Math.ceil(total / limit), total });
}));

// @desc    Update order status manually
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
router.put('/orders/:id/status', protect, admin, asyncHandler(async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    order.status = status;
    if (status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    // Send notification to user
    await Notification.create({
        user_id: order.user,
        title: 'Order Status Updated',
        body: `Your order #${order._id} status has been updated to: ${status}`,
        type: 'order_update'
    });

    res.json(updatedOrder);
}));

// @desc    Top selling products
// @route   GET /api/admin/analytics/top-products
// @access  Private/Admin
router.get('/analytics/top-products', protect, admin, asyncHandler(async (req, res) => {
    const topProducts = await Order.aggregate([
        { $match: { isPaid: true } },
        { $unwind: '$orderItems' },
        {
            $group: {
                _id: '$orderItems.product',
                name: { $first: '$orderItems.name' },
                totalSold: { $sum: '$orderItems.qty' },
                totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.qty'] } }
            }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 10 }
    ]);

    res.json(topProducts);
}));

// @desc    Top partners by bookings
// @route   GET /api/admin/analytics/top-partners
// @access  Private/Admin
router.get('/analytics/top-partners', protect, admin, asyncHandler(async (req, res) => {
    const partners = await Partner.find({ verified: true })
        .sort({ rating: -1 })
        .limit(10);

    res.json(partners);
}));

module.exports = router;
